/**
 * Authentication Messages - enhanced and comprehensive messages for authentication flows
 * Mapping with backend server responses
 */

export const AUTH_MESSAGES = {
  // REGISTER MESSAGES
  REGISTER: {
    SUCCESS: {
      REGISTER_SUCCESS: "Đăng ký tài khoản thành công!",
      ACCOUNT_CREATED: "Tài khoản đã được tạo thành công!",
      VERIFICATION_SENT:
        "Email xác thực đã được gửi. Vui lòng kiểm tra hộp thư!",
    },

    ERROR: {
      // Backend error codes mapping
      USER_ALREADY_EXISTS:
        "Số điện thoại này đã được đăng ký. Vui lòng sử dụng số khác!",
      EMAIL_ALREADY_EXISTS:
        "Email này đã được đăng ký. Vui lòng sử dụng email khác!",
      PHONE_ALREADY_EXISTS:
        "Số điện thoại này đã được đăng ký. Vui lòng sử dụng số khác!",

      // Validation errors
      VALIDATION_ERROR: "Dữ liệu nhập không hợp lệ. Vui lòng kiểm tra lại!",
      FULL_NAME_REQUIRED: "Vui lòng nhập họ và tên!",
      PHONE_REQUIRED: "Vui lòng nhập số điện thoại!",
      EMAIL_REQUIRED: "Vui lòng nhập email!",
      PASSWORD_REQUIRED: "Vui lòng nhập mật khẩu!",
      DATE_OF_BIRTH_REQUIRED: "Vui lòng nhập ngày sinh!",
      GENDER_REQUIRED: "Vui lòng chọn giới tính!",
      ADDRESS_REQUIRED: "Vui lòng nhập địa chỉ!",

      // Format validation
      EMAIL_INVALID: "Email không hợp lệ!",
      PHONE_INVALID:
        "Số điện thoại không hợp lệ! (VD: 0987654321 hoặc +84987654321)",
      PASSWORD_TOO_SHORT: "Mật khẩu phải có ít nhất 8 ký tự!",
      PASSWORD_TOO_WEAK: "Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn!",
      DATE_OF_BIRTH_INVALID: "Ngày sinh không hợp lệ!",

      // Server errors
      REGISTRATION_FAILED: "Đăng ký thất bại. Vui lòng thử lại!",
      SERVER_ERROR: "Máy chủ đang gặp sự cố. Vui lòng thử lại sau!",
    },

    VALIDATION: {
      FULL_NAME_REQUIRED: "Vui lòng nhập họ và tên đầy đủ!",
      PHONE_REQUIRED: "Vui lòng nhập số điện thoại!",
      EMAIL_REQUIRED: "Vui lòng nhập địa chỉ email!",
      PASSWORD_REQUIRED: "Vui lòng nhập mật khẩu!",
      PASSWORD_CONFIRM_REQUIRED: "Vui lòng xác nhận mật khẩu!",
      PASSWORD_MISMATCH: "Mật khẩu xác nhận không khớp!",
      DATE_OF_BIRTH_REQUIRED: "Vui lòng nhập ngày sinh!",
      GENDER_REQUIRED: "Vui lòng chọn giới tính!",
      ADDRESS_REQUIRED: "Vui lòng nhập địa chỉ!",
      TERMS_REQUIRED: "Vui lòng đồng ý với điều khoản sử dụng!",

      EMAIL_INVALID: "Định dạng email không hợp lệ!",
      PHONE_INVALID:
        "Số điện thoại không hợp lệ! (VD: 0987654321 hoặc +84987654321)",
      PASSWORD_TOO_SHORT: "Mật khẩu phải có ít nhất 8 ký tự!",
      PASSWORD_TOO_WEAK:
        "Mật khẩu quá yếu. Phải chứa chữ hoa, chữ thường và số!",
      DATE_OF_BIRTH_INVALID: "Ngày sinh không hợp lệ!",
      FULL_NAME_INVALID: "Họ và tên chỉ được chứa chữ cái và khoảng trắng!",
    },

    INFO: {
      REGISTERING: "Đang tạo tài khoản...",
      VERIFICATION_SENT: "Email xác thực đã được gửi đến hộp thư của bạn!",
      SMS_VERIFICATION_SENT:
        "SMS xác thực đã được gửi đến số điện thoại của bạn!",
      ACCOUNT_PENDING_VERIFICATION:
        "Tài khoản đang chờ xác thực. Vui lòng kiểm tra email/SMS!",
    },

    WARNING: {
      WEAK_PASSWORD:
        "Mật khẩu của bạn khá yếu. Khuyến nghị sử dụng mật khẩu mạnh hơn!",
      ACCOUNT_EXISTS_DIFFERENT_PROVIDER:
        "Tài khoản đã tồn tại với phương thức đăng nhập khác!",
    },
  },

  // SIGNIN MESSAGES
  SIGNIN: {
    SUCCESS: {
      LOGIN_SUCCESS: "Đăng nhập thành công!",
      LOGOUT_SUCCESS: "Đăng xuất thành công!",
      ACCOUNT_VERIFIED: "Tài khoản đã được xác thực thành công!",
      PASSWORD_CHANGED: "Mật khẩu đã được thay đổi thành công!",
      SESSION_EXTENDED: "Phiên đăng nhập đã được gia hạn!",
    },

    ERROR: {
      // Backend error codes mapping
      INVALID_CREDENTIALS: "Email/số điện thoại hoặc mật khẩu không đúng!",
      ACCOUNT_NOT_VERIFIED:
        "Tài khoản chưa được xác thực. Vui lòng xác thực tài khoản trước!",
      ACCOUNT_LOCKED:
        "Tài khoản tạm thời bị khóa do nhiều lần đăng nhập thất bại!",
      ACCOUNT_SUSPENDED: "Tài khoản đã bị tạm ngừng. Vui lòng liên hệ hỗ trợ!",
      ACCOUNT_EXPIRED: "Tài khoản đã hết hạn. Vui lòng gia hạn!",
      ACCOUNT_DISABLED: "Tài khoản đã bị vô hiệu hóa!",

      // Login attempt errors
      TOO_MANY_FAILED_ATTEMPTS:
        "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau {minutes} phút!",
      ACCOUNT_BLOCKED_TEMPORARILY:
        "Tài khoản bị khóa tạm thời. Vui lòng thử lại sau!",
      IP_BLOCKED: "IP của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ!",

      // Token specific errors
      REFRESH_TOKEN_EXPIRED:
        "Token làm mới đã hết hạn. Vui lòng đăng nhập lại!",
      REFRESH_TOKEN_INVALID:
        "Token làm mới không hợp lệ. Vui lòng đăng nhập lại!",
      SESSION_EXPIRED: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
      TOKEN_INVALID: "Token không hợp lệ. Vui lòng đăng nhập lại!",

      // Social login errors
      SOCIAL_LOGIN_FAILED:
        "Đăng nhập bằng {provider} thất bại. Vui lòng thử lại!",
      SOCIAL_ACCOUNT_NOT_LINKED: "Tài khoản {provider} chưa được liên kết!",
      SOCIAL_EMAIL_MISMATCH:
        "Email từ {provider} không khớp với tài khoản hiện tại!",
    },

    VALIDATION: {
      IDENTIFIER_REQUIRED: "Vui lòng nhập email hoặc số điện thoại!",
      EMAIL_REQUIRED: "Vui lòng nhập email!",
      PHONE_REQUIRED: "Vui lòng nhập số điện thoại!",
      PASSWORD_REQUIRED: "Vui lòng nhập mật khẩu!",
      EMAIL_INVALID: "Email không hợp lệ!",
      PHONE_INVALID:
        "Số điện thoại không hợp lệ! (VD: 0987654321 hoặc +84987654321)",
      PASSWORD_TOO_SHORT: "Mật khẩu phải có ít nhất 8 ký tự!",
      PASSWORD_TOO_WEAK: "Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn!",
      USERNAME_INVALID: "Tên đăng nhập không hợp lệ!",
      IDENTIFIER_MISSING: "Vui lòng nhập email hoặc số điện thoại!",
    },

    INFO: {
      LOGGING_IN: "Đang đăng nhập...",
      LOGOUT_CONFIRM: "Bạn có chắc chắn muốn đăng xuất?",
      SESSION_REMAINING: "Phiên đăng nhập còn {minutes} phút nữa sẽ hết hạn!",
      PASSWORD_EXPIRING:
        "Mật khẩu sẽ hết hạn trong {days} ngày. Vui lòng đổi mật khẩu!",
      ACCOUNT_LOCK_WARNING:
        "Cảnh báo: Tài khoản sẽ bị khóa sau {attempts} lần đăng nhập thất bại nữa!",
      EMAIL_VERIFICATION_SENT:
        "Email xác thực đã được gửi. Vui lòng kiểm tra hộp thư!",
      SMS_VERIFICATION_SENT:
        "SMS xác thực đã được gửi đến số điện thoại của bạn!",
    },

    WARNING: {
      PASSWORD_WILL_EXPIRE: "Mật khẩu sẽ hết hạn trong {days} ngày!",
      ACCOUNT_INACTIVE: "Tài khoản chưa được kích hoạt!",
      EMAIL_NOT_VERIFIED: "Email chưa được xác thực!",
      PHONE_NOT_VERIFIED: "Số điện thoại chưa được xác thực!",
      WEAK_PASSWORD:
        "Mật khẩu của bạn khá yếu. Khuyến nghị đổi mật khẩu mạnh hơn!",
      OLD_PASSWORD_DETECTED:
        "Bạn đang sử dụng mật khẩu cũ. Vui lòng đổi mật khẩu mới!",
      SESSION_EXPIRING: "Phiên đăng nhập sẽ hết hạn trong {minutes} phút!",
    },
  },
};

