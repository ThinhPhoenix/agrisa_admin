"use client";

import SelectedColumn from "@/components/column-selector";
import { CustomForm } from "@/components/custom-form";
import CustomTable from "@/components/custom-table";
import { useRoles } from "@/services/hooks/roles/use-role";
import {
  CheckCircleOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  LockOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Collapse, Layout, Space, Spin, Tag, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";
import "./roles.css";

const { Title, Text } = Typography;

export default function RolesPage() {
  const {
    filteredData,
    filterOptions,
    summaryStats,
    filters,
    updateFilters,
    clearFilters,
    loading,
  } = useRoles();

  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState([
    "name",
    "description",
    "permissions",
    "status",
    "created_at",
  ]);

  // Handle form submit
  const handleFormSubmit = (formData) => {
    updateFilters(formData);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    clearFilters();
  };

  // Loading state check
  if (loading) {
    return (
      <Layout.Content className="roles-content">
        <div className="roles-loading">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </Layout.Content>
    );
  }

  // Table columns
  const columns = [
    {
      title: "Tên vai trò",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <Link href={`/roles/${record.id}`}>
          <div style={{ fontWeight: 500, color: "#1890ff" }}>{text}</div>
        </Link>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) => (
        <div style={{ maxWidth: 300, color: "#6b7280" }}>{text}</div>
      ),
    },
    {
      title: "Quyền hạn",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions) => (
        <div>
          <Text style={{ color: "#6b7280" }}>{permissions.length} quyền</Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          "Hoạt động": {
            color: "success",
            icon: <CheckCircleOutlined />,
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

        const config = statusConfig[status] || statusConfig["Hoạt động"];

        return (
          <Tag className={config.className} icon={config.icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <div className="roles-actions-cell">
          <Link href={`/roles/${record.id}`}>
            <Button
              type="dashed"
              size="small"
              className="roles-action-btn !bg-blue-100 !border-blue-200 !text-blue-800 hover:!bg-blue-200"
            >
              <EyeOutlined size={14} />
            </Button>
          </Link>
          <Button
            type="dashed"
            size="small"
            className="roles-action-btn !bg-green-100 !border-green-200 !text-green-800 hover:!bg-green-200"
          >
            <EditOutlined size={14} />
          </Button>
          <Button
            type="dashed"
            size="small"
            className="roles-action-btn !bg-purple-100 !border-purple-200 !text-purple-800 hover:!bg-purple-200"
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
      name: "name",
      label: "Tên vai trò",
      type: "input",
      placeholder: "Tìm kiếm theo tên vai trò...",
      value: filters.name,
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "combobox",
      placeholder: "Chọn trạng thái",
      options: filterOptions.statuses,
      value: filters.status,
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
    // Second row - Additional filters and actions (4 fields)
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
    <Layout.Content className="roles-content">
      <div className="roles-space">
        {/* Header */}
        <div className="roles-header">
          <div>
            <Title level={2} className="roles-title">
              Quản lý Vai trò
            </Title>
            <Text className="roles-subtitle">
              Quản lý các vai trò và quyền hạn trong hệ thống
            </Text>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="roles-summary-row">
          <div className="roles-summary-card-compact">
            <div className="roles-summary-icon total">
              <TeamOutlined />
            </div>
            <div className="roles-summary-content">
              <div className="roles-summary-value-compact">
                {summaryStats.total}
              </div>
              <div className="roles-summary-label-compact">Tổng vai trò</div>
            </div>
          </div>

          <div className="roles-summary-card-compact">
            <div className="roles-summary-icon active">
              <CheckCircleOutlined />
            </div>
            <div className="roles-summary-content">
              <div className="roles-summary-value-compact">
                {summaryStats.active}
              </div>
              <div className="roles-summary-label-compact">Đang hoạt động</div>
            </div>
          </div>

          <div className="roles-summary-card-compact">
            <div className="roles-summary-icon inactive">
              <LockOutlined />
            </div>
            <div className="roles-summary-content">
              <div className="roles-summary-value-compact">
                {summaryStats.inactive}
              </div>
              <div className="roles-summary-label-compact">Không hoạt động</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="roles-filters">
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
                  <div className="roles-filter-form">
                    <div className="space-y-4">
                      {/* First row - Main filters */}
                      <CustomForm
                        fields={searchFields.slice(0, 3)}
                        gridColumns="1fr 1fr 1fr"
                        gap="16px"
                        onSubmit={handleFormSubmit}
                      />
                      {/* Second row - Additional filters and actions */}
                      <CustomForm
                        fields={searchFields.slice(3)}
                        gridColumns="1fr 1fr 1fr 1fr"
                        gap="16px"
                        onSubmit={handleFormSubmit}
                      />
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* Table */}
        <div className="flex justify-start items-center gap-2 mb-2">
          <Link href="/roles/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Tạo vai trò
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
          dataSource={filteredData}
          visibleColumns={visibleColumns}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} vai trò`,
          }}
        />
      </div>
    </Layout.Content>
  );
}
