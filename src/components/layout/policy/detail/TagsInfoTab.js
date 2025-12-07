"use client";

import CustomTable from "@/components/custom-table";
import { Card, Tag, Typography } from "antd";

const { Text, Title } = Typography;

export default function TagsInfoTab({ basePolicy }) {
  // Convert document_tags object to array for display
  const tags = basePolicy.document_tags
    ? Object.entries(basePolicy.document_tags).map(([key, value], index) => ({
        id: `${key}-${index}`,
        key,
        value:
          typeof value === "object" ? JSON.stringify(value) : String(value),
        type: typeof value,
      }))
    : [];

  const tagsColumns = [
    {
      title: "STT",
      key: "index",
      width: "10%",
      render: (_, __, index) => (
        <Text strong style={{ textAlign: "center", display: "block" }}>
          {index + 1}
        </Text>
      ),
    },
    {
      title: "Tên trường (Key)",
      dataIndex: "key",
      key: "key",
      width: "30%",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Giá trị (Value)",
      dataIndex: "value",
      key: "value",
      width: "40%",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Loại dữ liệu",
      dataIndex: "type",
      key: "type",
      width: "20%",
      render: (text) => (
        <Tag
          color={
            text === "string" ? "blue" : text === "number" ? "green" : "default"
          }
        >
          {text}
        </Tag>
      ),
    },
  ];

  return (
    <div className="tags-info-tab">
      {/* Document Tags */}
      <Card
        title={
          <div>
            <Title level={5} style={{ margin: 0 }}>
              Các trường thông tin trong hợp đồng
            </Title>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Các trường thông tin động được trích xuất từ tài liệu PDF
            </Text>
          </div>
        }
        bordered={false}
        style={{ marginBottom: 16 }}
      >
        {tags.length > 0 ? (
          <CustomTable
            columns={tagsColumns}
            dataSource={tags}
            rowKey="id"
            size="middle"
          />
        ) : (
          <Text type="secondary">Chưa có thẻ nào được cấu hình</Text>
        )}
      </Card>

      {/* Additional Information */}
      {basePolicy.important_additional_information && (
        <Card title="Thông tin bổ sung quan trọng" bordered={false}>
          <Text>{basePolicy.important_additional_information}</Text>
        </Card>
      )}
    </div>
  );
}
