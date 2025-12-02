"use client";

import { claimMessage } from "@/libs/message";
import { useClaimDetail } from "@/services/hooks/claim";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  SafetyOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Descriptions,
  Layout,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import "../page.css";

const { Title, Text } = Typography;

export default function ClaimDetailPage() {
  const params = useParams();
  const claimId = params.id;

  const {
    data: claim,
    loading,
    formatCurrency,
    formatDate,
    formatDateTime,
    getStatusLabel,
    getPartnerDecisionLabel,
    getParameterLabel,
  } = useClaimDetail(claimId);

  if (loading) {
    return (
      <Layout.Content className="claim-detail-content">
        <div className="claim-loading">
          <Spin size="large" tip={claimMessage.loading.detail} />
        </div>
      </Layout.Content>
    );
  }

  if (!claim) {
    return (
      <Layout.Content className="claim-detail-content">
        <div className="claim-loading">
          <Text>{claimMessage.error.notFound}</Text>
        </div>
      </Layout.Content>
    );
  }

  // Helper function to render status badge
  const renderStatusBadge = (status) => {
    const statusConfigs = {
      generated: { color: "default", icon: <ClockCircleOutlined /> },
      pending_partner_review: { color: "orange", icon: <ClockCircleOutlined /> },
      approved: { color: "green", icon: <CheckCircleOutlined /> },
      rejected: { color: "red", icon: <CloseCircleOutlined /> },
      paid: { color: "purple", icon: <DollarOutlined /> },
    };

    const config = statusConfigs[status] || statusConfigs.generated;
    return (
      <Tag color={config.color} icon={config.icon}>
        {getStatusLabel(status)}
      </Tag>
    );
  };

  // Trigger conditions table columns
  const conditionColumns = [
    {
      title: claimMessage.condition.parameter,
      dataIndex: "parameter",
      key: "parameter",
      render: (text) => getParameterLabel(text),
    },
    {
      title: claimMessage.condition.measuredValue,
      dataIndex: "measured_value",
      key: "measured_value",
      render: (value) => value?.toFixed(2) || "-",
    },
    {
      title: claimMessage.condition.thresholdValue,
      dataIndex: "threshold_value",
      key: "threshold_value",
      render: (value) => value?.toFixed(2) || "-",
    },
    {
      title: claimMessage.condition.operator,
      dataIndex: "operator",
      key: "operator",
    },
    {
      title: claimMessage.condition.timestamp,
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => formatDateTime(timestamp),
    },
    {
      title: claimMessage.condition.isEarlyWarning,
      dataIndex: "is_early_warning",
      key: "is_early_warning",
      render: (isWarning) => (
        <Tag color={isWarning ? "orange" : "default"} icon={isWarning ? <WarningOutlined /> : null}>
          {isWarning ? claimMessage.fields.yes : claimMessage.fields.no}
        </Tag>
      ),
    },
  ];

  // Get conditions from evidence summary
  const conditions = claim.evidence_summary?.conditions || [];

  return (
    <Layout.Content className="claim-detail-content">
      <div className="claim-detail-space">
        {/* Header */}
        <div className="claim-header">
          <div>
            <Space>
              <Link href="/claims">
                <Button icon={<ArrowLeftOutlined />}>{claimMessage.actions.back}</Button>
              </Link>
              <Title level={2} className="claim-title">
                <DollarOutlined className="claim-icon" />
                {claimMessage.title.detail}
              </Title>
            </Space>
            <Text className="claim-subtitle">
              {claimMessage.fields.claimNumber}: <strong>{claim.claim_number}</strong>
            </Text>
          </div>
        </div>

        {/* Basic Info Card */}
        <Card
          className="claim-detail-card"
          style={{
            backgroundColor: "#fefcf5",
            borderColor: "#e5e7eb",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <SafetyOutlined className="text-lg text-blue-500" />
            <Title level={5} className="mb-0">
              {claimMessage.detail.basicInfo}
            </Title>
          </div>
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
            <Descriptions.Item label={claimMessage.fields.claimNumber}>
              <strong>{claim.claim_number}</strong>
            </Descriptions.Item>
            <Descriptions.Item label={claimMessage.fields.status}>
              {renderStatusBadge(claim.status)}
            </Descriptions.Item>
            <Descriptions.Item label={claimMessage.fields.autoGenerated}>
              <Tag color={claim.auto_generated ? "blue" : "default"}>
                {claim.auto_generated ? claimMessage.fields.yes : claimMessage.fields.no}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={claimMessage.fields.policyId}>
              {claim.registered_policy_id}
            </Descriptions.Item>
            <Descriptions.Item label={claimMessage.fields.farmId}>
              {claim.farm_id}
            </Descriptions.Item>
            <Descriptions.Item label={claimMessage.fields.triggerId}>
              {claim.base_policy_trigger_id}
            </Descriptions.Item>
            <Descriptions.Item label={claimMessage.fields.triggerTimestamp}>
              {formatDateTime(claim.trigger_timestamp)}
            </Descriptions.Item>
            <Descriptions.Item label={claimMessage.fields.createdAt}>
              {formatDateTime(claim.created_at)}
            </Descriptions.Item>
            <Descriptions.Item label={claimMessage.fields.updatedAt}>
              {formatDateTime(claim.updated_at)}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Payout Calculation Card */}
        <Card
          className="claim-detail-card"
          style={{
            backgroundColor: "#fefcf5",
            borderColor: "#e5e7eb",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <DollarOutlined className="text-lg text-green-500" />
            <Title level={5} className="mb-0">
              {claimMessage.detail.payoutCalculation}
            </Title>
          </div>
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
            <Descriptions.Item label={claimMessage.fields.claimAmount}>
              <strong className="text-xl text-blue-600">
                {formatCurrency(claim.claim_amount)}
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label={claimMessage.fields.calculatedFixPayout}>
              {formatCurrency(claim.calculated_fix_payout)}
            </Descriptions.Item>
            <Descriptions.Item label={claimMessage.fields.calculatedThresholdPayout}>
              {formatCurrency(claim.calculated_threshold_payout)}
            </Descriptions.Item>
            <Descriptions.Item label={claimMessage.fields.overThresholdValue} span={3}>
              {claim.over_threshold_value?.toFixed(2) || "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Review Info Card */}
        <Card
          className="claim-detail-card"
          style={{
            backgroundColor: "#fefcf5",
            borderColor: "#e5e7eb",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircleOutlined className="text-lg text-orange-500" />
            <Title level={5} className="mb-0">
              {claimMessage.detail.reviewInfo}
            </Title>
          </div>
          <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
            <Descriptions.Item label={claimMessage.fields.partnerDecision}>
              {claim.partner_decision ? (
                <Tag color={claim.partner_decision === "approved" ? "green" : "red"}>
                  {getPartnerDecisionLabel(claim.partner_decision)}
                </Tag>
              ) : (
                "-"
              )}
            </Descriptions.Item>
            <Descriptions.Item label={claimMessage.fields.reviewedBy}>
              {claim.reviewed_by || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={claimMessage.fields.partnerReviewTime}>
              {claim.partner_review_timestamp
                ? formatDateTime(claim.partner_review_timestamp)
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label={claimMessage.fields.autoApproved}>
              <Tag color={claim.auto_approved ? "orange" : "default"}>
                {claim.auto_approved ? claimMessage.fields.yes : claimMessage.fields.no}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={claimMessage.fields.autoApprovalDeadline} span={2}>
              {claim.auto_approval_deadline
                ? formatDateTime(claim.auto_approval_deadline)
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label={claimMessage.fields.partnerNotes} span={2}>
              {claim.partner_notes || "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Evidence Info Card */}
        {claim.evidence_summary && (
          <Card
            className="claim-detail-card"
            style={{
              backgroundColor: "#fefcf5",
              borderColor: "#e5e7eb",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FileTextOutlined className="text-lg text-green-600" />
              <Title level={5} className="mb-0">
                {claimMessage.detail.evidenceInfo}
              </Title>
            </div>
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
              <Descriptions.Item label={claimMessage.fields.triggeredAt}>
                {formatDateTime(claim.evidence_summary.triggered_at)}
              </Descriptions.Item>
              <Descriptions.Item label={claimMessage.fields.conditionsCount}>
                {claim.evidence_summary.conditions_count || 0}
              </Descriptions.Item>
              <Descriptions.Item label={claimMessage.fields.generationMethod}>
                <Tag color={claim.evidence_summary.generation_method === "automatic" ? "blue" : "orange"}>
                  {claim.evidence_summary.generation_method === "automatic"
                    ? claimMessage.fields.automatic
                    : claimMessage.fields.manual}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {/* Trigger Conditions Table */}
            {conditions.length > 0 && (
              <div className="claim-evidence-table">
                <Title level={5} className="mt-6 mb-4">
                  {claimMessage.detail.triggerConditions}
                </Title>
                <Table
                  columns={conditionColumns}
                  dataSource={conditions}
                  rowKey={(record) => record.condition_id || Math.random()}
                  pagination={false}
                  scroll={{ x: 800 }}
                  size="small"
                  bordered
                />
              </div>
            )}
          </Card>
        )}
      </div>
    </Layout.Content>
  );
}
