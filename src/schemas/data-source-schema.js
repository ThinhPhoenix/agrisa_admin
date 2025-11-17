const { default: z } = require("zod");
const {
  getDataSourceValidation,
} = require("../libs/message/data-source-message");

// Enum values from BE
const DataSourceTypeEnum = z.enum(["weather", "satellite", "derived"], {
  errorMap: () => ({
    message: getDataSourceValidation("DATA_SOURCE_TYPE_INVALID"),
  }),
});

const ParameterTypeEnum = z.enum(["numeric", "boolean", "categorical"], {
  errorMap: () => ({
    message: getDataSourceValidation("PARAMETER_TYPE_INVALID"),
  }),
});

/**
 * Create Data Source Schema
 * Dựa trên CreateDataSourceRequest từ BE
 */
const createDataSourceSchema = z
  .object({
    // Required fields
    data_source: DataSourceTypeEnum,

    parameter_name: z
      .string()
      .min(1, getDataSourceValidation("PARAMETER_NAME_REQUIRED"))
      .max(100, getDataSourceValidation("PARAMETER_NAME_TOO_LONG"))
      .trim(),

    parameter_type: ParameterTypeEnum,

    base_cost: z
      .number({
        required_error: getDataSourceValidation("BASE_COST_REQUIRED"),
        invalid_type_error: getDataSourceValidation("BASE_COST_INVALID"),
      })
      .nonnegative(getDataSourceValidation("BASE_COST_NEGATIVE")),

    data_tier_id: z
      .string()
      .uuid(getDataSourceValidation("DATA_TIER_ID_INVALID"))
      .min(1, getDataSourceValidation("DATA_TIER_ID_REQUIRED")),

    display_name_vi: z
      .string()
      .min(1, getDataSourceValidation("DISPLAY_NAME_REQUIRED"))
      .max(200, getDataSourceValidation("DISPLAY_NAME_TOO_LONG"))
      .trim(),

    update_frequency: z
      .string()
      .min(1, getDataSourceValidation("UPDATE_FREQUENCY_REQUIRED"))
      .trim(),

    // Optional fields
    unit: z
      .string()
      .max(50, getDataSourceValidation("UNIT_TOO_LONG"))
      .trim()
      .optional()
      .nullable(),

    description_vi: z
      .string()
      .max(500, getDataSourceValidation("DESCRIPTION_TOO_LONG"))
      .trim()
      .optional()
      .nullable(),

    min_value: z.number().optional().nullable(),

    max_value: z.number().optional().nullable(),

    spatial_resolution: z.string().trim().optional().nullable(),

    accuracy_rating: z
      .number()
      .min(0, getDataSourceValidation("ACCURACY_RATING_INVALID"))
      .max(1, getDataSourceValidation("ACCURACY_RATING_INVALID"))
      .optional()
      .nullable(),

    data_provider: z.string().trim().optional().nullable(),
  })
  .refine(
    (data) => {
      // Validate min_value <= max_value nếu cả 2 đều có giá trị
      if (
        data.min_value !== null &&
        data.min_value !== undefined &&
        data.max_value !== null &&
        data.max_value !== undefined
      ) {
        return data.min_value <= data.max_value;
      }
      return true;
    },
    {
      message: getDataSourceValidation("MIN_MAX_INVALID"),
      path: ["max_value"],
    }
  );

/**
 * Update Data Source Schema
 * All fields optional
 */
const updateDataSourceSchema = z
  .object({
    data_source: DataSourceTypeEnum.optional(),

    parameter_name: z
      .string()
      .min(1, getDataSourceValidation("PARAMETER_NAME_REQUIRED"))
      .max(100, getDataSourceValidation("PARAMETER_NAME_TOO_LONG"))
      .trim()
      .optional(),

    parameter_type: ParameterTypeEnum.optional(),

    base_cost: z
      .number({
        invalid_type_error: getDataSourceValidation("BASE_COST_INVALID"),
      })
      .nonnegative(getDataSourceValidation("BASE_COST_NEGATIVE"))
      .optional(),

    data_tier_id: z
      .string()
      .uuid(getDataSourceValidation("DATA_TIER_ID_INVALID"))
      .optional(),

    display_name_vi: z
      .string()
      .max(200, getDataSourceValidation("DISPLAY_NAME_TOO_LONG"))
      .trim()
      .optional(),

    update_frequency: z.string().trim().optional(),

    unit: z
      .string()
      .max(50, getDataSourceValidation("UNIT_TOO_LONG"))
      .trim()
      .optional()
      .nullable(),

    description_vi: z
      .string()
      .max(500, getDataSourceValidation("DESCRIPTION_TOO_LONG"))
      .trim()
      .optional()
      .nullable(),

    min_value: z.number().optional().nullable(),

    max_value: z.number().optional().nullable(),

    spatial_resolution: z.string().trim().optional().nullable(),

    accuracy_rating: z
      .number()
      .min(0, getDataSourceValidation("ACCURACY_RATING_INVALID"))
      .max(1, getDataSourceValidation("ACCURACY_RATING_INVALID"))
      .optional()
      .nullable(),

    data_provider: z.string().trim().optional().nullable(),

    is_active: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (
        data.min_value !== null &&
        data.min_value !== undefined &&
        data.max_value !== null &&
        data.max_value !== undefined
      ) {
        return data.min_value <= data.max_value;
      }
      return true;
    },
    {
      message: getDataSourceValidation("MIN_MAX_INVALID"),
      path: ["max_value"],
    }
  );

/**
 * Batch Create Data Source Schema
 * Array of create schemas (1-100 items)
 */
const batchCreateDataSourceSchema = z.object({
  data_sources: z
    .array(createDataSourceSchema)
    .min(1, getDataSourceValidation("BATCH_SIZE_EMPTY"))
    .max(100, getDataSourceValidation("BATCH_SIZE_EXCEEDED")),
});

module.exports = {
  createDataSourceSchema,
  updateDataSourceSchema,
  batchCreateDataSourceSchema,
  DataSourceTypeEnum,
  ParameterTypeEnum,
};
