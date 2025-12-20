"use client";

import SelectedColumn from "@/components/column-selector";
import { CustomForm } from "@/components/custom-form";
import CustomTable from "@/components/custom-table";
import { useTableData } from "@/services/hooks/common/use-table-data";
import { usePartnerDeletion } from "@/services/hooks/partner/use-partner-deletion";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  SearchOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  Button,
  Collapse,
  Layout,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import "../partner.css";

const { Title, Text } = Typography;

export default function DeletionRequestsPage() {
  const {
    deletionRequests,
    loading,
    fetchAllDeletionRequests,
    getStatusLabel,
    getStatusColor,
  } = usePartnerDeletion();

  const [visibleColumns, setVisibleColumns] = useState([
    "request_id",
    "partner_id",
    "requested_by",
    "requested_at",
    "status",
    "days_remaining",
  ]);

  // Fetch all deletion requests on mount
  useEffect(() => {
    fetchAllDeletionRequests();
  }, [fetchAllDeletionRequests]);

  // Calculate days remaining for revoke period
  const getDaysRemaining = (cancellableUntil, status) => {
    if (status !== "pending") return null;
    const now = new Date();
    const deadline = new Date(cancellableUntil);
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Frontend table data hook
  const {
    paginatedData,
    handleFormSubmit,
    handleClearFilters,
    paginationConfig,
    searchText,
    filters: tableFilters,
  } = useTableData(deletionRequests, {
    searchFields: [
      "request_id",
      "partner_id",
      "requested_by",
      "requested_by_name",
      "detailed_explanation",
    ],
    defaultFilters: {
      status: "",
    },
    pageSize: 10,
  });

  // Calculate summary stats
  const summaryStats = {
    total: deletionRequests.length,
    pending: deletionRequests.filter((r) => r.status === "pending").length,
    approved: deletionRequests.filter((r) => r.status === "approved").length,
    rejected: deletionRequests.filter((r) => r.status === "rejected").length,
    cancelled: deletionRequests.filter((r) => r.status === "cancelled").length,
  };

  if (loading && deletionRequests.length === 0) {
    return (
      <Layout.Content className="partner-content">
        <div className="partner-loading">
          <Spin size="large" tip="Đang tải dữ liệu yêu cầu hủy..." />
        </div>
      </Layout.Content>
    );
  }

  const columns = [
    {
      title: "Mã yêu cầu",
      dataIndex: "request_id",
      key: "request_id",
      width: 120,
      render: (_, record) => (
        <Tooltip title={record.request_id}>
          <div className="partner-name-simple">
            #{record.request_id.slice(0, 8)}...
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Đối tác",
      dataIndex: "partner_id",
      key: "partner_id",
      width: 180,
      render: (_, record) => (
        <Tooltip title={`Partner ID: ${record.partner_id}`}>
          <div className="partner-name-simple">
            {record.partner_id.slice(0, 8)}...
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Người yêu cầu",
      dataIndex: "requested_by",
      key: "requested_by",
      width: 180,
      render: (_, record) => {
        const displayName =
          record.requested_by_name && record.requested_by_name.trim()
            ? record.requested_by_name
            : record.requested_by;
        return (
          <Tooltip title={`User ID: ${record.requested_by}`}>
            <span>{displayName}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "requested_at",
      key: "requested_at",
      width: 160,
      render: (_, record) =>
        new Date(record.requested_at).toLocaleDateString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)}>
          {getStatusLabel(record.status)}
        </Tag>
      ),
    },
    {
      title: "Thời gian còn lại",
      dataIndex: "days_remaining",
      key: "days_remaining",
      width: 150,
      render: (_, record) => {
        const daysRemaining = getDaysRemaining(
          record.cancellable_until,
          record.status
        );
        if (daysRemaining === null) return "-";
        if (daysRemaining === 0) {
          return (
            <span style={{ color: "#52c41a" }}>
              <CheckCircleOutlined /> Có thể xử lý
            </span>
          );
        }
        return (
          <span style={{ color: "#faad14" }}>
            <ClockCircleOutlined /> {daysRemaining} ngày
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <div className="partner-actions-cell">
          <Link href={`/accounts/partner/${record.partner_id}`}>
            <Button
              type="dashed"
              size="small"
              className="partner-action-btn !bg-blue-100 !border-blue-200 !text-blue-800 hover:!bg-blue-200"
              title="Xem chi tiết đối tác"
            >
              <EyeOutlined size={14} />
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
      placeholder: "Tìm kiếm theo mã yêu cầu, ID đối tác, người yêu cầu...",
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "combobox",
      placeholder: "Chọn trạng thái",
      options: [
        { value: "", label: "Tất cả" },
        { value: "pending", label: getStatusLabel("pending") },
        { value: "approved", label: getStatusLabel("approved") },
        { value: "rejected", label: getStatusLabel("rejected") },
        { value: "cancelled", label: getStatusLabel("cancelled") },
        { value: "completed", label: getStatusLabel("completed") },
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
    <Layout.Content className="partner-content">
      <div className="partner-space">
        <div className="partner-header">
          <div>
            <Title level={2} className="partner-title">
              Quản lý Yêu cầu Hủy Đối tác
            </Title>
            <Text className="partner-subtitle">
              Theo dõi và xử lý các yêu cầu hủy đối tác bảo hiểm nông nghiệp
            </Text>
          </div>
        </div>

        <div className="partner-summary-row">
          <div className="partner-summary-card-compact">
            <div className="partner-summary-icon total">
              <DeleteOutlined />
            </div>
            <div className="partner-summary-content">
              <div className="partner-summary-label-compact">Tổng yêu cầu</div>
              <div className="partner-summary-value-compact">
                {summaryStats.total}
              </div>
            </div>
          </div>

          <div className="partner-summary-card-compact">
            <div className="partner-summary-icon rating">
              <ClockCircleOutlined />
            </div>
            <div className="partner-summary-content">
              <div className="partner-summary-label-compact">Chờ xử lý</div>
              <div className="partner-summary-value-compact">
                {summaryStats.pending}
              </div>
            </div>
          </div>

          <div className="partner-summary-card-compact">
            <div className="partner-summary-icon province">
              <CheckCircleOutlined />
            </div>
            <div className="partner-summary-content">
              <div className="partner-summary-label-compact">Đã duyệt</div>
              <div className="partner-summary-value-compact">
                {summaryStats.approved}
              </div>
            </div>
          </div>

          <div className="partner-summary-card-compact">
            <div
              className="partner-summary-icon total"
              style={{ background: "#ff4d4f", color: "#fff" }}
            >
              <CloseCircleOutlined />
            </div>
            <div className="partner-summary-content">
              <div className="partner-summary-label-compact">Đã từ chối</div>
              <div className="partner-summary-value-compact">
                {summaryStats.rejected}
              </div>
            </div>
          </div>

          <div className="partner-summary-card-compact">
            <div
              className="partner-summary-icon total"
              style={{ background: "#8c8c8c", color: "#fff" }}
            >
              <StopOutlined />
            </div>
            <div className="partner-summary-content">
              <div className="partner-summary-label-compact">Đã hủy</div>
              <div className="partner-summary-value-compact">
                {summaryStats.cancelled}
              </div>
            </div>
          </div>
        </div>

        <div className="partner-filters">
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
                  <div className="partner-filter-form">
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
          rowKey="request_id"
          scroll={{ x: 1200 }}
          pagination={paginationConfig}
        />
      </div>
    </Layout.Content>
  );
}
