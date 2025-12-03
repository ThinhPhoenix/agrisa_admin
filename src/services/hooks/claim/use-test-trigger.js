import axiosInstance from "@/libs/axios-instance";
import { claimMessage } from "@/libs/message";
import { endpoints } from "@/services/endpoints";
import { message } from "antd";
import { useState } from "react";

export const useTestTrigger = () => {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  /**
   * Submit test trigger request to backend
   * @param {string} policyId - Policy UUID
   * @param {Array} monitoringData - Array of farm monitoring data
   * @param {boolean} checkPolicy - Whether to evaluate trigger conditions
   */
  const submitTestTrigger = async (
    policyId,
    monitoringData,
    checkPolicy = true
  ) => {
    setLoading(true);
    setTestResult(null);

    try {
      const response = await axiosInstance.post(
        endpoints.policy.claim.test_trigger(policyId),
        {
          monitoring_data: monitoringData,
          check_policy: checkPolicy,
        }
      );

      if (response.data?.success) {
        const result = response.data.data;
        setTestResult(result);

        message.success(claimMessage.testTrigger.testSuccess);
        return { success: true, data: result };
      } else {
        throw new Error(response.data?.message || "Test trigger failed");
      }
    } catch (error) {
      console.error("Test trigger error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        claimMessage.error.serverError;
      message.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset test result state
   */
  const resetTestResult = () => {
    setTestResult(null);
  };

  return {
    loading,
    testResult,
    submitTestTrigger,
    resetTestResult,
  };
};
