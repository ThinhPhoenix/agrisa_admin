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
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";

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
  const formRef = useRef();
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({});

  // Pre-fill form with AI validation data if available
  useEffect(() => {
    // Wait for modal to open and form to be ready
    if (!open) return;

    // Use setTimeout to ensure formRef is ready after modal opens
    const timer = setTimeout(() => {
      if (latestValidation) {
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
            }))
          : [];

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
          total_checks: latestValidation.total_checks || 0,
          passed_checks: latestValidation.passed_checks || 0,
          failed_checks: latestValidation.failed_checks || 0,
          warning_count: latestValidation.warning_count || 0,
          mismatches: mismatchesArray,
          warnings: warningsArray,
          recommendations: recommendationsArray,
          extraction_confidence:
            latestValidation.extracted_parameters?.extraction_confidence ||
            0.95,
          parameters_found:
            latestValidation.extracted_parameters?.parameters_found || 0,
          validation_notes: validationNotes,
        };

        console.log("✅ Setting form values:", initialValues);

        if (formRef.current) {
          formRef.current.setFieldsValue(initialValues);
          setFormValues(initialValues);
        }
      } else {
        console.log("📋 No AI validation data, using defaults");
        // Set defaults for new validation
        const defaultValues = {
          total_checks: 0,
          passed_checks: 0,
          failed_checks: 0,
          warning_count: 0,
          mismatches: [],
          warnings: [],
          recommendations: [],
          extraction_confidence: 0.95,
          parameters_found: 0,
          validation_notes: "",
        };

        if (formRef.current) {
          formRef.current.setFieldsValue(defaultValues);
          setFormValues(defaultValues);
        }
      }
    }, 100); // Small delay to ensure form is mounted

    return () => clearTimeout(timer);
  }, [open, latestValidation, validatedBy, mode]);

  const handleSubmit = async () => {
    try {
      const values = await formRef.current?.validateFields();
      setSubmitting(true);

      // Convert arrays to objects (map) as expected by backend API spec
      // Backend expects: map[string]any (object), not array
      const mismatchesArray = values.mismatches || [];
      const mismatchesObject = {};
      mismatchesArray.forEach((item) => {
        if (item.field) {
          mismatchesObject[item.field] = {
            expected: item.expected,
            actual: item.actual,
            severity: item.severity,
          };
        }
      });

      const warningsArray = values.warnings || [];
      const warningsObject = {};
      warningsArray.forEach((item) => {
        if (item.field) {
          warningsObject[item.field] = {
            message: item.message,
            recommendation: item.recommendation || "",
          };
        }
      });

      const recommendationsArray = values.recommendations || [];
      const recommendationsObject = {};
      recommendationsArray.forEach((item) => {
        if (item.category) {
          recommendationsObject[item.category] = {
            suggestion: item.suggestion,
          };
        }
      });

      // Build payload according to ValidatePolicyRequest spec
      const payload = {
        base_policy_id: basePolicyId,
        validation_status: "passed", // Always send "passed"
        validated_by: "agrisa.admin@gmail.com", // Hardcoded
        total_checks: values.total_checks || 0,
        passed_checks: values.passed_checks || 0,
        failed_checks: values.failed_checks || 0,
        warning_count: values.warning_count || 0,
        validation_notes: values.validation_notes || "",
      };

      // Only add mismatches/warnings/recommendations for modes that need them
      const shouldIncludeDetails =
        mode === "review" || mode === "override" || mode === "manual";

      if (shouldIncludeDetails) {
        // Add optional JSONB fields only if they have content
        if (Object.keys(mismatchesObject).length > 0) {
          payload.mismatches = mismatchesObject;
        }
        if (Object.keys(warningsObject).length > 0) {
          payload.warnings = warningsObject;
        }
        if (Object.keys(recommendationsObject).length > 0) {
          payload.recommendations = recommendationsObject;
        }
      }

      // Add extracted_parameters if provided
      if (values.extraction_confidence || values.parameters_found) {
        payload.extracted_parameters = {
          extraction_confidence: values.extraction_confidence || 0,
          parameters_found: values.parameters_found || 0,
        };
      }

      console.log("🚀 Validation payload being sent:", payload);

      await onSubmit(payload);
      formRef.current?.resetFields();
      setSubmitting(false);
    } catch (err) {
      console.error("Form validation error:", err);
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    formRef.current?.resetFields();
    onCancel();
  };

  const handleValuesChange = (allValues) => {
    setFormValues(allValues);
  };

  // Define form fields configuration
  const fields = [
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

    // Extraction Parameters - Slider
    {
      type: "slider",
      name: "extraction_confidence",
      label: <span style={{ fontWeight: 500 }}>Độ tin cậy trích xuất (%)</span>,
      gridColumn: "span 2",
      min: 0,
      max: 1,
      step: 0.01,
      marks: {
        0: "0%",
        0.5: "50%",
        0.75: "75%",
        0.95: "95%",
        1: "100%",
      },
      sliderTooltip: {
        formatter: (value) => `${(value * 100).toFixed(0)}%`,
      },
      tooltip: "Mức độ chính xác khi AI trích xuất thông tin từ tài liệu PDF",
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
      rows: 4,
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
              <Text
                type="secondary"
                style={{ fontSize: "11px", marginTop: "4px", display: "block" }}
              >
                Dữ liệu từ AI đã được điền sẵn vào form. Bạn có thể điều chỉnh
                trước khi submit.
              </Text>
            </>
          )}
        </div>
      </Card>

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
          ref={formRef}
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

      {/* Mismatches Section - Only show for review/override modes */}
      {(mode === "review" || mode === "override" || mode === "manual") && (
        <Card
          title={
            <span style={{ fontWeight: 600 }}>
              <CloseCircleOutlined
                style={{ marginRight: "8px", color: "#ff4d4f" }}
              />
              Sai khác (Mismatches)
            </span>
          }
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <Form form={formRef.current?.getForm()} component={false}>
            <Form.List name="mismatches">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card
                      key={key}
                      size="small"
                      style={{
                        marginBottom: "8px",
                        borderLeft: `4px solid ${
                          formRef.current
                            ?.getForm()
                            ?.getFieldValue([
                              "mismatches",
                              name,
                              "severity",
                            ]) === "critical"
                            ? "#ff4d4f"
                            : formRef.current
                                ?.getForm()
                                ?.getFieldValue([
                                  "mismatches",
                                  name,
                                  "severity",
                                ]) === "high"
                            ? "#faad14"
                            : formRef.current
                                ?.getForm()
                                ?.getFieldValue([
                                  "mismatches",
                                  name,
                                  "severity",
                                ]) === "medium"
                            ? "#fa8c16"
                            : "#52c41a"
                        }`,
                      }}
                      bodyStyle={{ padding: "12px" }}
                    >
                      <Row gutter={12} align="middle">
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, "field"]}
                            rules={[{ required: true, message: "Bắt buộc" }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Tên trường" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Tooltip
                            title={formRef.current
                              ?.getForm()
                              ?.getFieldValue(["mismatches", name, "expected"])}
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
                        <Col span={6}>
                          <Tooltip
                            title={formRef.current
                              ?.getForm()
                              ?.getFieldValue(["mismatches", name, "actual"])}
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
                              <Option value="critical">
                                <Badge status="error" text="Nghiêm trọng" />
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
                    </Card>
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
        </Card>
      )}

      {/* Warnings Section - Only show for review/override modes */}
      {(mode === "review" || mode === "override" || mode === "manual") && (
        <Card
          title={
            <span style={{ fontWeight: 600 }}>
              <WarningOutlined
                style={{ marginRight: "8px", color: "#faad14" }}
              />
              Cảnh báo (Warnings)
            </span>
          }
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <Form form={formRef.current?.getForm()} component={false}>
            <Form.List name="warnings">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card
                      key={key}
                      size="small"
                      style={{
                        marginBottom: "8px",
                        borderLeft: "4px solid #faad14",
                      }}
                      bodyStyle={{ padding: "12px" }}
                    >
                      <Row gutter={12} align="middle">
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
                            title={formRef.current
                              ?.getForm()
                              ?.getFieldValue(["warnings", name, "message"])}
                          >
                            <Form.Item
                              {...restField}
                              name={[name, "message"]}
                              rules={[{ required: true, message: "Bắt buộc" }]}
                              style={{ marginBottom: 0 }}
                            >
                              <Input placeholder="Nội dung cảnh báo" />
                            </Form.Item>
                          </Tooltip>
                        </Col>
                        <Col span={6}>
                          <Tooltip
                            title={formRef.current
                              ?.getForm()
                              ?.getFieldValue([
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
                              <Input placeholder="Đề xuất" />
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
                    </Card>
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
        </Card>
      )}

      {/* Recommendations Section - Only show for review/override modes */}
      {(mode === "review" || mode === "override" || mode === "manual") && (
        <Card
          title={
            <span style={{ fontWeight: 600 }}>
              <BulbOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
              Đề xuất (Recommendations)
            </span>
          }
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <Form form={formRef.current?.getForm()} component={false}>
            <Form.List name="recommendations">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card
                      key={key}
                      size="small"
                      style={{
                        marginBottom: "8px",
                        borderLeft: "4px solid #1890ff",
                      }}
                      bodyStyle={{ padding: "12px" }}
                    >
                      <Row gutter={12} align="middle">
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
                            title={formRef.current
                              ?.getForm()
                              ?.getFieldValue([
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
                              <Input placeholder="Nội dung đề xuất" />
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
                    </Card>
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
        </Card>
      )}

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
