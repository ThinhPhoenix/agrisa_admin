const prefix = "/api";

export const endpoints = {
    auth: {
        sign_in: `/auth/public/login`,
        sign_out: `${prefix}/auth/sign-out`,
        sign_up: `${prefix}/auth/sign-up`,
        register: (role_name) => `/auth/public/register?role_name=${role_name}`,
        me: `/profile/protected/api/v1/me`,
        roles: `/auth/protected/api/v2/role`,
    },
    user: {
        find: `${prefix}/users`,
        find_one: (id) => `${prefix}/users/${id}`,
        create: `${prefix}/users`,
        update: (id) => `${prefix}/users/${id}`,
        delete: (id) => `${prefix}/users/${id}`,
        list: "/auth/public/api/v2/users?limit=100&",
        profile: (id) => `/profile/public/api/v1/users/${id}`,
        get_public_user_by_id: (user_id) =>
            `/profile/public/api/v1/users/own/${user_id}`,
        register: (role_name) => `/auth/public/register?role_name=${role_name}`,
    },
    policy: {
        dashboard: {
            revenue_overview:
                "/policy/protected/api/v2/dashboard/admin/revenue-overview",
        },
        data_tier: {
            category: {
                get_all: "/policy/protected/api/v2/data-tier-categories/",
                get_one: (id) =>
                    `/policy/protected/api/v2/data-tier-categories/${id}`,
                create: "/policy/protected/api/v2/data-tier-categories/",
                update: (id) =>
                    `/policy/protected/api/v2/data-tier-categories/${id}`,
                delete: (id) =>
                    `/policy/protected/api/v2/data-tier-categories/${id}`,
            },
            tier: {
                get_all: "/policy/protected/api/v2/data-tiers/",
                get_by_category: (category_id) =>
                    `/policy/protected/api/v2/data-tiers/category/${category_id}`,
                get_data_sources: (tier_id) =>
                    `/policy/protected/api/v2/data-sources/tier/${tier_id}`,
                create: "/policy/protected/api/v2/data-tiers/",
                get_one: (id) => `/policy/protected/api/v2/data-tiers/${id}`,
                update: (id) => `/policy/protected/api/v2/data-tiers/${id}`,
                delete: (id) => `/policy/protected/api/v2/data-tiers/${id}`,
            },
            data_source: {
                get_all: "/policy/protected/api/v2/data-sources/",
                get_one: (id) => `/policy/protected/api/v2/data-sources/${id}`,
                create: "/policy/protected/api/v2/data-sources/",
                update: (id) => `/policy/protected/api/v2/data-sources/${id}`,
                delete: (id) => `/policy/protected/api/v2/data-sources/${id}`,
            },
        },
        base_policy: {
            get_draft_filter:
                "/policy/protected/api/v2/base-policies/draft/filter",
            validate: "/policy/protected/api/v2/base-policies/validate",
            detail: "/policy/protected/api/v2/base-policies/detail",
            list: "/policy/protected/api/v2/base-policies/all",
            mark_payment: (id) =>
                `/policy/protected/api/v2/data-bill/mark-payment/${id}`,
        },
        farm: {
            detail: (farm_id) => `/policy/protected/api/v2/farms/${farm_id}`,
        },
        registered_policy: {
            list: "/policy/protected/api/v2/policies/read-all/list",
            detail: (policy_id) =>
                `/policy/protected/api/v2/policies/read-all/detail/${policy_id}`,
            stats: "/policy/protected/api/v2/policies/read-all/stats",
            filter: "/policy/protected/api/v2/policies/read-all/filter",
            monitoring_data:
                "/policy/protected/api/v2/policies/read-all/monitoring-data",
            monitoring_data_by_farm: (farm_id) =>
                `/policy/protected/api/v2/policies/read-all/monitoring-data/${farm_id}`,
            update_status: (policy_id) =>
                `/policy/protected/api/v2/policies/update-any/status/${policy_id}`,
            update_underwriting: (policy_id) =>
                `/policy/protected/api/v2/policies/update-any/underwriting/${policy_id}`,
        },
        claim: {
            list: "/policy/protected/api/v2/claims/read-all/list",
            detail: (claim_id) =>
                `/policy/protected/api/v2/claims/read-all/detail/${claim_id}`,
            by_policy: (policy_id) =>
                `/policy/protected/api/v2/claims/read-all/by-policy/${policy_id}`,
            by_farm: (farm_id) =>
                `/policy/protected/api/v2/claims/read-all/by-farm/${farm_id}`,
            test_trigger: (policy_id) =>
                `/policy/protected/api/v2/policies/test/trigger-claim/${policy_id}`,
            delete: (claim_id) =>
                `/policy/protected/api/v2/claims/delete-any/${claim_id}`,
        },
    },
    partner: {
        list: "/profile/public/api/v1/insurance-partners",
        get_one: (id) => `/profile/public/api/v1/insurance-partners/${id}`,
        profile: (id) =>
            `/profile/public/api/v1/insurance-partners/${id}/profile`,
        create: "/profile/protected/api/v1/insurance-partners",
        assign_user: (user_id) =>
            `/profile/protected/api/v1/users/admin/${user_id}`,
        deletion: {
            create_request:
                "/profile/protected/api/v1/insurance-partners/deletion-requests",
            get_requests: (partner_admin_id) =>
                `/profile/protected/api/v1/insurance-partners/${partner_admin_id}/deletion-requests`,
            revoke_request:
                "/profile/protected/api/v1/insurance-partners/deletion-requests/revoke",
            admin_process:
                "/profile/protected/api/v1/insurance-partners/admin/process-request",
            admin_list_all:
                "/profile/protected/api/v1/insurance-partners/admin/deletion-requests",
        },
    },
    address: {
        // API Provider 1: Open API VN
        openApi: {
            provinces: "https://provinces.open-api.vn/api/v2/p/",
            wards: (provinceCode) =>
                `https://provinces.open-api.vn/api/v2/w/?province=${provinceCode}`,
        },
        // API Provider 2: TinhThanhPho.com
        tinhThanhPho: {
            provinces: "https://tinhthanhpho.com/api/v1/new-provinces",
            wards: (provinceCode) =>
                `https://tinhthanhpho.com/api/v1/new-provinces/${provinceCode}/wards`,
        },
    },
    payment: {
        order: {
            list: "/payment/protected/orders/admin/all",
            detail: (id) => `/payment/protected/order/admin/${id}`,
        },
        dashboard: {
            total: (type, from, to) => `/payment/protected/total/admin?type=${type}&from=${from}&to=${to}`,
        },
    },
};
