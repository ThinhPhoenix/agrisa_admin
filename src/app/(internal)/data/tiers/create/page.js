"use client";

import { CustomForm } from "@/components/custom-form";
import { useCategories } from "@/services/hooks/data/use-categories";
import { useTiers } from "@/services/hooks/data/use-tiers";
import { Button, Layout, Spin, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import "../../data.css";

const { Title, Text } = Typography;

export default function CreateTierPage() {
  const { createTier, loading: apiLoading } = useTiers();
  const { filteredData: categories, loading: categoriesLoading } =
    useCategories();
  const router = useRouter();
  const formRef = useRef();
  const [submitting, setSubmitting] = useState(false);

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await createTier(formData);
      router.push("/data/tiers");
    } catch (err) {
      // Error is handled in the hook
    } finally {
      setSubmitting(false);
    }
  };

  // Handle submit button click
  const handleSubmitClick = async () => {
    try {
      const values = await formRef.current.validateFields();
      await handleFormSubmit(values);
    } catch (err) {
      // Validation error
    }
  };

  // Category options for dropdown
  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({
      label: cat.category_name,
      value: cat.id,
    }));
  }, [categories]);

  // Form fields
  const formFields = [
    {
      name: "data_tier_category_id",
      label: "Danh mục",
      type: "select",
      placeholder: "Chọn danh mục...",
      required: true,
      options: categoryOptions,
      loading: categoriesLoading,
    },
    {
      name: "tier_name",
      label: "Tên cấp độ",
      type: "input",
      placeholder: "Nhập tên cấp độ...",
      required: true,
      maxLength: 100,
    },
    {
      name: "tier_level",
      label: "Cấp độ",
      type: "number",
      placeholder: "Nhập cấp độ...",
      required: true,
      min: 1,
    },
    {
      name: "data_tier_multiplier",
      label: "Hệ số nhân",
      type: "number",
      placeholder: "Nhập hệ số nhân...",
      required: true,
      min: 0,
      step: 0.1,
    },
  ];

  // Loading state check
  if (apiLoading || categoriesLoading) {
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
              Tạo Cấp độ Mới
            </Title>
            <Text className="data-subtitle">
              Thêm cấp độ dữ liệu mới vào hệ thống
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
              Tạo cấp độ
            </Button>
            <Button
              type="default"
              onClick={() => router.push("/data/tiers")}
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
