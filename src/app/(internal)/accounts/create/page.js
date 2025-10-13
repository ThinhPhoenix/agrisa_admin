"use client";

import { CustomForm } from "@/components/custom-form";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Layout, message, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Title, Text } = Typography;

export default function CreateAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, you would send this data to your API
      console.log("Creating account:", formData);

      message.success("Tạo tài khoản thành công!");
      router.push("/accounts");
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo tài khoản!");
    } finally {
      setLoading(false);
    }
  };

  // Form fields
  const formFields = [
    {
      name: "username",
      label: "Tên đăng nhập",
      type: "input",
      placeholder: "Nhập tên đăng nhập",
      required: true,
      rules: [
        { required: true, message: "Vui lòng nhập tên đăng nhập" },
        { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự" },
        {
          pattern: /^[a-zA-Z0-9_]+$/,
          message: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới",
        },
      ],
    },
    {
      name: "email",
      label: "Email",
      type: "input",
      placeholder: "Nhập địa chỉ email",
      required: true,
      rules: [
        { required: true, message: "Vui lòng nhập email" },
        { type: "email", message: "Email không hợp lệ" },
      ],
    },
    {
      name: "full_name",
      label: "Họ và tên",
      type: "input",
      placeholder: "Nhập họ và tên đầy đủ",
      required: true,
      rules: [
        { required: true, message: "Vui lòng nhập họ và tên" },
        { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự" },
      ],
    },
    {
      name: "role",
      label: "Vai trò",
      type: "combobox",
      placeholder: "Chọn vai trò",
      required: true,
      options: [
        { label: "Super Admin", value: "Super Admin" },
        { label: "Admin", value: "Admin" },
        { label: "Manager", value: "Manager" },
        { label: "Staff", value: "Staff" },
        { label: "Viewer", value: "Viewer" },
      ],
      rules: [{ required: true, message: "Vui lòng chọn vai trò" }],
    },
    {
      name: "password",
      label: "Mật khẩu",
      type: "password",
      placeholder: "Nhập mật khẩu",
      required: true,
      rules: [
        { required: true, message: "Vui lòng nhập mật khẩu" },
        { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
      ],
    },
    {
      name: "confirm_password",
      label: "Xác nhận mật khẩu",
      type: "password",
      placeholder: "Nhập lại mật khẩu",
      required: true,
      rules: [
        { required: true, message: "Vui lòng xác nhận mật khẩu" },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue("password") === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
          },
        }),
      ],
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "combobox",
      placeholder: "Chọn trạng thái",
      required: true,
      options: [
        { label: "Hoạt động", value: "Hoạt động" },
        { label: "Tạm khóa", value: "Tạm khóa" },
        { label: "Khóa", value: "Khóa" },
      ],
      rules: [{ required: true, message: "Vui lòng chọn trạng thái" }],
    },
    {
      name: "cancelButton",
      label: " ",
      type: "button",
      variant: "dashed",
      buttonText: "Hủy",
      onClick: () => router.push("/accounts"),
    },
    {
      name: "submitButton",
      label: " ",
      type: "button",
      variant: "primary",
      buttonText: "Tạo tài khoản",
      startContent: <SaveOutlined />,
      isSubmit: true,
      loading: loading,
    },
  ];

  return (
    <Layout.Content>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <Space align="center" style={{ marginBottom: "16px" }}>
            <Link href="/accounts">
              <Button type="text" icon={<ArrowLeftOutlined />}>
                Quay lại
              </Button>
            </Link>
          </Space>
          <Title level={2} style={{ marginBottom: "8px", color: "#1f2937" }}>
            Tạo tài khoản mới
          </Title>
          <Text style={{ color: "#6b7280" }}>
            Điền thông tin chi tiết để tạo tài khoản quản trị viên mới
          </Text>
        </div>

        {/* Form */}
        <div>
          <CustomForm
            fields={formFields}
            gridColumns="1fr 1fr 1fr"
            gap="16px"
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </Layout.Content>
  );
}
