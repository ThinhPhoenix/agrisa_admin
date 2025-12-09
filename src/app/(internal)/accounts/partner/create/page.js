"use client";

import { CustomForm } from "@/components/custom-form";
import { usePartners } from "@/services/hooks/partner/use-partner";
import {
  Button,
  Divider,
  Layout,
  message,
  Typography
} from "antd";
import {
  IdcardOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import "../partner.css";

const { Title } = Typography;

export default function CreatePartnerPage() {
  const { createPartner, provinces, wards, fetchWards } = usePartners();
  const router = useRouter();
  const formRef = useRef();
  const [submitting, setSubmitting] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [provinceName, setProvinceName] = useState("");
  const [wardName, setWardName] = useState("");

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    try {
      setSubmitting(true);
      console.log("📝 Form data:", formData);

      const operatingProvinceNames = (formData.operating_provinces || [])
        .map((code) => provinces.find((p) => p.code === code)?.name)
        .filter(Boolean);

      const modifiedData = {
        ...formData,
        operating_provinces: operatingProvinceNames,
        head_office_address: `${formData.head_office_address || ""}, ${
          wardName || ""
        }, ${provinceName || ""}`
          .replace(/^,\s*/, "")
          .replace(/,\s*$/, "")
          .replace(/,\s*,/g, ",")
          .trim(),
        province_name: provinceName,
        ward_name: wardName,
      };

      console.log("🚀 Sending to API:", modifiedData);

      await createPartner(modifiedData);
      message.success("Tạo đối tác thành công!");
      router.push("/accounts/partner");
    } catch (err) {
      console.error("❌ Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle submit button click
  const handleSubmitClick = async () => {
    try {
      console.log("🔘 Submit clicked");

      const values = await formRef.current.validateFields();
      console.log("✅ Validation passed:", values);

      const errors = [];

      // Validate company name starts with "Công ty"
      if (
        values.legal_company_name &&
        !values.legal_company_name.startsWith("Công ty")
      ) {
        errors.push(
          "Tên công ty phải bắt đầu bằng 'Công ty' theo quy định pháp luật Việt Nam"
        );
      }

      // Validate dates
      if (
        values.incorporation_date &&
        values.incorporation_date.isAfter(dayjs())
      ) {
        errors.push("Ngày thành lập không được là ngày tương lai");
      }

      if (values.incorporation_date && values.license_issue_date) {
        if (!values.license_issue_date.isAfter(values.incorporation_date)) {
          errors.push("Ngày cấp giấy phép phải sau ngày thành lập công ty");
        }
      }

      if (values.license_issue_date && values.license_expiry_date) {
        if (!values.license_expiry_date.isAfter(values.license_issue_date)) {
          errors.push("Ngày hết hạn giấy phép phải sau ngày cấp giấy phép");
        }
      }

      if (errors.length > 0) {
        console.log("⚠️ Validation errors:", errors);
        message.error(errors[0]);
        return;
      }

      await handleFormSubmit(values);
    } catch (err) {
      console.error("❌ Validation error:", err);
      if (err.errorFields && err.errorFields.length > 0) {
        message.error(`Vui lòng kiểm tra: ${err.errorFields[0].errors[0]}`);
      }
    }
  };

  // Province & Ward options
  const provinceOptions = provinces.map((p) => ({
    label: p.name,
    value: p.code,
  }));

  const wardOptions = wards.map((w) => ({
    label: w.name,
    value: w.code,
  }));

  // Company type options
  const companyTypeOptions = [
    { label: "Công ty trong nước", value: "domestic" },
    { label: "Công ty nước ngoài", value: "foreign" },
    { label: "Doanh nghiệp liên doanh", value: "joint_venture" },
  ];

  // Insurance lines options
  const insuranceLinesOptions = [
    { label: "Bảo hiểm nông nghiệp", value: "agricultural" },
    { label: "Bảo hiểm lúa/cây trồng", value: "crop_insurance" },
    { label: "Bảo hiểm tham số", value: "parametric_insurance" },
    { label: "Bảo hiểm chỉ số thời tiết", value: "weather_index_insurance" },
  ];

  // Simplified form fields - Only essentials
  const formFields = [
    // ========== THÔNG TIN CƠ BẢN ==========
    {
      name: "divider_basic",
      type: "custom",
      label: "",
      gridColumn: "span 2",
      render: () => (
        <Divider orientation="left" style={{ marginTop: 0, marginBottom: 16 }}>
          <strong style={{ fontSize: "16px", color: "#1890ff" }}>
            <IdcardOutlined style={{ marginRight: 8 }} />
            Thông tin cơ bản
          </strong>
        </Divider>
      ),
    },
    {
      name: "legal_company_name",
      label: "Tên pháp lý công ty",
      type: "input",
      placeholder: "Ví dụ: Công ty Cổ phần Bảo hiểm Nông Nghiệp...",
      required: true,
      maxLength: 255,
      gridColumn: "span 2",
      rules: [
        { required: true, message: "Vui lòng nhập tên pháp lý công ty!" },
        {
          pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
          message: "Tên công ty chỉ được chứa chữ cái và khoảng trắng",
        },
      ],
    },
    {
      name: "partner_trading_name",
      label: "Tên giao dịch",
      type: "input",
      placeholder: "Ví dụ: Bảo hiểm Phương Nam",
      required: true,
      maxLength: 255,
      rules: [
        { required: true, message: "Vui lòng nhập tên giao dịch!" },
        {
          pattern: /^[a-zA-ZÀ-ỹ0-9\s]+$/,
          message: "Tên giao dịch không được chứa ký tự đặc biệt",
        },
      ],
    },
    {
      name: "company_type",
      label: "Loại hình công ty",
      type: "select",
      placeholder: "Chọn loại hình...",
      required: true,
      options: companyTypeOptions,
      rules: [{ required: true, message: "Vui lòng chọn loại hình công ty!" }],
    },
    {
      name: "incorporation_date",
      label: "Ngày thành lập",
      type: "datepicker",
      placeholder: "Chọn ngày...",
      required: true,
      rules: [{ required: true, message: "Vui lòng chọn ngày thành lập!" }],
    },
    {
      name: "tax_identification_number",
      label: "Mã số thuế",
      type: "input",
      placeholder: "Ví dụ: 0456789012",
      required: true,
      rules: [
        { required: true, message: "Vui lòng nhập mã số thuế!" },
        {
          pattern: /^\d{10}(-\d{3})?$/,
          message: "Mã số thuế: 10 chữ số hoặc 10-XXX",
        },
      ],
    },
    {
      name: "business_registration_number",
      label: "Mã số đăng ký kinh doanh",
      type: "input",
      placeholder: "Ví dụ: 0111456789",
      required: true,
      rules: [
        { required: true, message: "Vui lòng nhập mã số đăng ký kinh doanh!" },
        {
          pattern: /^\d{10}(-\d{3})?$/,
          message: "Mã số ĐKKD: 10 chữ số hoặc 10-XXX",
        },
      ],
    },

    // ========== THÔNG TIN LIÊN HỆ ==========
    {
      name: "divider_contact",
      type: "custom",
      label: "",
      gridColumn: "span 2",
      render: () => (
        <Divider orientation="left" style={{ marginTop: 24, marginBottom: 16 }}>
          <strong style={{ fontSize: "16px", color: "#1890ff" }}>
            <PhoneOutlined style={{ marginRight: 8 }} />
            Thông tin liên hệ
          </strong>
        </Divider>
      ),
    },
    {
      name: "partner_official_email",
      label: "Email chính thức",
      type: "input",
      placeholder: "info@company.com",
      required: true,
      rules: [
        { required: true, message: "Vui lòng nhập email!" },
        { type: "email", message: "Email không đúng định dạng!" },
        { max: 254, message: "Email tối đa 254 ký tự!" },
      ],
    },
    {
      name: "partner_phone",
      label: "Số điện thoại",
      type: "input",
      placeholder: "+84865921357",
      required: false,
      rules: [
        {
          pattern: /^\+84\d{9,10}$/,
          message: "Số điện thoại: +84 + 9-10 chữ số",
        },
      ],
    },

    // ========== ĐỊA CHỈ ==========
    {
      name: "divider_address",
      type: "custom",
      label: "",
      gridColumn: "span 2",
      render: () => (
        <Divider orientation="left" style={{ marginTop: 24, marginBottom: 16 }}>
          <strong style={{ fontSize: "16px", color: "#1890ff" }}>
            <EnvironmentOutlined style={{ marginRight: 8 }} />
            Địa chỉ trụ sở chính
          </strong>
        </Divider>
      ),
    },
    {
      name: "province_code",
      label: "Tỉnh/Thành phố",
      type: "select",
      placeholder: "Chọn tỉnh/thành phố...",
      required: true,
      options: provinceOptions,
      showSearch: true,
      rules: [{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }],
      onChange: (value) => {
        fetchWards(value);
        setSelectedProvince(value);
        setProvinceName(provinces.find((p) => p.code === value)?.name || "");
        // Reset ward when province changes
        formRef.current?.setFieldsValue({ ward_code: undefined });
        setWardName("");
      },
    },
    {
      name: "ward_code",
      label: "Phường/Xã",
      type: "select",
      placeholder: "Chọn phường/xã...",
      required: true,
      options: wardOptions,
      showSearch: true,
      disabled: !selectedProvince,
      rules: [{ required: true, message: "Vui lòng chọn phường/xã!" }],
      onChange: (value) => {
        setWardName(wards.find((w) => w.code === value)?.name || "");
      },
    },
    {
      name: "head_office_address",
      label: "Địa chỉ chi tiết",
      type: "input",
      placeholder: "Số nhà, tên đường...",
      required: true,
      maxLength: 255,
      gridColumn: "span 2",
      disabled: !selectedProvince,
      rules: [
        { required: true, message: "Vui lòng nhập địa chỉ!" },
        { max: 255, message: "Địa chỉ tối đa 255 ký tự!" },
      ],
    },

    // ========== GIẤY PHÉP BẢO HIỂM ==========
    {
      name: "divider_license",
      type: "custom",
      label: "",
      gridColumn: "span 2",
      render: () => (
        <Divider orientation="left" style={{ marginTop: 24, marginBottom: 16 }}>
          <strong style={{ fontSize: "16px", color: "#1890ff" }}>
            <SafetyCertificateOutlined style={{ marginRight: 8 }} />
            Giấy phép bảo hiểm
          </strong>
        </Divider>
      ),
    },
    {
      name: "insurance_license_number",
      label: "Số giấy phép",
      type: "input",
      placeholder: "Ví dụ: 1234567890",
      required: true,
      rules: [
        { required: true, message: "Vui lòng nhập số giấy phép!" },
        {
          pattern: /^\d{10}(-\d{3})?$/,
          message: "Số giấy phép: 10 chữ số hoặc 10-XXX",
        },
      ],
    },
    {
      name: "license_issue_date",
      label: "Ngày cấp",
      type: "datepicker",
      placeholder: "Chọn ngày cấp...",
      required: true,
      rules: [{ required: true, message: "Vui lòng chọn ngày cấp giấy phép!" }],
    },
    {
      name: "license_expiry_date",
      label: "Ngày hết hạn",
      type: "datepicker",
      placeholder: "Chọn ngày hết hạn...",
      required: true,
      rules: [
        { required: true, message: "Vui lòng chọn ngày hết hạn giấy phép!" },
      ],
    },
    {
      name: "authorized_insurance_lines",
      label: "Loại hình bảo hiểm được phép",
      type: "multiselect",
      placeholder: "Chọn loại hình bảo hiểm...",
      required: true,
      options: insuranceLinesOptions,
      gridColumn: "span 2",
      rules: [
        { required: true, message: "Vui lòng chọn ít nhất 1 loại hình!" },
      ],
    },
    {
      name: "operating_provinces",
      label: "Tỉnh/Thành phố hoạt động",
      type: "multiselect",
      placeholder: "Chọn tỉnh/thành phố hoạt động...",
      required: true,
      options: provinceOptions,
      showSearch: true,
      mode: "multiple",
      gridColumn: "span 2",
      rules: [
        { required: true, message: "Vui lòng chọn ít nhất 1 tỉnh hoạt động!" },
      ],
    },
  ];

  return (
    <Layout style={{ background: "transparent", padding: "0" }}>
      <div className="data-page-container">
        <div className="data-page-header">
          <Title level={2} className="data-page-title">
            Tạo đối tác bảo hiểm mới
          </Title>
          <p style={{ color: "#666", marginTop: 8 }}>
            Điền thông tin cơ bản để tạo hồ sơ đối tác bảo hiểm. Các trường đánh
            dấu <span style={{ color: "red" }}>*</span> là bắt buộc.
          </p>
        </div>

        <div className="data-form-container">
          <CustomForm
            ref={formRef}
            fields={formFields}
            gridColumns="1fr 1fr"
            gap="16px"
          />

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Button
              size="large"
              onClick={() => router.push("/accounts/partner")}
              style={{ minWidth: 120 }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleSubmitClick}
              loading={submitting}
              style={{ minWidth: 120 }}
            >
              {submitting ? "Đang tạo..." : "Tạo đối tác"}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
