import axiosInstance from "@/libs/axios-instance";
import { PARTNER_MESSAGES } from "@/libs/message";
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
  const [wards, setWards] = useState([]);

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

  // Fetch provinces with random API selection and failover
  const fetchProvinces = useCallback(async () => {
    // Randomly select API provider to try first
    const apiProviders = [
      {
        name: "Open API VN",
        url: endpoints.address.openApi.provinces,
        transform: (data) => data, // Already in correct format
      },
      {
        name: "TinhThanhPho",
        url: endpoints.address.tinhThanhPho.provinces,
        transform: (response) => {
          // TinhThanhPho returns: {success, message, data: [...], metadata}
          // Extract the data array first
          const data = response?.data || response;
          if (!Array.isArray(data)) return [];
          return data.map((province) => ({
            code: province.code,
            name: province.name,
          }));
        },
      },
    ];

    // Random shuffle to try different API first each time
    const shuffled = [...apiProviders].sort(() => Math.random() - 0.5);
    const [firstApi, secondApi] = shuffled;

    // Try first API
    try {
      console.log(`🌐 Fetching provinces from ${firstApi.name}...`);
      const response = await fetch(firstApi.url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const transformed = firstApi.transform(data);
      if (Array.isArray(transformed) && transformed.length > 0) {
        console.log(`✅ Got ${transformed.length} provinces from ${firstApi.name}`);
        setProvinces(transformed);
        return;
      }
      throw new Error("No data returned");
    } catch (err) {
      console.warn(`⚠️ ${firstApi.name} failed:`, err.message);

      // Try second API as fallback
      try {
        console.log(`🔄 Switching to ${secondApi.name}...`);
        const response = await fetch(secondApi.url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        const transformed = secondApi.transform(data);
        if (Array.isArray(transformed) && transformed.length > 0) {
          console.log(`✅ Got ${transformed.length} provinces from ${secondApi.name}`);
          setProvinces(transformed);
          return;
        }
        throw new Error("No data returned");
      } catch (fallbackErr) {
        console.error(`❌ ${secondApi.name} also failed:`, fallbackErr.message);
        console.error("❌ Both province APIs failed");
        message.error("Không thể tải dữ liệu tỉnh/thành phố. Vui lòng thử lại sau.");
      }
    }
  }, []);

  // Fetch wards by province code with random API selection and failover
  const fetchWards = useCallback(async (provinceCode) => {
    if (!provinceCode) {
      setWards([]);
      return;
    }

    // Randomly select API provider to try first
    const apiProviders = [
      {
        name: "Open API VN",
        url: endpoints.address.openApi.wards(provinceCode),
        transform: (data) => data, // Already in correct format
      },
      {
        name: "TinhThanhPho",
        url: endpoints.address.tinhThanhPho.wards(provinceCode),
        transform: (response) => {
          // TinhThanhPho returns: {success, message, data: [...], metadata}
          // Extract the data array first
          const data = response?.data || response;
          if (!Array.isArray(data)) return [];
          return data.map((ward) => ({
            code: ward.code,
            name: ward.name,
          }));
        },
      },
    ];

    // Random shuffle to try different API first each time
    const shuffled = [...apiProviders].sort(() => Math.random() - 0.5);
    const [firstApi, secondApi] = shuffled;

    // Try first API
    try {
      console.log(`🌐 Fetching wards for province ${provinceCode} from ${firstApi.name}...`);
      const response = await fetch(firstApi.url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const transformed = firstApi.transform(data);
      if (Array.isArray(transformed) && transformed.length > 0) {
        console.log(`✅ Got ${transformed.length} wards from ${firstApi.name}`);
        setWards(transformed);
        return;
      }
      throw new Error("No data returned");
    } catch (err) {
      console.warn(`⚠️ ${firstApi.name} failed:`, err.message);

      // Try second API as fallback
      try {
        console.log(`🔄 Switching to ${secondApi.name}...`);
        const response = await fetch(secondApi.url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        const transformed = secondApi.transform(data);
        if (Array.isArray(transformed) && transformed.length > 0) {
          console.log(`✅ Got ${transformed.length} wards from ${secondApi.name}`);
          setWards(transformed);
          return;
        }
        throw new Error("No data returned");
      } catch (fallbackErr) {
        console.error(`❌ ${secondApi.name} also failed:`, fallbackErr.message);
        console.error("❌ Both ward APIs failed");
        message.error("Không thể tải dữ liệu phường/xã. Vui lòng thử lại sau.");
      }
    }
  }, []);

  // Create insurance partner
  const createPartner = useCallback(async (values) => {
    try {
      // Transform form values to API payload format (matching API documentation)
      const payload = {
        // Required fields
        legal_company_name: values.legal_company_name,
        partner_trading_name: values.partner_trading_name || values.legal_company_name,
        tax_identification_number: values.tax_identification_number,
        business_registration_number: values.business_registration_number || values.tax_identification_number,
        partner_official_email: values.partner_official_email,
        head_office_address: values.head_office_address,
        province_code: String(values.province_code),
        province_name: values.province_name,
        ward_code: String(values.ward_code),
        ward_name: values.ward_name,
        insurance_license_number: values.insurance_license_number,
        incorporation_date: values.incorporation_date
          ? values.incorporation_date.toISOString()
          : null,
        year_established: values.incorporation_date
          ? values.incorporation_date.year()
          : new Date().getFullYear(),

        // Important optional fields
        partner_display_name: values.partner_display_name || values.partner_trading_name || values.legal_company_name,
        company_type: values.company_type || "domestic",
        partner_phone: values.partner_phone || "",
        license_issue_date: values.license_issue_date
          ? values.license_issue_date.toISOString()
          : null,
        license_expiry_date: values.license_expiry_date
          ? values.license_expiry_date.toISOString()
          : null,
        authorized_insurance_lines: values.authorized_insurance_lines || [],
        operating_provinces: values.operating_provinces || [],

        // Optional fields - set empty defaults
        postal_code: values.postal_code || "",
        partner_tagline: values.partner_tagline || "",
        partner_description: values.partner_description || "",
        partner_website: values.partner_website || "",
        fax_number: values.fax_number || "",
        customer_service_hotline: values.customer_service_hotline || "",
        hotline: values.hotline || "",
        support_hours: values.support_hours || "",
        coverage_areas: values.coverage_areas || "",

        // Metrics fields - optional
        trust_metric_experience: values.trust_metric_experience || 0,
        trust_metric_clients: values.trust_metric_clients || 0,
        trust_metric_claim_rate: values.trust_metric_claim_rate || 0,
        total_payouts: values.total_payouts || "",
        average_payout_time: values.average_payout_time || "",
        confirmation_timeline: values.confirmation_timeline || "",
      };

      console.log("🚀 Creating partner with payload:", payload);

      const response = await axiosInstance.post(
        endpoints.partner.create,
        payload
      );

      message.success("Tạo đối tác bảo hiểm thành công!");
      return response.data;
    } catch (err) {
      console.error("❌ Lỗi khi tạo đối tác:", err);

      // Map validation errors from API (field-specific errors)
      if (err.response?.status === 400 && err.response?.data?.data) {
        const validationErrors = err.response.data.data;

        // Mapping từ API documentation (line 358-412)
        const errorMapping = {
          // Thông tin công ty
          "LegalCompanyName": {
            "Tên công ty không được để trống": "Vui lòng nhập tên pháp lý công ty",
            "Tên công ty phải có độ dài từ 1 đến 255 ký tự": "Tên công ty phải từ 1-255 ký tự",
            "Tên công ty chỉ được chứa chữ cái tiếng Việt và khoảng trắng, không chứa ký tự đặc biệt": "Tên công ty chỉ được chứa chữ cái và khoảng trắng",
            "Tên công ty phải bắt đầu bằng 'Công ty' theo quy định pháp luật Việt Nam": "Tên công ty phải bắt đầu bằng 'Công ty'"
          },
          "PartnerTradingName": {
            "Tên giao dịch phải có độ dài từ 1 đến 255 ký tự": "Tên giao dịch phải từ 1-255 ký tự",
            "Tên giao dịch không được chứa ký tự đặc biệt": "Tên giao dịch không hợp lệ"
          },
          "PartnerDisplayName": {
            "Tên hiển thị không được vượt quá 255 ký tự": "Tên hiển thị quá dài (tối đa 255 ký tự)",
            "Tên hiển thị không được chứa ký tự đặc biệt": "Tên hiển thị không hợp lệ"
          },
          "CompanyType": {
            "Company type must be one of: domestic, foreign, joint_venture": "Loại hình công ty không hợp lệ"
          },

          // Ngày tháng
          "IncorporationDate": {
            "Incorporation date cannot be in the future": "Ngày thành lập không được là ngày tương lai",
            "Incorporation date year must match year_established": "Năm thành lập không khớp với ngày thành lập",
            "Incorporation date must be before license issue date": "Ngày thành lập phải trước ngày cấp giấy phép"
          },

          // Mã số
          "TaxIdentificationNumber": {
            "Mã số thuế không được để trống": "Vui lòng nhập mã số thuế",
            "Mã số thuế phải có định dạng 10 chữ số hoặc 10 chữ số theo sau bởi -XXX (13 ký tự)": "Mã số thuế không đúng định dạng (10 chữ số hoặc 10-XXX)"
          },
          "BusinessRegistrationNumber": {
            "Mã số đăng ký kinh doanh không được để trống": "Vui lòng nhập mã số đăng ký kinh doanh",
            "Mã số đăng ký kinh doanh phải có định dạng 10 chữ số hoặc 10 chữ số theo sau bởi -XXX (13 ký tự)": "Mã số ĐKKD không đúng định dạng (10 chữ số hoặc 10-XXX)"
          },

          // Slogan
          "PartnerTagline": {
            "Slogan không được vượt quá 500 ký tự": "Slogan quá dài (tối đa 500 ký tự)"
          },

          // Liên hệ
          "PartnerPhone": {
            "Số điện thoại/fax phải có định dạng +84 theo sau bởi 9-10 chữ số (ví dụ: +84865921357)": "Số điện thoại không đúng định dạng (+84 + 9-10 chữ số)"
          },
          "PartnerOfficialEmail": {
            "Email không được để trống": "Vui lòng nhập email chính thức",
            "Email không được vượt quá 254 ký tự": "Email quá dài (tối đa 254 ký tự)",
            "Email phải có ít nhất 5 ký tự": "Email quá ngắn (tối thiểu 5 ký tự)",
            "Email không đúng định dạng (ví dụ: example@domain.com)": "Email không đúng định dạng",
            "Email chỉ được chứa một ký tự @": "Email không hợp lệ (chỉ một ký tự @)",
            "Phần tên email (trước @) không được vượt quá 64 ký tự": "Tên email quá dài (trước @ tối đa 64 ký tự)",
            "Phần domain (sau @) không được vượt quá 255 ký tự": "Domain email quá dài (sau @ tối đa 255 ký tự)",
            "Email không được chứa hai dấu chấm liên tiếp": "Email không hợp lệ (không có .. liên tiếp)",
            "Phần tên email không được bắt đầu hoặc kết thúc bằng dấu chấm": "Email không hợp lệ",
            "Domain không được bắt đầu hoặc kết thúc bằng dấu gạch ngang": "Email không hợp lệ"
          },

          // Địa chỉ
          "HeadOfficeAddress": {
            "Địa chỉ trụ sở chính không được để trống": "Vui lòng nhập địa chỉ trụ sở chính",
            "Địa chỉ trụ sở chính không được vượt quá 255 ký tự": "Địa chỉ quá dài (tối đa 255 ký tự)"
          },
          "ProvinceCode": {
            "Mã tỉnh không được để trống": "Vui lòng chọn tỉnh/thành phố",
            "Mã tỉnh không hợp lệ": "Tỉnh/thành phố không hợp lệ",
            "Đã có lỗi xảy ra": "Lỗi khi kiểm tra tỉnh/thành phố"
          },
          "ProvinceName": {
            "Tên tỉnh/thành phố không được để trống": "Vui lòng chọn tỉnh/thành phố",
            "Tên tỉnh/thành phố không khớp với mã tỉnh/thành phố": "Tỉnh/thành phố không khớp",
            "Mã tỉnh/thành phố không hợp lệ": "Tỉnh/thành phố không hợp lệ",
            "Đã có lỗi xảy ra": "Lỗi khi kiểm tra tỉnh/thành phố"
          },
          "WardCode": {
            "Mã phường/xã không được để trống": "Vui lòng chọn phường/xã",
            "Mã phường/xã không hợp lệ": "Phường/xã không hợp lệ",
            "Đã có lỗi xảy ra khi lấy thông tin phường xã": "Lỗi khi kiểm tra phường/xã"
          },
          "WardName": {
            "Tên phường/xã không được để trống": "Vui lòng chọn phường/xã",
            "Tên phường/xã không khớp với mã phường/xã": "Phường/xã không khớp",
            "Mã phường/xã không hợp lệ": "Phường/xã không hợp lệ"
          },
          "PostalCode": {
            "Postal code không hợp lệ": "Mã bưu điện không hợp lệ (5-6 chữ số)"
          },

          // Giấy phép
          "InsuranceLicenseNumber": {
            "Số giấy phép bảo hiểm không được để trống": "Vui lòng nhập số giấy phép bảo hiểm",
            "Số giấy phép bảo hiểm phải có định dạng 10 chữ số hoặc 10 chữ số theo sau bởi -XXX (13 ký tự)": "Số giấy phép không đúng định dạng (10 chữ số hoặc 10-XXX)"
          },
          "LicenseIssueDate": {
            "Ngày cấp giấy phép phải sau ngày thành lập công ty": "Ngày cấp giấy phép phải sau ngày thành lập",
            "Ngày cấp giấy phép phải trước ngày hết hạn giấy phép": "Ngày cấp phải trước ngày hết hạn",
            "Ngày cấp giấy phép không được là ngày tương lai": "Ngày cấp giấy phép không được là ngày tương lai"
          },
          "LicenseExpiryDate": {
            "Ngày hết hạn giấy phép phải sau ngày cấp giấy phép": "Ngày hết hạn phải sau ngày cấp",
            "Giấy phép đã hết hạn": "Giấy phép đã hết hạn"
          }
        };

        // Get first validation error
        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
          const firstError = validationErrors[0];
          const field = firstError.field;
          const originalMessage = firstError.message;

          // Try to map to user-friendly Vietnamese message
          const fieldMapping = errorMapping[field];
          const userMessage = fieldMapping?.[originalMessage] || originalMessage;

          message.error(userMessage);
          throw err;
        }
      }

      // Handle HTTP status errors
      const status = err.response?.status;
      const errorCode = err.response?.data?.error?.code;

      const httpErrorMessages = {
        400: "Thông tin không hợp lệ. Vui lòng kiểm tra lại!",
        404: "Không tìm thấy dữ liệu. Vui lòng thử lại!",
        409: "Email hoặc mã số đã tồn tại. Vui lòng kiểm tra lại!",
        500: "Lỗi hệ thống. Vui lòng thử lại sau!",
        503: "Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau!"
      };

      const errorCodeMessages = {
        "BAD_REQUEST": "Thông tin gửi lên không hợp lệ",
        "CONFLICT": "Thông tin đã tồn tại trong hệ thống",
        "NOT_FOUND": "Không tìm thấy dữ liệu",
        "INTERNAL_SERVER_ERROR": "Lỗi hệ thống"
      };

      // Display user-friendly error message
      const userMessage =
        errorCodeMessages[errorCode] ||
        httpErrorMessages[status] ||
        "Không thể tạo đối tác. Vui lòng kiểm tra lại thông tin!";

      message.error(userMessage);
      throw err;
    }
  }, []);

  // Create user account for partner
  const createPartnerAccount = useCallback(
    async (values, userId, partnerId) => {
      try {
        // Validate required fields
        if (!userId) {
          message.error(PARTNER_MESSAGES.VALIDATION.USER_ID_INVALID_FORMAT);
          throw new Error(PARTNER_MESSAGES.VALIDATION.USER_ID_INVALID_FORMAT);
        }

        if (!partnerId) {
          message.error(PARTNER_MESSAGES.VALIDATION.PARTNER_ID_REQUIRED);
          throw new Error(PARTNER_MESSAGES.VALIDATION.PARTNER_ID_REQUIRED);
        }

        // Prepare payload with only partner_id
        const payload = {
          partner_id: partnerId,
        };

        // Call PUT endpoint to assign partner to user
        const response = await axiosInstance.put(
          endpoints.partner.assign_user(userId),
          payload
        );

        message.success(PARTNER_MESSAGES.SUCCESS.ASSIGN_SUCCESS);
        return response.data;
      } catch (err) {
        console.error("Xảy ra lỗi khi chỉ định tài khoản:", err);

        // Handle specific errors based on error code
        const errorCode = err.response?.data?.error?.code;
        const errorMessage = err.response?.data?.error?.message;

        // Map error codes to user-friendly Vietnamese messages
        const errorMap = {
          INVALID_USER_ID_FORMAT:
            PARTNER_MESSAGES.VALIDATION.USER_ID_INVALID_FORMAT,
          USER_NOT_FOUND: PARTNER_MESSAGES.VALIDATION.USER_NOT_FOUND,
          INVALID_PARTNER_ID_FORMAT:
            PARTNER_MESSAGES.VALIDATION.PARTNER_ID_INVALID_FORMAT,
          PARTNER_NOT_FOUND: PARTNER_MESSAGES.VALIDATION.PARTNER_NOT_FOUND,
          PARTNER_ALREADY_ASSIGNED:
            PARTNER_MESSAGES.VALIDATION.PARTNER_ALREADY_ASSIGNED,
          INVALID_PARTNER_STATUS: PARTNER_MESSAGES.VALIDATION.PARTNER_INACTIVE,
          USER_DEACTIVATED: PARTNER_MESSAGES.VALIDATION.USER_DEACTIVATED,
          UNAUTHORIZED: PARTNER_MESSAGES.AUTH.UNAUTHORIZED,
          TOKEN_EXPIRED: PARTNER_MESSAGES.AUTH.TOKEN_EXPIRED,
          FORBIDDEN: PARTNER_MESSAGES.AUTH.FORBIDDEN,
          CONFLICT: PARTNER_MESSAGES.BUSINESS.CONCURRENT_UPDATE,
          INVALID_OPERATION: PARTNER_MESSAGES.BUSINESS.INVALID_OPERATION,
        };

        const displayMessage =
          errorMap[errorCode] || PARTNER_MESSAGES.NETWORK.GENERIC_ERROR;
        message.error(displayMessage);

        throw err;
      }
    },
    []
  );

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
      label: province.name,
      value: province.name, // Use name for filtering
      code: province.code,
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
    wards,
    fetchWards,
  };
}
