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
      DATE_OF_BIRTH_TOO_YOUNG: "Người dùng phải từ 18 tuổi trở lên!",
      DATE_OF_BIRTH_TOO_OLD: "Người dùng phải dưới 80 tuổi!",
      AGE_NOT_IN_RANGE: "Độ tuổi phải từ 18 đến 80 tuổi!",
      FULL_NAME_INVALID: "Họ và tên chỉ được chứa chữ cái và khoảng trắng!",
      NATIONAL_ID_REQUIRED: "Vui lòng nhập số CCCD/CMND!",
      NATIONAL_ID_INVALID: "Số CCCD/CMND không hợp lệ! (9 hoặc 12 chữ số)",
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
      AUTH_ME_SUCCESS: "Lấy thông tin tài khoản thành công!",
    },

    ERROR: {
      // === VALIDATION ERRORS (400) ===
      VALIDATION_ERROR: "Dữ liệu nhập không hợp lệ. Vui lòng kiểm tra lại!",
      INVALID_REQUEST_FORMAT:
        "Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra và thử lại.",
      BAD_REQUEST: "Yêu cầu không hợp lệ. Vui lòng kiểm tra thông tin!",
      EMAIL_INVALID: "Email không hợp lệ!",
      PHONE_INVALID:
        "Số điện thoại không hợp lệ! (VD: 0987654321 hoặc +84987654321)",
      INVALID_PASSWORD_FORMAT: "Mật khẩu không đúng định dạng!",
      INVALID_NATIONAL_ID: "Số CCCD/CMND không hợp lệ!",

      // === AUTHENTICATION ERRORS (401) ===
      INVALID_CREDENTIALS: "Email/số điện thoại hoặc mật khẩu không đúng!",
      TOKEN_INVALID: "Token không hợp lệ. Vui lòng đăng nhập lại!",
      SESSION_EXPIRED: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
      REFRESH_TOKEN_EXPIRED:
        "Token làm mới đã hết hạn. Vui lòng đăng nhập lại!",
      REFRESH_TOKEN_INVALID:
        "Token làm mới không hợp lệ. Vui lòng đăng nhập lại!",
      AUTH_ME_FAILED:
        "Không thể lấy thông tin tài khoản. Vui lòng đăng nhập lại!",

      // Account/Profile/User not found errors
      ACCOUNT_NOT_FOUND:
        "Tài khoản không hợp lệ. Vui lòng liên hệ quản trị viên.",
      PROFILE_NOT_FOUND:
        "Không tìm thấy thông tin người dùng. Vui lòng liên hệ quản trị viên.",
      USER_NOT_FOUND:
        "Không tìm thấy người dùng. Vui lòng liên hệ quản trị viên.",
      NOT_FOUND: "Không tìm thấy dữ liệu yêu cầu!",

      // === AUTHORIZATION ERRORS (403) ===
      ACTION_FORBIDDEN:
        "Hành động không được phép. Trạng thái tài khoản không phù hợp!",
      ACCOUNT_LOCKED:
        "Tài khoản tạm thời bị khóa do nhiều lần đăng nhập thất bại!",
      ACCOUNT_BLOCKED:
        "Tài khoản tạm thời bị khóa do nhiều lần đăng nhập thất bại!",
      ACCOUNT_SUSPENDED: "Tài khoản đã bị tạm ngừng. Vui lòng liên hệ hỗ trợ!",
      ACCOUNT_DISABLED: "Tài khoản đã bị vô hiệu hóa!",
      ACCOUNT_NOT_VERIFIED:
        "Tài khoản chưa được xác thực. Vui lòng xác thực tài khoản trước!",
      ACCOUNT_EXPIRED: "Tài khoản đã hết hạn. Vui lòng gia hạn!",
      FORBIDDEN: "Truy cập bị từ chối!",
      UNAUTHORIZED: "Bạn không có quyền truy cập. Vui lòng đăng nhập lại!",

      // === CONFLICT ERRORS (409) ===
      USER_ALREADY_EXISTS:
        "Tài khoản đã tồn tại. Email hoặc số điện thoại này đã được đăng ký.",
      EMAIL_ALREADY_EXISTS:
        "Email này đã được đăng ký. Vui lòng sử dụng email khác!",
      PHONE_ALREADY_EXISTS:
        "Số điện thoại này đã được đăng ký. Vui lòng sử dụng số khác!",
      ALREADY_EXISTS: "Dữ liệu đã tồn tại!",

      // === OCR/eKYC ERRORS ===
      ALREADY_OCR_DONE: "Bạn đã hoàn thành xác minh CCCD. Không cần làm lại.",

      // === EXTERNAL API ERRORS (500) ===
      EXTERNAL_API_ERROR: "Lỗi khi xử lý eKYC. Vui lòng thử lại sau.",

      // === SERVER ERRORS (500) ===
      INTERNAL_ERROR: "Lỗi hệ thống. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
      SERVER_ERROR: "Máy chủ đang gặp sự cố. Vui lòng thử lại sau!",
      SYSTEM_ERROR: "Lỗi hệ thống. Vui lòng thử lại sau!",

      // === NETWORK ERRORS ===
      NETWORK_ERROR:
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet!",
      TIMEOUT_ERROR: "Quá thời gian chờ phản hồi. Vui lòng thử lại!",
      CORS_ERROR: "Lỗi kết nối CORS. Vui lòng liên hệ quản trị viên!",

      // === RATE LIMITING ===
      TOO_MANY_REQUESTS: "Quá nhiều yêu cầu. Vui lòng thử lại sau!",
      TOO_MANY_FAILED_ATTEMPTS:
        "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau {minutes} phút!",
      ACCOUNT_BLOCKED_TEMPORARILY:
        "Tài khoản bị khóa tạm thời. Vui lòng thử lại sau!",
      IP_BLOCKED: "IP của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ!",

      // === FILE/DATA ERRORS ===
      FILE_TOO_LARGE: "File quá lớn. Vui lòng chọn file nhỏ hơn!",
      FILE_TYPE_INVALID: "Loại file không được hỗ trợ!",
      UNSUPPORTED_FORMAT: "Định dạng không được hỗ trợ!",
      REQUEST_TOO_LARGE: "Dữ liệu gửi quá lớn!",

      // === NOT IMPLEMENTED ===
      NOT_IMPLEMENTED: "Tính năng này chưa được phát hành.",

      // === FALLBACK ===
      UNKNOWN_ERROR: "Có lỗi xảy ra. Vui lòng thử lại!",
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
 * ============================================================================
 */

/**
 * Các lỗi validation từ BE (HTTP 400)
 * Mapping error codes to Vietnamese messages
 */
const LOGIN_ERROR_CODE_MAP = {
  // Validation errors (400)
  VALIDATION_ERROR: AUTH_MESSAGES.SIGNIN.ERROR.VALIDATION_ERROR,
  INVALID_REQUEST_FORMAT: AUTH_MESSAGES.SIGNIN.ERROR.INVALID_REQUEST_FORMAT,
  BAD_REQUEST: AUTH_MESSAGES.SIGNIN.ERROR.BAD_REQUEST,

  // Authentication errors (401)
  INVALID_CREDENTIALS: AUTH_MESSAGES.SIGNIN.ERROR.INVALID_CREDENTIALS,
  INVALID_PASSWORD: AUTH_MESSAGES.SIGNIN.ERROR.INVALID_CREDENTIALS,
  TOKEN_INVALID: AUTH_MESSAGES.SIGNIN.ERROR.TOKEN_INVALID,
  SESSION_EXPIRED: AUTH_MESSAGES.SIGNIN.ERROR.SESSION_EXPIRED,

  // Authorization errors (403)
  ACTION_FORBIDDEN: AUTH_MESSAGES.SIGNIN.ERROR.ACTION_FORBIDDEN,
  ACCOUNT_BLOCKED: AUTH_MESSAGES.SIGNIN.ERROR.ACCOUNT_BLOCKED,
  ACCOUNT_LOCKED: AUTH_MESSAGES.SIGNIN.ERROR.ACCOUNT_LOCKED,
  ACCOUNT_SUSPENDED: AUTH_MESSAGES.SIGNIN.ERROR.ACCOUNT_SUSPENDED,
  ACCOUNT_DISABLED: AUTH_MESSAGES.SIGNIN.ERROR.ACCOUNT_DISABLED,
  ACCOUNT_NOT_VERIFIED: AUTH_MESSAGES.SIGNIN.ERROR.ACCOUNT_NOT_VERIFIED,

  // Not found errors (404)
  NOT_FOUND: AUTH_MESSAGES.SIGNIN.ERROR.NOT_FOUND,
  ACCOUNT_NOT_FOUND: AUTH_MESSAGES.SIGNIN.ERROR.ACCOUNT_NOT_FOUND,
  PROFILE_NOT_FOUND: AUTH_MESSAGES.SIGNIN.ERROR.PROFILE_NOT_FOUND,
  USER_NOT_FOUND: AUTH_MESSAGES.SIGNIN.ERROR.USER_NOT_FOUND,

  // Server errors (500)
  INTERNAL_ERROR: AUTH_MESSAGES.SIGNIN.ERROR.INTERNAL_ERROR,
  SERVER_ERROR: AUTH_MESSAGES.SIGNIN.ERROR.SERVER_ERROR,
};

/**
 * Các lỗi validation từ BE trong registration (HTTP 400)
 * Mapping registration error codes to Vietnamese messages
 */
const REGISTER_ERROR_CODE_MAP = {
  // Validation errors (400)
  VALIDATION_ERROR: AUTH_MESSAGES.REGISTER.ERROR.VALIDATION_ERROR,
  INVALID_REQUEST_FORMAT:
    "Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra và thử lại.",
  BAD_REQUEST: AUTH_MESSAGES.REGISTER.ERROR.VALIDATION_ERROR,

  // National ID validation errors
  INVALID_NATIONAL_ID: AUTH_MESSAGES.REGISTER.VALIDATION.NATIONAL_ID_INVALID,
  NATIONAL_ID_INVALID: AUTH_MESSAGES.REGISTER.VALIDATION.NATIONAL_ID_INVALID,

  // Email/Phone validation errors
  EMAIL_INVALID: AUTH_MESSAGES.REGISTER.VALIDATION.EMAIL_INVALID,
  PHONE_INVALID: AUTH_MESSAGES.REGISTER.VALIDATION.PHONE_INVALID,
  EMAIL_ALREADY_EXISTS: AUTH_MESSAGES.REGISTER.ERROR.EMAIL_ALREADY_EXISTS,
  PHONE_ALREADY_EXISTS: AUTH_MESSAGES.REGISTER.ERROR.PHONE_ALREADY_EXISTS,
  USER_ALREADY_EXISTS: AUTH_MESSAGES.REGISTER.ERROR.USER_ALREADY_EXISTS,

  // Password validation errors
  PASSWORD_TOO_SHORT: AUTH_MESSAGES.REGISTER.VALIDATION.PASSWORD_TOO_SHORT,
  PASSWORD_TOO_WEAK: AUTH_MESSAGES.REGISTER.VALIDATION.PASSWORD_TOO_WEAK,

  // Other validation errors
  FULL_NAME_INVALID: AUTH_MESSAGES.REGISTER.VALIDATION.FULL_NAME_INVALID,
  DATE_OF_BIRTH_INVALID:
    AUTH_MESSAGES.REGISTER.VALIDATION.DATE_OF_BIRTH_INVALID,
  DATE_OF_BIRTH_TOO_YOUNG:
    AUTH_MESSAGES.REGISTER.VALIDATION.DATE_OF_BIRTH_TOO_YOUNG,
  DATE_OF_BIRTH_TOO_OLD:
    AUTH_MESSAGES.REGISTER.VALIDATION.DATE_OF_BIRTH_TOO_OLD,

  // Conflict errors (409)
  ALREADY_EXISTS: AUTH_MESSAGES.REGISTER.ERROR.USER_ALREADY_EXISTS,

  // Server errors (500)
  INTERNAL_ERROR: AUTH_MESSAGES.REGISTER.ERROR.SERVER_ERROR,
  SERVER_ERROR: AUTH_MESSAGES.REGISTER.ERROR.SERVER_ERROR,
};

/**
 * Map error message patterns từ BE response
 * Được dùng khi BE trả về message string thay vì error code
 */
const ERROR_MESSAGE_PATTERNS = [
  {
    keywords: ["both email and phone", "provide either email or phone"],
    message: "Vui lòng chỉ nhập email hoặc số điện thoại, không nhập cả hai!",
  },
  {
    keywords: ["email or phone is required", "email hoặc phone là bắt buộc"],
    message: AUTH_MESSAGES.SIGNIN.VALIDATION.IDENTIFIER_REQUIRED,
  },
  {
    keywords: ["password is required"],
    message: AUTH_MESSAGES.SIGNIN.VALIDATION.PASSWORD_REQUIRED,
  },
  {
    keywords: [
      "password must be at least 8 characters",
      "password must be at least",
    ],
    message: AUTH_MESSAGES.SIGNIN.VALIDATION.PASSWORD_TOO_SHORT,
  },
  {
    keywords: ["invalid email format"],
    message: AUTH_MESSAGES.SIGNIN.VALIDATION.EMAIL_INVALID,
  },
  {
    keywords: ["invalid phone number format", "phone number format"],
    message: AUTH_MESSAGES.SIGNIN.VALIDATION.PHONE_INVALID,
  },
  {
    keywords: [
      "invalid password",
      "email or password incorrect",
      "phone number or password incorrect",
      "mật khẩu không đúng",
    ],
    message: AUTH_MESSAGES.SIGNIN.ERROR.INVALID_CREDENTIALS,
  },
  {
    keywords: ["action forbidden"],
    message: AUTH_MESSAGES.SIGNIN.ERROR.ACTION_FORBIDDEN,
  },
  {
    keywords: ["account blocked"],
    message: AUTH_MESSAGES.SIGNIN.ERROR.ACCOUNT_BLOCKED,
  },
  {
    keywords: [
      "user not found",
      "account not found",
      "không tìm thấy người dùng",
    ],
    message: AUTH_MESSAGES.SIGNIN.ERROR.USER_NOT_FOUND,
  },
];

/**
 * Parse error từ BE response và trả về message tiếng Việt
 * @param {Object} error - Axios error object
 * @param {string} context - Context: "signin", "register"
 * @returns {string} Message tiếng Việt
 */
export const parseBackendError = (error, context = "signin") => {
  console.log("🔍 parseBackendError:", {
    context,
    status: error?.response?.status,
    errorCode: error?.response?.data?.error?.code,
    errorMessage: error?.response?.data?.error?.message,
  });

  // === NETWORK ERROR (No response from server) ===
  if (!error.response) {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return AUTH_MESSAGES.SIGNIN.ERROR.TIMEOUT_ERROR;
    }
    if (error.message?.includes("CORS") || error.code === "ERR_NETWORK") {
      return AUTH_MESSAGES.SIGNIN.ERROR.CORS_ERROR;
    }
    return AUTH_MESSAGES.SIGNIN.ERROR.NETWORK_ERROR;
  }

  const { status, data } = error.response;
  const errorCode = data?.error?.code;
  const errorMessage = data?.error?.message || data?.message;

  // === Select appropriate error code map based on context ===
  const ERROR_CODE_MAP =
    context === "register" ? REGISTER_ERROR_CODE_MAP : LOGIN_ERROR_CODE_MAP;

  // === Priority 1: Use error.code if available ===
  if (errorCode && ERROR_CODE_MAP[errorCode]) {
    return ERROR_CODE_MAP[errorCode];
  }

  // === Priority 2: Pattern match error message ===
  if (errorMessage) {
    const lowerMessage = errorMessage.toLowerCase();
    for (const pattern of ERROR_MESSAGE_PATTERNS) {
      for (const keyword of pattern.keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          return pattern.message;
        }
      }
    }
  }

  // === Priority 3: Fallback to HTTP status code ===
  switch (status) {
    case 400:
      return context === "register"
        ? AUTH_MESSAGES.REGISTER.ERROR.VALIDATION_ERROR
        : AUTH_MESSAGES.SIGNIN.ERROR.BAD_REQUEST;
    case 401:
      return AUTH_MESSAGES.SIGNIN.ERROR.INVALID_CREDENTIALS;
    case 403:
      return AUTH_MESSAGES.SIGNIN.ERROR.ACTION_FORBIDDEN;
    case 404:
      return AUTH_MESSAGES.SIGNIN.ERROR.NOT_FOUND;
    case 409:
      return context === "register"
        ? AUTH_MESSAGES.REGISTER.ERROR.USER_ALREADY_EXISTS
        : AUTH_MESSAGES.SIGNIN.ERROR.USER_ALREADY_EXISTS;
    case 500:
      return context === "register"
        ? AUTH_MESSAGES.REGISTER.ERROR.SERVER_ERROR
        : AUTH_MESSAGES.SIGNIN.ERROR.SERVER_ERROR;
    case 503:
      return "Hệ thống đang bảo trì. Vui lòng quay lại sau!";
    default:
      return AUTH_MESSAGES.SIGNIN.ERROR.UNKNOWN_ERROR;
  }
};

/**
 * Map backend error response to Vietnamese message
 * Handles both structured error response and unstructured messages
 * @param {Object} error - Axios error object
 * @param {string} context - Context: "signin", "register"
 * @returns {Object} { message: string, code?: string, status?: number }
 */
export const mapBackendError = (error, context = "signin") => {
  const message = parseBackendError(error, context);
  const code = error.response?.data?.error?.code || null;
  const status = error.response?.status || null;

  return { message, code, status };
};

// Default exports
export default AUTH_MESSAGES;
