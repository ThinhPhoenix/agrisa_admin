"use client";

import SelectedColumn from "@/components/column-selector";
import { CustomForm } from "@/components/custom-form";
import CustomTable from "@/components/custom-table";
import { parseTimestamp } from "@/libs/datetime";
import { useTableData } from "@/services/hooks/common/use-table-data";
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
import { useMemo, useState } from "react";
import "../data.css";

const { Title, Text } = Typography;
const { confirm } = Modal;

export default function SourcesPage() {
  const { data: rawData, filterOptions, loading, deleteSource } = useSources();

  // Setup useTableData hook for client-side filtering
  const {
    paginatedData,
    handleFormSubmit,
    handleClearFilters,
    paginationConfig,
  } = useTableData(rawData || [], {
    searchFields: ["display_name_vi", "parameter_name", "data_provider"],
    defaultFilters: {
      searchText: "",
      type: "all",
      status: "all",
    },
    pageSize: 10,
    filterHandlers: {
      searchText: (item, value) => {
        if (!value || value === "") return true;
        const searchLower = value.toLowerCase();
        return (
          item.display_name_vi?.toLowerCase().includes(searchLower) ||
          item.parameter_name?.toLowerCase().includes(searchLower) ||
          item.data_provider?.toLowerCase().includes(searchLower)
        );
      },
      type: (item, value) => {
        if (!value || value === "" || value === "all") return true;
        return item.data_source === value;
      },
      status: (item, value) => {
        if (!value || value === "" || value === "all") return true;
        const isActive = value === "active";
        return item.is_active === isActive;
      },
    },
  });

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

  // Calculate summary stats from paginated data
  const summaryStats = useMemo(() => {
    const allData = rawData || [];
    const totalItems = allData.length;
    const activeItems = allData.filter((item) => item.is_active).length;
    const totalCost = allData.reduce(
      (sum, item) => sum + (item.base_cost || 0),
      0
    );
    const averageCost = totalItems > 0 ? Math.round(totalCost / totalItems) : 0;

    return {
      totalItems,
      activeItems,
      averageCost,
    };
  }, [rawData]);

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
        <div className="data-item-name">
          {record.base_cost.toLocaleString("en-US")}₫
        </div>
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
      render: (_, record) => {
        const dateTime = parseTimestamp(record.created_at);
        return (
          <div className="data-created-at">
            <div className="data-date">{dateTime.date}</div>
            <div className="data-time">{dateTime.time}</div>
          </div>
        );
      },
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
      name: "searchText",
      label: "Tìm kiếm",
      type: "input",
      placeholder: "Tìm theo tên tham số, parameter, nhà cung cấp...",
    },
    {
      name: "type",
      label: "Nguồn dữ liệu",
      type: "combobox",
      placeholder: "Chọn nguồn",
      options: filterOptions.types,
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "combobox",
      placeholder: "Chọn trạng thái",
      options: filterOptions.statuses,
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
                {summaryStats.averageCost.toLocaleString("en-US")}₫
              </div>
              <div className="data-summary-label-compact">Giá Trung Bình</div>
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
          dataSource={paginatedData}
          visibleColumns={visibleColumns}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={paginationConfig}
        />
      </div>
    </Layout.Content>
  );
}
