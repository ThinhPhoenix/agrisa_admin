"use client";

import ValidationFormModal from "@/components/layout/policy/detail/ValidationFormModal";
import { usePendingPolicies } from "@/services/hooks/policy/use-pending-policies";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FilePdfOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Descriptions,
  Layout,
  Modal,
  Row,
  Spin,
  Tag,
  Timeline,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../policy.css";

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getPolicyDetail, submitValidation } = usePendingPolicies();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [validationModalMode, setValidationModalMode] = useState("manual"); // "manual", "accept_ai", "override"

  const fetchPolicyDetail = async () => {
    try {
      setLoading(true);
      const data = await getPolicyDetail(params.id);
      setPolicy(data);
    } catch (err) {
      console.error("Error fetching policy:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchPolicyDetail();
    }
  }, [params.id]);

  // Get validation status config
  const getValidationStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "orange",
        icon: <ClockCircleOutlined />,
        text: "Chờ duyệt",
      },
      passed_ai: {
        color: "cyan",
        icon: <CheckCircleOutlined />,
        text: "AI duyệt",
      },
      passed: {
        color: "green",
        icon: <CheckCircleOutlined />,
        text: "Đã duyệt",
      },
      failed: { color: "red", icon: <CloseCircleOutlined />, text: "Thất bại" },
      warning: {
        color: "gold",
        icon: <WarningOutlined />,
        text: "Cảnh báo",
      },
    };
    return configs[status] || configs.pending;
  };

  // Get severity badge
  const getSeverityBadge = (severity) => {
    const configs = {
      critical: { color: "red", text: "Nghiêm trọng" },
      important: { color: "orange", text: "Quan trọng" },
      metadata: { color: "blue", text: "Thông tin" },
      low: { color: "blue", text: "Thấp" },
      medium: { color: "orange", text: "Trung bình" },
      high: { color: "red", text: "Cao" },
    };
    const config = configs[severity] || configs.metadata;
    return <Badge color={config.color} text={config.text} />;
  };

  // Get crop type display
  const getCropTypeDisplay = (cropType) => {
    const types = {
      rice: "Lúa",
      corn: "Ngô",
      coffee: "Cà phê",
      pepper: "Hồ tiêu",
      rubber: "Cao su",
    };
    return types[cropType] || cropType;
  };

  // Format currency VND
  const formatCurrency = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Handle accept AI validation
  const handleAcceptAI = () => {
    setValidationModalMode("accept_ai");
    setValidationModalOpen(true);
  };

  // Handle manual validate
  const handleManualValidate = (mode) => {
    setValidationModalMode(mode);
    setValidationModalOpen(true);
  };

  // Handle validation form submit
  const handleValidationSubmit = async (validationData) => {
    try {
      await submitValidation(validationData);
      setValidationModalOpen(false);
      // Refresh data
      await fetchPolicyDetail();
    } catch (err) {
      console.error("Error submitting validation:", err);
      // Error is already handled in hook
    }
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
    const pdfUrl = basePolicy.template_document_url;
    if (pdfUrl) {
      // If it's a full URL, open in new tab
      if (pdfUrl.startsWith("http")) {
        window.open(pdfUrl, "_blank");
      } else {
        // If it's just a path/key, construct MinIO or S3 URL
        // TODO: Replace with actual MinIO/S3 base URL from env
        const baseUrl =
          process.env.NEXT_PUBLIC_MINIO_URL || "https://minio.example.com";
        const fullUrl = `${baseUrl}/${pdfUrl}`;
        window.open(fullUrl, "_blank");
      }
    }
  };

  if (loading) {
    return (
      <Layout.Content className="policy-content">
        <div className="policy-loading">
          <Spin size="large" tip="Đang tải..." />
        </div>
      </Layout.Content>
    );
  }

  if (!policy || !policy.base_policy) {
    return (
      <Layout.Content className="policy-content">
        <div className="policy-loading">
          <Title level={4}>Không tìm thấy policy</Title>
        </div>
      </Layout.Content>
    );
  }

  const basePolicy = policy.base_policy;
  const trigger = policy.trigger || {};
  const conditions = policy.conditions || [];
  const validations = policy.validations || [];
  const latestValidation = validations[0];

  const validationStatus = basePolicy.document_validation_status || "pending";
  const statusConfig = getValidationStatusConfig(validationStatus);

  return (
    <Layout.Content className="policy-content">
      <div className="policy-space">
        {/* Header */}
        <div className="policy-header">
          <div>
            <Title level={2} className="policy-title">
              {basePolicy.product_name}
            </Title>
            <Text className="policy-subtitle">{basePolicy.product_code}</Text>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Tag
              color={statusConfig.color}
              icon={statusConfig.icon}
              style={{ fontSize: "14px", padding: "4px 12px" }}
            >
              {statusConfig.text}
            </Tag>
            <Button onClick={() => router.push("/pending-policies")}>
              Quay lại
            </Button>
          </div>
        </div>

        {/* Validation Form Modal */}
        <ValidationFormModal
          open={validationModalOpen}
          onCancel={() => setValidationModalOpen(false)}
          onSubmit={handleValidationSubmit}
          basePolicyId={basePolicy.id}
          latestValidation={
            validationModalMode === "accept_ai" ? latestValidation : null
          }
          validatedBy="admin@example.com"
        />

        {/* Validation Actions */}
        {validationStatus === "passed_ai" && (
          <Alert
            message="Kết quả xác thực AI"
            description={
              <div>
                <Paragraph>
                  AI đã hoàn thành xác thực. Vui lòng xem xét kết quả và chấp
                  nhận hoặc yêu cầu review thủ công.
                </Paragraph>
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <Button type="primary" onClick={handleAcceptAI}>
                    Chấp nhận kết quả AI
                  </Button>
                  <Button onClick={() => handleManualValidate("review")}>
                    Review thủ công
                  </Button>
                </div>
              </div>
            }
            type="info"
            showIcon
            icon={<CheckCircleOutlined />}
            style={{ marginBottom: "24px" }}
          />
        )}

        {validationStatus === "pending" && (
          <Alert
            message="Chờ xác thực"
            description={
              <div>
                <Paragraph>Chính sách này đang chờ xác thực.</Paragraph>
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <Button
                    type="primary"
                    onClick={() => handleManualValidate("approve")}
                  >
                    Xác thực thủ công
                  </Button>
                </div>
              </div>
            }
            type="warning"
            showIcon
            style={{ marginBottom: "24px" }}
          />
        )}

        {validationStatus === "failed" && latestValidation && (
          <Alert
            message="Xác thực thất bại"
            description={
              <div>
                <Paragraph>
                  Chính sách có {latestValidation.failed_checks} lỗi cần được xử
                  lý.
                </Paragraph>
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleManualValidate("fix")}
                  >
                    Yêu cầu sửa lỗi
                  </Button>
                  <Button onClick={() => handleManualValidate("override")}>
                    Ghi đè thủ công
                  </Button>
                </div>
              </div>
            }
            type="error"
            showIcon
            icon={<CloseCircleOutlined />}
            style={{ marginBottom: "24px" }}
          />
        )}

        <Row gutter={[16, 16]}>
          <Col span={24}>
            {/* Base Policy Information */}
            <Card title="Thông tin cơ bản" bordered={false}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Tên sản phẩm">
                  {basePolicy.product_name}
                </Descriptions.Item>
                <Descriptions.Item label="Mã sản phẩm">
                  {basePolicy.product_code}
                </Descriptions.Item>
                <Descriptions.Item label="Nhà bảo hiểm">
                  {basePolicy.insurance_provider_id}
                </Descriptions.Item>
                <Descriptions.Item label="Loại cây trồng">
                  <Tag color="blue">
                    {getCropTypeDisplay(basePolicy.crop_type)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag
                    color={basePolicy.status === "draft" ? "orange" : "green"}
                  >
                    {basePolicy.status === "draft"
                      ? "Bản nháp"
                      : basePolicy.status === "active"
                      ? "Hoạt động"
                      : "Đã lưu trữ"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Thời hạn bảo hiểm">
                  {basePolicy.coverage_duration_days} ngày
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả" span={2}>
                  {basePolicy.product_description}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col span={12}>
            {/* Financial Information */}
            <Card title="Thông tin tài chính" bordered={false}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Phí bảo hiểm cố định">
                  {formatCurrency(basePolicy.fix_premium_amount)}
                </Descriptions.Item>
                <Descriptions.Item label="Tỷ lệ phí cơ sở">
                  {(basePolicy.premium_base_rate * 100).toFixed(2)}%
                </Descriptions.Item>
                <Descriptions.Item label="Bồi thường cố định">
                  {formatCurrency(basePolicy.fix_payout_amount)}
                </Descriptions.Item>
                <Descriptions.Item label="Tỷ lệ bồi thường">
                  {(basePolicy.payout_base_rate * 100).toFixed(2)}%
                </Descriptions.Item>
                <Descriptions.Item label="Giới hạn bồi thường tối đa">
                  {formatCurrency(basePolicy.payout_cap)}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col span={12}>
            {/* Enrollment Period */}
            <Card title="Thời gian đăng ký & hiệu lực" bordered={false}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Bắt đầu đăng ký">
                  {formatDate(basePolicy.enrollment_start_day)}
                </Descriptions.Item>
                <Descriptions.Item label="Kết thúc đăng ký">
                  {formatDate(basePolicy.enrollment_end_day)}
                </Descriptions.Item>
                <Descriptions.Item label="Bảo hiểm có hiệu lực từ">
                  {formatDate(basePolicy.insurance_valid_from_day)}
                </Descriptions.Item>
                <Descriptions.Item label="Bảo hiểm có hiệu lực đến">
                  {formatDate(basePolicy.insurance_valid_to_day)}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Trigger Information */}
          {trigger && trigger.id && (
            <Col span={24}>
              <Card title="Thông tin kích hoạt" bordered={false}>
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
            </Col>
          )}

          {/* Conditions */}
          {conditions.length > 0 && (
            <Col span={24}>
              <Card
                title={`Điều kiện kích hoạt (${conditions.length})`}
                bordered={false}
              >
                <Collapse
                  items={conditions.map((condition, index) => ({
                    key: condition.id,
                    label: `Điều kiện ${index + 1}: ${
                      condition.threshold_operator
                    } ${condition.threshold_value}`,
                    children: (
                      <Descriptions column={2} bordered size="small">
                        <Descriptions.Item label="Data Source ID">
                          {condition.data_source_id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Threshold">
                          {condition.threshold_operator}{" "}
                          {condition.threshold_value}
                        </Descriptions.Item>
                        <Descriptions.Item label="Aggregation">
                          {condition.aggregation_function} over{" "}
                          {condition.aggregation_window_days} days
                        </Descriptions.Item>
                        <Descriptions.Item label="Early Warning">
                          {condition.early_warning_threshold}
                        </Descriptions.Item>
                        <Descriptions.Item label="Base Cost">
                          {condition.base_cost?.toLocaleString("vi-VN")} VND
                        </Descriptions.Item>
                        <Descriptions.Item label="Calculated Cost">
                          {condition.calculated_cost?.toLocaleString("vi-VN")}{" "}
                          VND
                        </Descriptions.Item>
                      </Descriptions>
                    ),
                  }))}
                />
              </Card>
            </Col>
          )}

          {/* Validation History */}
          {validations.length > 0 && (
            <Col span={24}>
              <Card
                title={`Lịch sử xác thực (${validations.length})`}
                bordered={false}
              >
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
                              {new Date(validation.created_at).toLocaleString(
                                "vi-VN"
                              )}
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
                              <CheckCircleOutlined className="text-green-600" />{" "}
                              Đạt: {validation.passed_checks}/
                              {validation.total_checks}
                            </Text>
                            {validation.failed_checks > 0 && (
                              <Text type="danger">
                                <CloseCircleOutlined /> Lỗi:{" "}
                                {validation.failed_checks}
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
                                            <Text type="secondary">
                                              Giá trị JSON:
                                            </Text>
                                            <br />
                                            <Text code>
                                              {JSON.stringify(value.json_value)}
                                            </Text>
                                          </Col>
                                          <Col span={12}>
                                            <Text type="secondary">
                                              Giá trị PDF:
                                            </Text>
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
                            Object.keys(validation.recommendations).length >
                              0 && (
                              <div style={{ marginTop: "12px" }}>
                                <Text strong type="info">
                                  <CheckCircleOutlined /> Đề xuất:
                                </Text>
                                <div style={{ marginTop: "8px" }}>
                                  {Object.entries(
                                    validation.recommendations
                                  ).map(([key, value]) => (
                                    <Alert
                                      key={key}
                                      message={`${key} (Priority: ${value.priority})`}
                                      description={
                                        <div>
                                          <Paragraph>
                                            {value.suggestion}
                                          </Paragraph>
                                          {value.affected_fields && (
                                            <div>
                                              <Text type="secondary">
                                                Các trường bị ảnh hưởng:
                                              </Text>
                                              <br />
                                              {value.affected_fields.map(
                                                (field) => (
                                                  <Tag key={field}>{field}</Tag>
                                                )
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      }
                                      type="info"
                                      showIcon
                                      style={{ marginBottom: "8px" }}
                                    />
                                  ))}
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
              </Card>
            </Col>
          )}

          {/* Document */}
          <Col span={24}>
            <Card title="Tài liệu chính sách" bordered={false}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FilePdfOutlined
                  style={{ fontSize: "24px", color: "#ff4d4f" }}
                />
                <div style={{ flex: 1 }}>
                  <Text strong>Tài liệu PDF chính sách</Text>
                  <br />
                  <Text type="secondary">
                    {basePolicy.template_document_url}
                  </Text>
                </div>
                <Button
                  type="primary"
                  icon={<FilePdfOutlined />}
                  onClick={handleDownloadPDF}
                >
                  Xem PDF
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout.Content>
  );
}
