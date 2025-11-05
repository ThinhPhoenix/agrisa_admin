"use client";

import {
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

const { TextArea } = Input;
const { Text } = Typography;

export default function ValidationFormModal({
  open,
  onCancel,
  onSubmit,
  basePolicyId,
  latestValidation,
  validatedBy = "admin@example.com",
}) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

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
        ? Object.entries(latestValidation.recommendations).map(([key, value]) => ({
            category: key,
            suggestion: value.suggestion || "",
          }))
        : [];

      form.setFieldsValue({
        validation_status: latestValidation.validation_status,
        validated_by: validatedBy,
        total_checks: latestValidation.total_checks || 0,
        passed_checks: latestValidation.passed_checks || 0,
        failed_checks: latestValidation.failed_checks || 0,
        warning_count: latestValidation.warning_count || 0,
        mismatches: mismatchesArray,
        warnings: warningsArray,
        recommendations: recommendationsArray,
        extraction_confidence: latestValidation.extracted_parameters?.extraction_confidence || 0.95,
        parameters_found: latestValidation.extracted_parameters?.parameters_found || 0,
        validation_notes: latestValidation.validation_notes || "",
      });
    } else if (open) {
      // Set defaults for new validation
      form.setFieldsValue({
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
      });
    }
  }, [open, latestValidation, validatedBy, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // Convert arrays back to objects if needed for API
      const mismatches = values.mismatches || [];
      const warnings = values.warnings || [];
      const recommendations = values.recommendations || [];

      const payload = {
        base_policy_id: basePolicyId,
        validation_status: values.validation_status,
        validated_by: values.validated_by,
        total_checks: values.total_checks,
        passed_checks: values.passed_checks,
        failed_checks: values.failed_checks,
        warning_count: values.warning_count,
        mismatches,
        warnings,
        recommendations,
        extracted_parameters: {
          extraction_confidence: values.extraction_confidence,
          parameters_found: values.parameters_found,
        },
        validation_notes: values.validation_notes,
      };

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

  return (
    <Modal
      title="Xác thực thủ công"
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="Gửi xác thực"
      cancelText="Hủy"
      confirmLoading={submitting}
      width={900}
      destroyOnClose
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          validated_by: validatedBy,
          total_checks: 0,
          passed_checks: 0,
          failed_checks: 0,
          warning_count: 0,
          mismatches: [],
          warnings: [],
          recommendations: [],
        }}
      >
        <Form.Item
          label="Trạng thái xác thực"
          name="validation_status"
          rules={[
            { required: true, message: "Vui lòng chọn trạng thái" },
          ]}
        >
          <Select
            placeholder="Chọn trạng thái xác thực"
            options={[
              { label: "Chờ duyệt", value: "pending" },
              { label: "Đã duyệt", value: "passed" },
              { label: "Đã duyệt (AI)", value: "passed_ai" },
              { label: "Thất bại", value: "failed" },
              { label: "Cảnh báo", value: "warning" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Người xác thực"
          name="validated_by"
          rules={[
            { required: true, message: "Vui lòng nhập email người xác thực" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="admin@example.com" />
        </Form.Item>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <Form.Item
            label="Tổng số kiểm tra"
            name="total_checks"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
          </Form.Item>

          <Form.Item
            label="Số kiểm tra đạt"
            name="passed_checks"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
          </Form.Item>

          <Form.Item
            label="Số kiểm tra lỗi"
            name="failed_checks"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
          </Form.Item>

          <Form.Item
            label="Số cảnh báo"
            name="warning_count"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
          </Form.Item>
        </div>

        <Divider orientation="left">Sai khác (Mismatches)</Divider>
        <Form.List name="mismatches">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 100px 30px",
                    gap: "8px",
                    marginBottom: "8px",
                    width: "100%",
                  }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "field"]}
                    rules={[{ required: true, message: "Bắt buộc" }]}
                  >
                    <Input placeholder="Tên trường" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "expected"]}
                    rules={[{ required: true, message: "Bắt buộc" }]}
                  >
                    <Input placeholder="Giá trị mong đợi" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "actual"]}
                    rules={[{ required: true, message: "Bắt buộc" }]}
                  >
                    <Input placeholder="Giá trị thực tế" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "severity"]}
                    rules={[{ required: true, message: "Bắt buộc" }]}
                  >
                    <Select
                      placeholder="Mức độ"
                      options={[
                        { label: "Thấp", value: "low" },
                        { label: "Trung bình", value: "medium" },
                        { label: "Cao", value: "high" },
                        { label: "Nghiêm trọng", value: "critical" },
                      ]}
                    />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm sai khác
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider orientation="left">Cảnh báo (Warnings)</Divider>
        <Form.List name="warnings">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "150px 1fr 1fr 30px",
                    gap: "8px",
                    marginBottom: "8px",
                    width: "100%",
                  }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "field"]}
                    rules={[{ required: true, message: "Bắt buộc" }]}
                  >
                    <Input placeholder="Tên trường" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "message"]}
                    rules={[{ required: true, message: "Bắt buộc" }]}
                  >
                    <Input placeholder="Nội dung cảnh báo" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "recommendation"]}
                  >
                    <Input placeholder="Đề xuất" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm cảnh báo
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider orientation="left">Đề xuất (Recommendations)</Divider>
        <Form.List name="recommendations">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "150px 1fr 30px",
                    gap: "8px",
                    marginBottom: "8px",
                    width: "100%",
                  }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "category"]}
                    rules={[{ required: true, message: "Bắt buộc" }]}
                  >
                    <Input placeholder="Danh mục" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "suggestion"]}
                    rules={[{ required: true, message: "Bắt buộc" }]}
                  >
                    <Input placeholder="Nội dung đề xuất" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm đề xuất
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider orientation="left">Thông số trích xuất</Divider>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <Form.Item
            label="Độ tin cậy trích xuất"
            name="extraction_confidence"
          >
            <InputNumber min={0} max={1} step={0.01} style={{ width: "100%" }} placeholder="0.95" />
          </Form.Item>

          <Form.Item
            label="Số tham số tìm thấy"
            name="parameters_found"
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
          </Form.Item>
        </div>

        <Form.Item label="Ghi chú xác thực" name="validation_notes">
          <TextArea
            rows={3}
            placeholder="Đã hoàn thành xem xét thủ công. Các sai lệch nhỏ đã được ghi nhận nhưng có thể chấp nhận được."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
