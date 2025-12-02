// Menu configuration used by CustomSidebar and CustomHeader breadcrumb generation
export const sidebarMenuItems = [
  {
    key: "accounts",
    label: "Quản lí tài khoản",
    children: [
      { key: "accounts/general", label: "Quản lí chung" },
      { key: "accounts/partner", label: "Quản lí đối tác" },
      { key: "accounts/farmer", label: "Quản lí nông dân" },
    ],
  },
  {
    key: "permissions",
    label: "Quản lí quyền hạn",
  },
  {
    key: "roles",
    label: "Quản lí vai trò",
  },
  {
    key: "pending-policies",
    label: "Chính sách đang chờ duyệt",
  },
  {
    key: "policies",
    label: "Quản lý đơn bảo hiểm",
  },
  {
    key: "claims",
    label: "Quản lý bồi thường",
  },
  {
    key: "data",
    label: "Quản lý dữ liệu",
    children: [
      { key: "data/categories", label: "Danh mục dữ liệu" },
      { key: "data/tiers", label: "Cấp độ dữ liệu" },
      { key: "data/sources", label: "Nguồn dữ liệu" },
    ],
  },
  {
    key: "configuration",
    label: "Cấu hình hệ thống",
  },
];

export const labelTranslations = {
  Create: "Tạo mới",
  Edit: "Chỉnh sửa",
};
