"use client";

import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  EditOutlined,
  LockOutlined,
  TeamOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  Layout,
  Row,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "../accounts.css";
import mockData from "../mock.json";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function AccountDetailPage() {
  const params = useParams();
  const id = params.id;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const foundUser = mockData.find((item) => item.id === id);
      setUser(foundUser);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <Content className="accounts-content">
        <div className="accounts-loading">
          <Spin size="large" tip="Đang tải thông tin tài khoản..." />
        </div>
      </Content>
    );
  }

  // User not found
  if (!user) {
    return (
      <Content className="accounts-content">
        <div className="accounts-error">
          <Title level={3}>Không tìm thấy tài khoản</Title>
          <Text>Tài khoản với ID {id} không tồn tại.</Text>
          <br />
          <Link href="/accounts/general">
            <Button type="primary" icon={<ArrowLeftOutlined />}>
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </Content>
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

  // Get role color
  const getRoleColor = (role) => {
    const colors = {
      "Super Admin": "red",
      Admin: "orange",
      Manager: "blue",
      Staff: "green",
      Viewer: "purple",
    };
    return colors[role] || "default";
  };

  return (
    <Content className="accounts-detail-content">
      <div className="accounts-detail-container">
        {/* Header Section */}
        <div className="accounts-detail-header">
          <div className="accounts-detail-breadcrumb">
            <Link href="/accounts/general">
              <Button type="text" icon={<ArrowLeftOutlined />}>
                Quay lại danh sách
              </Button>
            </Link>
          </div>

          <div className="accounts-detail-title-section">
            <div className="accounts-detail-title-content">
              <Title level={2} className="accounts-detail-title">
                {user.full_name}
              </Title>
              <Text type="secondary" className="accounts-detail-subtitle">
                @{user.username} • {user.email}
              </Text>
              <div className="accounts-detail-tags">
                <Tag color={getRoleColor(user.role)} icon={<UserOutlined />}>
                  {user.role}
                </Tag>
                <Tag
                  color={getStatusColor(user.status)}
                  icon={<CheckCircleOutlined />}
                >
                  {user.status}
                </Tag>
              </div>
            </div>

            <div className="accounts-detail-actions">
              <Space wrap>
                <Button type="primary" icon={<EditOutlined />}>
                  Chỉnh sửa
                </Button>
                <Button icon={<LockOutlined />}>
                  {user.status === "Hoạt động" ? "Khóa tài khoản" : "Mở khóa"}
                </Button>
              </Space>
            </div>
          </div>
        </div>

        {/* Main Content - 3 Rows Layout */}
        <div className="accounts-detail-main">
          {/* Row 1: Basic Info + Statistics */}
          <Row gutter={[24, 24]} className="accounts-detail-row">
            <Col xs={24} lg={14}>
              <Card title="Thông tin cơ bản" className="accounts-detail-card">
                <div className="accounts-user-avatar-section">
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    width={100}
                    height={100}
                    className="accounts-user-avatar-large"
                    preview={false}
                  />
                </div>
                <Descriptions column={2} bordered size="small">
                  <Descriptions.Item label="ID tài khoản" span={2}>
                    <Text strong>{user.id}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên đăng nhập">
                    {user.username}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {user.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Họ và tên" span={2}>
                    <Text strong>{user.full_name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Vai trò">
                    <Tag color={getRoleColor(user.role)}>{user.role}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Tag color={getStatusColor(user.status)}>{user.status}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phòng ban">
                    {user.department}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo">
                    {new Date(user.created_date).toLocaleDateString("vi-VN")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Đăng nhập cuối" span={2}>
                    <div>
                      <div>
                        {new Date(user.last_login).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="text-gray-500">
                        {new Date(user.last_login).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} lg={10}>
              <Card title="Thống kê tài khoản" className="accounts-detail-card">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="Số quyền hạn"
                      value={user.permissions.length}
                      prefix={<UserOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Thời gian hoạt động"
                      value={Math.floor(
                        (new Date() - new Date(user.created_date)) /
                          (1000 * 60 * 60 * 24)
                      )}
                      suffix="ngày"
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Trạng thái"
                      value={
                        user.status === "Hoạt động"
                          ? "Hoạt động"
                          : "Không hoạt động"
                      }
                      prefix={<WarningOutlined />}
                      valueStyle={{
                        color:
                          user.status === "Hoạt động" ? "#52c41a" : "#faad14",
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Cấp độ"
                      value={user.role}
                      prefix={<TeamOutlined />}
                      valueStyle={{ color: "#722ed1" }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          {/* Row 2: Permissions + Activity Log */}
          <Row gutter={[24, 24]} className="accounts-detail-row">
            <Col xs={24} lg={12}>
              <Card title="Quyền hạn" className="accounts-detail-card">
                <div className="accounts-permissions-container">
                  <div className="accounts-permissions-summary">
                    <Text strong>
                      Tổng cộng: {user.permissions.length} quyền hạn
                    </Text>
                  </div>
                  <div className="accounts-permissions-list">
                    {user.permissions.map((permission, index) => (
                      <Tag
                        key={index}
                        color="blue"
                        className="accounts-permission-tag"
                      >
                        {permission}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Lịch sử hoạt động" className="accounts-detail-card">
                <div className="accounts-activity-log">
                  <div className="accounts-activity-item">
                    <div className="accounts-activity-header">
                      <Text strong>Đăng nhập cuối</Text>
                      <Text type="secondary">
                        {new Date(user.last_login).toLocaleString("vi-VN")}
                      </Text>
                    </div>
                    <Text type="secondary">
                      Đăng nhập thành công từ trình duyệt web
                    </Text>
                  </div>
                  <div className="accounts-activity-item">
                    <div className="accounts-activity-header">
                      <Text strong>Tài khoản được tạo</Text>
                      <Text type="secondary">
                        {new Date(user.created_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </Text>
                    </div>
                    <Text type="secondary">
                      Tài khoản được tạo bởi quản trị viên
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Action Buttons Footer */}
        <div className="accounts-detail-footer">
          <Space wrap size="large">
            <Button type="primary" size="large" icon={<EditOutlined />}>
              Chỉnh sửa thông tin
            </Button>
            <Button size="large" icon={<LockOutlined />}>
              {user.status === "Hoạt động"
                ? "Khóa tài khoản"
                : "Mở khóa tài khoản"}
            </Button>
            <Button size="large" icon={<UserOutlined />}>
              Xem lịch sử
            </Button>
          </Space>
        </div>
      </div>
    </Content>
  );
}
