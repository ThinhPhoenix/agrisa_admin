const prefix = "/api";

export const endpoints = {
  auth: {
    sign_in: `/auth/public/login`,
    sign_out: `${prefix}/auth/sign-out`,
    sign_up: `${prefix}/auth/sign-up`,
  },
  user: {
    find: `${prefix}/users`,
    find_one: (id) => `${prefix}/users/${id}`,
    create: `${prefix}/users`,
    update: (id) => `${prefix}/users/${id}`,
    delete: (id) => `${prefix}/users/${id}`,
    list: "/auth/public/api/v2/users?limit=100&",
  },
  policy: {
    data_tier: {
      category: {
        get_all: "/policy/protected/api/v2/data-tier-categories/",
        get_one: (id) => `/policy/protected/api/v2/data-tier-categories/${id}`,
        create: "/policy/protected/api/v2/data-tier-categories/",
        update: (id) => `/policy/protected/api/v2/data-tier-categories/${id}`,
        delete: (id) => `/policy/protected/api/v2/data-tier-categories/${id}`,
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
      get_draft_filter: "/policy/protected/api/v2/base-policies/draft/filter",
      validate: "/policy/protected/api/v2/base-policies/validate",
      detail: "/policy/protected/api/v2/base-policies/detail",
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
      monitoring_data: "/policy/protected/api/v2/policies/read-all/monitoring-data",
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
    },
  },
  partner: {
    list: "/profile/public/api/v1/insurance-partners",
    get_one: (id) => `/profile/public/api/v1/insurance-partners/${id}`,
    create: "/profile/protected/api/v1/insurance-partners",
  },
  address: {
    provinces: "https://production.cas.so/address-kit/2025-07-01/provinces",
    communes: (provinceCode) =>
      `https://production.cas.so/address-kit/2025-07-01/provinces/${provinceCode}/communes`,
  },
};
