"use client";

import SelectedColumn from "@/components/column-selector";
import { CustomForm } from "@/components/custom-form";
import CustomTable from "@/components/custom-table";
import { claimMessage } from "@/libs/message";
import { useClaims } from "@/services/hooks/claim";
import { useTableData } from "@/services/hooks/common/use-table-data";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  DownloadOutlined,
  ExperimentOutlined,
  EyeOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Collapse, Layout, Space, Spin, Tag, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";
import "./page.css";

const { Title, Text } = Typography;

export default function ClaimsPage() {
  const {
    data,
    filterOptions,
    summaryStats,
    filters,
    updateFilters,
    clearFilters,
    loading,
  } = useClaims();

  const [visibleColumns, setVisibleColumns] = useState([
    "claim_number",
    "policy_id",
    "claim_amount",
    "status",
    "trigger_time",
    "auto_generated",
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
    searchFields: ["claim_number", "registered_policy_id", "farm_id"],
    defaultFilters: {
      status: "",
    },
    pageSize: 10,
  });

  if (loading) {
    return (
      <Layout.Content className="claim-content">
        <div className="claim-loading">
          <Spin size="large" tip={claimMessage.loading.list} />
        </div>
      </Layout.Content>
    );
  }

  const handleClearFilters = () => {
    clearTableFilters();
    clearFilters();
  };

  // Helper function to render status badge
  const renderStatusBadge = (status) => {
    const statusConfigs = {
      generated: {
        color: "default",
        icon: <ClockCircleOutlined />,
        label: "Đã tạo",
      },
      pending_partner_review: {
        color: "orange",
        icon: <ClockCircleOutlined />,
        label: "Chờ đối tác xét duyệt",
      },
      approved: {
        color: "green",
        icon: <CheckCircleOutlined />,
        label: "Đã phê duyệt",
      },
      rejected: {
        color: "red",
        icon: <CloseCircleOutlined />,
        label: "Bị từ chối",
      },
      paid: {
        color: "purple",
        icon: <DollarOutlined />,
        label: "Đã thanh toán",
      },
    };

    const config = statusConfigs[status] || statusConfigs.generated;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.label}
      </Tag>
    );
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Helper function to format date from Unix timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Helper function to format datetime from ISO string
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    {
      title: "Mã bồi thường",
      dataIndex: "claim_number",
      key: "claim_number",
      width: 150,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Số đơn BH",
      dataIndex: "policy_id",
      key: "policy_id",
      width: 200,
      render: (_, record) => record.registered_policy_id || "-",
    },
    {
      title: "Nông trại",
      dataIndex: "farm_id",
      key: "farm_id",
      width: 200,
      render: (text) => text || "-",
    },
    {
      title: "Số tiền bồi thường",
      dataIndex: "claim_amount",
      key: "claim_amount",
      width: 150,
      align: "right",
      render: (amount) => (
        <strong className="text-blue-600">{formatCurrency(amount)}</strong>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 180,
      render: (status) => renderStatusBadge(status),
    },
    {
      title: "Thời gian kích hoạt",
      dataIndex: "trigger_timestamp",
      key: "trigger_timestamp",
      width: 130,
      render: (timestamp) => formatDate(timestamp),
    },
    {
      title: "Tự động",
      dataIndex: "auto_generated",
      key: "auto_generated",
      width: 100,
      align: "center",
      render: (auto) => (
        <Tag color={auto ? "blue" : "default"}>{auto ? "Có" : "Không"}</Tag>
      ),
    },
    {
      title: "Quyết định đối tác",
      dataIndex: "partner_decision",
      key: "partner_decision",
      width: 130,
      render: (decision) => {
        if (!decision) return "-";
        const labels = {
          approved: "Phê duyệt",
          rejected: "Từ chối",
          pending: "Chờ xét duyệt",
        };
        const color = decision === "approved" ? "green" : "red";
        return <Tag color={color}>{labels[decision] || decision}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render: (date) => formatDateTime(date),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <div className="claim-actions-cell">
          <Link href={`/claims/${record.id}`}>
            <Button
              type="dashed"
              size="small"
              className="claim-action-btn !bg-blue-100 !border-blue-200 !text-blue-800 hover:!bg-blue-200"
              title="Xem chi tiết"
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
      label: "Tìm kiếm...",
      type: "input",
      placeholder: "Mã bồi thường",
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
    <Layout.Content className="claim-content">
      <div className="claim-space">
        <div className="claim-header">
          <div>
            <Title level={2} className="claim-title">
              <DollarOutlined className="claim-icon" />
              Quản lý bồi thường
            </Title>
            <Text className="claim-subtitle">
              Quản lý và theo dõi các yêu cầu bồi thường bảo hiểm nông nghiệp
            </Text>
          </div>
          <Link href="/claims/test-trigger">
            <Button
              type="primary"
              icon={<ExperimentOutlined />}
              className="!bg-purple-600 hover:!bg-purple-700 !border-purple-600"
            >
              Giả lập điều kiện
            </Button>
          </Link>
        </div>

        <div className="claim-summary-row">
          <div className="claim-summary-card-compact">
            <div className="claim-summary-icon total">
              <DollarOutlined />
            </div>
            <div className="claim-summary-content">
              <div className="claim-summary-value-compact">
                {summaryStats.totalClaims}
              </div>
              <div className="claim-summary-label-compact">
                Tổng số bồi thường
              </div>
            </div>
          </div>

          <div className="claim-summary-card-compact">
            <div className="claim-summary-icon pending">
              <ClockCircleOutlined />
            </div>
            <div className="claim-summary-content">
              <div className="claim-summary-value-compact">
                {summaryStats.byStatus?.pending_partner_review || 0}
              </div>
              <div className="claim-summary-label-compact">Chờ xét duyệt</div>
            </div>
          </div>

          <div className="claim-summary-card-compact">
            <div className="claim-summary-icon approved">
              <CheckCircleOutlined />
            </div>
            <div className="claim-summary-content">
              <div className="claim-summary-value-compact">
                {summaryStats.byStatus?.approved || 0}
              </div>
              <div className="claim-summary-label-compact">Đã phê duyệt</div>
            </div>
          </div>

          <div className="claim-summary-card-compact">
            <div className="claim-summary-icon paid">
              <DollarOutlined />
            </div>
            <div className="claim-summary-content">
              <div className="claim-summary-value-compact">
                {summaryStats.byStatus?.paid || 0}
              </div>
              <div className="claim-summary-label-compact">Đã thanh toán</div>
            </div>
          </div>
        </div>

        <div className="claim-filters">
          <Collapse
            items={[
              {
                key: "1",
                label: (
                  <Space>
                    <FilterOutlined />
                    Bộ lọc
                  </Space>
                ),
                children: (
                  <div className="claim-filter-form">
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
          <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
          <SelectedColumn
            columns={columns}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
          />
        </div>

        <div className="claim-table-wrapper">
          <CustomTable
            columns={columns}
            dataSource={paginatedData}
            visibleColumns={visibleColumns}
            rowKey="id"
            scroll={{ x: 1400 }}
            pagination={paginationConfig}
          />
        </div>
      </div>
    </Layout.Content>
  );
}
