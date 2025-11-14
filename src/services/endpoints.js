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
    },
  },
  partner: {
    list: "/profile/public/api/v1/insurance-partners",
    get_one: (id) => `/profile/public/api/v1/insurance-partners/${id}`,
    create: "/profile/protected/api/v1/insurance-partners",
  },
};
