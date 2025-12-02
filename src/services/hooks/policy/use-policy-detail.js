import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { policyMessage } from "@/libs/message";
import { message } from "antd";
import { useCallback, useEffect, useState } from "react";

export function usePolicyDetail(policyId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monitoringData, setMonitoringData] = useState([]);
  const [loadingMonitoring, setLoadingMonitoring] = useState(false);

  // Fetch policy detail
  const fetchPolicyDetail = useCallback(async () => {
    if (!policyId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        endpoints.policy.registered_policy.detail(policyId)
      );

      if (response.data?.success && response.data?.data) {
        setData(response.data.data);
        setError(null);
      } else if (response.data) {
        setData(response.data);
        setError(null);
      } else {
        throw new Error(policyMessage.error.notFound);
      }
    } catch (err) {
      console.error("Error fetching policy detail:", err);
      setError(err);

      const errorMessage =
        err.response?.status === 404
          ? policyMessage.error.notFound
          : err.response?.status === 401
          ? policyMessage.error.unauthorized
          : policyMessage.error.fetchDetail;

      message.error(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [policyId]);

  // Fetch monitoring data for the farm
  const fetchMonitoringData = useCallback(async (farmId, startTimestamp, endTimestamp) => {
    if (!farmId) return;

    try {
      setLoadingMonitoring(true);
      const params = new URLSearchParams();

      if (startTimestamp) {
        params.append("start_timestamp", startTimestamp);
      }
      if (endTimestamp) {
        params.append("end_timestamp", endTimestamp);
      }

      const endpoint = params.toString()
        ? `${endpoints.policy.registered_policy.monitoring_data_by_farm(farmId)}?${params.toString()}`
        : endpoints.policy.registered_policy.monitoring_data_by_farm(farmId);

      const response = await axiosInstance.get(endpoint);

      if (response.data?.success && response.data?.data?.monitoring_data) {
        setMonitoringData(response.data.data.monitoring_data);
      } else if (Array.isArray(response.data)) {
        setMonitoringData(response.data);
      } else {
        setMonitoringData([]);
      }
    } catch (err) {
      console.error("Error fetching monitoring data:", err);
      message.error(policyMessage.error.fetchMonitoring);
      setMonitoringData([]);
    } finally {
      setLoadingMonitoring(false);
    }
  }, []);

  // Auto-fetch monitoring data when policy detail is loaded
  useEffect(() => {
    if (data?.farm_id) {
      fetchMonitoringData(data.farm_id);
    }
  }, [data?.farm_id, fetchMonitoringData]);

  // Fetch policy detail on mount or when policyId changes
  useEffect(() => {
    fetchPolicyDetail();
  }, [fetchPolicyDetail]);

  // Helper function to format currency
  const formatCurrency = (amount, currency = "VND") => {
    if (!amount) return "0";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Helper function to format date from Unix timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Helper function to format datetime
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to get status label
  const getStatusLabel = (status) => {
    return policyMessage.status[status] || status;
  };

  // Helper function to get underwriting status label
  const getUnderwritingLabel = (status) => {
    return policyMessage.underwritingStatus[status] || status;
  };

  return {
    data,
    loading,
    error,
    monitoringData,
    loadingMonitoring,
    refetch: fetchPolicyDetail,
    fetchMonitoringData,
    // Helper functions
    formatCurrency,
    formatDate,
    formatDateTime,
    getStatusLabel,
    getUnderwritingLabel,
  };
}
