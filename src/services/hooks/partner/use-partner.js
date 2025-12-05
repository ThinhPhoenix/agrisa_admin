import axiosInstance from "@/libs/axios-instance";
import { endpoints } from "@/services/endpoints";
import { message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";

export function usePartners(partnerId = null) {
  const [data, setData] = useState([]);
  const [partnerDetail, setPartnerDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    partner_display_name: "",
    province_name: "",
    partner_phone: "",
    partner_email: "",
  });

  // Address data
  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);

  // Fetch partners list
  const fetchPartners = async () => {
    try {
      const response = await axiosInstance.get(endpoints.partner.list);

      let partnersData = [];
      if (response.data?.success && response.data?.data) {
        partnersData = response.data.data;
      } else if (Array.isArray(response.data)) {
        partnersData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        partnersData = response.data.data;
      }

      return {
        partners: partnersData,
        meta: response.data?.meta || null,
      };
    } catch (err) {
      console.error("Error fetching partners:", err);
      throw err;
    }
  };

  // Fetch partner detail
  const fetchPartnerDetail = useCallback(async (id) => {
    if (!id) return;

    try {
      setDetailLoading(true);
      const response = await axiosInstance.get(endpoints.partner.get_one(id));

      let partnerData = null;
      if (response.data?.success && response.data?.data) {
        partnerData = response.data.data;
      } else if (response.data?.data) {
        partnerData = response.data.data;
      } else if (response.data) {
        partnerData = response.data;
      }

      setPartnerDetail(partnerData);
      setError(null);
      return partnerData;
    } catch (err) {
      console.error("Error fetching partner detail:", err);
      setError(err);
      message.error("Lỗi khi tải thông tin đối tác: " + err.message);
      setPartnerDetail(null);
      throw err;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // Fetch provinces
  const fetchProvinces = useCallback(async () => {
    try {
      const response = await fetch(endpoints.address.provinces);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data?.provinces) {
        setProvinces(data.provinces);
      }
    } catch (err) {
      console.error("Error fetching provinces:", err);
    }
  }, []);

  // Fetch communes by province code
  const fetchCommunes = useCallback(async (provinceCode) => {
    if (!provinceCode) {
      setCommunes([]);
      return;
    }
    try {
      const response = await fetch(endpoints.address.communes(provinceCode));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data?.communes) {
        setCommunes(data.communes);
      }
    } catch (err) {
      console.error("Error fetching communes:", err);
    }
  }, []);

  // Validate payload before sending
  const validatePayload = (values) => {
    const errors = [];

    // Required fields validation
    if (!values.user_id) errors.push("User ID là bắt buộc");
    // role_id is always set to "admin" in payload, no need to validate
    if (!values.full_name) errors.push("Họ và tên là bắt buộc");
    if (!values.nationality) errors.push("Quốc tịch là bắt buộc");
    if (!values.primary_phone) errors.push("Số điện thoại là bắt buộc");

    // Email validation (regex chuẩn)
    if (values.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.email)) {
        errors.push("Email không hợp lệ");
      }
    }

    // Phone validation (Vietnamese pattern)
    if (values.primary_phone) {
      const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/;
      if (!phoneRegex.test(values.primary_phone.replace(/\s/g, ""))) {
        errors.push("Số điện thoại không đúng định dạng Việt Nam");
      }
    }

    // Date of birth validation (18-65 tuổi)
    if (values.date_of_birth) {
      const dob = new Date(values.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const actualAge =
        monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())
          ? age - 1
          : age;

      if (actualAge < 18) {
        errors.push("Người dùng phải từ 18 tuổi trở lên");
      }
      if (actualAge > 65) {
        errors.push("Người dùng phải dưới 65 tuổi");
      }
    }

    return errors;
  };

  // Create insurance partner
  const createPartner = useCallback(async (values) => {
    try {
      // Transform form values to API payload format
      const payload = {
        legal_company_name: values.legal_company_name,
        partner_trading_name:
          values.partner_trading_name || values.legal_company_name,
        partner_display_name:
          values.partner_display_name ||
          values.partner_trading_name ||
          values.legal_company_name,
        company_type: values.company_type,
        incorporation_date: values.incorporation_date
          ? values.incorporation_date.toISOString()
          : null,
        tax_identification_number: values.tax_identification_number,
        business_registration_number: values.business_registration_number || "",
        partner_tagline: values.partner_tagline || "",
        partner_description: values.partner_description || "",
        partner_phone: values.partner_phone || "",
        partner_official_email: values.partner_official_email,
        head_office_address: values.head_office_address,
        province_code: values.province_code,
        province_name: values.province_name,
        ward_code: values.ward_code,
        ward_name: values.ward_name,
        postal_code: values.postal_code || "",
        fax_number: values.fax_number || "",
        customer_service_hotline: values.customer_service_hotline || "",
        insurance_license_number: values.insurance_license_number,
        license_issue_date: values.license_issue_date
          ? values.license_issue_date.toISOString()
          : null,
        license_expiry_date: values.license_expiry_date
          ? values.license_expiry_date.toISOString()
          : null,
        authorized_insurance_lines: values.authorized_insurance_lines || [],
        operating_provinces: values.operating_provinces || [],
        year_established: values.year_established,
        partner_website: values.partner_website || "",
        trust_metric_experience: values.trust_metric_experience || 0,
        trust_metric_clients: values.trust_metric_clients || 0,
        trust_metric_claim_rate: values.trust_metric_claim_rate || 0,
        total_payouts: values.total_payouts || "",
        average_payout_time: values.average_payout_time || "",
        confirmation_timeline: values.confirmation_timeline || "",
        hotline: values.hotline || "",
        support_hours: values.support_hours || "",
        coverage_areas: values.coverage_areas || "",
      };

      const response = await axiosInstance.post(
        endpoints.partner.create,
        payload
      );

      message.success("Tạo thông tin đối tác bảo hiểm thành công!");
      return response.data;
    } catch (err) {
      console.error("Lỗi khi tạo thông tin đối tác:", err);

      // Handle specific errors
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message;

      message.error(`Lỗi khi tạo đối tác: ${errorMessage}`);
      throw err;
    }
  }, []);

  // Create user account for partner
  const createPartnerAccount = useCallback(async (values, partnerId) => {
    try {
      // Validate before creating payload
      const validationErrors = validatePayload(values);
      if (validationErrors.length > 0) {
        message.error(validationErrors.join(", "));
        throw new Error(validationErrors.join(", "));
      }

      const payload = {
        user_id: values.user_id,
        role_id: "admin", // Always set to admin for partner accounts
        partner_id: partnerId,
        full_name: values.full_name,
        display_name: values.display_name || values.full_name,
        date_of_birth: values.date_of_birth
          ? values.date_of_birth.format("YYYY-MM-DD")
          : "",
        gender: values.gender || "M",
        nationality: values.nationality,
        email: values.email || "",
        primary_phone: values.primary_phone,
        alternate_phone: values.alternate_phone || "",
        permanent_address: values.permanent_address || "",
        current_address:
          values.current_address || values.permanent_address || "",
        province_code: values.province_code || "",
        province_name: values.province_name || "",
        district_code: values.district_code || "",
        district_name: values.district_name || "",
        ward_code: values.ward_code || "",
        ward_name: values.ward_name || "",
        postal_code: values.postal_code || "",
        profile_image_url: values.profile_image_url || "",
        verification_status: "pending",
        kyc_status: "pending",
      };

      const response = await axiosInstance.post(
        "/profile/protected/api/v1/users",
        payload
      );

      message.success("Chỉ định tài khoản thành công!");
      return response.data;
    } catch (err) {
      console.error("Xảy ra lỗi khi tạo:", err);

      // Handle specific errors
      const errorCode = err.response?.data?.error?.code;
      const errorMessage =
        err.response?.data?.error?.message || err.response?.data?.message;

      // Check for duplicate user_id error
      if (
        errorCode === "CONFLICT" &&
        (errorMessage?.includes(
          "duplicate key value violates unique constraint"
        ) ||
          errorMessage?.includes("unique_user_id"))
      ) {
        message.error("Người dùng này đã được chỉ định vai trò trước đó!");
      } else {
        // Generic error message
        const displayMessage =
          errorMessage || err.message || "Lỗi khi tạo tài khoản";
        message.error(displayMessage);
      }

      throw err;
    }
  }, []);

  // Refetch partners list
  const refetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchPartners();

      setData(result.partners);
      setLastUpdated(result.meta?.timestamp || new Date().toISOString());
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Error fetching partners:", err);
      message.error("Lỗi khi tải dữ liệu đối tác: " + err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    refetchData();
  }, [refetchData]);

  // Fetch partner detail if partnerId is provided
  useEffect(() => {
    if (partnerId) {
      fetchPartnerDetail(partnerId);
    }
  }, [partnerId, fetchPartnerDetail]);

  // Fetch provinces on mount
  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  // Filter options - use provinces from API instead of data
  const filterOptions = useMemo(() => {
    const provinceOptions = provinces.map((province) => ({
      label: province.name || province.province_name,
      value: province.name || province.province_name, // Use name for filtering
    }));

    return {
      provinces: provinceOptions,
    };
  }, [provinces]);

  // Filtered data
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.filter((item) => {
      const matchesName =
        !filters.partner_display_name ||
        item.partner_display_name
          ?.toLowerCase()
          .includes(filters.partner_display_name.toLowerCase());
      const matchesProvince =
        !filters.province_name || item.province_name === filters.province_name;
      const matchesPhone =
        !filters.partner_phone ||
        item.partner_phone
          ?.toLowerCase()
          .includes(filters.partner_phone.toLowerCase());
      const matchesEmail =
        !filters.partner_email ||
        item.partner_official_email
          ?.toLowerCase()
          .includes(filters.partner_email.toLowerCase());

      return matchesName && matchesProvince && matchesPhone && matchesEmail;
    });
  }, [filters, data]);

  // Summary stats
  const summaryStats = useMemo(() => {
    if (!Array.isArray(data)) {
      return {
        totalPartners: 0,
        totalProvinces: 0,
        avgRating: "0.0",
      };
    }

    const totalPartners = data.length;
    const totalProvinces = new Set(data.map((item) => item.province_name)).size;
    const avgRating =
      data.reduce((sum, item) => sum + (item.partner_rating_score || 0), 0) /
        data.length || 0;

    return {
      totalPartners,
      totalProvinces,
      avgRating: avgRating.toFixed(1),
    };
  }, [data]);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      partner_display_name: "",
      province_name: "",
      partner_phone: "",
      partner_email: "",
    });
  };

  return {
    data,
    filteredData,
    filterOptions,
    summaryStats,
    filters,
    updateFilters,
    clearFilters,
    loading,
    error,
    lastUpdated,
    refetch: refetchData,
    // Partner detail
    partnerDetail,
    detailLoading,
    fetchPartnerDetail,
    // Partner actions
    createPartner,
    createPartnerAccount,
    // Address data
    provinces,
    communes,
    fetchCommunes,
  };
}