/**
 * Helper functions để dễ sử dụng
 */

// REGISTER helpers
export const getRegisterMessage = (type, key, params = {}) => {
  const category = AUTH_MESSAGES.REGISTER[type];
  if (!category || !category[key]) {
    return `Register message not found: REGISTER.${type}.${key}`;
  }

  let message = category[key];

  // Replace parameters
  Object.keys(params).forEach((param) => {
    message = message.replace(new RegExp(`{${param}}`, "g"), params[param]);
  });

  return message;
};

export const getRegisterSuccess = (key, params = {}) =>
  getRegisterMessage("SUCCESS", key, params);
export const getRegisterError = (key, params = {}) =>
  getRegisterMessage("ERROR", key, params);
export const getRegisterValidation = (key, params = {}) =>
  getRegisterMessage("VALIDATION", key, params);
export const getRegisterInfo = (key, params = {}) =>
  getRegisterMessage("INFO", key, params);
export const getRegisterWarning = (key, params = {}) =>
  getRegisterMessage("WARNING", key, params);

// SIGNIN helpers
export const getSignInMessage = (type, key, params = {}) => {
  const category = AUTH_MESSAGES.SIGNIN[type];
  if (!category || !category[key]) {
    return `SignIn message not found: SIGNIN.${type}.${key}`;
  }

  let message = category[key];

  // Replace parameters
  Object.keys(params).forEach((param) => {
    message = message.replace(new RegExp(`{${param}}`, "g"), params[param]);
  });

  return message;
};

