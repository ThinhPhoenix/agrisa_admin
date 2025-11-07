"use client";

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Card,
  Col,
  Row,
  Timeline,
  Typography,
  Tag,
} from "antd";

const { Text, Paragraph, Title } = Typography;

export default function AIValidationTab({
  validations = [],
  getSeverityBadge,
  getValidationStatusConfig,
}) {
  return (
    <div className="ai-validation-tab">
      <Card
        title={
          <div>
            <Title level={5} style={{ margin: 0 }}>
              Lịch sử xác thực AI ({validations.length})
            </Title>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Tất cả các lần xác thực AI và thủ công cho bản chính sách này
            </Text>
          </div>
        }
        bordered={false}
      >
        {validations.length > 0 ? (
          <Timeline
            items={validations.map((validation) => {
              const vStatusConfig = getValidationStatusConfig(
                validation.validation_status
              );
              return {
                color: vStatusConfig.color,
                dot: vStatusConfig.icon,
                children: (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <Text strong>
                        {vStatusConfig.text} - {validation.validated_by}
                      </Text>
                      <Text type="secondary">
                        {new Date(validation.created_at).toLocaleString("vi-VN")}
                      </Text>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        marginBottom: "12px",
                      }}
                    >
                      <Text>
                        <CheckCircleOutlined className="text-green-600" /> Đạt:{" "}
                        {validation.passed_checks}/{validation.total_checks}
                      </Text>
                      {validation.failed_checks > 0 && (
                        <Text type="danger">
                          <CloseCircleOutlined /> Lỗi: {validation.failed_checks}
                        </Text>
                      )}
                      {validation.warning_count > 0 && (
                        <Text type="warning">
                          <WarningOutlined /> Cảnh báo:{" "}
                          {validation.warning_count}
                        </Text>
                      )}
                    </div>

                    {/* Mismatches */}
                    {validation.mismatches &&
                      Object.keys(validation.mismatches).length > 0 && (
                        <div style={{ marginTop: "12px" }}>
                          <Text strong>
                            <ExclamationCircleOutlined /> Sai khác:
                          </Text>
                          <div style={{ marginTop: "8px" }}>
                            {Object.entries(validation.mismatches).map(
                              ([key, value]) => (
                                <Card
                                  key={key}
                                  size="small"
                                  style={{
                                    marginBottom: "8px",
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
                                      marginBottom: "4px",
                                    }}
                                  >
                                    <Text strong>{key}</Text>
                                    {getSeverityBadge(value.severity)}
                                  </div>
                                  <Paragraph
                                    type="secondary"
                                    style={{ marginBottom: "8px" }}
                                  >
                                    {value.impact}
                                  </Paragraph>
                                  <Row gutter={16}>
                                    <Col span={12}>
                                      <Text type="secondary">Giá trị JSON:</Text>
                                      <br />
                                      <Text code>
                                        {JSON.stringify(value.json_value)}
                                      </Text>
                                    </Col>
                                    <Col span={12}>
                                      <Text type="secondary">Giá trị PDF:</Text>
                                      <br />
                                      <Text code>
                                        {JSON.stringify(value.pdf_value)}
                                      </Text>
                                    </Col>
                                  </Row>
                                </Card>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Warnings */}
                    {validation.warnings &&
                      Object.keys(validation.warnings).length > 0 && (
                        <div style={{ marginTop: "12px" }}>
                          <Text strong type="warning">
                            <WarningOutlined /> Cảnh báo:
                          </Text>
                          <div style={{ marginTop: "8px" }}>
                            {Object.entries(validation.warnings).map(
                              ([key, value]) => (
                                <Alert
                                  key={key}
                                  message={key}
                                  description={value.recommendation}
                                  type="warning"
                                  showIcon
                                  style={{ marginBottom: "8px" }}
                                />
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Recommendations */}
                    {validation.recommendations &&
                      Object.keys(validation.recommendations).length > 0 && (
                        <div style={{ marginTop: "12px" }}>
                          <Text strong type="info">
                            <CheckCircleOutlined /> Đề xuất:
                          </Text>
                          <div style={{ marginTop: "8px" }}>
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
                                  style={{ marginBottom: "8px" }}
                                />
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {validation.validation_notes && (
                      <div style={{ marginTop: "12px" }}>
                        <Text type="secondary">Ghi chú: </Text>
                        <Text>{validation.validation_notes}</Text>
                      </div>
                    )}
                  </div>
                ),
              };
            })}
          />
        ) : (
          <Alert
            message="Chưa có lịch sử xác thực"
            description="Chính sách này chưa được xác thực bởi AI hoặc thủ công"
            type="info"
            showIcon
          />
        )}
      </Card>
    </div>
  );
}
