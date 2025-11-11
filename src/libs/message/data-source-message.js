/**
 * Data Source / Data Tier / Data Tier Category Messages
 * Message tiếng Việt cho validation và error handling
 * Dựa trên data_source_tier_category_api.md documentation
 */

export const DATA_SOURCE_MESSAGES = {
  // === DATA SOURCE MESSAGES ===
  DATA_SOURCE: {
    SUCCESS: {
      CREATE_SUCCESS: "Tạo nguồn dữ liệu thành công!",
      UPDATE_SUCCESS: "Cập nhật nguồn dữ liệu thành công!",
      DELETE_SUCCESS: "Xóa nguồn dữ liệu thành công!",
      ACTIVATE_SUCCESS: "Kích hoạt nguồn dữ liệu thành công!",
      DEACTIVATE_SUCCESS: "Vô hiệu hóa nguồn dữ liệu thành công!",
      BATCH_CREATE_SUCCESS: "Tạo nhiều nguồn dữ liệu thành công!",
    },

    ERROR: {
      // Backend error codes
      INVALID_REQUEST: "Dữ liệu yêu cầu không hợp lệ!",
      VALIDATION_FAILED: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!",
      CREATION_FAILED: "Tạo nguồn dữ liệu thất bại!",
      BATCH_CREATION_FAILED: "Tạo nhiều nguồn dữ liệu thất bại!",
      INVALID_ID: "Định dạng ID không hợp lệ!",
      NOT_FOUND: "Không tìm thấy nguồn dữ liệu!",
      FETCH_FAILED: "Lỗi khi lấy dữ liệu!",
      UPDATE_FAILED: "Cập nhật nguồn dữ liệu thất bại!",
      DELETE_FAILED: "Xóa nguồn dữ liệu thất bại!",
      ACTIVATION_FAILED: "Kích hoạt nguồn dữ liệu thất bại!",
      DEACTIVATION_FAILED: "Vô hiệu hóa nguồn dữ liệu thất bại!",
      INVALID_PARAMETER: "Tham số không hợp lệ!",
      CHECK_FAILED: "Kiểm tra dữ liệu thất bại!",
      COUNT_FAILED: "Lỗi khi đếm số lượng!",
      DATA_SOURCE_NOT_EXIST: "Nguồn dữ liệu không tồn tại!",
      DATA_TIER_NOT_FOUND: "Không tìm thấy cấp độ dữ liệu!",
    },

    VALIDATION: {
      // Data source type
      DATA_SOURCE_TYPE_REQUIRED: "Vui lòng chọn loại nguồn dữ liệu!",
      DATA_SOURCE_TYPE_INVALID: "Loại nguồn dữ liệu không hợp lệ!",

      // Parameter name
      PARAMETER_NAME_REQUIRED: "Vui lòng nhập tên tham số!",
      PARAMETER_NAME_TOO_LONG: "Tên tham số không được vượt quá 100 ký tự!",
      PARAMETER_NAME_EMPTY: "Tên tham số không được để trống!",

      // Parameter type
      PARAMETER_TYPE_REQUIRED: "Vui lòng chọn loại tham số!",
      PARAMETER_TYPE_INVALID: "Loại tham số không hợp lệ!",

      // Base cost
      BASE_COST_REQUIRED: "Vui lòng nhập chi phí cơ bản!",
      BASE_COST_INVALID: "Chi phí cơ bản phải là số!",
      BASE_COST_NEGATIVE: "Chi phí cơ bản không được âm!",

      // Data tier
      DATA_TIER_ID_REQUIRED: "Vui lòng chọn cấp độ dữ liệu!",
      DATA_TIER_ID_INVALID: "ID cấp độ dữ liệu không hợp lệ!",

      // Min/Max value
      MIN_MAX_INVALID: "Giá trị tối thiểu phải nhỏ hơn hoặc bằng giá trị tối đa!",

      // Accuracy rating
      ACCURACY_RATING_INVALID: "Độ chính xác phải từ 0 đến 100!",

      // URL
      API_ENDPOINT_INVALID: "URL API không hợp lệ!",

      // Display name and description
      DISPLAY_NAME_REQUIRED: "Vui lòng nhập tên hiển thị!",
      DISPLAY_NAME_TOO_LONG: "Tên hiển thị không được vượt quá 200 ký tự!",
      DESCRIPTION_TOO_LONG: "Mô tả không được vượt quá 500 ký tự!",

      // Unit
      UNIT_TOO_LONG: "Đơn vị không được vượt quá 50 ký tự!",

      // Batch
      BATCH_SIZE_EXCEEDED: "Số lượng nguồn dữ liệu không được vượt quá 100!",
      BATCH_SIZE_EMPTY: "Phải có ít nhất 1 nguồn dữ liệu!",

      // Update frequency
      UPDATE_FREQUENCY_REQUIRED: "Vui lòng chọn tần suất cập nhật!",
    },

    INFO: {
      LOADING: "Đang tải nguồn dữ liệu...",
      CREATING: "Đang tạo nguồn dữ liệu...",
      UPDATING: "Đang cập nhật nguồn dữ liệu...",
      DELETING: "Đang xóa nguồn dữ liệu...",
    },
  },

  // === DATA TIER CATEGORY MESSAGES ===
  TIER_CATEGORY: {
    SUCCESS: {
      CREATE_SUCCESS: "Tạo danh mục cấp độ thành công!",
      UPDATE_SUCCESS: "Cập nhật danh mục cấp độ thành công!",
      DELETE_SUCCESS: "Xóa danh mục cấp độ thành công!",
    },

    ERROR: {
      NOT_FOUND: "Không tìm thấy danh mục cấp độ!",
      CREATION_FAILED: "Tạo danh mục cấp độ thất bại!",
      UPDATE_FAILED: "Cập nhật danh mục cấp độ thất bại!",
      DELETE_FAILED: "Xóa danh mục cấp độ thất bại!",
      CATEGORY_NOT_EXIST: "Danh mục với ID này không tồn tại!",
      FETCH_FAILED: "Lỗi khi lấy danh mục cấp độ!",
    },

    VALIDATION: {
      CATEGORY_NAME_REQUIRED: "Vui lòng nhập tên danh mục!",
      CATEGORY_NAME_TOO_LONG: "Tên danh mục không được vượt quá 100 ký tự!",

      CATEGORY_MULTIPLIER_REQUIRED: "Vui lòng nhập hệ số nhân danh mục!",
      CATEGORY_MULTIPLIER_INVALID: "Hệ số nhân danh mục phải là số dương!",
      CATEGORY_MULTIPLIER_OUT_OF_RANGE: "Hệ số nhân danh mục phải lớn hơn 0 và không quá 100!",

      CATEGORY_DESCRIPTION_TOO_LONG: "Mô tả danh mục không được vượt quá 500 ký tự!",
    },

    INFO: {
      LOADING: "Đang tải danh mục cấp độ...",
      CREATING: "Đang tạo danh mục cấp độ...",
      UPDATING: "Đang cập nhật danh mục cấp độ...",
      DELETING: "Đang xóa danh mục cấp độ...",
    },
  },

  // === DATA TIER MESSAGES ===
  TIER: {
    SUCCESS: {
      CREATE_SUCCESS: "Tạo cấp độ dữ liệu thành công!",
      UPDATE_SUCCESS: "Cập nhật cấp độ dữ liệu thành công!",
      DELETE_SUCCESS: "Xóa cấp độ dữ liệu thành công!",
    },

    ERROR: {
      NOT_FOUND: "Không tìm thấy cấp độ dữ liệu!",
      CREATION_FAILED: "Tạo cấp độ dữ liệu thất bại!",
      UPDATE_FAILED: "Cập nhật cấp độ dữ liệu thất bại!",
      DELETE_FAILED: "Xóa cấp độ dữ liệu thất bại!",
      TIER_LEVEL_EXISTS: "Cấp độ này đã tồn tại trong danh mục!",
      CATEGORY_NOT_EXIST: "Danh mục cấp độ không tồn tại!",
      FETCH_FAILED: "Lỗi khi lấy cấp độ dữ liệu!",
      CALCULATION_FAILED: "Lỗi khi tính toán hệ số nhân!",
    },

    VALIDATION: {
      CATEGORY_ID_REQUIRED: "Vui lòng chọn danh mục cấp độ!",
      CATEGORY_ID_INVALID: "ID danh mục không hợp lệ!",

      TIER_LEVEL_REQUIRED: "Vui lòng nhập cấp độ!",
      TIER_LEVEL_INVALID: "Cấp độ phải là số nguyên!",
      TIER_LEVEL_OUT_OF_RANGE: "Cấp độ phải từ 1 đến 100!",

      TIER_NAME_REQUIRED: "Vui lòng nhập tên cấp độ!",
      TIER_NAME_TOO_LONG: "Tên cấp độ không được vượt quá 100 ký tự!",

      TIER_MULTIPLIER_REQUIRED: "Vui lòng nhập hệ số nhân cấp độ!",
      TIER_MULTIPLIER_INVALID: "Hệ số nhân cấp độ phải là số dương!",
      TIER_MULTIPLIER_OUT_OF_RANGE: "Hệ số nhân cấp độ phải lớn hơn 0 và không quá 100!",
    },

    INFO: {
      LOADING: "Đang tải cấp độ dữ liệu...",
      CREATING: "Đang tạo cấp độ dữ liệu...",
      UPDATING: "Đang cập nhật cấp độ dữ liệu...",
      DELETING: "Đang xóa cấp độ dữ liệu...",
    },
  },
};

