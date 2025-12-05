"use client";

import useDataSource from "@/services/hooks/common/use-data-source";
import { Card, Descriptions, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

export default function ConfigurationInfoTab({ trigger, conditions }) {
  const { fetchDataSourceById } = useDataSource();
  const [dataSourcesMap, setDataSourcesMap] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch data sources when conditions change
  useEffect(() => {
    const fetchDataSources = async () => {
      if (!conditions || conditions.length === 0) {
        return;
      }

      const dataSourceIds = conditions
        .map((c) => c.data_source_id)
        .filter(Boolean);

      if (dataSourceIds.length === 0) {
        return;
      }

      setLoading(true);
      const map = {};

      // Fetch each data source by ID
      for (const id of dataSourceIds) {
        const dataSource = await fetchDataSourceById(id);
        if (dataSource) {
          map[id] = dataSource;
        }
      }

      setDataSourcesMap(map);
      setLoading(false);
    };

    fetchDataSources();
  }, [conditions, fetchDataSourceById]);

  // Trigger conditions table columns
  const conditionsColumns = [
    {
      title: "Nguồn dữ liệu",
      dataIndex: "data_source_id",
      key: "data_source_id",
      render: (dataSourceId) => {
        const dataSource = dataSourcesMap[dataSourceId];

        if (loading && !dataSource) {
          return <Text type="secondary">Đang tải...</Text>;
        }

        return (
          <div>
            <Text strong>
              {dataSource?.display_name_vi || dataSource?.label || dataSourceId}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {dataSource?.parameter_name || dataSourceId}
            </Text>
          </div>
        );
      },
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
            {record.base_cost?.toLocaleString() || 0} ×{" "}
            {record.category_multiplier || 1} × {record.tier_multiplier || 1}
          </Text>
        </div>
      ),
    },
  ];

  return (
    <div className="configuration-info-tab">
      {/* Trigger Information */}
      {trigger && trigger.id && (
        <Card
          title="Thông tin kích hoạt"
          bordered={false}
          style={{ marginBottom: 16 }}
        >
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