export const getSignInSuccess = (key, params = {}) =>
  getSignInMessage("SUCCESS", key, params);
export const getSignInError = (key, params = {}) =>
  getSignInMessage("ERROR", key, params);
export const getSignInValidation = (key, params = {}) =>
  getSignInMessage("VALIDATION", key, params);
export const getSignInInfo = (key, params = {}) =>
  getSignInMessage("INFO", key, params);
export const getSignInWarning = (key, params = {}) =>
  getSignInMessage("WARNING", key, params);

// Helper để lấy icon từ message (lấy ký tự đầu tiên nếu là emoji)
export const getAuthMessageIcon = (section, type, key) => {
  const category = AUTH_MESSAGES[section]?.[type];
  if (!category || !category[key]) {
    return "";
  }

  const message = category[key];
  // Lấy emoji đầu tiên trong message
  const emojiMatch = message.match(
    /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u
  );
  return emojiMatch ? emojiMatch[0] : "";
};

// Helper để lấy type dựa trên category
export const getAuthMessageType = (section, type, key) => {
  // Map category sang type
  const typeMapping = {
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info",
    VALIDATION: "error", // validation errors thường là error type
  };

  return typeMapping[type] || "info";
};

// Helper để tách riêng icon và text
export const splitAuthMessage = (section, type, key) => {
  const message =
    section === "REGISTER"
      ? getRegisterMessage(type, key)
      : getSignInMessage(type, key);
  const icon = getAuthMessageIcon(section, type, key);
  const text = message.replace(icon, "").trim();

  return {
    icon,
    text,
    fullMessage: message,
    type: getAuthMessageType(section, type, key),
  };
};

