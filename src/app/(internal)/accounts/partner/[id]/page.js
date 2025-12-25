"use client";

import { CustomForm } from "@/components/custom-form";
import CustomTable from "@/components/custom-table";
import { useAccounts } from "@/services/hooks/accounts/use-accounts";
import { usePublicUserProfiles } from "@/services/hooks/common";
import { usePartners } from "@/services/hooks/partner/use-partner";
import { usePartnerDeletion } from "@/services/hooks/partner/use-partner-deletion";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Layout,
  Modal,
  Row,
  Space,
  Spin,
  Statistic,
  Steps,
  Tag,
  Timeline,
  Typography,
} from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import "../partner.css";
import { Utils } from "@/libs/utils";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function PartnerDetailPage() {
  const params = useParams();
  const partnerId = params.id;
  const {
    partnerDetail: partner,
    detailLoading: loading,
    error,
    createPartnerAccount,
  } = usePartners(partnerId);
  const { data: users, loading: usersLoading } = useAccounts();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Partner Deletion Request States
  const {
    deletionRequests,
    loading: deletionLoading,
    fetchDeletionRequests,
    adminProcessRequest,
    getStatusLabel,
    getStatusColor: getDeletionStatusColor,
    canProcess,
  } = usePartnerDeletion();
  const { publicUsers, fetchPublicUsers } = usePublicUserProfiles();
  const [isProcessModalVisible, setIsProcessModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [viewingRequest, setViewingRequest] = useState(null);

  // Create user options for select
  const userOptions = useMemo(() => {
    if (!users || users.length === 0) return [];
    return users
      .filter((user) => user.email !== "agrisa.admin@gmail.com") // Loại bỏ admin hệ thống
      .map((user) => ({
        label: `${user.email}`,
        value: user.id,
      }));
  }, [users]);

  // Fetch deletion requests when component mounts or partner changes
  useEffect(() => {
    if (partner?.partner_id) {
      fetchDeletionRequests(partner.partner_id);
    }
  }, [partner?.partner_id, fetchDeletionRequests]);

  // Get the most recent request and older requests
  const { mostRecentRequest, olderRequests } = useMemo(() => {
    if (!deletionRequests || deletionRequests.length === 0) {
      return { mostRecentRequest: null, olderRequests: [] };
    }

    // Sort by requested_at descending (most recent first)
    const sorted = [...deletionRequests].sort(
      (a, b) => new Date(b.requested_at) - new Date(a.requested_at)
    );

    return {
      mostRecentRequest: sorted[0],
      olderRequests: sorted.slice(1),
    };
  }, [deletionRequests]);

  // Fetch public user info for all unique requested_by ids in deletion requests
  useEffect(() => {
    if (!deletionRequests || deletionRequests.length === 0) return;

    const userIds = deletionRequests.map((req) => req.requested_by);
    fetchPublicUsers(userIds);
  }, [deletionRequests, fetchPublicUsers]);

  // Calculate days remaining for revoke period
  const getDaysRemaining = (cancellableUntil) => {
    const now = new Date();
    const deadline = new Date(cancellableUntil);
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate days since request
  const getDaysSinceRequest = (requestedAt) => {
    const now = new Date();
    const requested = new Date(requestedAt);
    const diffTime = now - requested;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get current step in the deletion process
  const getCurrentStep = (request) => {
    if (!request) return 0;
    if (request.status === "pending") {
      const daysRemaining = getDaysRemaining(request.cancellable_until);
      return daysRemaining > 0 ? 0 : 1;
    }
    if (request.status === "approved") return 2;
    if (request.status === "rejected" || request.status === "cancelled")
      return -1;
    return 0;
  };

  // Show loading or error based on data availability
  if (!partner) {
    // If we have an error, show error page
    if (error) {
      return (
        <Content className="partner-content">
          <div className="partner-error">
            <Title level={3}>Không tìm thấy đối tác</Title>
            <Text>Đối tác với ID {partnerId} không tồn tại.</Text>
            <br />
            <Link href="/accounts/partner">
              <Button
                type="dashed"
                icon={<ArrowLeftOutlined />}
                style={{ marginTop: 16 }}
              >
                Quay lại danh sách
              </Button>
            </Link>
          </div>
        </Content>
      );
    }

    // Otherwise, show loading (including initial state)
    return (
      <Content className="partner-content">
        <div className="partner-loading">
          <Spin size="large" tip="Đang tải thông tin đối tác..." />
        </div>
      </Content>
    );
  }

  const getStatusColor = (status) => {
    return status === "active" ? "green" : "red";
  };

  const getStatusText = (status) => {
    return status === "active" ? "Đang hoạt động" : "Không hoạt động";
  };

  const handleCreateAccount = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleFormSubmit = async (values) => {
    try {
      setSubmitting(true);
      // Call API with user_id from form and partner_id from URL params
      await createPartnerAccount(values.user_id, values.user_id, partnerId);
      setIsModalVisible(false);
    } catch (err) {
      // Error already handled in hook
    } finally {
      setSubmitting(false);
    }
  };

  // Handle approve/reject button click for deletion request
  const handleProcessClick = (request, status) => {
    setSelectedRequest(request);
    setProcessingStatus(status);
    setIsProcessModalVisible(true);
  };

  // Handle form submission for process modal
  const handleProcessSubmit = async (values) => {
    if (!selectedRequest) return;

    setProcessing(true);
    try {
      const result = await adminProcessRequest(
        selectedRequest.request_id,
        processingStatus,
        values.review_note || ""
      );

      if (result.success) {
        setIsProcessModalVisible(false);
        // Refresh the deletion requests
        if (partner?.partner_id) {
          await fetchDeletionRequests(partner.partner_id);
        }
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessModalCancel = () => {
    setIsProcessModalVisible(false);
    setSelectedRequest(null);
    setProcessingStatus(null);
  };

  // Handle view detail button click for older requests
  const handleViewDetail = (request) => {
    setViewingRequest(request);
    setIsDetailModalVisible(true);
  };

  const handleDetailModalCancel = () => {
    setIsDetailModalVisible(false);
    setViewingRequest(null);
  };

  // Helper function to render deletion request details
  const renderRequestDetails = (request, showActions = false) => {
    const daysRemaining = getDaysRemaining(request.cancellable_until);
    const daysSinceRequest = getDaysSinceRequest(request.requested_at);
    const currentStep = getCurrentStep(request);
    const canBeProcessed = canProcess(request);

    return (
      <div
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: "8px",
          padding: "24px",
          background: "#fafafa",
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Space
              style={{
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Text strong style={{ fontSize: "16px" }}>
                  Yêu cầu hủy #{request.request_id}
                </Text>
                <div style={{ marginTop: "8px" }}>
                  <Tag color={getDeletionStatusColor(request.status)}>
                    {getStatusLabel(request.status)}
                  </Tag>
                </div>
              </div>
              {showActions && request.status === "pending" && (
                <div>
                  {canBeProcessed ? (
                    <Space>
                      <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() =>
                          handleProcessClick(request, "approved")
                        }
                      >
                        Phê duyệt
                      </Button>
                      <Button
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() =>
                          handleProcessClick(request, "rejected")
                        }
                      >
                        Từ chối
                      </Button>
                    </Space>
                  ) : (
                    <Alert
                      message={`Còn ${daysRemaining} ngày để partner có thể thu hồi`}
                      type="info"
                      icon={<ClockCircleOutlined />}
                      showIcon
                    />
                  )}
                </div>
              )}
            </Space>
          </Col>

          <Col xs={24} lg={12}>
            <Descriptions
              column={1}
              bordered
              size="small"
              title="Thông tin yêu cầu"
            >
              <Descriptions.Item label="Người yêu cầu">
                {(() => {
                  const userId = request.requested_by;
                  const publicUser = userId && publicUsers[userId];

                  if (publicUser?.loading) {
                    return (
                      <Spin
                        size="small"
                        style={{
                          marginLeft: 4,
                        }}
                      />
                    );
                  }

                  if (publicUser?.data) {
                    const user = publicUser.data;
                    const displayName =
                      user.full_name ||
                      user.display_name ||
                      user.email ||
                      user.username ||
                      userId;

                    return displayName;
                  }

                  // Fallback: use existing name or id
                  if (
                    request.requested_by_name &&
                    request.requested_by_name.trim()
                  ) {
                    return request.requested_by_name;
                  }

                  return userId || "-";
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày yêu cầu">
                {Utils.formatStringVietnameseDateTime(request.requested_at)}
              </Descriptions.Item>
              <Descriptions.Item label="Đã gửi">
                {daysSinceRequest > 0
                  ? `${daysSinceRequest} ngày trước`
                  : "Hôm nay"}
              </Descriptions.Item>

              {request.detailed_explanation && (
                <Descriptions.Item label="Lý do" span={2}>
                  {request.detailed_explanation}
                </Descriptions.Item>
              )}
            </Descriptions>

            {request.reviewed_by_id && (
              <Descriptions
                column={1}
                bordered
                size="small"
                title="Thông tin xử lý"
                style={{ marginTop: "16px" }}
              >
                <Descriptions.Item label="Người xử lý">
                  {request.reviewed_by_name && request.reviewed_by_name.trim()
                    ? request.reviewed_by_name
                    : request.reviewed_by_id}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày xử lý">
                  {new Date(request.reviewed_at).toLocaleString("vi-VN")}
                </Descriptions.Item>
                {request.review_note && (
                  <Descriptions.Item label="Ghi chú" span={2}>
                    {request.review_note}
                  </Descriptions.Item>
                )}
              </Descriptions>
            )}
          </Col>

          <Col xs={24} lg={12}>
            <div>
              <Text strong style={{ marginBottom: "16px" }}>
                Tiến trình xử lý
              </Text>
              {request.status === "pending" ? (
                <Steps
                  current={currentStep}
                  direction="vertical"
                  style={{ marginTop: "16px" }}
                >
                  <Steps.Step
                    title="Admin xử lý yêu cầu"
                    description={
                      canBeProcessed ? "Có thể xử lý ngay" : "Chờ hết hạn thu hồi"
                    }
                    icon={<ExclamationCircleOutlined />}
                  />
                  <Steps.Step
                    title="Hoàn tất xử lý"
                    description="Chờ xử lý"
                    icon={<CheckCircleOutlined />}
                  />
                </Steps>
              ) : (
                <Timeline style={{ marginTop: "16px" }}>
                  <Timeline.Item color="blue">
                    <Text>
                      Yêu cầu được tạo:{" "}
                      {new Date(request.requested_at).toLocaleString("vi-VN")}
                    </Text>
                  </Timeline.Item>
                  {request.reviewed_at && (
                    <Timeline.Item
                      color={
                        request.status === "approved"
                          ? "green"
                          : request.status === "rejected"
                          ? "red"
                          : "gray"
                      }
                      dot={
                        request.status === "approved" ? (
                          <CheckCircleOutlined />
                        ) : request.status === "rejected" ? (
                          <CloseCircleOutlined />
                        ) : (
                          <StopOutlined />
                        )
                      }
                    >
                      <Text>
                        {request.status === "approved"
                          ? "Đã phê duyệt"
                          : request.status === "rejected"
                          ? "Đã từ chối"
                          : "Đã hủy"}
                        :{" "}
                        {new Date(request.reviewed_at).toLocaleString("vi-VN")}
                      </Text>
                      {request.reviewed_by_id && (
                        <div>
                          <Text type="secondary">
                            Bởi:{" "}
                            {request.reviewed_by_name &&
                            request.reviewed_by_name.trim()
                              ? request.reviewed_by_name
                              : request.reviewed_by_id}
                          </Text>
                        </div>
                      )}
                    </Timeline.Item>
                  )}
                </Timeline>
              )}
            </div>

            {request.status === "approved" && (
              <Alert
                message="Đối tác sẽ ngừng hoạt động sau 30 ngày"
                description="Đối tác có trách nhiệm thanh toán toàn bộ các khoản chi trả trước khi chính thức hủy. Tất cả các hợp đồng đang hoạt động sẽ chuyển sang trạng thái chờ hủy."
                type="warning"
                showIcon
                icon={<ExclamationCircleOutlined />}
                style={{ marginTop: "16px" }}
              />
            )}
          </Col>
        </Row>
      </div>
    );
  };

  // Table columns for older deletion requests
  const olderRequestsColumns = [
    {
      title: "ID Yêu cầu",
      dataIndex: "request_id",
      key: "request_id",
      width: 120,
      render: (id) => `#${id}`,
    },
    {
      title: "Người yêu cầu",
      dataIndex: "requested_by",
      key: "requested_by",
      width: 200,
      render: (userId, record) => {
        const publicUser = userId && publicUsers[userId];

        if (publicUser?.loading) {
          return <Spin size="small" />;
        }

        if (publicUser?.data) {
          const user = publicUser.data;
          return (
            user.full_name ||
            user.display_name ||
            user.email ||
            user.username ||
            userId
          );
        }

        if (record.requested_by_name && record.requested_by_name.trim()) {
          return record.requested_by_name;
        }

        return userId || "-";
      },
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "requested_at",
      key: "requested_at",
      width: 180,
      render: (date) => Utils.formatStringVietnameseDateTime(date),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => (
        <Tag color={getDeletionStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: "Người xử lý",
      dataIndex: "reviewed_by_name",
      key: "reviewed_by_name",
      width: 200,
      render: (name, record) => {
        if (!record.reviewed_by_id) return "-";
        return name && name.trim() ? name : record.reviewed_by_id;
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleViewDetail(record)}
          style={{ padding: 0 }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const formFields = [
    {
      name: "user_id",
      label: "Chỉ định người dùng",
      type: "select",
      placeholder: usersLoading
        ? "Đang tải danh sách người dùng..."
        : "Chọn người dùng",
      required: true,
      rules: [{ required: true, message: "Vui lòng chọn người dùng!" }],
      options: userOptions,
      showSearch: true,
      filterOption: (input, option) =>
        option?.label?.toLowerCase().includes(input.toLowerCase()),
      loading: usersLoading,
    },
  ];

  // Form fields for process deletion request modal
  const processFormFields = [
    {
      name: "review_note",
      label: "Ghi chú xử lý",
      type: "textarea",
      placeholder: "Nhập ghi chú về quyết định của bạn (tùy chọn)",
      rows: 4,
      maxLength: 500,
    },
  ];

  return (
    <Content className="partner-detail-content">
      <div className="partner-detail-container">
        <div className="partner-detail-header">
          <div className="partner-detail-breadcrumb">
            <Link href="/accounts/partner">
              <Button type="text" icon={<ArrowLeftOutlined />}>
                Quay lại danh sách
              </Button>
            </Link>
          </div>

          <div className="partner-detail-title-section">
            <div className="partner-detail-title-content">
              <Title level={2} className="partner-detail-title">
                {partner.partner_display_name}
              </Title>
              <Text type="secondary" className="partner-detail-subtitle">
                {partner.partner_tagline}
              </Text>
              <div className="partner-detail-tags">
                <Tag color={getStatusColor(partner.status)}>
                  {getStatusText(partner.status)}
                </Tag>
                <Tag color="blue">Thành lập: {partner.year_established}</Tag>
              </div>
            </div>
            {partner.status === "active" && (
              <div>
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={handleCreateAccount}
                >
                  Thêm tài khoản cho công ty
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="partner-detail-main">
          <Row gutter={[24, 24]} className="partner-detail-row">
            <Col xs={24} lg={14}>
              <Card title="Thông tin cơ bản" className="partner-detail-card">
                <Descriptions column={2} bordered size="small">
                  <Descriptions.Item label="Tên hiển thị" span={2}>
                    <Text strong>{partner.partner_display_name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên pháp lý" span={2}>
                    {partner.legal_company_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên giao dịch" span={2}>
                    {partner.partner_trading_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Slogan" span={2}>
                    {partner.partner_tagline}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mô tả" span={2}>
                    {partner.partner_description}
                  </Descriptions.Item>
                  <Descriptions.Item label="Năm thành lập">
                    {partner.year_established}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày thành lập">
                    {new Date(partner.incorporation_date).toLocaleDateString(
                      "vi-VN"
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Loại công ty">
                    {partner.company_type === "domestic"
                      ? "Trong nước"
                      : "Nước ngoài"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Tag color={getStatusColor(partner.status)}>
                      {getStatusText(partner.status)}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} lg={10}>
              <Card title="Chỉ số tin cậy" className="partner-detail-card">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="Kinh nghiệm"
                      value={partner.trust_metric_experience}
                      suffix="năm"
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Khách hàng"
                      value={partner.trust_metric_clients}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Tỷ lệ thanh toán"
                      value={partner.trust_metric_claim_rate}
                      suffix="%"
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Đánh giá"
                      value={partner.partner_rating_score.toFixed(1)}
                      suffix={`/ 5 (${partner.partner_rating_count})`}
                    />
                  </Col>
                </Row>
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">Tổng chi trả: </Text>
                  <Text strong>{partner.total_payouts}</Text>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="partner-detail-row">
            <Col xs={24} lg={12}>
              <Card title="Thông tin liên hệ" className="partner-detail-card">
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Email">
                    {partner.partner_official_email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Điện thoại">
                    {partner.partner_phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hotline">
                    {partner.hotline}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hotline CSKH">
                    {partner.customer_service_hotline}
                  </Descriptions.Item>
                  <Descriptions.Item label="Fax">
                    {partner.fax_number}
                  </Descriptions.Item>
                  <Descriptions.Item label="Website">
                    <a
                      href={partner.partner_website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {partner.partner_website}
                    </a>
                  </Descriptions.Item>
                  <Descriptions.Item label="Giờ hỗ trợ">
                    {partner.support_hours}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Địa chỉ & Khu vực" className="partner-detail-card">
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Trụ sở chính" span={2}>
                    {partner.head_office_address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tỉnh/Thành phố">
                    {partner.province_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phường/Xã">
                    {partner.ward_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mã bưu chính">
                    {partner.postal_code}
                  </Descriptions.Item>
                  <Descriptions.Item label="Khu vực phủ sóng" span={2}>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}
                    >
                      {partner.coverage_areas.split(",").map((area, index) => (
                        <Tag key={index} color="blue">
                          {area.trim()}
                        </Tag>
                      ))}
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="partner-detail-row">
            <Col xs={24} lg={12}>
              <Card title="Thông tin pháp lý" className="partner-detail-card">
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Mã số thuế">
                    {partner.tax_identification_number}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số đăng ký kinh doanh">
                    {partner.business_registration_number}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số giấy phép bảo hiểm">
                    {partner.insurance_license_number}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày cấp giấy phép">
                    {new Date(partner.license_issue_date).toLocaleDateString(
                      "vi-VN"
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày hết hạn">
                    {new Date(partner.license_expiry_date).toLocaleDateString(
                      "vi-VN"
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Dịch vụ bảo hiểm" className="partner-detail-card">
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Các loại bảo hiểm được phép:</Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: 16,
                  }}
                >
                  {partner.authorized_insurance_lines.map((line, index) => (
                    <Tag key={index} color="green">
                      {line}
                    </Tag>
                  ))}
                </div>
                <div style={{ marginTop: 16 }}>
                  <Text strong>Tỉnh/Thành phố hoạt động:</Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: 8,
                  }}
                >
                  {partner.operating_provinces.map((province, index) => (
                    <Tag key={index} color="purple">
                      {province}
                    </Tag>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="partner-detail-row">
            <Col xs={24}>
              <Card
                title="Thông tin thanh toán chi trả"
                className="partner-detail-card"
              >
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Tổng chi trả">
                        <Text strong>{partner.total_payouts}</Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                  <Col xs={24} md={8}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Thời gian chi trả TB">
                        <Text strong>{partner.average_payout_time}</Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                  <Col xs={24} md={8}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Thời gian xác nhận">
                        <Text strong>{partner.confirmation_timeline}</Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="partner-detail-row">
            <Col xs={24}>
              <Card title="Thông tin hệ thống" className="partner-detail-card">
                <Descriptions column={3} bordered size="small">
                  <Descriptions.Item label="Ngày tạo">
                    {new Date(partner.created_at).toLocaleString("vi-VN")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cập nhật lần cuối">
                    {new Date(partner.updated_at).toLocaleString("vi-VN")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Người cập nhật">
                    {partner.last_updated_by_name}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="partner-detail-row">
            <Col xs={24}>
              {/* Partner Deletion Requests Section */}
              {deletionLoading && deletionRequests.length === 0 ? (
                <Card
                  title="Yêu cầu hủy đối tác"
                  className="partner-detail-card"
                >
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Spin size="large" tip="Đang tải yêu cầu hủy..." />
                  </div>
                </Card>
              ) : deletionRequests.length === 0 ? (
                <Card
                  title="Yêu cầu hủy đối tác"
                  className="partner-detail-card"
                >
                  <Empty
                    description="Không có yêu cầu hủy nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </Card>
              ) : (
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  {/* Most Recent Request - Full Details */}
                  {mostRecentRequest && (
                    <Card
                      title="Yêu cầu hủy mới nhất"
                      className="partner-detail-card"
                    >
                      {renderRequestDetails(mostRecentRequest, true)}
                    </Card>
                  )}

                  {/* Older Requests - Table View */}
                  {olderRequests.length > 0 && (
                    <Card
                      title={`Lịch sử yêu cầu hủy (${olderRequests.length})`}
                      className="partner-detail-card"
                    >
                      <CustomTable
                        dataSource={olderRequests}
                        columns={olderRequestsColumns}
                        rowKey="request_id"
                        pagination={{
                          pageSize: 5,
                          showSizeChanger: true,
                          pageSizeOptions: ["5", "10", "20"],
                        }}
                      />
                    </Card>
                  )}
                </Space>
              )}
            </Col>
          </Row>
        </div>
      </div>

      <Modal
        title="Chỉ định tài khoản người dùng cho đối tác"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={500}
        centered
        destroyOnClose
      >
        <div style={{ paddingTop: "20px" }}>
          <CustomForm
            fields={formFields}
            gridColumns="1fr"
            gap="16px"
            onSubmit={handleFormSubmit}
            initialValues={{
              user_id: undefined,
            }}
          />
          <div
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            <Button onClick={handleModalCancel}>Hủy</Button>
            <Button
              type="primary"
              loading={submitting}
              onClick={() => {
                const formElement = document.querySelector("form");
                if (formElement) {
                  formElement.dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true })
                  );
                }
              }}
            >
              Chỉ định tài khoản
            </Button>
          </div>
        </div>
      </Modal>

      {/* Process Deletion Request Modal */}
      <Modal
        title={
          processingStatus === "approved"
            ? "Phê duyệt yêu cầu hủy đối tác"
            : "Từ chối yêu cầu hủy đối tác"
        }
        open={isProcessModalVisible}
        onCancel={handleProcessModalCancel}
        footer={null}
        width={600}
        centered
        destroyOnClose
      >
        <div style={{ paddingTop: "20px" }}>
          {processingStatus === "approved" ? (
            <Alert
              message="Xác nhận phê duyệt"
              description="Sau khi phê duyệt, đối tác sẽ có 30 ngày notice period để thanh toán các khoản chi trả và xử lý các hợp đồng đang hoạt động. Sau đó, tài khoản sẽ bị vô hiệu hóa."
              type="warning"
              showIcon
              style={{ marginBottom: "24px" }}
            />
          ) : (
            <Alert
              message="Xác nhận từ chối"
              description="Yêu cầu hủy sẽ bị từ chối và đối tác sẽ tiếp tục hoạt động bình thường. Đối tác có thể tạo yêu cầu hủy mới sau này."
              type="info"
              showIcon
              style={{ marginBottom: "24px" }}
            />
          )}

          <CustomForm
            fields={processFormFields}
            gridColumns="1fr"
            gap="16px"
            onSubmit={handleProcessSubmit}
            initialValues={{
              review_note: "",
            }}
          />

          <div
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            <Button onClick={handleProcessModalCancel} disabled={processing}>
              Hủy
            </Button>
            <Button
              type="primary"
              danger={processingStatus === "rejected"}
              loading={processing}
              onClick={() => {
                const formElement = document.querySelector("form");
                if (formElement) {
                  formElement.dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true })
                  );
                }
              }}
              style={
                processingStatus === "approved"
                  ? { background: "#52c41a", borderColor: "#52c41a" }
                  : {}
              }
            >
              {processingStatus === "approved" ? "Phê duyệt" : "Từ chối"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Detail Modal for Older Requests */}
      <Modal
        title="Chi tiết yêu cầu hủy đối tác"
        open={isDetailModalVisible}
        onCancel={handleDetailModalCancel}
        footer={null}
        width={1200}
        centered
        destroyOnClose
      >
        {viewingRequest && renderRequestDetails(viewingRequest, false)}
      </Modal>
    </Content>
  );
}
