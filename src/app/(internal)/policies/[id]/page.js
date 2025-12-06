"use client";

import {
  BasePolicyTab,
  BasicInfoTab,
  MonitoringDataTab,
} from "@/components/layout/policies/detail";
import { policyMessage } from "@/libs/message";
import { usePolicyDetail, useUpdatePolicy } from "@/services/hooks/policy";
import {
  CheckCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  LineChartOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Modal,
  Select,
  Space,
  Spin,
  Tabs,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { useState } from "react";
import "../policies.css";

const { Title, Text } = Typography;
const { Option } = Select;

export default function PolicyDetailPage() {
  const params = useParams();
  const policyId = params.id;

  const {
    data: policy,
    loading,
    farmData,
    basePolicyData,
    loadingBasePolicy,
    monitoringData,
    loadingMonitoring,
    dataSourceNames,
    loadingDataSources,
    refetch,
    formatCurrency,
    formatDate,
    formatDateTime,
    getStatusLabel,
    getUnderwritingLabel,
  } = usePolicyDetail(policyId);

  const {
    updateStatus,
    updateUnderwriting,
    loading: updating,
  } = useUpdatePolicy();

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [underwritingModalVisible, setUnderwritingModalVisible] =
    useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUnderwriting, setSelectedUnderwriting] = useState("");

  // Helper function to format Unix timestamp
  const formatUnixDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatUnixDateTime = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    try {
      await updateStatus(policyId, selectedStatus);
      setStatusModalVisible(false);
      refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Handle underwriting update
  const handleUnderwritingUpdate = async () => {
    try {
      await updateUnderwriting(policyId, selectedUnderwriting);
      setUnderwritingModalVisible(false);
      refetch();
    } catch (error) {
      console.error("Failed to update underwriting:", error);
    }
  };

  if (loading) {
    return (
      <Layout.Content className="policy-detail-content">
        <div className="policy-loading">
          <Spin size="large" tip={policyMessage.loading.detail} />
        </div>
      </Layout.Content>
    );
  }

  if (!policy) {
    return (
      <Layout.Content className="policy-detail-content">
        <div className="policy-loading">
          <Text>{policyMessage.error.notFound}</Text>
        </div>
      </Layout.Content>
    );
  }

  // Tab items
  const tabItems = [
    {
      key: "basic",
      label: (
        <span className="flex items-center gap-2">
          <FileTextOutlined />
          <span>Thông tin cơ bản</span>
        </span>
      ),
      children: (
        <BasicInfoTab
          policy={policy}
          farm={farmData}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          formatUnixDate={formatUnixDate}
          getStatusLabel={getStatusLabel}
          getUnderwritingLabel={getUnderwritingLabel}
        />
      ),
    },
    {
      key: "basePolicy",
      label: (
        <span className="flex items-center gap-2">
          <SafetyOutlined />
          <span>Hợp đồng bảo hiểm</span>
        </span>
      ),
      children: (
        <BasePolicyTab
          basePolicy={basePolicyData || policy.base_policy}
          loadingBasePolicy={loadingBasePolicy}
          formatCurrency={formatCurrency}
          dataSourceNames={dataSourceNames}
          loadingDataSources={loadingDataSources}
        />
      ),
    },
    {
      key: "monitoring",
      label: (
        <span className="flex items-center gap-2">
          <LineChartOutlined />
          <span>Dữ liệu giám sát</span>
        </span>
      ),
      children: (
        <MonitoringDataTab
          monitoringData={monitoringData}
          loadingMonitoring={loadingMonitoring}
          formatUnixDateTime={formatUnixDateTime}
        />
      ),
    },
  ];

  return (
    <Layout.Content className="policy-detail-content">
      <div className="policy-detail-space">
        {/* Header */}
        <div className="policy-header">
          <div>
            <Space>
              <Title level={2} className="policy-title">
                {policyMessage.title.detail}
              </Title>
            </Space>
          </div>
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedStatus(policy.status);
                setStatusModalVisible(true);
              }}
            >
              {policyMessage.actions.updateStatus}
            </Button>
            <Button
              icon={<CheckCircleOutlined />}
              onClick={() => {
                setSelectedUnderwriting(policy.underwriting_status);
                setUnderwritingModalVisible(true);
              }}
            >
              {policyMessage.actions.updateUnderwriting}
            </Button>
          </Space>
        </div>

        {/* Tabs */}
        <div>
          <Tabs
            defaultActiveKey="basic"
            items={tabItems}
            size="large"
            tabBarStyle={{
              marginBottom: "16px",
            }}
          />
        </div>

        {/* Status Update Modal */}
        <Modal
          title={policyMessage.updateStatus.title}
          open={statusModalVisible}
          onOk={handleStatusUpdate}
          onCancel={() => setStatusModalVisible(false)}
          confirmLoading={updating}
          okText={policyMessage.actions.update}
          cancelText={policyMessage.actions.cancel}
          className="policy-update-modal"
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <Text strong>{policyMessage.updateStatus.currentStatus}: </Text>
              <Text>{getStatusLabel(policy.status)}</Text>
            </div>
            <div>
              <Text strong>{policyMessage.updateStatus.newStatus}:</Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder={policyMessage.updateStatus.label}
              >
                {Object.keys(policyMessage.status).map((key) => (
                  <Option key={key} value={key}>
                    {policyMessage.status[key]}
                  </Option>
                ))}
              </Select>
            </div>
            <Text type="secondary">
              {policyMessage.updateStatus.confirmMessage}
            </Text>
          </Space>
        </Modal>

        {/* Underwriting Update Modal */}
        <Modal
          title={policyMessage.updateUnderwriting.title}
          open={underwritingModalVisible}
          onOk={handleUnderwritingUpdate}
          onCancel={() => setUnderwritingModalVisible(false)}
          confirmLoading={updating}
          okText={policyMessage.actions.update}
          cancelText={policyMessage.actions.cancel}
          className="policy-update-modal"
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <Text strong>
                {policyMessage.updateUnderwriting.currentStatus}:{" "}
              </Text>
              <Text>{getUnderwritingLabel(policy.underwriting_status)}</Text>
            </div>
            <div>
              <Text strong>{policyMessage.updateUnderwriting.newStatus}:</Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
                value={selectedUnderwriting}
                onChange={setSelectedUnderwriting}
                placeholder={policyMessage.updateUnderwriting.label}
              >
                {Object.keys(policyMessage.underwritingStatus).map((key) => (
                  <Option key={key} value={key}>
                    {policyMessage.underwritingStatus[key]}
                  </Option>
                ))}
              </Select>
            </div>
            <Text type="secondary">
              {policyMessage.updateUnderwriting.confirmMessage}
            </Text>
          </Space>
        </Modal>
      </div>
    </Layout.Content>
  );
}
