// Menu configuration used by CustomSidebar and CustomHeader breadcrumb generation
export const sidebarMenuItems = [
    {
        key: "dashboard",
        label: "Bảng điều khiển",
    },
    {
        key: "accounts",
        label: "Quản lí tài khoản",
        children: [
            { key: "accounts/general", label: "Quản lí chung" },
            { key: "accounts/partner", label: "Quản lí đối tác" },
            {
                key: "accounts/partner/deletion-requests",
                label: "Yêu cầu hủy đối tác",
            },
            // { key: "accounts/farmer", label: "Quản lí nông dân" },
        ],
    },
    // {
    //   key: "permissions",
    //   label: "Quản lí quyền hạn",
    // },
    // {
    //   key: "roles",
    //   label: "Quản lí vai trò",
    // },
    {
        key: "base-policies",
        label: "Quản lý gói bảo hiểm",
        children: [
            {
                key: "base-policies/pending-policies",
                label: "Danh sách chờ duyệt",
            },
            {
                key: "base-policies/list",
                label: "Tất cả gói bảo hiểm",
            },
        ],
    },
    {
        key: "policies",
        label: "Quản lý hợp đồng",
    },
    {
        key: "claims",
        label: "Quản lý yêu cầu chi trả",
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
        key: "payments",
        label: "Quản lý thanh toán",
        children: [{ key: "payments", label: "Danh sách thanh toán" }],
    },
    // {
    //   key: "configuration",
    //   label: "Cấu hình hệ thống",
    // },
];

export const labelTranslations = {
    Create: "Tạo mới",
    Edit: "Chỉnh sửa",
};
