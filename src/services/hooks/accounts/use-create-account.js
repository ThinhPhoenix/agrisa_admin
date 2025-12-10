import axiosInstance from "@/libs/axios-instance";
import { parseBackendError } from "@/libs/message/auth-message";
import { message } from "antd";
import { useState } from "react";
import { endpoints } from "../../endpoints";

/**
 * Hook to create a new account using the register API
 * API: POST /auth/public/register
 * Reference: REGISTER_API_VALIDATION.md
 */
export function useCreateAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Create account with registration data
   * @param {object} registerData - Registration data
   * @param {string} registerData.phone - Phone number (required, min 10 chars)
   * @param {string} registerData.email - Email (required, min 5 chars, must contain @)
   * @param {string} registerData.password - Password (required, min 8 chars)
   * @param {string} registerData.national_id - National ID (required, 9 or 12 digits)
   * @param {object} registerData.user_profile - User profile (optional)
   * @param {string} registerData.user_profile.full_name - Full name
   * @param {string} registerData.user_profile.date_of_birth - Date of birth (YYYY-MM-DD)
   * @param {string} registerData.user_profile.gender - Gender (male, female, other)
   * @param {string} registerData.user_profile.address - Address
   * @param {string} roleName - Role name (required, e.g., "admin", "farmer", "user_default")
   * @returns {Promise<object>} Created user data
   */
  const createAccount = async (registerData, roleName = "user_default") => {
    try {
      setLoading(true);
      setError(null);

      // Call register API with role name
      const response = await axiosInstance.post(endpoints.auth.register, {
        ...registerData,
        role: roleName,
      });

      // Extract user data from response
      const userData = response.data.data?.user || response.data.data;
      setData(userData);

      // Show success message
      message.success("Đăng ký tài khoản thành công!");

      return {
        success: true,
        data: userData,
      };
    } catch (err) {
      console.error("Error creating account:", err);

      // Parse backend error using auth-message helper
      const errorMessage = parseBackendError(err, "register");
      setError(errorMessage);

      // Show error message to user with proper type
      const status = err.response?.status;

      if (status === 400) {
        // Bad Request - Validation errors
        message.error({
          content: errorMessage,
          duration: 5, // Show for 5 seconds for validation errors
        });
      } else if (status === 409) {
        // Conflict - User already exists
        message.error({
          content: errorMessage,
          duration: 4,
        });
      } else if (status >= 500) {
        // Server errors
        message.error({
          content: errorMessage,
          duration: 6,
        });
      } else {
        // Other errors
        message.error(errorMessage);
      }

      return {
        success: false,
        error: errorMessage,
        code: err.response?.data?.error?.code || null,
        status: status,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset hook state
   */
  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return {
    createAccount,
    loading,
    error,
    data,
    reset,
  };
}
