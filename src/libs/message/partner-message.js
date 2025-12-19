/**
 * Partner Messages - Specific messages for partner operations
 * Including partner assignment, validation errors, etc.
 */

export const PARTNER_MESSAGES = {
  // Success Messages
  SUCCESS: {
    ASSIGN_SUCCESS: "Chỉ định tài khoản thành công!",
    CREATE_SUCCESS: "Tạo thông tin đối tác bảo hiểm thành công!",
    UPDATE_SUCCESS: "Cập nhật thông tin đối tác thành công!",
    DELETION_REQUEST_CREATED: "Yêu cầu hủy đối tác đã được tạo thành công!",
    DELETION_REQUEST_REVOKED: "Đã hủy yêu cầu xóa đối tác thành công!",
    DELETION_REQUEST_APPROVED: "Yêu cầu hủy đối tác đã được phê duyệt!",
    DELETION_REQUEST_REJECTED: "Yêu cầu hủy đối tác đã bị từ chối!",
  },

  // Validation Errors - Request Body
  VALIDATION: {
    // Partner ID validations
    PARTNER_ID_REQUIRED: "Partner ID là bắt buộc!",
    PARTNER_ID_INVALID_FORMAT: "Partner ID phải có định dạng UUID hợp lệ!",
    PARTNER_NOT_FOUND: "Đối tác không tồn tại hoặc đã bị xóa!",
    PARTNER_INACTIVE: "Đối tác này đang không hoạt động hoặc bị tạm dừng!",

    // User validations
    USER_NOT_FOUND: "Người dùng không tồn tại trong hệ thống!",
    USER_ID_INVALID_FORMAT: "ID người dùng không hợp lệ!",
    USER_DEACTIVATED: "Không thể chỉ định cho tài khoản đã bị vô hiệu hóa!",

    // User assigned validations
    USER_ALREADY_HAS_PARTNER: "Người dùng này đã được chỉ định một đối tác!",
    PARTNER_ALREADY_ASSIGNED:
      "Đối tác này đã được chỉ định cho người dùng này!",

    // Required fields
    FULL_NAME_REQUIRED: "Vui lòng nhập họ và tên!",
    FULL_NAME_MIN_LENGTH: "Họ và tên phải có ít nhất 2 ký tự!",
    FULL_NAME_MAX_LENGTH: "Họ và tên không được quá 100 ký tự!",

    PHONE_REQUIRED: "Vui lòng nhập số điện thoại!",
    PHONE_INVALID_FORMAT:
      "Số điện thoại phải là số Việt Nam hợp lệ (10-11 số)!",

    NATIONALITY_REQUIRED: "Vui lòng nhập quốc tịch!",
    NATIONALITY_LENGTH: "Quốc tịch phải là 2 ký tự (VD: VN)!",

    EMAIL_INVALID_FORMAT: "Email không đúng định dạng!",

    DATE_OF_BIRTH_MIN_AGE: "Người dùng phải từ 18 tuổi trở lên!",
    DATE_OF_BIRTH_MAX_AGE: "Người dùng phải dưới 65 tuổi!",

    POSTAL_CODE_INVALID: "Mã bưu chính phải là 5-6 số!",

    DISPLAY_NAME_MIN_LENGTH: "Tên hiển thị phải có ít nhất 2 ký tự!",
    DISPLAY_NAME_MAX_LENGTH: "Tên hiển thị không được quá 50 ký tự!",
  },

  // Authentication & Authorization Errors
  AUTH: {
    UNAUTHORIZED: "Bạn không có quyền truy cập. Vui lòng đăng nhập lại!",
    FORBIDDEN: "Bạn không có quyền chỉ định tài khoản cho đối tác!",
    TOKEN_EXPIRED: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
    TOKEN_INVALID: "Token không hợp lệ. Vui lòng đăng nhập lại!",
  },

  // Business Logic Errors
  BUSINESS: {
    CONCURRENT_UPDATE:
      "Dữ liệu đã được thay đổi bởi người khác. Vui lòng làm mới và thử lại!",
    CANNOT_DOWNGRADE_ROLE: "Admin không thể hạ cấp quyền hạn của chính mình!",
    INVALID_OPERATION: "Thao tác không hợp lệ. Vui lòng thử lại!",
    OPERATION_FAILED: "Chỉ định tài khoản thất bại. Vui lòng thử lại!",
  },

  // Network & Server Errors
  NETWORK: {
    NETWORK_ERROR:
      "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet!",
    TIMEOUT_ERROR: "Quá thời gian chờ phản hồi. Vui lòng thử lại!",
    SERVER_ERROR: "Máy chủ đang gặp sự cố. Vui lòng thử lại sau!",
    GENERIC_ERROR: "Có lỗi xảy ra. Vui lòng thử lại!",
  },

  // Partner Deletion Request Messages
  DELETION: {
    // Success messages
    REQUEST_CREATED: "Yêu cầu hủy đối tác đã được gửi thành công. Bạn có thể hủy yêu cầu này trong vòng 7 ngày.",
    REQUEST_REVOKED: "Yêu cầu hủy đối tác đã được thu hồi thành công!",
    REQUEST_APPROVED: "Yêu cầu hủy đối tác đã được phê duyệt. Đối tác sẽ ngừng hoạt động sau 30 ngày.",
    REQUEST_REJECTED: "Yêu cầu hủy đối tác đã bị từ chối!",
    REQUEST_PROCESSED: "Yêu cầu đã được xử lý thành công!",

    // Validation errors
    REQUEST_ID_REQUIRED: "Mã yêu cầu là bắt buộc!",
    REQUEST_ID_INVALID: "Mã yêu cầu không hợp lệ!",
    REQUEST_NOT_FOUND: "Không tìm thấy yêu cầu hủy!",
    EXPLANATION_TOO_LONG: "Lý do phải có độ dài từ 1 đến 1000 ký tự!",
    REVIEW_NOTE_TOO_LONG: "Ghi chú phải có độ dài từ 1 đến 500 ký tự!",
    INVALID_STATUS: "Trạng thái không hợp lệ. Chỉ chấp nhận 'approved' hoặc 'rejected'!",

    // Business logic errors
    PENDING_REQUEST_EXISTS: "Đã có yêu cầu hủy đang chờ xử lý. Vui lòng hủy yêu cầu cũ trước khi tạo yêu cầu mới!",
    NOT_PARTNER_ADMIN: "Bạn không phải là quản trị viên của đối tác bảo hiểm!",
    NO_PERMISSION_TO_REVOKE: "Bạn không có quyền hủy yêu cầu này!",
    ONLY_PENDING_CAN_REVOKE: "Chỉ các yêu cầu đang chờ xử lý mới có thể bị hủy!",
    ONLY_PENDING_CAN_PROCESS: "Chỉ các yêu cầu đang chờ xử lý mới có thể được xử lý!",
    CANNOT_REVOKE_AFTER_DEADLINE: "Không thể hủy yêu cầu sau thời gian có thể hủy (7 ngày)!",
    CANNOT_PROCESS_BEFORE_DEADLINE: "Không thể xử lý yêu cầu trước khi hết thời gian có thể hủy (7 ngày)!",
    NO_DELETION_REQUESTS_FOUND: "Không tìm thấy yêu cầu hủy nào!",

    // Status labels
    STATUS_PENDING: "Đang chờ xử lý",
    STATUS_APPROVED: "Đã phê duyệt",
    STATUS_REJECTED: "Đã từ chối",
    STATUS_CANCELLED: "Đã hủy",
    STATUS_COMPLETED: "Hoàn thành",
  },
};
