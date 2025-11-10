"use client";

import { CustomForm } from "@/components/custom-form";
import { useCategories } from "@/services/hooks/data/use-categories";
import { useTiers } from "@/services/hooks/data/use-tiers";
import { Button, Layout, Spin, Typography } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "../../../data.css";

const { Title, Text } = Typography;

export default function EditTierPage() {
  const { id } = useParams();
  const { updateTier, getTier, loading: apiLoading } = useTiers();
  const { filteredData: categories, loading: categoriesLoading } =
    useCategories();
  const router = useRouter();
  const formRef = useRef();
  const [submitting, setSubmitting] = useState(false);
  const [tierData, setTierData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch tier data (only once when id changes)
  useEffect(() => {
    const fetchTier = async () => {
      try {
        setLoading(true);
        const data = await getTier(id);
        setTierData(data);
      } catch (err) {
        // Error handled in hook
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTier();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only depend on id, getTier is now stable with useCallback

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await updateTier(id, formData);
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
  const categoryOptions = categories.map((cat) => ({
    label: cat.category_name,
    value: cat.id,
  }));

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
  if (loading || apiLoading || categoriesLoading) {
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
              Chỉnh sửa Cấp độ
            </Title>
            <Text className="data-subtitle">
              Cập nhật thông tin cấp độ dữ liệu
            </Text>
          </div>
        </div>

        {/* Form */}
        <div className="data-form-container">
          <CustomForm
            ref={formRef}
            fields={formFields}
            initialValues={tierData}
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
              Cập nhật cấp độ
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
