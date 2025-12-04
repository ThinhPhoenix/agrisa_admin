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
  WalletOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Layout,
  Modal,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import "../page.css";

const { Title, Text } = Typography;

export default function ClaimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const claimId = params.id;
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    data: claim,
    loading,
    deleteClaim,
    formatCurrency,
    formatDate,
    formatDateTime,
  } = useClaimDetail(claimId);

  // Handle delete claim with confirmation
  const handleDeleteClaim = () => {
    Modal.confirm({
      title: claimMessage.actions.delete,
      content: claimMessage.actions.confirmDelete,
      okText: claimMessage.actions.delete,
      cancelText: claimMessage.actions.back,
      okType: "danger",
      onOk: async () => {
        setDeleteLoading(true);
        const success = await deleteClaim();
        setDeleteLoading(false);

        if (success) {
          // Navigate back to claims list after successful deletion
          router.push("/claims");
        }
      },
    });
  };

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
      generated: {
        color: "default",
        icon: <ClockCircleOutlined />,
        label: "Đã tạo",
      },
      pending_partner_review: {
        color: "orange",
        icon: <ClockCircleOutlined />,
        label: "Chờ đối tác xét duyệt",
      },
      approved: {
        color: "green",
        icon: <CheckCircleOutlined />,
        label: "Đã phê duyệt",
      },
      rejected: {
        color: "red",
        icon: <CloseCircleOutlined />,
        label: "Bị từ chối",
      },
      paid: {
        color: "purple",
        icon: <DollarOutlined />,
        label: "Đã thanh toán",
      },
    };

    const config = statusConfigs[status] || statusConfigs.generated;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.label}
      </Tag>
    );
  };

  // Helper function to get parameter label
  const getParameterLabel = (parameter) => {
    const labels = {
      rainfall: "Lượng mưa",
      ndvi: "Chỉ số thực vật (NDVI)",
      ndmi: "Chỉ số độ ẩm (NDMI)",
      temperature: "Nhiệt độ",
    };
    return labels[parameter] || parameter;
  };

  // Helper function to get partner decision label
  const getPartnerDecisionLabel = (decision) => {
    const labels = {
      approved: "Phê duyệt",
      rejected: "Từ chối",
      pending: "Chờ xét duyệt",
    };
    return labels[decision] || "-";
  };

  // Trigger conditions table columns
  const conditionColumns = [
    {
      title: "Tham số",
      dataIndex: "parameter",
      key: "parameter",
      render: (text) => getParameterLabel(text),
    },
    {
      title: "Giá trị đo",
      dataIndex: "measured_value",
      key: "measured_value",
      render: (value) => value?.toFixed(2) || "-",
    },
    {
      title: "Ngưỡng",
      dataIndex: "threshold_value",
      key: "threshold_value",
      render: (value) => value?.toFixed(2) || "-",
    },
    {
      title: "Toán tử",
      dataIndex: "operator",
      key: "operator",
    },
    {
      title: "Thời gian",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => formatDateTime(timestamp),
    },
    {
      title: "Cảnh báo sớm",
      dataIndex: "is_early_warning",
      key: "is_early_warning",
      render: (isWarning) => (
        <Tag
          color={isWarning ? "orange" : "default"}
          icon={isWarning ? <WarningOutlined /> : null}
        >
          {isWarning ? "Có" : "Không"}
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
        <div
          className="claim-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2} className="claim-title" style={{ margin: 0 }}>
            Chi tiết yêu cầu bồi thường
          </Title>
          <Link href="/claims">
            <Button icon={<ArrowLeftOutlined />}>Quay lại</Button>
          </Link>
          {/* Delete button - commented out for now */}
          {/* <div>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={handleDeleteClaim}
              loading={deleteLoading}
            >
              Xóa bồi thường
            </Button>
          </div> */}
        </div>

        {/* Unified Claim Detail Card */}
        <Card
          className="claim-detail-card"
          style={{
            backgroundColor: "#fefcf5",
            borderColor: "#e5e7eb",
          }}
        >
          {/* Basic Info Section */}
          <div className="flex items-center gap-2 mb-4">
            <SafetyOutlined className="text-lg text-blue-500" />
            <Title level={5} className="mb-0">
              Thông tin cơ bản
            </Title>
          </div>
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
            <Descriptions.Item label="Số bồi thường">
              <strong>{claim.claim_number}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {renderStatusBadge(claim.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Tự động tạo">
              <Tag color={claim.auto_generated ? "blue" : "default"}>
                {claim.auto_generated ? "Có" : "Không"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mã đơn bảo hiểm">
              {claim.registered_policy_id}
            </Descriptions.Item>
            <Descriptions.Item label="Mã nông trại">
              {claim.farm_id}
            </Descriptions.Item>
            <Descriptions.Item label="Mã điều kiện kích hoạt">
              {claim.base_policy_trigger_id}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian kích hoạt">
              {formatDateTime(claim.trigger_timestamp)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {formatDateTime(claim.created_at)}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối">
              {formatDateTime(claim.updated_at)}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          {/* Payout Calculation Section */}
          <div className="flex items-center gap-2 mb-4">
            <WalletOutlined className="text-lg text-green-500" />
            <Title level={5} className="mb-0">
              Tính toán bồi thường
            </Title>
          </div>
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
            <Descriptions.Item label="Tổng số tiền bồi thường">
              <strong className="text-xl text-blue-600">
                {formatCurrency(claim.claim_amount)}
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Bồi thường cố định">
              {formatCurrency(claim.calculated_fix_payout)}
            </Descriptions.Item>
            <Descriptions.Item label="Bồi thường theo ngưỡng">
              {formatCurrency(claim.calculated_threshold_payout)}
            </Descriptions.Item>
            <Descriptions.Item label="Giá trị vượt ngưỡng" span={3}>
              {claim.over_threshold_value?.toFixed(2) || "-"}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          {/* Review Info Section */}
          <div className="flex items-center gap-2 mb-4">
            <CheckCircleOutlined className="text-lg text-orange-500" />
            <Title level={5} className="mb-0">
              Thông tin xét duyệt
            </Title>
          </div>
          <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
            <Descriptions.Item label="Quyết định của đối tác">
              {claim.partner_decision ? (
                <Tag
                  color={
                    claim.partner_decision === "approved" ? "green" : "red"
                  }
                >
                  {getPartnerDecisionLabel(claim.partner_decision)}
                </Tag>
              ) : (
                "-"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Người xét duyệt">
              {claim.reviewed_by || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian xét duyệt">
              {claim.partner_review_timestamp
                ? formatDateTime(claim.partner_review_timestamp)
                : "-"}
            </Descriptions.Item>
            {/* <Descriptions.Item label="Tự động phê duyệt">
              <Tag color={claim.auto_approved ? "orange" : "default"}>
                {claim.auto_approved ? "Có" : "Không"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Hạn tự động phê duyệt" span={2}>
              {claim.auto_approval_deadline
                ? formatDateTime(claim.auto_approval_deadline)
                : "-"}
            </Descriptions.Item> */}
            <Descriptions.Item label="Ghi chú của đối tác" span={2}>
              {claim.partner_notes || "-"}
            </Descriptions.Item>
          </Descriptions>

          {/* Evidence Info Section */}
          {claim.evidence_summary && (
            <>
              <Divider />
              <div className="flex items-center gap-2 mb-4">
                <FileTextOutlined className="text-lg text-green-600" />
                <Title level={5} className="mb-0">
                  Bằng chứng kích hoạt
                </Title>
              </div>
              <Descriptions
                column={{ xs: 1, sm: 2, md: 3 }}
                bordered
                size="small"
              >
                <Descriptions.Item label="Kích hoạt lúc">
                  {formatDateTime(claim.evidence_summary.triggered_at)}
                </Descriptions.Item>
                <Descriptions.Item label="Số điều kiện">
                  {claim.evidence_summary.conditions_count || 0}
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức tạo">
                  <Tag
                    color={
                      claim.evidence_summary.generation_method === "automatic"
                        ? "blue"
                        : "orange"
                    }
                  >
                    {claim.evidence_summary.generation_method === "automatic"
                      ? "Tự động"
                      : "Thủ công"}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>

              {/* Trigger Conditions Table */}
              {conditions.length > 0 && (
                <div className="claim-evidence-table">
                  <Title level={5} className="mt-6 mb-4">
                    Điều kiện kích hoạt
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
            </>
          )}
        </Card>
      </div>
    </Layout.Content>
  );
}
