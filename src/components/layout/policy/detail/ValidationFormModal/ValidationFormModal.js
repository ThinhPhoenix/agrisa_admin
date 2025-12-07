"use client";

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import BasicFormCard from "./BasicFormCard";
import DetailsCard from "./DetailsCard";
import FAQCard from "./FAQCard";
import HeaderCard from "./HeaderCard";
import InfoAlert from "./InfoAlert";
import useValidationForm from "./useValidationForm";

export default function ValidationFormModal(props) {
  const {
    open,
    onCancel,
    onSubmit,
    basePolicyId,
    latestValidation,
    validatedBy,
    mode,
  } = props;

  const {
    form,
    submitting,
    handleSubmit,
    handleCancel,
    useAIData,
    setUseAIData,
    formValues,
    handleValuesChange,
    fields,
    successPercent,
    handleCompositionStart,
    handleCompositionEnd,
  } = useValidationForm({
    open,
    latestValidation,
    validatedBy,
    mode,
    onSubmit,
    onCancel,
    basePolicyId,
  });

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
      <HeaderCard
        latestValidation={latestValidation}
        useAIData={useAIData}
        setUseAIData={setUseAIData}
      />
      <InfoAlert />
      <BasicFormCard
        form={form}
        fields={fields}
        handleValuesChange={handleValuesChange}
        formValues={formValues}
        successPercent={successPercent}
        useAIData={useAIData}
        handleCompositionStart={handleCompositionStart}
        handleCompositionEnd={handleCompositionEnd}
      />
      <DetailsCard form={form} useAIData={useAIData} formValues={formValues} />
      <FAQCard />
    </Modal>
  );
}
