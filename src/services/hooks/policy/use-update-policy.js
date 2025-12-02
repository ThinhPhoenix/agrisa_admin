import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { policyMessage } from "@/libs/message";
import { message } from "antd";
import { useState } from "react";

export function useUpdatePolicy() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update policy status
  const updateStatus = async (policyId, status) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.patch(
        endpoints.policy.registered_policy.update_status(policyId),
        { status }
      );

      if (response.data?.success) {
        message.success(policyMessage.success.updateStatus);
        return response.data.data;
      }

      throw new Error(policyMessage.error.updateStatus);
    } catch (err) {
      console.error("Error updating policy status:", err);
      setError(err);

      const errorMessage =
        err.response?.status === 404
          ? policyMessage.error.notFound
          : err.response?.status === 401
          ? policyMessage.error.unauthorized
          : err.response?.data?.error?.message ||
            policyMessage.error.updateStatus;

      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update underwriting status
  const updateUnderwriting = async (policyId, underwritingStatus) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.patch(
        endpoints.policy.registered_policy.update_underwriting(policyId),
        { underwriting_status: underwritingStatus }
      );

      if (response.data?.success) {
        message.success(policyMessage.success.updateUnderwriting);
        return response.data.data;
      }

      throw new Error(policyMessage.error.updateUnderwriting);
    } catch (err) {
      console.error("Error updating underwriting status:", err);
      setError(err);

      const errorMessage =
        err.response?.status === 404
          ? policyMessage.error.notFound
          : err.response?.status === 401
          ? policyMessage.error.unauthorized
          : err.response?.data?.error?.message ||
            policyMessage.error.updateUnderwriting;

      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateStatus,
    updateUnderwriting,
    loading,
    error,
  };
}
