import { policyMessage } from "@/libs/message";
import {
  SafetyOutlined,
  FileTextOutlined,
  DownloadOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import {
  Card,
  Descriptions,
  Typography,
  Empty,
  Spin,
  Button,
  Tag,
  Table,
  Space,
  Collapse,
} from "antd";

const { Title, Text } = Typography;

export function BasePolicyTab({
  basePolicy,
  loadingBasePolicy,
  formatCurrency,
  dataSourceNames = {},
  loadingDataSources = false,
}) {
  // Get base policy data from new API structure or fallback to old structure
  const policyData = basePolicy?.base_policy || basePolicy;
  const triggers = basePolicy?.triggers || [];
  const document = basePolicy?.document || {};
  const metadata = basePolicy?.metadata || {};

  if (loadingBasePolicy) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" tip="Đang tải thông tin gói bảo hiểm..." />
      </div>
    );
  }

  if (!basePolicy) {
    return <Empty description="Không có thông tin gói bảo hiểm" />;
  }

  // Format date from Unix timestamp
  const formatUnixDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "draft":
        return "orange";
      case "inactive":
        return "red";
      default:
        return "default";
    }
  };

  // Trigger conditions table columns
  const conditionColumns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Nguồn dữ liệu",
      dataIndex: "data_source_id",
      key: "data_source_id",
      render: (id) => (
        <Space direction="vertical" size="small">
          <Tag color="blue">{id}</Tag>
          {loadingDataSources ? (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              <Spin size="small" /> Đang tải...
            </Text>
          ) : dataSourceNames[id] ? (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {dataSourceNames[id]}
            </Text>
          ) : null}
        </Space>
      ),
    },
    {
      title: "Điều kiện",
      key: "condition",
      render: (_, record) => (
        <span>
          {record.threshold_operator} {record.threshold_value}
        </span>
      ),
    },
    {
      title: "Hàm tổng hợp",
      dataIndex: "aggregation_function",
      key: "aggregation_function",
      render: (func) => <Tag color="purple">{func?.toUpperCase()}</Tag>,
    },
    {
      title: "Cửa sổ tổng hợp",
      dataIndex: "aggregation_window_days",
      key: "aggregation_window_days",
      render: (days) => `${days} ngày`,
    },
    {
      title: "Chi phí",
      dataIndex: "calculated_cost",
      key: "calculated_cost",
      render: (cost) => formatCurrency(cost),
    },
  ];

  return (
    <Space direction="vertical" size="large" className="w-full">
      {/* Base Policy Information */}
      <Card
        className="border-gray-200"
        style={{
          backgroundColor: "#fefcf5",
          borderColor: "#e5e7eb",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SafetyOutlined className="text-lg text-blue-500" />
            <Title level={5} className="mb-0">
              Thông tin gói bảo hiểm
            </Title>
          </div>
          {document.presigned_url && (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => window.open(document.presigned_url, "_blank")}
            >
              Tải PDF
            </Button>
          )}
        </div>
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
          <Descriptions.Item label="Tên sản phẩm">
            <strong>{policyData.product_name}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Mã sản phẩm">
            {policyData.product_code}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={getStatusColor(policyData.status)}>
              {policyData.status === "active"
                ? "Hoạt động"
                : policyData.status === "draft"
                ? "Nháp"
                : "Không hoạt động"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Loại cây trồng">
            {policyData.crop_type === "rice" ? "Lúa" : policyData.crop_type}
          </Descriptions.Item>
          <Descriptions.Item label="Đơn vị tiền tệ">
            {policyData.coverage_currency}
          </Descriptions.Item>
          <Descriptions.Item label="Thời hạn bảo hiểm">
            {policyData.coverage_duration_days} ngày
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Premium & Payout Information */}
      <Card
        className="border-gray-200"
        style={{
          backgroundColor: "#fefcf5",
          borderColor: "#e5e7eb",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChartOutlined className="text-lg text-green-500" />
          <Title level={5} className="mb-0">
            Thông tin phí & bồi thường
          </Title>
        </div>
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
          <Descriptions.Item label="Phí bảo hiểm cố định">
            <strong>{formatCurrency(policyData.fix_premium_amount)}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Tính theo hecta">
            <Tag color={policyData.is_per_hectare ? "green" : "default"}>
              {policyData.is_per_hectare ? "Có" : "Không"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tỷ lệ phí cơ bản">
            {policyData.premium_base_rate}
          </Descriptions.Item>
          <Descriptions.Item label="Số tiền bồi thường cố định">
            <strong className="text-blue-600">
              {formatCurrency(policyData.fix_payout_amount)}
            </strong>
          </Descriptions.Item>
          <Descriptions.Item label="Bồi thường theo hecta">
            <Tag color={policyData.is_payout_per_hectare ? "green" : "default"}>
              {policyData.is_payout_per_hectare ? "Có" : "Không"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Hệ số vượt ngưỡng">
            {policyData.over_threshold_multiplier}
          </Descriptions.Item>
          <Descriptions.Item label="Tỷ lệ bồi thường cơ bản">
            {policyData.payout_base_rate}
          </Descriptions.Item>
          <Descriptions.Item label="Giới hạn bồi thường">
            <strong className="text-red-600">
              {formatCurrency(policyData.payout_cap)}
            </strong>
          </Descriptions.Item>
          <Descriptions.Item label="Tỷ lệ hủy bỏ">
            {policyData.cancel_premium_rate}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Enrollment & Valid Period */}
      <Card
        className="border-gray-200"
        style={{
          backgroundColor: "#fefcf5",
          borderColor: "#e5e7eb",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FileTextOutlined className="text-lg text-orange-500" />
          <Title level={5} className="mb-0">
            Thời gian đăng ký & hiệu lực
          </Title>
        </div>
        <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
          <Descriptions.Item label="Ngày bắt đầu đăng ký">
            {formatUnixDate(policyData.enrollment_start_day)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc đăng ký">
            {formatUnixDate(policyData.enrollment_end_day)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày bắt đầu hiệu lực">
            {formatUnixDate(policyData.insurance_valid_from_day)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc hiệu lực">
            {formatUnixDate(policyData.insurance_valid_to_day)}
          </Descriptions.Item>
          <Descriptions.Item label="Gia hạn thanh toán tối đa">
            {policyData.max_premium_payment_prolong} ngày
          </Descriptions.Item>
          <Descriptions.Item label="Tự động gia hạn">
            <Tag color={policyData.auto_renewal ? "green" : "default"}>
              {policyData.auto_renewal ? "Có" : "Không"}
            </Tag>
          </Descriptions.Item>
          {policyData.auto_renewal && (
            <Descriptions.Item label="Tỷ lệ giảm giá khi gia hạn" span={2}>
              {(policyData.renewal_discount_rate * 100).toFixed(0)}%
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Description */}
      {policyData.product_description && (
        <Card
          className="border-gray-200"
          style={{
            backgroundColor: "#fefcf5",
            borderColor: "#e5e7eb",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FileTextOutlined className="text-lg text-red-400" />
            <Title level={5} className="mb-0">
              Mô tả sản phẩm
            </Title>
          </div>
          <Text>{policyData.product_description}</Text>
        </Card>
      )}

      {/* Document Information */}
      {document.has_document && (
        <Card
          className="border-gray-200"
          style={{
            backgroundColor: "#fefcf5",
            borderColor: "#e5e7eb",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FileTextOutlined className="text-lg text-purple-500" />
            <Title level={5} className="mb-0">
              Thông tin tài liệu
            </Title>
          </div>
          <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
            <Descriptions.Item label="Trạng thái xác thực">
              <Tag
                color={
                  policyData.document_validation_status === "passed"
                    ? "green"
                    : "orange"
                }
              >
                {policyData.document_validation_status === "passed"
                  ? "Đã xác thực"
                  : "Chưa xác thực"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Kích thước file">
              {(document.file_size_bytes / 1024 / 1024).toFixed(2)} MB
            </Descriptions.Item>
            <Descriptions.Item label="Loại file">
              {document.content_type}
            </Descriptions.Item>
            <Descriptions.Item label="Hết hạn URL">
              {document.presigned_url_expiry
                ? new Date(document.presigned_url_expiry).toLocaleString("vi-VN")
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Triggers & Conditions */}
      {triggers.length > 0 && (
        <Card
          className="border-gray-200"
          style={{
            backgroundColor: "#fefcf5",
            borderColor: "#e5e7eb",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <ThunderboltOutlined className="text-lg text-yellow-600" />
            <Title level={5} className="mb-0">
              Điều kiện kích hoạt bồi thường
            </Title>
            <Tag color="blue">{triggers.length} trigger(s)</Tag>
          </div>

          <Collapse
            items={triggers.map((trigger, index) => ({
              key: trigger.id,
              label: (
                <div className="flex items-center gap-3">
                  <span className="font-semibold">Trigger #{index + 1}</span>
                  <Tag color="purple">{trigger.logical_operator}</Tag>
                  <Text type="secondary">
                    Giám sát: {trigger.monitor_interval}{" "}
                    {trigger.monitor_frequency_unit === "day"
                      ? "ngày"
                      : trigger.monitor_frequency_unit}
                  </Text>
                  {trigger.growth_stage && (
                    <Tag color="green">Giai đoạn: {trigger.growth_stage}</Tag>
                  )}
                </div>
              ),
              children: (
                <Table
                  columns={conditionColumns}
                  dataSource={trigger.conditions || []}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  bordered
                />
              ),
            }))}
          />
        </Card>
      )}

      {/* Metadata */}
      {metadata.total_triggers !== undefined && (
        <Card
          className="border-gray-200"
          style={{
            backgroundColor: "#fefcf5",
            borderColor: "#e5e7eb",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChartOutlined className="text-lg text-cyan-500" />
            <Title level={5} className="mb-0">
              Thống kê
            </Title>
          </div>
          <Descriptions column={{ xs: 2, sm: 4 }} bordered size="small">
            <Descriptions.Item label="Tổng số trigger">
              <Tag color="blue">{metadata.total_triggers}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tổng số điều kiện">
              <Tag color="green">{metadata.total_conditions}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tổng chi phí dữ liệu">
              <strong>{formatCurrency(metadata.total_data_cost)}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Số nguồn dữ liệu">
              <Tag color="purple">{metadata.data_source_count}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </Space>
  );
}
