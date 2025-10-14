// src/admin/pages/marketing/EditCopan.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCopan, updateCopan } from "../../../services/marketing/discountService.js";
import { getCustomers } from "../../../services/user/customerService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaArrowRight } from "react-icons/fa";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-multi-date-picker/styles/layouts/mobile.css";

const styles = {
  error: {
    color: "red",
    fontSize: "0.875rem",
    marginTop: "0.25rem",
    marginBottom: "0",
  },
};

function EditCopan() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    code: "",
    user_id: null,
    amount: "",
    end_date: null, // برای DatePicker
    end_date_server: "", // برای ارسال به سرور
    used: "0",
    status: "1",
  });
  const [errors, setErrors] = useState({
    form: null,
    code: null,
    user_id: null,
    amount: null,
    end_date: null,
  });

  // تابع اعتبارسنجی فرم
  const validateForm = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = "کد تخفیف الزامی است";
    if (!formData.user_id) newErrors.user_id = "انتخاب کاربر الزامی است";
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0)
      newErrors.amount = "میزان تخفیف باید عدد مثبت باشد";
    if (!formData.end_date_server) newErrors.end_date = "تاریخ انقضا الزامی است";
    return newErrors;
  };

  // اعتبارسنجی پویا با تغییر formData
  useEffect(() => {
    const validationErrors = validateForm();
    setErrors((prev) => ({
      ...prev,
      code: validationErrors.code || null,
      user_id: validationErrors.user_id || null,
      amount: validationErrors.amount || null,
      end_date: validationErrors.end_date || null,
    }));
  }, [formData]);

  // دریافت اطلاعات کد تخفیف
  const {
    data: copan,
    isLoading: isCopanLoading,
    isError: isCopanError,
    error: copanError,
    isSuccess: isCopanSuccess,
  } = useQuery({
    queryKey: ["copan", id],
    queryFn: async () => {
      const response = await getCopan(id);
      console.log("Raw copan response:", response);
      console.log("Copan data:", response.data);
      return response.data;
    },
  });

  // تنظیم formData بعد از موفقیت دریافت کد تخفیف
  useEffect(() => {
    if (isCopanSuccess && copan) {
      setFormData({
        code: copan.code || "",
        user_id: copan.user_id || null,
        amount: copan.amount ? copan.amount.toString() : "",
        end_date: copan.end_date ? new DateObject(copan.end_date) : null,
        end_date_server: copan.end_date || "",
        used: copan.used != null ? copan.used.toString() : "0",
        status: copan.status != null ? copan.status.toString() : "1",
      });
    }
  }, [isCopanSuccess, copan]);

  // مدیریت خطای دریافت کد تخفیف
  useEffect(() => {
    if (isCopanError && copanError) {
      console.error("Error fetching copan:", copanError);
      showError(copanError.response?.data?.error || "خطا در دریافت اطلاعات کد تخفیف");
      setErrors((prev) => ({ ...prev, form: "خطا در دریافت اطلاعات کد تخفیف" }));
    }
  }, [isCopanError, copanError]);

  // دریافت لیست کاربران
  const {
    data: users = [],
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
    isSuccess: isUsersSuccess,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await getCustomers();
      console.log("Raw customers response:", response);
      console.log("Users data:", response.data);
      return Array.isArray(response.data)
        ? response.data.map((user) => ({
            value: user.id,
            label: `${user.name} (${user.email})`,
          }))
        : [];
    },
  });

  // مدیریت خطای دریافت کاربران
  useEffect(() => {
    if (isUsersError && usersError) {
      console.error("Error fetching users:", usersError);
      showError(usersError.response?.data?.error || "خطا در دریافت لیست کاربران");
      setErrors((prev) => ({ ...prev, form: "خطا در دریافت لیست کاربران" }));
    }
  }, [isUsersError, usersError]);

  // به‌روزرسانی کد تخفیف
  const updateMutation = useMutation({
    mutationFn: (payload) => updateCopan(id, payload),
    onSuccess: (response) => {
      showSuccess(response.data?.message || "کد تخفیف با موفقیت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["copans"], refetchType: "all" });
      navigate("/admin/marketing/copans", { replace: true });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        Object.values(error.response?.data?.errors || {}).flat().join(" ") ||
        "خطا در ویرایش کد تخفیف";
      setErrors((prev) => ({ ...prev, form: errorMessage }));
      showError(errorMessage);
    },
  });

  // مدیریت تغییرات ورودی‌ها
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, form: null }));
  };

  // مدیریت انتخاب کاربر
  const handleUserChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      user_id: selectedOption ? selectedOption.value : null,
    }));
    setErrors((prev) => ({ ...prev, form: null }));
  };

  // مدیریت انتخاب تاریخ
  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = date.toDate().toISOString().split("T")[0];
      setFormData((prev) => ({
        ...prev,
        end_date: date,
        end_date_server: formattedDate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        end_date: null,
        end_date_server: "",
      }));
    }
    setErrors((prev) => ({ ...prev, form: null }));
  };

  // ارسال فرم
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...validationErrors, form: null }));
      showError("لطفاً خطاهای فرم را برطرف کنید");
      return;
    }

    const payload = {
      code: formData.code,
      user_id: formData.user_id,
      amount: Number(formData.amount) || 0,
      end_date: formData.end_date_server,
      used: Number(formData.used) || 0,
      status: Number(formData.status) || 1,
    };
    console.log("Sending update copan payload:", payload);
    updateMutation.mutate(payload);
  };

  return (
    <section className="row" dir="rtl">
      <style>
        {`
          .rmdp-container {
            width: 100%;
          }
          .rmdp-input {
            width: 100%;
            height: 38px;
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
            line-height: 1.5;
            border-radius: 0.25rem;
            border: 1px solid #ced4da;
            background-color: #fff;
            color: #495057;
          }
          .rmdp-input:focus {
            border-color: #80bdff;
            outline: 0;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
          }
          .form-group {
            margin-bottom: 1.5rem;
          }
          .btn-sm {
            min-width: 120px;
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
            line-height: 1.5;
          }
        `}
      </style>
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>ویرایش کد تخفیف</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <button
              className="btn btn-info btn-sm"
              onClick={() => navigate("/admin/marketing/copans")}
            >
              <FaArrowRight /> بازگشت
            </button>
          </section>

          <section>
            {isCopanLoading ? (
              <div className="text-center my-4">در حال بارگذاری...</div>
            ) : isCopanError ? (
              <div className="text-center text-danger my-4">
                خطا در دریافت اطلاعات کد تخفیف: {copanError.response?.data?.error || "لطفاً دوباره تلاش کنید."}
              </div>
            ) : isUsersError ? (
              <div className="text-center text-danger my-4">
                خطا در دریافت لیست کاربران: {usersError.response?.data?.error || "لطفاً دوباره تلاش کنید."}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <section className="row">
                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="code">کد تخفیف</label>
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        className={`form-control form-control-sm ${errors.code ? "is-invalid" : ""}`}
                        required
                      />
                      {errors.code && <div style={styles.error}>{errors.code}</div>}
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="user_id">کاربر</label>
                      <Select
                        options={users}
                        onChange={handleUserChange}
                        placeholder="جستجوی کاربر..."
                        isClearable
                        isLoading={isUsersLoading}
                        value={users.find((user) => user.value === formData.user_id) || null}
                        className={errors.user_id ? "is-invalid" : ""}
                      />
                      {errors.user_id && <div style={styles.error}>{errors.user_id}</div>}
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="amount">میزان تخفیف</label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className={`form-control form-control-sm ${errors.amount ? "is-invalid" : ""}`}
                        min="0"
                        required
                      />
                      {errors.amount && <div style={styles.error}>{errors.amount}</div>}
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="end_date">تاریخ انقضا</label>
                      <DatePicker
                        id="end_date"
                        name="end_date"
                        calendar={persian}
                        locale={persian_fa}
                        value={formData.end_date}
                        onChange={handleDateChange}
                        className="rmdp-mobile"
                        inputClass={`rmdp-input ${errors.end_date ? "is-invalid" : ""}`}
                        placeholder="انتخاب تاریخ (مثال: ۱۴۰۴/۰۶/۱۲)"
                        format="YYYY/MM/DD"
                        calendarPosition="bottom-right"
                      />
                      {errors.end_date && <div style={styles.error}>{errors.end_date}</div>}
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="used">وضعیت استفاده</label>
                      <select
                        id="used"
                        name="used"
                        className="form-control form-control-sm"
                        value={formData.used}
                        onChange={handleInputChange}
                      >
                        <option value="0">استفاده‌نشده</option>
                        <option value="1">استفاده‌شده</option>
                      </select>
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="status">وضعیت فعال بودن</label>
                      <select
                        id="status"
                        name="status"
                        className="form-control form-control-sm"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="1">فعال</option>
                        <option value="0">غیرفعال</option>
                      </select>
                    </div>
                  </section>

                  <section className="col-12">
                    <button
                      type="submit"
                      className="btn btn-success btn-sm"
                      disabled={updateMutation.isPending || Object.keys(errors).some(
                        (key) => key !== "form" && errors[key]
                      )}
                    >
                      {updateMutation.isPending ? "در حال ثبت..." : "تأیید"}
                    </button>
                    {errors.form && (
                      <div className="text-danger mt-2">{errors.form}</div>
                    )}
                  </section>
                </section>
              </form>
            )}
          </section>
        </section>
      </section>
    </section>
  );
}

export default EditCopan;