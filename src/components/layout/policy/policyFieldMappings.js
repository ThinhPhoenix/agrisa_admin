/**
 * Mapping tiếng Việt cho các trường dữ liệu của Base Policy
 * Sử dụng để hiển thị tên trường thân thiện với người dùng trong UI
 */

// Mapping từ field name sang tiếng Việt
export const FIELD_LABELS = {
  // Thông tin sản phẩm
  product_name: "Tên sản phẩm",
  "base_policy.product_name": "Tên sản phẩm",
  product_code: "Mã sản phẩm",
  "base_policy.product_code": "Mã sản phẩm",
  product_description: "Mô tả sản phẩm",
  "base_policy.product_description": "Mô tả sản phẩm",
  insurance_provider_id: "Nhà bảo hiểm",
  "base_policy.insurance_provider_id": "Nhà bảo hiểm",
  crop_type: "Loại cây trồng",
  "base_policy.crop_type": "Loại cây trồng",
  status: "Trạng thái",
  "base_policy.status": "Trạng thái",
  is_per_hectare: "Tính theo hecta",
  "base_policy.is_per_hectare": "Tính theo hecta",

  // Thông tin tài chính
  fix_premium_amount: "Phí bảo hiểm cố định",
  "base_policy.fix_premium_amount": "Phí bảo hiểm cố định",
  premium_base_rate: "Tỷ lệ phí cơ sở",
  "base_policy.premium_base_rate": "Tỷ lệ phí cơ sở",
  fix_payout_amount: "Bồi thường cố định",
  "base_policy.fix_payout_amount": "Bồi thường cố định",
  payout_base_rate: "Tỷ lệ bồi thường",
  "base_policy.payout_base_rate": "Tỷ lệ bồi thường",
  payout_cap: "Giới hạn bồi thường tối đa",
  "base_policy.payout_cap": "Giới hạn bồi thường tối đa",

  // Thời gian
  coverage_duration_days: "Thời hạn bảo hiểm (ngày)",
  "base_policy.coverage_duration_days": "Thời hạn bảo hiểm (ngày)",
  enrollment_start_day: "Bắt đầu đăng ký",
  "base_policy.enrollment_start_day": "Bắt đầu đăng ký",
  enrollment_end_day: "Kết thúc đăng ký",
  "base_policy.enrollment_end_day": "Kết thúc đăng ký",
  insurance_valid_from_day: "Bảo hiểm có hiệu lực từ",
  "base_policy.insurance_valid_from_day": "Bảo hiểm có hiệu lực từ",
  insurance_valid_to_day: "Bảo hiểm có hiệu lực đến",
  "base_policy.insurance_valid_to_day": "Bảo hiểm có hiệu lực đến",

  // Validation
  document_validation_status: "Trạng thái xác thực",
  validation_status: "Trạng thái xác thực",
  validation_notes: "Ghi chú xác thực",
  total_checks: "Tổng số kiểm tra",
  passed_checks: "Số kiểm tra đạt",
  failed_checks: "Số kiểm tra lỗi",
  warning_count: "Số cảnh báo",

  // Template & Document
  template_document_url: "URL tài liệu mẫu",
  template_name: "Tên template",

  // Metadata
  created_at: "Ngày tạo",
  updated_at: "Ngày cập nhật",
  created_by: "Người tạo",
  updated_by: "Người cập nhật",

  // Trigger & Conditions
  trigger_type: "Loại kích hoạt",
  "trigger.trigger_type": "Loại kích hoạt",
  trigger_value: "Giá trị kích hoạt",
  "trigger.trigger_value": "Giá trị kích hoạt",
  logical_operator: "Toán tử logic",
  "trigger.logical_operator": "Toán tử logic",
  condition_type: "Loại điều kiện",
  "trigger.condition_type": "Loại điều kiện",
  condition_value: "Giá trị điều kiện",
  "trigger.condition_value": "Giá trị điều kiện",

  // Conditions array
  conditions: "Điều kiện kích hoạt",
  "conditions[0].threshold_value": "Ngưỡng kích hoạt 1",
  "conditions[1].threshold_value": "Ngưỡng kích hoạt 2",
  "conditions[0].condition_type": "Loại điều kiện 1",
  "conditions[1].condition_type": "Loại điều kiện 2",
  "conditions[0].comparison_operator": "Toán tử so sánh 1",
  "conditions[1].comparison_operator": "Toán tử so sánh 2",
  threshold_value: "Ngưỡng kích hoạt",
  comparison_operator: "Toán tử so sánh",

  // Other common fields
  id: "ID",
  base_policy_id: "ID chính sách cơ sở",
  partner_id: "ID đối tác",
  version: "Phiên bản",
  is_active: "Đang hoạt động",

  // Extraction parameters
  extraction_confidence: "Độ tin cậy trích xuất",
  parameters_found: "Số tham số tìm thấy",
  document_version: "Phiên bản tài liệu",
  extraction_method: "Phương thức trích xuất",
};

