import { policyMessage } from "@/libs/message";
import { SafetyOutlined, FileTextOutlined } from "@ant-design/icons";
import { Card, Descriptions, Typography, Empty } from "antd";

const { Title } = Typography;

export function BasePolicyTab({ basePolicy, formatCurrency }) {
  if (!basePolicy) {
    return <Empty description="Không có thông tin gói bảo hiểm" />;
  }

  return (
    <div className="space-y-4">
      {/* Base Policy Information */}
      <Card
        className="border-gray-200"
        style={{
          backgroundColor: "#fefcf5",
          borderColor: "#e5e7eb",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <SafetyOutlined className="text-lg text-blue-500" />
          <Title level={5} className="mb-0">
            Thông tin gói bảo hiểm
          </Title>
        </div>
        <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
          <Descriptions.Item label={policyMessage.fields.basePolicyName}>
            <strong>{basePolicy.product_name}</strong>
          </Descriptions.Item>
          <Descriptions.Item label={policyMessage.fields.cropType}>
            {basePolicy.crop_type}
          </Descriptions.Item>
          <Descriptions.Item label={policyMessage.fields.coverageCurrency}>
            {basePolicy.coverage_currency}
          </Descriptions.Item>
          <Descriptions.Item label={policyMessage.fields.coverageDuration}>
            {basePolicy.coverage_duration_days} ngày
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Additional Details */}
      {basePolicy.description && (
        <Card
          className="border-gray-200"
          style={{
            backgroundColor: "#fefcf5",
            borderColor: "#e5e7eb",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FileTextOutlined className="text-lg text-red-400" />
            <Title level={5} className="mb-0">
              Mô tả chi tiết
            </Title>
          </div>
          <p className="text-gray-700">{basePolicy.description}</p>
        </Card>
      )}
    </div>
  );
}
