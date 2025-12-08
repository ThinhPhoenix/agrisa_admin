import { usePartnerProfile } from "@/services/hooks/common/use-partner-profile";
import {
  DollarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Descriptions, Tag, Typography } from "antd";
import { useEffect } from "react";

const { Title, Text } = Typography;

export function BasicInfoTab({
  policy,
  farm,
  formatCurrency,
  formatDate,
  formatUnixDate,
  getStatusLabel,
  getUnderwritingLabel,
}) {
  const { data: partnerData, fetchProfile } = usePartnerProfile();

  // Fetch partner profile when insurance_provider_id changes
  useEffect(() => {
    if (policy?.insurance_provider_id) {
      fetchProfile(policy.insurance_provider_id);
    }
  }, [policy?.insurance_provider_id, fetchProfile]);
  // Backend may send ISO datetime strings (e.g. "2025-12-06T17:57:24.383262Z").
  // `formatDate` in this codebase expects a Unix timestamp in seconds.
  // Parse ISO -> milliseconds and convert to seconds to avoid passing
  // milliseconds which would yield an incorrect future year.
  const parseMaybeISO = (v) => {
    if (typeof v === "string") {
      const ms = Date.parse(v);
      if (Number.isNaN(ms)) return v;
      return Math.floor(ms / 1000); // return seconds
    }
    return v;
  };
  // If you want to show the server-side date (UTC) instead of local time,
  // render using UTC so a timestamp like "2025-12-07T20:07:00Z" remains 07/12/2025
  const formatDateUTC = (maybeIsoOrTs) => {
    const ts = parseMaybeISO(maybeIsoOrTs);
    if (!ts) return "-";
    const d = new Date(Number(ts) * 1000);
    return d.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    });
  };
  // Helper to render status tag
  const renderStatusTag = (status) => {
    const statusConfig = {
      draft: { color: "default" },
      pending_review: { color: "orange" },
      pending_payment: { color: "cyan" },
      active: { color: "green" },
      expired: { color: "red" },
      cancelled: { color: "red" },
      rejected: { color: "red" },
    };

    const config = statusConfig[status] || { color: "default" };
    return <Tag color={config.color}>{getStatusLabel(status)}</Tag>;
  };

  const renderUnderwritingTag = (status) => {
    const config = {
      pending: { color: "orange" },
      approved: { color: "green" },
      rejected: { color: "red" },
    };

    const statusConfig = config[status] || { color: "default" };
    return <Tag color={statusConfig.color}>{getUnderwritingLabel(status)}</Tag>;
  };

  return (
    <div className="space-y-4">
      {/* Policy Information */}
      <Card
        className="border-gray-200"
        style={{
          backgroundColor: "#fefcf5",
          borderColor: "#e5e7eb",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FileTextOutlined className="text-lg text-blue-500" />
          <Title level={5} className="mb-0">
            Thông tin đơn bảo hiểm
          </Title>
        </div>
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
          <Descriptions.Item label="Số đơn bảo hiểm">
            <strong>{policy.policy_number}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái đơn">
            {renderStatusTag(policy.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái thẩm định">
            {renderUnderwritingTag(policy.underwriting_status)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {formatDateUTC(policy.created_at)}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối">
            {formatDateUTC(policy.updated_at)}
          </Descriptions.Item>
          {/* <Descriptions.Item label={policyMessage.fields.registeredBy}>
            {policy.registered_by || "-"}
          </Descriptions.Item> */}
        </Descriptions>
      </Card>

      {/* Coverage Information */}
      <Card
        className="border-gray-200"
        style={{
          backgroundColor: "#fefcf5",
          borderColor: "#e5e7eb",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <DollarOutlined className="text-lg text-green-500" />
          <Title level={5} className="mb-0">
            Thông tin bảo hiểm
          </Title>
        </div>
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
          <Descriptions.Item label="Số tiền bảo hiểm">
            <strong className="text-lg text-blue-600">
              {formatCurrency(policy.coverage_amount)}
            </strong>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày bắt đầu">
            {policy.coverage_start_date
              ? formatUnixDate(policy.coverage_start_date)
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc">
            {formatUnixDate(policy.coverage_end_date)}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng phí bảo hiểm">
            <strong>{formatCurrency(policy.total_farmer_premium)}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Đã thanh toán">
            <Tag color={policy.premium_paid_by_farmer ? "green" : "orange"}>
              {policy.premium_paid_by_farmer ? "Có" : "Không"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày thanh toán">
            {policy.premium_paid_at ? formatDate(policy.premium_paid_at) : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày gieo trồng">
            {formatUnixDate(policy.planting_date)}
          </Descriptions.Item>
          <Descriptions.Item label="Hệ số diện tích">
            {policy.area_multiplier}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Farmer & Provider Info */}
      <Card
        className="border-gray-200"
        style={{
          backgroundColor: "#fefcf5",
          borderColor: "#e5e7eb",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <UserOutlined className="text-lg text-orange-500" />
          <Title level={5} className="mb-0">
            Thông tin nông dân & nhà cung cấp
          </Title>
        </div>
        <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
          <Descriptions.Item label="Mã nông dân">
            {policy.farmer_id}
          </Descriptions.Item>
          <Descriptions.Item label="Nhà cung cấp">
            {partnerData?.partner_display_name || policy.insurance_provider_id}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Farm Information */}
      {farm && (
        <Card
          className="border-gray-200"
          style={{
            backgroundColor: "#fefcf5",
            borderColor: "#e5e7eb",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <EnvironmentOutlined className="text-lg text-green-600" />
            <Title level={5} className="mb-0">
              Thông tin trang trại
            </Title>
          </div>
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
            <Descriptions.Item label="Tên nông trại">
              {farm.farm_name}
            </Descriptions.Item>
            <Descriptions.Item label="Mã trang trại">
              {farm.farm_code}
            </Descriptions.Item>
            <Descriptions.Item label="Diện tích (m²)">
              {farm.area_sqm?.toLocaleString()} m²
            </Descriptions.Item>
            <Descriptions.Item label="Loại cây trồng">
              {farm.crop_type}
            </Descriptions.Item>
            <Descriptions.Item label="Tỉnh/Thành phố">
              {farm.province}
            </Descriptions.Item>
            <Descriptions.Item label="Quận/Huyện">
              {farm.district}
            </Descriptions.Item>
            <Descriptions.Item label="Xã/Phường" span={3}>
              {farm.commune}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Financial Info */}
      <Card
        className="border-gray-200"
        style={{
          backgroundColor: "#fefcf5",
          borderColor: "#e5e7eb",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <DollarOutlined className="text-lg text-purple-500" />
          <Title level={5} className="mb-0">
            Thông tin chi phí dữ liệu
          </Title>
        </div>
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
          <Descriptions.Item label="Điểm độ phức tạp dữ liệu">
            {policy.data_complexity_score}
          </Descriptions.Item>
          <Descriptions.Item label="Chi phí dữ liệu hàng tháng">
            {formatCurrency(policy.monthly_data_cost)}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng chi phí dữ liệu">
            {formatCurrency(policy.total_data_cost)}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
