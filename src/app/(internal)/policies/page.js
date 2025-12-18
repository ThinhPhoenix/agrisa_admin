"use client";

import SelectedColumn from "@/components/column-selector";
import { CustomForm } from "@/components/custom-form";
import CustomTable from "@/components/custom-table";
import { useTableData } from "@/services/hooks/common/use-table-data";
import { usePolicies } from "@/services/hooks/policy";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  DownloadOutlined,
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
          <Spin size="large" tip={"Đang tải danh sách..."} />
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
      draft: {
        color: "default",
        icon: <ClockCircleOutlined />,
        text: "Nháp",
      },
      pending_review: {
        color: "orange",
        icon: <ClockCircleOutlined />,
        text: "Chờ xét duyệt",
      },
      pending_payment: {
        color: "cyan",
        icon: <DollarOutlined />,
        text: "Chờ thanh toán",
      },
      active: {
        color: "green",
        icon: <CheckCircleOutlined />,
        text: "Đang hoạt động",
      },
      expired: {
        color: "red",
        icon: <CloseCircleOutlined />,
        text: "Hết hạn",
      },
      cancelled: {
        color: "default",
        icon: <CloseCircleOutlined />,
        text: "Đã hủy",
      },
      rejected: {
        color: "red",
        icon: <CloseCircleOutlined />,
        text: "Từ chối",
      },
    };
    return configs[status] || configs.draft;
  };

  // Get underwriting status config
  const getUnderwritingStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "orange",
        icon: <ClockCircleOutlined />,
        text: "Chờ duyệt",
      },
      approved: {
        color: "green",
        icon: <CheckCircleOutlined />,
        text: "Đã phê duyệt",
      },
      rejected: {
        color: "red",
        icon: <CloseCircleOutlined />,
        text: "Từ chối",
      },
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
      title: "Số hợp đồng",
      dataIndex: "policy_number",
      key: "policy_number",
      width: 150,
      render: (text) => <strong>{text}</strong>,
    },
    // {
    //   title: policyMessage.table.farmerName,
    //   dataIndex: "farmer_id",
    //   key: "farmer_id",
    //   width: 150,
    //   render: (text) => text || "-",
    // },
    {
      title: "Tên trang trại",
      dataIndex: "farm_name",
      key: "farm_name",
      width: 180,
      render: (_, record) => record.farm?.farm_name || "-",
    },
    {
      title: "Sản phẩm cơ bản",
      dataIndex: "base_policy_name",
      key: "base_policy_name",
      width: 200,
      render: (_, record) => record.base_policy?.product_name || "-",
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "insurance_provider_id",
      key: "insurance_provider_id",
      width: 150,
      render: (text) => text || "-",
    },
    {
      title: "Số tiền bảo hiểm",
      dataIndex: "coverage_amount",
      key: "coverage_amount",
      width: 150,
      align: "right",
      render: (amount) => formatCurrency(amount),
    },
    {
      title: "Phí bảo hiểm",
      dataIndex: "total_farmer_premium",
      key: "total_farmer_premium",
      width: 130,
      align: "right",
      render: (amount) => formatCurrency(amount),
    },
    {
      title: "Trạng thái",
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
      title: "Trạng thái thẩm định",
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
      title: "Hành động",
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
              title={"Xem chi tiết"}
            >
              <EyeOutlined />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  const searchFields = [
    {
      name: "search",
      label: "Tìm kiếm",
      type: "input",
      placeholder: "Số hợp đồng",
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "combobox",
      placeholder: "Tất cả trạng thái",
      options: [
        { label: "Tất cả trạng thái", value: "" },
        ...filterOptions.statusOptions,
      ],
    },
    {
      name: "underwriting_status",
      label: "Trạng thái thẩm định",
      type: "combobox",
      placeholder: "Tất cả",
      options: [
        { label: "Tất cả", value: "" },
        ...filterOptions.underwritingOptions,
      ],
    },
    {
      name: "insurance_provider_id",
      label: "Nhà cung cấp",
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
      buttonText: "Áp dụng",
      startContent: <SearchOutlined size={14} />,
      isSubmit: true,
    },
    {
      name: "clearButton",
      label: " ",
      type: "button",
      variant: "dashed",
      buttonText: "Đặt lại",
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
              {"Quản lý hợp đồng"}
            </Title>
            <Text className="policy-subtitle">
              Quản lý và giám sát các hợp đồng bảo hiểm nông nghiệp
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
                Tổng số hợp đồng
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
                    {"Bộ lọc"}
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
