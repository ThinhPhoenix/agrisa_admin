"use client";

import SelectedColumn from "@/components/column-selector";
import { CustomForm } from "@/components/custom-form";
import CustomTable from "@/components/custom-table";
import { useCategories } from "@/services/hooks/data/use-categories";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  Button,
  Collapse,
  Layout,
  message,
  Space,
  Spin,
  Typography,
} from "antd";
import Link from "next/link";
import { useState } from "react";
import "../data.css";

const { Title, Text } = Typography;

export default function CategoriesPage() {
  const {
    filteredData,
    filterOptions,
    summaryStats,
    filters,
    updateFilters,
    clearFilters,
    loading,
    error,
    lastUpdated,
  } = useCategories();

  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState([
    "category_name",
    "category_description",
    "category_cost_multiplier",
    "created_at",
  ]);

  // Loading state check
  if (loading) {
    return (
      <Layout.Content className="data-content">
        <div className="data-loading">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </Layout.Content>
    );
  }

  // Error state check
  if (error) {
    return (
      <Layout.Content className="data-content">
        <div className="data-error">
          <Typography.Text type="danger">
            Lỗi khi tải dữ liệu: {error.message}
          </Typography.Text>
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
      case "Tạm ngừng":
        return "orange";
      default:
        return "default";
    }
  };

  // Table columns
  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "category_name",
      key: "category_name",
      width: 200,
      render: (_, record) => (
        <div className="data-item-info">
          <div className="data-item-details">
            <div className="data-item-name">{record.category_name}</div>
            <div className="data-item-description">
              {record.category_description}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Hệ số chi phí",
      dataIndex: "category_cost_multiplier",
      key: "category_cost_multiplier",
      width: 150,
      render: (_, record) => (
        <div className="data-item-name">{record.category_cost_multiplier}x</div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 160,
      render: (_, record) => (
        <div className="data-created-at">
          <div className="data-date">
            {new Date(record.created_at).toLocaleDateString("vi-VN")}
          </div>
          <div className="data-time">
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
      width: 180,
      render: (_, record) => (
        <div className="data-actions-cell">
          <Button
            type="dashed"
            size="small"
            className="data-action-btn !bg-green-100 !border-green-200 !text-green-800 hover:!bg-green-200"
            onClick={() =>
              message.success("Chức năng chỉnh sửa đang được phát triển")
            }
          >
            <EditOutlined size={14} />
          </Button>
          <Button
            type="dashed"
            size="small"
            className="data-action-btn !bg-red-100 !border-red-200 !text-red-800 hover:!bg-red-200"
            onClick={() => message.error("Chức năng xóa đang được phát triển")}
          >
            <DeleteOutlined size={14} />
          </Button>
        </div>
      ),
    },
  ];

  // Search fields
  const searchFields = [
    {
      name: "name",
      label: "Tên danh mục",
      type: "input",
      placeholder: "Tìm kiếm theo tên...",
      value: filters.name,
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
    <Layout.Content className="data-content">
      <div className="data-space">
        {/* Header */}
        <div className="data-header">
          <div>
            <Title level={2} className="data-title">
              Quản lý Danh mục
            </Title>
            <Text className="data-subtitle">
              Quản lý các danh mục sản phẩm và phân loại
            </Text>
            {lastUpdated && (
              <Text className="data-last-updated" type="secondary">
                Cập nhật lần cuối:{" "}
                {new Date(lastUpdated).toLocaleString("vi-VN")}
              </Text>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="data-summary-row">
          <div className="data-summary-card-compact">
            <div className="data-summary-icon total">
              <TagOutlined />
            </div>
            <div className="data-summary-content">
              <div className="data-summary-value-compact">
                {summaryStats.totalItems}
              </div>
              <div className="data-summary-label-compact">Tổng danh mục</div>
            </div>
          </div>

          <div className="data-summary-card-compact">
            <div className="data-summary-icon active">
              <CheckCircleOutlined />
            </div>
            <div className="data-summary-content">
              <div className="data-summary-value-compact">
                {summaryStats.averageMultiplier}x
              </div>
              <div className="data-summary-label-compact">Hệ số TB</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="data-filters">
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
                  <div className="data-filter-form">
                    <div className="space-y-4">
                      <CustomForm
                        fields={searchFields}
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
          <Link href="/data/categories/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Tạo danh mục
            </Button>
          </Link>
          <Button
            icon={<DownloadOutlined />}
            onClick={() =>
              message.info("Chức năng nhập excel đang được phát triển")
            }
          >
            Nhập excel
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() =>
              message.info("Chức năng xuất excel đang được phát triển")
            }
          >
            Xuất excel
          </Button>
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
              `${range[0]}-${range[1]} của ${total} danh mục`,
          }}
        />
      </div>
    </Layout.Content>
  );
}