// Nhóm các field theo category
export const FIELD_CATEGORIES = {
  "Thông tin sản phẩm": [
    "product_name",
    "product_code",
    "product_description",
    "insurance_provider_id",
    "crop_type",
    "status",
  ],
  "Thông tin tài chính": [
    "fix_premium_amount",
    "premium_base_rate",
    "fix_payout_amount",
    "payout_base_rate",
    "payout_cap",
  ],
  "Thời gian & Hiệu lực": [
    "coverage_duration_days",
    "enrollment_start_day",
    "enrollment_end_day",
    "insurance_valid_from_day",
    "insurance_valid_to_day",
  ],
  "Xác thực & Kiểm tra": [
    "document_validation_status",
    "validation_status",
    "validation_notes",
    "total_checks",
    "passed_checks",
    "failed_checks",
    "warning_count",
  ],
  "Tài liệu & Template": [
    "template_document_url",
    "template_name",
  ],
  "Metadata": [
    "created_at",
    "updated_at",
    "created_by",
    "updated_by",
    "id",
    "base_policy_id",
    "partner_id",
    "version",
    "is_active",
  ],
};

/**
 * Lấy label tiếng Việt cho một field
 * @param {string} fieldName - Tên field
 * @returns {string} Label tiếng Việt hoặc field name nếu không tìm thấy
 */
export const getFieldLabel = (fieldName) => {
  if (!fieldName) return "";

  // Try exact match first
  if (FIELD_LABELS[fieldName]) {
    return FIELD_LABELS[fieldName];
  }

  // Try to match with array index pattern (e.g., conditions[2].threshold_value)
  // Replace specific index with [0] and try again
  const normalizedField = fieldName.replace(/\[\d+\]/g, "[0]");
  if (FIELD_LABELS[normalizedField]) {
    // Extract the index number
    const indexMatch = fieldName.match(/\[(\d+)\]/);
    const index = indexMatch ? parseInt(indexMatch[1]) + 1 : "";
    const baseLabel = FIELD_LABELS[normalizedField];

    // If the label already has a number at the end, replace it
    if (/\s\d+$/.test(baseLabel)) {
      return baseLabel.replace(/\d+$/, index);
    }

    return baseLabel;
  }

  // Try stripping base_policy. prefix
  if (fieldName.startsWith("base_policy.")) {
    const withoutPrefix = fieldName.replace("base_policy.", "");
    if (FIELD_LABELS[withoutPrefix]) {
      return FIELD_LABELS[withoutPrefix];
    }
  }

  // Try stripping trigger. prefix
  if (fieldName.startsWith("trigger.")) {
    const withoutPrefix = fieldName.replace("trigger.", "");
    if (FIELD_LABELS[withoutPrefix]) {
      return FIELD_LABELS[withoutPrefix];
    }
  }

  // Format the field name nicely as fallback
  // e.g., "base_policy.product_name" -> "Product Name"
  const formatted = fieldName
    .replace(/^(base_policy\.|trigger\.|conditions\.)/, "")
    .replace(/\[(\d+)\]/, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return formatted;
};

/**
 * Lấy danh sách options cho Select component
 * @param {string[]} excludeFields - Danh sách field cần loại trừ
 * @returns {Array} Mảng options cho Select
 */
export const getFieldOptions = (excludeFields = []) => {
  const options = [];

  Object.entries(FIELD_CATEGORIES).forEach(([category, fields]) => {
    const categoryOptions = fields
      .filter(field => !excludeFields.includes(field))
      .map(field => ({
        label: FIELD_LABELS[field] || field,
        value: field,
        category: category,
      }));

    if (categoryOptions.length > 0) {
      options.push({
        label: category,
        options: categoryOptions,
      });
    }
  });

  return options;
};

/**
 * Search fields theo keyword
 * @param {string} keyword - Từ khóa tìm kiếm
 * @returns {Array} Mảng các field phù hợp
 */
export const searchFields = (keyword) => {
  if (!keyword) return [];

  const lowerKeyword = keyword.toLowerCase();
  const results = [];

  Object.entries(FIELD_LABELS).forEach(([field, label]) => {
    if (
      field.toLowerCase().includes(lowerKeyword) ||
      label.toLowerCase().includes(lowerKeyword)
    ) {
      results.push({
        field,
        label,
        value: field,
      });
    }
  });

  return results;
};

/**
 * Component helper để render field name với tooltip
 */
export const FieldLabel = ({ fieldName, showOriginal = false }) => {
  const label = getFieldLabel(fieldName);

  if (!showOriginal || label === fieldName) {
    return label;
  }

  return (
    <span title={fieldName}>
      {label}
      <span style={{ fontSize: '11px', color: '#999', marginLeft: '4px' }}>
        ({fieldName})
      </span>
    </span>
  );
};
