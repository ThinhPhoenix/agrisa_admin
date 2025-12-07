import axiosInstance from "@/libs/axios-instance";
import {
  getRegisterSuccess,
  getRegisterValidation,
  getSignInError,
  getSignInSuccess,
  getSignInValidation,
  parseBackendError,
} from "@/libs/message/auth-message";
import signInRequestSchema from "@/schemas/sign-in-request-schema";
import signUpRequestSchema from "@/schemas/sign-up-request-schema";
import { endpoints } from "@/services/endpoints";
import { useAuthStore } from "@/stores/auth-store";
import { message } from "antd";
import { useCallback, useState } from "react";

const handleError = (error, context = "general") => {
  return parseBackendError(error, context);
};

export const useSignIn = () => {
  const [error, setError] = useState(null);
  const {
    setUser,
    setLoading,
    setError: setStoreError,
    isLoading,
  } = useAuthStore();

  const signIn = useCallback(
    async (credentials) => {
      // Validate input
      const validation = signInRequestSchema.safeParse(credentials);
      if (!validation.success) {
        const validationError =
          validation.error.issues[0]?.message ||
          getSignInValidation("IDENTIFIER_REQUIRED");
        setError(validationError);
        // Show Vietnamese validation error to user
        message.error(validationError);
        return { success: false, message: validationError };
      }

      setLoading(true);
      setStoreError(null);
      setError(null);

      try {
        // Step 1: Call login API
        console.log("🚀 Step 1: Calling login API:", endpoints.auth.sign_in);

        const loginResponse = await axiosInstance.post(
          endpoints.auth.sign_in,
          {
            email: validation.data.email,
            password: validation.data.password,
          },
          {
            withCredentials: false,
          }
        );

        if (!loginResponse.data.success) {
          console.error("❌ Login failed:", loginResponse.data.message);
          throw new Error(loginResponse.data.message || "Login failed");
        }

        const accessToken = loginResponse.data.data.access_token;

        // Temporarily save token to make authenticated request
        localStorage.setItem("token", accessToken);

        // Step 2: Call /me API to get profile with role validation
        console.log("🚀 Step 2: Calling /me API:", endpoints.auth.me);

        const meResponse = await axiosInstance.get(endpoints.auth.me);

        if (!meResponse.data.success) {
          // Clear token if /me fails
          localStorage.removeItem("token");
          console.error("❌ /me failed:", meResponse.data.message);
          throw new Error(
            meResponse.data.message || "Failed to get user profile"
          );
        }

        const profile = meResponse.data.data;

        // Step 3: Strict role validation - only system_admin allowed
        console.log("🚀 Step 3: Validating role_id:", profile.role_id);

        if (profile.role_id !== "system_admin") {
          // Clear token immediately
          localStorage.removeItem("token");
          localStorage.removeItem("me");

          const errorMessage =
            "Bạn không có quyền quản trị viên để truy cập hệ thống";
          console.error("❌ Access denied: role_id is not system_admin");
          message.error(errorMessage);

          return { success: false, message: errorMessage };
        }

        // Step 4: All validations passed - build complete user data
        const userData = {
          user_id: profile.user_id || loginResponse.data.data.user.id,
          profile_id: profile.profile_id,
          roles: [profile.role_id],
          token: accessToken,
          refresh_token: null,
          expires_at: loginResponse.data.data.session.expires_at,
          session_id: loginResponse.data.data.session.session_id,
          profile: profile,
          user: {
            id: profile.user_id,
            email: profile.email,
            full_name: profile.full_name,
            display_name: profile.display_name,
            primary_phone: profile.primary_phone,
            partner_id: profile.partner_id,
            role_id: profile.role_id,
          },
        };

        setUser(userData);

        // Show Vietnamese success message to user
        const successMessage = getSignInSuccess("LOGIN_SUCCESS");
        message.success(successMessage);

        return {
          success: true,
          message: successMessage,
          data: userData,
        };
      } catch (error) {
        // Clean up on any error
        localStorage.removeItem("token");
        localStorage.removeItem("me");

        // Log English error for debugging only
        console.error("❌ Sign-in error:", error.message);
        console.error("❌ Error details:", error.response?.data);

        // Parse error to Vietnamese message for user
        const errorMessage = handleError(error, "signin");
        setError(errorMessage);
        setStoreError(errorMessage);

        // Show Vietnamese error message to user
        message.error(errorMessage);

        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setStoreError]
  );

  return { signIn, isLoading, error };
};

export const useSignUp = () => {
  const [error, setError] = useState(null);
  const { setLoading, setError: setStoreError, isLoading } = useAuthStore();

  const signUp = useCallback(
    async (userData) => {
      // Validate input
      const validation = signUpRequestSchema.safeParse(userData);
      if (!validation.success) {
        const validationError =
          validation.error.issues[0]?.message ||
          getRegisterValidation("FULL_NAME_REQUIRED");
        setError(validationError);
        // Show Vietnamese validation error to user
        message.error(validationError);
        return { success: false, message: validationError };
      }

      setLoading(true);
      setStoreError(null);
      setError(null);

      try {
        const response = await axiosInstance.post(
          endpoints.auth.sign_up,
          validation.data
        );

        if (response.data.success) {
          const successMessage = getRegisterSuccess("REGISTER_SUCCESS");
          // Show Vietnamese success message to user
          message.success(successMessage);

          return {
            success: true,
            message: successMessage,
            data: response.data.data,
          };
        } else {
          // Log English error for debugging
          console.error("❌ Registration failed:", response.data.message);
          throw new Error(response.data.message || "Registration failed");
        }
      } catch (error) {
        // Log English error for debugging only
        console.error("❌ Sign-up error:", error.message);
        console.error("❌ Error details:", error.response?.data);

        // Parse error to Vietnamese message for user
        const errorMessage = handleError(error, "register");
        setError(errorMessage);
        setStoreError(errorMessage);

        // Show Vietnamese error message to user
        message.error(errorMessage);

        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setStoreError]
  );

  return { signUp, isLoading, error };
};

export const useAuthMe = () => {
  const [error, setError] = useState(null);
  const {
    setUser,
    setLoading,
    setError: setStoreError,
    isLoading,
    clearUser,
  } = useAuthStore();

  const authMe = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Log for debugging, don't show to user
      console.log("No token found for auth/me");
      const noTokenError = getSignInError("SESSION_EXPIRED");
      setError(noTokenError);
      return { success: false, message: noTokenError };
    }

    setLoading(true);
    setStoreError(null);
    setError(null);

    try {
      const response = await axiosInstance.get(endpoints.auth.me);

      if (response.data.success) {
        const profile = response.data.data;

        // Validate role_id must be system_admin
        if (profile.role_id !== "system_admin") {
          console.error("❌ Access denied: role_id is not system_admin");
          clearUser(true);
          const errorMessage =
            "Bạn không có quyền quản trị viên để truy cập hệ thống";
          setError(errorMessage);
          setStoreError(errorMessage);
          return { success: false, message: errorMessage };
        }

        const userData = {
          user_id: profile.user_id,
          profile_id: profile.profile_id,
          roles: [profile.role_id],
          token: token,
          refresh_token: localStorage.getItem("refresh_token") || null,
          expires_at: null,
          session_id: null,
          profile: profile,
          user: {
            id: profile.user_id,
            email: profile.email,
            full_name: profile.full_name,
            display_name: profile.display_name,
            primary_phone: profile.primary_phone,
            partner_id: profile.partner_id,
            role_id: profile.role_id,
          },
        };

        setUser(userData);
        return {
          success: true,
          message: getSignInSuccess("AUTH_ME_SUCCESS"),
          data: userData,
        };
      } else {
        // Log English error for debugging
        console.error("❌ Auth/me failed:", response.data.message);
        throw new Error(response.data.message || "Auth verification failed");
      }
    } catch (error) {
      // Log English error for debugging only
      console.error("❌ Auth/me error:", error.message);
      console.error("❌ Error details:", error.response?.data);

      // Parse error to Vietnamese message
      const errorMessage = handleError(error, "signin");
      setError(errorMessage);
      setStoreError(errorMessage);

      // Don't show message.error here - let interceptor handle it
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setStoreError, clearUser]);

  return { authMe, isLoading, error };
};

