"use client";

import { CustomForm } from "@/components/custom-form";
import { useCategories } from "@/services/hooks/data/use-categories";
import { Button, Layout, Spin, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import "../../data.css";

const { Title, Text } = Typography;

export default function CreateCategoryPage() {
  const { createCategory, loading: apiLoading } = useCategories();
  const router = useRouter();
  const formRef = useRef();
  const [submitting, setSubmitting] = useState(false);

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await createCategory(formData);
      router.push("/data/categories");
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

  // Form fields
  const formFields = [
    {
      name: "category_name",
      label: "Tên danh mục",
      type: "input",
      placeholder: "Nhập tên danh mục...",
      required: true,
      maxLength: 100,
    },
    {
      name: "category_cost_multiplier",
      label: "Hệ số chi phí",
      type: "number",
      placeholder: "Nhập hệ số chi phí...",
      required: true,
      min: 0,
      step: 0.1,
    },
  ];

  // Loading state check
  if (apiLoading) {
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
              Tạo Danh mục Mới
            </Title>
            <Text className="data-subtitle">
              Thêm danh mục cấp độ dữ liệu mới vào hệ thống
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
              Tạo danh mục
            </Button>
            <Button
              type="default"
              onClick={() => router.push("/data/categories")}
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
