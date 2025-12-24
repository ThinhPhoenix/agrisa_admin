"use client";

import {
  BulbOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Card,
  Col,
  Progress,
  Row,
  Statistic,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useMemo } from "react";
import CustomTable from "../../../custom-table";
import { getFieldLabel } from "../policyFieldMappings";

const { Text, Title } = Typography;

const getSeverityLabel = (severity) => {
  const map = {
    critical: "Nghiêm trọng",
    important: "Quan trọng",
    warning: "Cảnh báo",
    metadata: "Thông tin phụ",
    info: "Thông tin",
  };
  return map[severity] || severity;
};

const getSeverityColor = (severity) => {
  const map = {
    critical: "#ff4d4f",
    important: "#fa8c16",
    warning: "#faad14",
    metadata: "#8c8c8c",
    info: "#1890ff",
  };
  return map[severity] || "#1890ff";
};

const getPriorityLabel = (priority) => {
  const map = {
    high: "Cao",
    medium: "Trung bình",
    low: "Thấp",
  };
  return map[priority] || priority;
};

const getPriorityColor = (priority) => {
  const map = {
    high: "#ff4d4f",
    medium: "#faad14",
    low: "#52c41a",
  };
  return map[priority] || "#1890ff";
};

const getValidationStatusLabel = (status) => {
  const map = {
    pending: "Chờ xử lý",
    in_progress: "Đang kiểm tra",
    passed: "Đạt",
    failed: "Thất bại",
    warning: "Có cảnh báo",
    needs_review: "Cần xem xét",
    rejected: "Bị từ chối",
  };
  return map[status] || status;
};

