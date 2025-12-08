"use client";

import useDataSource from "@/services/hooks/common/use-data-source";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Card, Col, Divider, Row, Table, Tag, Typography } from "antd";
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
      {/* Combined Trigger + Conditions Card */}
      {(trigger || (conditions && conditions.length > 0)) && (
        <Card
          title={`Kích hoạt & Điều kiện (${
            conditions ? conditions.length : 0
          })`}
          bordered={false}
          style={{ marginBottom: 12 }}
          bodyStyle={{ padding: 12 }}
        >
          {/* Trigger info */}
          {trigger && trigger.id && (
            <div style={{ marginBottom: 16 }}>
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={24} md={24}>
                  <div style={{ display: "flex", alignItems: "flex-start" }}>
                    <EnvironmentOutlined
                      style={{
                        color: "#18573f",
                        marginRight: 10,
                        marginTop: 4,
                        fontSize: 20,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          fontSize: 14,
                          color: "#595959",
                          marginBottom: 4,
                        }}
                      >
                        Giai đoạn sinh trưởng
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 16,
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {trigger.growth_stage}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={12}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <SwapOutlined
                      style={{
                        color: "#18573f",
                        marginRight: 10,
                        fontSize: 20,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          fontSize: 14,
                          color: "#595959",
                          marginBottom: 4,
                        }}
                      >
                        Toán tử logic
                      </div>
                      <div style={{ marginTop: 0 }}>
                        <Tag style={{ fontSize: 14, padding: "4px 8px" }}>
                          {trigger.logical_operator}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={12}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ClockCircleOutlined
                      style={{
                        color: "#18573f",
                        marginRight: 10,
                        fontSize: 20,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          fontSize: 14,
                          color: "#595959",
                          marginBottom: 4,
                        }}
                      >
                        Khoảng thời gian giám sát
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>
                        {trigger.monitor_interval}{" "}
                        {trigger.monitor_frequency_unit === "day"
                          ? "ngày"
                          : trigger.monitor_frequency_unit}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}

          <Divider style={{ margin: "6px 0 12px" }} />

          {/* Conditions table (keep existing behavior) */}
          {conditions && conditions.length > 0 ? (
            <Table
              columns={conditionsColumns}
              dataSource={conditions}
              rowKey="id"
              pagination={false}
              size="small"
              style={{ marginTop: 0 }}
            />
          ) : (
            <div style={{ color: "#8c8c8c" }}>Không có điều kiện kích hoạt</div>
          )}
        </Card>
      )}
    </div>
  );
}
