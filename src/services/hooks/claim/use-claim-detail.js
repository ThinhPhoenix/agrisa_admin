import axiosInstance from "@/libs/axios-instance";
import { claimMessage } from "@/libs/message";
import { endpoints } from "@/services/endpoints";
import { message } from "antd";
import { useCallback, useEffect, useState } from "react";

export function useClaimDetail(claimId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch claim detail
  const fetchClaimDetail = useCallback(async () => {
    if (!claimId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        endpoints.policy.claim.detail(claimId)
      );

      if (response.data?.success && response.data?.data) {
        setData(response.data.data);
        setError(null);
      } else if (response.data) {
        setData(response.data);
        setError(null);
      } else {
        throw new Error(claimMessage.error.notFound);
      }
    } catch (err) {
      console.error("Error fetching claim detail:", err);
      setError(err);

      const errorMessage =
        err.response?.status === 404
          ? claimMessage.error.notFound
          : err.response?.status === 401
          ? claimMessage.error.unauthorized
          : claimMessage.error.fetchDetail;

      message.error(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [claimId]);

  // Fetch claim detail on mount or when claimId changes
  useEffect(() => {
    fetchClaimDetail();
  }, [fetchClaimDetail]);

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
    return claimMessage.status[status] || status;
  };

  // Helper function to get partner decision label
  const getPartnerDecisionLabel = (decision) => {
    if (!decision) return "-";
    return claimMessage.partnerDecision[decision] || decision;
  };

  // Helper function to get parameter label
  const getParameterLabel = (parameter) => {
    return claimMessage.parameters[parameter] || parameter;
  };

  // Delete claim function
  const deleteClaim = useCallback(async () => {
    if (!claimId) {
      message.error(claimMessage.error.invalidClaimId);
      return false;
    }

    try {
      const response = await axiosInstance.delete(
        endpoints.policy.claim.delete(claimId)
      );

      if (response.data?.success || response.status === 200) {
        message.success(claimMessage.success.deleteClaim);
        return true;
      } else {
        throw new Error(claimMessage.error.deleteClaimFailed);
      }
    } catch (err) {
      console.error("Error deleting claim:", err);

      const errorMessage =
        err.response?.status === 404
          ? claimMessage.error.notFound
          : err.response?.status === 401
          ? claimMessage.error.unauthorized
          : claimMessage.error.deleteClaim;

      message.error(errorMessage);
      return false;
    }
  }, [claimId]);

  return {
    data,
    loading,
    error,
    refetch: fetchClaimDetail,
    deleteClaim,
    // Helper functions
    formatCurrency,
    formatDate,
    formatDateTime,
    getStatusLabel,
    getPartnerDecisionLabel,
    getParameterLabel,
  };
}
