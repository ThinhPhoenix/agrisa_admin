"use client";

import { formatUtcDate } from "@/libs/datetime";
import { paymentMessage } from "@/libs/message";
import { usePaymentDetail } from "@/services/hooks/payment/use-payment-detail";
import {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    CopyOutlined,
    DollarOutlined,
    EyeOutlined,
    FileTextOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Descriptions,
    Row,
    Space,
    Spin,
    Tag,
    Typography,
    message,
} from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";

const { Title, Text, Paragraph } = Typography;

export default function PaymentDetailPage() {
    const params = useParams();
    const paymentId = params.id;

    const { payment, loading, error } = usePaymentDetail(paymentId);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        message.success("Đã sao chép vào clipboard");
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                color: "orange",
                icon: <ClockCircleOutlined />,
                text: paymentMessage.status.pending,
            },
            completed: {
                color: "green",
                icon: <CheckCircleOutlined />,
                text: paymentMessage.status.completed,
            },
            failed: {
                color: "red",
                icon: <CloseCircleOutlined />,
                text: paymentMessage.status.failed,
            },
            cancelled: {
                color: "gray",
                icon: <CloseCircleOutlined />,
                text: paymentMessage.status.cancelled,
            },
        };
        return (
            configs[status] || { color: "default", icon: null, text: status }
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <Title level={4}>Lỗi tải dữ liệu</Title>
                <Text>{error.message}</Text>
                <br />
                <Link href="/internal/payments/list">
                    <Button type="primary" className="mt-4">
                        <ArrowLeftOutlined /> Quay lại danh sách
                    </Button>
                </Link>
            </div>
        );
    }

    if (!payment) {
        return (
            <div className="text-center">
                <Title level={4}>Không tìm thấy đơn hàng</Title>
                <Link href="/internal/payments/list">
                    <Button type="primary" className="mt-4">
                        <ArrowLeftOutlined /> Quay lại danh sách
                    </Button>
                </Link>
            </div>
        );
    }

    const statusConfig = getStatusConfig(payment.status);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <Space className="mb-4">
                    <Link href="/payments">
                        <Button type="text" icon={<ArrowLeftOutlined />}>
                            Quay lại danh sách
                        </Button>
                    </Link>
                </Space>

                <div className="flex justify-between items-center">
                    <div>
                        <Title level={2} className="mb-2">
                            <ShoppingCartOutlined className="mr-2" />
                            Đơn hàng #{payment.order_code}
                        </Title>
                        <Space>
                            <Tag
                                color={statusConfig.color}
                                icon={statusConfig.icon}
                            >
                                {statusConfig.text}
                            </Tag>
                            <Text type="secondary">
                                {paymentMessage.type[payment.type] ||
                                    payment.type}
                            </Text>
                        </Space>
                    </div>
                </div>
            </div>

            <Row gutter={[16, 16]}>
                {/* Basic Information */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <>
                                <FileTextOutlined className="mr-2" />
                                Thông tin cơ bản
                            </>
                        }
                        className="h-full"
                    >
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Mã đơn hàng">
                                <Space>
                                    <Text strong>{payment.order_code}</Text>
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<CopyOutlined />}
                                        onClick={() =>
                                            copyToClipboard(payment.order_code)
                                        }
                                    />
                                </Space>
                            </Descriptions.Item>

                            <Descriptions.Item label="Số tiền">
                                <Text
                                    strong
                                    style={{
                                        fontSize: "18px",
                                        color: "#1890ff",
                                    }}
                                >
                                    {parseFloat(
                                        payment.amount
                                    )?.toLocaleString()}{" "}
                                    VND
                                </Text>
                            </Descriptions.Item>

                            <Descriptions.Item label="Mô tả">
                                <Paragraph
                                    ellipsis={{ rows: 2, expandable: true }}
                                >
                                    {payment.description}
                                </Paragraph>
                            </Descriptions.Item>

                            <Descriptions.Item label="Loại thanh toán">
                                <Tag color="blue">
                                    {paymentMessage.type[payment.type] ||
                                        payment.type}
                                </Tag>
                            </Descriptions.Item>

                            <Descriptions.Item label="Trạng thái">
                                <Tag
                                    color={statusConfig.color}
                                    icon={statusConfig.icon}
                                >
                                    {statusConfig.text}
                                </Tag>
                            </Descriptions.Item>

                            <Descriptions.Item label="ID người dùng">
                                <Space>
                                    <Text>{payment.user_id}</Text>
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<CopyOutlined />}
                                        onClick={() =>
                                            copyToClipboard(payment.user_id)
                                        }
                                    />
                                </Space>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {/* Payment Details */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <>
                                <DollarOutlined className="mr-2" />
                                Chi tiết thanh toán
                            </>
                        }
                        className="h-full"
                    >
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Ngày tạo">
                                {formatUtcDate(payment.created_at)}
                            </Descriptions.Item>

                            <Descriptions.Item label="Ngày cập nhật">
                                {formatUtcDate(payment.updated_at)}
                            </Descriptions.Item>

                            {payment.paid_at && (
                                <Descriptions.Item label="Ngày thanh toán">
                                    {formatUtcDate(payment.paid_at)}
                                </Descriptions.Item>
                            )}

                            {payment.expired_at && (
                                <Descriptions.Item label="Ngày hết hạn">
                                    {formatUtcDate(payment.expired_at)}
                                </Descriptions.Item>
                            )}

                            {payment.deleted_at && (
                                <Descriptions.Item label="Ngày xóa">
                                    {formatUtcDate(payment.deleted_at)}
                                </Descriptions.Item>
                            )}

                            <Descriptions.Item label="Link thanh toán">
                                {payment.checkout_url ? (
                                    <a
                                        href={payment.checkout_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Mở link thanh toán <EyeOutlined />
                                    </a>
                                ) : (
                                    <Text type="secondary">Không có</Text>
                                )}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {/* Items */}
                {payment.items && payment.items.length > 0 && (
                    <Col xs={24}>
                        <Card title="Chi tiết sản phẩm">
                            <div className="space-y-4">
                                {payment.items.map((item, index) => (
                                    <Card
                                        key={item.id || index}
                                        size="small"
                                        className="bg-gray-50"
                                    >
                                        <Row gutter={[16, 8]} align="middle">
                                            <Col xs={24} sm={12}>
                                                <div>
                                                    <Text strong>
                                                        {item.name}
                                                    </Text>
                                                    <br />
                                                    <Text type="secondary">
                                                        ID: {item.item_id}
                                                    </Text>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <Text>
                                                    Số lượng: {item.quantity}
                                                </Text>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <Text strong>
                                                    {parseFloat(
                                                        item.price
                                                    )?.toLocaleString()}{" "}
                                                    VND
                                                </Text>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}
                            </div>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
}
