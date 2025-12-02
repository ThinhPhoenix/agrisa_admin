import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { policyMessage } from "@/libs/message";
import { message } from "antd";
import { useCallback, useEffect, useState } from "react";

export function usePolicyStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch policy statistics
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        endpoints.policy.registered_policy.stats
      );

      if (response.data?.success && response.data?.data) {
        setData(response.data.data);
        setError(null);
      } else if (response.data) {
        setData(response.data);
        setError(null);
      } else {
        throw new Error(policyMessage.error.fetchStats);
      }
    } catch (err) {
      console.error("Error fetching policy stats:", err);
      setError(err);
      message.error(policyMessage.error.fetchStats);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Helper function to format currency
  const formatCurrency = (amount, currency = "VND") => {
    if (!amount) return "0";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return {
    data,
    loading,
    error,
    refetch: fetchStats,
    formatCurrency,
  };
}
