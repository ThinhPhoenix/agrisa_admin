import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: process.env.NEXT_PUBLIC_API_TIMEOUT || 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

import { useAuthStore } from "@/stores/auth-store";

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if this is an auth-related request (login, /me, etc.)
    const isAuthRequest =
      error.config?.url?.includes("/auth/public/login") ||
      error.config?.url?.includes("/auth/public/me");

    // Only redirect if: 401/403 AND not an auth request AND not already on sign-in page
    if (error.response?.status === 401 || error.response?.status === 403) {
      // If it's an auth request (login or /me), don't redirect - let the component handle the error
      if (isAuthRequest) {
        console.log(
          "Auth request failed with 401/403 - letting component handle error"
        );
        return Promise.reject(error);
      }

      // For other 401/403 (e.g., expired token on protected routes)
      console.log(
        `Unauthorized/Forbidden (${error.response?.status})! Clearing user and redirecting to login.`
      );
      const { clearUser } = useAuthStore.getState();
      clearUser();

      // Only redirect if not already on sign-in page
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/sign-in"
      ) {
        window.location.href = "/sign-in";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
