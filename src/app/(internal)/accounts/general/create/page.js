"use client";

import { CustomForm } from "@/components/custom-form";
import { getRegisterValidation } from "@/libs/message/auth-message";
import { useAccounts } from "@/services/hooks/accounts/use-accounts";
import { useCreateAccount } from "@/services/hooks/accounts/use-create-account";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Layout, Space, Typography } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function CreateAccountPage() {
  const router = useRouter();
  const { createAccount, loading } = useCreateAccount();
  const { roles } = useAccounts();

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    try {
      // Transform form data to API format
      const registerData = {
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        national_id: formData.national_id,
        user_profile: {
          full_name: formData.full_name,
          // Convert date to ISO 8601 format (YYYY-MM-DD)
          date_of_birth: formData.date_of_birth
            ? formData.date_of_birth.format("YYYY-MM-DD")
            : "",
          gender: formData.gender,
          address: formData.address,
        },
      };

      // Get role_name from form (value is the role name from options)
      const roleName = formData.role || "user_default";

      // Call API to create account with role_name
      const result = await createAccount(registerData, roleName);

      // If successful, redirect to accounts list
      if (result.success) {
        router.push("/accounts/general");
      }
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  // Transform roles to options for select
  const roleOptions = (roles || []).map((role) => ({
    label: role.display_name || role.name,
    value: role.name,
  }));

  // Form fields - following API requirements from REGISTER_API_VALIDATION.md
  const formFields = [
    // Row 1: Full Name, Phone, Email
    {
      name: "full_name",
      label: "Họ và tên",
      type: "input",
      placeholder: "Nhập họ và tên đầy đủ",
      required: true,
      rules: [
        { required: true, message: "Vui lòng nhập họ và tên!" },
        { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự!" },
        {
          pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
          message: "Họ và tên chỉ được chứa chữ cái và khoảng trắng!",
        },
      ],
    },
    {
      name: "phone",
      label: "Số điện thoại",
      type: "input",
      placeholder: "VD: 0987654321 hoặc +84987654321",
      required: true,
      rules: [
        { required: true, message: "Vui lòng nhập số điện thoại!" },
        { min: 10, message: "Số điện thoại phải có ít nhất 10 ký tự!" },
        {
          pattern: /^(\+84|0)[3|5|7|8|9][0-9]{8}$/,
          message:
            "Số điện thoại không hợp lệ! (VD: 0987654321 hoặc +84987654321)",
        },
      ],
    },
    {
      name: "email",
      label: "Email",
      type: "input",
      placeholder: "Nhập địa chỉ email",
      required: true,
      rules: [
        { required: true, message: "Vui lòng nhập email!" },
        { type: "email", message: "Email không hợp lệ!" },
        { min: 5, message: "Email phải có ít nhất 5 ký tự!" },
      ],
    },

    // Row 2: National ID, Date of Birth, Gender
    {
      name: "national_id",
      label: "Số CCCD/CMND",
      type: "input",
      placeholder: "Nhập số CCCD/CMND (9 hoặc 12 chữ số)",
      required: true,
      rules: [
        { required: true, message: "Vui lòng nhập số CCCD/CMND!" },
        {
          pattern: /^\d{9}(\d{3})?$/,
          message: "Số CCCD/CMND không hợp lệ! (9 hoặc 12 chữ số)",
        },
      ],
    },
    {
      name: "date_of_birth",
      label: "Ngày sinh",
      type: "datepicker",
      placeholder: "Chọn ngày sinh",
      required: true,
      rules: [
        {
          required: true,
          message: getRegisterValidation("DATE_OF_BIRTH_REQUIRED"),
        },
        {
          validator: (_, value) => {
            if (!value) {
              return Promise.resolve();
            }

            const today = dayjs();
            const birthDate = dayjs(value);
            const age = today.diff(birthDate, "year");

            // Age must be between 18 and 80
            if (age < 18) {
              return Promise.reject(
                new Error(getRegisterValidation("DATE_OF_BIRTH_TOO_YOUNG"))
              );
            }
            if (age > 80) {
              return Promise.reject(
                new Error(getRegisterValidation("DATE_OF_BIRTH_TOO_OLD"))
              );
            }

            return Promise.resolve();
          },
        },
      ],
    },
    {
      name: "gender",
      label: "Giới tính",
      type: "combobox",
      placeholder: "Chọn giới tính",
      required: true,
      options: [
        { label: "Nam", value: "male" },
        { label: "Nữ", value: "female" },
        { label: "Khác", value: "other" },
      ],
      rules: [{ required: true, message: "Vui lòng chọn giới tính!" }],
    },

    // Row 3: Role, Address (role takes 1 column, address takes 2)
    {
      name: "role",
      label: "Vai trò",
      type: "select",
      placeholder: "Chọn vai trò",
      required: true,
      options: roleOptions,
      rules: [{ required: true, message: "Vui lòng chọn vai trò!" }],
    },
    {
      name: "address",
      label: "Địa chỉ",
      type: "input",
      placeholder: "Nhập địa chỉ đầy đủ",
      required: true,
      gridColumn: "span 2",
      rules: [
        { required: true, message: "Vui lòng nhập địa chỉ!" },
        { min: 10, message: "Địa chỉ phải có ít nhất 10 ký tự!" },
      ],
    },

    // Row 4: Password, Confirm Password
    {
      name: "password",
      label: "Mật khẩu",
      type: "password",
      placeholder: "Nhập mật khẩu (tối thiểu 8 ký tự)",
      required: true,
      rules: [
        { required: true, message: "Vui lòng nhập mật khẩu!" },
        { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
      ],
    },
    {
      name: "confirm_password",
      label: "Xác nhận mật khẩu",
      type: "password",
      placeholder: "Nhập lại mật khẩu",
      required: true,
      rules: [
        { required: true, message: "Vui lòng xác nhận mật khẩu!" },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue("password") === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
          },
        }),
      ],
    },

    // Row 5: Action buttons
    {
      name: "spacer",
      type: "custom",
      label: "",
      render: () => <div />,
    },
    {
      name: "cancelButton",
      label: " ",
      type: "button",
      variant: "dashed",
      buttonText: "Hủy",
      onClick: () => router.push("/accounts/general"),
    },
    {
      name: "submitButton",
      label: " ",
      type: "button",
      variant: "primary",
      buttonText: "Tạo tài khoản",
      startContent: <SaveOutlined />,
      isSubmit: true,
      loading: loading,
    },
  ];

  return (
    <Layout.Content>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <Space align="center" style={{ marginBottom: "16px" }}>
            <Link href="/accounts/general">
              <Button type="text" icon={<ArrowLeftOutlined />}>
                Quay lại
              </Button>
            </Link>
          </Space>
          <Title level={2} style={{ marginBottom: "8px", color: "#1f2937" }}>
            Tạo tài khoản mới
          </Title>
          <Text style={{ color: "#6b7280" }}>
            Điền thông tin chi tiết để tạo tài khoản quản trị viên mới
          </Text>
        </div>

        {/* Form */}
        <div>
          <CustomForm
            fields={formFields}
            gridColumns="1fr 1fr 1fr"
            gap="16px"
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </Layout.Content>
  );
}
