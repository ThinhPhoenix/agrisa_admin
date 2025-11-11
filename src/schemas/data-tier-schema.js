const { default: z } = require("zod");
const { getTierValidation } = require("../libs/message/data-source-message");

/**
 * Create Data Tier Schema
 * Dựa trên CreateDataTierRequest từ BE
 */
const createDataTierSchema = z.object({
  // Required fields
  data_tier_category_id: z
    .string()
    .uuid(getTierValidation("CATEGORY_ID_INVALID"))
    .min(1, getTierValidation("CATEGORY_ID_REQUIRED")),

  tier_level: z
    .number({
      required_error: getTierValidation("TIER_LEVEL_REQUIRED"),
      invalid_type_error: getTierValidation("TIER_LEVEL_INVALID"),
    })
    .int(getTierValidation("TIER_LEVEL_INVALID"))
    .gte(1, getTierValidation("TIER_LEVEL_OUT_OF_RANGE"))
    .lte(100, getTierValidation("TIER_LEVEL_OUT_OF_RANGE")),

  tier_name: z
    .string()
    .min(1, getTierValidation("TIER_NAME_REQUIRED"))
    .max(100, getTierValidation("TIER_NAME_TOO_LONG"))
    .trim(),

  data_tier_multiplier: z
    .number({
      required_error: getTierValidation("TIER_MULTIPLIER_REQUIRED"),
      invalid_type_error: getTierValidation("TIER_MULTIPLIER_INVALID"),
    })
    .positive(getTierValidation("TIER_MULTIPLIER_INVALID"))
    .lte(100, getTierValidation("TIER_MULTIPLIER_OUT_OF_RANGE")),
});

/**
 * Update Data Tier Schema
 * All fields optional
 */
const updateDataTierSchema = z.object({
  data_tier_category_id: z
    .string()
    .uuid(getTierValidation("CATEGORY_ID_INVALID"))
    .optional(),

  tier_level: z
    .number({
      invalid_type_error: getTierValidation("TIER_LEVEL_INVALID"),
    })
    .int(getTierValidation("TIER_LEVEL_INVALID"))
    .gte(1, getTierValidation("TIER_LEVEL_OUT_OF_RANGE"))
    .lte(100, getTierValidation("TIER_LEVEL_OUT_OF_RANGE"))
    .optional(),

  tier_name: z
    .string()
    .min(1, getTierValidation("TIER_NAME_REQUIRED"))
    .max(100, getTierValidation("TIER_NAME_TOO_LONG"))
    .trim()
    .optional(),

  data_tier_multiplier: z
    .number({
      invalid_type_error: getTierValidation("TIER_MULTIPLIER_INVALID"),
    })
    .positive(getTierValidation("TIER_MULTIPLIER_INVALID"))
    .lte(100, getTierValidation("TIER_MULTIPLIER_OUT_OF_RANGE"))
    .optional(),
});

module.exports = {
  createDataTierSchema,
  updateDataTierSchema,
};
