"use client";

import { CustomForm } from "@/components/custom-form";
import { usePartners } from "@/services/hooks/partner/use-partner";
import { Button, Divider, Layout, message, Typography } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import "../partner.css";

const { Title } = Typography;

export default function CreatePartnerPage() {
  const { createPartner, provinces, communes, fetchCommunes } = usePartners();
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
      const operatingProvinceNames = formData.operating_provinces
        .map((code) => provinces.find((p) => p.code === code)?.name)
        .filter(Boolean);
      const coverageProvinceNames = formData.coverage_areas
        .map((code) => provinces.find((p) => p.code === code)?.name)
        .filter(Boolean);
      const modifiedData = {
        ...formData,
        operating_provinces: operatingProvinceNames,
        coverage_areas: coverageProvinceNames.join(", "),
        head_office_address: `${formData.head_office_address || ""}, ${
          wardName || ""
        }, ${provinceName || ""}`
          .replace(/^,/, "")
          .replace(/,$/, "")
          .replace(/, ,/g, ",")
          .replace(/ ,/g, ",")
          .trim(),
        province_name: provinceName,
        ward_name: wardName,
      };
      await createPartner(modifiedData);
      router.push("/accounts/partner");
    } catch (err) {
      // Error is handled in the hook
    } finally {
      setSubmitting(false);
    }
  };

  // Handle submit button click
  const handleSubmitClick = async () => {
    try {
      // Validate Ant Design Form fields
      const values = await formRef.current.validateFields();

      // Additional validation
      const errors = [];

      // Validate legal_company_name starts with "Công ty"
      if (!values.legal_company_name?.startsWith("Công ty")) {
        errors.push(
          "Tên công ty phải bắt đầu bằng 'Công ty' theo quy định pháp luật Việt Nam"
        );
      }

      // Validate incorporation_date is not in future
      if (
        values.incorporation_date &&
        values.incorporation_date.isAfter(dayjs())
      ) {
        errors.push("Ngày thành lập không được là ngày tương lai");
      }

      // Validate license_issue_date after incorporation_date
      if (values.incorporation_date && values.license_issue_date) {
        if (!values.license_issue_date.isAfter(values.incorporation_date)) {
          errors.push("Ngày cấp giấy phép phải sau ngày thành lập công ty");
        }
      }

      // Validate license_expiry_date after license_issue_date
      if (values.license_issue_date && values.license_expiry_date) {
        if (!values.license_expiry_date.isAfter(values.license_issue_date)) {
          errors.push("Ngày hết hạn giấy phép phải sau ngày cấp giấy phép");
        }
      }

      // Validate license not expired
      if (
        values.license_expiry_date &&
        values.license_expiry_date.isBefore(dayjs())
      ) {
        errors.push("Giấy phép đã hết hạn");
      }

      // Validate year_established matches incorporation_date
      if (values.incorporation_date && values.year_established) {
        if (values.incorporation_date.year() !== values.year_established) {
          errors.push("Năm thành lập phải khớp với năm trong ngày thành lập");
        }
      }

      if (errors.length > 0) {
        message.error(errors[0]);
        return;
      }

      // Submit to backend
      await handleFormSubmit(values);
    } catch (err) {
      console.error("Form validation error:", err);
    }
  };

  // Province options for dropdown
  const provinceOptions = provinces.map((province) => ({
    label: province.name,
    value: province.code,
  }));

  // Commune options for dropdown
  const communeOptions = communes.map((commune) => ({
    label: commune.name,
    value: commune.code,
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

  // Form fields
  const formFields = [
    // ============= THÔNG TIN CÔNG TY =============
    {
      name: "divider_company",
      type: "custom",
      label: "",
      gridColumn: "span 3",
      render: () => (
        <Divider orientation="left" style={{ marginTop: 0, marginBottom: 8 }}>
          <strong style={{ fontSize: "16px" }}>Thông tin công ty</strong>
        </Divider>
      ),
    },
    {
      name: "legal_company_name",
      label: "Tên pháp lý công ty",
      type: "input",
      placeholder: "Ví dụ: Công ty Cổ phần Bảo hiểm...",
      required: true,
      maxLength: 255,
      gridColumn: "span 3",
      rules: [
        {
          required: true,
          message: "Vui lòng nhập tên pháp lý công ty!",
        },
        {
          pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
          message:
            "Tên công ty chỉ được chứa chữ cái tiếng Việt và khoảng trắng",
        },
      ],
    },
    {
      name: "partner_trading_name",
      label: "Tên giao dịch",
      type: "input",
      placeholder: "Ví dụ: Bảo hiểm Phương Nam",
      required: false,
      maxLength: 255,
    },
    {
      name: "partner_display_name",
      label: "Tên hiển thị",
      type: "input",
      placeholder: "Ví dụ: Phương Nam Insurance",
      required: false,
      maxLength: 255,
    },
    {
      name: "company_type",
      label: "Loại hình công ty",
      type: "select",
      placeholder: "Chọn loại hình công ty...",
      required: true,
      options: companyTypeOptions,
    },
    {
      name: "incorporation_date",
      label: "Ngày thành lập",
      type: "datepicker",
      placeholder: "Chọn ngày thành lập...",
      required: true,
    },
    {
      name: "year_established",
      label: "Năm thành lập",
      type: "number",
      placeholder: "Ví dụ: 2010",
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
    },
    {
      name: "tax_identification_number",
      label: "Mã số thuế",
      type: "input",
      placeholder: "Ví dụ: 0456789012",
      required: true,
      rules: [
        {
          required: true,
          message: "Vui lòng nhập mã số thuế!",
        },
        {
          pattern: /^\d{10}(-\d{3})?$/,
          message: "Mã số thuế phải có định dạng 10 chữ số hoặc 10 chữ số-XXX",
        },
      ],
    },
    {
      name: "business_registration_number",
      label: "Mã số đăng ký kinh doanh",
      type: "input",
      placeholder: "Ví dụ: 0111456789",
      required: false,
      rules: [
        {
          pattern: /^\d{10}(-\d{3})?$/,
          message:
            "Mã số đăng ký kinh doanh phải có định dạng 10 chữ số hoặc 10 chữ số-XXX",
        },
      ],
    },
    {
      name: "partner_tagline",
      label: "Slogan",
      type: "textarea",
      placeholder: "Nhập slogan công ty...",
      required: false,
      maxLength: 500,
      gridColumn: "span 3",
    },
    {
      name: "partner_description",
      label: "Mô tả công ty",
      type: "textarea",
      placeholder: "Nhập mô tả về công ty...",
      required: false,
      maxLength: 2000,
      gridColumn: "span 3",
      rows: 4,
    },
    {
      name: "partner_website",
      label: "Website",
      type: "input",
      placeholder: "https://www.example.com",
      required: false,
      rules: [
        {
          type: "url",
          message: "Vui lòng nhập URL hợp lệ!",
        },
      ],
    },

    // ============= THÔNG TIN LIÊN HỆ =============
    {
      name: "divider_contact",
      type: "custom",
      label: "",
      gridColumn: "span 3",
      render: () => (
        <Divider orientation="left" style={{ marginTop: 16, marginBottom: 8 }}>
          <strong style={{ fontSize: "16px" }}>Thông tin liên hệ</strong>
        </Divider>
      ),
    },
    {
      name: "partner_official_email",
      label: "Email chính thức",
      type: "input",
      placeholder: "insurance@example.com",
      required: true,
      rules: [
        {
          required: true,
          message: "Vui lòng nhập email chính thức!",
        },
        {
          type: "email",
          message: "Email không đúng định dạng!",
        },
        {
          max: 254,
          message: "Email không được vượt quá 254 ký tự!",
        },
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
          message:
            "Số điện thoại phải có định dạng +84 theo sau bởi 9-10 chữ số",
        },
      ],
    },
    {
      name: "hotline",
      label: "Hotline",
      type: "input",
      placeholder: "+84865921360",
      required: false,
      rules: [
        {
          pattern: /^\+84\d{9,10}$/,
          message: "Hotline phải có định dạng +84 theo sau bởi 9-10 chữ số",
        },
      ],
    },
    {
      name: "customer_service_hotline",
      label: "Hotline CSKH",
      type: "input",
      placeholder: "+84865921359",
      required: false,
      rules: [
        {
          pattern: /^\+84\d{9,10}$/,
          message:
            "Hotline CSKH phải có định dạng +84 theo sau bởi 9-10 chữ số",
        },
      ],
    },
    {
      name: "fax_number",
      label: "Số Fax",
      type: "input",
      placeholder: "+84865921358",
      required: false,
      rules: [
        {
          pattern: /^\+84\d{9,10}$/,
          message: "Số fax phải có định dạng +84 theo sau bởi 9-10 chữ số",
        },
      ],
    },
    {
      name: "support_hours",
      label: "Giờ hỗ trợ",
      type: "input",
      placeholder: "Thứ 2 đến Chủ nhật, 7:00 - 20:00",
      required: false,
    },

    // ============= ĐỊA CHỈ TRỤ SỞ CHÍNH =============
    {
      name: "divider_address",
      type: "custom",
      label: "",
      gridColumn: "span 3",
      render: () => (
        <Divider orientation="left" style={{ marginTop: 16, marginBottom: 8 }}>
          <strong style={{ fontSize: "16px" }}>Địa chỉ trụ sở chính</strong>
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
      onChange: (value) => {
        fetchCommunes(value);
        setSelectedProvince(value);
        setProvinceName(provinces.find((p) => p.code === value)?.name || "");
      },
    },
    {
      name: "ward_code",
      label: "Phường/Xã",
      type: "select",
      placeholder: "Chọn phường/xã...",
      required: true,
      options: communeOptions,
      showSearch: true,
      disabled: !selectedProvince,
      onChange: (value) => {
        setWardName(communes.find((c) => c.code === value)?.name || "");
      },
    },
    {
      name: "postal_code",
      label: "Mã bưu điện",
      type: "input",
      placeholder: "Ví dụ: 900000",
      required: false,
    },
    {
      name: "head_office_address",
      label: "Địa chỉ trụ sở chính",
      type: "input",
      placeholder: "Nhập địa chỉ đầy đủ...",
      required: true,
      maxLength: 255,
      gridColumn: "span 3",
      disabled: !selectedProvince,
    },

    // ============= GIẤY PHÉP BẢO HIỂM =============
    {
      name: "divider_license",
      type: "custom",
      label: "",
      gridColumn: "span 3",
      render: () => (
        <Divider orientation="left" style={{ marginTop: 16, marginBottom: 8 }}>
          <strong style={{ fontSize: "16px" }}>Giấy phép bảo hiểm</strong>
        </Divider>
      ),
    },
    {
      name: "insurance_license_number",
      label: "Số giấy phép bảo hiểm",
      type: "input",
      placeholder: "Ví dụ: 1234567890",
      required: true,
      rules: [
        {
          required: true,
          message: "Vui lòng nhập số giấy phép bảo hiểm!",
        },
        {
          pattern: /^\d{10}(-\d{3})?$/,
          message:
            "Số giấy phép phải có định dạng 10 chữ số hoặc 10 chữ số-XXX",
        },
      ],
    },
    {
      name: "license_issue_date",
      label: "Ngày cấp giấy phép",
      type: "datepicker",
      placeholder: "Chọn ngày cấp...",
      required: true,
    },
    {
      name: "license_expiry_date",
      label: "Ngày hết hạn giấy phép",
      type: "datepicker",
      placeholder: "Chọn ngày hết hạn...",
      required: true,
    },
    {
      name: "license_status",
      label: "Trạng thái giấy phép",
      type: "select",
      placeholder: "Chọn trạng thái...",
      required: false,
      options: [
        { label: "Còn hiệu lực", value: "active" },
        { label: "Sắp hết hạn", value: "expiring_soon" },
        { label: "Hết hạn", value: "expired" },
      ],
    },
    {
      name: "authorized_insurance_lines",
      label: "Loại hình bảo hiểm được phép",
      type: "multiselect",
      placeholder: "Chọn loại hình bảo hiểm...",
      required: true,
      options: insuranceLinesOptions,
    },
    {
      name: "operating_provinces",
      label: "Tỉnh/Thành phố hoạt động",
      type: "multiselect",
      placeholder: "Chọn tỉnh/thành phố...",
      required: true,
      options: provinceOptions,
      showSearch: true,
      mode: "tags",
      gridColumn: "span 3",
    },
    {
      name: "coverage_areas",
      label: "Khu vực phủ sóng",
      type: "multiselect",
      placeholder: "Chọn tỉnh/thành phố...",
      required: false,
      options: provinceOptions,
      showSearch: true,
      mode: "tags",
      gridColumn: "span 3",
    },

    // ============= CHỈ SỐ TIN CẬY & THỐNG KÊ =============
    {
      name: "divider_metrics",
      type: "custom",
      label: "",
      gridColumn: "span 3",
      render: () => (
        <Divider orientation="left" style={{ marginTop: 16, marginBottom: 8 }}>
          <strong style={{ fontSize: "16px" }}>
            Chỉ số tin cậy & Thống kê
          </strong>
        </Divider>
      ),
    },
    {
      name: "trust_metric_experience",
      label: "Năm kinh nghiệm",
      type: "number",
      placeholder: "Nhập số năm...",
      required: false,
      min: 0,
    },
    {
      name: "trust_metric_clients",
      label: "Số lượng khách hàng",
      type: "number",
      placeholder: "Nhập số lượng...",
      required: false,
      min: 0,
    },
    {
      name: "trust_metric_claim_rate",
      label: "Tỷ lệ bồi thường (%)",
      type: "number",
      placeholder: "Nhập tỷ lệ %...",
      required: false,
      min: 0,
      max: 100,
    },
    {
      name: "total_payouts",
      label: "Tổng chi trả",
      type: "input",
      placeholder: "Ví dụ: Khoảng 2.7 tỷ VND",
      required: false,
    },
    {
      name: "average_payout_time",
      label: "Thời gian chi trả trung bình",
      type: "input",
      placeholder: "Ví dụ: 4 ngày làm việc",
      required: false,
    },
    {
      name: "confirmation_timeline",
      label: "Thời gian xác nhận",
      type: "input",
      placeholder: "Ví dụ: Trong vòng 36 giờ",
      required: false,
    },
  ];

  return (
    <Layout style={{ background: "transparent", padding: "0" }}>
      <div className="data-page-container">
        <div className="data-page-header">
          <Title level={2} className="data-page-title">
            Tạo thông tin đối tác bảo hiểm mới
          </Title>
        </div>

        <div className="data-form-container">
          <CustomForm
            ref={formRef}
            fields={formFields}
            gridColumns="1fr 1fr 1fr"
            gap="16px"
          />

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "24px",
            }}
          >
            <Button
              size="large"
              onClick={() => router.push("/accounts/partner")}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleSubmitClick}
              loading={submitting}
            >
              Tạo đối tác
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
