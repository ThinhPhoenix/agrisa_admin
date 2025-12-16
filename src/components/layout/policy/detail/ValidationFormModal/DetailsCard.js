import {
  BulbOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Tooltip,
} from "antd";

export default function DetailsCard({
  form,
  useAIData,
  formValues,
  recalculateCountsFromItems,
}) {
  if (useAIData) {
    // Show editable items when using AI data
    const mismatches = form.getFieldValue("mismatches") || [];
    const warnings = form.getFieldValue("warnings") || [];
    const recommendations = form.getFieldValue("recommendations") || [];

    return (
      <Card
        title={
          <span style={{ fontWeight: 600 }}>
            <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
            Chi tiết xác thực từ AI (Có thể chỉnh sửa)
          </span>
        }
        size="small"
        style={{ marginBottom: "16px" }}
      >
        <Alert
          message="Chế độ AI-Assisted"
          description="Bạn có thể xem, chỉnh sửa, xóa hoặc thêm chi tiết. Số liệu tổng hợp sẽ tự động cập nhật."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        {/* Mismatches - Editable */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              marginBottom: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
            Lỗi sai ({mismatches.length})
          </div>
          <Form form={form} component={false}>
            <Form.List name="mismatches">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Card
                      key={key}
                      size="small"
                      style={{
                        marginBottom: 8,
                        background: "#fff2f0",
                        border: "1px solid #ffccc7",
                      }}
                    >
                      <Row gutter={12} align="middle">
                        <Col span={5}>
                          <Form.Item
                            {...restField}
                            label="Trường"
                            name={[name, "field"]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Tên trường" />
                          </Form.Item>
                        </Col>
                        <Col span={5}>
                          <Form.Item
                            {...restField}
                            label="Kỳ vọng"
                            name={[name, "expected"]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Giá trị kỳ vọng" />
                          </Form.Item>
                        </Col>
                        <Col span={5}>
                          <Form.Item
                            {...restField}
                            label="Thực tế"
                            name={[name, "actual"]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Giá trị thực tế" />
                          </Form.Item>
                        </Col>
                        <Col span={5}>
                          <Form.Item
                            {...restField}
                            label="Mức độ"
                            name={[name, "severity"]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select placeholder="Mức độ" size="small">
                              <Select.Option value="low">Thấp</Select.Option>
                              <Select.Option value="medium">
                                Trung bình
                              </Select.Option>
                              <Select.Option value="high">Cao</Select.Option>
                              <Select.Option value="critical">
                                Nghiêm trọng
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={4} style={{ textAlign: "right" }}>
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => {
                              remove(name);
                              // Recalculate after deletion
                              setTimeout(recalculateCountsFromItems, 100);
                            }}
                            size="small"
                          >
                            Xóa
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => {
                      add({
                        field: "",
                        expected: "",
                        actual: "",
                        severity: "medium",
                      });
                      // Recalculate after addition
                      setTimeout(recalculateCountsFromItems, 100);
                    }}
                    block
                    icon={<PlusOutlined />}
                    style={{ marginTop: "8px" }}
                  >
                    Thêm lỗi sai
                  </Button>
                </>
              )}
            </Form.List>
          </Form>
        </div>

        <div
          style={{ height: "1px", background: "#e8e8e8", margin: "16px 0" }}
        />

        {/* Warnings - Editable */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              marginBottom: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <WarningOutlined style={{ color: "#faad14" }} />
            Cảnh báo ({warnings.length})
          </div>
          <Form form={form} component={false}>
            <Form.List name="warnings">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Card
                      key={key}
                      size="small"
                      style={{
                        marginBottom: 8,
                        background: "#fffbe6",
                        border: "1px solid #ffe58f",
                      }}
                    >
                      <Row gutter={12} align="middle">
                        <Col span={7}>
                          <Form.Item
                            {...restField}
                            label="Trường"
                            name={[name, "field"]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Tên trường" />
                          </Form.Item>
                        </Col>
                        <Col span={9}>
                          <Form.Item
                            {...restField}
                            label="Nội dung"
                            name={[name, "message"]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input.TextArea
                              placeholder="Nội dung cảnh báo"
                              autoSize={{ minRows: 1, maxRows: 3 }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => {
                              remove(name);
                              // Recalculate after deletion
                              setTimeout(recalculateCountsFromItems, 100);
                            }}
                            size="small"
                          >
                            Xóa
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => {
                      add({ field: "", message: "" });
                      // Recalculate after addition
                      setTimeout(recalculateCountsFromItems, 100);
                    }}
                    block
                    icon={<PlusOutlined />}
                    style={{ marginTop: "8px" }}
                  >
                    Thêm cảnh báo
                  </Button>
                </>
              )}
            </Form.List>
          </Form>
        </div>

        <div
          style={{ height: "1px", background: "#e8e8e8", margin: "16px 0" }}
        />

        {/* Recommendations - Editable */}
        <div>
          <div
            style={{
              marginBottom: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BulbOutlined style={{ color: "#1890ff" }} />
            Đề xuất ({recommendations.length})
          </div>
          <Form form={form} component={false}>
            <Form.List name="recommendations">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Card
                      key={key}
                      size="small"
                      style={{
                        marginBottom: 8,
                        background: "#e6f7ff",
                        border: "1px solid #91d5ff",
                      }}
                    >
                      <Row gutter={12} align="middle">
                        <Col span={7}>
                          <Form.Item
                            {...restField}
                            label="Danh mục"
                            name={[name, "category"]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Danh mục" />
                          </Form.Item>
                        </Col>
                        <Col span={13}>
                          <Form.Item
                            {...restField}
                            label="Nội dung đề xuất"
                            name={[name, "suggestion"]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input.TextArea
                              placeholder="Nội dung đề xuất"
                              autoSize={{ minRows: 1, maxRows: 3 }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4} style={{ textAlign: "right" }}>
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => {
                              remove(name);
                              // No need to recalculate for recommendations as they don't affect counts
                            }}
                            size="small"
                          >
                            Xóa
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => {
                      add({ category: "", suggestion: "" });
                    }}
                    block
                    icon={<PlusOutlined />}
                    style={{ marginTop: "8px" }}
                  >
                    Thêm đề xuất
                  </Button>
                </>
              )}
            </Form.List>
          </Form>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <span style={{ fontWeight: 600 }}>
          <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
          Chi tiết xác thực
        </span>
      }
      size="small"
      style={{ marginBottom: "16px" }}
    >
      {/* Mismatches Section */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            marginBottom: "12px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
          Lỗi sai
          <span style={{ fontSize: "12px", color: "#999", fontWeight: 400 }}>
            ({formValues?.failed_checks || 0} lỗi)
          </span>
        </div>
        <Row
          gutter={12}
          style={{
            marginBottom: "8px",
            fontWeight: 500,
            fontSize: "12px",
            color: "#666",
          }}
        >
          <Col span={4}>Trường</Col>
          <Col span={4}>Kỳ vọng</Col>
          <Col span={4}>Thực tế</Col>
          <Col span={6}>Tác động</Col>
          <Col span={4}>Mức độ</Col>
        </Row>
        <Form form={form} component={false}>
          <Form.List name="mismatches">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div key={key}>
                    <Row
                      gutter={12}
                      align="middle"
                      style={{ padding: "12px 0" }}
                    >
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, "field"]}
                          rules={[{ required: true, message: "Bắt buộc" }]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input
                            placeholder="Tên trường"
                            disabled={useAIData}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Tooltip
                          title={form?.getFieldValue([
                            "mismatches",
                            name,
                            "expected",
                          ])}
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "expected"]}
                            rules={[{ required: true, message: "Bắt buộc" }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="Giá trị mong đợi"
                              disabled={useAIData}
                            />
                          </Form.Item>
                        </Tooltip>
                      </Col>
                      <Col span={4}>
                        <Tooltip
                          title={form?.getFieldValue([
                            "mismatches",
                            name,
                            "actual",
                          ])}
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "actual"]}
                            rules={[{ required: true, message: "Bắt buộc" }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="Giá trị thực tế"
                              disabled={useAIData}
                            />
                          </Form.Item>
                        </Tooltip>
                      </Col>
                      <Col span={6}>
                        <Tooltip
                          title={form?.getFieldValue([
                            "mismatches",
                            name,
                            "impact",
                          ])}
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "impact"]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Tác động" />
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
                          <Select placeholder="Mức độ" disabled={useAIData}>
                            <Select.Option value="low">
                              <Badge status="success" text="Thấp" />
                            </Select.Option>
                            <Select.Option value="medium">
                              <Badge status="warning" text="Trung bình" />
                            </Select.Option>
                            <Select.Option value="high">
                              <Badge status="error" text="Cao" />
                            </Select.Option>
                            <Select.Option value="important">
                              <Badge status="error" text="Quan trọng" />
                            </Select.Option>
                            <Select.Option value="critical">
                              <Badge status="error" text="Nghiêm trọng" />
                            </Select.Option>
                            <Select.Option value="metadata">
                              <Badge status="default" text="Metadata" />
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      {/* <Col span={2}>
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                          size="small"
                        />
                      </Col> */}
                    </Row>
                    {index < fields.length - 1 && (
                      <div
                        style={{
                          height: "1px",
                          background: "#f0f0f0",
                          margin: "8px 0",
                        }}
                      />
                    )}
                  </div>
                ))}
                {fields.length === 0 && (
                  <div
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      color: "#999",
                    }}
                  >
                    Không có lỗi sai nào được báo cáo
                  </div>
                )}
                {fields.length < (formValues?.failed_checks || 0) &&
                  !useAIData && (
                    <Alert
                      message={`Cảnh báo: Bạn đã nhập ${
                        formValues?.failed_checks
                      } lỗi nhưng chỉ có ${
                        fields.length
                      } trường. Vui lòng thêm ${
                        formValues?.failed_checks - fields.length
                      } trường nữa.`}
                      type="warning"
                      showIcon
                      style={{ marginTop: "12px" }}
                    />
                  )}
              </>
            )}
          </Form.List>
        </Form>

        <div
          style={{ height: "1px", background: "#e8e8e8", margin: "16px 0" }}
        />

        {/* Warnings */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              marginBottom: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <WarningOutlined style={{ color: "#faad14" }} /> Cảnh báo
            <span style={{ fontSize: "12px", color: "#999", fontWeight: 400 }}>
              ({formValues?.warning_count || 0} cảnh báo)
            </span>
          </div>
          <Form form={form} component={false}>
            <Form.List name="warnings">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key}>
                      <Row
                        gutter={12}
                        align="top"
                        style={{ padding: "12px 0" }}
                      >
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "field"]}
                            rules={[{ required: true, message: "Bắt buộc" }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="Tên trường"
                              disabled={useAIData}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Tooltip
                            title={form?.getFieldValue([
                              "warnings",
                              name,
                              "message",
                            ])}
                          >
                            <Form.Item
                              {...restField}
                              name={[name, "message"]}
                              rules={[{ required: true, message: "Bắt buộc" }]}
                              style={{ marginBottom: 0 }}
                            >
                              <Input.TextArea
                                placeholder="Nội dung cảnh báo"
                                autoSize={{ minRows: 2, maxRows: 4 }}
                                disabled={useAIData}
                              />
                            </Form.Item>
                          </Tooltip>
                        </Col>
                        <Col span={6}>
                          <Tooltip
                            title={form?.getFieldValue([
                              "warnings",
                              name,
                              "recommendation",
                            ])}
                          >
                            <Form.Item
                              {...restField}
                              name={[name, "recommendation"]}
                              style={{ marginBottom: 0 }}
                            >
                              <Input.TextArea
                                placeholder="Đề xuất"
                                autoSize={{ minRows: 2, maxRows: 4 }}
                              />
                            </Form.Item>
                          </Tooltip>
                        </Col>
                      </Row>
                      {index < fields.length - 1 && (
                        <div
                          style={{
                            height: "1px",
                            background: "#f0f0f0",
                            margin: "8px 0",
                          }}
                        />
                      )}
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <div
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        color: "#999",
                      }}
                    >
                      Không có cảnh báo nào
                    </div>
                  )}
                  {fields.length < (formValues?.warning_count || 0) &&
                    !useAIData && (
                      <Alert
                        message={`Cảnh báo: Bạn đã nhập ${
                          formValues?.warning_count
                        } cảnh báo nhưng chỉ có ${
                          fields.length
                        } trường. Vui lòng thêm ${
                          formValues?.warning_count - fields.length
                        } trường nữa.`}
                        type="warning"
                        showIcon
                        style={{ marginTop: "12px" }}
                      />
                    )}
                </>
              )}
            </Form.List>
          </Form>
        </div>

        <div
          style={{ height: "1px", background: "#e8e8e8", margin: "16px 0" }}
        />

        {/* Recommendations */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              marginBottom: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BulbOutlined style={{ color: "#1890ff" }} /> Đề xuất
          </div>
          <Form form={form} component={false}>
            <Form.List name="recommendations">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key}>
                      <Row
                        gutter={12}
                        align="middle"
                        style={{ padding: "12px 0" }}
                      >
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
                            title={form?.getFieldValue([
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
                              <Input.TextArea
                                placeholder="Nội dung đề xuất"
                                autoSize={{ minRows: 2, maxRows: 4 }}
                              />
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
                      {index < fields.length - 1 && (
                        <div
                          style={{
                            height: "1px",
                            background: "#f0f0f0",
                            margin: "8px 0",
                          }}
                        />
                      )}
                    </div>
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
        </div>

        <div
          style={{ height: "1px", background: "#e8e8e8", margin: "16px 0" }}
        />

        {/* Extracted Parameters - Hidden */}
        {/* <div>
          <div
            style={{
              marginBottom: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CloseCircleOutlined style={{ color: "#ff4d4f" }} /> Tham số trích
            xuất
          </div>
          <Form form={form} component={false}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="document_version"
                  label="Phiên bản tài liệu"
                  style={{ marginBottom: "12px" }}
                >
                  <Input placeholder="v2.1" disabled={true} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="extraction_method"
                  label="Phương thức trích xuất"
                  style={{ marginBottom: "0px" }}
                >
                  <Input placeholder="AI-OCR" disabled={true} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div> */}
      </div>
    </Card>
  );
}
