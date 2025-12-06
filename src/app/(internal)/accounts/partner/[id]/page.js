"use client";

import { CustomForm } from "@/components/custom-form";
import { useAccounts } from "@/services/hooks/accounts/use-accounts";
import { usePartners } from "@/services/hooks/partner/use-partner";
import { ArrowLeftOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Layout,
  Modal,
  Row,
  Spin,
  Statistic,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import "../partner.css";

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

  if (loading) {
    return (
      <Content className="partner-content">
        <div className="partner-loading">
          <Spin size="large" tip="Đang tải thông tin đối tác..." />
        </div>
      </Content>
    );
  }

  if (error || !partner) {
    return (
      <Content className="partner-content">
        <div className="partner-error">
          <Title level={3}>Không tìm thấy đối tác</Title>
          <Text>Đối tác với ID {partnerId} không tồn tại.</Text>
          <br />
          <Link href="/accounts/partner">
            <Button
              type="primary"
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
            <div>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={handleCreateAccount}
              >
                Thêm quyền cho đối tác
              </Button>
            </div>
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
                title="Thông tin thanh toán bồi thường"
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
    </Content>
  );
}
