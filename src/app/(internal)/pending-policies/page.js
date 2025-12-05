"use client";

import SelectedColumn from "@/components/column-selector";
import { CustomForm } from "@/components/custom-form";
import CustomTable from "@/components/custom-table";
import { usePendingPolicies } from "@/services/hooks/base-policy/use-pending-base-policies";
import { useTableData } from "@/services/hooks/common/use-table-data";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  FilterOutlined,
  SearchOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, Collapse, Layout, Space, Spin, Tag, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";
import "./policy.css";

const { Title, Text } = Typography;

export default function PendingPoliciesPage() {
  const {
    data,
    filteredData,
    filterOptions,
    summaryStats,
    filters,
    updateFilters,
    applyApiFilters,
    clearFilters,
    loading,
  } = usePendingPolicies();

  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState([
    "product_info",
    "provider",
    "crop_type",
    "validation_status",
    "validation_summary",
    "created_at",
  ]);

  // Flatten RAW data (not filteredData) for searching - use data to avoid duplicate filtering
  const flattenedData = (data || []).map((item) => ({
    ...item,
    product_name: item.base_policy?.product_name || "",
    product_code: item.base_policy?.product_code || "",
    insurance_provider_id: item.base_policy?.insurance_provider_id || "",
    crop_type: item.base_policy?.crop_type || "",
    document_validation_status:
      item.base_policy?.document_validation_status || "",
  }));

  // Frontend table data hook - use RAW data instead of filteredData
  const {
    paginatedData,
    paginationConfig,
  } = useTableData(flattenedData, {
    searchFields: ["product_name", "product_code", "insurance_provider_id"],
    defaultFilters: {},
    pageSize: 10,
  });

  // Loading state check
  if (loading) {
    return (
      <Layout.Content className="policy-content">
        <div className="policy-loading">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </Layout.Content>
    );
  }

  // Handle form submit
  const handleFormSubmit = (formData) => {
    // Separate API filters from client-side filters
    const apiFilters = {};
    const clientFilters = {};

    if (formData.archive_status !== undefined) {
      apiFilters.archive_status = formData.archive_status;
    }
    if (formData.provider_id !== undefined) {
      apiFilters.provider_id = formData.provider_id;
    }
    if (formData.validation_status !== undefined) {
      clientFilters.validation_status = formData.validation_status;
    }
    if (formData.product_name !== undefined) {
      clientFilters.product_name = formData.product_name;
    }

    // Apply API filters (triggers refetch)
    if (Object.keys(apiFilters).length > 0) {
      applyApiFilters(apiFilters);
    }

    // Apply client filters
    if (Object.keys(clientFilters).length > 0) {
      updateFilters(clientFilters);
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    clearFilters();
  };

  // Get validation status config
  const getValidationStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "orange",
        icon: <ClockCircleOutlined />,
        text: "Chờ duyệt",
      },
      passed_ai: {
        color: "cyan",
        icon: <CheckCircleOutlined />,
        text: "AI duyệt",
      },
      passed: {
        color: "green",
        icon: <CheckCircleOutlined />,
        text: "Đã duyệt",
      },
      failed: { color: "red", icon: <CloseCircleOutlined />, text: "Thất bại" },
      warning: { color: "gold", icon: <WarningOutlined />, text: "Cảnh báo" },
    };
    return configs[status] || configs.pending;
  };

  // Get crop type display
  const getCropTypeDisplay = (cropType) => {
    const types = {
      rice: "Lúa",
      corn: "Ngô",
      coffee: "Cà phê",
      pepper: "Hồ tiêu",
    };
    return types[cropType] || cropType;
  };

  // Table columns
  const columns = [
    {
      title: "Thông tin sản phẩm",
      dataIndex: "product_info",
      key: "product_info",
      width: 250,
      render: (_, record) => {
        const basePolicy = record.base_policy || {};
        return (
          <div className="policy-item-info">
            <div className="policy-item-details">
              <div className="policy-item-name">{basePolicy.product_name}</div>
              <div className="policy-item-description">
                {basePolicy.product_code}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Nhà bảo hiểm",
      dataIndex: "provider",
      key: "provider",
      width: 180,
      render: (_, record) => {
        const basePolicy = record.base_policy || {};
        return (
          <div className="policy-item-name">
            {basePolicy.insurance_provider_id}
          </div>
        );
      },
    },
    {
      title: "Loại cây trồng",
      dataIndex: "crop_type",
      key: "crop_type",
      width: 120,
      render: (_, record) => {
        const basePolicy = record.base_policy || {};
        return (
          <Tag color="blue" className="policy-status-tag">
            {getCropTypeDisplay(basePolicy.crop_type)}
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái validation",
      dataIndex: "validation_status",
      key: "validation_status",
      width: 150,
      render: (_, record) => {
        const basePolicy = record.base_policy || {};
        const status = basePolicy.document_validation_status || "pending";
        const config = getValidationStatusConfig(status);
        return (
          <Tag
            color={config.color}
            icon={config.icon}
            className="policy-status-tag"
          >
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Kết quả validation",
      dataIndex: "validation_summary",
      key: "validation_summary",
      width: 200,
      render: (_, record) => {
        const validations = record.validations || [];
        if (validations.length === 0) {
          return <Text type="secondary">Chưa có dữ liệu</Text>;
        }

        const latestValidation = validations[0];
        const { total_checks, passed_checks, failed_checks, warning_count } =
          latestValidation;

        return (
          <div className="validation-summary">
            <div className="validation-summary-row">
              <Text className="validation-summary-item">
                <CheckCircleOutlined className="text-green-600" />
                <span>
                  {passed_checks}/{total_checks}
                </span>
              </Text>
              {failed_checks > 0 && (
                <Text className="validation-summary-item" type="danger">
                  <CloseCircleOutlined />
                  <span>{failed_checks}</span>
                </Text>
              )}
              {warning_count > 0 && (
                <Text className="validation-summary-item" type="warning">
                  <WarningOutlined />
                  <span>{warning_count}</span>
                </Text>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 160,
      render: (_, record) => {
        const basePolicy = record.base_policy || {};
        const createdAt = basePolicy.created_at;
        if (!createdAt || createdAt === "0001-01-01T00:00:00Z") {
          return <Text type="secondary">N/A</Text>;
        }
        return (
          <div className="policy-created-at">
            <div className="policy-date">
              {new Date(createdAt).toLocaleDateString("vi-VN")}
            </div>
            <div className="policy-time">
              {new Date(createdAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => {
        const basePolicy = record.base_policy || {};
        return (
          <div className="policy-actions-cell">
            <Link href={`/pending-policies/${basePolicy.id}`}>
              <Button
                type="dashed"
                size="small"
                className="policy-action-btn !bg-blue-100 !border-blue-200 !text-blue-800 hover:!bg-blue-200"
              >
                <EyeOutlined size={14} />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  // Search fields
  const searchFields = [
    {
      name: "product_name",
      label: "Tên sản phẩm",
      type: "input",
      placeholder: "Tìm kiếm theo tên hoặc mã...",
      value: filters.product_name,
    },
    {
      name: "provider_id",
      label: "Nhà bảo hiểm",
      type: "combobox",
      placeholder: "Chọn nhà bảo hiểm",
      options: filterOptions.providers,
      value: filters.provider_id,
    },
    {
      name: "validation_status",
      label: "Trạng thái validation",
      type: "combobox",
      placeholder: "Chọn trạng thái",
      options: filterOptions.validationStatuses,
      value: filters.validation_status,
    },
    {
      name: "archive_status",
      label: "Trạng thái lưu trữ",
      type: "combobox",
      placeholder: "Chọn trạng thái",
      options: filterOptions.archiveStatuses,
      value: filters.archive_status,
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
    <Layout.Content className="policy-content">
      <div className="policy-space">
        {/* Header */}
        <div className="policy-header">
          <div>
            <Title level={2} className="policy-title">
              Quản lý Policy chờ duyệt
            </Title>
            <Text className="policy-subtitle">
              Danh sách base policy draft đang chờ validation
            </Text>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="policy-summary-row">
          <div className="policy-summary-card-compact">
            <div className="policy-summary-icon total">
              <FileTextOutlined />
            </div>
            <div className="policy-summary-content">
              <div className="policy-summary-value-compact">
                {summaryStats.totalPolicies}
              </div>
              <div className="policy-summary-label-compact">Tổng policy</div>
            </div>
          </div>

          <div className="policy-summary-card-compact">
            <div className="policy-summary-icon pending">
              <ClockCircleOutlined />
            </div>
            <div className="policy-summary-content">
              <div className="policy-summary-value-compact">
                {summaryStats.pendingValidation}
              </div>
              <div className="policy-summary-label-compact">Chờ duyệt</div>
            </div>
          </div>

          <div className="policy-summary-card-compact">
            <div className="policy-summary-icon active">
              <CheckCircleOutlined />
            </div>
            <div className="policy-summary-content">
              <div className="policy-summary-value-compact">
                {summaryStats.passedValidation}
              </div>
              <div className="policy-summary-label-compact">Đã duyệt</div>
            </div>
          </div>

          <div className="policy-summary-card-compact">
            <div className="policy-summary-icon inactive">
              <CloseCircleOutlined />
            </div>
            <div className="policy-summary-content">
              <div className="policy-summary-value-compact">
                {summaryStats.failedValidation}
              </div>
              <div className="policy-summary-label-compact">Thất bại</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="policy-filters">
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
                  <div className="policy-filter-form">
                    <div className="space-y-4">
                      <CustomForm
                        fields={searchFields}
                        gridColumns="1fr 1fr 1fr 1fr 1fr 1fr"
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
          rowKey={(record) => record.base_policy?.id || Math.random()}
          scroll={{ x: 1400 }}
          pagination={paginationConfig}
        />
      </div>
    </Layout.Content>
  );
}