// Backward compatibility - giữ nguyên các function cũ
export const getSignInMessageIcon = (type, key) =>
  getAuthMessageIcon("SIGNIN", type, key);
export const getSignInMessageType = (type, key) =>
  getAuthMessageType("SIGNIN", type, key);
export const splitSignInMessage = (type, key) =>
  splitAuthMessage("SIGNIN", type, key);

/**
 * ============================================================================
 * BACKEND ERROR MAPPING - Ánh xạ mã lỗi từ Backend sang message tiếng Việt
 * Dựa trên AUTH_SERVICE.md documentation
 * ============================================================================
 */

/**
 * Map mã lỗi từ Backend sang message tiếng Việt
 * @param {string} errorCode - Mã lỗi từ BE (VD: "INVALID_CREDENTIALS", "USER_ALREADY_EXISTS")
 * @param {string} context - Context: "signin", "register", "general"
 * @returns {string} Message tiếng Việt
 */
export const mapBackendErrorCode = (errorCode, context = "general") => {
  // Mapping table dựa trên AUTH_SERVICE.md và sử dụng AUTH_MESSAGES đã có
  const ERROR_CODE_MAP = {
    // === VALIDATION ERRORS (400) ===
    INVALID_REQUEST_FORMAT: "Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra và thử lại.",
    VALIDATION_ERROR: context === "register"
      ? AUTH_MESSAGES.REGISTER.ERROR.VALIDATION_ERROR
      : "Dữ liệu nhập không hợp lệ. Vui lòng kiểm tra lại!",
    BAD_REQUEST: "Yêu cầu không hợp lệ. Vui lòng kiểm tra thông tin!",

    // Email/Phone/Password specific
    INVALID_EMAIL: AUTH_MESSAGES.REGISTER.ERROR.EMAIL_INVALID,
    INVALID_PHONE: AUTH_MESSAGES.REGISTER.ERROR.PHONE_INVALID,
    INVALID_PASSWORD_FORMAT: "Mật khẩu không đúng định dạng!",
    INVALID_NATIONAL_ID: "Số CCCD/CMND không hợp lệ!",

    // === AUTHENTICATION ERRORS (401) ===
    INVALID_CREDENTIALS: AUTH_MESSAGES.SIGNIN.ERROR.INVALID_CREDENTIALS,
    TOKEN_INVALID: AUTH_MESSAGES.SIGNIN.ERROR.TOKEN_INVALID,
    SESSION_EXPIRED: AUTH_MESSAGES.SIGNIN.ERROR.SESSION_EXPIRED,
    REFRESH_TOKEN_EXPIRED: AUTH_MESSAGES.SIGNIN.ERROR.REFRESH_TOKEN_EXPIRED,
    REFRESH_TOKEN_INVALID: AUTH_MESSAGES.SIGNIN.ERROR.REFRESH_TOKEN_INVALID,

    // === AUTHORIZATION ERRORS (403) ===
    ACTION_FORBIDDEN: "Hành động không được phép. Trạng thái tài khoản không phù hợp!",
    ACCOUNT_BLOCKED: AUTH_MESSAGES.SIGNIN.ERROR.ACCOUNT_LOCKED,
    ACCOUNT_LOCKED: AUTH_MESSAGES.SIGNIN.ERROR.ACCOUNT_LOCKED,
    ACCOUNT_SUSPENDED: AUTH_MESSAGES.SIGNIN.ERROR.ACCOUNT_SUSPENDED,
    ACCOUNT_DISABLED: AUTH_MESSAGES.SIGNIN.ERROR.ACCOUNT_DISABLED,
    FORBIDDEN: "Truy cập bị từ chối!",
    UNAUTHORIZED: "Bạn không có quyền truy cập. Vui lòng đăng nhập lại!",

    // === CONFLICT ERRORS (409) ===
    USER_ALREADY_EXISTS: AUTH_MESSAGES.REGISTER.ERROR.USER_ALREADY_EXISTS,
    EMAIL_ALREADY_EXISTS: AUTH_MESSAGES.REGISTER.ERROR.EMAIL_ALREADY_EXISTS,
    PHONE_ALREADY_EXISTS: AUTH_MESSAGES.REGISTER.ERROR.PHONE_ALREADY_EXISTS,
    ALREADY_EXISTS: "Dữ liệu đã tồn tại!",

    // === OCR/eKYC ERRORS ===
    ALREADY_OCR_DONE: "Bạn đã hoàn thành xác minh CCCD. Không cần làm lại.",
    ACCOUNT_NOT_VERIFIED: AUTH_MESSAGES.SIGNIN.ERROR.ACCOUNT_NOT_VERIFIED,

    // === EXTERNAL API ERRORS (500) ===
    EXTERNAL_API_ERROR: "Lỗi khi xử lý eKYC. Vui lòng thử lại sau.",

    // === SERVER ERRORS (500) ===
    INTERNAL_ERROR: "Lỗi hệ thống. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
    SERVER_ERROR: AUTH_MESSAGES.REGISTER.ERROR.SERVER_ERROR,
    SYSTEM_ERROR: "Lỗi hệ thống. Vui lòng thử lại sau!",
    UNKNOWN_ERROR: "Lỗi không xác định. Vui lòng liên hệ hỗ trợ!",
    GENERIC_ERROR: "Có lỗi xảy ra. Vui lòng thử lại!",

    // === NETWORK ERRORS ===
    NETWORK_ERROR: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet!",
    TIMEOUT_ERROR: "Quá thời gian chờ phản hồi. Vui lòng thử lại!",
    MAINTENANCE_ERROR: "Hệ thống đang bảo trì. Vui lòng quay lại sau!",

    // === RATE LIMITING ===
    TOO_MANY_REQUESTS: "Quá nhiều yêu cầu. Vui lòng thử lại sau!",
    TOO_MANY_FAILED_ATTEMPTS: AUTH_MESSAGES.SIGNIN.ERROR.TOO_MANY_FAILED_ATTEMPTS,
    ACCOUNT_BLOCKED_TEMPORARILY: AUTH_MESSAGES.SIGNIN.ERROR.ACCOUNT_BLOCKED_TEMPORARILY,
    IP_BLOCKED: AUTH_MESSAGES.SIGNIN.ERROR.IP_BLOCKED,

    // === FILE ERRORS ===
    FILE_TOO_LARGE: "File quá lớn. Vui lòng chọn file nhỏ hơn!",
    FILE_TYPE_INVALID: "Loại file không được hỗ trợ!",
    UPLOAD_FAILED: "Upload file thất bại. Vui lòng thử lại!",
    REQUEST_TOO_LARGE: "Dữ liệu gửi quá lớn!",
    UNSUPPORTED_FORMAT: "Định dạng không được hỗ trợ!",

    // === DATA ERRORS ===
    NOT_FOUND: "Không tìm thấy dữ liệu yêu cầu!",
    DATA_INVALID: "Dữ liệu không hợp lệ!",
    REQUIRED_FIELD: "Trường này là bắt buộc!",

    // === NOT IMPLEMENTED ===
    NOT_IMPLEMENTED: "Tính năng này chưa được phát hành.",
  };

  return ERROR_CODE_MAP[errorCode] || "Có lỗi xảy ra. Vui lòng thử lại!";
};

