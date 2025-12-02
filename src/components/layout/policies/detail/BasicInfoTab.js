import { policyMessage } from "@/libs/message";
import {
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Descriptions, Row, Tag, Typography } from "antd";

const { Title, Text } = Typography;

export function BasicInfoTab({ policy, farm, formatCurrency, formatDate, formatUnixDate, getStatusLabel, getUnderwritingLabel }) {
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
    return (
      <Tag color={config.color}>
        {getStatusLabel(status)}
      </Tag>
    );
  };

  const renderUnderwritingTag = (status) => {
    const config = {
      pending: { color: "orange" },
      approved: { color: "green" },
      rejected: { color: "red" },
    };

    const statusConfig = config[status] || { color: "default" };
    return (
      <Tag color={statusConfig.color}>
        {getUnderwritingLabel(status)}
      </Tag>
    );
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
          <Descriptions.Item label={policyMessage.fields.policyNumber}>
            <strong>{policy.policy_number}</strong>
          </Descriptions.Item>
          <Descriptions.Item label={policyMessage.fields.status}>
            {renderStatusTag(policy.status)}
          </Descriptions.Item>
          <Descriptions.Item label={policyMessage.fields.underwritingStatus}>
            {renderUnderwritingTag(policy.underwriting_status)}
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
          <Descriptions.Item label={policyMessage.fields.coverageAmount}>
            <strong className="text-lg text-blue-600">
              {formatCurrency(policy.coverage_amount)}
            </strong>
          </Descriptions.Item>
          <Descriptions.Item label={policyMessage.fields.coverageStartDate}>
            {policy.coverage_start_date ? formatUnixDate(policy.coverage_start_date) : "-"}
          </Descriptions.Item>
          <Descriptions.Item label={policyMessage.fields.coverageEndDate}>
            {formatUnixDate(policy.coverage_end_date)}
          </Descriptions.Item>
          <Descriptions.Item label={policyMessage.fields.totalPremium}>
            <strong>{formatCurrency(policy.total_farmer_premium)}</strong>
          </Descriptions.Item>
          <Descriptions.Item label={policyMessage.fields.premiumPaid}>
            <Tag color={policy.premium_paid_by_farmer ? "green" : "orange"}>
              {policy.premium_paid_by_farmer ? policyMessage.fields.yes : policyMessage.fields.no}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={policyMessage.fields.premiumPaidAt}>
            {policy.premium_paid_at ? formatDate(policy.premium_paid_at) : "-"}
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
          <Descriptions.Item label={policyMessage.fields.farmerId}>
            {policy.farmer_id}
          </Descriptions.Item>
          <Descriptions.Item label={policyMessage.fields.insuranceProviderId}>
            {policy.insurance_provider_id}
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
            <Descriptions.Item label={policyMessage.fields.farmName}>
              {farm.farm_name}
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.farmCode}>
              {farm.farm_code}
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.farmArea}>
              {farm.area_sqm?.toLocaleString()} m²
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.cropType}>
              {farm.crop_type}
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.province}>
              {farm.province}
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.district}>
              {farm.district}
            </Descriptions.Item>
            <Descriptions.Item label={policyMessage.fields.commune} span={3}>
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
    </div>
  );
}
