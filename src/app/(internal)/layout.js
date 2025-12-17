"use client";
import AuthLoading from "@/components/auth-loading";
import CustomHeader from "@/components/custom-header";
import CustomSidebar from "@/components/custom-sidebar";
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
  const isLoading = useAuthStore((s) => s.isLoading);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    // Prevent redirect loop when already on sign-in page
    if (!pathname || pathname.startsWith("/sign-in")) {
      setIsAuthChecking(false);
      return;
    }

    // Don't verify auth if currently loading (e.g., during sign-in attempt)
    // This prevents redirect from interrupting error message display
    // setLoading from useSignIn will control when auth verification runs
    if (isLoading) {
      console.log("Auth check paused: Sign-in in progress");
      return;
    }

    // Prevent multiple simultaneous verification calls
    if (isVerifying.current) return;
    isVerifying.current = true;

    const clearAuthAndRedirect = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("me");
      console.log("Auth validation failed, redirecting to sign-in");
      router.push("/sign-in");
    };

    const verifyAuth = () => {
      // Step 1: Check if token exists
      const storedToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!storedToken) {
        console.log("No token found, redirecting to sign-in");
        clearAuthAndRedirect();
        return;
      }

      // Step 2: Check if /me data exists
      const storedMe = localStorage.getItem("me");
      if (!storedMe) {
        console.log("No profile data found, redirecting to sign-in");
        clearAuthAndRedirect();
        return;
      }

      // Step 3: Parse and validate /me data
      try {
        const profile = JSON.parse(storedMe);

        // Step 4: Strict role validation - must be system_admin
        if (profile.role_id !== "system_admin") {
          console.log("Access denied: role_id is not system_admin");
          clearAuthAndRedirect();
          return;
        }

        // Step 5: All validations passed - restore user data
        const userData = {
          user_id: profile.user_id || null,
          profile_id: profile.profile_id || null,
          roles: [profile.role_id],
          token: storedToken,
          refresh_token: localStorage.getItem("refresh_token") || null,
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
        setIsAuthChecking(false);
        isVerifying.current = false;
      } catch (error) {
        console.warn("Failed to parse stored user data:", error);
        clearAuthAndRedirect();
      }
    };

    verifyAuth();
  }, [pathname, router, isManualLogout, isLoading, setUser]);

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
