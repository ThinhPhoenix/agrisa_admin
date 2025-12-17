"use client";

import SelectedColumn from "@/components/column-selector";
import { CustomForm } from "@/components/custom-form";
import CustomTable from "@/components/custom-table";
import { formatUtcDate } from "@/libs/datetime";
import { useAccounts } from "@/services/hooks/accounts/use-accounts";
import { useTableData } from "@/services/hooks/common/use-table-data";
import {
  CheckCircleOutlined,
  FilterOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Collapse, Layout, Space, Spin, Tag, Typography } from "antd";
import Link from "next/link";
import { useMemo, useState } from "react";
import "./accounts.css";

export default function Page() {
  const { Title, Text } = Typography;

  // Fetch accounts, filters and summary from hook (hook shape may vary)
  const {
    data: accountsData = [],
    loading = false,
    filterOptions = { roles: [], statuses: [] },
    summaryStats = { totalAccounts: 0, activeAccounts: 0, adminAccounts: 0 },
  } = useAccounts() || {};

  const { paginatedData = accountsData, paginationConfig = {} } =
    useTableData(accountsData) || {};

  const handleClearFilters = () => {
    /* no-op placeholder: implement clearing logic if needed */
  };

  const handleFormSubmit = (values) => {
    /* no-op placeholder: implement search/filter submit */
    console.log("Search submitted", values);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Tài khoản đang hoạt động bình thường.":
        return "green";
      case "Tài khoản bị tạm ngừng.":
        return "orange";
      case "Tài khoản đang chờ xác minh.":
        return "blue";
      case "Tài khoản đã bị vô hiệu hóa.":
        return "red";
      default:
        return "default";
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      "Quản trị viên": "red",
      "Người dùng": "cyan",
    };
    return colors[role] || "default";
  };

  const columns = useMemo(
    () => [
      {
        title: "Thông tin tài khoản",
        dataIndex: "user_info",
        key: "user_info",
        width: 160,
        render: (_, record) => (
          <div className="accounts-user-info">
            <div className="accounts-user-details">
              <div className="accounts-user-name">{record.full_name}</div>
              <div className="accounts-user-email">{record.email}</div>
            </div>
          </div>
        ),
      },
      {
        title: "Vai trò",
        dataIndex: "role",
        key: "role",
        width: 150,
        render: (_, record) => (
          <Tag color={getRoleColor(record.role)} className="accounts-role-tag">
            {record.role}
          </Tag>
        ),
      },
      {
        title: "Đăng nhập cuối",
        dataIndex: "last_login",
        key: "last_login",
        width: 160,
        render: (_, record) => (
          <div className="accounts-last-login">
            <div className="accounts-login-date">
              {formatUtcDate(record.last_login)}
            </div>
            <div className="accounts-login-time">
              {record.last_login
                ? new Date(record.last_login).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC",
                  })
                : "-"}
            </div>
          </div>
        ),
      },
    ],
    []
  );

  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((c) => c.key)
  );

  if (loading) {
    return (
      <Layout.Content className="accounts-content">
        <div className="accounts-loading">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </Layout.Content>
    );
  }

  const searchFields = [
    {
      name: "search",
      label: "Tìm kiếm",
      type: "input",
      placeholder: "Tìm kiếm theo tên đăng kí, họ tên, email...",
    },
    {
      name: "role",
      label: "Vai trò",
      type: "combobox",
      placeholder: "Chọn vai trò",
      options: filterOptions.roles || [],
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "combobox",
      placeholder: "Chọn trạng thái",
      options: filterOptions.statuses || [],
    },
    {
      name: "spacer",
      type: "custom",
      label: "",
      render: () => <div />,
    },
    {
      name: "searchButton",
      label: " ",
      type: "button",
      variant: "primary",
      buttonText: "Tìm kiếm",
      startContent: <SearchOutlined />,
      isSubmit: true,
    },
    {
      name: "clearButton",
      label: " ",
      type: "button",
      variant: "dashed",
      buttonText: "Xóa bộ lọc",
      startContent: <FilterOutlined />,
      onClick: handleClearFilters,
    },
  ];

  return (
    <Layout.Content className="accounts-content">
      <div className="accounts-space">
        <div className="accounts-header">
          <div>
            <Title level={2} className="accounts-title">
              Quản lý Tài khoản Admin
            </Title>
            <Text className="accounts-subtitle">
              Quản lý các tài khoản quản trị viên và phân quyền truy cập
            </Text>
          </div>
        </div>

        <div className="accounts-summary-row">
          <div className="accounts-summary-card-compact total">
            <div className="accounts-summary-icon total">
              <TeamOutlined />
            </div>
            <div className="accounts-summary-content">
              <div className="accounts-summary-value-compact">
                {summaryStats?.totalAccounts ?? 0}
              </div>
              <div className="accounts-summary-label-compact">
                Tổng tài khoản
              </div>
            </div>
          </div>

          <div className="accounts-summary-card-compact active">
            <div className="accounts-summary-icon active">
              <CheckCircleOutlined />
            </div>
            <div className="accounts-summary-content">
              <div className="accounts-summary-value-compact">
                {summaryStats?.activeAccounts ?? 0}
              </div>
              <div className="accounts-summary-label-compact">
                Đang hoạt động
              </div>
            </div>
          </div>

          <div className="accounts-summary-card-compact admin">
            <div className="accounts-summary-icon admin">
              <UserOutlined />
            </div>
            <div className="accounts-summary-content">
              <div className="accounts-summary-value-compact">
                {summaryStats?.adminAccounts ?? 0}
              </div>
              <div className="accounts-summary-label-compact">
                Tài khoản Quản trị viên
              </div>
            </div>
          </div>
        </div>

        <div className="accounts-filters">
          <Collapse
            items={[
              {
                key: "1",
                label: (
                  <Space>
                    <FilterOutlined />
                    Bộ lọc tìm kiếm
                  </Space>
                ),
                children: (
                  <div className="accounts-filter-form">
                    <CustomForm
                      fields={searchFields}
                      gridColumns="1fr 1fr 1fr"
                      gap="16px"
                      onSubmit={handleFormSubmit}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>

        <div className="flex justify-start items-center gap-2 mb-2">
          <Link href="general/create">
            <Button type="primary" icon={<UserOutlined />}>
              Tạo tài khoản
            </Button>
          </Link>

          <SelectedColumn
            columns={columns}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
          />
        </div>

        <CustomTable
          columns={columns}
          dataSource={paginatedData}
          visibleColumns={visibleColumns}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={paginationConfig}
        />
      </div>
    </Layout.Content>
  );
}
