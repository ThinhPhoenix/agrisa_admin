"use client";

import { Card, Col, Descriptions, Row, Tag, Typography } from "antd";

const { Title } = Typography;

export default function BasicInfoTab({ basePolicy, formatCurrency, formatDate, getCropTypeDisplay }) {
  return (
    <div className="basic-info-tab">
      {/* Base Policy Information */}
      <Card title="Thông tin cơ bản" bordered={false} style={{ marginBottom: 16 }}>
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

      <Row gutter={[16, 16]}>
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
      </Row>
    </div>
  );
}
