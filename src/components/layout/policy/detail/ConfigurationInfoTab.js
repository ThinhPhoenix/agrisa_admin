"use client";

import { Card, Col, Collapse, Descriptions, Row, Table, Tag, Typography } from "antd";

const { Title, Text } = Typography;

export default function ConfigurationInfoTab({ trigger, conditions }) {
  // Trigger conditions table columns
  const conditionsColumns = [
    {
      title: "Nguồn dữ liệu",
      dataIndex: "data_source_id",
      key: "data_source_id",
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Data Source ID
          </Text>
        </div>
      ),
    },
    {
      title: "Hàm tổng hợp",
      key: "aggregation",
      render: (_, record) => (
        <div>
          <Tag color="blue">{record.aggregation_function}</Tag>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.aggregation_window_days} ngày
            {record.baseline_window_days && (
              <>
                {" "}
                | Baseline: {record.baseline_window_days} ngày (
                {record.baseline_function})
              </>
            )}
            {record.validation_window_days && (
              <> | Kiểm tra: {record.validation_window_days} ngày</>
            )}
          </Text>
        </div>
      ),
    },
    {
      title: "Điều kiện",
      key: "condition",
      render: (_, record) => (
        <div>
          <Text>
            {record.threshold_operator} {record.threshold_value}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: "11px" }}>
            Thứ tự: {record.condition_order || 1}
            {record.consecutive_required && " | Liên tiếp"}
            {record.include_component && " | Bao gồm Component"}
          </Text>
        </div>
      ),
    },
    {
      title: "Chi phí tính toán",
      key: "calculatedCost",
      align: "right",
      render: (_, record) => (
        <div>
          <Text strong style={{ color: "#52c41a" }}>
            {(record.calculated_cost || 0).toLocaleString("vi-VN")} ₫
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: "11px" }}>
            {record.base_cost?.toLocaleString() || 0} × {record.category_multiplier || 1} ×{" "}
            {record.tier_multiplier || 1}
          </Text>
        </div>
      ),
    },
  ];

  return (
    <div className="configuration-info-tab">
      {/* Trigger Information */}
      {trigger && trigger.id && (
        <Card title="Thông tin kích hoạt" bordered={false} style={{ marginBottom: 16 }}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Giai đoạn sinh trưởng">
              {trigger.growth_stage}
            </Descriptions.Item>
            <Descriptions.Item label="Toán tử logic">
              <Tag>{trigger.logical_operator}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Khoảng thời gian giám sát">
              {trigger.monitor_interval}{" "}
              {trigger.monitor_frequency_unit === "day"
                ? "ngày"
                : trigger.monitor_frequency_unit}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Conditions */}
      {conditions && conditions.length > 0 && (
        <Card
          title={`Điều kiện kích hoạt (${conditions.length})`}
          bordered={false}
        >
          <Table
            columns={conditionsColumns}
            dataSource={conditions}
            rowKey="id"
            pagination={false}
            size="middle"
          />
        </Card>
      )}
    </div>
  );
}
