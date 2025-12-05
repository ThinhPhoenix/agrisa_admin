"use client";

import SelectedColumn from "@/components/column-selector";
import { CustomForm } from "@/components/custom-form";
import CustomTable from "@/components/custom-table";
import { policyMessage } from "@/libs/message";
import { useTableData } from "@/services/hooks/common/use-table-data";
import { usePolicies } from "@/services/hooks/policy";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileProtectOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Collapse, Layout, Space, Spin, Tag, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";
import "./policies.css";

const { Title, Text } = Typography;

export default function PoliciesPage() {
  const {
    data,
    filterOptions,
    summaryStats,
    filters,
    updateFilters,
    clearFilters,
    loading,
  } = usePolicies();

  const [visibleColumns, setVisibleColumns] = useState([
    "policy_number",
    "farmer_id",
    "farm_name",
    "base_policy_name",
    "coverage_amount",
    "status",
    "underwriting_status",
    "created_at",
  ]);

  // Frontend table data hook
  const {
    paginatedData,
    handleFormSubmit,
    handleClearFilters: clearTableFilters,
    paginationConfig,
    searchText,
    filters: tableFilters,
  } = useTableData(data, {
    searchFields: [
      "policy_number",
      "farmer_id",
      "insurance_provider_id",
      "farm.farm_name",
      "base_policy.product_name",
    ],
    defaultFilters: {
      status: "",
      underwriting_status: "",
      insurance_provider_id: "",
    },
    pageSize: 10,
  });

  if (loading) {
    return (
      <Layout.Content className="policy-content">
        <div className="policy-loading">
          <Spin size="large" tip={policyMessage.loading.list} />
        </div>
      </Layout.Content>
    );
  }

  const handleClearFilters = () => {
    clearTableFilters();
    clearFilters();
  };

  // Get policy status config
  const getPolicyStatusConfig = (status) => {
    const configs = {
      draft: { color: "default", icon: <ClockCircleOutlined />, text: policyMessage.status.draft },
      pending_review: { color: "orange", icon: <ClockCircleOutlined />, text: policyMessage.status.pending_review },
      pending_payment: { color: "cyan", icon: <DollarOutlined />, text: policyMessage.status.pending_payment },
      active: { color: "green", icon: <CheckCircleOutlined />, text: policyMessage.status.active },
      expired: { color: "red", icon: <CloseCircleOutlined />, text: policyMessage.status.expired },
      cancelled: { color: "default", icon: <CloseCircleOutlined />, text: policyMessage.status.cancelled },
      rejected: { color: "red", icon: <CloseCircleOutlined />, text: policyMessage.status.rejected },
    };
    return configs[status] || configs.draft;
  };

  // Get underwriting status config
  const getUnderwritingStatusConfig = (status) => {
    const configs = {
      pending: { color: "orange", icon: <ClockCircleOutlined />, text: policyMessage.underwritingStatus.pending },
      approved: { color: "green", icon: <CheckCircleOutlined />, text: policyMessage.underwritingStatus.approved },
      rejected: { color: "red", icon: <CloseCircleOutlined />, text: policyMessage.underwritingStatus.rejected },
    };
    return configs[status] || configs.pending;
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const columns = [
    {
      title: policyMessage.table.policyNumber,
      dataIndex: "policy_number",
      key: "policy_number",
      width: 150,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: policyMessage.table.farmerName,
      dataIndex: "farmer_id",
      key: "farmer_id",
      width: 150,
      render: (text) => text || "-",
    },
    {
      title: policyMessage.table.farmName,
      dataIndex: "farm_name",
      key: "farm_name",
      width: 180,
      render: (_, record) => record.farm?.farm_name || "-",
    },
    {
      title: policyMessage.table.basePolicyName,
      dataIndex: "base_policy_name",
      key: "base_policy_name",
      width: 200,
      render: (_, record) => record.base_policy?.product_name || "-",
    },
    {
      title: policyMessage.table.insuranceProvider,
      dataIndex: "insurance_provider_id",
      key: "insurance_provider_id",
      width: 150,
      render: (text) => text || "-",
    },
    {
      title: policyMessage.table.coverageAmount,
      dataIndex: "coverage_amount",
      key: "coverage_amount",
      width: 150,
      align: "right",
      render: (amount) => formatCurrency(amount),
    },
    {
      title: policyMessage.table.premium,
      dataIndex: "total_farmer_premium",
      key: "total_farmer_premium",
      width: 130,
      align: "right",
      render: (amount) => formatCurrency(amount),
    },
    {
      title: policyMessage.table.status,
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (status) => {
        const config = getPolicyStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: policyMessage.table.underwritingStatus,
      dataIndex: "underwriting_status",
      key: "underwriting_status",
      width: 160,
      render: (status) => {
        const config = getUnderwritingStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: policyMessage.table.createdAt,
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (date) => formatDate(date),
    },
    {
      title: policyMessage.table.actions,
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <div className="policy-actions-cell">
          <Link href={`/policies/${record.id}`}>
            <Button
              type="dashed"
              size="small"
              className="policy-action-btn !bg-blue-100 !border-blue-200 !text-blue-800 hover:!bg-blue-200"
              title={policyMessage.actions.viewDetail}
            >
              <EyeOutlined />
            </Button>
          </Link>
          <Link href={`/policies/${record.id}/edit`}>
            <Button
              type="dashed"
              size="small"
              className="policy-action-btn !bg-green-100 !border-green-200 !text-green-800 hover:!bg-green-200"
              title={policyMessage.actions.updateStatus}
            >
              <EditOutlined />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  const searchFields = [
    {
      name: "search",
      label: policyMessage.filter.search,
      type: "input",
      placeholder: policyMessage.filter.policyNumber,
    },
    {
      name: "status",
      label: policyMessage.filter.status,
      type: "combobox",
      placeholder: policyMessage.filter.allStatus,
      options: [
        { label: policyMessage.filter.allStatus, value: "" },
        ...filterOptions.statusOptions,
      ],
    },
    {
      name: "underwriting_status",
      label: policyMessage.filter.underwritingStatus,
      type: "combobox",
      placeholder: policyMessage.filter.allUnderwriting,
      options: [
        { label: policyMessage.filter.allUnderwriting, value: "" },
        ...filterOptions.underwritingOptions,
      ],
    },
    {
      name: "insurance_provider_id",
      label: policyMessage.filter.insuranceProvider,
      type: "combobox",
      placeholder: "Tất cả nhà cung cấp",
      options: [
        { label: "Tất cả nhà cung cấp", value: "" },
        ...filterOptions.providers,
      ],
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
      buttonText: policyMessage.filter.apply,
      startContent: <SearchOutlined size={14} />,
      isSubmit: true,
    },
    {
      name: "clearButton",
      label: " ",
      type: "button",
      variant: "dashed",
      buttonText: policyMessage.filter.reset,
      startContent: <FilterOutlined size={14} />,
      onClick: handleClearFilters,
    },
  ];

  return (
    <Layout.Content className="policy-content">
      <div className="policy-space">
        <div className="policy-header">
          <div>
            <Title level={2} className="policy-title">
              <FileProtectOutlined className="policy-icon" />
              {policyMessage.title.list}
            </Title>
            <Text className="policy-subtitle">
              Quản lý và giám sát các đơn bảo hiểm nông nghiệp
            </Text>
          </div>
        </div>

        <div className="policy-summary-row">
          <div className="policy-summary-card-compact">
            <div className="policy-summary-icon total">
              <FileProtectOutlined />
            </div>
            <div className="policy-summary-content">
              <div className="policy-summary-value-compact">
                {summaryStats.totalPolicies}
              </div>
              <div className="policy-summary-label-compact">
                {policyMessage.stats.totalPolicies}
              </div>
            </div>
          </div>

          <div className="policy-summary-card-compact">
            <div className="policy-summary-icon active">
              <CheckCircleOutlined />
            </div>
            <div className="policy-summary-content">
              <div className="policy-summary-value-compact">
                {summaryStats.byStatus?.active || 0}
              </div>
              <div className="policy-summary-label-compact">Đang hoạt động</div>
            </div>
          </div>

          <div className="policy-summary-card-compact">
            <div className="policy-summary-icon pending">
              <ClockCircleOutlined />
            </div>
            <div className="policy-summary-content">
              <div className="policy-summary-value-compact">
                {summaryStats.byStatus?.pending_review || 0}
              </div>
              <div className="policy-summary-label-compact">Chờ xét duyệt</div>
            </div>
          </div>

          <div className="policy-summary-card-compact">
            <div className="policy-summary-icon approved">
              <CheckCircleOutlined />
            </div>
            <div className="policy-summary-content">
              <div className="policy-summary-value-compact">
                {summaryStats.byUnderwriting?.approved || 0}
              </div>
              <div className="policy-summary-label-compact">Đã phê duyệt</div>
            </div>
          </div>
        </div>

        <div className="policy-filters">
          <Collapse
            items={[
              {
                key: "1",
                label: (
                  <Space>
                    <FilterOutlined />
                    {policyMessage.filter.title}
                  </Space>
                ),
                children: (
                  <div className="policy-filter-form">
                    <CustomForm
                      fields={searchFields}
                      gridColumns="1fr 1fr 1fr 1fr"
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
          <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
          <SelectedColumn
            columns={columns}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
          />
        </div>

        <div className="policy-table-wrapper">
          <CustomTable
            columns={columns}
            dataSource={paginatedData}
            visibleColumns={visibleColumns}
            rowKey="id"
            scroll={{ x: 1800 }}
            pagination={paginationConfig}
          />
        </div>
      </div>
    </Layout.Content>
  );
}
