"use client";

import { CustomForm } from "@/components/custom-form";
import {
  BarChartOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SettingOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Progress,
  Row,
  Select,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;
const { Option } = Select;

export default function ValidationFormModal({
  open,
  onCancel,
  onSubmit,
  basePolicyId,
  latestValidation,
  validatedBy = "admin@example.com",
  mode = "manual", // "manual", "accept_ai", "override"
}) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [useAIData, setUseAIData] = useState(false);
  const [recommendationsData, setRecommendationsData] = useState([]);
  const [mismatchesData, setMismatchesData] = useState([]);
  const [warningsData, setWarningsData] = useState([]);

  // Pre-fill form with AI validation data if available
  useEffect(() => {
    // Wait for modal to open and form to be ready
    if (!open) return;

    if (useAIData && latestValidation) {
      console.log(
        "🔍 Pre-filling form with AI validation data:",
        latestValidation
      );

      // Convert mismatches object to array for form display
      const mismatchesArray = latestValidation.mismatches
        ? Object.entries(latestValidation.mismatches).map(([key, value]) => ({
            field: key,
            expected:
              typeof value.pdf_value !== "undefined"
                ? String(value.pdf_value)
                : String(value.expected || ""),
            actual:
              typeof value.json_value !== "undefined"
                ? String(value.json_value)
                : String(value.actual || ""),
            severity: value.severity || "low",
            impact: value.impact || "",
            field_type: value.field_type || "",
          }))
        : [];

      // Set form mismatch data for editing
      if (form && mismatchesArray.length > 0) {
        form.setFieldValue("mismatches", mismatchesArray);
      }

      console.log("📝 Mismatches array:", mismatchesArray);

      // Convert warnings object to array for form display
      const warningsArray = latestValidation.warnings
        ? Object.entries(latestValidation.warnings).map(([key, value]) => ({
            field: key,
            message:
              value.message ||
              value.pdf_context ||
              value.details ||
              value.impact ||
              "",
            recommendation: value.recommendation || "",
          }))
        : [];

      console.log("⚠️ Warnings array:", warningsArray);

      // Convert recommendations object to array for form display
      const recommendationsArray = latestValidation.recommendations
        ? Object.entries(latestValidation.recommendations).map(
            ([key, value]) => ({
              category: key,
              suggestion:
                value.suggestion ||
                (value.affected_fields
                  ? `Priority: ${value.priority || "N/A"} | Fields: ${
                      Array.isArray(value.affected_fields)
                        ? value.affected_fields.join(", ")
                        : value.affected_fields
                    }`
                  : ""),
            })
          )
        : [];

      console.log("💡 Recommendations array:", recommendationsArray);

      // Determine validation status based on mode
      let validationStatus = latestValidation.validation_status;
      let validationNotes = latestValidation.validation_notes || "";

      // Always set to "passed" - admin confirmation triggers auto-commit
      validationStatus = "passed";

      if (mode === "accept_ai") {
        // When accepting AI result, set status to "passed" (manual confirmation)
        // This triggers auto-commit as per spec
        validationNotes = validationNotes
          ? `${validationNotes}\n\nAdmin đã chấp nhận kết quả AI và xác nhận thủ công.`
          : "Admin đã chấp nhận kết quả AI và xác nhận thủ công. Kết quả AI được coi là chính xác.";
      } else if (mode === "override") {
        // Override mode - admin manually sets to passed despite errors
        validationStatus = "passed";
        validationNotes = validationNotes
          ? `${validationNotes}\n\nAdmin ghi đè thủ công: chấp nhận policy mặc dù có lỗi.`
          : "Admin ghi đè thủ công: chấp nhận policy mặc dù có lỗi.";
      } else if (mode === "review" || mode === "fix") {
        // Review/fix mode - set to warning or failed
        validationStatus =
          latestValidation.failed_checks > 0 ? "failed" : "warning";
      }

      const initialValues = {
        validation_status: validationStatus || "pending",
        total_checks: latestValidation.total_checks || 0,
        passed_checks: latestValidation.passed_checks || 0,
        failed_checks: latestValidation.failed_checks || 0,
        warning_count: latestValidation.warning_count || 0,
        extraction_confidence:
          (latestValidation.extracted_parameters?.extraction_confidence ||
            0.95) * 100,
        parameters_found:
          latestValidation.extracted_parameters?.parameters_found || 0,
        document_version:
          latestValidation.extracted_parameters?.document_version || "",
        extraction_method:
          latestValidation.extracted_parameters?.extraction_method || "",
        validation_notes: validationNotes,
        mismatches: mismatchesArray,
        warnings: warningsArray,
        recommendations: recommendationsArray,
      };

      console.log("✅ Setting form values:", initialValues);

      if (form) {
        form.setFieldsValue(initialValues);
        setFormValues(initialValues);
      }
      setRecommendationsData(recommendationsArray);
      setMismatchesData(mismatchesArray);
      setWarningsData(warningsArray);
    } else {
      console.log("📋 Form empty or no AI data");
      // Set defaults for empty form
      const defaultValues = {
        validation_status: "pending",
        total_checks: 0,
        passed_checks: 0,
        failed_checks: 0,
        warning_count: 0,
        extraction_confidence: 95,
        parameters_found: 0,
        document_version: "",
        extraction_method: "",
        validation_notes: "",
        mismatches: [],
        warnings: [],
        recommendations: [],
      };

      if (form) {
        form.setFieldsValue(defaultValues);
        setFormValues(defaultValues);
      }
      setRecommendationsData([]);
      setMismatchesData([]);
      setWarningsData([]);
    }
  }, [open, latestValidation, validatedBy, mode, useAIData]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // Convert arrays to objects (map) as expected by backend API spec
      // Backend expects: map[string]any (object), not array
      let mismatchesArray = [];
      let warningsArray = [];
      let recommendationsArray = [];

      if (useAIData) {
        // Use state data when AI data is enabled
        mismatchesArray = mismatchesData;
        warningsArray = warningsData;
        recommendationsArray = recommendationsData;
      } else {
        // Use form data when manual entry
        mismatchesArray = values.mismatches || [];
        warningsArray = values.warnings || [];
        recommendationsArray = values.recommendations || [];
      }

      const mismatchesObject = {};
      mismatchesArray.forEach((item) => {
        if (item.field) {
          mismatchesObject[item.field] = {
            expected: item.expected,
            actual: item.actual,
            severity: item.severity,
            impact: item.impact,
            field_type: item.field_type,
          };
        }
      });

      const warningsObject = {};
      warningsArray.forEach((item) => {
        if (item.field) {
          warningsObject[item.field] = {
            message: item.message,
            recommendation: item.recommendation || "",
          };
        }
      });

      const recommendationsObject = {};
      recommendationsArray.forEach((item) => {
        if (item.category) {
          recommendationsObject[item.category] = {
            suggestion: item.suggestion,
            priority: item.priority,
            affected_fields: item.affected_fields,
          };
        }
      });

      // Build payload according to ValidatePolicyRequest spec
      const payload = {
        base_policy_id: basePolicyId,
        validation_status: values.validation_status || "pending", // Use form value
        validated_by: "agrisa.admin@gmail.com", // Hardcoded
        total_checks: values.total_checks || 0,
        passed_checks: values.passed_checks || 0,
        failed_checks: values.failed_checks || 0,
        warning_count: values.warning_count || 0,
        validation_notes: values.validation_notes || "",
      };

      // Always add optional JSONB fields only if they have content
      if (Object.keys(mismatchesObject).length > 0) {
        payload.mismatches = mismatchesObject;
      }
      if (Object.keys(warningsObject).length > 0) {
        payload.warnings = warningsObject;
      }
      if (Object.keys(recommendationsObject).length > 0) {
        payload.recommendations = recommendationsObject;
      }

      // Add extracted_parameters if any field is provided
      if (
        values.extraction_confidence ||
        values.parameters_found ||
        values.document_version ||
        values.extraction_method
      ) {
        payload.extracted_parameters = {
          extraction_confidence: (values.extraction_confidence || 0) / 100,
          parameters_found: values.parameters_found || 0,
        };

        // Add optional string fields if provided
        if (values.document_version) {
          payload.extracted_parameters.document_version =
            values.document_version;
        }
        if (values.extraction_method) {
          payload.extracted_parameters.extraction_method =
            values.extraction_method;
        }
      }

      console.log("🚀 Validation payload being sent:", payload);

      await onSubmit(payload);
      form.resetFields();
      setSubmitting(false);
    } catch (err) {
      console.error("Form validation error:", err);
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleValuesChange = (allValues) => {
    setFormValues(allValues);
  };

  // Define form fields configuration
  const fields = [
    // Validation Status - Required field (moved to top)
    {
      type: "select",
      name: "validation_status",
      label: <span style={{ fontWeight: 600 }}>Trạng thái xác thực</span>,
      placeholder: "Chọn trạng thái xác thực",
      gridColumn: "span 2",
      options: [
        {
          label: "Đang chờ",
          value: "pending",
        },
        {
          label: "AI đã duyệt",
          value: "passed_ai",
        },
        {
          label: "Cảnh báo",
          value: "warning",
        },
      ],
      rules: [{ required: true, message: "Vui lòng chọn trạng thái xác thực" }],
      tooltip:
        "Chỉ đơn có trạng thái 'AI đã duyệt' mới được kích hoạt. Cảnh báo là khi hợp đồng hợp lệ nhưng có rủi ro cho bên bảo hiểm.",
    },

    // Statistics Section
    {
      type: "number",
      name: "total_checks",
      label: (
        <span style={{ fontWeight: 500 }}>
          <SettingOutlined style={{ marginRight: "4px" }} />
          Tổng số kiểm tra
        </span>
      ),
      placeholder: "0",
      min: 0,
      gridColumn: "span 1",
      rules: [
        { required: true, message: "Bắt buộc" },
        { type: "number", min: 0, message: "Phải >= 0" },
      ],
    },
    {
      type: "number",
      name: "passed_checks",
      label: (
        <span style={{ fontWeight: 500 }}>
          <CheckCircleOutlined
            style={{ marginRight: "4px", color: "#52c41a" }}
          />
          Đạt
        </span>
      ),
      placeholder: "0",
      min: 0,
      gridColumn: "span 1",
      rules: [
        { required: true, message: "Bắt buộc" },
        { type: "number", min: 0, message: "Phải >= 0" },
      ],
    },
    {
      type: "number",
      name: "failed_checks",
      label: (
        <span style={{ fontWeight: 500 }}>
          <CloseCircleOutlined
            style={{ marginRight: "4px", color: "#ff4d4f" }}
          />
          Lỗi
        </span>
      ),
      placeholder: "0",
      min: 0,
      gridColumn: "span 1",
      rules: [
        { required: true, message: "Bắt buộc" },
        { type: "number", min: 0, message: "Phải >= 0" },
        ({ getFieldValue }) => ({
          validator(_, value) {
            const total = getFieldValue("total_checks");
            const passed = getFieldValue("passed_checks");
            if (
              total != null &&
              passed != null &&
              value != null &&
              passed + value > total
            ) {
              return Promise.reject(
                new Error("Đạt + Lỗi không được > Tổng số")
              );
            }
            return Promise.resolve();
          },
        }),
      ],
    },
    {
      type: "number",
      name: "warning_count",
      label: (
        <span style={{ fontWeight: 500 }}>
          <WarningOutlined style={{ marginRight: "4px", color: "#faad14" }} />
          Cảnh báo
        </span>
      ),
      placeholder: "0",
      min: 0,
      gridColumn: "span 1",
      rules: [
        { required: true, message: "Bắt buộc" },
        { type: "number", min: 0, message: "Phải >= 0" },
      ],
    },

    // Extraction Parameters - Changed to number input
    {
      type: "number",
      name: "extraction_confidence",
      label: <span style={{ fontWeight: 500 }}>Độ tin cậy trích xuất (%)</span>,
      gridColumn: "span 1",
      min: 0,
      max: 100,
      step: 0.1,
      placeholder: "95",
      tooltip:
        "Mức độ chính xác khi AI trích xuất thông tin từ tài liệu PDF (0-100)",
      rules: [
        { type: "number", min: 0, max: 100, message: "Phải từ 0 đến 100" },
      ],
    },
    {
      type: "number",
      name: "parameters_found",
      label: <span style={{ fontWeight: 500 }}>Số tham số tìm thấy</span>,
      placeholder: "0",
      min: 0,
      gridColumn: "span 1",
      rules: [],
    },

    // Validation Notes
    {
      type: "textarea",
      name: "validation_notes",
      label: (
        <span style={{ fontWeight: 600 }}>
          <InfoCircleOutlined
            style={{ marginRight: "8px", color: "#52c41a" }}
          />
          Ghi chú xác thực
        </span>
      ),
      placeholder:
        "Đã hoàn thành xem xét thủ công. Các sai lệch nhỏ đã được ghi nhận nhưng có thể chấp nhận được.",
      autoSize: { minRows: 4, maxRows: 20 },
      rules: [],
    },
  ];

  // Calculate progress percentage
  const successPercent =
    formValues.total_checks > 0
      ? Math.round((formValues.passed_checks / formValues.total_checks) * 100)
      : 0;

  // Get modal title based on mode
  const getModalTitle = () => {
    switch (mode) {
      case "accept_ai":
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
            <span>Chấp nhận kết quả AI</span>
          </div>
        );
      case "override":
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <WarningOutlined style={{ color: "#faad14" }} />
            <span>Ghi đè xác thực</span>
          </div>
        );
      case "review":
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <InfoCircleOutlined style={{ color: "#1890ff" }} />
            <span>Review thủ công</span>
          </div>
        );
      case "fix":
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
            <span>Yêu cầu sửa lỗi</span>
          </div>
        );
      default:
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircleOutlined />
            <span>Xác thực thủ công</span>
          </div>
        );
    }
  };

  return (
    <Modal
      title={getModalTitle()}
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="Gửi xác thực"
      cancelText="Hủy"
      confirmLoading={submitting}
      width={1000}
      destroyOnClose
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
    >
      {/* Header Info Card */}
      <Card
        size="small"
        style={{ marginBottom: "16px", background: "#f8f9fa" }}
        bodyStyle={{ padding: "12px" }}
      >
        <div style={{ textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Nguồn dữ liệu xác thực
          </Text>
          <br />
          <Tag
            color={latestValidation ? "blue" : "default"}
            style={{ marginTop: "4px" }}
          >
            {latestValidation
              ? `${latestValidation.validated_by || "AI-System"} - ${
                  latestValidation.total_checks || 0
                } checks`
              : "Không có dữ liệu AI"}
          </Tag>
          {latestValidation && (
            <>
              <br />
              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Sử dụng dữ liệu từ AI:
                </Text>
                <Switch
                  checked={useAIData}
                  onChange={setUseAIData}
                  checkedChildren="Bật"
                  unCheckedChildren="Tắt"
                  size="small"
                />
              </div>
              <Text
                type="secondary"
                style={{ fontSize: "11px", marginTop: "4px", display: "block" }}
              >
                {useAIData
                  ? "Form đã được điền sẵn dữ liệu từ AI. Bạn có thể điều chỉnh trước khi submit."
                  : "Form trống. Nhập dữ liệu xác thực thủ công."}
              </Text>
            </>
          )}
        </div>
      </Card>

      {/* Validation Status Info Alert */}
      <Alert
        message="Lưu ý về trạng thái xác thực"
        description={
          <div style={{ fontSize: "13px" }}>
            <div style={{ marginBottom: "8px" }}>
              <InfoCircleOutlined
                style={{ color: "#1890ff", marginRight: "6px" }}
              />
              <Text strong>Đang chờ (Pending):</Text> Đơn đang chờ xác thực,
              chưa được xử lý.
            </div>
            <div style={{ marginBottom: "8px" }}>
              <CheckCircleOutlined
                style={{ color: "#52c41a", marginRight: "6px" }}
              />
              <Text strong>AI đã duyệt (Passed AI):</Text> AI đã xác thực và
              đánh giá đơn hợp lệ. Cần xác nhận của admin để kích hoạt.
            </div>
            <div>
              <WarningOutlined
                style={{ color: "#faad14", marginRight: "6px" }}
              />
              <Text strong>Cảnh báo (Warning):</Text> Hợp đồng hợp lệ nhưng có
              cách tính tiền có thể gây rủi ro cho bên bảo hiểm. Cần xác nhận kỹ
              trước khi duyệt.
            </div>
          </div>
        }
        type="info"
        showIcon
        style={{ marginBottom: "16px" }}
      />

      {/* Main Form - Basic Fields */}
      <Card
        title={
          <span style={{ fontWeight: 600 }}>
            <BarChartOutlined style={{ marginRight: "8px" }} />
            Thông tin xác thực
          </span>
        }
        size="small"
        style={{ marginBottom: "16px" }}
      >
        <CustomForm
          form={form}
          fields={fields}
          onValuesChange={handleValuesChange}
          gridColumns="repeat(2, 1fr)"
          gap="16px"
        />

        {/* Progress Bar */}
        <div style={{ marginTop: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
            }}
          >
            <Text strong>Tỷ lệ thành công</Text>
            <Text>{successPercent}%</Text>
          </div>
          <Progress
            percent={successPercent}
            strokeColor="#52c41a"
            showInfo={false}
          />
        </div>
      </Card>

      {/* Combined Details Section */}
      <Card
        title={
          <span style={{ fontWeight: 600 }}>
            <InfoCircleOutlined
              style={{ marginRight: "8px", color: "#1890ff" }}
            />
            Chi tiết xác thực
          </span>
        }
        size="small"
        style={{ marginBottom: "16px" }}
      >
        {/* Mismatches Section */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              marginBottom: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
            Lỗi sai
          </div>
          {/* Column Headers */}
          <Row
            gutter={12}
            style={{
              marginBottom: "8px",
              fontWeight: 500,
              fontSize: "12px",
              color: "#666",
            }}
          >
            <Col span={4}>Trường</Col>
            <Col span={4}>Kỳ vọng</Col>
            <Col span={4}>Thực tế</Col>
            <Col span={6}>Tác động</Col>
            <Col span={4}>Mức độ</Col>
            <Col span={2}></Col>
          </Row>
          <Form form={form} component={false}>
            <Form.List name="mismatches">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key}>
                      <Row
                        gutter={12}
                        align="middle"
                        style={{ padding: "12px 0" }}
                      >
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "field"]}
                            rules={[{ required: true, message: "Bắt buộc" }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Tên trường" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Tooltip
                            title={form?.getFieldValue([
                              "mismatches",
                              name,
                              "expected",
                            ])}
                          >
                            <Form.Item
                              {...restField}
                              name={[name, "expected"]}
                              rules={[{ required: true, message: "Bắt buộc" }]}
                              style={{ marginBottom: 0 }}
                            >
                              <Input placeholder="Giá trị mong đợi" />
                            </Form.Item>
                          </Tooltip>
                        </Col>
                        <Col span={4}>
                          <Tooltip
                            title={form?.getFieldValue([
                              "mismatches",
                              name,
                              "actual",
                            ])}
                          >
                            <Form.Item
                              {...restField}
                              name={[name, "actual"]}
                              rules={[{ required: true, message: "Bắt buộc" }]}
                              style={{ marginBottom: 0 }}
                            >
                              <Input placeholder="Giá trị thực tế" />
                            </Form.Item>
                          </Tooltip>
                        </Col>
                        <Col span={6}>
                          <Tooltip
                            title={form?.getFieldValue([
                              "mismatches",
                              name,
                              "impact",
                            ])}
                          >
                            <Form.Item
                              {...restField}
                              name={[name, "impact"]}
                              style={{ marginBottom: 0 }}
                            >
                              <Input placeholder="Tác động" />
                            </Form.Item>
                          </Tooltip>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "severity"]}
                            rules={[{ required: true, message: "Bắt buộc" }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select placeholder="Mức độ">
                              <Option value="low">
                                <Badge status="success" text="Thấp" />
                              </Option>
                              <Option value="medium">
                                <Badge status="warning" text="Trung bình" />
                              </Option>
                              <Option value="high">
                                <Badge status="error" text="Cao" />
                              </Option>
                              <Option value="important">
                                <Badge status="error" text="Quan trọng" />
                              </Option>
                              <Option value="critical">
                                <Badge status="error" text="Nghiêm trọng" />
                              </Option>
                              <Option value="metadata">
                                <Badge status="default" text="Metadata" />
                              </Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                            size="small"
                          />
                        </Col>
                      </Row>
                      {index < fields.length - 1 && (
                        <div
                          style={{
                            height: "1px",
                            background: "#f0f0f0",
                            margin: "8px 0",
                          }}
                        />
                      )}
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{ marginTop: "8px" }}
                    >
                      Thêm sai khác
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </div>

        {/* Divider */}
        <div
          style={{ height: "1px", background: "#e8e8e8", margin: "16px 0" }}
        />

        {/* Warnings Section */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              marginBottom: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <WarningOutlined style={{ color: "#faad14" }} />
            Cảnh báo
          </div>
          <Form form={form} component={false}>
            <Form.List name="warnings">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key}>
                      <Row
                        gutter={12}
                        align="top"
                        style={{ padding: "12px 0" }}
                      >
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "field"]}
                            rules={[{ required: true, message: "Bắt buộc" }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Tên trường" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Tooltip
                            title={form?.getFieldValue([
                              "warnings",
                              name,
                              "message",
                            ])}
                          >
                            <Form.Item
                              {...restField}
                              name={[name, "message"]}
                              rules={[{ required: true, message: "Bắt buộc" }]}
                              style={{ marginBottom: 0 }}
                            >
                              <Input.TextArea
                                placeholder="Nội dung cảnh báo"
                                autoSize={{ minRows: 2, maxRows: 4 }}
                              />
                            </Form.Item>
                          </Tooltip>
                        </Col>
                        <Col span={6}>
                          <Tooltip
                            title={form?.getFieldValue([
                              "warnings",
                              name,
                              "recommendation",
                            ])}
                          >
                            <Form.Item
                              {...restField}
                              name={[name, "recommendation"]}
                              style={{ marginBottom: 0 }}
                            >
                              <Input.TextArea
                                placeholder="Đề xuất"
                                autoSize={{ minRows: 2, maxRows: 4 }}
                              />
                            </Form.Item>
                          </Tooltip>
                        </Col>
                        <Col span={2}>
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                            size="small"
                          />
                        </Col>
                      </Row>
                      {index < fields.length - 1 && (
                        <div
                          style={{
                            height: "1px",
                            background: "#f0f0f0",
                            margin: "8px 0",
                          }}
                        />
                      )}
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{ marginTop: "8px" }}
                    >
                      Thêm cảnh báo
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </div>

        {/* Divider */}
        <div
          style={{ height: "1px", background: "#e8e8e8", margin: "16px 0" }}
        />

        {/* Recommendations Section */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              marginBottom: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BulbOutlined style={{ color: "#1890ff" }} />
            Đề xuất
          </div>
          <Form form={form} component={false}>
            <Form.List name="recommendations">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key}>
                      <Row
                        gutter={12}
                        align="middle"
                        style={{ padding: "12px 0" }}
                      >
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "category"]}
                            rules={[{ required: true, message: "Bắt buộc" }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Danh mục" />
                          </Form.Item>
                        </Col>
                        <Col span={14}>
                          <Tooltip
                            title={form?.getFieldValue([
                              "recommendations",
                              name,
                              "suggestion",
                            ])}
                          >
                            <Form.Item
                              {...restField}
                              name={[name, "suggestion"]}
                              rules={[{ required: true, message: "Bắt buộc" }]}
                              style={{ marginBottom: 0 }}
                            >
                              <Input.TextArea
                                placeholder="Nội dung đề xuất"
                                autoSize={{ minRows: 2, maxRows: 4 }}
                              />
                            </Form.Item>
                          </Tooltip>
                        </Col>
                        <Col span={2}>
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                            size="small"
                          />
                        </Col>
                      </Row>
                      {index < fields.length - 1 && (
                        <div
                          style={{
                            height: "1px",
                            background: "#f0f0f0",
                            margin: "8px 0",
                          }}
                        />
                      )}
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{ marginTop: "8px" }}
                    >
                      Thêm đề xuất
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </div>

        {/* Divider */}
        <div
          style={{ height: "1px", background: "#e8e8e8", margin: "16px 0" }}
        />

        {/* Extracted Parameters Section */}
        <div>
          <div
            style={{
              marginBottom: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <InfoCircleOutlined style={{ color: "#1890ff" }} />
            Tham số trích xuất
          </div>
          <Form form={form} component={false}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="document_version"
                  label="Phiên bản tài liệu"
                  style={{ marginBottom: "12px" }}
                >
                  <Input placeholder="v2.1" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="extraction_method"
                  label="Phương thức trích xuất"
                  style={{ marginBottom: "0px" }}
                >
                  <Input placeholder="AI-OCR" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Card>

      {/* FAQ Section */}
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
              <strong>tự động bị hủy</strong> sau 24h. Đối tác sẽ cần đăng ký
              lại từ đầu nếu muốn tiếp tục.
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
                  Phản ánh mức độ chính xác khi AI đọc và trích xuất thông tin
                  từ file PDF. Càng cao (95-100%) thì thông tin càng đáng tin
                  cậy.
                </Text>
              </div>
              <div style={{ marginBottom: "6px" }}>
                <Text strong>• Tổng số kiểm tra:</Text>
                <Text type="secondary">
                  {" "}
                  Tổng số mục thông tin đã được AI kiểm tra (ví dụ: giá bảo
                  hiểm, thời hạn, điều kiện...).
                </Text>
              </div>
              <div style={{ marginBottom: "6px" }}>
                <Text strong>• Số kiểm tra đạt/lỗi:</Text>
                <Text type="secondary">
                  {" "}
                  Số mục thông tin khớp chính xác giữa PDF và dữ liệu hệ thống,
                  và số mục có sai lệch cần xem xét.
                </Text>
              </div>
              <div>
                <Text strong>• Ghi chú xác thực:</Text>
                <Text type="secondary">
                  {" "}
                  Ghi chú của bạn về quyết định duyệt/từ chối, hoặc các vấn đề
                  cần lưu ý cho lần kiểm tra sau.
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
              Nếu độ tin cậy trích xuất dưới 80% hoặc có nhiều lỗi, hãy xem xét
              kỹ file PDF trước khi duyệt để đảm bảo thông tin chính xác.
            </Text>
          </div>
        </div>
      </Card>
    </Modal>
  );
}