/**
 * Map error message từ BE (string-based detection) sang Vietnamese
 * Hàm này xử lý các trường hợp BE không trả error code mà chỉ trả message
 * @param {string} errorMessage - Error message từ BE
 * @param {string} context - Context: "signin", "register", "general"
 * @returns {string} Message tiếng Việt
 */
export const mapBackendErrorMessage = (errorMessage, context = "general") => {
  if (!errorMessage) return "Có lỗi xảy ra. Vui lòng thử lại!";

  const lowerMessage = errorMessage.toLowerCase();

  // Password errors
  if (lowerMessage.includes("password must be at least")) {
    return context === "signin"
      ? AUTH_MESSAGES.SIGNIN.VALIDATION.PASSWORD_TOO_SHORT
      : AUTH_MESSAGES.REGISTER.VALIDATION.PASSWORD_TOO_SHORT;
  }
  if (lowerMessage.includes("password is required")) {
    return context === "signin"
      ? AUTH_MESSAGES.SIGNIN.VALIDATION.PASSWORD_REQUIRED
      : AUTH_MESSAGES.REGISTER.VALIDATION.PASSWORD_REQUIRED;
  }
  if (lowerMessage.includes("password format") || lowerMessage.includes("invalid password")) {
    return "Mật khẩu không đúng định dạng!";
  }

  // Email errors
  if (lowerMessage.includes("email is required")) {
    return context === "signin"
      ? AUTH_MESSAGES.SIGNIN.VALIDATION.EMAIL_REQUIRED
      : AUTH_MESSAGES.REGISTER.VALIDATION.EMAIL_REQUIRED;
  }
  if (lowerMessage.includes("invalid email format")) {
    return context === "signin"
      ? AUTH_MESSAGES.SIGNIN.VALIDATION.EMAIL_INVALID
      : AUTH_MESSAGES.REGISTER.VALIDATION.EMAIL_INVALID;
  }
  if (lowerMessage.includes("email") && lowerMessage.includes("exist")) {
    return AUTH_MESSAGES.REGISTER.ERROR.EMAIL_ALREADY_EXISTS;
  }

  // Phone errors
  if (lowerMessage.includes("phone is required")) {
    return context === "signin"
      ? AUTH_MESSAGES.SIGNIN.VALIDATION.PHONE_REQUIRED
      : AUTH_MESSAGES.REGISTER.VALIDATION.PHONE_REQUIRED;
  }
  if (lowerMessage.includes("invalid phone number format")) {
    return context === "signin"
      ? AUTH_MESSAGES.SIGNIN.VALIDATION.PHONE_INVALID
      : AUTH_MESSAGES.REGISTER.VALIDATION.PHONE_INVALID;
  }
  if (lowerMessage.includes("phone") && lowerMessage.includes("exist")) {
    return AUTH_MESSAGES.REGISTER.ERROR.PHONE_ALREADY_EXISTS;
  }

  // Login specific errors
  if (lowerMessage.includes("provide either email or phone, not both")) {
    return "Vui lòng chỉ nhập email hoặc số điện thoại, không nhập cả hai!";
  }
  if (lowerMessage.includes("email or phone is required")) {
    return AUTH_MESSAGES.SIGNIN.VALIDATION.IDENTIFIER_REQUIRED;
  }
  if (lowerMessage.includes("email or password incorrect") ||
      lowerMessage.includes("phone number or password incorrect")) {
    return AUTH_MESSAGES.SIGNIN.ERROR.INVALID_CREDENTIALS;
  }

  // Account status errors
  if (lowerMessage.includes("action forbidden")) {
    return "Hành động không được phép. Trạng thái tài khoản không phù hợp!";
  }
  if (lowerMessage.includes("account blocked")) {
    return AUTH_MESSAGES.SIGNIN.ERROR.ACCOUNT_LOCKED;
  }
  if (lowerMessage.includes("account locked")) {
    return AUTH_MESSAGES.SIGNIN.ERROR.ACCOUNT_LOCKED;
  }

  // Registration errors
  if (lowerMessage.includes("national id is required")) {
    return "Vui lòng nhập số CCCD/CMND!";
  }
  if (lowerMessage.includes("cccd format")) {
    return "Số CCCD/CMND không hợp lệ!";
  }

  // Generic errors
  if (lowerMessage.includes("login failed")) {
    return AUTH_MESSAGES.SIGNIN.ERROR.INVALID_CREDENTIALS;
  }
  if (lowerMessage.includes("registration failed")) {
    return AUTH_MESSAGES.REGISTER.ERROR.REGISTRATION_FAILED;
  }

  // Default fallback
  return "Có lỗi xảy ra. Vui lòng thử lại!";
};