export default function AIValidationTab({
  validations = [],
  getSeverityBadge,
  getValidationStatusConfig,
}) {
  // Aggregate stats
  const stats = useMemo(() => {
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
    const successRate =
      totalChecks > 0 ? Math.round((totalPassedChecks / totalChecks) * 100) : 0;

    return {
      totalValidations,
      totalMismatches,
      totalWarnings,
      totalRecommendations,
      totalPassedChecks,
      totalChecks,
      successRate,
    };
  }, [validations]);

  // Flatten data for tables
  const mismatchesData = useMemo(() => {
    const data = [];
    validations.forEach((v, vi) => {
      const base = {
        validation_id: v.id,
        validated_by: v.validated_by,
        created_at: v.created_at,
        validation_status: v.validation_status,
      };
      if (v.mismatches) {
        Object.entries(v.mismatches).forEach(([key, value]) => {
          data.push({
            key: `${v.id ?? vi}-${key}`,
            field: key,
            severity: value.severity,
            impact: value.impact,
            field_type: value.field_type,
            json_value: value.json_value,
            pdf_value: value.pdf_value,
            ...base,
          });
        });
      }
    });
    return data;
  }, [validations]);

  const warningsData = useMemo(() => {
    const data = [];
    validations.forEach((v, vi) => {
      const base = {
        validation_id: v.id,
        validated_by: v.validated_by,
        created_at: v.created_at,
      };
      if (v.warnings) {
        Object.entries(v.warnings).forEach(([key, value]) => {
          data.push({
            key: `${v.id ?? vi}-${key}`,
            field: key,
            recommendation: value.recommendation || value.message || "-",
            ...base,
          });
        });
      }
    });
    return data;
  }, [validations]);

  const recommendationsData = useMemo(() => {
    const data = [];
    validations.forEach((v, vi) => {
      const base = {
        validation_id: v.id,
        validated_by: v.validated_by,
        created_at: v.created_at,
      };
      if (v.recommendations) {
        Object.entries(v.recommendations).forEach(([key, value]) => {
          data.push({
            key: `${v.id ?? vi}-${key}`,
            field: key,
            priority: value.priority,
            suggestion: value.suggestion,
            affected_fields: value.affected_fields,
            ...base,
          });
        });
      }
    });
    return data;
  }, [validations]);

  // Glassmorphism tag style
  const getGlassmorphismTag = (color, label) => (
    <span
      style={{
        padding: "2px 12px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 500,
        background: `${color}20`,
        border: `1px solid ${color}60`,
        color: color,
        backdropFilter: "blur(10px)",
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );

  // Render expandable row for value comparison and metadata
  const renderExpandedRow = (record) => {
    const isDifferent = record.json_value !== record.pdf_value;
    const isNumeric =
      typeof record.json_value === "number" ||
      typeof record.pdf_value === "number";

    let percentDiff = null;
    if (isDifferent && isNumeric && record.json_value && record.pdf_value) {
      const diff =
        ((record.pdf_value - record.json_value) / record.json_value) * 100;
      percentDiff = Math.abs(diff).toFixed(1);
    }

    return (
      <div style={{ padding: "12px 24px", background: "#fafafa" }}>
        <Row gutter={24}>
          <Col span={6}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Kiểu dữ liệu
            </Text>
            <div>
              <Tag>{record.field_type || "N/A"}</Tag>
            </div>
          </Col>
          <Col span={6}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Giá trị hệ thống (JSON)
            </Text>
            <div>
              <Text code>{JSON.stringify(record.json_value)}</Text>
            </div>
          </Col>
          <Col span={6}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Giá trị hợp đồng (PDF)
            </Text>
            <div>
              <Text code>{JSON.stringify(record.pdf_value)}</Text>
            </div>
          </Col>
          <Col span={6}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Người xác thực
            </Text>
            <div>
              <Text>{record.validated_by || "-"}</Text>
            </div>
            <Text type="secondary" style={{ fontSize: 11, marginTop: 4 }}>
              {record.created_at
                ? new Date(record.created_at).toLocaleString("vi-VN")
                : "-"}
            </Text>
          </Col>
        </Row>
        {percentDiff && (
          <div style={{ marginTop: 8 }}>
            <Text type="danger" style={{ fontSize: 12 }}>
              Chênh lệch: {percentDiff}%
            </Text>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="ai-validation-tab">
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>
          Lịch sử xác thực AI ({validations.length})
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Tóm tắt, lỗi sai và gợi ý cho bản chính sách này
        </Text>
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
          {/* Summary Statistics */}
          <Row gutter={12} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card size="small" bodyStyle={{ padding: "12px" }}>
                <Statistic
                  title="Tỷ lệ thành công"
                  value={stats.successRate}
                  suffix="%"
                  valueStyle={{ fontSize: 20 }}
                />
                <Progress
                  percent={stats.successRate}
                  strokeColor={
                    stats.successRate >= 80
                      ? "#52c41a"
                      : stats.successRate >= 50
                      ? "#faad14"
                      : "#ff4d4f"
                  }
                  size="small"
                  showInfo={false}
                  style={{ marginTop: 4 }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" bodyStyle={{ padding: "12px" }}>
                <Statistic
                  title={<span style={{ fontSize: 12 }}>Đạt / Tổng</span>}
                  value={stats.totalPassedChecks}
                  suffix={`/ ${stats.totalChecks}`}
                  valueStyle={{ fontSize: 20 }}
                  prefix={<CheckCircleOutlined style={{ fontSize: 16 }} />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card size="small" bodyStyle={{ padding: "12px" }}>
                <Statistic
                  title={<span style={{ fontSize: 12 }}>Lỗi</span>}
                  value={stats.totalMismatches}
                  valueStyle={{ fontSize: 20, color: "#ff4d4f" }}
                  prefix={<CloseCircleOutlined style={{ fontSize: 16 }} />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card size="small" bodyStyle={{ padding: "12px" }}>
                <Statistic
                  title={<span style={{ fontSize: 12 }}>Cảnh báo</span>}
                  value={stats.totalWarnings}
                  valueStyle={{ fontSize: 20, color: "#faad14" }}
                  prefix={<WarningOutlined style={{ fontSize: 16 }} />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card size="small" bodyStyle={{ padding: "12px" }}>
                <Statistic
                  title={<span style={{ fontSize: 12 }}>Gợi ý</span>}
                  value={stats.totalRecommendations}
                  valueStyle={{ fontSize: 20, color: "#1890ff" }}
                  prefix={<BulbOutlined style={{ fontSize: 16 }} />}
                />
              </Card>
            </Col>
          </Row>

          {/* Mismatches Table */}
          <Title level={5} style={{ marginTop: 16, marginBottom: 12 }}>
            Lỗi sai ({mismatchesData.length})
          </Title>
          <CustomTable
            dataSource={mismatchesData}
            columns={[
              {
                title: "Trường dữ liệu",
                dataIndex: "field",
                key: "field",
                width: 200,
                fixed: "left",
                render: (field) => (
                  <Tooltip title={`Field: ${field}`} placement="topLeft">
                    <div>
                      <Text strong style={{ fontSize: "13px" }}>
                        {getFieldLabel(field)}
                      </Text>
                      <br />
                      <Text
                        type="secondary"
                        style={{ fontSize: "11px", fontStyle: "italic" }}
                      >
                        {field}
                      </Text>
                    </div>
                  </Tooltip>
                ),
              },
              {
                title: "Mức độ",
                dataIndex: "severity",
                key: "severity",
                width: 140,
                render: (severity) =>
                  getGlassmorphismTag(
                    getSeverityColor(severity),
                    getSeverityLabel(severity)
                  ),
              },
              {
                title: "Mô tả ảnh hưởng",
                dataIndex: "impact",
                key: "impact",
                width: 400,
                render: (text) => (
                  <div
                    style={{
                      whiteSpace: "pre-wrap",
                      maxHeight: "80px",
                      overflow: "auto",
                      lineHeight: "1.5",
                    }}
                  >
                    {text}
                  </div>
                ),
              },
            ]}
            expandable={{
              expandedRowRender: renderExpandedRow,
              rowExpandable: () => true,
            }}
            rowKey={(r) => r.key}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            size="small"
            scroll={{ x: 800 }}
          />

          {/* Warnings Table */}
          <Title level={5} style={{ marginTop: 24, marginBottom: 12 }}>
            Cảnh báo ({warningsData.length})
          </Title>
          <CustomTable
            dataSource={warningsData}
            columns={[
              {
                title: "Vấn đề",
                dataIndex: "field",
                key: "field",
                width: 200,
                fixed: "left",
                render: (field) => (
                  <Tooltip title={`Field: ${field}`} placement="topLeft">
                    <div>
                      <Text strong style={{ fontSize: "13px" }}>
                        {getFieldLabel(field)}
                      </Text>
                      <br />
                      <Text
                        type="secondary"
                        style={{ fontSize: "11px", fontStyle: "italic" }}
                      >
                        {field}
                      </Text>
                    </div>
                  </Tooltip>
                ),
              },
              {
                title: "Khuyến nghị",
                dataIndex: "recommendation",
                key: "recommendation",
                render: (text) => (
                  <div
                    style={{
                      whiteSpace: "pre-wrap",
                      maxHeight: "80px",
                      overflow: "auto",
                      lineHeight: "1.5",
                    }}
                  >
                    {text}
                  </div>
                ),
              },
            ]}
            rowKey={(r) => r.key}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            size="small"
            scroll={{ x: 600 }}
          />

          {/* Recommendations Table */}
          <Title level={5} style={{ marginTop: 24, marginBottom: 12 }}>
            Đề xuất cải thiện ({recommendationsData.length})
          </Title>
          <CustomTable
            dataSource={recommendationsData}
            columns={[
              {
                title: "Vấn đề",
                dataIndex: "field",
                key: "field",
                width: 180,
                fixed: "left",
              },
              {
                title: "Độ ưu tiên",
                dataIndex: "priority",
                key: "priority",
                width: 140,
                render: (priority) =>
                  getGlassmorphismTag(
                    getPriorityColor(priority),
                    getPriorityLabel(priority)
                  ),
              },
              {
                title: "Gợi ý",
                dataIndex: "suggestion",
                key: "suggestion",
                width: 350,
                render: (text) => (
                  <div
                    style={{
                      whiteSpace: "pre-wrap",
                      maxHeight: "80px",
                      overflow: "auto",
                      lineHeight: "1.5",
                    }}
                  >
                    {text}
                  </div>
                ),
              },
              {
                title: "Trường ảnh hưởng",
                dataIndex: "affected_fields",
                key: "affected_fields",
                width: 250,
                render: (arr) =>
                  arr && arr.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {arr.map((f) => (
                        <Tag key={f} style={{ marginBottom: 4 }}>
                          {f}
                        </Tag>
                      ))}
                    </div>
                  ) : (
                    <Text type="secondary">-</Text>
                  ),
              },
            ]}
            rowKey={(r) => r.key}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            size="small"
            scroll={{ x: 1000 }}
          />
        </>
      )}
    </div>
  );
}
