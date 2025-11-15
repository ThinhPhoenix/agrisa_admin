"use client";

import { CustomForm } from "@/components/custom-form";
import { createDataSourceSchema } from "@/schemas/data-source-schema";
import { useSources } from "@/services/hooks/data/use-sources";
import { useTiers } from "@/services/hooks/data/use-tiers";
import { Button, Layout, message, Spin, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import "../../data.css";

const { Title, Text } = Typography;

export default function CreateSourcePage() {
  const { createSource, loading: apiLoading } = useSources();
  const { data: tiers, loading: tiersLoading } = useTiers();
  const router = useRouter();
  const formRef = useRef();
  const [submitting, setSubmitting] = useState(false);

  // Debug log
  console.log("Tiers data:", tiers);
  console.log("Tiers loading:", tiersLoading);
  console.log("Tiers is array:", Array.isArray(tiers));

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await createSource(formData);
      router.push("/data/sources");
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

      // 2. Validate with Zod schema (Frontend validation - tuyến phòng thủ đầu tiên)
      const zodValidation = createDataSourceSchema.safeParse(values);
      if (!zodValidation.success) {
        const firstError = zodValidation.error.errors[0];
        message.error(firstError.message);
        return;
      }

      // 3. Add api_endpoint as empty string to payload
      const payload = {
        ...zodValidation.data,
        api_endpoint: "",
      };

      // 4. Submit to backend (BE validation là lưới an toàn cuối cùng)
      await handleFormSubmit(payload);
    } catch (err) {
      // Ant Design validation error - already handled by form
      console.error("Form validation error:", err);
    }
  };

  // Tier options for dropdown
  const tierOptions = useMemo(() => {
    if (!Array.isArray(tiers) || tiers.length === 0) {
      return [];
    }
    return tiers.map((tier) => ({
      label: `${tier.tier_name} (Level ${tier.tier_level})`,
      value: tier.id,
    }));
  }, [tiers]);

  // Data source options (fixed values from API)
  const dataSourceOptions = [
    { label: "Weather (Thời tiết)", value: "weather" },
    { label: "Satellite (Vệ tinh)", value: "satellite" },
    { label: "Derived (Dẫn xuất)", value: "derived" },
  ];

  // Parameter name options (fixed values)
  const parameterNameOptions = [
    { label: "NDVI", value: "ndvi" },
    { label: "NDMI", value: "ndmi" },
    { label: "Rain Fall", value: "rainfall" },
  ];

  // Parameter type options (fixed values from API)
  const parameterTypeOptions = [
    { label: "Số (Numeric)", value: "numeric" },
    { label: "Boolean", value: "boolean" },
    { label: "Phân loại (Categorical)", value: "categorical" },
  ];

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

  // Form fields
  const formFields = [
    {
      name: "data_source",
      label: "Nguồn dữ liệu",
      type: "select",
      placeholder: "Chọn nguồn dữ liệu...",
      required: true,
      options: dataSourceOptions,
    },
    {
      name: "parameter_name",
      label: "Tên tham số",
      type: "select",
      placeholder: "Chọn tên tham số...",
      required: true,
      options: parameterNameOptions,
    },
    {
      name: "parameter_type",
      label: "Loại tham số",
      type: "select",
      placeholder: "Chọn loại tham số...",
      required: true,
      options: parameterTypeOptions,
    },
    {
      name: "unit",
      label: "Đơn vị",
      type: "input",
      placeholder: "Ví dụ: °C, %, mm...",
      required: false,
      maxLength: 50,
    },
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
      name: "min_value",
      label: "Giá trị tối thiểu",
      type: "number",
      placeholder: "Nhập giá trị tối thiểu...",
      required: false,
    },
    {
      name: "max_value",
      label: "Giá trị tối đa",
      type: "number",
      placeholder: "Nhập giá trị tối đa...",
      required: false,
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
      name: "spatial_resolution",
      label: "Độ phân giải không gian",
      type: "input",
      placeholder: "Ví dụ: 1km x 1km...",
      required: false,
      maxLength: 100,
    },
    {
      name: "accuracy_rating",
      label: "Độ chính xác (0-1)",
      type: "number",
      placeholder: "Nhập độ chính xác (Ví dụ: 0.95 cho 95%)...",
      required: false,
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      name: "base_cost",
      label: "Chi phí cơ bản (VND)",
      type: "number",
      placeholder: "Nhập chi phí cơ bản (VND)...",
      required: true,
      min: 0,
      step: 1000,
    },
    {
      name: "data_tier_id",
      label: "Cấp độ dữ liệu",
      type: "select",
      placeholder: tiersLoading
        ? "Đang tải danh sách cấp độ..."
        : tierOptions.length === 0
        ? "Không có cấp độ nào"
        : "Chọn cấp độ dữ liệu...",
      required: true,
      options: tierOptions,
      loading: tiersLoading,
      disabled: tiersLoading || tierOptions.length === 0,
      showSearch: true,
      filterOption: (input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
    },
    {
      name: "data_provider",
      label: "Nhà cung cấp dữ liệu",
      type: "input",
      placeholder: "Nhập tên nhà cung cấp...",
      required: false,
      maxLength: 200,
    },
  ];

  // Loading state check
  if (apiLoading || tiersLoading) {
    return (
      <Layout.Content className="data-content">
        <div className="data-loading">
          <Spin size="large" tip="Đang tải..." />
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
              Tạo Nguồn Dữ Liệu Mới
            </Title>
            <Text className="data-subtitle">
              Thêm nguồn dữ liệu mới vào hệ thống
            </Text>
          </div>
        </div>

        {/* Form */}
        <div className="data-form-container">
          <CustomForm
            ref={formRef}
            fields={formFields}
            gridColumns="1fr 1fr"
            gap="16px"
          />
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
              Tạo nguồn dữ liệu
            </Button>
            <Button
              type="default"
              onClick={() => router.push("/data/sources")}
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
