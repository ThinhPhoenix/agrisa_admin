"use client";

import SelectedColumn from "@/components/column-selector";
import { CustomForm } from "@/components/custom-form";
import CustomTable from "@/components/custom-table";
import { usePermissions } from "@/services/hooks/permissions/use-permissions";
import {
  CheckCircleOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  LockOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Collapse, Layout, Space, Spin, Tag, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";
import "./permissions.css";

const { Title, Text } = Typography;

export default function PermissionsPage() {
  const {
    filteredData,
    filterOptions,
    summaryStats,
    filters,
    updateFilters,
    clearFilters,
    loading,
  } = usePermissions();

  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState([
    "name",
    "description",
    "module",
    "actions",
    "status",
    "created_at",
  ]);

  // Loading state check
  if (loading) {
    return (
      <Layout.Content className="permissions-content">
        <div className="permissions-loading">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </Layout.Content>
    );
  }

  // Handle form submit
  const handleFormSubmit = (formData) => {
    updateFilters(formData);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    clearFilters();
  };

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

  // Table columns
  const columns = [
    {
      title: "Tên quyền",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (_, record) => (
        <div className="permissions-name">{record.name}</div>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 300,
      render: (_, record) => (
        <div className="permissions-description">{record.description}</div>
      ),
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      width: 120,
      render: (_, record) => (
        <Tag
          color={getModuleColor(record.module)}
          className="permissions-module-tag"
        >
          {record.module}
        </Tag>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <div className="permissions-actions">
          <div className="permissions-action-count">
            {record.actions.length} actions
          </div>
          <div className="permissions-action-list">
            {record.actions.slice(0, 2).join(", ")}
            {record.actions.length > 2 && "..."}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (_, record) => (
        <Tag
          color={getStatusColor(record.status)}
          className="permissions-status-tag"
        >
          {record.status}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 160,
      render: (_, record) => (
        <div className="permissions-created-at">
          <div className="permissions-date">
            {new Date(record.created_at).toLocaleDateString("vi-VN")}
          </div>
          <div className="permissions-time">
            {new Date(record.created_at).toLocaleTimeString("vi-VN", {
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
        <div className="permissions-actions-cell">
          <Link href={`/permissions/${record.id}`}>
            <Button
              type="dashed"
              size="small"
              className="permissions-action-btn !bg-blue-100 !border-blue-200 !text-blue-800 hover:!bg-blue-200"
            >
              <EyeOutlined size={14} />
            </Button>
          </Link>
          <Button
            type="dashed"
            size="small"
            className="permissions-action-btn !bg-green-100 !border-green-200 !text-green-800 hover:!bg-green-200"
          >
            <EditOutlined size={14} />
          </Button>
          <Button
            type="dashed"
            size="small"
            className="permissions-action-btn !bg-purple-100 !border-purple-200 !text-purple-800 hover:!bg-purple-200"
          >
            <LockOutlined size={14} />
          </Button>
        </div>
      ),
    },
  ];

  // Search fields - organized in 2 rows
  const searchFields = [
    // First row - Main filters (2 fields)
    {
      name: "name",
      label: "Tên quyền",
      type: "input",
      placeholder: "Tìm kiếm theo tên quyền...",
      value: filters.name,
    },
    {
      name: "module",
      label: "Module",
      type: "combobox",
      placeholder: "Chọn module",
      options: filterOptions.modules,
      value: filters.module,
    },
    // Second row - Additional filters and actions (3 fields)
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
    <Layout.Content className="permissions-content">
      <div className="permissions-space">
        {/* Header */}
        <div className="permissions-header">
          <div>
            <Title level={2} className="permissions-title">
              Quản lý Quyền hạn
            </Title>
            <Text className="permissions-subtitle">
              Quản lý các quyền hạn và phân quyền truy cập hệ thống
            </Text>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="permissions-summary-row">
          <div className="permissions-summary-card-compact">
            <div className="permissions-summary-icon total">
              <LockOutlined />
            </div>
            <div className="permissions-summary-content">
              <div className="permissions-summary-value-compact">
                {summaryStats.totalPermissions}
              </div>
              <div className="permissions-summary-label-compact">
                Tổng quyền
              </div>
            </div>
          </div>

          <div className="permissions-summary-card-compact">
            <div className="permissions-summary-icon active">
              <CheckCircleOutlined />
            </div>
            <div className="permissions-summary-content">
              <div className="permissions-summary-value-compact">
                {summaryStats.activePermissions}
              </div>
              <div className="permissions-summary-label-compact">
                Đang hoạt động
              </div>
            </div>
          </div>

          <div className="permissions-summary-card-compact">
            <div className="permissions-summary-icon modules">
              <SettingOutlined />
            </div>
            <div className="permissions-summary-content">
              <div className="permissions-summary-value-compact">
                {summaryStats.modulesCount}
              </div>
              <div className="permissions-summary-label-compact">Số module</div>
            </div>
          </div>

          <div className="permissions-summary-card-compact">
            <div className="permissions-summary-icon actions">
              <TeamOutlined />
            </div>
            <div className="permissions-summary-content">
              <div className="permissions-summary-value-compact">
                {summaryStats.avgActions}
              </div>
              <div className="permissions-summary-label-compact">
                Actions TB
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="permissions-filters">
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
                  <div className="permissions-filter-form">
                    <div className="space-y-4">
                      {/* First row - Main filters */}
                      <CustomForm
                        fields={searchFields.slice(0, 2)}
                        gridColumns="1fr 1fr"
                        gap="16px"
                        onSubmit={handleFormSubmit}
                      />
                      {/* Second row - Additional filters and actions */}
                      <CustomForm
                        fields={searchFields.slice(2)}
                        gridColumns="1fr 1fr 1fr"
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
          <Button type="primary" icon={<LockOutlined />}>
            Tạo quyền
          </Button>
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
              `${range[0]}-${range[1]} của ${total} quyền`,
          }}
        />
      </div>
    </Layout.Content>
  );
}
