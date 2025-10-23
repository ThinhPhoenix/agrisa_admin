"use client";

import { useSources } from "@/services/hooks/data/use-sources";
import {
  Button,
  Card,
  Descriptions,
  Layout,
  Modal,
  Spin,
  Tag,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../../data.css";

const { Title } = Typography;
const { confirm } = Modal;

export default function SourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getSource, deleteSource } = useSources();
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSourceDetail = async () => {
      try {
        setLoading(true);
        const data = await getSource(params.id);
        setSource(data);
      } catch (err) {
        console.error("Error fetching source:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSourceDetail();
    }
  }, [params.id]);

  // Handle delete
  const handleDelete = () => {
    confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa nguồn dữ liệu này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteSource(params.id);
          router.push("/data/sources");
        } catch (err) {
          // Error is handled in the hook
        }
      },
    });
  };

  if (loading) {
    return (
      <Layout.Content className="data-content">
        <div className="data-loading">
          <Spin size="large" tip="Đang tải..." />
        </div>
      </Layout.Content>
    );
  }

  if (!source) {
    return (
      <Layout.Content className="data-content">
        <div className="data-loading">
          <Title level={4}>Không tìm thấy nguồn dữ liệu</Title>
        </div>
      </Layout.Content>
    );
  }

  return (
    <Layout.Content className="data-content">
      <div className="data-space">
        {/* Header */}
        <div className="data-header">
          <div>
            <Title level={2} className="data-title">
              Chi tiết Nguồn Dữ Liệu
            </Title>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              type="primary"
              onClick={() => router.push(`/data/sources/edit/${params.id}`)}
            >
              Chỉnh sửa
            </Button>
            <Button danger onClick={handleDelete}>
              Xóa
            </Button>
            <Button onClick={() => router.push("/data/sources")}>
              Quay lại
            </Button>
          </div>
        </div>

        {/* Detail Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Basic Information */}
          <Card title="Thông tin cơ bản" bordered={false}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Tên hiển thị">
                {source.display_name_vi}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={source.is_active ? "green" : "red"}>
                  {source.is_active ? "Hoạt động" : "Tạm ngừng"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Nguồn dữ liệu">
                {source.data_source}
              </Descriptions.Item>
              <Descriptions.Item label="Tên tham số">
                {source.parameter_name}
              </Descriptions.Item>
              <Descriptions.Item label="Loại tham số">
                {source.parameter_type}
              </Descriptions.Item>
              <Descriptions.Item label="Đơn vị">
                {source.unit || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                {source.description_vi || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Value Range */}
          <Card title="Phạm vi giá trị" bordered={false}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Giá trị tối thiểu">
                {source.min_value !== null && source.min_value !== undefined
                  ? source.min_value
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Giá trị tối đa">
                {source.max_value !== null && source.max_value !== undefined
                  ? source.max_value
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Technical Information */}
          <Card title="Thông tin kỹ thuật" bordered={false}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Tần suất cập nhật">
                {source.update_frequency}
              </Descriptions.Item>
              <Descriptions.Item label="Độ phân giải không gian">
                {source.spatial_resolution || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Độ chính xác">
                {source.accuracy_rating
                  ? `${(source.accuracy_rating * 100).toFixed(1)}%`
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Chi phí cơ bản">
                {source.base_cost
                  ? `${source.base_cost.toLocaleString()} VND`
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Provider Information */}
          <Card title="Thông tin nhà cung cấp" bordered={false}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Nhà cung cấp">
                {source.data_provider || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="API Endpoint" span={2}>
                {source.api_endpoint || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Metadata */}
          <Card title="Metadata" bordered={false}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="ID">{source.id}</Descriptions.Item>
              <Descriptions.Item label="ID Cấp độ dữ liệu">
                {source.data_tier_id}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {source.created_at
                  ? new Date(source.created_at).toLocaleString("vi-VN")
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật">
                {source.updated_at
                  ? new Date(source.updated_at).toLocaleString("vi-VN")
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      </div>
    </Layout.Content>
  );
}
