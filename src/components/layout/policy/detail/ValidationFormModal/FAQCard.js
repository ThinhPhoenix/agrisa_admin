import {
  BulbOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Card, Typography } from "antd";
const { Text } = Typography;

export default function FAQCard() {
  return (
    <Card
      title={
        <span style={{ fontWeight: 600 }}>
          <InfoCircleOutlined
            style={{ marginRight: "8px", color: "#1890ff" }}
          />
          Câu hỏi thường gặp
        </span>
      }
      size="small"
      style={{ marginTop: "16px", background: "#f0f7ff" }}
    >
      <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
        <div style={{ marginBottom: "16px" }}>
          <Text strong style={{ color: "#1890ff", fontSize: "14px" }}>
            <CheckCircleOutlined style={{ marginRight: "6px" }} />
            Khi tôi duyệt đơn thì điều gì sẽ xảy ra?
          </Text>
          <br />
          <Text type="secondary">
            Đơn bảo hiểm sẽ được kích hoạt ngay lập tức và chính thức có hiệu
            lực. Nông dân sẽ nhận được thông báo xác nhận và có thể tra cứu
            thông tin đơn bảo hiểm của mình.
          </Text>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <Text strong style={{ color: "#ff4d4f", fontSize: "14px" }}>
            <CloseCircleOutlined style={{ marginRight: "6px" }} />
            Nếu tôi không duyệt đơn thì sao?
          </Text>
          <br />
          <Text type="secondary">
            <span style={{ color: "#d4380d" }}>⚠️ Lưu ý quan trọng:</span> Nếu
            bạn không thực hiện duyệt đơn, đơn đăng ký sẽ{" "}
            <strong>tự động bị hủy</strong> sau 24h. Đối tác sẽ cần đăng ký lại
            từ đầu nếu muốn tiếp tục.
          </Text>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <Text strong style={{ color: "#52c41a", fontSize: "14px" }}>
            <BulbOutlined style={{ marginRight: "6px" }} />
            Các thông số trong form có ý nghĩa gì?
          </Text>
          <br />
          <div style={{ marginLeft: "20px", marginTop: "8px" }}>
            <div style={{ marginBottom: "6px" }}>
              <Text strong>• Độ tin cậy trích xuất:</Text>
              <Text type="secondary">
                {" "}
                Phản ánh mức độ chính xác khi AI đọc và trích xuất thông tin từ
                file PDF. Càng cao (95-100%) thì thông tin càng đáng tin cậy.
              </Text>
            </div>
            <div style={{ marginBottom: "6px" }}>
              <Text strong>• Tổng số kiểm tra:</Text>
              <Text type="secondary">
                {" "}
                Tổng số mục thông tin đã được AI kiểm tra (ví dụ: giá bảo hiểm,
                thời hạn, điều kiện...).
              </Text>
            </div>
            <div style={{ marginBottom: "6px" }}>
              <Text strong>• Số kiểm tra đạt/lỗi:</Text>
              <Text type="secondary">
                {" "}
                Số mục thông tin khớp chính xác giữa PDF và dữ liệu hệ thống, và
                số mục có sai lệch cần xem xét.
              </Text>
            </div>
            <div>
              <Text strong>• Ghi chú xác thực:</Text>
              <Text type="secondary">
                {" "}
                Ghi chú của bạn về quyết định duyệt/từ chối, hoặc các vấn đề cần
                lưu ý cho lần kiểm tra sau.
              </Text>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "12px",
            background: "#fff",
            borderRadius: "4px",
            border: "1px solid #d9d9d9",
          }}
        >
          <Text strong style={{ color: "#1890ff" }}>
            <InfoCircleOutlined style={{ marginRight: "6px" }} />
            Mẹo hữu ích
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Nếu độ tin cậy trích xuất dưới 80% hoặc có nhiều lỗi, hãy xem xét kỹ
            file PDF trước khi duyệt để đảm bảo thông tin chính xác.
          </Text>
        </div>
      </div>
    </Card>
  );
}
