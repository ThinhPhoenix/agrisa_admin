import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { dashboardMessage } from "@/libs/message";
import { message } from "antd";
import { useCallback, useEffect, useState } from "react";

// Policy Status Enums (lowercase as per BE)
export const POLICY_STATUS = {
  DRAFT: "draft",
  PENDING_REVIEW: "pending_review",
  PENDING_PAYMENT: "pending_payment",
  PAYOUT: "payout",
  ACTIVE: "active",
  EXPIRED: "expired",
  PENDING_CANCEL: "pending_cancel",
  CANCELLED: "cancelled",
  REJECTED: "rejected",
  DISPUTE: "dispute",
  CANCELLED_PENDING_PAYMENT: "cancelled_pending_payment",
};

// Underwriting Status Enums (lowercase as per BE)
export const UNDERWRITING_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export function useDashboardRevenue() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    status: ["active"], // lowercase as per BE enum
    underwriting_status: ["approved"], // lowercase as per BE enum
  });

  // Fetch revenue overview
  const fetchRevenue = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const requestBody = {
        year: params.year || filters.year,
        month: params.month || filters.month,
        status: params.status || filters.status,
        underwriting_status: params.underwriting_status || filters.underwriting_status,
      };

      const response = await axiosInstance.post(
        endpoints.policy.dashboard.revenue_overview,
        requestBody
      );

      if (response.data?.success && response.data?.data) {
        setData(response.data.data);
        setError(null);
      } else if (response.data?.data) {
        setData(response.data.data);
        setError(null);
      } else {
        throw new Error(dashboardMessage.error.fetchRevenue);
      }
    } catch (err) {
      console.error("Error fetching revenue overview:", err);
      setError(err);
      message.error(dashboardMessage.error.fetchRevenue);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    if (value === null || value === undefined) return "0%";
    return `${value.toFixed(2)}%`;
  };

  // Calculate growth indicators
  const getGrowthIndicator = () => {
    if (!data) return { text: "-", color: "gray", isPositive: null };

    const rate = data.monthly_growth_rate || 0;
    if (rate > 0) {
      return { text: `+${formatPercentage(rate)}`, color: "green", isPositive: true };
    } else if (rate < 0) {
      return { text: formatPercentage(rate), color: "red", isPositive: false };
    } else {
      return { text: "0%", color: "gray", isPositive: null };
    }
  };

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchRevenue,
    formatCurrency,
    formatPercentage,
    getGrowthIndicator,
  };
}
