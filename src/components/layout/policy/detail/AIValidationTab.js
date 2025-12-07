"use client";

import {
  BulbOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Alert, Card, Col, Divider, Row, Tag, Typography } from "antd";
import CustomTable from "../../../custom-table";

const { Text, Paragraph, Title } = Typography;

export default function AIValidationTab({
  validations = [],
  getSeverityBadge,
  getValidationStatusConfig,
}) {
  // Aggregate stats
  const totalValidations = validations.length;
  const totalMismatches = validations.reduce(
    (s, v) => s + (v.mismatches ? Object.keys(v.mismatches).length : 0),
    0
  );
  const totalWarnings = validations.reduce(
    (s, v) => s + (v.warning_count || 0),
    0
  );
  const totalRecommendations = validations.reduce(
    (s, v) =>
      s + (v.recommendations ? Object.keys(v.recommendations).length : 0),
    0
  );
  const totalPassedChecks = validations.reduce(
    (s, v) => s + (v.passed_checks || 0),
    0
  );
  const totalChecks = validations.reduce(
    (s, v) => s + (v.total_checks || 0),
    0
  );

  // Flatten mismatches and recommendations for table views
  const mismatchesData = [];
  const recommendationsData = [];
  const warningsData = [];
  validations.forEach((v, vi) => {
    const base = {
      validation_id: v.id,
      validated_by: v.validated_by,
      created_at: v.created_at,
      validation_status: v.validation_status,
    };
    if (v.mismatches) {
      Object.entries(v.mismatches).forEach(([key, value]) => {
        mismatchesData.push({
          key: `${v.id ?? vi}-${key}`,
          field: key,
          severity: value.severity,
          impact: value.impact,
          json_value: value.json_value,
          pdf_value: value.pdf_value,
          ...base,
        });
      });
    }
    if (v.recommendations) {
      Object.entries(v.recommendations).forEach(([key, value]) => {
        recommendationsData.push({
          key: `${v.id ?? vi}-${key}`,
          field: key,
          priority: value.priority,
          suggestion: value.suggestion,
          affected_fields: value.affected_fields,
          ...base,
        });
      });
    }
    if (v.warnings) {
      Object.entries(v.warnings).forEach(([key, value]) => {
        warningsData.push({
          key: `${v.id ?? vi}-${key}`,
          field: key,
          recommendation: value.recommendation || value.message || "-",
          ...base,
        });
      });
    }
  });

  const columns = [
    {
      title: "Trạng thái",
      dataIndex: "validation_status",
      key: "status",
      render: (status) => {
        const cfg = getValidationStatusConfig(status);
        return (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {cfg?.icon}
            <span>{cfg?.text}</span>
          </div>
        );
      },
    },
    {
      title: "Người xác thực",
      dataIndex: "validated_by",
      key: "validated_by",
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
      key: "created_at",
      render: (d) => new Date(d).toLocaleString("vi-VN"),
    },
    {
      title: "Kết quả",
      key: "result",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Text>
            <CheckCircleOutlined className="text-green-600" /> Đạt:{" "}
            {record.passed_checks}/{record.total_checks}
          </Text>
          {record.failed_checks > 0 && (
            <Text type="danger">
              <CloseCircleOutlined /> Lỗi: {record.failed_checks}
            </Text>
          )}
          {record.warning_count > 0 && (
            <Text type="warning">
              <WarningOutlined /> Cảnh báo: {record.warning_count}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Sai khác",
      key: "mismatch_count",
      render: (_, record) =>
        record.mismatches ? Object.keys(record.mismatches).length : 0,
    },
    {
      title: "Đề xuất",
      key: "recommendation_count",
      render: (_, record) =>
        record.recommendations ? Object.keys(record.recommendations).length : 0,
    },
    {
      title: "Ghi chú",
      dataIndex: "validation_notes",
      key: "notes",
      render: (n) => (n ? <Text ellipsis={{ tooltip: n }}>{n}</Text> : "-"),
    },
  ];

  const expandedRowRender = (validation) => (
    <div style={{ padding: 12 }}>
      {/* Mismatches */}
      {validation.mismatches &&
        Object.keys(validation.mismatches).length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <Text strong>
              <ExclamationCircleOutlined /> Sai khác:
            </Text>
            <div style={{ marginTop: 8 }}>
              {Object.entries(validation.mismatches).map(([key, value]) => (
                <Card
                  key={key}
                  size="small"
                  style={{
                    marginBottom: 8,
                    borderLeft: `3px solid ${
                      value.severity === "critical"
                        ? "#ff4d4f"
                        : value.severity === "important"
                        ? "#faad14"
                        : "#1890ff"
                    }`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text strong>{key}</Text>
                    {getSeverityBadge(value.severity)}
                  </div>
                  <Paragraph type="secondary" style={{ marginBottom: 8 }}>
                    {value.impact}
                  </Paragraph>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text type="secondary">Giá trị JSON:</Text>
                      <br />
                      <Text code>{JSON.stringify(value.json_value)}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Giá trị PDF:</Text>
                      <br />
                      <Text code>{JSON.stringify(value.pdf_value)}</Text>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          </div>
        )}

      {/* Warnings */}
      {validation.warnings && Object.keys(validation.warnings).length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <Text strong type="warning">
            <WarningOutlined /> Cảnh báo:
          </Text>
          <div style={{ marginTop: 8 }}>
            {Object.entries(validation.warnings).map(([key, value]) => (
              <Alert
                key={key}
                message={key}
                description={value.recommendation}
                type="warning"
                showIcon
                style={{ marginBottom: 8 }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {validation.recommendations &&
        Object.keys(validation.recommendations).length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <Text strong type="info">
              <CheckCircleOutlined /> Đề xuất:
            </Text>
            <div style={{ marginTop: 8 }}>
              {Object.entries(validation.recommendations).map(
                ([key, value]) => (
                  <Alert
                    key={key}
                    message={`${key} (Priority: ${value.priority})`}
                    description={
                      <div>
                        <Paragraph>{value.suggestion}</Paragraph>
                        {value.affected_fields && (
                          <div>
                            <Text type="secondary">
                              Các trường bị ảnh hưởng:
                            </Text>
                            <br />
                            {value.affected_fields.map((field) => (
                              <Tag key={field}>{field}</Tag>
                            ))}
                          </div>
                        )}
                      </div>
                    }
                    type="info"
                    showIcon
                    style={{ marginBottom: 8 }}
                  />
                )
              )}
            </div>
          </div>
        )}

      {validation.validation_notes && (
        <div>
          <Text type="secondary">Ghi chú: </Text>
          <Text>{validation.validation_notes}</Text>
        </div>
      )}
    </div>
  );
  return (
    <div className="ai-validation-tab">
      <div>
        <Title level={5} style={{ margin: 0 }}>
          Lịch sử xác thực AI ({validations.length})
        </Title>
        <Text type="secondary" style={{ fontSize: "12px" }}>
          Tóm tắt, lỗi sai và gợi ý cho bản chính sách này
        </Text>
      </div>

      {/* Summary cards: single responsive row with icons aligned to values */}
      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <Row gutter={16} style={{ display: "flex", flexWrap: "wrap" }}>
          <Col style={{ flex: "1 1 0", minWidth: 180, marginBottom: 8 }}>
            <Card size="small">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 28, color: "#1890ff", lineHeight: 1 }}>
                  <CalendarOutlined />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    {totalValidations}
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    Lần xác thực
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col style={{ flex: "1 1 0", minWidth: 180, marginBottom: 8 }}>
            <Card size="small">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 28, color: "#52c41a", lineHeight: 1 }}>
                  <CheckCircleOutlined />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    {totalPassedChecks}
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    Tổng kiểm tra đạt / {totalChecks}
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col style={{ flex: "1 1 0", minWidth: 180, marginBottom: 8 }}>
            <Card size="small">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 28, color: "#ff4d4f", lineHeight: 1 }}>
                  <CloseCircleOutlined />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    {totalMismatches}
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    Lỗi (Sai khác)
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col style={{ flex: "1 1 0", minWidth: 180, marginBottom: 8 }}>
            <Card size="small">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 28, color: "#faad14", lineHeight: 1 }}>
                  <WarningOutlined />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    {totalWarnings}
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>Cảnh báo</div>
                </div>
              </div>
            </Card>
          </Col>

          <Col style={{ flex: "1 1 0", minWidth: 180, marginBottom: 8 }}>
            <Card size="small">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 28, color: "#13c2c2", lineHeight: 1 }}>
                  <BulbOutlined />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    {totalRecommendations}
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>Gợi ý</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {validations.length === 0 ? (
        <Alert
          message="Chưa có lịch sử xác thực"
          description="Chính sách này chưa được xác thực bởi AI hoặc thủ công"
          type="info"
          showIcon
        />
      ) : (
        <>
          {/* Warnings table */}
          <Title level={5} style={{ marginTop: 8 }}>
            Cảnh báo ({warningsData.length})
          </Title>
          <CustomTable
            dataSource={warningsData}
            columns={[
              { title: "Vấn đề", dataIndex: "field", key: "field" },
              {
                title: "Gợi ý",
                dataIndex: "recommendation",
                key: "recommendation",
                render: (t) => <Text ellipsis={{ tooltip: t }}>{t}</Text>,
              },
              {
                title: "Xác thực",
                key: "validation",
                render: (_, r) => (
                  <div>
                    <div>{r.validated_by}</div>
                    <div style={{ color: "#888" }}>
                      {new Date(r.created_at).toLocaleString("vi-VN")}
                    </div>
                  </div>
                ),
              },
            ]}
            rowKey={(r) => r.key}
            pagination={{ pageSize: 8 }}
          />

          <Divider />
          {/* Mismatches table */}
          <Title level={5} style={{ marginTop: 8 }}>
            Lỗi/Sai khác ({mismatchesData.length})
          </Title>
          <CustomTable
            dataSource={mismatchesData}
            columns={[
              { title: "Trường", dataIndex: "field", key: "field" },
              {
                title: "Mức độ",
                dataIndex: "severity",
                key: "severity",
                render: (s) => getSeverityBadge(s),
              },
              {
                title: "Mô tả",
                dataIndex: "impact",
                key: "impact",
                render: (t) => <Text ellipsis={{ tooltip: t }}>{t}</Text>,
              },
              {
                title: "JSON",
                dataIndex: "json_value",
                key: "json",
                render: (j) => <Text code>{JSON.stringify(j)}</Text>,
              },
              {
                title: "PDF",
                dataIndex: "pdf_value",
                key: "pdf",
                render: (p) => <Text code>{JSON.stringify(p)}</Text>,
              },
              {
                title: "Xác thực",
                key: "validation",
                render: (_, r) => (
                  <div>
                    <div>{r.validated_by}</div>
                    <div style={{ color: "#888" }}>
                      {new Date(r.created_at).toLocaleString("vi-VN")}
                    </div>
                  </div>
                ),
              },
            ]}
            rowKey={(r) => r.key}
            pagination={{ pageSize: 8 }}
          />

          <Divider />

          {/* Recommendations table */}
          <Title level={5} style={{ marginTop: 8 }}>
            Gợi ý/Đề xuất ({recommendationsData.length})
          </Title>
          <CustomTable
            dataSource={recommendationsData}
            columns={[
              { title: "Vấn đề", dataIndex: "field", key: "field" },
              { title: "Ưu tiên", dataIndex: "priority", key: "priority" },
              {
                title: "Gợi ý",
                dataIndex: "suggestion",
                key: "suggestion",
                render: (t) => <Text ellipsis={{ tooltip: t }}>{t}</Text>,
              },
              {
                title: "Trường ảnh hưởng",
                dataIndex: "affected_fields",
                key: "affected_fields",
                render: (arr) =>
                  arr ? arr.map((f) => <Tag key={f}>{f}</Tag>) : "-",
              },
              {
                title: "Xác thực",
                key: "validation",
                render: (_, r) => (
                  <div>
                    <div>{r.validated_by}</div>
                    <div style={{ color: "#888" }}>
                      {new Date(r.created_at).toLocaleString("vi-VN")}
                    </div>
                  </div>
                ),
              },
            ]}
            rowKey={(r) => r.key}
            pagination={{ pageSize: 8 }}
          />
        </>
      )}
    </div>
  );
}
