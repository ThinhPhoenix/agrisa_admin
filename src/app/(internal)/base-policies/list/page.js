"use client";

import CustomForm from "@/components/custom-form";
import CustomTable from "@/components/custom-table";
import { useListBasePolicies } from "@/services/hooks/base-policy/use-list-base-policies";
import useMarkPayment from "@/services/hooks/base-policy/use-mark-payment";
import {
    DollarOutlined,
    FilterOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Button, Collapse, Space, Spin, Tag, Typography, message } from "antd";
import { useMemo, useState } from "react";
import "./policy.css";

const { Title } = Typography;

export default function ListBasePoliciesPage() {
    const { data, loading, error } = useListBasePolicies();
    const [filterValues, setFilterValues] = useState({});
    const { markPayment, loading: markPaymentLoading } = useMarkPayment();

    const handleMarkPayment = async (record) => {
        try {
            const result = await markPayment(record.id);
            if (result.success) {
                message.success("Đã đánh dấu đến kỳ thanh toán thành công!");
                // Có thể refresh data ở đây nếu cần
            } else {
                message.error(result.error || "Có lỗi xảy ra khi đánh dấu thanh toán");
            }
        } catch (err) {
            message.error("Có lỗi xảy ra khi đánh dấu thanh toán");
        }
    };

    const filteredData = useMemo(() => {
        if (!data) return [];

        return data.filter((item) => {
            const { search, status, crop_type } = filterValues;

            if (
                search &&
                !item.product_name
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) &&
                !item.product_code?.toLowerCase().includes(search.toLowerCase())
            ) {
                return false;
            }

            if (status && item.status !== status) {
                return false;
            }

            if (crop_type && item.crop_type !== crop_type) {
                return false;
            }

            return true;
        });
    }, [data, filterValues]);

    const filterFields = [
        {
            name: "search",
            label: "Tìm kiếm",
            type: "input",
            placeholder: "Tên sản phẩm hoặc mã sản phẩm",
        },
        {
            name: "crop_type",
            label: "Loại cây trồng",
            type: "select",
            placeholder: "Chọn loại cây trồng",
            options: [
                { value: "rice", label: "Lúa" },
                { value: "coffee", label: "Cà phê" },
            ],
        },
        {
            name: "status",
            label: "Trạng thái",
            type: "select",
            placeholder: "Chọn trạng thái",
            options: [
                { value: "draft", label: "Nháp" },
                { value: "active", label: "Hoạt động" },
                { value: "payment_due", label: "Tới kỳ thanh toán" },
                { value: "closed", label: "Đã đóng" },
                { value: "archived", label: "Đã lưu trữ" },
                { value: "inactive", label: "Không hoạt động" },
                { value: "pending", label: "Chờ duyệt" },
            ],
        },
        {
            name: "searchButton",
            label: " ",
            type: "button",
            variant: "primary",
            buttonText: "Tìm kiếm",
            startContent: <SearchOutlined size={14} />,
            isSubmit: true,
        },
        {
            name: "clearButton",
            label: " ",
            type: "button",
            variant: "dashed",
            buttonText: "Xóa bộ lọc",
            startContent: <FilterOutlined size={14} />,
            onClick: () => setFilterValues({}),
        },
    ];

    // Get crop type display
    const getCropTypeDisplay = (cropType) => {
        const types = {
            rice: "Lúa",
            coffee: "Cà phê",
        };
        return types[cropType] || cropType;
    };

    // Get status display
    const getStatusDisplay = (status) => {
        const statuses = {
            draft: "Nháp",
            active: "Hoạt động",
            payment_due: "Tới kỳ thanh toán",
            closed: "Đã đóng",
            archived: "Đã lưu trữ",
            inactive: "Không hoạt động",
            pending: "Chờ duyệt",
        };
        return statuses[status] || status;
    };

    const columns = [
        {
            title: "Tên gói bảo hiểm",
            dataIndex: "product_name",
            key: "product_name",
        },
        {
            title: "Mã sản phẩm",
            dataIndex: "product_code",
            key: "product_code",
        },
        {
            title: "Nhà cung cấp bảo hiểm",
            dataIndex: "insurance_provider_id",
            key: "insurance_provider_id",
        },
        {
            title: "Loại cây trồng",
            dataIndex: "crop_type",
            key: "crop_type",
            render: (cropType) => getCropTypeDisplay(cropType),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const getStatusColor = (status) => {
                    const colors = {
                        active: "green",
                        draft: "blue",
                        payment_due: "orange",
                        closed: "gray",
                        archived: "purple",
                        inactive: "red",
                        pending: "gold",
                    };
                    return colors[status] || "default";
                };

                return (
                    <Tag color={getStatusColor(status)}>
                        {getStatusDisplay(status) || "Unknown"}
                    </Tag>
                );
            },
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <Space>
                    {record.status === "active" && (
                        <Button 
                            size="small" 
                            type="primary"
                            loading={markPaymentLoading}
                            onClick={() => handleMarkPayment(record)}
                        >
                            <DollarOutlined /> Tới kỳ thanh toán
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Title level={4} type="danger">
                    Error loading base policies
                </Title>
                <p>{error.message}</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "24px" }}>
            <Title level={2} style={{ marginBottom: "24px" }}>
                Danh sách gói bảo hiểm cơ bản
            </Title>

            {/* Filters */}
            <div className="policy-filters" style={{ marginBottom: "24px" }}>
                <Collapse
                    items={[
                        {
                            key: "1",
                            label: (
                                <Space>
                                    <FilterOutlined />
                                    Bộ lọc tìm kiếm
                                </Space>
                            ),
                            children: (
                                <div className="policy-filter-form">
                                    <div className="space-y-4">
                                        <CustomForm
                                            fields={filterFields}
                                            initialValues={filterValues}
                                            onValuesChange={(
                                                changedValues,
                                                allValues
                                            ) => {
                                                setFilterValues(allValues);
                                            }}
                                            onSubmit={(values) => {
                                                setFilterValues(values);
                                            }}
                                            gridColumns="repeat(auto-fit, minmax(250px, 1fr)) 120px 120px"
                                            gap="16px"
                                        />
                                    </div>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            <CustomTable
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}
