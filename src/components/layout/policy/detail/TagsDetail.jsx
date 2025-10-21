import CustomTable from '@/components/custom-table';
import {
    DownloadOutlined,
    FileTextOutlined,
    FullscreenOutlined,
    PrinterOutlined,
    TagOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Empty, Modal, Row, Space, Tag, Typography, message } from 'antd';
import React from 'react';
import ContractPreview from '../ContractPreview';

const { Title, Text } = Typography;

// Contract template data
const contractTemplate = {
    "tags": [
        {
            "id": "tag-1",
            "key": "hoTen",
            "label": "Họ và tên",
            "value": "",
            "dataType": "string",
            "index": 1,
            "width": 40
        },
        {
            "id": "tag-2",
            "key": "ngaySinh",
            "label": "Ngày sinh",
            "value": "",
            "dataType": "date",
            "index": 2,
            "width": 40
        },
        {
            "id": "tag-3",
            "key": "soCMND",
            "label": "Số CMND/CCCD",
            "value": "",
            "dataType": "string",
            "index": 3,
            "width": 40
        },
        {
            "id": "tag-4",
            "key": "ngayCap",
            "label": "Ngày cấp",
            "value": "",
            "dataType": "date",
            "index": 4,
            "width": 60
        },
        {
            "id": "tag-5",
            "key": "dienThoai",
            "label": "Số điện thoại",
            "value": "",
            "dataType": "string",
            "index": 5,
            "width": 60
        },
        {
            "id": "tag-6",
            "key": "email",
            "label": "Email",
            "value": "",
            "dataType": "string",
            "index": 6,
            "width": 40
        },
        {
            "id": "tag-7",
            "key": "diaChi",
            "label": "Địa chỉ thường trú",
            "value": "",
            "dataType": "textarea",
            "index": 7,
            "width": 100,
            "rows": 3
        },
        {
            "id": "tag-8",
            "key": "loaiCayTrong",
            "label": "Loại cây trồng",
            "value": "",
            "dataType": "select",
            "index": 8,
            "width": 60
        },
        {
            "id": "tag-9",
            "key": "dienTich",
            "label": "Diện tích (ha)",
            "value": "",
            "dataType": "decimal",
            "index": 9,
            "width": 40
        },
        {
            "id": "tag-10",
            "key": "giaTriBaoHiem",
            "label": "Giá trị bảo hiểm (VNĐ)",
            "value": "",
            "dataType": "integer",
            "index": 10,
            "width": 60
        },
        {
            "id": "tag-11",
            "key": "phiBaoHiem",
            "label": "Phí bảo hiểm (VNĐ)",
            "value": "",
            "dataType": "integer",
            "index": 11,
            "width": 40
        },
        {
            "id": "tag-12",
            "key": "thoiHanBaoHiem",
            "label": "Thời hạn BH (tháng)",
            "value": "",
            "dataType": "integer",
            "index": 12,
            "width": 60
        },
        {
            "id": "tag-13",
            "key": "ngayBatDau",
            "label": "Ngày bắt đầu hiệu lực",
            "value": "",
            "dataType": "date",
            "index": 13,
            "width": 40
        },
        {
            "id": "tag-14",
            "key": "ngayKetThuc",
            "label": "Ngày kết thúc",
            "value": "",
            "dataType": "date",
            "index": 14,
            "width": 40
        },
        {
            "id": "tag-15",
            "key": "thoiGianKyHopDong",
            "label": "Thời gian ký hợp đồng",
            "value": "",
            "dataType": "datetime",
            "index": 15,
            "width": 60
        },
        {
            "id": "tag-16",
            "key": "gioHenGap",
            "label": "Giờ hẹn gặp đại diện",
            "value": "",
            "dataType": "time",
            "index": 16,
            "width": 40
        },
        {
            "id": "tag-17",
            "key": "dongYDieuKhoan",
            "label": "Đồng ý với điều khoản",
            "value": "",
            "dataType": "boolean",
            "index": 17,
            "width": 60
        },
        {
            "id": "tag-18",
            "key": "nhanThongBao",
            "label": "Nhận thông báo qua email",
            "value": "",
            "dataType": "boolean",
            "index": 18,
            "width": 40
        },
        {
            "id": "tag-19",
            "key": "riskCoverage",
            "label": "Rủi ro được bảo hiểm",
            "value": "",
            "dataType": "select",
            "index": 19,
            "width": 100
        },
        {
            "id": "tag-20",
            "key": "ghiChu",
            "label": "Ghi chú thêm",
            "value": "",
            "dataType": "textarea",
            "index": 20,
            "width": 100,
            "rows": 4
        }
    ]
};

