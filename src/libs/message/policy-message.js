export const policyMessage = {
  // Page titles
  title: {
    detail: "Chi tiết đơn bảo hiểm",
    stats: "Thống kê đơn bảo hiểm",
    monitoring: "Dữ liệu giám sát",
  },

  // Table headers (migrated to list view component)

  // Policy status
  status: {
    draft: "Bản nháp",
    pending_review: "Chờ xét duyệt",
    pending_payment: "Chờ thanh toán",
    active: "Đang hoạt động",
    payout: "Đang chi trả",
    expired: "Đã hết hạn",
    pending_cancel: "Chờ hủy",
    cancelled: "Đã hủy",
    rejected: "Bị từ chối",
    dispute: "Tranh chấp",
  },

  // Underwriting status
  underwritingStatus: {
    pending: "Chờ đánh giá",
    approved: "Đã phê duyệt",
    rejected: "Bị từ chối",
  },

  // Filter labels (migrated to list view component)

  // Detail page sections
  detail: {
    basicInfo: "Thông tin cơ bản",
    policyInfo: "Thông tin đơn bảo hiểm",
    coverageInfo: "Thông tin bảo hiểm",
    farmInfo: "Thông tin nông trại",
    basePolicyInfo: "Thông tin gói bảo hiểm",
    financialInfo: "Thông tin tài chính",
    statusInfo: "Trạng thái",
    documentInfo: "Tài liệu",
    monitoringData: "Dữ liệu giám sát",
  },

  // Monitoring data
  monitoring: {
    title: "Dữ liệu giám sát nông trại",
    parameterName: "Tham số",
    measuredValue: "Giá trị đo",
    unit: "Đơn vị",
    measurementTime: "Thời gian đo",
    dataQuality: "Chất lượng dữ liệu",
    confidenceScore: "Độ tin cậy",
    measurementSource: "Nguồn dữ liệu",
    cloudCover: "Độ che phủ mây (%)",
    distance: "Khoảng cách từ farm (m)",
    noData: "Chưa có dữ liệu giám sát",
    quality: {
      good: "Tốt",
      acceptable: "Chấp nhận được",
      poor: "Kém",
    },
    parameters: {
      ndvi: "Chỉ số thực vật (NDVI)",
      ndmi: "Chỉ số độ ẩm (NDMI)",
      rainfall: "Lượng mưa",
    },
  },

  // Statistics
  stats: {
    byStatus: "Theo trạng thái",
    byUnderwriting: "Theo thẩm định",
    totalCoverage: "Tổng số tiền bảo hiểm",
    totalPremium: "Tổng phí bảo hiểm đã thu",
  },

  // Actions
  actions: {
    // viewDetail migrated to list view component
    updateStatus: "Cập nhật trạng thái",
    updateUnderwriting: "Cập nhật thẩm định",
    downloadDocument: "Tải tài liệu",
    viewMonitoring: "Xem dữ liệu giám sát",
    back: "Quay lại",
    save: "Lưu",
    cancel: "Hủy",
    update: "Cập nhật",
    close: "Đóng",
  },

  // Update modals
  updateStatus: {
    title: "Cập nhật trạng thái đơn bảo hiểm",
    label: "Chọn trạng thái mới",
    currentStatus: "Trạng thái hiện tại",
    newStatus: "Trạng thái mới",
    confirmMessage: "Bạn có chắc chắn muốn thay đổi trạng thái?",
  },

  updateUnderwriting: {
    title: "Cập nhật trạng thái thẩm định",
    label: "Chọn trạng thái thẩm định mới",
    currentStatus: "Trạng thái thẩm định hiện tại",
    newStatus: "Trạng thái thẩm định mới",
    confirmMessage: "Bạn có chắc chắn muốn thay đổi trạng thái thẩm định?",
  },

  // Success messages
  success: {
    fetchList: "Tải danh sách đơn bảo hiểm thành công",
    fetchDetail: "Tải chi tiết đơn bảo hiểm thành công",
    fetchStats: "Tải thống kê thành công",
    updateStatus: "Cập nhật trạng thái thành công",
    updateUnderwriting: "Cập nhật trạng thái thẩm định thành công",
    fetchMonitoring: "Tải dữ liệu giám sát thành công",
  },

  // Error messages
  error: {
    fetchList: "Không thể tải danh sách đơn bảo hiểm",
    fetchDetail: "Không thể tải chi tiết đơn bảo hiểm",
    fetchStats: "Không thể tải thống kê",
    updateStatus: "Không thể cập nhật trạng thái",
    updateUnderwriting: "Không thể cập nhật trạng thái thẩm định",
    fetchMonitoring: "Không thể tải dữ liệu giám sát",
    invalidPolicyId: "Mã đơn bảo hiểm không hợp lệ",
    notFound: "Không tìm thấy đơn bảo hiểm",
    unauthorized: "Bạn không có quyền thực hiện thao tác này",
    serverError: "Lỗi máy chủ, vui lòng thử lại sau",
  },

  // Loading messages
  loading: {
    // list loading migrated to list view component
    detail: "Đang tải chi tiết...",
    stats: "Đang tải thống kê...",
    updating: "Đang cập nhật...",
    monitoring: "Đang tải dữ liệu giám sát...",
  },

  // Empty states
  empty: {
    list: "Không có đơn bảo hiểm nào",
    filter: "Không tìm thấy đơn bảo hiểm phù hợp với bộ lọc",
    monitoring: "Chưa có dữ liệu giám sát",
  },

  // Pagination
  pagination: {
    showing: "Hiển thị",
    to: "đến",
    of: "trong tổng số",
    items: "mục",
    page: "Trang",
    previous: "Trước",
    next: "Tiếp",
  },
};
