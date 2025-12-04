import axiosInstance from "@/libs/axios-instance";
import { claimMessage } from "@/libs/message";
import { endpoints } from "@/services/endpoints";
import { message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useClaims() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    policy_id: "",
    farm_id: "",
  });

  // Fetch claims with filters
  const fetchClaims = async (queryParams = {}) => {
    try {
      const params = new URLSearchParams();

      // Add params if they have values
      Object.keys(queryParams).forEach((key) => {
        if (
          queryParams[key] !== "" &&
          queryParams[key] !== null &&
          queryParams[key] !== undefined
        ) {
          params.append(key, queryParams[key]);
        }
      });

      const endpoint = params.toString()
        ? `${endpoints.policy.claim.list}?${params.toString()}`
        : endpoints.policy.claim.list;

      const response = await axiosInstance.get(endpoint);

      let claimsData = [];
      let totalCount = 0;

      if (response.data?.success && response.data?.data?.claims) {
        claimsData = response.data.data.claims;
        totalCount = response.data.data.count || claimsData.length;
      } else if (Array.isArray(response.data)) {
        claimsData = response.data;
        totalCount = claimsData.length;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        claimsData = response.data.data;
        totalCount = claimsData.length;
      }

      return {
        claims: claimsData,
        count: totalCount,
        meta: response.data?.meta || null,
      };
    } catch (err) {
      console.error("Error fetching claims:", err);
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
        if (
          filters[key] !== "" &&
          filters[key] !== null &&
          filters[key] !== undefined
        ) {
          queryParams[key] = filters[key];
        }
      });

      const result = await fetchClaims(queryParams);

      setData(result.claims);
      setLastUpdated(result.meta?.timestamp || new Date().toISOString());
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Error fetching claims:", err);
      message.error(claimMessage.error.fetchList);
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
    const statusOptions = [
      { label: "Đã tạo", value: "generated" },
      { label: "Chờ đối tác xét duyệt", value: "pending_partner_review" },
      { label: "Đã phê duyệt", value: "approved" },
      { label: "Bị từ chối", value: "rejected" },
      { label: "Đã thanh toán", value: "paid" },
    ];

    return {
      statusOptions,
    };
  }, []);

  // Summary stats
  const summaryStats = useMemo(() => {
    if (!Array.isArray(data)) {
      return {
        totalClaims: 0,
        byStatus: {},
        totalAmount: 0,
        avgAmount: 0,
      };
    }

    const totalClaims = data.length;
    const byStatus = {};
    let totalAmount = 0;

    data.forEach((claim) => {
      // Count by status
      const status = claim.status || "unknown";
      byStatus[status] = (byStatus[status] || 0) + 1;

      // Sum claim amounts
      totalAmount += claim.claim_amount || 0;
    });

    const avgAmount = totalClaims > 0 ? totalAmount / totalClaims : 0;

    return {
      totalClaims,
      byStatus,
      totalAmount,
      avgAmount,
    };
  }, [data]);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: "",
      policy_id: "",
      farm_id: "",
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
