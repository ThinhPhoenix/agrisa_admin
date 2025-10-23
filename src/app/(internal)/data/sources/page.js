"use client";

import SelectedColumn from "@/components/column-selector";
import { CustomForm } from "@/components/custom-form";
import CustomTable from "@/components/custom-table";
import { useSources } from "@/services/hooks/data/use-sources";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  Button,
  Collapse,
  Layout,
  Modal,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useState } from "react";
import "../data.css";

const { Title, Text } = Typography;
const { confirm } = Modal;

export default function SourcesPage() {
  const {
    filteredData,
    filterOptions,
    summaryStats,
    filters,
    updateFilters,
    clearFilters,
    loading,
    deleteSource,
  } = useSources();

  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState([
    "display_name_vi",
    "parameter_name",
    "data_source",
    "data_provider",
    "base_cost",
    "accuracy_rating",
    "is_active",
    "created_at",
  ]);

  // Handle delete
  const handleDelete = (record) => {
    confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa nguồn dữ liệu "${record.display_name_vi}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteSource(record.id);
        } catch (err) {
          // Error is handled in the hook
        }
      },
    });
  };

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

  // Get type color
  const getTypeColor = (type) => {
    const colors = {
      weather: "blue",
      satellite: "green",
      derived: "orange",
    };
    return colors[type] || "default";
  };

  // Table columns
  const columns = [
    {
      title: "Tên tham số",
      dataIndex: "display_name_vi",
      key: "display_name_vi",
      width: 200,
      render: (_, record) => (
        <div className="data-item-info">
          <div className="data-item-details">
            <div className="data-item-name">{record.display_name_vi}</div>
            <div className="data-item-description">{record.parameter_name}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Nguồn dữ liệu",
      dataIndex: "data_source",
      key: "data_source",
      width: 120,
      render: (_, record) => (
        <Tag
          color={getTypeColor(record.data_source)}
          className="data-status-tag"
        >
          {record.data_source}
        </Tag>
      ),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "data_provider",
      key: "data_provider",
      width: 180,
      render: (_, record) => (
        <div className="data-item-name">{record.data_provider}</div>
      ),
    },
    {
      title: "Giá cơ bản",
      dataIndex: "base_cost",
      key: "base_cost",
      width: 100,
      render: (_, record) => (
        <div className="data-item-name">${record.base_cost}</div>
      ),
    },
    {
      title: "Độ chính xác",
      dataIndex: "accuracy_rating",
      key: "accuracy_rating",
      width: 120,
      render: (_, record) => (
        <div className="data-item-name">
          {(record.accuracy_rating * 100).toFixed(1)}%
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      width: 130,
      render: (_, record) => (
        <Tag
          color={record.is_active ? "green" : "orange"}
          className="data-status-tag"
        >
          {record.is_active ? "Hoạt động" : "Tạm ngừng"}
        </Tag>
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
          <Link href={`/data/sources/${record.id}`}>
            <Button
              type="dashed"
              size="small"
              className="data-action-btn !bg-blue-100 !border-blue-200 !text-blue-800 hover:!bg-blue-200"
            >
              <EyeOutlined size={14} />
            </Button>
          </Link>
          <Link href={`/data/sources/edit/${record.id}`}>
            <Button
              type="dashed"
              size="small"
              className="data-action-btn !bg-yellow-100 !border-yellow-200 !text-yellow-800 hover:!bg-yellow-200"
            >
              <EditOutlined size={14} />
            </Button>
          </Link>
          <Button
            type="dashed"
            size="small"
            danger
            className="data-action-btn"
            onClick={() => handleDelete(record)}
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
      label: "Tên tham số",
      type: "input",
      placeholder: "Tìm kiếm theo tên...",
      value: filters.name,
    },
    {
      name: "type",
      label: "Nguồn dữ liệu",
      type: "combobox",
      placeholder: "Chọn nguồn",
      options: filterOptions.types,
      value: filters.type,
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
              Quản lý Nguồn dữ liệu
            </Title>
            <Text className="data-subtitle">
              Quản lý các nguồn dữ liệu và kết nối
            </Text>
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
              <div className="data-summary-label-compact">Tổng nguồn</div>
            </div>
          </div>

          <div className="data-summary-card-compact">
            <div className="data-summary-icon active">
              <CheckCircleOutlined />
            </div>
            <div className="data-summary-content">
              <div className="data-summary-value-compact">
                {summaryStats.activeItems}
              </div>
              <div className="data-summary-label-compact">Đang hoạt động</div>
            </div>
          </div>

          <div className="data-summary-card-compact">
            <div className="data-summary-icon inactive">
              <TagOutlined />
            </div>
            <div className="data-summary-content">
              <div className="data-summary-value-compact">
                ${summaryStats.averageCost}
              </div>
              <div className="data-summary-label-compact">Giá TB</div>
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
                        gridColumns="1fr 1fr 1fr 1fr 1fr"
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
          <Link href="/data/sources/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Tạo nguồn
            </Button>
          </Link>
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
              `${range[0]}-${range[1]} của ${total} nguồn`,
          }}
        />
      </div>
    </Layout.Content>
  );
}
