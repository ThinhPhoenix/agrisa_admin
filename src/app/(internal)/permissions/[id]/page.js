"use client";

import {
  ArrowLeftOutlined,
  EditOutlined,
  LockOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Descriptions,
  Layout,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import mockData from "../mock.json";
import "../permissions.css";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function PermissionDetailPage() {
  const params = useParams();
  const id = params.id;
  const [permission, setPermission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const foundPermission = mockData.find(
        (item) => item.id.toString() === id
      );
      setPermission(foundPermission);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <Layout.Content className="permissions-content">
        <div className="permissions-loading">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </Layout.Content>
    );
  }

  // Not found
  if (!permission) {
    return (
      <Layout.Content className="permissions-content">
        <div className="permissions-space">
          <div className="permissions-header">
            <Title level={2} className="permissions-title">
              Quyền hạn không tồn tại
            </Title>
            <Text className="permissions-subtitle">
              Không tìm thấy quyền hạn với ID: {id}
            </Text>
          </div>
        </div>
      </Layout.Content>
    );
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Hoạt động":
        return "green";
      case "Tạm khóa":
        return "orange";
      case "Khóa":
        return "red";
      default:
        return "default";
    }
  };

  // Get module color
  const getModuleColor = (module) => {
    const colors = {
      accounts: "blue",
      permissions: "purple",
      reports: "green",
      exports: "orange",
      imports: "cyan",
      system: "red",
    };
    return colors[module] || "default";
  };

  // Get action color
  const getActionColor = (action) => {
    if (action.includes(":")) {
      return "red"; // Scoped actions like read:admin
    }
    const colors = {
      read: "blue",
      write: "green",
      create: "purple",
      update: "orange",
      delete: "red",
      export: "cyan",
      import: "magenta",
    };
    return colors[action] || "default";
  };

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
                Chi tiết Quyền hạn
              </Title>
              <Text className="permissions-subtitle">
                Thông tin chi tiết về quyền hạn #{permission.id}
              </Text>
            </div>
          </div>
        </div>

        {/* Permission Info Card */}
        <Card
          title={
            <Space>
              <SettingOutlined />
              Thông tin Quyền hạn
            </Space>
          }
          extra={
            <Space>
              <Button icon={<EditOutlined />}>Chỉnh sửa</Button>
              <Button icon={<LockOutlined />} danger>
                Khóa
              </Button>
            </Space>
          }
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label="ID">{permission.id}</Descriptions.Item>
            <Descriptions.Item label="Action">
              <Tag color={getActionColor(permission.action)}>
                {permission.action}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>
              {permission.description}
            </Descriptions.Item>
            <Descriptions.Item label="Module">
              <Tag color={getModuleColor(permission.module)}>
                {permission.module}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={getStatusColor(permission.status)}>
                {permission.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(permission.created_at).toLocaleDateString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật cuối">
              {new Date(permission.updated_at).toLocaleDateString("vi-VN")}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </Layout.Content>
  );
}
