"use client";
import Assets from "@/assets";
import AuthLoading from "@/components/auth-loading";
import CustomForm from "@/components/custom-form";
import { getSignInValidation } from "@/libs/message/auth-message";
import { useSignIn } from "@/services/hooks/auth/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import { Typography } from "antd";
import { Lock, LogIn, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./signin.css";

const { Title, Text } = Typography;

const SigninPage = () => {
  const { signIn, isLoading } = useSignIn();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Redirect to /dashboard if already authenticated
  // Only check on initial mount, not when user state changes during login error
  useEffect(() => {
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const hasToken = Boolean(user?.token) || Boolean(storedToken);
    const hasRoles = Array.isArray(user?.roles) && user.roles.length > 0;
    const isAuthenticated = hasToken || hasRoles;

    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      // Auth check complete, show sign-in form
      setIsAuthChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Show loading screen while checking authentication to prevent form flashing
  if (isAuthChecking) {
    return <AuthLoading />;
  }

  const onFinish = async (values) => {
    // Show loading while validating token and /me
    const result = await signIn({
      email: values.email,
      password: values.password,
    });

    if (result.success) {
      // Both token and /me validated, role_id is system_admin
      // Success message is already shown by the hook
      // Wait a moment for localStorage to be fully written
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    }
    // Error messages are already shown by the hook in Vietnamese
    // This includes "Bạn không có quyền quản trị viên để truy cập hệ thống"
  };

  const fields = [
    {
      name: "email",
      label: "Email hoặc Số điện thoại",
      type: "input",
      placeholder: "Email hoặc Số điện thoại",
      startContent: <User size={14} />,
      rules: [
        { required: true, message: getSignInValidation("IDENTIFIER_REQUIRED") },
      ],
    },
    {
      name: "password",
      label: "Mật khẩu",
      type: "password",
      startContent: <Lock size={14} />,
      placeholder: "Mật khẩu",
      rules: [
        { required: true, message: getSignInValidation("PASSWORD_REQUIRED") },
      ],
    },
    {
      name: "signin",
      type: "button",
      variant: "primary",
      isSubmit: true,
      endContent: <LogIn size={14} />,
      buttonText: "Đăng nhập",
      loading: isLoading,
    },
  ];

  return (
    <div className="signin-main">
      <div className="signin-form-container">
        <div className="signin-header">
          <img
            src={Assets.Agrisa.src}
            alt="Agrisa Logo"
            className="signin-logo"
          />
          <Title level={3} className="signin-title">
            Cổng thông tin quản trị viên Agrisa
          </Title>
          <Text className="signin-subtitle">
            Đăng nhập để tiếp tục sử dụng dịch vụ
          </Text>
        </div>

        {/* <div className="signin-google-btn-container">
          <Button
            type="default"
            icon={<GoogleOutlined />}
            className="signin-google-btn"
            loading={isLoading}
          >
            Đăng nhập với Google
          </Button>
        </div>

        <Divider className="signin-divider">hoặc đăng nhập với</Divider> */}

        <CustomForm
          fields={fields}
          onSubmit={onFinish}
          gridColumns="1fr"
          formStyle={{
            background: "transparent",
            padding: 0,
            boxShadow: "none",
          }}
        />

        <div className="signin-forgot">
          <Link href="/forgot-password">Quên mật khẩu?</Link>
        </div>

        {/* <div className="signin-signup">
          <div className="signin-signup-text">
            Chưa có tài khoản? <Link href="/sign-up">Đăng ký tại đây</Link>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SigninPage;
