"use client";

import {
  BarChartOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SettingOutlined,
  UserOutlined,
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
import { CustomForm } from "@/components/custom-form";

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
    if (open && latestValidation) {
      // Convert mismatches object to array
      const mismatchesArray = latestValidation.mismatches
        ? Object.entries(latestValidation.mismatches).map(([key, value]) => ({
            field: key,
            expected: value.pdf_value,
            actual: value.json_value,
            severity: value.severity || "low",
          }))
        : [];

      // Convert warnings object to array
      const warningsArray = latestValidation.warnings
        ? Object.entries(latestValidation.warnings).map(([key, value]) => ({
            field: key,
            message: value.pdf_context || value.details || "",
            recommendation: value.recommendation || "",
          }))
        : [];

      // Convert recommendations object to array
      const recommendationsArray = latestValidation.recommendations
        ? Object.entries(latestValidation.recommendations).map(
            ([key, value]) => ({
              category: key,
              suggestion: value.suggestion || "",
            })
          )
        : [];

      // Determine validation status based on mode
      let validationStatus = latestValidation.validation_status;
      let validationNotes = latestValidation.validation_notes || "";

      if (mode === "accept_ai") {
        // When accepting AI result, set status to "passed" (manual confirmation)
        validationStatus = "passed";
        validationNotes = validationNotes
          ? `${validationNotes}\n\nAdmin đã chấp nhận kết quả AI và xác nhận thủ công.`
          : "Admin đã chấp nhận kết quả AI và xác nhận thủ công. Kết quả AI được coi là chính xác.";
      }

      const initialValues = {
        validation_status: validationStatus,
        validated_by: validatedBy,
        total_checks: latestValidation.total_checks || 0,
        passed_checks: latestValidation.passed_checks || 0,
        failed_checks: latestValidation.failed_checks || 0,
        warning_count: latestValidation.warning_count || 0,
        mismatches: mismatchesArray,
        warnings: warningsArray,
        recommendations: recommendationsArray,
        extraction_confidence:
          latestValidation.extracted_parameters?.extraction_confidence || 0.95,
        parameters_found:
          latestValidation.extracted_parameters?.parameters_found || 0,
        validation_notes: validationNotes,
      };

      formRef.current?.setFieldsValue(initialValues);
      setFormValues(initialValues);
    } else if (open) {
      // Set defaults for new validation
      const defaultValues = {
        validated_by: validatedBy,
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

      formRef.current?.setFieldsValue(defaultValues);
      setFormValues(defaultValues);
    }
  }, [open, latestValidation, validatedBy, mode]);

  const handleSubmit = async () => {
    try {
      const values = await formRef.current?.validateFields();
      setSubmitting(true);

      // Convert arrays to objects (map) as expected by backend API
      // Only include if array has items
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

      // Build payload - only include non-empty objects
      const payload = {
        base_policy_id: basePolicyId,
        validation_status: values.validation_status,
        validated_by: values.validated_by,
        total_checks: values.total_checks || 0,
        passed_checks: values.passed_checks || 0,
        failed_checks: values.failed_checks || 0,
        warning_count: values.warning_count || 0,
        validation_notes: values.validation_notes || "",
      };

      // Only add these fields if they have content
      if (Object.keys(mismatchesObject).length > 0) {
        payload.mismatches = mismatchesObject;
      }
      if (Object.keys(warningsObject).length > 0) {
        payload.warnings = warningsObject;
      }
      if (Object.keys(recommendationsObject).length > 0) {
        payload.recommendations = recommendationsObject;
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
    // Header Section - Validation Status and Validated By
    {
      type: "select",
      name: "validation_status",
      label: (
        <span style={{ fontWeight: 600 }}>
          <InfoCircleOutlined style={{ marginRight: "4px" }} />
          Trạng thái xác thực
        </span>
      ),
      placeholder: "Chọn trạng thái xác thực",
      gridColumn: "span 1",
      rules: [{ required: true, message: "Vui lòng chọn trạng thái" }],
      options: [
        {
          value: "pending",
          label: <Badge status="default" text="Chờ duyệt" />,
        },
        {
          value: "passed",
          label: <Badge status="success" text="Đã duyệt" />,
        },
        {
          value: "passed_ai",
          label: <Badge status="processing" text="Đã duyệt (AI)" />,
        },
        {
          value: "failed",
          label: <Badge status="error" text="Thất bại" />,
        },
        {
          value: "warning",
          label: <Badge status="warning" text="Cảnh báo" />,
        },
      ],
    },
    {
      type: "input",
      name: "validated_by",
      label: (
        <span style={{ fontWeight: 600 }}>
          <UserOutlined style={{ marginRight: "4px" }} />
          Người xác thực
        </span>
      ),
      placeholder: "admin@example.com",
      gridColumn: "span 1",
      rules: [
        { required: true, message: "Vui lòng nhập email người xác thực" },
        { type: "email", message: "Email không hợp lệ" },
      ],
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
          <WarningOutlined
            style={{ marginRight: "4px", color: "#faad14" }}
          />
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

    // Extraction Parameters
    {
      type: "number",
      name: "extraction_confidence",
      label: <span style={{ fontWeight: 500 }}>Độ tin cậy trích xuất</span>,
      placeholder: "0.95",
      min: 0,
      max: 1,
      step: 0.01,
      gridColumn: "span 1",
      rules: [],
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

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircleOutlined />
          <span>Xác thực thủ công</span>
        </div>
      }
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
            AI Validation Data
          </Text>
          <br />
          <Tag color="blue" style={{ marginTop: "4px" }}>
            {latestValidation ? "Đã tải" : "Không có"}
          </Tag>
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

      {/* Mismatches Section */}
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
                          ?.getFieldValue(["mismatches", name, "severity"]) ===
                        "critical"
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

      {/* Warnings Section */}
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
                            ?.getFieldValue(["warnings", name, "recommendation"])}
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

      {/* Recommendations Section */}
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
    </Modal>
  );
}
