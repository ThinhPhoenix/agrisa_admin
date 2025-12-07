import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Alert, Typography } from "antd";
const { Text } = Typography;

export default function InfoAlert() {
  return (
    <Alert
      message="Lưu ý về trạng thái xác thực"
      description={
        <div style={{ fontSize: "13px" }}>
          <div style={{ marginBottom: "8px" }}>
            <InfoCircleOutlined
              style={{ color: "#1890ff", marginRight: "6px" }}
            />
            <Text strong>Đang chờ (Pending):</Text> Đơn đang chờ xác thực, chưa
            được xử lý.
          </div>
          <div style={{ marginBottom: "8px" }}>
            <CheckCircleOutlined
              style={{ color: "#52c41a", marginRight: "6px" }}
            />
            <Text strong>AI đã duyệt (Passed AI):</Text> AI đã xác thực và đánh
            giá đơn hợp lệ. Cần xác nhận của admin để kích hoạt.
          </div>
          <div>
            <WarningOutlined style={{ color: "#faad14", marginRight: "6px" }} />
            <Text strong>Cảnh báo (Warning):</Text> Hợp đồng hợp lệ nhưng có
            cách tính tiền có thể gây rủi ro cho bên bảo hiểm. Cần xác nhận kỹ
            trước khi duyệt.
          </div>
        </div>
      }
      type="info"
      showIcon
      style={{ marginBottom: "16px" }}
    />
  );
}
