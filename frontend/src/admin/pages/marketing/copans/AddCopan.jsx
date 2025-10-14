// src/admin/pages/marketing/AddCopan.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addCopan } from "../../../services/marketing/discountService.js";
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

function AddCopan() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: "",
    user_id: null,
    amount: "",
    end_date: null, // برای DatePicker
    end_date_server: "", // برای ارسال به سرور
  });
  const [errors, setErrors] = useState({
    form: null,
    code: null,
    user_id: null,
    amount: null,
    end_date: null,
  });

  // دریافت لیست کاربران با useQuery
  const {
    data: users = [],
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
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
    onError: (error) => {
      console.error("Error fetching users:", error);
      showError(error.response?.data?.error || "خطا در بارگذاری کاربران");
    },
  });

  // افزودن کد تخفیف جدید با useMutation
  const addMutation = useMutation({
    mutationFn: (payload) => addCopan(payload),
    onSuccess: (response) => {
      showSuccess(response.data?.message || "کد تخفیف با موفقیت اضافه شد");
      queryClient.invalidateQueries({ queryKey: ["copans"], refetchType: "all" });
      navigate("/admin/marketing/copans", { replace: true });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || "خطا در افزودن کد تخفیف";
      setErrors((prev) => ({ ...prev, form: errorMessage }));
      showError(errorMessage);
    },
  });

  // مدیریت تغییرات ورودی‌ها
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // مدیریت انتخاب کاربر
  const handleUserChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      user_id: selectedOption ? selectedOption.value : null,
    }));
    setErrors((prev) => ({ ...prev, user_id: null }));
  };

  // مدیریت انتخاب تاریخ
  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = date.toDate().toISOString().split("T")[0]; // فرمت YYYY-MM-DD
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
    setErrors((prev) => ({ ...prev, end_date: null }));
  };

  // اعتبارسنجی فرم
  const validateForm = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = "کد تخفیف الزامی است";
    if (!formData.user_id) newErrors.user_id = "انتخاب کاربر الزامی است";
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0)
      newErrors.amount = "میزان تخفیف باید عدد مثبت باشد";
    if (!formData.end_date_server) newErrors.end_date = "تاریخ انقضا الزامی است";
    return newErrors;
  };

  // ارسال فرم
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...validationErrors }));
      return;
    }

    const payload = {
      code: formData.code,
      user_id: formData.user_id,
      amount: Number(formData.amount),
      end_date: formData.end_date_server,
    };
    console.log("Sending add copan payload:", payload);
    addMutation.mutate(payload);
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
            <h5>ایجاد کد تخفیف</h5>
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
            {isUsersError && (
              <div className="text-center text-danger mb-4">
                خطا در بارگذاری کاربران: {usersError.response?.data?.error || "لطفاً دوباره تلاش کنید."}
              </div>
            )}
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
                      inputClass="rmdp-input"
                      placeholder="انتخاب تاریخ (مثال: ۱۴۰۴/۰۶/۱۲)"
                      format="YYYY/MM/DD"
                      calendarPosition="bottom-right"
                    />
                    {errors.end_date && <div style={styles.error}>{errors.end_date}</div>}
                  </div>
                </section>

                <section className="col-12">
                  <button
                    type="submit"
                    className="btn btn-success btn-sm"
                    disabled={addMutation.isPending}
                  >
                    {addMutation.isPending ? "در حال ثبت..." : "تأیید"}
                  </button>
                  {errors.form && (
                    <div className="text-danger mt-2">{errors.form}</div>
                  )}
                </section>
              </section>
            </form>
          </section>
        </section>
      </section>
    </section>
  );
}

export default AddCopan;