export const useSignOut = () => {
  const { clearUser, setLoading, isLoading } = useAuthStore();

  const signOut = useCallback(async () => {
    setLoading(true);

    try {
      await axiosInstance.post(endpoints.auth.sign_out);
    } catch (error) {
      // Log English error for debugging only, don't show to user
      console.warn("❌ Sign-out API failed:", error.message);
      // Continue anyway - clear local data
    } finally {
      clearUser();
      setLoading(false);
    }

    const successMessage = getSignInSuccess("LOGOUT_SUCCESS");
    // Show Vietnamese success message to user
    message.success(successMessage);

    return {
      success: true,
      message: successMessage,
    };
  }, [clearUser, setLoading]);

  return { signOut, isLoading };
};

export const useAuthValidation = () => {
  const validateSignIn = useCallback((credentials) => {
    const validation = signInRequestSchema.safeParse(credentials);
    if (!validation.success) {
      return {
        success: false,
        message:
          validation.error.issues[0]?.message ||
          getSignInValidation("INVALID_CREDENTIALS"),
        errors: validation.error.issues,
      };
    }
    return { success: true, data: validation.data };
  }, []);

  const validateSignUp = useCallback((userData) => {
    const validation = signUpRequestSchema.safeParse(userData);
    if (!validation.success) {
      return {
        success: false,
        message:
          validation.error.issues[0]?.message ||
          getRegisterValidation("INVALID_DATA"),
        errors: validation.error.issues,
      };
    }
    return { success: true, data: validation.data };
  }, []);

  return { validateSignIn, validateSignUp };
};
