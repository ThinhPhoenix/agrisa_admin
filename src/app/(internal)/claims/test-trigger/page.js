"use client";

import { CustomForm } from "@/components/custom-form";
import { claimMessage } from "@/libs/message";
import { useTestTrigger } from "@/services/hooks/claim/use-test-trigger";
import { usePolicies } from "@/services/hooks/policy";
import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
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
import { Alert, Button, Card, Divider, Layout, Space, Typography, message as antMessage } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import dayjs from "dayjs";
import "./page.css";

const { Title, Text } = Typography;

// Separate component for condition form to use hooks properly
function ConditionForm({
  condition,
  index,
  conditions,
  triggerConditions,
  loadingConditions,
  selectedPolicyId,
  handleConditionChange,
  handleRemoveCondition,
  claimMessage,
}) {
  const conditionFormRef = useRef(null);

  // Update form values when condition state changes (especially after data source selection)
  useEffect(() => {
    if (conditionFormRef.current) {
      conditionFormRef.current.setFieldsValue({
        [`condition_id_${condition.id}`]: condition.base_policy_trigger_condition_id,
        [`data_source_${condition.id}`]: condition.data_source_id,
        [`parameter_${condition.id}`]: condition.parameter_name,
        [`measured_value_${condition.id}`]: condition.measured_value,
        [`unit_${condition.id}`]: condition.unit,
        [`timestamp_${condition.id}`]: condition.measurement_date,
        [`data_quality_${condition.id}`]: condition.data_quality,
        [`confidence_score_${condition.id}`]: condition.confidence_score,
        [`source_${condition.id}`]: condition.measurement_source,
      });
    }
  }, [
    condition.id,
    condition.base_policy_trigger_condition_id,
    condition.data_source_id,
    condition.parameter_name,
    condition.measured_value,
    condition.unit,
    condition.measurement_date,
    condition.data_quality,
    condition.confidence_score,
    condition.measurement_source,
  ]);

  const fields = [
    {
      name: `condition_id_${condition.id}`,
      label: claimMessage.testTrigger.conditionIdLabel,
      type: "select",
      placeholder: claimMessage.testTrigger.conditionIdPlaceholder,
      required: true,
      value: condition.base_policy_trigger_condition_id,
      onChange: (value) =>
        handleConditionChange(
          condition.id,
          "base_policy_trigger_condition_id",
          value
        ),
      options: triggerConditions,
      showSearch: true,
      loading: loadingConditions,
      disabled: !selectedPolicyId || loadingConditions,
      tooltip: "Chọn điều kiện kích hoạt - thông tin data source sẽ được tự động điền",
    },
    {
      name: `parameter_${condition.id}`,
      label: claimMessage.testTrigger.parameterLabel,
      type: "input",
      placeholder: "Tự động điền khi chọn Trigger Condition",
      required: true,
      value: condition.parameter_name,
      onChange: (value) =>
        handleConditionChange(condition.id, "parameter_name", value),
      tooltip: "Tên tham số - tự động điền khi chọn trigger condition",
      disabled: !!condition.base_policy_trigger_condition_id, // Disable khi đã chọn trigger
    },
    {
      name: `measured_value_${condition.id}`,
      label: claimMessage.testTrigger.measuredValueLabel,
      type: "number",
      placeholder: claimMessage.testTrigger.measuredValuePlaceholder,
      required: true,
      value: condition.measured_value,
      onChange: (value) =>
        handleConditionChange(condition.id, "measured_value", value),
      tooltip: claimMessage.testTrigger.measuredValueTooltip,
      step: 0.01,
    },
    {
      name: `unit_${condition.id}`,
      label: claimMessage.testTrigger.unitLabel,
      type: "input",
      placeholder: "Tự động điền khi chọn Trigger Condition",
      value: condition.unit,
      onChange: (value) => handleConditionChange(condition.id, "unit", value),
      tooltip: "Đơn vị đo - tự động điền khi chọn trigger condition",
      disabled: !!condition.base_policy_trigger_condition_id, // Disable khi đã chọn trigger
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
      label: claimMessage.testTrigger.dataQualityLabel,
      type: "select",
      value: condition.data_quality,
      onChange: (value) =>
        handleConditionChange(condition.id, "data_quality", value),
      options: [
        {
          value: "excellent",
          label: claimMessage.testTrigger.dataQuality.excellent,
        },
        { value: "good", label: claimMessage.testTrigger.dataQuality.good },
        { value: "fair", label: claimMessage.testTrigger.dataQuality.fair },
        { value: "poor", label: claimMessage.testTrigger.dataQuality.poor },
      ],
      disabled: !!condition.base_policy_trigger_condition_id, // Disable khi đã chọn trigger
      tooltip: "Chất lượng dữ liệu - tự động điền khi chọn trigger condition",
    },
    {
      name: `confidence_score_${condition.id}`,
      label: claimMessage.testTrigger.confidenceScoreLabel,
      type: "number",
      placeholder: claimMessage.testTrigger.confidenceScorePlaceholder,
      value: condition.confidence_score,
      onChange: (value) =>
        handleConditionChange(condition.id, "confidence_score", value),
      min: 0,
      max: 1,
      step: 0.01,
      disabled: !!condition.base_policy_trigger_condition_id, // Disable khi đã chọn trigger
      tooltip: "Độ tin cậy - tự động điền khi chọn trigger condition",
    },
    {
      name: `source_${condition.id}`,
      label: claimMessage.testTrigger.measurementSourceLabel,
      type: "input",
      placeholder: "Tự động điền khi chọn Trigger Condition",
      value: condition.measurement_source,
      onChange: (value) =>
        handleConditionChange(condition.id, "measurement_source", value),
      tooltip: "Nguồn đo dữ liệu - tự động điền khi chọn trigger condition",
      disabled: !!condition.base_policy_trigger_condition_id, // Disable khi đã chọn trigger
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

  const [conditions, setConditions] = useState([
    {
      id: 1,
      base_policy_trigger_condition_id: "",
      data_source_id: "",
      parameter_name: "",
      measured_value: null,
      unit: "",
      measurement_date: null,
      data_quality: "good",
      confidence_score: 0.95,
      measurement_source: "",
    },
  ]);

  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  const [checkPolicy, setCheckPolicy] = useState(true);
  const [triggerConditions, setTriggerConditions] = useState([]);
  const [loadingConditions, setLoadingConditions] = useState(false);
  const [policySearchText, setPolicySearchText] = useState("");

  // Fetch trigger conditions when policy is selected
  useEffect(() => {
    if (selectedPolicyId) {
      fetchTriggerConditions(selectedPolicyId);
    } else {
      setTriggerConditions([]);
    }
  }, [selectedPolicyId]);

  // Fetch trigger conditions from base policy detail
  const fetchTriggerConditions = async (policyId) => {
    setLoadingConditions(true);
    try {
      // First, get the registered policy to extract base_policy_id
      const policyResponse = await axiosInstance.get(
        endpoints.policy.registered_policy.detail(policyId)
      );

      if (policyResponse.data?.success && policyResponse.data?.data) {
        const policyData = policyResponse.data.data;
        const basePolicyId = policyData.base_policy_id;

        if (!basePolicyId) {
          antMessage.warning("Policy này không có base policy liên kết");
          setTriggerConditions([]);
          setLoadingConditions(false);
          return;
        }

        // Now fetch base policy detail with the base_policy_id
        const basePolicyResponse = await axiosInstance.get(
          endpoints.policy.base_policy.detail,
          {
            params: {
              id: basePolicyId,
              include_pdf: false,
            },
          }
        );

        if (basePolicyResponse.data?.success && basePolicyResponse.data?.data) {
          const responseData = basePolicyResponse.data.data;
          const triggers = responseData.triggers;

          if (triggers && Array.isArray(triggers) && triggers.length > 0) {
            const allConditions = [];

            // Fetch data source details for each condition
            for (const trigger of triggers) {
              if (trigger.conditions && Array.isArray(trigger.conditions)) {
                for (const condition of trigger.conditions) {
                  // Fetch data source detail if data_source_id exists
                  let dataSourceInfo = null;
                  if (condition.data_source_id) {
                    try {
                      const dsResponse = await axiosInstance.get(
                        endpoints.policy.data_tier.data_source.get_one(condition.data_source_id)
                      );
                      if (dsResponse.data?.success && dsResponse.data?.data) {
                        dataSourceInfo = dsResponse.data.data;
                      }
                    } catch (dsError) {
                      console.warn(`Failed to fetch data source ${condition.data_source_id}:`, dsError);
                    }
                  }

                  const label = dataSourceInfo
                    ? `${dataSourceInfo.display_name_vi || dataSourceInfo.parameter_name} ${condition.threshold_operator || ""} ${condition.threshold_value || ""}`
                    : `${condition.threshold_operator || ""} ${condition.threshold_value || ""} (${trigger.growth_stage || "Trigger"})`;

                  allConditions.push({
                    value: condition.id,
                    label: label,
                    // Store full condition and data source data
                    condition: condition,
                    trigger: trigger,
                    dataSource: dataSourceInfo,
                  });
                }
              }
            }

            setTriggerConditions(allConditions);

            if (allConditions.length === 0) {
              antMessage.warning("Base policy này chưa có điều kiện kích hoạt");
            }
          } else {
            setTriggerConditions([]);
            antMessage.warning("Base policy này chưa có điều kiện kích hoạt");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching trigger conditions:", error);
      antMessage.error("Không thể tải điều kiện kích hoạt");
      setTriggerConditions([]);
    } finally {
      setLoadingConditions(false);
    }
  };

  // Add new condition
  const handleAddCondition = () => {
    const newCondition = {
      id: Date.now(),
      base_policy_trigger_condition_id: "",
      data_source_id: "",
      parameter_name: "",
      measured_value: null,
      unit: "",
      measurement_date: null,
      data_quality: "good",
      confidence_score: 0.95,
      measurement_source: "",
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
    // If changing the base_policy_trigger_condition_id
    if (field === "base_policy_trigger_condition_id") {
      // If value is cleared/empty, reset auto-filled fields
      if (!value) {
        setConditions(
          conditions.map((c) => {
            if (c.id === id) {
              return {
                ...c,
                [field]: "",
                // Clear auto-filled fields
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
        antMessage.info("Đã xóa thông tin tự động điền");
        return;
      }

      // If value is selected, auto-fill data from trigger condition
      const selectedTriggerCondition = triggerConditions.find(
        (tc) => tc.value === value
      );

      if (selectedTriggerCondition && selectedTriggerCondition.dataSource) {
        const dataSource = selectedTriggerCondition.dataSource;

        setConditions(
          conditions.map((c) => {
            if (c.id === id) {
              return {
                ...c,
                [field]: value,
                // Auto-fill from data source
                data_source_id: dataSource.id,
                parameter_name: dataSource.parameter_name || "",
                unit: dataSource.unit || "",
                measurement_source: dataSource.data_provider || "",
                confidence_score: dataSource.accuracy_rating !== undefined ? dataSource.accuracy_rating : 0.95,
                data_quality: dataSource.accuracy_rating !== undefined
                  ? (dataSource.accuracy_rating >= 0.95 ? "excellent" :
                     dataSource.accuracy_rating >= 0.9 ? "good" :
                     dataSource.accuracy_rating >= 0.8 ? "fair" : "poor")
                  : "good",
              };
            }
            return c;
          })
        );

        antMessage.success(
          `Đã tự động điền thông tin từ data source "${dataSource.display_name_vi || dataSource.parameter_name}"`
        );
        return;
      }
    }

    // Default behavior for other fields
    setConditions(
      conditions.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };


  // Handle form submission
  const handleSubmit = async (formData) => {
    if (!selectedPolicyId) {
      return;
    }

    // Build monitoring data from conditions
    const monitoringData = conditions.map((condition) => {
      const data = {
        base_policy_trigger_condition_id:
          condition.base_policy_trigger_condition_id,
        parameter_name: condition.parameter_name,
        measured_value: condition.measured_value,
        data_quality: condition.data_quality,
      };

      // Add optional fields
      if (condition.unit) data.unit = condition.unit;
      if (condition.measurement_date) {
        // Convert dayjs to Unix timestamp (Vietnam timezone)
        data.measurement_timestamp = dayjs(condition.measurement_date).unix();
      }
      if (condition.confidence_score !== null) {
        data.confidence_score = condition.confidence_score;
      }
      if (condition.measurement_source) {
        data.measurement_source = condition.measurement_source;
      }

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
        base_policy_trigger_condition_id: "",
        data_source_id: "",
        parameter_name: "",
        measured_value: null,
        unit: "",
        measurement_date: null,
        data_quality: "good",
        confidence_score: 0.95,
        measurement_source: "",
      },
    ]);
    setSelectedPolicyId("");
    setPolicySearchText("");
    setTriggerConditions([]);
    setCheckPolicy(true);
  };

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
      label: `${policy.policy_number} - ${policy.farm?.farm_name || "N/A"} (${policy.status})`,
      labelProp: policy.policy_number,
    }));

  // Form fields for policy selection
  const policyFields = [
    {
      name: "policy_id",
      label: claimMessage.testTrigger.selectPolicy,
      type: "select",
      placeholder: claimMessage.testTrigger.policyPlaceholder,
      required: true,
      gridColumn: "1 / -1",
      value: selectedPolicyId,
      onChange: (value) => setSelectedPolicyId(value),
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
              {claimMessage.testTrigger.title}
            </Title>
            <Text className="test-trigger-subtitle">
              {claimMessage.testTrigger.subtitle}
            </Text>
          </div>
          <Link href="/claims">
            <Button icon={<ArrowLeftOutlined />}>
              {claimMessage.actions.back}
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="test-trigger-help">
          <div className="test-trigger-help-title">
            <InfoCircleOutlined />
            {claimMessage.testTrigger.helpText.title}
          </div>
          <div className="test-trigger-help-list">
            <div className="test-trigger-help-item">
              {claimMessage.testTrigger.helpText.step1}
            </div>
            <div className="test-trigger-help-item">
              {claimMessage.testTrigger.helpText.step2}
            </div>
            <div className="test-trigger-help-item">
              {claimMessage.testTrigger.helpText.step3}
            </div>
            <div className="test-trigger-help-item">
              {claimMessage.testTrigger.helpText.step4}
            </div>
            <div className="test-trigger-help-item">
              {claimMessage.testTrigger.helpText.step5}
            </div>
          </div>
          <div className="test-trigger-help-note">
            <InfoCircleOutlined /> {claimMessage.testTrigger.helpText.note}
          </div>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className="test-trigger-result test-trigger-result-success">
            <div className="test-trigger-result-header">
              <CheckCircleOutlined className="test-trigger-result-icon success" />
              <Title level={4} className="test-trigger-result-title success">
                {claimMessage.testTrigger.testSuccessTitle}
              </Title>
            </div>
            <div className="test-trigger-result-body">
              <Alert
                message={claimMessage.testTrigger.testSuccess}
                type="success"
                showIcon
                style={{ marginBottom: "20px" }}
              />

              <div className="test-trigger-result-grid">
                <div className="test-trigger-result-item">
                  <DatabaseOutlined className="test-trigger-result-item-icon" />
                  <div className="test-trigger-result-item-content">
                    <div className="test-trigger-result-item-label">
                      {claimMessage.testTrigger.testDataCount}
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
                      {claimMessage.testTrigger.dataStored}
                    </div>
                    <div className="test-trigger-result-item-value">
                      {testResult.monitoring_stored
                        ? claimMessage.fields.yes
                        : claimMessage.fields.no}
                    </div>
                  </div>
                </div>

                <div className="test-trigger-result-item">
                  <ExperimentOutlined className="test-trigger-result-item-icon" />
                  <div className="test-trigger-result-item-content">
                    <div className="test-trigger-result-item-label">
                      {claimMessage.testTrigger.checkPolicyEnabled}
                    </div>
                    <div className="test-trigger-result-item-value">
                      {testResult.check_policy
                        ? claimMessage.fields.yes
                        : claimMessage.fields.no}
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
                    {claimMessage.testTrigger.viewClaims}
                  </Button>
                </Link>
                <Button
                  icon={<ReloadOutlined />}
                  size="large"
                  onClick={handleTestAgain}
                >
                  {claimMessage.testTrigger.testAgain}
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
                {claimMessage.testTrigger.selectPolicy}
              </div>
              <CustomForm
                ref={formRef}
                fields={policyFields}
                gridColumns="1fr"
                gap="16px"
              />

              <Divider />

              {/* Monitoring Data Section */}
              <div className="test-trigger-section-title">
                {claimMessage.testTrigger.monitoringDataSection}
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
                    triggerConditions={triggerConditions}
                    loadingConditions={loadingConditions}
                    selectedPolicyId={selectedPolicyId}
                    handleConditionChange={handleConditionChange}
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
                {claimMessage.actions.addCondition}
              </Button>

              <Divider />

              {/* Check Policy Switch */}
              <CustomForm
                fields={[
                  {
                    name: "check_policy",
                    label: claimMessage.testTrigger.checkPolicyLabel,
                    type: "switch",
                    value: checkPolicy,
                    onChange: (checked) => setCheckPolicy(checked),
                    tooltip: claimMessage.testTrigger.checkPolicyTooltip,
                    checkedChildren: claimMessage.fields.yes,
                    unCheckedChildren: claimMessage.fields.no,
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
                {claimMessage.actions.submitTest}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Layout.Content>
  );
}
