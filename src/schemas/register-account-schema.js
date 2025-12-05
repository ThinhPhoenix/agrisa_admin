const { default: z } = require("zod");
const { getRegisterValidation } = require("../libs/message/auth-message");

/**
 * Register Account Schema
 * Based on API: POST /auth/public/register
 * Reference: REGISTER_API_VALIDATION.md
 */
const registerAccountSchema = z.object({
  // Required: Phone number - min 10 characters, supports international format
  phone: z
    .string()
    .min(1, getRegisterValidation("PHONE_REQUIRED"))
    .min(10, getRegisterValidation("PHONE_INVALID"))
    .regex(
      /^(\+84|0)[3|5|7|8|9][0-9]{8}$/,
      getRegisterValidation("PHONE_INVALID")
    ),

  // Required: Email - must contain @, min 5 characters
  email: z
    .string()
    .min(1, getRegisterValidation("EMAIL_REQUIRED"))
    .min(5, getRegisterValidation("EMAIL_INVALID"))
    .email(getRegisterValidation("EMAIL_INVALID")),

  // Required: Password - min 8 characters
  password: z
    .string()
    .min(1, getRegisterValidation("PASSWORD_REQUIRED"))
    .min(8, getRegisterValidation("PASSWORD_TOO_SHORT")),

  // Required: National ID (CCCD/CMND) - 9 or 12 digits
  national_id: z
    .string()
    .min(1, "Vui lòng nhập số CCCD/CMND!")
    .regex(
      /^\d{9}(\d{3})?$/,
      "Số CCCD/CMND không hợp lệ! (9 hoặc 12 chữ số)"
    ),

  // Optional: User Profile
  user_profile: z
    .object({
      // Required: Full name
      full_name: z
        .string()
        .min(1, getRegisterValidation("FULL_NAME_REQUIRED"))
        .min(2, "Họ và tên phải có ít nhất 2 ký tự!")
        .regex(
          /^[a-zA-ZÀ-ỹ\s]+$/,
          getRegisterValidation("FULL_NAME_INVALID")
        ),

      // Required: Date of birth - ISO 8601 format (YYYY-MM-DD)
      date_of_birth: z
        .string()
        .min(1, getRegisterValidation("DATE_OF_BIRTH_REQUIRED"))
        .regex(
          /^\d{4}-\d{2}-\d{2}$/,
          getRegisterValidation("DATE_OF_BIRTH_INVALID")
        ),

      // Required: Gender - male, female, other
      gender: z
        .enum(["male", "female", "other"], {
          errorMap: () => ({ message: getRegisterValidation("GENDER_REQUIRED") }),
        }),

      // Required: Address
      address: z
        .string()
        .min(1, getRegisterValidation("ADDRESS_REQUIRED"))
        .min(10, "Địa chỉ phải có ít nhất 10 ký tự!"),
    })
    .optional(),
});

module.exports = registerAccountSchema;
