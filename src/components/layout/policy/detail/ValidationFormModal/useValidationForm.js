import { Form } from "antd";
import { useEffect, useRef, useState } from "react";

export default function useValidationForm({
  open,
  latestValidation,
  validatedBy,
  mode,
  onSubmit,
  onCancel,
  basePolicyId,
}) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [useAIData, setUseAIData] = useState(false);
  const [recommendationsData, setRecommendationsData] = useState([]);
  const [mismatchesData, setMismatchesData] = useState([]);
  const [warningsData, setWarningsData] = useState([]);
  const isComposingRef = useRef(false);

  useEffect(() => {
    if (!open) return;

    if (useAIData && latestValidation) {
      const mismatchesArray = latestValidation.mismatches
        ? Object.entries(latestValidation.mismatches).map(([key, value]) => ({
            field: key,
            expected:
              typeof value.pdf_value !== "undefined"
                ? String(value.pdf_value)
                : String(value.expected || ""),
            actual:
              typeof value.json_value !== "undefined"
                ? String(value.json_value)
                : String(value.actual || ""),
            severity: value.severity || "low",
            impact: value.impact || "",
            field_type: value.field_type || "",
          }))
        : [];

      if (form && mismatchesArray.length > 0) {
        form.setFieldValue("mismatches", mismatchesArray);
      }

      const warningsArray = latestValidation.warnings
        ? Object.entries(latestValidation.warnings).map(([key, value]) => ({
            field: key,
            message:
              value.message ||
              value.pdf_context ||
              value.details ||
              value.impact ||
              "",
            recommendation: value.recommendation || "",
          }))
        : [];

      const recommendationsArray = latestValidation.recommendations
        ? Object.entries(latestValidation.recommendations).map(
            ([key, value]) => ({
              category: key,
              suggestion:
                value.suggestion ||
                (value.affected_fields
                  ? `Priority: ${value.priority || "N/A"} | Fields: ${
                      Array.isArray(value.affected_fields)
                        ? value.affected_fields.join(", ")
                        : value.affected_fields
                    }`
                  : ""),
            })
          )
        : [];

      let validationStatus = latestValidation.validation_status;
      let validationNotes = latestValidation.validation_notes || "";
      validationStatus = "passed";

      if (mode === "accept_ai") {
        validationNotes = validationNotes
          ? `${validationNotes}\n\nAdmin đã chấp nhận kết quả AI và xác nhận thủ công.`
          : "Admin đã chấp nhận kết quả AI và xác nhận thủ công. Kết quả AI được coi là chính xác.";
      } else if (mode === "override") {
        validationStatus = "passed";
        validationNotes = validationNotes
          ? `${validationNotes}\n\nAdmin ghi đè thủ công: chấp nhận policy mặc dù có lỗi.`
          : "Admin ghi đè thủ công: chấp nhận policy mặc dù có lỗi.";
      } else if (mode === "review" || mode === "fix") {
        validationStatus =
          latestValidation.failed_checks > 0 ? "failed" : "warning";
      }

      const initialValues = {
        validation_status: validationStatus || "pending",
        total_checks: latestValidation.total_checks || 0,
        passed_checks: latestValidation.passed_checks || 0,
        failed_checks: latestValidation.failed_checks || 0,
        warning_count: latestValidation.warning_count || 0,
        extraction_confidence:
          (latestValidation.extracted_parameters?.extraction_confidence ||
            0.95) * 100,
        parameters_found:
          latestValidation.extracted_parameters?.parameters_found || 0,
        document_version:
          latestValidation.extracted_parameters?.document_version || "",
        extraction_method:
          latestValidation.extracted_parameters?.extraction_method || "",
        validation_notes: validationNotes,
        mismatches: mismatchesArray,
        warnings: warningsArray,
        recommendations: recommendationsArray,
      };

      if (form) {
        form.setFieldsValue(initialValues);
        setFormValues(initialValues);
      }
      setRecommendationsData(recommendationsArray);
      setMismatchesData(mismatchesArray);
      setWarningsData(warningsArray);
    } else {
      const defaultValues = {
        validation_status: "pending",
        total_checks: 0,
        passed_checks: 0,
        failed_checks: 0,
        warning_count: 0,
        extraction_confidence: 95,
        parameters_found: 0,
        document_version: "",
        extraction_method: "",
        validation_notes: "",
        mismatches: [],
        warnings: [],
        recommendations: [],
      };

      if (form) {
        form.setFieldsValue(defaultValues);
        setFormValues(defaultValues);
      }
      setRecommendationsData([]);
      setMismatchesData([]);
      setWarningsData([]);
    }
  }, [open, latestValidation, validatedBy, mode, useAIData]);

  useEffect(() => {
    if (!form || !formValues) return;

    const currentMismatches = form.getFieldValue("mismatches") || [];
    const currentWarnings = form.getFieldValue("warnings") || [];

    const failedCount = formValues.failed_checks || 0;
    const warningCount = formValues.warning_count || 0;

    if (!useAIData) {
      if (currentMismatches.length < failedCount) {
        const newMismatches = [...currentMismatches];
        for (let i = currentMismatches.length; i < failedCount; i++) {
          newMismatches.push({
            field: "",
            expected: "",
            actual: "",
            severity: "low",
            impact: "",
            field_type: "",
          });
        }
        form.setFieldValue("mismatches", newMismatches);
      } else if (currentMismatches.length > failedCount) {
        if (failedCount === 0) {
          form.setFieldValue("mismatches", []);
        } else {
          const newMismatches = currentMismatches.slice(0, failedCount);
          form.setFieldValue("mismatches", newMismatches);
        }
      }

      if (currentWarnings.length < warningCount) {
        const newWarnings = [...currentWarnings];
        for (let i = currentWarnings.length; i < warningCount; i++) {
          newWarnings.push({ field: "", message: "", recommendation: "" });
        }
        form.setFieldValue("warnings", newWarnings);
      } else if (currentWarnings.length > warningCount) {
        if (warningCount === 0) {
          form.setFieldValue("warnings", []);
        } else {
          const newWarnings = currentWarnings.slice(0, warningCount);
          form.setFieldValue("warnings", newWarnings);
        }
      }
    }
  }, [formValues?.failed_checks, formValues?.warning_count, form, useAIData]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      let mismatchesArray = [];
      let warningsArray = [];
      let recommendationsArray = [];

      if (useAIData) {
        mismatchesArray = mismatchesData;
        warningsArray = warningsData;
        recommendationsArray = recommendationsData;
      } else {
        mismatchesArray = values.mismatches || [];
        warningsArray = values.warnings || [];
        recommendationsArray = values.recommendations || [];
      }

      const mismatchesObject = {};
      mismatchesArray.forEach((item) => {
        if (item.field) {
          mismatchesObject[item.field] = {
            expected: item.expected,
            actual: item.actual,
            severity: item.severity,
            impact: item.impact,
            field_type: item.field_type,
          };
        }
      });

      const warningsObject = {};
      warningsArray.forEach((item) => {
        if (item.field) {
          warningsObject[item.field] = {
            message: item.message,
            recommendation: item.recommendation || "",
          };
        }
      });

      const recommendationsObject = {};
      recommendationsArray.forEach((item) => {
        if (item.category) {
          recommendationsObject[item.category] = {
            suggestion: item.suggestion,
            priority: item.priority,
            affected_fields: item.affected_fields,
          };
        }
      });

      const payload = {
        base_policy_id: basePolicyId,
        validation_status:
          formValues.validation_status || values.validation_status || "pending",
        validation_notes:
          formValues.validation_notes || values.validation_notes || "",
      };

      console.log("DEBUG: Form values:", values);
      console.log("DEBUG: FormValues state:", formValues);
      console.log(
        "DEBUG: Payload validation_status:",
        payload.validation_status
      );

      if (useAIData) {
        // Khi dùng dữ liệu AI, giữ nguyên tất cả thông số từ AI
        payload.total_checks = latestValidation?.total_checks || 0;
        payload.passed_checks = latestValidation?.passed_checks || 0;
        payload.failed_checks = latestValidation?.failed_checks || 0;
        payload.warning_count = latestValidation?.warning_count || 0;

        // Add mismatches as object/map
        if (mismatchesArray.length > 0) {
          payload.mismatches = {};
          mismatchesArray.forEach((item) => {
            if (item.field) {
              payload.mismatches[item.field] = {
                expected: item.expected,
                actual: item.actual,
                severity: item.severity || "low",
              };
            }
          });
        }

        // Add warnings as object/map
        if (warningsArray.length > 0) {
          payload.warnings = {};
          warningsArray.forEach((item) => {
            if (item.field) {
              payload.warnings[item.field] = {
                message: item.message,
                recommendation: item.recommendation || "",
              };
            }
          });
        }

        // Add recommendations as object/map
        if (recommendationsArray.length > 0) {
          payload.recommendations = {};
          recommendationsArray.forEach((item) => {
            if (item.category) {
              payload.recommendations[item.category] = {
                suggestion: item.suggestion,
              };
            }
          });
        }

        // Add extracted parameters từ AI data
        if (latestValidation?.extracted_parameters) {
          payload.extracted_parameters = {
            extraction_confidence:
              latestValidation.extracted_parameters.extraction_confidence ||
              0.95,
            parameters_found:
              latestValidation.extracted_parameters.parameters_found || 0,
          };
          if (latestValidation.extracted_parameters.document_version) {
            payload.extracted_parameters.document_version =
              latestValidation.extracted_parameters.document_version;
          }
          if (latestValidation.extracted_parameters.extraction_method) {
            payload.extracted_parameters.extraction_method =
              latestValidation.extracted_parameters.extraction_method;
          }
        }
      } else {
        // Khi nhập thủ công, lấy từ form values
        payload.total_checks = values.total_checks || 0;
        payload.passed_checks = values.passed_checks || 0;
        payload.failed_checks = values.failed_checks || 0;
        payload.warning_count = values.warning_count || 0;

        // Add mismatches as object/map
        if (mismatchesArray.length > 0) {
          payload.mismatches = {};
          mismatchesArray.forEach((item) => {
            if (item.field) {
              payload.mismatches[item.field] = {
                expected: item.expected,
                actual: item.actual,
                severity: item.severity || "low",
              };
            }
          });
        }

        // Add warnings as object/map
        if (warningsArray.length > 0) {
          payload.warnings = {};
          warningsArray.forEach((item) => {
            if (item.field) {
              payload.warnings[item.field] = {
                message: item.message,
                recommendation: item.recommendation || "",
              };
            }
          });
        }

        // Add recommendations as object/map
        if (recommendationsArray.length > 0) {
          payload.recommendations = {};
          recommendationsArray.forEach((item) => {
            if (item.category) {
              payload.recommendations[item.category] = {
                suggestion: item.suggestion,
              };
            }
          });
        }

        // Add extracted parameters
        if (
          values.extraction_confidence ||
          values.parameters_found ||
          values.document_version ||
          values.extraction_method
        ) {
          payload.extracted_parameters = {
            extraction_confidence: (values.extraction_confidence || 95) / 100,
            parameters_found: values.parameters_found || 0,
          };
          if (values.document_version)
            payload.extracted_parameters.document_version =
              values.document_version;
          if (values.extraction_method)
            payload.extracted_parameters.extraction_method =
              values.extraction_method;
        }
      }

      await onSubmit(payload);
      form.resetFields();
      setSubmitting(false);
    } catch (err) {
      console.error("Form validation error:", err);
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleValuesChange = (changedValues, allValues) => {
    // Skip updates during IME composition
    if (isComposingRef.current) return;

    // Khi dùng AI data, chỉ cập nhật validation_status và validation_notes
    // Không thay đổi các thông số AI (total_checks, passed_checks, etc.)
    if (useAIData) {
      setFormValues((prev) => {
        const updated = { ...prev };
        if ("validation_status" in changedValues) {
          updated.validation_status = changedValues.validation_status;
        }
        if ("validation_notes" in changedValues) {
          updated.validation_notes = changedValues.validation_notes;
        }
        return updated;
      });
    } else {
      // Khi manual, cập nhật tất cả
      setFormValues(allValues);
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (e) => {
    isComposingRef.current = false;
    // Trigger change after composition ends
    if (useAIData) {
      const inputValue = e.target.value;
      const fieldName = e.target.name;
      if (fieldName === "validation_notes") {
        setFormValues((prev) => ({
          ...prev,
          validation_notes: inputValue,
        }));
      }
    }
  };

  const fields = [
    {
      type: "select",
      name: "validation_status",
      label: "Trạng thái xác thực",
      placeholder: "Chọn trạng thái xác thực",
      gridColumn: "span 2",
      options: [
        { label: "Chờ duyệt", value: "pending" },
        { label: "Đã duyệt", value: "passed" },
        { label: "Cảnh báo", value: "warning" },
        // { label: "Thất bại", value: "failed" },
      ],
      rules: [{ required: true, message: "Vui lòng chọn trạng thái xác thực" }],
      disabled: false,
    },
    {
      type: "number",
      name: "total_checks",
      label: "Tổng số kiểm tra",
      placeholder: "0",
      min: 0,
      gridColumn: "span 1",
      disabled: useAIData,
      rules: [
        { required: true, message: "Bắt buộc" },
        { type: "number", min: 0, message: "Phải >= 0" },
      ],
    },
    {
      type: "number",
      name: "passed_checks",
      label: "Đạt",
      placeholder: "0",
      min: 0,
      gridColumn: "span 1",
      disabled: useAIData,
      rules: [
        { required: true, message: "Bắt buộc" },
        { type: "number", min: 0, message: "Phải >= 0" },
      ],
    },
    {
      type: "number",
      name: "failed_checks",
      label: "Lỗi",
      placeholder: "0",
      min: 0,
      gridColumn: "span 1",
      disabled: useAIData,
      rules: [
        { required: true, message: "Bắt buộc" },
        { type: "number", min: 0, message: "Phải >= 0" },
        ({ getFieldValue }) => ({
          validator(_, value) {
            const total = getFieldValue("total_checks");
            const passed = getFieldValue("passed_checks");
            if (
              total != null &&
              passed != null &&
              value != null &&
              passed + value > total
            ) {
              return Promise.reject(
                new Error("Đạt + Lỗi không được > Tổng số")
              );
            }
            return Promise.resolve();
          },
        }),
      ],
    },
    {
      type: "number",
      name: "warning_count",
      label: "Cảnh báo",
      placeholder: "0",
      min: 0,
      gridColumn: "span 1",
      disabled: useAIData,
      rules: [
        { required: true, message: "Bắt buộc" },
        { type: "number", min: 0, message: "Phải >= 0" },
      ],
    },
    {
      type: "number",
      name: "extraction_confidence",
      label: "Độ tin cậy trích xuất (%)",
      gridColumn: "span 1",
      min: 0,
      max: 100,
      step: 0.1,
      placeholder: "95",
      disabled: useAIData,
      rules: [
        { type: "number", min: 0, max: 100, message: "Phải từ 0 đến 100" },
      ],
    },
    {
      type: "number",
      name: "parameters_found",
      label: "Số tham số tìm thấy",
      placeholder: "0",
      min: 0,
      gridColumn: "span 1",
      disabled: useAIData,
      rules: [],
    },
    {
      type: "textarea",
      name: "validation_notes",
      label: "Ghi chú xác thực",
      placeholder:
        "Đã hoàn thành xem xét thủ công. Các sai lệch nhỏ đã được ghi nhận nhưng có thể chấp nhận được.",
      autoSize: { minRows: 4, maxRows: 20 },
      disabled: false,
      rules: [],
    },
  ];

  const successPercent =
    formValues?.total_checks > 0
      ? Math.round((formValues?.passed_checks / formValues?.total_checks) * 100)
      : 0;

  return {
    form,
    submitting,
    handleSubmit,
    handleCancel,
    useAIData,
    setUseAIData,
    formValues,
    handleValuesChange,
    fields,
    successPercent,
    recommendationsData,
    mismatchesData,
    warningsData,
    setRecommendationsData,
    setMismatchesData,
    setWarningsData,
    latestValidation,
    handleCompositionStart,
    handleCompositionEnd,
  };
}
