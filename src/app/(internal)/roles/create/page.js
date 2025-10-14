"use client";

import { CustomForm } from "@/components/custom-form";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Layout, message, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "../roles.css";

const { Title, Text } = Typography;

export default function CreateRolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, you would send this data to your API
      console.log("Creating role:", formData);

      message.success("Tạo vai trò thành công!");
      router.push("/roles");
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo vai trò!");
    } finally {
      setLoading(false);
    }
  };

  // Form fields - 2 fields per row
  const formFields = [
    {
      name: "name",
      label: "Tên vai trò",
      type: "input",
      placeholder: "Nhập tên vai trò (vd: Farmer, Premium, Admin)",
      required: true,
      rules: [
        { required: true, message: "Vui lòng nhập tên vai trò" },
        { min: 2, message: "Tên vai trò phải có ít nhất 2 ký tự" },
        { max: 50, message: "Tên vai trò không được vượt quá 50 ký tự" },
      ],
    },
    {
      name: "description",
      label: "Mô tả",
      type: "textarea",
      placeholder: "Nhập mô tả chi tiết về vai trò và quyền hạn",
      rules: [{ required: true, message: "Vui lòng nhập mô tả" }],
    },
    {
      name: "permissions",
      label: "Quyền hạn",
      type: "multiselect",
      placeholder: "Chọn các quyền hạn cho vai trò",
      required: true,
      options: [
        { label: "read:accounts - Xem tài khoản", value: "read:accounts" },
        { label: "create:accounts - Tạo tài khoản", value: "create:accounts" },
        {
          label: "update:accounts - Cập nhật tài khoản",
          value: "update:accounts",
        },
        { label: "delete:accounts - Xóa tài khoản", value: "delete:accounts" },
        {
          label: "read:permissions - Xem quyền hạn",
          value: "read:permissions",
        },
        {
          label: "create:permissions - Tạo quyền hạn",
          value: "create:permissions",
        },
        {
          label: "update:permissions - Cập nhật quyền hạn",
          value: "update:permissions",
        },
        {
          label: "delete:permissions - Xóa quyền hạn",
          value: "delete:permissions",
        },
        { label: "read:roles - Xem vai trò", value: "read:roles" },
        { label: "create:roles - Tạo vai trò", value: "create:roles" },
        { label: "update:roles - Cập nhật vai trò", value: "update:roles" },
        { label: "delete:roles - Xóa vai trò", value: "delete:roles" },
        { label: "read:products - Xem sản phẩm", value: "read:products" },
        { label: "create:products - Tạo sản phẩm", value: "create:products" },
        {
          label: "update:products - Cập nhật sản phẩm",
          value: "update:products",
        },
        { label: "delete:products - Xóa sản phẩm", value: "delete:products" },
        { label: "read:orders - Xem đơn hàng", value: "read:orders" },
        { label: "create:orders - Tạo đơn hàng", value: "create:orders" },
        { label: "update:orders - Cập nhật đơn hàng", value: "update:orders" },
        { label: "delete:orders - Xóa đơn hàng", value: "delete:orders" },
        { label: "read:reports - Xem báo cáo", value: "read:reports" },
        { label: "create:reports - Tạo báo cáo", value: "create:reports" },
        { label: "read:analytics - Xem phân tích", value: "read:analytics" },
        { label: "read:inventory - Xem kho hàng", value: "read:inventory" },
        {
          label: "update:inventory - Cập nhật kho hàng",
          value: "update:inventory",
        },
        { label: "read:quality - Xem chất lượng", value: "read:quality" },
        {
          label: "create:quality - Tạo kiểm tra chất lượng",
          value: "create:quality",
        },
        {
          label: "update:quality - Cập nhật chất lượng",
          value: "update:quality",
        },
        { label: "read:support - Xem hỗ trợ", value: "read:support" },
        {
          label: "create:support - Tạo yêu cầu hỗ trợ",
          value: "create:support",
        },
        { label: "update:support - Cập nhật hỗ trợ", value: "update:support" },
        { label: "read:system - Xem hệ thống", value: "read:system" },
        { label: "update:system - Cập nhật hệ thống", value: "update:system" },
      ],
      rules: [
        { required: true, message: "Vui lòng chọn ít nhất một quyền hạn" },
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
  ];

  return (
    <Layout.Content className="roles-content">
      <div className="roles-space">
        {/* Header */}
        <div className="roles-header">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href="/roles">
              <Button icon={<ArrowLeftOutlined />} type="text">
                Quay lại
              </Button>
            </Link>
            <div>
              <Title level={2} className="roles-title">
                Tạo Vai trò Mới
              </Title>
              <Text className="roles-subtitle">
                Thêm vai trò mới vào hệ thống với các quyền hạn tương ứng
              </Text>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="roles-create-form">
          <CustomForm
            fields={formFields}
            gridColumns="1fr"
            gap="16px"
            onSubmit={handleFormSubmit}
          />

          {/* Action Buttons */}
          <div style={{ marginTop: "24px", textAlign: "right" }}>
            <Space>
              <Button type="dashed" onClick={() => router.push("/roles")}>
                Hủy
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={loading}
                onClick={() => {
                  // Trigger form submit
                  const formElement = document.querySelector(
                    ".roles-create-form form"
                  );
                  if (formElement) {
                    formElement.dispatchEvent(
                      new Event("submit", { cancelable: true, bubbles: true })
                    );
                  }
                }}
              >
                {loading ? "Đang tạo..." : "Tạo vai trò"}
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </Layout.Content>
  );
}