/**
 * Helper functions để lấy message theo section, type và key
 */
export const getDataSourceMessage = (section, type, key, params = {}) => {
  const sectionData = DATA_SOURCE_MESSAGES[section];
  if (!sectionData) {
    return `Message section not found: ${section}`;
  }

  const category = sectionData[type];
  if (!category || !category[key]) {
    return `Message not found: ${section}.${type}.${key}`;
  }

  let message = category[key];

  // Replace parameters
  Object.keys(params).forEach((param) => {
    message = message.replace(new RegExp(`{${param}}`, "g"), params[param]);
  });

  return message;
};

// Data Source helpers
export const getDataSourceSuccess = (key, params = {}) =>
  getDataSourceMessage("DATA_SOURCE", "SUCCESS", key, params);
export const getDataSourceError = (key, params = {}) =>
  getDataSourceMessage("DATA_SOURCE", "ERROR", key, params);
export const getDataSourceValidation = (key, params = {}) =>
  getDataSourceMessage("DATA_SOURCE", "VALIDATION", key, params);
export const getDataSourceInfo = (key, params = {}) =>
  getDataSourceMessage("DATA_SOURCE", "INFO", key, params);

// Tier Category helpers
export const getTierCategorySuccess = (key, params = {}) =>
  getDataSourceMessage("TIER_CATEGORY", "SUCCESS", key, params);
