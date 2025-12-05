"use client";
import AuthLoading from "@/components/auth-loading";
import CustomHeader from "@/components/custom-header";
import CustomSidebar from "@/components/custom-sidebar";
import { getSignInError } from "@/libs/message/auth-message";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function InternalLayoutFlexbox({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const isVerifying = useRef(false);
  const hasShownErrorRef = useRef(false);

  const router = useRouter();
  const pathname = usePathname();

  // Subscribe to auth store
  const isManualLogout = useAuthStore((s) => s.isManualLogout);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    // Prevent redirect loop when already on sign-in page
    if (!pathname || pathname.startsWith("/sign-in")) {
      setIsAuthChecking(false);
      return;
    }

    // Prevent multiple simultaneous verification calls
    if (isVerifying.current) return;
    isVerifying.current = true;

    const verifyAuth = () => {
      // Consider token from store OR persisted token in localStorage
      const storedToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      // If no token at all, redirect immediately
      if (!storedToken) {
        // Don't show error message to user - they'll see sign-in page
        // Only log for debugging
        console.log("No token found, redirecting to sign-in");
        router.push("/sign-in");
        return;
      }

      // Have token - load user data from localStorage if available
      try {
        const storedMe = localStorage.getItem("me");
        if (storedMe) {
          const profile = JSON.parse(storedMe);
          const existingToken = localStorage.getItem("token") || null;
          const existingRefresh = localStorage.getItem("refresh_token") || null;

          const userData = {
            user_id: profile.user_id || null,
            profile_id: profile.profile_id || null,
            roles: profile.role_id ? [profile.role_id] : [],
            token: existingToken,
            refresh_token: existingRefresh,
            expires_at: null,
            session_id: null,
            profile,
            user: {
              id: profile.user_id || null,
              email: profile.email || null,
              full_name: profile.full_name || null,
              display_name: profile.display_name || null,
              primary_phone: profile.primary_phone || null,
              partner_id: profile.partner_id || null,
              role_id: profile.role_id || null,
            },
          };

          setUser(userData);
        }
      } catch (error) {
        console.warn("Failed to parse stored user data:", error);
      }

      // Token exists, allow rendering
      // Note: Token validation will happen when API calls are made
      // If token is invalid, axios interceptor will handle logout
      setIsAuthChecking(false);
      isVerifying.current = false;
    };

    verifyAuth();
  }, [pathname, router, isManualLogout, setUser]);

  // Show loading screen while checking authentication to prevent data leakage
  if (isAuthChecking) {
    return <AuthLoading />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <style jsx global>{`
        html,
        body {
          overflow-x: hidden !important;
          margin: 0;
          padding: 0;
        }
      `}</style>

      {/* Sidebar */}
      <div
        className={`flex-shrink-0 transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <CustomSidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 sticky top-0 z-10">
          <CustomHeader />
        </div>

        {/* Content */}
        <main className="flex-1 p-4 overflow-auto bg-white">{children}</main>
      </div>
    </div>
  );
}
