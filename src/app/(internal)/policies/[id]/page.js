"use client";

import { policyMessage } from "@/libs/message";
import { usePolicyDetail, useUpdatePolicy } from "@/services/hooks/policy";
import {
  CheckCircleOutlined,
  DollarOutlined,
  DownOutlined,
  EditOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Collapse,
  Descriptions,
  Layout,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import "../policies.css";

const { Title, Text } = Typography;
const { Option } = Select;

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const policyId = params.id;

  const {
    data: policy,
    loading,
    monitoringData,
    loadingMonitoring,
    refetch,
    formatCurrency,
    formatDate,
    formatDateTime,
    getStatusLabel,
    getUnderwritingLabel,
  } = usePolicyDetail(policyId);

  const {
    updateStatus,
    updateUnderwriting,
    loading: updating,
  } = useUpdatePolicy();

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [underwritingModalVisible, setUnderwritingModalVisible] =
    useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUnderwriting, setSelectedUnderwriting] = useState("");

  if (loading) {
    return (
      <Layout.Content className="policy-detail-content">
        <div className="policy-loading">
          <Spin size="large" tip={policyMessage.loading.detail} />
        </div>
      </Layout.Content>
    );
  }

  if (!policy) {
    return (
      <Layout.Content className="policy-detail-content">
        <div className="policy-loading">
          <Text>{policyMessage.error.notFound}</Text>
        </div>
      </Layout.Content>
    );
  }

  // Helper function to format Unix timestamp
  const formatUnixDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatUnixDateTime = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to render status badge
  const renderStatusBadge = (status) => {
    const statusClass = `policy-status-badge policy-status-${status}`;
    return <span className={statusClass}>{getStatusLabel(status)}</span>;
  };

  // Helper function to render underwriting badge
  const renderUnderwritingBadge = (status) => {
    const statusClass = `policy-status-badge policy-underwriting-${status}`;
    return <span className={statusClass}>{getUnderwritingLabel(status)}</span>;
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    try {
      await updateStatus(policyId, selectedStatus);
      setStatusModalVisible(false);
      refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Handle underwriting update
  const handleUnderwritingUpdate = async () => {
    try {
      await updateUnderwriting(policyId, selectedUnderwriting);
      setUnderwritingModalVisible(false);
      refetch();
    } catch (error) {
      console.error("Failed to update underwriting:", error);
    }
  };

  // Monitoring data table columns
  const monitoringColumns = [
    {
      title: policyMessage.monitoring.parameterName,
      dataIndex: "parameter_name",
      key: "parameter_name",
      width: 150,
      render: (text) => (
        <Tag color="green" style={{ fontWeight: 500 }}>
          {policyMessage.monitoring.parameters[text] || text}
        </Tag>
      ),
    },
    {
      title: policyMessage.monitoring.measuredValue,
      dataIndex: "measured_value",
      key: "measured_value",
      width: 120,
      render: (value, record) => (
        <strong style={{ color: "var(--color-primary-600)" }}>
          {value?.toFixed(4)} {record.unit}
        </strong>
      ),
    },
    {
      title: policyMessage.monitoring.measurementTime,
      dataIndex: "measurement_timestamp",
      key: "measurement_timestamp",
      width: 150,
      render: (timestamp) => formatUnixDateTime(timestamp),
    },
    {
      title: policyMessage.monitoring.dataQuality,
      dataIndex: "data_quality",
      key: "data_quality",
      width: 120,
      render: (quality) => (
        <Tag
          color={
            quality === "good"
              ? "green"
              : quality === "acceptable"
              ? "orange"
              : "red"
          }
        >
          {policyMessage.monitoring.quality[quality] || quality}
        </Tag>
      ),
    },
    {
      title: policyMessage.monitoring.confidenceScore,
      dataIndex: "confidence_score",
      key: "confidence_score",
      width: 100,
      render: (score) => (
        <span
          style={{
            color:
              score >= 0.9
                ? "var(--color-primary-500)"
                : score >= 0.7
                ? "var(--color-secondary-700)"
                : "#ef4444",
            fontWeight: 500,
          }}
        >
          {(score * 100).toFixed(1)}%
        </span>
      ),
    },
    {
      title: policyMessage.monitoring.cloudCover,
      dataIndex: "cloud_cover_percentage",
      key: "cloud_cover_percentage",
      width: 110,
      render: (value) => `${value?.toFixed(2)}%`,
    },
    {
      title: policyMessage.monitoring.measurementSource,
      dataIndex: "measurement_source",
      key: "measurement_source",
      width: 180,
      render: (source) => <Text type="secondary">{source}</Text>,
    },
  ];

  return (
    <Layout.Content className="policy-detail-content">
      <div className="policy-detail-space">
        {/* Header */}
        <div className="policy-header">
          <Title level={2} className="policy-title">
            {policyMessage.title.detail}
          </Title>
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedStatus(policy.status);
                setStatusModalVisible(true);
              }}
            >
              {policyMessage.actions.updateStatus}
            </Button>
            <Button
              icon={<CheckCircleOutlined />}
              onClick={() => {
                setSelectedUnderwriting(policy.underwriting_status);
                setUnderwritingModalVisible(true);
              }}
            >
              {policyMessage.actions.updateUnderwriting}
            </Button>
          </Space>
        </div>

        {/* Basic Info Card */}
        <Card className="policy-detail-card">
          <Title level={4} className="policy-detail-section-title">
            <SafetyOutlined style={{ color: "var(--color-primary-400)" }} />{" "}
            {policyMessage.detail.basicInfo}
          </Title>
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
            <Descriptions.Item label={policyMessage.fields.policyNumber}>
              <strong>{policy.policy_number}</strong>
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.status}>
              {renderStatusBadge(policy.status)}
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.underwritingStatus}>
              {renderUnderwritingBadge(policy.underwriting_status)}
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.createdAt}>
              {formatDate(policy.created_at)}
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.updatedAt}>
              {formatDate(policy.updated_at)}
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.registeredBy}>
              {policy.registered_by || "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Coverage Info Card */}
        <Card className="policy-detail-card">
          <Title level={4} className="policy-detail-section-title">
            <DollarOutlined style={{ color: "var(--color-secondary-700)" }} />{" "}
            {policyMessage.detail.coverageInfo}
          </Title>
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
            <Descriptions.Item label={policyMessage.fields.coverageAmount}>
              <strong
                style={{ fontSize: "18px", color: "var(--color-primary-600)" }}
              >
                {formatCurrency(policy.coverage_amount)}
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.coverageStartDate}>
              {policy.coverage_start_date
                ? formatUnixDate(policy.coverage_start_date)
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.coverageEndDate}>
              {formatUnixDate(policy.coverage_end_date)}
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.totalPremium}>
              <strong>{formatCurrency(policy.total_farmer_premium)}</strong>
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.premiumPaid}>
              <Tag color={policy.premium_paid_by_farmer ? "green" : "orange"}>
                {policy.premium_paid_by_farmer
                  ? policyMessage.fields.yes
                  : policyMessage.fields.no}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.premiumPaidAt}>
              {policy.premium_paid_at
                ? formatDate(policy.premium_paid_at)
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.plantingDate}>
              {formatUnixDate(policy.planting_date)}
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.areaMultiplier}>
              {policy.area_multiplier}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Farmer & Provider Info */}
        <Card className="policy-detail-card">
          <Title level={4} className="policy-detail-section-title">
            <UserOutlined style={{ color: "var(--color-primary-400)" }} /> Thông
            tin nông dân & nhà cung cấp
          </Title>
          <Descriptions column={{ xs: 1, sm: 2 }} bordered>
            <Descriptions.Item label={policyMessage.fields.farmerId}>
              {policy.farmer_id}
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.insuranceProviderId}>
              {policy.insurance_provider_id}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Farm Info Card */}
        {policy.farm && (
          <Card className="policy-detail-card">
            <Title level={4} className="policy-detail-section-title">
              <EnvironmentOutlined
                style={{ color: "var(--color-primary-400)" }}
              />{" "}
              {policyMessage.detail.farmInfo}
            </Title>
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
              <Descriptions.Item label={policyMessage.fields.farmName}>
                {policy.farm.farm_name}
              </Descriptions.Item>
              <Descriptions.Item label={policyMessage.fields.farmCode}>
                {policy.farm.farm_code}
              </Descriptions.Item>
              <Descriptions.Item label={policyMessage.fields.farmArea}>
                {policy.farm.area_sqm?.toLocaleString()} m²
              </Descriptions.Item>
              <Descriptions.Item label={policyMessage.fields.cropType}>
                {policy.farm.crop_type}
              </Descriptions.Item>
              <Descriptions.Item label={policyMessage.fields.province}>
                {policy.farm.province}
              </Descriptions.Item>
              <Descriptions.Item label={policyMessage.fields.district}>
                {policy.farm.district}
              </Descriptions.Item>
              <Descriptions.Item label={policyMessage.fields.commune} span={3}>
                {policy.farm.commune}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {/* Base Policy Info Card */}
        {policy.base_policy && (
          <Card className="policy-detail-card">
            <Title level={4} className="policy-detail-section-title">
              <FileTextOutlined
                style={{ color: "var(--color-secondary-700)" }}
              />{" "}
              {policyMessage.detail.basePolicyInfo}
            </Title>
            <Descriptions column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item label={policyMessage.fields.basePolicyName}>
                {policy.base_policy.product_name}
              </Descriptions.Item>
              <Descriptions.Item label={policyMessage.fields.cropType}>
                {policy.base_policy.crop_type}
              </Descriptions.Item>
              <Descriptions.Item label={policyMessage.fields.coverageCurrency}>
                {policy.base_policy.coverage_currency}
              </Descriptions.Item>
              <Descriptions.Item label={policyMessage.fields.coverageDuration}>
                {policy.base_policy.coverage_duration_days} ngày
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {/* Financial Info Card */}
        <Card className="policy-detail-card">
          <Title level={4} className="policy-detail-section-title">
            <DollarOutlined style={{ color: "var(--color-secondary-700)" }} />{" "}
            {policyMessage.detail.financialInfo}
          </Title>
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
            <Descriptions.Item label={policyMessage.fields.dataComplexityScore}>
              {policy.data_complexity_score}
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.monthlyDataCost}>
              {formatCurrency(policy.monthly_data_cost)}
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.totalDataCost}>
              {formatCurrency(policy.total_data_cost)}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Monitoring Data Card */}
        <Collapse
          defaultActiveKey={[]}
          expandIcon={({ isActive }) => (
            <DownOutlined
              rotate={isActive ? 180 : 0}
              style={{ color: "var(--color-primary-500)" }}
            />
          )}
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #d9d9d9",
          }}
        >
          <Collapse.Panel
            header={
              <Title
                level={4}
                style={{
                  margin: 0,
                  color: "var(--color-primary-500)",
                  fontSize: "18px",
                }}
              >
                {policyMessage.detail.monitoringData}
                {monitoringData.length > 0 && (
                  <Tag
                    color="green"
                    style={{ marginLeft: 12, fontSize: "12px" }}
                  >
                    {monitoringData.length} bản ghi
                  </Tag>
                )}
              </Title>
            }
            key="1"
          >
            {loadingMonitoring ? (
              <div className="text-center py-8">
                <Spin tip={policyMessage.loading.monitoring} />
              </div>
            ) : monitoringData.length > 0 ? (
              <Table
                columns={monitoringColumns}
                dataSource={monitoringData}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Tổng số ${total} bản ghi`,
                }}
                scroll={{ x: 1200 }}
                size="small"
                bordered
                style={{ marginTop: 16 }}
              />
            ) : (
              <div className="policy-monitoring-empty">
                <Text type="secondary">{policyMessage.empty.monitoring}</Text>
              </div>
            )}
          </Collapse.Panel>
        </Collapse>

        {/* Status Update Modal */}
        <Modal
          title={policyMessage.updateStatus.title}
          open={statusModalVisible}
          onOk={handleStatusUpdate}
          onCancel={() => setStatusModalVisible(false)}
          confirmLoading={updating}
          okText={policyMessage.actions.update}
          cancelText={policyMessage.actions.cancel}
          className="policy-update-modal"
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <Text strong>{policyMessage.updateStatus.currentStatus}: </Text>
              {renderStatusBadge(policy.status)}
            </div>
            <div>
              <Text strong>{policyMessage.updateStatus.newStatus}:</Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder={policyMessage.updateStatus.label}
              >
                {Object.keys(policyMessage.status).map((key) => (
                  <Option key={key} value={key}>
                    {policyMessage.status[key]}
                  </Option>
                ))}
              </Select>
            </div>
            <Text type="secondary">
              {policyMessage.updateStatus.confirmMessage}
            </Text>
          </Space>
        </Modal>

        {/* Underwriting Update Modal */}
        <Modal
          title={policyMessage.updateUnderwriting.title}
          open={underwritingModalVisible}
          onOk={handleUnderwritingUpdate}
          onCancel={() => setUnderwritingModalVisible(false)}
          confirmLoading={updating}
          okText={policyMessage.actions.update}
          cancelText={policyMessage.actions.cancel}
          className="policy-update-modal"
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <Text strong>
                {policyMessage.updateUnderwriting.currentStatus}:{" "}
              </Text>
              {renderUnderwritingBadge(policy.underwriting_status)}
            </div>
            <div>
              <Text strong>{policyMessage.updateUnderwriting.newStatus}:</Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
                value={selectedUnderwriting}
                onChange={setSelectedUnderwriting}
                placeholder={policyMessage.updateUnderwriting.label}
              >
                {Object.keys(policyMessage.underwritingStatus).map((key) => (
                  <Option key={key} value={key}>
                    {policyMessage.underwritingStatus[key]}
                  </Option>
                ))}
              </Select>
            </div>
            <Text type="secondary">
              {policyMessage.updateUnderwriting.confirmMessage}
            </Text>
          </Space>
        </Modal>
      </div>
    </Layout.Content>
  );
}
