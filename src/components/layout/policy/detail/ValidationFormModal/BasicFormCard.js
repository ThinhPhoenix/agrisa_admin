import { CustomForm } from "@/components/custom-form";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Card, Col, Progress, Row, Spin, Statistic, Typography } from "antd";
import { memo } from "react";

const { Text } = Typography;

const BasicFormCard = memo(function BasicFormCard({
  form,
  fields,
  handleValuesChange,
  formValues,
  successPercent,
  useAIData,
  applyingAI,
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
      <div style={{ position: "relative" }}>
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
              Độ tin cậy: {formValues?.extraction_confidence || 95}% | Tham số
              tìm thấy: {formValues?.parameters_found || 0}
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
              style={{
                fontSize: "14px",
                display: "block",
                marginBottom: "12px",
              }}
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
        {applyingAI && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              borderRadius: 4,
            }}
          >
            <Spin size="large" />
          </div>
        )}
      </div>
    );
  }

  // Show form when not using AI data
  return (
    <div style={{ position: "relative" }}>
      <Card
        title={
          <span style={{ fontWeight: 600 }}>
            <BarChartOutlined style={{ marginRight: "8px" }} />
            Thông tin xác thực thủ công
          </span>
        }
        size="small"
        style={{ marginBottom: "16px" }}
      >
        {/* Total checks - prominent display */}
        <Card
          size="small"
          style={{
            textAlign: "center",
            marginBottom: "16px",
            background: "#f0f5ff",
            border: "1px solid #adc6ff",
          }}
        >
          <Statistic
            title={
              <span style={{ fontSize: "14px", fontWeight: 500 }}>
                Tổng số kiểm tra
              </span>
            }
            value={formValues?.total_checks || 0}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: "#1890ff", fontSize: "32px" }}
          />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            = Đạt + Lỗi + Cảnh báo
          </Text>
        </Card>

        {/* Input fields for manual entry */}
        <CustomForm
          form={form}
          fields={fields
            .filter(
              (f) =>
                f.name !== "total_checks" &&
                (f.name === "validation_status" ||
                  f.name === "passed_checks" ||
                  f.name === "failed_checks" ||
                  f.name === "warning_count" ||
                  f.name === "validation_notes")
            )
            .map((field) => {
              // Add composition handlers to validation_notes to fix Vietnamese input
              if (field.name === "validation_notes") {
                return {
                  ...field,
                  onCompositionStart: handleCompositionStart,
                  onCompositionEnd: handleCompositionEnd,
                };
              }
              return field;
            })}
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
      {applyingAI && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
            borderRadius: 4,
          }}
        >
          <Spin size="large" />
        </div>
      )}
    </div>
  );
});

export default BasicFormCard;
