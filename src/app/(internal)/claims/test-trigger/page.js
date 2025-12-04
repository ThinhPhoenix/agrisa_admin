"use client";

import { CustomForm } from "@/components/custom-form";
import { claimMessage } from "@/libs/message";
import { useTestTrigger } from "@/services/hooks/claim/use-test-trigger";
import { useSources } from "@/services/hooks/data/use-sources";
import { usePolicies } from "@/services/hooks/policy";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Alert, Button, Card, Divider, Layout, Space, Typography } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "./page.css";

const { Title, Text } = Typography;

// Separate component for condition form to use hooks properly
function ConditionForm({
  condition,
  index,
  conditions,
  dataSourceOptions,
  dataSourcesLoading,
  handleConditionChange,
  handleDataSourceChange,
  handleRemoveCondition,
  claimMessage,
}) {
  const conditionFormRef = useRef(null);

  // Update form values when condition state changes (especially after data source selection)
  useEffect(() => {
    if (conditionFormRef.current) {
      conditionFormRef.current.setFieldsValue({
        [`data_source_${condition.id}`]: condition.data_source_id,
        [`parameter_${condition.id}`]: condition.parameter_name,
        [`measured_value_${condition.id}`]: condition.measured_value,
        [`unit_${condition.id}`]: condition.unit,
        [`timestamp_${condition.id}`]: condition.measurement_date,
        [`data_quality_${condition.id}`]: condition.data_quality,
        [`confidence_score_${condition.id}`]: condition.confidence_score,
        [`source_${condition.id}`]: condition.measurement_source,
        [`component_data_${condition.id}`]: condition.component_data,
      });
    }
  }, [
    condition.id,
    condition.data_source_id,
    condition.parameter_name,
    condition.measured_value,
    condition.unit,
    condition.measurement_date,
    condition.data_quality,
    condition.confidence_score,
    condition.measurement_source,
    condition.component_data,
  ]);

  const fields = [
    {
      name: `data_source_${condition.id}`,
      label: "Nguồn dữ liệu (Data Source)",
      type: "select",
      placeholder: "Chọn nguồn dữ liệu để tự động điền thông tin",
      required: true,
      value: condition.data_source_id,
      onChange: (value) => handleDataSourceChange(condition.id, value),
      options: dataSourceOptions,
      showSearch: true,
      loading: dataSourcesLoading,
      optionLabelProp: "labelProp",
      tooltip:
        "Chọn nguồn dữ liệu để tự động điền tên tham số, đơn vị và nguồn đo",
    },
    {
      name: `parameter_${condition.id}`,
      label: "Tên Tham Số",
      type: "input",
      placeholder: "Tự động điền khi chọn Data Source",
      required: true,
      value: condition.parameter_name,
      onChange: (value) =>
        handleConditionChange(condition.id, "parameter_name", value),
      disabled: !!condition.data_source_id,
      tooltip: "Tên tham số - tự động điền khi chọn data source",
    },
    {
      name: `measured_value_${condition.id}`,
      label: "Giá Trị Đo",
      type: "number",
      placeholder: "Nhập giá trị đo được",
      required: true,
      value: condition.measured_value,
      onChange: (value) =>
        handleConditionChange(condition.id, "measured_value", value),
      tooltip: "Giá trị đo được từ data source",
      step: 0.01,
    },
    {
      name: `unit_${condition.id}`,
      label: "Đơn Vị",
      type: "input",
      placeholder: "Tự động điền khi chọn Data Source",
      value: condition.unit,
      onChange: (value) => handleConditionChange(condition.id, "unit", value),
      disabled: !!condition.data_source_id,
      tooltip: "Đơn vị đo - tự động điền khi chọn data source",
    },
    {
      name: `timestamp_${condition.id}`,
      label: "Thời gian đo",
      type: "datetimepicker",
      placeholder: "Chọn ngày giờ đo (để trống = hiện tại)",
      value: condition.measurement_date,
      onChange: (value) =>
        handleConditionChange(condition.id, "measurement_date", value),
      dateFormat: "DD/MM/YYYY HH:mm:ss",
      tooltip: "Chọn thời gian đo dữ liệu, sẽ được chuyển sang Unix timestamp",
    },
    {
      name: `data_quality_${condition.id}`,
      label: "Chất Lượng Dữ Liệu",
      type: "select",
      value: condition.data_quality,
      onChange: (value) =>
        handleConditionChange(condition.id, "data_quality", value),
      disabled: !!condition.data_source_id,
      options: [
        {
          value: "excellent",
          label: "Tuyệt Vời",
        },
        { value: "good", label: "Tốt" },
        { value: "fair", label: "Bình Thường" },
        { value: "poor", label: "Kém" },
      ],
      tooltip: "Chất lượng dữ liệu - tự động điền khi chọn data source",
    },
    {
      name: `confidence_score_${condition.id}`,
      label: "Điểm Tin Cậy",
      type: "number",
      placeholder: "0.0 - 1.0",
      value: condition.confidence_score,
      onChange: (value) =>
        handleConditionChange(condition.id, "confidence_score", value),
      min: 0,
      max: 1,
      step: 0.01,
      tooltip: "Độ tin cậy (0.0-1.0) - tự động điền khi chọn data source",
    },
    {
      name: `source_${condition.id}`,
      label: "Nguồn Đo",
      type: "input",
      placeholder: "Tự động điền khi chọn Data Source",
      value: condition.measurement_source,
      onChange: (value) =>
        handleConditionChange(condition.id, "measurement_source", value),
      disabled: !!condition.data_source_id,
      tooltip: "Nguồn đo dữ liệu - tự động điền khi chọn data source",
    },
    {
      name: `component_data_${condition.id}`,
      label: "Dữ liệu thành phần (Component Data)",
      type: "textarea",
      placeholder: 'JSON format tùy chọn, ví dụ: {"nir": 0.25, "swir": 0.15}',
      value: condition.component_data,
      onChange: (value) =>
        handleConditionChange(condition.id, "component_data", value),
      rows: 2,
      tooltip: "Dữ liệu bổ sung dạng JSON (tùy chọn)",
    },
  ];

  return (
    <div key={condition.id} className="test-trigger-condition-card">
      <div className="test-trigger-condition-header">
        <Text className="test-trigger-condition-title">
          Điều kiện {index + 1}
        </Text>
        {conditions.length > 1 && (
          <Button
            type="text"
            danger
            size="small"
            icon={<MinusCircleOutlined />}
            onClick={() => handleRemoveCondition(condition.id)}
            className="test-trigger-remove-btn"
          >
            Xóa
          </Button>
        )}
      </div>
      <CustomForm
        ref={conditionFormRef}
        fields={fields}
        gridColumns="1fr 1fr"
        gap="16px"
        formStyle={{ marginBottom: 0 }}
      />
    </div>
  );
}

