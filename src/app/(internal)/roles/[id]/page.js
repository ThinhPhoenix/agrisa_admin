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
import "../roles.css";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function RoleDetailPage() {
  const params = useParams();
  const id = params.id;
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const foundRole = mockData.find((item) => item.id.toString() === id);
      setRole(foundRole);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <Layout.Content className="roles-content">
        <div className="roles-loading">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </Layout.Content>
    );
  }

  // Not found
  if (!role) {
    return (
      <Layout.Content className="roles-content">
        <div className="roles-space">
          <div className="roles-detail-header">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Link href="/roles">
                <Button icon={<ArrowLeftOutlined />} type="text">
                  Quay lại
                </Button>
              </Link>
              <div>
                <Title level={2} className="roles-detail-title">
                  Không tìm thấy vai trò
                </Title>
                <Text className="roles-detail-subtitle">
                  Vai trò với ID {id} không tồn tại
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Layout.Content>
    );
  }

  // Status configuration
  const getStatusConfig = (status) => {
    const configs = {
      "Hoạt động": {
        color: "success",
        icon: <SettingOutlined />,
        className: "roles-status-active",
      },
      "Tạm khóa": {
        color: "warning",
        icon: <LockOutlined />,
        className: "roles-status-inactive",
      },
      Khóa: {
        color: "error",
        icon: <LockOutlined />,
        className: "roles-status-locked",
      },
    };
    return configs[status] || configs["Hoạt động"];
  };

  const statusConfig = getStatusConfig(role.status);

  return (
    <Layout.Content className="roles-content">
      <div className="roles-space">
        {/* Header */}
        <div className="roles-detail-header">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href="/roles">
              <Button icon={<ArrowLeftOutlined />} type="text">
                Quay lại
              </Button>
            </Link>
            <div style={{ flex: 1 }}>
              <Title level={2} className="roles-detail-title">
                Chi tiết vai trò
              </Title>
              <Text className="roles-detail-subtitle">
                Thông tin chi tiết về vai trò {role.name}
              </Text>
            </div>
            <Space>
              <Button icon={<EditOutlined />}>Chỉnh sửa</Button>
            </Space>
          </div>
        </div>

        {/* Role Information */}
        <Card className="roles-detail-card" title="Thông tin vai trò">
          <Descriptions
            bordered
            column={2}
            className="roles-detail-descriptions"
          >
            <Descriptions.Item label="ID">{role.id}</Descriptions.Item>
            <Descriptions.Item label="Tên vai trò">
              {role.name}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              <Tag className={statusConfig.className} icon={statusConfig.icon}>
                {role.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>
              {role.description}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(role.created_at).toLocaleString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối">
              {new Date(role.updated_at).toLocaleString("vi-VN")}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Permissions */}
        <Card className="roles-detail-card" title="Quyền hạn">
          <div className="roles-permissions-list">
            <Text strong style={{ marginBottom: 12, display: "block" }}>
              Danh sách quyền hạn ({role.permissions.length} quyền):
            </Text>
            <Space wrap>
              {role.permissions.map((permission, index) => (
                <Tag key={index} className="roles-permissions-tag" color="blue">
                  {permission}
                </Tag>
              ))}
            </Space>
          </div>
        </Card>
      </div>
    </Layout.Content>
  );
}
