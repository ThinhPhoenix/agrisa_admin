"use client";

import AIValidationTab from "@/components/layout/policy/detail/AIValidationTab";
import BasicInfoTab from "@/components/layout/policy/detail/BasicInfoTab";
import ConfigurationInfoTab from "@/components/layout/policy/detail/ConfigurationInfoTab";
import TagsInfoTab from "@/components/layout/policy/detail/TagsInfoTab";
import ValidationFormModal from "@/components/layout/policy/detail/ValidationFormModal";
import { usePendingPolicies } from "@/services/hooks/policy/use-pending-policies";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FilePdfOutlined,
  InfoCircleOutlined,
  RobotOutlined,
  SettingOutlined,
  TagOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  Layout,
  Modal,
  Spin,
  Tabs,
  Tag,
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
          latestValidation={latestValidation}
          validatedBy="admin@example.com"
          mode={validationModalMode}
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

        {/* Tabs for detailed information */}
        <Tabs
          defaultActiveKey="basic"
          size="large"
          items={[
            {
              key: "basic",
              label: (
                <span>
                  <InfoCircleOutlined /> Thông tin cơ bản
                </span>
              ),
              children: (
                <BasicInfoTab
                  basePolicy={basePolicy}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  getCropTypeDisplay={getCropTypeDisplay}
                />
              ),
            },
            {
              key: "configuration",
              label: (
                <span>
                  <SettingOutlined /> Cấu hình Trigger
                </span>
              ),
              children: (
                <ConfigurationInfoTab
                  trigger={trigger}
                  conditions={conditions}
                />
              ),
            },
            {
              key: "tags",
              label: (
                <span>
                  <TagOutlined /> Thẻ & Metadata
                </span>
              ),
              children: <TagsInfoTab basePolicy={basePolicy} />,
            },
            {
              key: "validation",
              label: (
                <span>
                  <RobotOutlined /> Xác thực AI
                  {validations.length > 0 && (
                    <Badge
                      count={validations.length}
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </span>
              ),
              children: (
                <AIValidationTab
                  validations={validations}
                  getSeverityBadge={getSeverityBadge}
                  getValidationStatusConfig={getValidationStatusConfig}
                />
              ),
            },
            {
              key: "document",
              label: (
                <span>
                  <FilePdfOutlined /> Tài liệu
                </span>
              ),
              children: (
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
              ),
            },
          ]}
        />
      </div>
    </Layout.Content>
  );
}
