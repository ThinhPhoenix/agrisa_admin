export const claimMessage = {
  // Success messages
  success: {
    fetchList: "Tải danh sách bồi thường thành công",
    fetchDetail: "Tải chi tiết bồi thường thành công",
    deleteClaim: "Xóa bồi thường thành công",
  },

  // Error messages
  error: {
    fetchList: "Không thể tải danh sách bồi thường",
    fetchDetail: "Không thể tải chi tiết bồi thường",
    invalidClaimId: "Mã bồi thường không hợp lệ",
    notFound: "Không tìm thấy yêu cầu bồi thường",
    unauthorized: "Bạn không có quyền thực hiện thao tác này",
    serverError: "Lỗi máy chủ, vui lòng thử lại sau",
    deleteClaim: "Không thể xóa bồi thường",
    deleteClaimFailed: "Xóa bồi thường thất bại. Vui lòng thử lại",
  },

  // Loading messages
  loading: {
    list: "Đang tải danh sách...",
    detail: "Đang tải chi tiết...",
  },

  // Test Trigger Feature
  testTrigger: {
    // Success messages
    testSuccess:
      "Dữ liệu test được gửi thành công. Yêu cầu bồi thường đã được tạo nếu điều kiện thỏa mãn.",

    // Data quality options (matching BE enum)
    dataQuality: {
      good: "Tốt",
      acceptable: "Chấp Nhận Được",
      poor: "Kém",
    },

    // Validation errors
    validation: {
      policyRequired: "Vui lòng chọn đơn bảo hiểm",
      farmIdRequired: "Không tìm thấy thông tin trang trại từ đơn bảo hiểm",
      dataSourceRequired: "Vui lòng chọn nguồn dữ liệu (Data Source)",
      parameterRequired: "Vui lòng nhập tên tham số",
      measuredValueRequired: "Vui lòng nhập giá trị đo",
      measuredValueInvalid: "Giá trị đo phải là số hợp lệ",
      confidenceScoreRange: "Điểm tin cậy phải nằm trong khoảng 0.0 - 1.0",
      timestampInvalid: "Thời gian đo không hợp lệ",
      componentDataInvalidJson: "Dữ liệu thành phần phải là JSON hợp lệ",
      noConditions: "Vui lòng thêm ít nhất một điều kiện",
    },

    // Backend error mapping (Vietnamese translations)
    errors: {
      UNAUTHORIZED:
        "Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập lại.",
      INVALID_UUID:
        "Mã đơn bảo hiểm không hợp lệ. Vui lòng chọn lại đơn bảo hiểm.",
      INVALID_REQUEST:
        "Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra lại thông tin.",
      VALIDATION_ERROR:
        "Dữ liệu giám sát không được để trống. Vui lòng thêm ít nhất một điều kiện.",
      TEST_FAILED:
        "Không thể thực hiện test. Đơn bảo hiểm không tồn tại hoặc đã bị hủy.",
      POLICY_NOT_FOUND: "Không tìm thấy đơn bảo hiểm. Vui lòng kiểm tra lại.",
      POLICY_BLOCKED:
        "Đơn bảo hiểm đã bị khóa hoặc hết hiệu lực. Không thể thực hiện test.",
      NETWORK_ERROR:
        "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.",
      TIMEOUT: "Yêu cầu quá thời gian chờ. Vui lòng thử lại.",
      SERVER_ERROR:
        "Lỗi máy chủ. Vui lòng thử lại sau hoặc liên hệ quản trị viên.",
      UNKNOWN: "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.",
    },
  },
};
