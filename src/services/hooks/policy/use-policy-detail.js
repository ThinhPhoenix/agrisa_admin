import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { policyMessage } from "@/libs/message";
import { message } from "antd";
import { useCallback, useEffect, useState } from "react";

export function usePolicyDetail(policyId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [farmData, setFarmData] = useState(null);
  const [loadingFarm, setLoadingFarm] = useState(false);
  const [basePolicyData, setBasePolicyData] = useState(null);
  const [loadingBasePolicy, setLoadingBasePolicy] = useState(false);
  const [monitoringData, setMonitoringData] = useState([]);
  const [loadingMonitoring, setLoadingMonitoring] = useState(false);
  const [dataSourceNames, setDataSourceNames] = useState({});
  const [loadingDataSources, setLoadingDataSources] = useState(false);

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

  // Fetch farm data
  const fetchFarmData = useCallback(async (farmId) => {
    if (!farmId) return;

    try {
      setLoadingFarm(true);
      const response = await axiosInstance.get(
        endpoints.policy.farm.detail(farmId)
      );

      if (response.data?.success && response.data?.data) {
        setFarmData(response.data.data);
      } else if (response.data) {
        setFarmData(response.data);
      } else {
        setFarmData(null);
      }
    } catch (err) {
      console.error("Error fetching farm data:", err);
      setFarmData(null);
    } finally {
      setLoadingFarm(false);
    }
  }, []);

  // Fetch base policy data
  const fetchBasePolicyData = useCallback(async (basePolicyId, providerId) => {
    if (!basePolicyId || !providerId) return;

    try {
      setLoadingBasePolicy(true);
      const params = new URLSearchParams({
        id: basePolicyId,
        provider_id: providerId,
        include_pdf: "true",
      });

      const response = await axiosInstance.get(
        `${endpoints.policy.base_policy.detail}?${params.toString()}`
      );

      if (response.data?.success && response.data?.data) {
        setBasePolicyData(response.data.data);
      } else if (response.data) {
        setBasePolicyData(response.data);
      } else {
        setBasePolicyData(null);
      }
    } catch (err) {
      console.error("Error fetching base policy data:", err);
      setBasePolicyData(null);
    } finally {
      setLoadingBasePolicy(false);
    }
  }, []);

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

  // Fetch data source names from triggers
  const fetchDataSourceNames = useCallback(async (triggers) => {
    if (!triggers || triggers.length === 0) return;

    const dataSourceIds = new Set();
    triggers.forEach((trigger) => {
      trigger.conditions?.forEach((condition) => {
        if (condition.data_source_id) {
          dataSourceIds.add(condition.data_source_id);
        }
      });
    });

    if (dataSourceIds.size === 0) return;

    setLoadingDataSources(true);
    const names = {};

    try {
      await Promise.all(
        Array.from(dataSourceIds).map(async (id) => {
          try {
            const response = await axiosInstance.get(
              endpoints.policy.data_tier.data_source.get_one(id)
            );

            let sourceData = response.data;
            if (response.data?.success && response.data?.data) {
              sourceData = response.data.data;
            }

            if (sourceData?.source_name) {
              names[id] = sourceData.source_name;
            } else if (sourceData?.display_name_vi) {
              names[id] = sourceData.display_name_vi;
            } else {
              names[id] = id;
            }
          } catch (err) {
            console.error(`Error fetching data source ${id}:`, err);
            names[id] = id;
          }
        })
      );

      setDataSourceNames(names);
    } finally {
      setLoadingDataSources(false);
    }
  }, []);

  // Auto-fetch farm, base policy and monitoring data when policy detail is loaded
  useEffect(() => {
    if (data?.farm_id) {
      fetchFarmData(data.farm_id);
      fetchMonitoringData(data.farm_id);
    }
    if (data?.base_policy_id && data?.insurance_provider_id) {
      fetchBasePolicyData(data.base_policy_id, data.insurance_provider_id);
    }
  }, [data?.farm_id, data?.base_policy_id, data?.insurance_provider_id, fetchFarmData, fetchMonitoringData, fetchBasePolicyData]);

  // Auto-fetch data source names when base policy data is loaded
  useEffect(() => {
    if (basePolicyData?.triggers) {
      fetchDataSourceNames(basePolicyData.triggers);
    }
  }, [basePolicyData?.triggers, fetchDataSourceNames]);

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
    farmData,
    loadingFarm,
    basePolicyData,
    loadingBasePolicy,
    monitoringData,
    loadingMonitoring,
    dataSourceNames,
    loadingDataSources,
    refetch: fetchPolicyDetail,
    fetchFarmData,
    fetchBasePolicyData,
    fetchMonitoringData,
    // Helper functions
    formatCurrency,
    formatDate,
    formatDateTime,
    getStatusLabel,
    getUnderwritingLabel,
  };
}
