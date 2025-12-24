"use client";

import { usePartnerProfile } from "@/services/hooks/common/use-partner-profile";
import {
  BankOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  NumberOutlined,
  PercentageOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import { Card, Col, Divider, Row, Tag, Typography } from "antd";
import { useEffect } from "react";

const { Title, Text } = Typography;

const iconStyle = { color: "#18573f", marginRight: 8 };

// Info Item Component
const InfoItem = ({
  icon: Icon,
  label,
  value,
  fullWidth = false,
  largeCol = false,
}) => {
  let colSpan = { xs: 24, sm: fullWidth ? 24 : 12, md: fullWidth ? 24 : 8 };
  if (largeCol) {
    colSpan = { xs: 24, sm: 12, md: 12 };
  }

  return (
    <Col xs={colSpan.xs} sm={colSpan.sm} md={colSpan.md} key={label}>
      <div style={{ paddingBottom: "16px" }}>
        <div
          style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}
        >
          {Icon && <Icon style={iconStyle} />}
          <Text
            type="secondary"
            style={{ fontSize: "12px", fontWeight: "500" }}
          >
            {label}
          </Text>
        </div>
        <div style={{ fontSize: "14px", fontWeight: "500", color: "#262626" }}>
          {value}
        </div>
      </div>
    </Col>
  );
};

export default function BasicInfoTab({
  basePolicy,
  formatCurrency,
  formatDate,
  getCropTypeDisplay,
}) {
  const {
    data: partnerData,
    loading: partnerLoading,
    fetchProfile,
  } = usePartnerProfile();

  useEffect(() => {
    if (basePolicy.insurance_provider_id) {
      fetchProfile(basePolicy.insurance_provider_id);
    }
  }, [basePolicy.insurance_provider_id, fetchProfile]);

  return (
    <div className="basic-info-tab">
      <Card title="Thông tin cơ bản" bordered={false}>
        {/* Base Policy Information Section */}
        <div style={{ marginBottom: "32px" }}>
          <Title level={5} style={{ color: "#18573f", marginBottom: "16px" }}>
            Thông tin sản phẩm
          </Title>
          <Row gutter={[16, 16]}>
            <InfoItem
              icon={ProductOutlined}
              label="Tên sản phẩm"
              value={basePolicy.product_name}
            />
            <InfoItem
              icon={NumberOutlined}
              label="Mã sản phẩm"
              value={basePolicy.product_code}
            />
            <InfoItem
              icon={BankOutlined}
              label="Nhà bảo hiểm"
              value={
                partnerLoading
                  ? "Đang tải..."
                  : partnerData?.partner_display_name ||
                    basePolicy.insurance_provider_id
              }
            />
            <InfoItem
              icon={EnvironmentOutlined}
              label="Loại cây trồng"
              value={
                <Tag color="blue">
                  {getCropTypeDisplay(basePolicy.crop_type)}
                </Tag>
              }
            />
            <InfoItem
              icon={CheckCircleOutlined}
              label="Trạng thái"
              value={
                <Tag color={basePolicy.status === "draft" ? "orange" : "green"}>
                  {basePolicy.status === "draft"
                    ? "Bản nháp"
                    : basePolicy.status === "active"
                    ? "Hoạt động"
                    : "Đã lưu trữ"}
                </Tag>
              }
            />
            <InfoItem
              icon={ClockCircleOutlined}
              label="Thời hạn bảo hiểm"
              value={`${basePolicy.coverage_duration_days} ngày`}
            />
            <InfoItem
              icon={FileTextOutlined}
              label="Mô tả"
              value={basePolicy.product_description}
              fullWidth={true}
            />
          </Row>
        </div>

        <Divider style={{ margin: "24px 0" }} />

        {/* Financial Information Section */}
        <div style={{ marginBottom: "32px" }}>
          <Title level={5} style={{ color: "#18573f", marginBottom: "16px" }}>
            Thông tin tài chính
          </Title>
          <Row gutter={[16, 16]}>
            <InfoItem
              icon={DollarOutlined}
              label="Phí bảo hiểm cố định"
              value={formatCurrency(basePolicy.fix_premium_amount)}
              largeCol={true}
            />
            <InfoItem
              icon={PercentageOutlined}
              label="Tỷ lệ phí cơ sở"
              value={`${(basePolicy.premium_base_rate * 100).toFixed(2)}%`}
              largeCol={true}
            />
            <InfoItem
              icon={DollarOutlined}
              label="Chi trả cố định"
              value={formatCurrency(basePolicy.fix_payout_amount)}
              largeCol={true}
            />
            <InfoItem
              icon={PercentageOutlined}
              label="Tỷ lệ chi trả"
              value={`${(basePolicy.payout_base_rate * 100).toFixed(2)}%`}
              largeCol={true}
            />
            <InfoItem
              icon={DollarOutlined}
              label="Giới hạn chi trả tối đa"
              value={formatCurrency(basePolicy.payout_cap)}
              fullWidth={true}
            />
          </Row>
        </div>

        <Divider style={{ margin: "24px 0" }} />

        {/* Enrollment Period Section */}
        <div>
          <Title level={5} style={{ color: "#18573f", marginBottom: "16px" }}>
            Thời gian đăng ký & hiệu lực
          </Title>
          <Row gutter={[16, 16]}>
            <InfoItem
              icon={CalendarOutlined}
              label="Bắt đầu đăng ký"
              value={formatDate(basePolicy.enrollment_start_day)}
              largeCol={true}
            />
            <InfoItem
              icon={CalendarOutlined}
              label="Kết thúc đăng ký"
              value={formatDate(basePolicy.enrollment_end_day)}
              largeCol={true}
            />
            <InfoItem
              icon={CalendarOutlined}
              label="Bảo hiểm có hiệu lực từ"
              value={formatDate(basePolicy.insurance_valid_from_day)}
              largeCol={true}
            />
            <InfoItem
              icon={CalendarOutlined}
              label="Bảo hiểm có hiệu lực đến"
              value={formatDate(basePolicy.insurance_valid_to_day)}
              largeCol={true}
            />
          </Row>
        </div>
      </Card>
    </div>
  );
}
