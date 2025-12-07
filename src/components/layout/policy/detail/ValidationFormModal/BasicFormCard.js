import { CustomForm } from "@/components/custom-form";
import { BarChartOutlined } from "@ant-design/icons";
import { Card, Progress, Typography } from "antd";
const { Text } = Typography;

export default function BasicFormCard({
  form,
  fields,
  handleValuesChange,
  formValues,
  successPercent,
}) {
  return (
    <Card
      title={
        <span style={{ fontWeight: 600 }}>
          <BarChartOutlined style={{ marginRight: "8px" }} />
          Thông tin xác thực
        </span>
      }
      size="small"
      style={{ marginBottom: "16px" }}
    >
      <CustomForm
        form={form}
        fields={fields}
        onValuesChange={handleValuesChange}
        gridColumns="repeat(2, 1fr)"
        gap="16px"
      />

      <div style={{ marginTop: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <Text strong>Tỷ lệ thành công</Text>
          <Text>{successPercent}%</Text>
        </div>
        <Progress
          percent={successPercent}
          strokeColor="#52c41a"
          showInfo={false}
        />
      </div>
    </Card>
  );
}