export default function TestTriggerPage() {
  const router = useRouter();
  const formRef = useRef(null);
  const { loading, testResult, submitTestTrigger, resetTestResult } =
    useTestTrigger();
  const { data: policies, loading: policiesLoading } = usePolicies();
  const { data: dataSources, loading: dataSourcesLoading } = useSources();

  const [conditions, setConditions] = useState([
    {
      id: 1,
      data_source_id: "",
      parameter_name: "",
      measured_value: null,
      unit: "",
      measurement_date: null,
      data_quality: "good",
      confidence_score: 0.95,
      measurement_source: "",
      component_data: "",
    },
  ]);

  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [checkPolicy, setCheckPolicy] = useState(true);
  const [policySearchText, setPolicySearchText] = useState("");

  // Fetch trigger conditions when policy is selected
  useEffect(() => {
    // Removed: No need to fetch trigger conditions anymore
    // farm_id is extracted from selected policy
  }, [selectedPolicyId]);

  // Handle data source selection and auto-populate related fields
  const handleDataSourceChange = (conditionId, dataSourceId) => {
    // If data source is cleared (empty string), clear all auto-filled fields
    if (!dataSourceId) {
      setConditions(
        conditions.map((c) => {
          if (c.id === conditionId) {
            return {
              ...c,
              data_source_id: "",
              parameter_name: "",
              unit: "",
              measurement_source: "",
              confidence_score: 0.95,
              data_quality: "good",
            };
          }
          return c;
        })
      );
      return;
    }

    const selectedSource = dataSources?.find((ds) => ds.id === dataSourceId);

    if (selectedSource) {
      // Parse and auto-fill all available fields from data source
      setConditions(
        conditions.map((c) => {
          if (c.id === conditionId) {
            return {
              ...c,
              data_source_id: dataSourceId,
              // Core fields from data source
              parameter_name: selectedSource.parameter_name || "",
              unit: selectedSource.unit || "",
              measurement_source: selectedSource.data_provider || "",
              // Set confidence score from accuracy_rating if available
              confidence_score: selectedSource.accuracy_rating || 0.95,
              // Set data quality based on accuracy rating
              data_quality:
                selectedSource.accuracy_rating >= 0.95
                  ? "excellent"
                  : selectedSource.accuracy_rating >= 0.9
                  ? "good"
                  : selectedSource.accuracy_rating >= 0.8
                  ? "fair"
                  : "poor",
            };
          }
          return c;
        })
      );
    } else {
      handleConditionChange(conditionId, "data_source_id", dataSourceId);
    }
  }; // Handle policy selection - extract farm_id from selected policy
  const handlePolicySelect = (policyId) => {
    setSelectedPolicyId(policyId);
    // Extract farm_id from selected policy
    const selectedPolicy = policies.find((p) => p.id === policyId);
    if (selectedPolicy?.farm?.id) {
      setSelectedFarmId(selectedPolicy.farm.id);
    }
  };

  // Add new condition
  const handleAddCondition = () => {
    const newCondition = {
      id: Date.now(),
      data_source_id: "",
      parameter_name: "",
      measured_value: null,
      unit: "",
      measurement_date: null,
      data_quality: "good",
      confidence_score: 0.95,
      measurement_source: "",
      component_data: "",
    };
    setConditions([...conditions, newCondition]);
  };

  // Remove condition
  const handleRemoveCondition = (id) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((c) => c.id !== id));
    }
  };

  // Update condition field
  const handleConditionChange = (id, field, value) => {
    setConditions(
      conditions.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    if (!selectedPolicyId || !selectedFarmId) {
      return;
    }

    // Build monitoring data from conditions
    const monitoringData = conditions.map((condition) => {
      const data = {
        data_source_id: condition.data_source_id,
        parameter_name: condition.parameter_name,
        measured_value: condition.measured_value,
      };

      // Add optional fields (in order matching API spec)
      if (condition.unit) data.unit = condition.unit;
      if (condition.measurement_date) {
        // Convert dayjs to Unix timestamp (Vietnam timezone)
        data.measurement_timestamp = dayjs(condition.measurement_date).unix();
      }
      if (condition.data_quality) {
        data.data_quality = condition.data_quality;
      }
      if (condition.confidence_score !== null) {
        data.confidence_score = condition.confidence_score;
      }
      if (condition.measurement_source) {
        data.measurement_source = condition.measurement_source;
      }
      // Add component_data if provided (optional)
      if (condition.component_data) {
        try {
          // Try to parse as JSON
          data.component_data =
            typeof condition.component_data === "string"
              ? JSON.parse(condition.component_data)
              : condition.component_data;
        } catch (e) {
          // If not valid JSON, skip it
          console.warn("Invalid component_data JSON:", e);
        }
      }

      // Add farm_id at the end (as per API spec)
      data.farm_id = selectedFarmId;

      return data;
    });

    await submitTestTrigger(selectedPolicyId, monitoringData, checkPolicy);
  };

  // Handle test again
  const handleTestAgain = () => {
    resetTestResult();
    setConditions([
      {
        id: Date.now(),
        data_source_id: "",
        parameter_name: "",
        measured_value: null,
        unit: "",
        measurement_date: null,
        data_quality: "good",
        confidence_score: 0.95,
        measurement_source: "",
        component_data: "",
      },
    ]);
    setSelectedPolicyId("");
    setSelectedFarmId("");
    setPolicySearchText("");
    setCheckPolicy(true);
  };

  // Prepare data source options for select
  const dataSourceOptions = (dataSources || []).map((source) => ({
    value: source.id,
    label: `${source.display_name_vi || source.parameter_name} - ${
      source.data_provider || "N/A"
    }`,
    labelProp: source.display_name_vi || source.parameter_name,
  }));

  // Prepare policy options for select
  const policyOptions = policies
    .filter((policy) => {
      if (!policySearchText) return true;
      const searchLower = policySearchText.toLowerCase();
      return (
        policy.policy_number?.toLowerCase().includes(searchLower) ||
        policy.farmer_id?.toLowerCase().includes(searchLower) ||
        policy.farm?.farm_name?.toLowerCase().includes(searchLower)
      );
    })
    .map((policy) => ({
      value: policy.id,
      label: `${policy.policy_number} - ${policy.farm?.farm_name || "N/A"} (${
        policy.status
      })`,
      labelProp: policy.policy_number,
    }));

  // Form fields for policy selection
  const policyFields = [
    {
      name: "policy_id",
      label: "Chọn Đơn Bảo Hiểm",
      type: "select",
      placeholder: "Nhập số đơn, ID nông dân hoặc tên trang trại",
      required: true,
      gridColumn: "1 / -1",
      value: selectedPolicyId,
      onChange: handlePolicySelect,
      options: policyOptions,
      showSearch: true,
      loading: policiesLoading,
      optionLabelProp: "labelProp",
      filterOption: false,
      onSearch: (value) => setPolicySearchText(value),
      tooltip: "Tìm kiếm và chọn đơn bảo hiểm để test điều kiện kích hoạt",
    },
  ];

  return (
    <Layout.Content className="test-trigger-content">
      <div className="test-trigger-space">
        {/* Header */}
        <div className="test-trigger-header">
          <div>
            <Title level={2} className="test-trigger-title">
              <ExperimentOutlined className="test-trigger-icon" />
              Giả Lập Điều Kiện Kích Hoạt
            </Title>
            <Text className="test-trigger-subtitle">
              Tạo dữ liệu giả lập để kiểm tra điều kiện kích hoạt và tự động tạo
              yêu cầu bồi thường
            </Text>
          </div>
          <Link href="/claims">
            <Button icon={<ArrowLeftOutlined />}>← Quay Lại</Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="test-trigger-help">
          <div className="test-trigger-help-title">
            <InfoCircleOutlined />
            Hướng Dẫn Sử Dụng
          </div>
          <div className="test-trigger-help-list">
            <div className="test-trigger-help-item">
              1. Chọn đơn bảo hiểm từ dropdown (tìm theo số đơn, ID nông dân
              hoặc tên trang trại)
            </div>
            <div className="test-trigger-help-item">
              2. Chọn nguồn dữ liệu (Data Source) - các thông tin sẽ tự động
              điền
            </div>
            <div className="test-trigger-help-item">
              3. Nhập giá trị đo (measured value) để kiểm tra điều kiện kích
              hoạt
            </div>
            <div className="test-trigger-help-item">
              4. Chọn thời gian đo (tùy chọn, mặc định = thời gian hiện tại)
            </div>
            <div className="test-trigger-help-item">
              5. Nhấp "Giả Lập Điều Kiện" để submit test - hệ thống sẽ kiểm tra
              và tự động tạo yêu cầu bồi thường nếu điều kiện thỏa mãn
            </div>
          </div>
          <div className="test-trigger-help-note">
            <InfoCircleOutlined /> Lưu ý: Các trường tên tham số, đơn vị, nguồn
            đo, chất lượng dữ liệu sẽ tự động điền từ data source và bị disable.
            Nếu xóa data source, các trường này sẽ mất ngay.
          </div>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className="test-trigger-result test-trigger-result-success">
            <div className="test-trigger-result-header">
              <CheckCircleOutlined className="test-trigger-result-icon success" />
              <Title level={4} className="test-trigger-result-title success">
                ✓ TEST THÀNH CÔNG
              </Title>
            </div>
            <div className="test-trigger-result-body">
              <Alert
                message="Dữ liệu test được gửi thành công. Yêu cầu bồi thường đã được tạo nếu điều kiện được thỏa mãn."
                type="success"
                showIcon
                style={{ marginBottom: "20px" }}
              />

              <div className="test-trigger-result-grid">
                <div className="test-trigger-result-item">
                  <DatabaseOutlined className="test-trigger-result-item-icon" />
                  <div className="test-trigger-result-item-content">
                    <div className="test-trigger-result-item-label">
                      Số Dữ Liệu Test
                    </div>
                    <div className="test-trigger-result-item-value">
                      {testResult.test_data_count || 0}
                    </div>
                  </div>
                </div>

                <div className="test-trigger-result-item">
                  <CheckCircleOutlined className="test-trigger-result-item-icon" />
                  <div className="test-trigger-result-item-content">
                    <div className="test-trigger-result-item-label">
                      Dữ Liệu Được Lưu
                    </div>
                    <div className="test-trigger-result-item-value">
                      {testResult.monitoring_stored ? "Có" : "Không"}
                    </div>
                  </div>
                </div>

                <div className="test-trigger-result-item">
                  <ExperimentOutlined className="test-trigger-result-item-icon" />
                  <div className="test-trigger-result-item-content">
                    <div className="test-trigger-result-item-label">
                      Kiểm Tra Chính Sách
                    </div>
                    <div className="test-trigger-result-item-value">
                      {testResult.check_policy ? "Có" : "Không"}
                    </div>
                  </div>
                </div>

                <div className="test-trigger-result-item">
                  <InfoCircleOutlined className="test-trigger-result-item-icon" />
                  <div className="test-trigger-result-item-content">
                    <div className="test-trigger-result-item-label">
                      Policy ID
                    </div>
                    <div className="test-trigger-result-item-value">
                      {testResult.policy_id?.substring(0, 8)}...
                    </div>
                  </div>
                </div>
              </div>

              <div className="test-trigger-result-actions">
                <Link href="/claims">
                  <Button type="primary" icon={<EyeOutlined />} size="large">
                    Xem Yêu Cầu Bồi Thường
                  </Button>
                </Link>
                <Button
                  icon={<ReloadOutlined />}
                  size="large"
                  onClick={handleTestAgain}
                >
                  Test Lại
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        {!testResult && (
          <Card className="test-trigger-card">
            <div className="test-trigger-card-body">
              {/* Policy Selection */}
              <div className="test-trigger-section-title">
                Chọn Đơn Bảo Hiểm
              </div>
              <CustomForm
                ref={formRef}
                fields={policyFields}
                gridColumns="1fr"
                gap="16px"
              />

              {/* Display Farm Info when policy is selected */}
              {selectedPolicyId && selectedFarmId && (
                <div
                  style={{
                    marginTop: "16px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                      }}
                    >
                      Farm ID
                    </label>
                    <input
                      type="text"
                      value={selectedFarmId}
                      disabled
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #d9d9d9",
                        borderRadius: "4px",
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                      }}
                    >
                      Tên Farm
                    </label>
                    <input
                      type="text"
                      value={
                        policies.find((p) => p.id === selectedPolicyId)?.farm
                          ?.farm_name || ""
                      }
                      disabled
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #d9d9d9",
                        borderRadius: "4px",
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </div>
              )}

              <Divider />

              {/* Monitoring Data Section */}
              <div className="test-trigger-section-title">
                Dữ Liệu Giám Sát (Monitoring Data)
              </div>

              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                {conditions.map((condition, index) => (
                  <ConditionForm
                    key={condition.id}
                    condition={condition}
                    index={index}
                    conditions={conditions}
                    dataSourceOptions={dataSourceOptions}
                    dataSourcesLoading={dataSourcesLoading}
                    handleConditionChange={handleConditionChange}
                    handleDataSourceChange={handleDataSourceChange}
                    handleRemoveCondition={handleRemoveCondition}
                    claimMessage={claimMessage}
                  />
                ))}
              </Space>

              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={handleAddCondition}
                style={{ width: "100%", marginTop: "16px" }}
              >
                + Thêm Điều Kiện
              </Button>

              <Divider />

              {/* Check Policy Switch */}
              <CustomForm
                fields={[
                  {
                    name: "check_policy",
                    label: "Kiểm Tra Chính Sách (Check Policy)",
                    type: "switch",
                    value: checkPolicy,
                    onChange: (checked) => setCheckPolicy(checked),
                    tooltip:
                      "Bật: Kiểm tra điều kiện và tự động tạo claim. Tắt: Chỉ lưu dữ liệu",
                    checkedChildren: "Có",
                    unCheckedChildren: "Không",
                  },
                ]}
                gridColumns="1fr"
                gap="16px"
              />

              {/* Submit Button */}
              <Button
                type="primary"
                size="large"
                icon={<ExperimentOutlined />}
                loading={loading}
                onClick={handleSubmit}
                disabled={!selectedPolicyId || loading}
                style={{
                  width: "100%",
                  marginTop: "24px",
                  height: "48px",
                  fontSize: "16px",
                }}
              >
                Giả Lập Điều Kiện
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Layout.Content>
  );
}
