"use client";

import mockData from "@/app/(internal)/data/mock.json";
import SelectedColumn from "@/components/column-selector";
import { CustomForm } from "@/components/custom-form";
import CustomTable from "@/components/custom-table";
import { useTiers } from "@/services/hooks/data/use-tiers";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
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

export default function TiersPage() {
  const {
    filteredData,
    filterOptions,
    summaryStats,
    filters,
    updateFilters,
    clearFilters,
    loading,
    deleteTier,
  } = useTiers();

  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState([
    "tier_name",
    "tier_level",
    "data_tier_multiplier",
    "data_tier_category_id",
    "created_at",
  ]);

  // Delete confirmation state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingTier, setDeletingTier] = useState(null);

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

  // Handle delete tier
  const handleDeleteTier = (tier) => {
    setDeletingTier(tier);
    setDeleteModalVisible(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (deletingTier) {
      try {
        await deleteTier(deletingTier.id);
        setDeleteModalVisible(false);
        setDeletingTier(null);
      } catch (err) {
        // Error is handled in the hook
      }
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setDeletingTier(null);
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

  // Get level color
  const getLevelColor = (level) => {
    const colors = {
      1: "green",
      2: "blue",
      3: "orange",
      4: "red",
    };
    return colors[level] || "default";
  };

  // Table columns
  const columns = [
    {
      title: "Tên cấp độ",
      dataIndex: "tier_name",
      key: "tier_name",
      width: 200,
      render: (_, record) => (
        <div className="data-item-info">
          <div className="data-item-details">
            <div className="data-item-name">{record.tier_name}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Cấp",
      dataIndex: "tier_level",
      key: "tier_level",
      width: 80,
      render: (_, record) => (
        <Tag
          color={getLevelColor(record.tier_level)}
          className="data-status-tag"
        >
          {record.tier_level}
        </Tag>
      ),
    },
    {
      title: "Hệ số",
      dataIndex: "data_tier_multiplier",
      key: "data_tier_multiplier",
      width: 100,
      render: (_, record) => (
        <div className="data-item-name">{record.data_tier_multiplier}x</div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "data_tier_category_id",
      key: "data_tier_category_id",
      width: 150,
      render: (_, record) => {
        const category = mockData.dataTierCategories?.find(
          (cat) => cat.id === record.data_tier_category_id
        );
        return (
          <div className="data-item-name">
            {category?.category_name || record.data_tier_category_id}
          </div>
        );
      },
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
          <Link href={`/data/tiers/${record.id}`}>
            <Button
              type="dashed"
              size="small"
              className="data-action-btn !bg-blue-100 !border-blue-200 !text-blue-800 hover:!bg-blue-200"
            >
              <EyeOutlined size={14} />
            </Button>
          </Link>
          <Link href={`/data/tiers/edit/${record.id}`}>
            <Button
              type="dashed"
              size="small"
              className="data-action-btn !bg-green-100 !border-green-200 !text-green-800 hover:!bg-green-200"
            >
              <EditOutlined size={14} />
            </Button>
          </Link>
          <Button
            type="dashed"
            size="small"
            className="data-action-btn !bg-red-100 !border-red-200 !text-red-800 hover:!bg-red-200"
            onClick={() => handleDeleteTier(record)}
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
      label: "Tên cấp độ",
      type: "input",
      placeholder: "Tìm kiếm theo tên...",
      value: filters.name,
    },
    {
      name: "category",
      label: "Danh mục",
      type: "combobox",
      placeholder: "Chọn danh mục",
      options: filterOptions.categories,
      value: filters.category,
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
              Quản lý Cấp độ
            </Title>
            <Text className="data-subtitle">
              Quản lý các cấp độ thành viên và quyền lợi
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
              <div className="data-summary-label-compact">Tổng cấp độ</div>
            </div>
          </div>

          <div className="data-summary-card-compact">
            <div className="data-summary-icon active">
              <CheckCircleOutlined />
            </div>
            <div className="data-summary-content">
              <div className="data-summary-value-compact">
                {summaryStats.highestLevel}
              </div>
              <div className="data-summary-label-compact">Cấp cao nhất</div>
            </div>
          </div>

          <div className="data-summary-card-compact">
            <div className="data-summary-icon inactive">
              <TagOutlined />
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
          <Link href="/data/tiers/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Tạo cấp độ
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
              `${range[0]}-${range[1]} của ${total} cấp độ`,
          }}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          title="Xác nhận xóa cấp độ"
          open={deleteModalVisible}
          onOk={confirmDelete}
          onCancel={cancelDelete}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <p>
            Bạn có chắc chắn muốn xóa cấp độ{" "}
            <strong>{deletingTier?.tier_name}</strong> không?
          </p>
          <p className="text-red-600 text-sm">
            Hành động này không thể hoàn tác.
          </p>
        </Modal>
      </div>
    </Layout.Content>
  );
}