/**
 * Parse error từ axios response và trả về message tiếng Việt
 * @param {object} error - Axios error object
 * @param {string} context - Context: "signin", "register", "general"
 * @returns {string} Message tiếng Việt
 */
export const parseBackendError = (error, context = "general") => {
  // Network error (không có response từ server)
  if (!error.response) {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return "Quá thời gian chờ phản hồi. Vui lòng thử lại!";
    }
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet!";
  }

  const { status, data } = error.response;

  // BE trả error code trong response.data.error.code
  if (data?.error?.code) {
    return mapBackendErrorCode(data.error.code, context);
  }

  // BE trả error message trong response.data.error.message
  if (data?.error?.message) {
    return mapBackendErrorMessage(data.error.message, context);
  }

  // BE trả message trực tiếp trong response.data.message
  if (data?.message) {
    return mapBackendErrorMessage(data.message, context);
  }

  // Fallback dựa trên HTTP status code
  switch (status) {
    case 400:
      return "Dữ liệu nhập không hợp lệ. Vui lòng kiểm tra lại!";
    case 401:
      return context === "signin"
        ? AUTH_MESSAGES.SIGNIN.ERROR.INVALID_CREDENTIALS
        : "Bạn không có quyền truy cập. Vui lòng đăng nhập lại!";
    case 403:
      return "Truy cập bị từ chối!";
    case 404:
      return "Không tìm thấy dữ liệu yêu cầu!";
    case 409:
      return context === "register"
        ? AUTH_MESSAGES.REGISTER.ERROR.USER_ALREADY_EXISTS
        : "Dữ liệu đã tồn tại!";
    case 422:
      return "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!";
    case 429:
      return "Quá nhiều yêu cầu. Vui lòng thử lại sau!";
    case 500:
      return AUTH_MESSAGES.REGISTER.ERROR.SERVER_ERROR;
    case 501:
      return "Tính năng này chưa được phát hành.";
    case 503:
      return "Hệ thống đang bảo trì. Vui lòng quay lại sau!";
    default:
      return "Có lỗi xảy ra. Vui lòng thử lại!";
  }
};

