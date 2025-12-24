"use client";

import AIValidationTab from "@/components/layout/policy/detail/AIValidationTab";
import BasicInfoTab from "@/components/layout/policy/detail/BasicInfoTab";
import ConfigurationInfoTab from "@/components/layout/policy/detail/ConfigurationInfoTab";
import TagsInfoTab from "@/components/layout/policy/detail/TagsInfoTab";
import ValidationFormModal from "@/components/layout/policy/detail/ValidationFormModal/ValidationFormModal";
import { usePendingPolicies } from "@/services/hooks/base-policy/use-pending-base-policies";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  RobotOutlined,
  SettingOutlined,
  TagOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Layout,
  message,
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
      message.error("Lỗi khi tải chi tiết policy: " + err.message);
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
      router.push("/base-policies/pending-policies");
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
          <Title level={4}>Không tìm thấy hợp đồng mẫu</Title>
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
            <Button
              onClick={() => router.push("/base-policies/pending-policies")}
            >
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
          validatedBy="agrisa.admin@gmail.com"
          mode={validationModalMode}
        />

        {/* Validation Actions - Simplified */}
        <Card
          size="small"
          style={{
            marginBottom: "24px",
            background: "#f6ffed",
            borderColor: "#b7eb8f",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Text strong style={{ fontSize: "14px" }}>
                <InfoCircleOutlined
                  style={{ marginRight: "8px", color: "#52c41a" }}
                />
                Xác thực hợp đồng mẫu
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {validationStatus === "passed_ai" &&
                  "AI đã xác thực. Vui lòng xem xét và duyệt đơn."}
                {validationStatus === "pending" &&
                  "Đơn đang chờ xác thực thủ công."}
                {validationStatus === "failed" &&
                  latestValidation &&
                  `Phát hiện ${latestValidation.failed_checks} lỗi cần xử lý.`}
                {validationStatus === "passed" &&
                  "Đơn đã được duyệt và kích hoạt."}
              </Text>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {(validationStatus === "passed_ai" ||
                validationStatus === "pending") && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleManualValidate("approve")}
                >
                  Duyệt
                </Button>
              )}
              {validationStatus === "failed" && (
                <>
                  <Button
                    type="primary"
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => handleManualValidate("fix")}
                  >
                    Yêu cầu sửa
                  </Button>
                  <Button
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleManualValidate("override")}
                  >
                    Ghi đè duyệt
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

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
                  <SettingOutlined /> Cấu hình và điều kiện
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
                  <TagOutlined /> Trường thông tin
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
          ]}
        />
      </div>
    </Layout.Content>
  );
}
