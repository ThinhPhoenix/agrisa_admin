import { Card, Switch, Tag, Typography } from "antd";
const { Text } = Typography;

export default function HeaderCard({
  latestValidation,
  useAIData,
  setUseAIData,
}) {
  return (
    <Card
      size="small"
      style={{ marginBottom: "16px", background: "#f8f9fa" }}
      bodyStyle={{ padding: "12px" }}
    >
      <div style={{ textAlign: "center" }}>
        <Text type="secondary" style={{ fontSize: "12px" }}>
          Nguồn dữ liệu xác thực
        </Text>
        <br />
        <Tag
          color={latestValidation ? "blue" : "default"}
          style={{ marginTop: "4px" }}
        >
          {latestValidation
            ? `${latestValidation.validated_by || "AI-System"} - ${
                latestValidation.total_checks || 0
              } checks`
            : "Không có dữ liệu AI"}
        </Tag>
        {latestValidation && (
          <>
            <br />
            <div
              style={{
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Sử dụng dữ liệu từ AI:
              </Text>
              <Switch
                checked={useAIData}
                onChange={setUseAIData}
                checkedChildren="Bật"
                unCheckedChildren="Tắt"
                size="small"
              />
            </div>
            <Text
              type="secondary"
              style={{ fontSize: "11px", marginTop: "4px", display: "block" }}
            >
              {useAIData
                ? "Dữ liệu từ AI. Chỉ có thể chọn trạng thái xác thực."
                : "Form trống. Nhập dữ liệu xác thực thủ công."}
            </Text>
          </>
        )}
      </div>
    </Card>
  );
}
