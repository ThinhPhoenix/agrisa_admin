"use client";

import { CustomForm } from "@/components/custom-form";
import { useSources } from "@/services/hooks/data/use-sources";
import { Button, Layout, message, Spin, Typography } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "../../../data.css";

const { Title, Text } = Typography;

export default function EditSourcePage() {
  const params = useParams();
  const router = useRouter();
  const { getSource, updateSource } = useSources();
  const formRef = useRef();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchSourceDetail = async () => {
      try {
        setLoading(true);
        const data = await getSource(params.id);
        setInitialValues(data);
      } catch (err) {
        console.error("Error fetching source:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSourceDetail();
    }
  }, [params.id]);

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await updateSource(params.id, formData);
      router.push(`/data/sources/${params.id}`);
    } catch (err) {
      // Error is handled in the hook
    } finally {
      setSubmitting(false);
    }
  };

  // Handle submit button click
  const handleSubmitClick = async () => {
    try {
      // 1. Validate Ant Design Form fields first
      const values = await formRef.current.validateFields();

      // 2. Validate with Zod schema (Frontend validation)      const zodValidation = updateDataSourceSchema.safeParse(values);
      if (!zodValidation.success) {
        const firstError = zodValidation.error.errors[0];
        message.error(firstError.message);
        return;
      }

      // 3. Submit to backend (BE validation)
      await handleFormSubmit(zodValidation.data);
    } catch (err) {
      // Ant Design validation error - already handled by form
      console.error("Form validation error:", err);
    }
  };

  // Update frequency options
  const updateFrequencyOptions = [
    { label: "Theo giờ (Hourly)", value: "hourly" },
    { label: "Theo ngày (Daily)", value: "daily" },
    { label: "Theo tuần (Weekly)", value: "weekly" },
    { label: "Theo tháng (Monthly)", value: "monthly" },
    { label: "Theo năm (Yearly)", value: "yearly" },
    { label: "Thời gian thực (Real-time)", value: "real-time" },
    { label: "30 phút", value: "30 minutes" },
  ];

  // Form fields - Only editable fields as per requirements
  const formFields = [
    {
      name: "display_name_vi",
      label: "Tên hiển thị (Tiếng Việt)",
      type: "input",
      placeholder: "Nhập tên hiển thị...",
      required: true,
      maxLength: 200,
    },
    {
      name: "description_vi",
      label: "Mô tả (Tiếng Việt)",
      type: "textarea",
      placeholder: "Nhập mô tả...",
      required: false,
      maxLength: 500,
    },
    {
      name: "base_cost",
      label: "Chi phí cơ bản",
      type: "number",
      placeholder: "Nhập chi phí cơ bản...",
      required: true,
      min: 0,
      step: 0.01,
    },
    {
      name: "update_frequency",
      label: "Tần suất cập nhật",
      type: "select",
      placeholder: "Chọn tần suất cập nhật...",
      required: true,
      options: updateFrequencyOptions,
    },
    {
      name: "is_active",
      label: "Trạng thái hoạt động",
      type: "switch",
      required: false,
    },
  ];

  // Disabled fields for display only
  const disabledFields = [
    {
      name: "data_source",
      label: "Nguồn dữ liệu",
      type: "input",
      disabled: true,
    },
    {
      name: "parameter_name",
      label: "Tên tham số",
      type: "input",
      disabled: true,
    },
    {
      name: "parameter_type",
      label: "Loại tham số",
      type: "input",
      disabled: true,
    },
    {
      name: "unit",
      label: "Đơn vị",
      type: "input",
      disabled: true,
    },
    {
      name: "min_value",
      label: "Giá trị tối thiểu",
      type: "number",
      disabled: true,
    },
    {
      name: "max_value",
      label: "Giá trị tối đa",
      type: "number",
      disabled: true,
    },
    {
      name: "spatial_resolution",
      label: "Độ phân giải không gian",
      type: "input",
      disabled: true,
    },
    {
      name: "accuracy_rating",
      label: "Độ chính xác (0-1)",
      type: "number",
      disabled: true,
    },
    {
      name: "data_provider",
      label: "Nhà cung cấp dữ liệu",
      type: "input",
      disabled: true,
    },
  ];

  // Loading state check
  if (loading) {
    return (
      <Layout.Content className="data-content">
        <div className="data-loading">
          <Spin size="large" tip="Đang tải..." />
        </div>
      </Layout.Content>
    );
  }

  if (!initialValues) {
    return (
      <Layout.Content className="data-content">
        <div className="data-loading">
          <Title level={4}>Không tìm thấy nguồn dữ liệu</Title>
        </div>
      </Layout.Content>
    );
  }

  return (
    <Layout.Content className="data-content">
      <div className="data-space">
        {/* Header */}
        <div className="data-header">
          <div>
            <Title level={2} className="data-title">
              Chỉnh Sửa Nguồn Dữ Liệu
            </Title>
            <Text className="data-subtitle">
              Cập nhật thông tin nguồn dữ liệu
            </Text>
          </div>
        </div>

        {/* Form */}
        <div className="data-form-container">
          {/* Disabled fields */}
          <div style={{ marginBottom: "24px" }}>
            <Text
              strong
              style={{
                fontSize: "16px",
                display: "block",
                marginBottom: "16px",
              }}
            >
              Thông tin không thể chỉnh sửa
            </Text>
            <CustomForm
              fields={disabledFields}
              gridColumns="1fr 1fr"
              gap="16px"
              initialValues={initialValues}
            />
          </div>

          {/* Editable fields */}
          <div>
            <Text
              strong
              style={{
                fontSize: "16px",
                display: "block",
                marginBottom: "16px",
              }}
            >
              Thông tin có thể chỉnh sửa
            </Text>
            <CustomForm
              ref={formRef}
              fields={formFields}
              gridColumns="1fr 1fr"
              gap="16px"
              initialValues={initialValues}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="data-form-actions">
          <div className="data-form-buttons">
            <Button
              type="primary"
              onClick={handleSubmitClick}
              loading={submitting}
              size="large"
            >
              Cập nhật
            </Button>
            <Button
              type="default"
              onClick={() => router.push(`/data/sources/${params.id}`)}
              size="large"
              style={{ marginLeft: "8px" }}
            >
              Hủy
            </Button>
          </div>
        </div>
      </div>
    </Layout.Content>
  );
}
