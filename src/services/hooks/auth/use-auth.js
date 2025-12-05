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
        // Log API call for debugging (not shown to user)
        console.log("🚀 Calling API:", endpoints.auth.sign_in);

        const response = await axiosInstance.post(
          endpoints.auth.sign_in,
          {
            email: validation.data.email,
            password: validation.data.password,
          },
          {
            withCredentials: false,
          }
        );

        if (response.data.success) {
          // Map the API response to the expected user data structure
          const userData = {
            user_id: response.data.data.user.id,
            roles: [], // API doesn't return roles, keeping empty for now
            token: response.data.data.access_token,
            refresh_token: null, // API doesn't return refresh_token
            expires_at: response.data.data.session.expires_at,
            session_id: response.data.data.session.session_id,
            user: response.data.data.user,
            session: response.data.data.session,
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
        } else {
          // Log English error for debugging
          console.error("❌ Login failed:", response.data.message);
          throw new Error(response.data.message || "Login failed");
        }
      } catch (error) {
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
      const response = await axiosInstance.get(endpoints.auth.auth_me);

      if (response.data.success) {
        setUser(response.data.data);
        return {
          success: true,
          message: getSignInSuccess("AUTH_ME_SUCCESS"),
          data: response.data.data,
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
  }, [setUser, setLoading, setStoreError]);

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
