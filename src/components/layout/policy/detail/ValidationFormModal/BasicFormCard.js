import { CustomForm } from "@/components/custom-form";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Card, Col, Progress, Row, Statistic, Typography } from "antd";
import { memo } from "react";

const { Text } = Typography;

const BasicFormCard = memo(function BasicFormCard({
  form,
  fields,
  handleValuesChange,
  formValues,
  successPercent,
  useAIData,
  handleCompositionStart,
  handleCompositionEnd,
}) {
  if (useAIData) {
    // Show summary cards when using AI data + editable fields for user input
    const editableFields = fields.filter(
      (f) => f.name === "validation_status" || f.name === "validation_notes"
    );

    // Add composition handlers to validation_notes field
    const fieldsWithHandlers = editableFields.map((field) => {
      if (field.name === "validation_notes") {
        return {
          ...field,
          onCompositionStart: handleCompositionStart,
          onCompositionEnd: handleCompositionEnd,
        };
      }
      return field;
    });

    return (
      <Card
        title={
          <span style={{ fontWeight: 600 }}>
            <BarChartOutlined style={{ marginRight: "8px" }} />
            Thông tin xác thực từ AI
          </span>
        }
        size="small"
        style={{ marginBottom: "16px" }}
      >
        {/* Summary Statistics Cards */}
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Statistic
                title="Tổng kiểm tra"
                value={formValues?.total_checks || 0}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Statistic
                title="Đạt"
                value={formValues?.passed_checks || 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Statistic
                title="Lỗi"
                value={formValues?.failed_checks || 0}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Statistic
                title="Cảnh báo"
                value={formValues?.warning_count || 0}
                prefix={<WarningOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
        </Row>

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

        <div style={{ marginTop: "16px" }}>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Độ tin cậy: {formValues?.extraction_confidence || 95}% | Tham số tìm
            thấy: {formValues?.parameters_found || 0}
          </Text>
        </div>

        {/* User editable fields */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Text
            strong
            style={{ fontSize: "14px", display: "block", marginBottom: "12px" }}
          >
            Xác thực thủ công
          </Text>
          <CustomForm
            form={form}
            fields={fieldsWithHandlers}
            onValuesChange={handleValuesChange}
            gridColumns="1fr"
            gap="16px"
          />
        </div>
      </Card>
    );
  }

  // Show form when not using AI data
  return (
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
  );
});

export default BasicFormCard;
