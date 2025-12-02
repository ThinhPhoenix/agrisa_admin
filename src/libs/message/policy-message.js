export const policyMessage = {
  // Page titles
  title: {
    list: "Quản lý đơn bảo hiểm",
    detail: "Chi tiết đơn bảo hiểm",
    stats: "Thống kê đơn bảo hiểm",
    monitoring: "Dữ liệu giám sát",
  },

  // Table headers
  table: {
    policyNumber: "Số đơn",
    farmerName: "Nông dân",
    farmName: "Tên nông trại",
    basePolicyName: "Gói bảo hiểm",
    coverageAmount: "Số tiền bảo hiểm",
    coveragePeriod: "Thời gian bảo hiểm",
    premium: "Phí bảo hiểm",
    status: "Trạng thái",
    underwritingStatus: "Trạng thái thẩm định",
    insuranceProvider: "Nhà cung cấp",
    createdAt: "Ngày tạo",
    actions: "Thao tác",
  },

  // Policy status
  status: {
    draft: "Bản nháp",
    pending_review: "Chờ xét duyệt",
    pending_payment: "Chờ thanh toán",
    active: "Đang hoạt động",
    expired: "Đã hết hạn",
    cancelled: "Đã hủy",
    rejected: "Bị từ chối",
  },

  // Underwriting status
  underwritingStatus: {
    pending: "Chờ đánh giá",
    approved: "Đã phê duyệt",
    rejected: "Bị từ chối",
  },

  // Filter labels
  filter: {
    title: "Bộ lọc",
    policyNumber: "Số đơn bảo hiểm",
    farmerId: "Mã nông dân",
    insuranceProvider: "Nhà cung cấp",
    status: "Trạng thái đơn",
    underwritingStatus: "Trạng thái thẩm định",
    basePolicyId: "Mã gói bảo hiểm",
    farmId: "Mã nông trại",
    search: "Tìm kiếm...",
    apply: "Áp dụng",
    reset: "Đặt lại",
    allStatus: "Tất cả trạng thái",
    allUnderwriting: "Tất cả thẩm định",
  },

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

  // Detail fields
  fields: {
    policyId: "Mã đơn",
    policyNumber: "Số đơn bảo hiểm",
    farmerName: "Tên nông dân",
    farmerId: "Mã nông dân",
    farmName: "Tên nông trại",
    farmId: "Mã nông trại",
    farmCode: "Mã trang trại",
    farmArea: "Diện tích (m²)",
    cropType: "Loại cây trồng",
    location: "Vị trí",
    province: "Tỉnh/Thành phố",
    district: "Quận/Huyện",
    commune: "Xã/Phường",
    basePolicyName: "Tên gói bảo hiểm",
    basePolicyId: "Mã gói bảo hiểm",
    insuranceProvider: "Nhà cung cấp bảo hiểm",
    insuranceProviderId: "Mã nhà cung cấp",
    coverageAmount: "Số tiền bảo hiểm",
    coverageCurrency: "Đơn vị tiền tệ",
    coverageStartDate: "Ngày bắt đầu",
    coverageEndDate: "Ngày kết thúc",
    coverageDuration: "Thời gian bảo hiểm (ngày)",
    plantingDate: "Ngày gieo trồng",
    areaMultiplier: "Hệ số diện tích",
    totalPremium: "Tổng phí bảo hiểm",
    premiumPaid: "Đã thanh toán",
    premiumPaidAt: "Ngày thanh toán",
    dataComplexityScore: "Điểm độ phức tạp dữ liệu",
    monthlyDataCost: "Chi phí dữ liệu hàng tháng",
    totalDataCost: "Tổng chi phí dữ liệu",
    status: "Trạng thái đơn",
    underwritingStatus: "Trạng thái thẩm định",
    createdAt: "Ngày tạo",
    updatedAt: "Cập nhật lần cuối",
    registeredBy: "Đăng ký bởi",
    signedDocument: "Tài liệu đã ký",
    downloadDocument: "Tải xuống tài liệu",
    yes: "Có",
    no: "Không",
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
    totalPolicies: "Tổng số đơn",
    byStatus: "Theo trạng thái",
    byUnderwriting: "Theo thẩm định",
    totalCoverage: "Tổng số tiền bảo hiểm",
    totalPremium: "Tổng phí bảo hiểm đã thu",
  },

  // Actions
  actions: {
    viewDetail: "Xem chi tiết",
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
    list: "Đang tải danh sách...",
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
