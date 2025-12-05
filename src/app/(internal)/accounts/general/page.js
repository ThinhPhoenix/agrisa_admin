"use client";

import SelectedColumn from "@/components/column-selector";
import { CustomForm } from "@/components/custom-form";
import CustomTable from "@/components/custom-table";
import { useAccounts } from "@/services/hooks/accounts/use-accounts";
import { useTableData } from "@/services/hooks/common/use-table-data";
import {
  CheckCircleOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  LockOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Collapse,
  Image,
  Layout,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useState } from "react";
import "./accounts.css";

const { Title, Text } = Typography;

export default function AccountsPage() {
  const {
    data,
    filteredData,
    filterOptions,
    summaryStats,
    filters,
    updateFilters,
    clearFilters,
    loading,
  } = useAccounts();

  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState([
    "user_info",
    "role",
    "status",
    "last_login",
  ]);

  // Frontend table data hook - use RAW data instead of filteredData
  const {
    paginatedData,
    handleFormSubmit,
    handleClearFilters,
    paginationConfig,
    searchText,
    filters: tableFilters,
  } = useTableData(data, {
    searchFields: ["username", "full_name", "email"],
    defaultFilters: {
      role: "",
      status: "",
    },
    pageSize: 10,
  });

  // Loading state check
  if (loading) {
    return (
      <Layout.Content className="accounts-content">
        <div className="accounts-loading">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </Layout.Content>
    );
  }

  // Get status color
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

  // Get role color
  const getRoleColor = (role) => {
    const colors = {
      "Quản trị viên": "red",
      "Người dùng": "cyan",
    };
    return colors[role] || "default";
  };

  // Table columns
  const columns = [
    {
      title: "Thông tin tài khoản",
      dataIndex: "user_info",
      key: "user_info",
      width: 300,
      render: (_, record) => (
        <div className="accounts-user-info">
          <Image
            src={record.avatar}
            alt={record.username}
            width={48}
            height={48}
            className="accounts-user-avatar"
            preview={false}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
          <div className="accounts-user-details">
            <div className="accounts-user-name">{record.full_name}</div>
            <div className="accounts-user-username">@{record.username}</div>
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
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   width: 130,
    //   render: (_, record) => (
    //     <Tag
    //       color={getStatusColor(record.status)}
    //       className="accounts-status-tag"
    //     >
    //       {record.status}
    //     </Tag>
    //   ),
    // },
    {
      title: "Đăng nhập cuối",
      dataIndex: "last_login",
      key: "last_login",
      width: 160,
      render: (_, record) => (
        <div className="accounts-last-login">
          <div className="accounts-login-date">
            {new Date(record.last_login).toLocaleDateString("vi-VN")}
          </div>
          <div className="accounts-login-time">
            {new Date(record.last_login).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <div className="accounts-actions-cell">
          <Link href={`/accounts/general/${record.id}`}>
            <Button
              type="dashed"
              size="small"
              className="accounts-action-btn !bg-blue-100 !border-blue-200 !text-blue-800 hover:!bg-blue-200"
            >
              <EyeOutlined size={14} />
            </Button>
          </Link>
          <Button
            type="dashed"
            size="small"
            className="accounts-action-btn !bg-green-100 !border-green-200 !text-green-800 hover:!bg-green-200"
          >
            <EditOutlined size={14} />
          </Button>
          <Button
            type="dashed"
            size="small"
            className="accounts-action-btn !bg-purple-100 !border-purple-200 !text-purple-800 hover:!bg-purple-200"
          >
            <LockOutlined size={14} />
          </Button>
        </div>
      ),
    },
  ];

  // Search fields - organized in 2 rows
  const searchFields = [
    // First row - Main filters (3 fields)
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
      options: filterOptions.roles,
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "combobox",
      placeholder: "Chọn trạng thái",
      options: filterOptions.statuses,
    },
    // Second row - Additional filters and actions (2 buttons)
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
      startContent: <SearchOutlined size={14} />,
      isSubmit: true,
    },
    {
      name: "clearButton",
      label: " ",
      type: "button",
      variant: "dashed",
      buttonText: "Xóa bộ lọc",
      startContent: <FilterOutlined size={14} />,
      onClick: handleClearFilters,
    },
  ];

  return (
    <Layout.Content className="accounts-content">
      <div className="accounts-space">
        {/* Header */}
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

        {/* Summary Cards */}
        <div className="accounts-summary-row">
          <div className="accounts-summary-card-compact">
            <div className="accounts-summary-icon total">
              <TeamOutlined />
            </div>
            <div className="accounts-summary-content">
              <div className="accounts-summary-value-compact">
                {summaryStats.totalAccounts}
              </div>
              <div className="accounts-summary-label-compact">
                Tổng tài khoản
              </div>
            </div>
          </div>

          <div className="accounts-summary-card-compact">
            <div className="accounts-summary-icon active">
              <CheckCircleOutlined />
            </div>
            <div className="accounts-summary-content">
              <div className="accounts-summary-value-compact">
                {summaryStats.activeAccounts}
              </div>
              <div className="accounts-summary-label-compact">
                Đang hoạt động
              </div>
            </div>
          </div>

          <div className="accounts-summary-card-compact">
            <div className="accounts-summary-icon admin">
              <UserOutlined />
            </div>
            <div className="accounts-summary-content">
              <div className="accounts-summary-value-compact">
                {summaryStats.adminAccounts}
              </div>
              <div className="accounts-summary-label-compact">
                Tài khoản Quản trị viên
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
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

        {/* Table */}
        <div className="flex justify-start items-center gap-2 mb-2">
          <Link href="general/create">
            <Button type="primary" icon={<UserOutlined />}>
              Tạo tài khoản
            </Button>
          </Link>
          <Button icon={<DownloadOutlined />}>Nhập excel</Button>
          <Button icon={<DownloadOutlined />}>Xuất excel</Button>
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