const TagsDetail = ({ policyData, mockData }) => {
    const [previewFullscreen, setPreviewFullscreen] = React.useState(false);

    const getDataTypeLabel = (value) => {
        return mockData.tagDataTypes.find(t => t.value === value)?.label || value;
    };

    const formatTagValue = (tag) => {
        if (tag.dataType === 'boolean') {
            return tag.value ? 'Có' : 'Không';
        }
        if (tag.dataType === 'decimal') {
            return parseFloat(tag.value).toLocaleString();
        }
        return tag.value;
    };

    // Use contract-template.json data instead of policyData.tags
    const tags = contractTemplate.tags || [];

    // Columns for tags table
    const tagColumns = [
        {
            title: '#',
            key: 'index',
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên trường',
            key: 'label',
            dataIndex: 'label',
            render: (text, record) => (
                <div>
                    <Text strong>{text || record.key}</Text>
                    <br />
                    <Text type="secondary" code style={{ fontSize: 11 }}>
                        {record.key}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Loại dữ liệu',
            key: 'dataType',
            dataIndex: 'dataType',
            width: 150,
            render: (value) => (
                <Tag color="blue">{getDataTypeLabel(value)}</Tag>
            ),
        },
        {
            title: 'Giá trị',
            key: 'value',
            render: (_, record) => (
                <Text>{formatTagValue(record)}</Text>
            ),
        },
    ];

    return (
        <>
            <Row gutter={[16, 16]}>
                {/* Tags Table */}
                <Col xs={24} lg={12}>
                    <Card>
                        <Title level={4}>
                            <TagOutlined style={{ marginRight: 8 }} />
                            Tags & Metadata
                            <Text type="secondary" style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '8px' }}>
                                ({tags.length} trường)
                            </Text>
                        </Title>

                        {tags.length === 0 ? (
                            <Empty description="Không có tags nào được thêm" />
                        ) : (
                            <CustomTable
                                columns={tagColumns}
                                dataSource={tags}
                                pagination={{
                                    pageSize: 5,
                                    showSizeChanger: false,
                                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} tags`,
                                }}
                            />
                        )}
                    </Card>
                </Col>

                {/* Contract Preview */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<FullscreenOutlined />}
                                    onClick={() => setPreviewFullscreen(true)}
                                >
                                    Xem toàn màn hình
                                </Button>
                            </div>
                        }
                        size="small"
                        bodyStyle={{ padding: 0 }}
                    >
                        <div style={{ height: 'calc(100vh - 200px)' }}>
                            <ContractPreview
                                tagsData={contractTemplate}
                                isFullscreen={false}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Fullscreen Preview Modal */}
            <Modal
                open={previewFullscreen}
                onCancel={() => setPreviewFullscreen(false)}
                width="100%"
                style={{ top: 0, paddingBottom: 0, maxWidth: '100vw' }}
                bodyStyle={{ height: 'calc(100vh - 110px)', padding: 0, overflow: 'auto' }}
                closable={false}
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Space>
                            <FileTextOutlined />
                            <span>Hợp đồng Mẫu - Toàn màn hình</span>
                        </Space>
                        <Space>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={() => message.info('Chức năng xuất PDF sẽ được triển khai sau')}
                            >
                                Xuất PDF
                            </Button>
                            <Button
                                icon={<PrinterOutlined />}
                                onClick={() => window.print()}
                            >
                                In ấn
                            </Button>
                            <Button onClick={() => setPreviewFullscreen(false)}>
                                Đóng
                            </Button>
                        </Space>
                    </div>
                }
                footer={null}
            >
                <ContractPreview tagsData={contractTemplate} isFullscreen={true} />
            </Modal>
        </>
    );
};

export default TagsDetail;
