"use client";

import SelectedColumn from "@/components/column-selector";
import { CustomForm } from "@/components/custom-form";
import CustomTable from "@/components/custom-table";
import { usePartners } from "@/services/hooks/partner/use-partner";
import {
  BankOutlined,
  DownloadOutlined,
  EyeOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Collapse, Layout, Space, Spin, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";
import "./partner.css";

const { Title, Text } = Typography;

export default function PartnersPage() {
  const {
    filteredData,
    filterOptions,
    summaryStats,
    filters,
    updateFilters,
    clearFilters,
    loading,
  } = usePartners();

  const [visibleColumns, setVisibleColumns] = useState([
    "partner_name",
    "email",
    "phone",
    "hotline",
    "province",
    "rating",
    "experience",
    "clients",
    "claim_rate",
  ]);

  if (loading) {
    return (
      <Layout.Content className="partner-content">
        <div className="partner-loading">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </Layout.Content>
    );
  }

  const handleFormSubmit = (formData) => {
    updateFilters(formData);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const columns = [
    {
      title: "Tên đối tác",
      dataIndex: "partner_name",
      key: "partner_name",
      width: 200,
      render: (_, record) => (
        <div className="partner-name-simple">{record.partner_display_name}</div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (_, record) => record.partner_official_email,
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 130,
      render: (_, record) => record.partner_phone,
    },
    {
      title: "Hotline",
      dataIndex: "hotline",
      key: "hotline",
      width: 130,
      render: (_, record) => record.hotline,
    },
    {
      title: "Tỉnh/Thành phố",
      dataIndex: "province",
      key: "province",
      width: 150,
      render: (_, record) => record.province_name,
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      width: 100,
      render: (_, record) => (
        <span>
          {record.partner_rating_score.toFixed(1)} (
          {record.partner_rating_count})
        </span>
      ),
    },
    {
      title: "Kinh nghiệm",
      dataIndex: "experience",
      key: "experience",
      width: 120,
      render: (_, record) => `${record.trust_metric_experience} năm`,
    },
    {
      title: "Số khách hàng",
      dataIndex: "clients",
      key: "clients",
      width: 120,
      render: (_, record) => record.trust_metric_clients.toLocaleString(),
    },
    {
      title: "Tỷ lệ thanh toán",
      dataIndex: "claim_rate",
      key: "claim_rate",
      width: 130,
      render: (_, record) => `${record.trust_metric_claim_rate}%`,
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
      name: "partner_display_name",
      label: "Tên đối tác",
      type: "input",
      placeholder: "Tìm kiếm theo tên đối tác...",
      value: filters.partner_display_name,
    },
    {
      name: "partner_phone",
      label: "Số điện thoại",
      type: "input",
      placeholder: "Tìm kiếm theo số điện thoại...",
      value: filters.partner_phone,
    },
    {
      name: "province_name",
      label: "Tỉnh/Thành phố",
      type: "combobox",
      placeholder: "Chọn tỉnh/thành phố",
      options: filterOptions.provinces,
      value: filters.province_name,
    },
    {
      name: "partner_email",
      label: "Email",
      type: "input",
      placeholder: "Tìm kiếm theo email...",
      value: filters.partner_email,
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
              Quản lý Đối tác Bảo hiểm
            </Title>
            <Text className="partner-subtitle">
              Quản lý thông tin các đối tác bảo hiểm nông nghiệp
            </Text>
          </div>
        </div>

        <div className="partner-summary-row">
          <div className="partner-summary-card-compact">
            <div className="partner-summary-content">
              <div className="partner-summary-label-compact">Tổng đối tác</div>
              <div className="partner-summary-value-compact">
                {summaryStats.totalPartners}
              </div>
            </div>
          </div>

          <div className="partner-summary-card-compact">
            <div className="partner-summary-content">
              <div className="partner-summary-label-compact">
                Tỉnh/Thành phố
              </div>
              <div className="partner-summary-value-compact">
                {summaryStats.totalProvinces}
              </div>
            </div>
          </div>

          <div className="partner-summary-card-compact">
            <div className="partner-summary-content">
              <div className="partner-summary-label-compact">
                Đánh giá trung bình
              </div>
              <div className="partner-summary-value-compact">
                {summaryStats.avgRating}
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
                    <div className="space-y-4">
                      <CustomForm
                        fields={searchFields.slice(0, 3)}
                        gridColumns="1fr 1fr 1fr"
                        gap="16px"
                        onSubmit={handleFormSubmit}
                      />
                      <CustomForm
                        fields={searchFields.slice(3)}
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

        <div className="flex justify-start items-center gap-2 mb-2">
          <Link href="/accounts/partner/create">
            <Button type="primary" icon={<BankOutlined />}>
              Thêm đối tác
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
          rowKey="partner_id"
          scroll={{ x: 1400 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đối tác`,
          }}
        />
      </div>
    </Layout.Content>
  );
}
