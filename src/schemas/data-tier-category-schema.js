const { default: z } = require("zod");
const { getTierCategoryValidation } = require("../libs/message/data-source-message");

/**
 * Create Data Tier Category Schema
 * Dựa trên CreateDataTierCategoryRequest từ BE
 */
const createDataTierCategorySchema = z.object({
  // Required fields
  category_name: z
    .string()
    .min(1, getTierCategoryValidation("CATEGORY_NAME_REQUIRED"))
    .max(100, getTierCategoryValidation("CATEGORY_NAME_TOO_LONG"))
    .trim(),

  category_cost_multiplier: z
    .number({
      required_error: getTierCategoryValidation("CATEGORY_MULTIPLIER_REQUIRED"),
      invalid_type_error: getTierCategoryValidation("CATEGORY_MULTIPLIER_INVALID"),
    })
    .positive(getTierCategoryValidation("CATEGORY_MULTIPLIER_INVALID"))
    .lte(100, getTierCategoryValidation("CATEGORY_MULTIPLIER_OUT_OF_RANGE")),

  // Optional fields
  category_description: z
    .string()
    .max(500, getTierCategoryValidation("CATEGORY_DESCRIPTION_TOO_LONG"))
    .trim()
    .optional()
    .nullable(),
});

/**
 * Update Data Tier Category Schema
 * All fields optional
 */
const updateDataTierCategorySchema = z.object({
  category_name: z
    .string()
    .min(1, getTierCategoryValidation("CATEGORY_NAME_REQUIRED"))
    .max(100, getTierCategoryValidation("CATEGORY_NAME_TOO_LONG"))
    .trim()
    .optional(),

  category_cost_multiplier: z
    .number({
      invalid_type_error: getTierCategoryValidation("CATEGORY_MULTIPLIER_INVALID"),
    })
    .positive(getTierCategoryValidation("CATEGORY_MULTIPLIER_INVALID"))
    .lte(100, getTierCategoryValidation("CATEGORY_MULTIPLIER_OUT_OF_RANGE"))
    .optional(),

  category_description: z
    .string()
    .max(500, getTierCategoryValidation("CATEGORY_DESCRIPTION_TOO_LONG"))
    .trim()
    .optional()
    .nullable(),
});

module.exports = {
  createDataTierCategorySchema,
  updateDataTierCategorySchema,
};
