"use client";

import { CustomForm } from "@/components/custom-form";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Layout, message, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "../permissions.css";

const { Title, Text } = Typography;

export default function CreatePermissionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, you would send this data to your API
      console.log("Creating permission:", formData);

      message.success("Tạo quyền hạn thành công!");
      router.push("/permissions");
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo quyền hạn!");
    } finally {
      setLoading(false);
    }
  };

  // Form fields - 2 fields per row
  const formFields = [
    {
      name: "description",
      label: "Mô tả",
      type: "textarea",
      placeholder: "Nhập mô tả chi tiết về quyền hạn",
      rules: [{ required: true, message: "Vui lòng nhập mô tả" }],
    },
    {
      name: "action",
      label: "Action",
      type: "input",
      placeholder: "Nhập action (vd: read, create, update:admin)",
      required: true,
      rules: [
        { required: true, message: "Vui lòng nhập action" },
        { min: 2, message: "Action phải có ít nhất 2 ký tự" },
      ],
    },
    {
      name: "module",
      label: "Module",
      type: "combobox",
      placeholder: "Chọn module",
      required: true,
      options: [
        { label: "accounts", value: "accounts" },
        { label: "permissions", value: "permissions" },
        { label: "reports", value: "reports" },
        { label: "exports", value: "exports" },
        { label: "imports", value: "imports" },
        { label: "system", value: "system" },
      ],
      rules: [{ required: true, message: "Vui lòng chọn module" }],
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
  ];

  return (
    <Layout.Content className="permissions-content">
      <div className="permissions-space">
        {/* Header */}
        <div className="permissions-header">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href="/permissions">
              <Button icon={<ArrowLeftOutlined />} type="text">
                Quay lại
              </Button>
            </Link>
            <div>
              <Title level={2} className="permissions-title">
                Tạo Quyền hạn Mới
              </Title>
              <Text className="permissions-subtitle">
                Thêm quyền hạn mới vào hệ thống
              </Text>
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          <CustomForm
            fields={formFields}
            gridColumns="1fr 1fr"
            gap="16px"
            onSubmit={handleFormSubmit}
          />

          {/* Action Buttons */}
          <div style={{ marginTop: "24px", textAlign: "right" }}>
            <Space>
              <Button type="dashed" onClick={() => router.push("/permissions")}>
                Hủy
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={loading}
                onClick={() => {
                  // Trigger form submit
                  const formElement = document.querySelector(
                    ".permissions-create-form form"
                  );
                  if (formElement) {
                    formElement.dispatchEvent(
                      new Event("submit", { cancelable: true, bubbles: true })
                    );
                  }
                }}
              >
                {loading ? "Đang tạo..." : "Tạo quyền hạn"}
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </Layout.Content>
  );
}
