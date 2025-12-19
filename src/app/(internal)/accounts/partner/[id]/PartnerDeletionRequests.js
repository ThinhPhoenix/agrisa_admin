"use client";

import { CustomForm } from "@/components/custom-form";
import { usePartnerDeletion } from "@/services/hooks/partner/use-partner-deletion";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Modal,
  Row,
  Space,
  Spin,
  Steps,
  Tag,
  Timeline,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";

const { Title, Text } = Typography;
const { Step } = Steps;

/**
 * Component to display and manage partner deletion requests for admin
 */
export default function PartnerDeletionRequests({ partnerDetail }) {
  const {
    deletionRequests,
    loading,
    fetchDeletionRequests,
    adminProcessRequest,
    getStatusLabel,
    getStatusColor,
    canProcess,
  } = usePartnerDeletion();

  const [isProcessModalVisible, setIsProcessModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [processingStatus, setProcessingStatus] = useState(null); // "approved" or "rejected"
  const [processing, setProcessing] = useState(false);

  // Fetch deletion requests when component mounts or partner changes
  useEffect(() => {
    if (partnerDetail?.partner_id) {
      // Assuming partner_id is the partner admin user ID
      // If not, we need to fetch the partner admin user ID from the partner detail
      // For now, let's try with partner_id
      fetchDeletionRequests(partnerDetail.partner_id);
    }
  }, [partnerDetail?.partner_id, fetchDeletionRequests]);

  // Get the most recent pending request
  const pendingRequest = useMemo(() => {
    return deletionRequests.find((req) => req.status === "pending");
  }, [deletionRequests]);

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

  // Handle approve/reject button click
  const handleProcessClick = (request, status) => {
    setSelectedRequest(request);
    setProcessingStatus(status);
    setIsProcessModalVisible(true);
  };

  // Handle form submission
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
        if (partnerDetail?.partner_id) {
          await fetchDeletionRequests(partnerDetail.partner_id);
        }
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleModalCancel = () => {
    setIsProcessModalVisible(false);
    setSelectedRequest(null);
    setProcessingStatus(null);
  };

  // Form fields for process modal
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

  if (loading && deletionRequests.length === 0) {
    return (
      <Card title="Yêu cầu hủy đối tác" className="partner-detail-card">
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" tip="Đang tải yêu cầu hủy..." />
        </div>
      </Card>
    );
  }

  if (deletionRequests.length === 0) {
    return (
      <Card title="Yêu cầu hủy đối tác" className="partner-detail-card">
        <Empty
          description="Không có yêu cầu hủy nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <>
      <Card title="Yêu cầu hủy đối tác" className="partner-detail-card">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {deletionRequests.map((request) => {
            const daysRemaining = getDaysRemaining(request.cancellable_until);
            const daysSinceRequest = getDaysSinceRequest(request.requested_at);
            const currentStep = getCurrentStep(request);
            const canBeProcessed = canProcess(request);

            return (
              <div
                key={request.request_id}
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
                          Yêu cầu hủy #{request.request_id.slice(0, 8)}...
                        </Text>
                        <div style={{ marginTop: "8px" }}>
                          <Tag color={getStatusColor(request.status)}>
                            {getStatusLabel(request.status)}
                          </Tag>
                        </div>
                      </div>
                      {request.status === "pending" && (
                        <div>
                          {canBeProcessed ? (
                            <Space>
                              <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                onClick={() =>
                                  handleProcessClick(request, "approved")
                                }
                                style={{ background: "#52c41a" }}
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
                        {request.requested_by_name}
                      </Descriptions.Item>
                      <Descriptions.Item label="Ngày yêu cầu">
                        {new Date(request.requested_at).toLocaleString("vi-VN")}
                      </Descriptions.Item>
                      <Descriptions.Item label="Đã gửi">
                        {daysSinceRequest} ngày trước
                      </Descriptions.Item>
                      <Descriptions.Item label="Hạn thu hồi">
                        {new Date(request.cancellable_until).toLocaleString(
                          "vi-VN"
                        )}
                      </Descriptions.Item>
                      {request.detailed_explanation && (
                        <Descriptions.Item label="Lý do" span={2}>
                          {request.detailed_explanation}
                        </Descriptions.Item>
                      )}
                    </Descriptions>

                    {request.reviewed_by_name && (
                      <Descriptions
                        column={1}
                        bordered
                        size="small"
                        title="Thông tin xử lý"
                        style={{ marginTop: "16px" }}
                      >
                        <Descriptions.Item label="Người xử lý">
                          {request.reviewed_by_name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày xử lý">
                          {new Date(request.reviewed_at).toLocaleString(
                            "vi-VN"
                          )}
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
                          <Step
                            title="Chờ hết hạn thu hồi (7 ngày)"
                            description={
                              daysRemaining > 0
                                ? `Còn ${daysRemaining} ngày`
                                : "Đã hết hạn thu hồi"
                            }
                            icon={<ClockCircleOutlined />}
                          />
                          <Step
                            title="Admin xử lý yêu cầu"
                            description={
                              canBeProcessed
                                ? "Có thể xử lý ngay"
                                : "Chờ hết hạn thu hồi"
                            }
                            icon={<ExclamationCircleOutlined />}
                          />
                          <Step
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
                              {new Date(request.requested_at).toLocaleString(
                                "vi-VN"
                              )}
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
                                {new Date(request.reviewed_at).toLocaleString(
                                  "vi-VN"
                                )}
                              </Text>
                              {request.reviewed_by_name && (
                                <div>
                                  <Text type="secondary">
                                    Bởi: {request.reviewed_by_name}
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
                        description="Đối tác có trách nhiệm thanh toán toàn bộ các khoản bồi thường trước khi chính thức hủy. Tất cả các hợp đồng đang hoạt động sẽ chuyển sang trạng thái chờ hủy."
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
          })}
        </Space>
      </Card>

      {/* Process Request Modal */}
      <Modal
        title={
          processingStatus === "approved"
            ? "Phê duyệt yêu cầu hủy đối tác"
            : "Từ chối yêu cầu hủy đối tác"
        }
        open={isProcessModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        centered
        destroyOnClose
      >
        <div style={{ paddingTop: "20px" }}>
          {processingStatus === "approved" ? (
            <Alert
              message="Xác nhận phê duyệt"
              description="Sau khi phê duyệt, đối tác sẽ có 30 ngày notice period để thanh toán các khoản bồi thường và xử lý các hợp đồng đang hoạt động. Sau đó, tài khoản sẽ bị vô hiệu hóa."
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
            <Button onClick={handleModalCancel} disabled={processing}>
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
    </>
  );
}