export const getTierCategoryError = (key, params = {}) =>
  getDataSourceMessage("TIER_CATEGORY", "ERROR", key, params);
export const getTierCategoryValidation = (key, params = {}) =>
  getDataSourceMessage("TIER_CATEGORY", "VALIDATION", key, params);
export const getTierCategoryInfo = (key, params = {}) =>
  getDataSourceMessage("TIER_CATEGORY", "INFO", key, params);

// Tier helpers
export const getTierSuccess = (key, params = {}) =>
  getDataSourceMessage("TIER", "SUCCESS", key, params);
export const getTierError = (key, params = {}) =>
  getDataSourceMessage("TIER", "ERROR", key, params);
export const getTierValidation = (key, params = {}) =>
  getDataSourceMessage("TIER", "VALIDATION", key, params);
export const getTierInfo = (key, params = {}) =>
  getDataSourceMessage("TIER", "INFO", key, params);

/**
 * Map Backend error code/message sang message tiếng Việt
 * Tương tự parseBackendError cho auth
 */
export const parseDataSourceError = (error, context = "data_source") => {
  // Network error
  if (!error.response) {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return "Quá thời gian chờ phản hồi. Vui lòng thử lại!";
    }
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet!";
  }

  const { status, data } = error.response;
  const lowerMessage = (data?.error?.message || data?.message || "").toLowerCase();

  // Backend error code mapping
  if (data?.error?.code) {
    const code = data.error.code;
    switch (code) {
      case "INVALID_REQUEST":
      case "VALIDATION_FAILED":
        return context === "tier_category"
          ? DATA_SOURCE_MESSAGES.TIER_CATEGORY.ERROR.VALIDATION_FAILED
          : context === "tier"
          ? "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!"
          : DATA_SOURCE_MESSAGES.DATA_SOURCE.ERROR.VALIDATION_FAILED;
      case "NOT_FOUND":
        return context === "tier_category"
          ? DATA_SOURCE_MESSAGES.TIER_CATEGORY.ERROR.NOT_FOUND
          : context === "tier"
          ? DATA_SOURCE_MESSAGES.TIER.ERROR.NOT_FOUND
          : DATA_SOURCE_MESSAGES.DATA_SOURCE.ERROR.NOT_FOUND;
      case "CREATION_FAILED":
        return context === "tier_category"
          ? DATA_SOURCE_MESSAGES.TIER_CATEGORY.ERROR.CREATION_FAILED
          : context === "tier"
          ? DATA_SOURCE_MESSAGES.TIER.ERROR.CREATION_FAILED
          : DATA_SOURCE_MESSAGES.DATA_SOURCE.ERROR.CREATION_FAILED;
      case "UPDATE_FAILED":
        return context === "tier_category"
          ? DATA_SOURCE_MESSAGES.TIER_CATEGORY.ERROR.UPDATE_FAILED
          : context === "tier"
          ? DATA_SOURCE_MESSAGES.TIER.ERROR.UPDATE_FAILED
          : DATA_SOURCE_MESSAGES.DATA_SOURCE.ERROR.UPDATE_FAILED;
      case "DELETE_FAILED":
        return context === "tier_category"
          ? DATA_SOURCE_MESSAGES.TIER_CATEGORY.ERROR.DELETE_FAILED
          : context === "tier"
          ? DATA_SOURCE_MESSAGES.TIER.ERROR.DELETE_FAILED
          : DATA_SOURCE_MESSAGES.DATA_SOURCE.ERROR.DELETE_FAILED;
      default:
        break;
    }
  }

  // Message-based detection
  if (lowerMessage.includes("parameter name cannot be empty")) {
    return DATA_SOURCE_MESSAGES.DATA_SOURCE.VALIDATION.PARAMETER_NAME_EMPTY;
  }
  if (lowerMessage.includes("tier level") && lowerMessage.includes("already exists")) {
    return DATA_SOURCE_MESSAGES.TIER.ERROR.TIER_LEVEL_EXISTS;
  }
  if (lowerMessage.includes("category") && lowerMessage.includes("does not exist")) {
    return DATA_SOURCE_MESSAGES.TIER.ERROR.CATEGORY_NOT_EXIST;
  }
  if (lowerMessage.includes("invalid uuid")) {
    return DATA_SOURCE_MESSAGES.DATA_SOURCE.ERROR.INVALID_ID;
  }
  // PostgreSQL numeric field overflow - phát hiện khi giá trị vượt quá giới hạn
  if (lowerMessage.includes("numeric field overflow")) {
    if (context === "tier_category") {
      return DATA_SOURCE_MESSAGES.TIER_CATEGORY.VALIDATION.CATEGORY_MULTIPLIER_OUT_OF_RANGE;
    } else if (context === "tier") {
      return DATA_SOURCE_MESSAGES.TIER.VALIDATION.TIER_MULTIPLIER_OUT_OF_RANGE;
    }
    return "Giá trị số vượt quá giới hạn cho phép!";
  }

  // HTTP status fallback
  switch (status) {
    case 400:
    case 422:
      return "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!";
    case 404:
      return context === "tier_category"
        ? DATA_SOURCE_MESSAGES.TIER_CATEGORY.ERROR.NOT_FOUND
        : context === "tier"
        ? DATA_SOURCE_MESSAGES.TIER.ERROR.NOT_FOUND
        : DATA_SOURCE_MESSAGES.DATA_SOURCE.ERROR.NOT_FOUND;
    case 409:
      return DATA_SOURCE_MESSAGES.TIER.ERROR.TIER_LEVEL_EXISTS;
    case 500:
      return "Máy chủ đang gặp sự cố. Vui lòng thử lại sau!";
    default:
      return "Có lỗi xảy ra. Vui lòng thử lại!";
  }
};

// Export default
export default DATA_SOURCE_MESSAGES;
