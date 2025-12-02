import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { policyMessage } from "@/libs/message";
import { message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";

export function usePolicies() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    policy_number: "",
    farmer_id: "",
    insurance_provider_id: "",
    status: "",
    underwriting_status: "",
    base_policy_id: "",
    farm_id: "",
    include_presigned_url: false,
    url_expiry_hours: 24,
  });

  // Fetch policies with filters
  const fetchPolicies = async (queryParams = {}) => {
    try {
      const params = new URLSearchParams();

      // Add params if they have values
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] !== "" && queryParams[key] !== null && queryParams[key] !== undefined) {
          params.append(key, queryParams[key]);
        }
      });

      const endpoint = params.toString()
        ? `${endpoints.policy.registered_policy.filter}?${params.toString()}`
        : endpoints.policy.registered_policy.list;

      const response = await axiosInstance.get(endpoint);

      let policiesData = [];
      let totalCount = 0;

      if (response.data?.success && response.data?.data?.policies) {
        policiesData = response.data.data.policies;
        totalCount = response.data.data.total_count || response.data.data.count || policiesData.length;
      } else if (Array.isArray(response.data)) {
        policiesData = response.data;
        totalCount = policiesData.length;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        policiesData = response.data.data;
        totalCount = policiesData.length;
      }

      return {
        policies: policiesData,
        count: totalCount,
        meta: response.data?.meta || null,
      };
    } catch (err) {
      console.error("Error fetching policies:", err);
      throw err;
    }
  };

  // Fetch data when filters change
  const refetchData = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = {};

      // Only include filters with values
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== "" && filters[key] !== null && filters[key] !== undefined) {
          queryParams[key] = filters[key];
        }
      });

      const result = await fetchPolicies(queryParams);

      setData(result.policies);
      setLastUpdated(result.meta?.timestamp || new Date().toISOString());
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Error fetching policies:", err);
      message.error(policyMessage.error.fetchList);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch data on mount and when filters change
  useEffect(() => {
    refetchData();
  }, [refetchData]);

  // Filter options
  const filterOptions = useMemo(() => {
    const statusOptions = Object.keys(policyMessage.status).map((key) => ({
      label: policyMessage.status[key],
      value: key,
    }));

    const underwritingOptions = Object.keys(policyMessage.underwritingStatus).map((key) => ({
      label: policyMessage.underwritingStatus[key],
      value: key,
    }));

    const providers = [
      ...new Set(
        data
          .map((item) => item.insurance_provider_id)
          .filter(Boolean)
      ),
    ];

    return {
      statusOptions,
      underwritingOptions,
      providers: providers.map((provider) => ({
        label: provider,
        value: provider,
      })),
    };
  }, [data]);

  // Summary stats
  const summaryStats = useMemo(() => {
    if (!Array.isArray(data)) {
      return {
        totalPolicies: 0,
        byStatus: {},
        byUnderwriting: {},
      };
    }

    const totalPolicies = data.length;
    const byStatus = {};
    const byUnderwriting = {};

    data.forEach((policy) => {
      // Count by status
      const status = policy.status || "unknown";
      byStatus[status] = (byStatus[status] || 0) + 1;

      // Count by underwriting status
      const underwriting = policy.underwriting_status || "unknown";
      byUnderwriting[underwriting] = (byUnderwriting[underwriting] || 0) + 1;
    });

    return {
      totalPolicies,
      byStatus,
      byUnderwriting,
    };
  }, [data]);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      policy_number: "",
      farmer_id: "",
      insurance_provider_id: "",
      status: "",
      underwriting_status: "",
      base_policy_id: "",
      farm_id: "",
      include_presigned_url: false,
      url_expiry_hours: 24,
    });
  };

  return {
    data,
    filterOptions,
    summaryStats,
    filters,
    updateFilters,
    clearFilters,
    loading,
    error,
    lastUpdated,
    refetch: refetchData,
  };
}
