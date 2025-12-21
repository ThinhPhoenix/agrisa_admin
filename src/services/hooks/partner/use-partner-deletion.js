import axiosInstance from "@/libs/axios-instance";
import { PARTNER_MESSAGES } from "@/libs/message";
import { endpoints } from "@/services/endpoints";
import { useAuthStore } from "@/stores/auth-store";
import { message } from "antd";
import { useCallback, useState } from "react";

/**
 * Hook for managing partner deletion requests
 * Handles fetching, creating, revoking, and admin processing of deletion requests
 */
export function usePartnerDeletion() {
  const [deletionRequests, setDeletionRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Map error response to Vietnamese message
   */
  const mapErrorToMessage = useCallback((error, operation = "fetch") => {
    const status = error.response?.status;
    const errorCode = error.response?.data?.error?.code;
    const serverMessage = error.response?.data?.message;

    // Map specific error codes to messages
    const errorMap = {
      // Common errors
      UNAUTHORIZED: PARTNER_MESSAGES.AUTH.UNAUTHORIZED,
      FORBIDDEN: PARTNER_MESSAGES.AUTH.FORBIDDEN,
      TOKEN_EXPIRED: PARTNER_MESSAGES.AUTH.TOKEN_EXPIRED,
      NOT_FOUND: PARTNER_MESSAGES.DELETION.REQUEST_NOT_FOUND,
      INTERNAL_SERVER_ERROR: PARTNER_MESSAGES.NETWORK.SERVER_ERROR,

      // Deletion-specific errors
      CONFLICT:
        operation === "create"
          ? PARTNER_MESSAGES.DELETION.PENDING_REQUEST_EXISTS
          : operation === "revoke"
          ? PARTNER_MESSAGES.DELETION.ONLY_PENDING_CAN_REVOKE
          : PARTNER_MESSAGES.DELETION.ONLY_PENDING_CAN_PROCESS,
      BAD_REQUEST:
        serverMessage === "RequestID là bắt buộc"
          ? PARTNER_MESSAGES.DELETION.REQUEST_ID_REQUIRED
          : serverMessage === "Invalid status value"
          ? PARTNER_MESSAGES.DELETION.INVALID_STATUS
          : PARTNER_MESSAGES.NETWORK.GENERIC_ERROR,
      UNPROCESSABLE_ENTITY:
        operation === "revoke"
          ? PARTNER_MESSAGES.DELETION.CANNOT_REVOKE_AFTER_DEADLINE
          : PARTNER_MESSAGES.DELETION.CANNOT_PROCESS_BEFORE_DEADLINE,
    };

    // Check Vietnamese messages from server
    if (serverMessage) {
      if (serverMessage.includes("không có quyền hủy yêu cầu này")) {
        return PARTNER_MESSAGES.DELETION.NO_PERMISSION_TO_REVOKE;
      }
      if (serverMessage.includes("đang chờ xử lý mới có thể bị hủy")) {
        return PARTNER_MESSAGES.DELETION.ONLY_PENDING_CAN_REVOKE;
      }
      if (serverMessage.includes("đang chờ xử lý mới có thể được xử lý")) {
        return PARTNER_MESSAGES.DELETION.ONLY_PENDING_CAN_PROCESS;
      }
      if (serverMessage.includes("sau thời gian có thể hủy")) {
        return PARTNER_MESSAGES.DELETION.CANNOT_REVOKE_AFTER_DEADLINE;
      }
      if (serverMessage.includes("trước thời gian có thể hủy")) {
        return PARTNER_MESSAGES.DELETION.CANNOT_PROCESS_BEFORE_DEADLINE;
      }
      if (
        serverMessage.includes(
          "không phải là quản trị viên của đối tác bảo hiểm"
        )
      ) {
        return PARTNER_MESSAGES.DELETION.NOT_PARTNER_ADMIN;
      }
    }

    // Map by error code
    if (errorCode && errorMap[errorCode]) {
      return errorMap[errorCode];
    }

    // Map by HTTP status
    const statusMap = {
      400: PARTNER_MESSAGES.NETWORK.GENERIC_ERROR,
      401: PARTNER_MESSAGES.AUTH.UNAUTHORIZED,
      403: PARTNER_MESSAGES.AUTH.FORBIDDEN,
      404: PARTNER_MESSAGES.DELETION.REQUEST_NOT_FOUND,
      409:
        operation === "create"
          ? PARTNER_MESSAGES.DELETION.PENDING_REQUEST_EXISTS
          : PARTNER_MESSAGES.DELETION.ONLY_PENDING_CAN_PROCESS,
      422:
        operation === "revoke"
          ? PARTNER_MESSAGES.DELETION.CANNOT_REVOKE_AFTER_DEADLINE
          : PARTNER_MESSAGES.DELETION.CANNOT_PROCESS_BEFORE_DEADLINE,
      500: PARTNER_MESSAGES.NETWORK.SERVER_ERROR,
      503: PARTNER_MESSAGES.NETWORK.SERVER_ERROR,
    };

    if (status && statusMap[status]) {
      return statusMap[status];
    }

    // Default error message
    return PARTNER_MESSAGES.NETWORK.GENERIC_ERROR;
  }, []);

  /**
   * Fetch deletion requests for a partner admin
   * @param {string} partnerAdminId - User ID of partner admin
   */
  const fetchDeletionRequests = useCallback(
    async (partnerAdminId, status) => {
      // allow caller to omit partnerAdminId — try to derive from auth/profile
      setLoading(true);
      setError(null);

      try {
        let partnerId = partnerAdminId;

        if (!partnerId) {
          const auth = useAuthStore();
          const fromStore = auth?.user;
          const fromUser = fromStore?.user || {};
          const fromProfile = fromStore?.profile || {};

          partnerId =
            fromUser.partner_id ||
            fromProfile.partner_id ||
            (typeof window !== "undefined" && localStorage.getItem("me")
              ? JSON.parse(localStorage.getItem("me") || "{}")?.partner_id
              : null);
        }

        if (!partnerId) {
          console.warn(
            "Partner ID not available in args or profile; cannot fetch deletion requests"
          );
          setDeletionRequests([]);
          return { success: false, data: [] };
        }

        // Use the admin partners deletion-requests endpoint and optionally include status
        const basePath = `https://agrisa-api.phrimp.io.vn/profile/protected/api/v1/insurance-partners/admin/partners/${partnerId}/deletion-requests`;
        const url = status
          ? `${basePath}?status=${encodeURIComponent(status)}`
          : basePath;

        const response = await axiosInstance.get(url);

        if (response.data?.success && response.data?.data) {
          const requests = Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data];
          setDeletionRequests(requests);
          return { success: true, data: requests };
        }

        setDeletionRequests([]);
        return { success: true, data: [] };
      } catch (err) {
        console.error("Error fetching deletion requests:", err);

        // Handle 404 specifically - no requests found is not an error
        if (err.response?.status === 404) {
          setDeletionRequests([]);
          return { success: true, data: [] };
        }

        const errorMessage = mapErrorToMessage(err, "fetch");
        setError(errorMessage);
        setDeletionRequests([]);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [mapErrorToMessage]
  );

  /**
   * Fetch all deletion requests (for admin)
   * Returns all deletion requests in the system
   */
  const fetchAllDeletionRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        endpoints.partner.deletion.admin_list_all
      );

      if (response.data?.success && response.data?.data) {
        const requests = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];
        setDeletionRequests(requests);
        return { success: true, data: requests };
      }

      setDeletionRequests([]);
      return { success: true, data: [] };
    } catch (err) {
      console.error("Error fetching all deletion requests:", err);

      // Handle 404 specifically - no requests found is not an error
      if (err.response?.status === 404) {
        setDeletionRequests([]);
        return { success: true, data: [] };
      }

      const errorMessage = mapErrorToMessage(err, "fetch");
      setError(errorMessage);
      setDeletionRequests([]);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [mapErrorToMessage]);

  /**
   * Create a new deletion request (for partner admin)
   * @param {Object} data - Request data
   * @param {string} data.detailed_explanation - Reason for deletion
   */
  const createDeletionRequest = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.post(
          endpoints.partner.deletion.create_request,
          {
            detailed_explanation: data.detailed_explanation || "",
          }
        );

        if (response.data?.success) {
          message.success(PARTNER_MESSAGES.DELETION.REQUEST_CREATED);
          return { success: true, data: response.data.data };
        }

        throw new Error("Failed to create deletion request");
      } catch (err) {
        console.error("Error creating deletion request:", err);
        const errorMessage = mapErrorToMessage(err, "create");
        setError(errorMessage);
        message.error(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [mapErrorToMessage]
  );

  /**
   * Revoke a deletion request (for partner admin)
   * @param {string} requestId - Request ID to revoke
   * @param {string} reviewNote - Optional reason for revocation
   */
  const revokeDeletionRequest = useCallback(
    async (requestId, reviewNote = "") => {
      if (!requestId) {
        const errorMessage = PARTNER_MESSAGES.DELETION.REQUEST_ID_REQUIRED;
        message.error(errorMessage);
        return { success: false, message: errorMessage };
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.post(
          endpoints.partner.deletion.revoke_request,
          {
            request_id: requestId,
            review_note: reviewNote,
          }
        );

        if (response.data?.success) {
          message.success(PARTNER_MESSAGES.DELETION.REQUEST_REVOKED);
          return { success: true, data: response.data.data };
        }

        throw new Error("Failed to revoke deletion request");
      } catch (err) {
        console.error("Error revoking deletion request:", err);
        const errorMessage = mapErrorToMessage(err, "revoke");
        setError(errorMessage);
        message.error(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [mapErrorToMessage]
  );

  /**
   * Admin process deletion request (approve or reject)
   * @param {string} requestId - Request ID to process
   * @param {string} status - "approved" or "rejected"
   * @param {string} reviewNote - Admin's review notes
   */
  const adminProcessRequest = useCallback(
    async (requestId, status, reviewNote = "") => {
      if (!requestId) {
        const errorMessage = PARTNER_MESSAGES.DELETION.REQUEST_ID_REQUIRED;
        message.error(errorMessage);
        return { success: false, message: errorMessage };
      }

      if (!["approved", "rejected"].includes(status)) {
        const errorMessage = PARTNER_MESSAGES.DELETION.INVALID_STATUS;
        message.error(errorMessage);
        return { success: false, message: errorMessage };
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.post(
          endpoints.partner.deletion.admin_process,
          {
            request_id: requestId,
            status: status,
            review_note: reviewNote,
          }
        );

        if (response.data?.success) {
          const successMessage =
            status === "approved"
              ? PARTNER_MESSAGES.DELETION.REQUEST_APPROVED
              : PARTNER_MESSAGES.DELETION.REQUEST_REJECTED;
          message.success(successMessage);
          return { success: true, data: response.data.data };
        }

        throw new Error("Failed to process deletion request");
      } catch (err) {
        console.error("Error processing deletion request:", err);
        const errorMessage = mapErrorToMessage(err, "process");
        setError(errorMessage);
        message.error(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [mapErrorToMessage]
  );

  /**
   * Get status label in Vietnamese
   * @param {string} status - Status code
   * @returns {string} Vietnamese label
   */
  const getStatusLabel = useCallback((status) => {
    const statusMap = {
      pending: PARTNER_MESSAGES.DELETION.STATUS_PENDING,
      approved: PARTNER_MESSAGES.DELETION.STATUS_APPROVED,
      rejected: PARTNER_MESSAGES.DELETION.STATUS_REJECTED,
      cancelled: PARTNER_MESSAGES.DELETION.STATUS_CANCELLED,
      completed: PARTNER_MESSAGES.DELETION.STATUS_COMPLETED,
    };
    return statusMap[status] || status;
  }, []);

  /**
   * Get status color for Tag component
   * @param {string} status - Status code
   * @returns {string} Ant Design color
   */
  const getStatusColor = useCallback((status) => {
    const colorMap = {
      pending: "gold",
      approved: "green",
      rejected: "red",
      cancelled: "default",
      completed: "blue",
    };
    return colorMap[status] || "default";
  }, []);

  /**
   * Check if request can be revoked (within 7-day period)
   * @param {Object} request - Deletion request object
   * @returns {boolean}
   */
  const canRevoke = useCallback((request) => {
    if (request.status !== "pending") return false;
    const now = new Date();
    const cancellableUntil = new Date(request.cancellable_until);
    return now <= cancellableUntil;
  }, []);

  /**
   * Check if admin can process request (after 7-day period)
   * @param {Object} request - Deletion request object
   * @returns {boolean}
   */
  const canProcess = useCallback((request) => {
    if (request.status !== "pending") return false;
    const now = new Date();
    const cancellableUntil = new Date(request.cancellable_until);
    return now >= cancellableUntil;
  }, []);

  return {
    // State
    deletionRequests,
    loading,
    error,

    // Actions
    fetchDeletionRequests,
    fetchAllDeletionRequests,
    createDeletionRequest,
    revokeDeletionRequest,
    adminProcessRequest,

    // Utilities
    getStatusLabel,
    getStatusColor,
    canRevoke,
    canProcess,
  };
}
