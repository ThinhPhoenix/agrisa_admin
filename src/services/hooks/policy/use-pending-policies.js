import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";

export function usePendingPolicies() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    provider_id: "",
    archive_status: "false",
    validation_status: "",
    product_name: "",
  });

  // Fetch pending policies data
  const fetchPendingPolicies = async (queryParams = {}) => {
    try {
      const params = new URLSearchParams();

      // Thêm params nếu có giá trị
      if (queryParams.provider_id) {
        params.append("provider_id", queryParams.provider_id);
      }
      if (queryParams.archive_status) {
        params.append("archive_status", queryParams.archive_status);
      }
      if (queryParams.base_policy_id) {
        params.append("base_policy_id", queryParams.base_policy_id);
      }

      // Yêu cầu ít nhất 1 param
      if (params.toString() === "") {
        params.append("archive_status", "false");
      }

      const response = await axiosInstance.get(
        `${endpoints.policy.base_policy.get_draft_filter}?${params.toString()}`
      );

      let policiesData = [];
      if (response.data?.success && response.data?.data?.policies) {
        policiesData = response.data.data.policies;
      } else if (Array.isArray(response.data)) {
        policiesData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        policiesData = response.data.data;
      }

      return {
        policies: policiesData,
        count: response.data?.data?.count || policiesData.length,
        meta: response.data?.meta || null,
      };
    } catch (err) {
      console.error("Error fetching pending policies:", err);
      throw err;
    }
  };

  // Fetch data when archive_status or provider_id changes
  const refetchData = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = {};

      if (filters.archive_status) {
        queryParams.archive_status = filters.archive_status;
      }
      if (filters.provider_id) {
        queryParams.provider_id = filters.provider_id;
      }

      const result = await fetchPendingPolicies(queryParams);

      setData(result.policies);
      setLastUpdated(result.meta?.timestamp || new Date().toISOString());
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Error fetching pending policies:", err);
      message.error("Lỗi khi tải dữ liệu policy: " + err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters.archive_status, filters.provider_id]);

  // Fetch data on mount and when filters change
  useEffect(() => {
    refetchData();
  }, [refetchData]);

  // Filter options
  const filterOptions = useMemo(() => {
    const providers = [
      ...new Set(
        data
          .map((item) => item.base_policy?.insurance_provider_id)
          .filter(Boolean)
      ),
    ];
    const validationStatuses = [
      { label: "Chờ duyệt", value: "pending" },
      { label: "Đã duyệt (AI)", value: "passed_ai" },
      { label: "Đã duyệt (Manual)", value: "passed" },
      { label: "Thất bại", value: "failed" },
      { label: "Cảnh báo", value: "warning" },
    ];
    const archiveStatuses = [
      { label: "Đang hoạt động", value: "false" },
      { label: "Đã lưu trữ", value: "true" },
    ];

    return {
      providers: providers.map((provider) => ({
        label: provider,
        value: provider,
      })),
      validationStatuses,
      archiveStatuses,
    };
  }, [data]);

  // Filtered data
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.filter((item) => {
      const basePolicy = item.base_policy || {};
      const matchesProvider =
        !filters.provider_id ||
        basePolicy.insurance_provider_id === filters.provider_id;
      const matchesValidationStatus =
        !filters.validation_status ||
        basePolicy.document_validation_status === filters.validation_status;
      const matchesProductName =
        !filters.product_name ||
        basePolicy.product_name
          ?.toLowerCase()
          .includes(filters.product_name.toLowerCase()) ||
        basePolicy.product_code
          ?.toLowerCase()
          .includes(filters.product_name.toLowerCase());
      return matchesProvider && matchesValidationStatus && matchesProductName;
    });
  }, [data, filters]);

  // Summary stats
  const summaryStats = useMemo(() => {
    if (!Array.isArray(data)) {
      return {
        totalPolicies: 0,
        pendingValidation: 0,
        passedValidation: 0,
        failedValidation: 0,
      };
    }

    const totalPolicies = data.length;
    const pendingValidation = data.filter(
      (item) => item.base_policy?.document_validation_status === "pending"
    ).length;
    const passedValidation = data.filter((item) =>
      ["passed", "passed_ai"].includes(
        item.base_policy?.document_validation_status
      )
    ).length;
    const failedValidation = data.filter(
      (item) => item.base_policy?.document_validation_status === "failed"
    ).length;

    return {
      totalPolicies,
      pendingValidation,
      passedValidation,
      failedValidation,
    };
  }, [data]);

  // Update filters (for client-side filters like product_name, validation_status)
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Apply API filters (archive_status, provider_id) - triggers refetch
  const applyApiFilters = (apiFilters) => {
    setFilters((prev) => ({ ...prev, ...apiFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      provider_id: "",
      archive_status: "false",
      validation_status: "",
      product_name: "",
    });
  };

  // Get single policy detail
  const getPolicyDetail = useCallback(async (policyId) => {
    try {
      const result = await fetchPendingPolicies({
        base_policy_id: policyId,
        archive_status: "false",
      });

      if (result.policies && result.policies.length > 0) {
        return result.policies[0];
      }
      throw new Error("Policy not found");
    } catch (err) {
      console.error("Error fetching policy detail:", err);
      message.error(
        "Lỗi khi tải chi tiết policy: " +
          (err.response?.data?.message || err.message)
      );
      throw err;
    }
  }, []);

  // Submit validation
  const submitValidation = async (validationData) => {
    try {
      const response = await axiosInstance.post(
        endpoints.policy.base_policy.validate,
        validationData
      );
      message.success("Validation đã được gửi thành công");

      // Refetch data to update the list
      const result = await fetchPendingPolicies({
        archive_status: filters.archive_status,
      });
      setData(result.policies);

      return response.data;
    } catch (err) {
      console.error("Error submitting validation:", err);

      // Parse error message for better user experience
      let errorMessage = "Lỗi khi gửi validation";
      const backendError =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message;

      if (backendError) {
        // Check for duplicate key error
        if (
          backendError.includes("duplicate key") &&
          backendError.includes("product_code")
        ) {
          errorMessage =
            "Lỗi: Mã sản phẩm (product_code) đã tồn tại trong hệ thống. Policy này có thể đã được commit trước đó hoặc trùng với policy khác.";
        }
        // Check for commit failed error
        else if (backendError.includes("commit temp policy data failed")) {
          errorMessage =
            "Lỗi khi commit policy: Policy này có thể đã được lưu vào database hoặc có xung đột dữ liệu. Vui lòng kiểm tra lại hoặc liên hệ admin.";
        }
        // Generic error
        else {
          errorMessage = `Lỗi: ${backendError}`;
        }
      }

      message.error(errorMessage, 8); // Show for 8 seconds
      throw err;
    }
  };

  return {
    data,
    filteredData,
    filterOptions,
    summaryStats,
    filters,
    updateFilters,
    applyApiFilters,
    clearFilters,
    loading,
    error,
    lastUpdated,
    getPolicyDetail,
    submitValidation,
    refetch: refetchData,
  };
}