/**
 * Map success action sang message tiếng Việt
 * @param {string} action - Action: "login", "register", "logout", etc.
 * @returns {string} Success message tiếng Việt
 */
export const mapBackendSuccessMessage = (action) => {
  const SUCCESS_MAP = {
    login: AUTH_MESSAGES.SIGNIN.SUCCESS.LOGIN_SUCCESS,
    signin: AUTH_MESSAGES.SIGNIN.SUCCESS.LOGIN_SUCCESS,
    logout: AUTH_MESSAGES.SIGNIN.SUCCESS.LOGOUT_SUCCESS,
    signout: AUTH_MESSAGES.SIGNIN.SUCCESS.LOGOUT_SUCCESS,
    register: AUTH_MESSAGES.REGISTER.SUCCESS.REGISTER_SUCCESS,
    signup: AUTH_MESSAGES.REGISTER.SUCCESS.REGISTER_SUCCESS,
    verify_email: "Email đã được xác thực thành công!",
    verify_phone: "Số điện thoại đã được xác thực thành công!",
    change_password: AUTH_MESSAGES.SIGNIN.SUCCESS.PASSWORD_CHANGED,
    reset_password: "Mật khẩu đã được đặt lại thành công!",
    update_profile: "Cập nhật thông tin thành công!",
    default: "Thao tác thành công!",
  };

  return SUCCESS_MAP[action] || SUCCESS_MAP.default;
};

// Default exports
export default AUTH_MESSAGES;
