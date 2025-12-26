"use client";

import CustomTable from "@/components/custom-table";
import { formatUtcDate } from "@/libs/datetime";
import { paymentMessage } from "@/libs/message";
import { useTableData } from "@/services/hooks/common/use-table-data";
import { useListOrders } from "@/services/hooks/payment/use-list-orders";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Space, Spin, Tag, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";

const { Title } = Typography;

export default function PaymentListPage() {
    const { orders, loading, error } = useListOrders();

    // Frontend table data hook
    const {
        paginatedData,
        handleFormSubmit,
        handleClearFilters: clearTableFilters,
        paginationConfig,
        searchText,
        filters: tableFilters,
    } = useTableData(orders || [], {
        searchFields: ["order_code", "description", "user_id"],
        defaultFilters: {
            status: "",
            type: "",
        },
        pageSize: 10,
    });

    const handleClearFilters = () => {
        clearTableFilters();
    };

    const [visibleColumns, setVisibleColumns] = useState([
        "order_code",
        "amount",
        "description",
        "status",
        "type",
        "created_at",
        "action",
    ]);

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "order_code",
            key: "order_code",
            sorter: (a, b) => a.order_code?.localeCompare(b.order_code),
        },
        {
            title: "Số tiền",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => (
                <span>{parseFloat(amount)?.toLocaleString()} VND</span>
            ),
            sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Loại",
            dataIndex: "type",
            key: "type",
            render: (type) => <span>{paymentMessage.type[type] || type}</span>,
            filters: [
                {
                    text: "Thanh toán đăng ký bảo hiểm",
                    value: "policy_registration_payment",
                },
                {
                    text: "Thanh toán chi trả bảo hiểm",
                    value: "policy_payout_payment",
                },
                {
                    text: "Thanh toán bồi thường",
                    value: "policy_compensation_payment",
                },
                {
                    text: "Thanh toán gia hạn bảo hiểm",
                    value: "policy_renewal_payment",
                },
                {
                    text: "Thanh toán hóa đơn dữ liệu",
                    value: "data_bill_payment",
                },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const statusColors = {
                    pending: "orange",
                    completed: "green",
                    failed: "red",
                    cancelled: "gray",
                };
                return (
                    <Tag color={statusColors[status] || "default"}>
                        {paymentMessage.status[status] || status}
                    </Tag>
                );
            },
            filters: [
                { text: "Chờ thanh toán", value: "pending" },
                { text: "Đã hoàn thành", value: "completed" },
                { text: "Thất bại", value: "failed" },
                { text: "Đã hủy", value: "cancelled" },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "Ngày tạo",
            dataIndex: "created_at",
            key: "created_at",
            render: (date) => formatUtcDate(date),
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Link href={`/payments/${record.id}`}>
                        <Button type="link" icon={<EyeOutlined />}>
                            Xem
                        </Button>
                    </Link>
                </Space>
            ),
        },
    ];

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
                Error loading orders: {error.message}
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <Title level={2}>Đơn hàng thanh toán</Title>
            </div>

            <CustomTable
                dataSource={paginatedData}
                columns={columns}
                visibleColumns={visibleColumns}
                rowKey="id"
                scroll={{ x: 800 }}
                pagination={paginationConfig}
            />
        </div>
    );
}
