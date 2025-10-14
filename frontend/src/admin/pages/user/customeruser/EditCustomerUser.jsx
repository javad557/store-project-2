import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomer, updateCustomer } from "../../../services/user/customerService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
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

function EditCustomerUser() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    mobile: "",
    national_code: "",
    birthdate: null,
    birthdate_server: null,
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({
    form: null,
    name: null,
    last_name: null,
    email: null,
    mobile: null,
    national_code: null,
    birthdate: null,
    password: [],
    password_confirmation: null,
  });

  // بررسی تغییرات فرم برای هشدار خروج
  const isFormDirty = useMemo(() => {
    return Object.values(formData).some((value) => (typeof value === "string" ? !!value : !!value));
  }, [formData]);

  // دریافت اطلاعات کاربر با useQuery
  const { data: customerData, isLoading: isCustomerLoading, isSuccess: isCustomerSuccess } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const response = await getCustomer(id);
      if (!response.data) {
        throw new Error("داده‌های کاربر دریافت نشد");
      }
      return response.data;
    },
    onError: (error) => {
      console.error("خطا در دریافت اطلاعات کاربر:", error);
      showError(error.response?.data?.error || "خطا در دریافت اطلاعات کاربر");
      navigate("/admin/user/customerusers");
    },
  });

  // پر کردن formData بعد از دریافت داده‌ها
  useEffect(() => {
    if (isCustomerSuccess && customerData) {
      setFormData({
        name: customerData.name || "",
        last_name: customerData.last_name || "",
        email: customerData.email || "",
        mobile: customerData.mobile || "",
        national_code: customerData.national_code || "",
        birthdate: customerData.birthdate ? new DateObject(customerData.birthdate) : null,
        birthdate_server: customerData.birthdate || null,
        password: "",
        password_confirmation: "",
      });
      console.log("User Response:", customerData);
    }
  }, [isCustomerSuccess, customerData]);

  // به‌روزرسانی کاربر با useMutation
  const updateMutation = useMutation({
    mutationFn: (customerData) => updateCustomer(id, customerData),
    onSuccess: (response) => {
      showSuccess(response.data?.message || "کاربر با موفقیت ویرایش شد");
      queryClient.invalidateQueries(["customers"]);
      navigate("/admin/user/customerusers");
    },
    onError: (error) => {
      console.error("خطا در به‌روزرسانی کاربر:", error);
      const errorData = error.response?.data;
      let errorMessage = errorData?.message || errorData?.error || "خطا در به‌روزرسانی کاربر";

      if (errorData?.errors) {
        const serverErrors = { form: "لطفاً خطاهای فرم را بررسی کنید." };
        Object.keys(errorData.errors).forEach((key) => {
          serverErrors[key] = Array.isArray(errorData.errors[key])
            ? errorData.errors[key]
            : [errorData.errors[key]];
        });
        setErrors(serverErrors);
        errorMessage = "لطفاً خطاهای فرم را بررسی کنید.";
      } else {
        setErrors((prev) => ({ ...prev, form: errorMessage }));
      }
      showError(errorMessage);
    },
  });

  // مدیریت تغییرات ورودی‌ها
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: name === "password" ? [] : null }));
  };

  // مدیریت انتخاب تاریخ
  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = date.toDate().toISOString().split("T")[0];
      setFormData((prev) => ({
        ...prev,
        birthdate: date,
        birthdate_server: formattedDate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        birthdate: null,
        birthdate_server: null,
      }));
    }
    setErrors((prev) => ({ ...prev, birthdate: null }));
  };

  // ارسال فرم
  const handleSubmit = async (e) => {
    e.preventDefault();
    const customerData = {
      name: formData.name || null,
      last_name: formData.last_name || null,
      email: formData.email || null,
      mobile: formData.mobile || null,
      national_code: formData.national_code || null,
      birthdate: formData.birthdate_server || null,
      password: formData.password || null,
      password_confirmation: formData.password_confirmation || null,
    };
    console.log("Data sent to API:", JSON.stringify(customerData, null, 2));
    updateMutation.mutate(customerData);
  };

  // نمایش لودینگ
  if (isCustomerLoading) {
    return <div>در حال بارگذاری...</div>;
  }

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
        `}
      </style>
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>ویرایش کاربر مشتری</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link
              to="/admin/user/customerusers"
              className="btn btn-primary btn-sm"
              onClick={(e) => {
                if (isFormDirty && !window.confirm("آیا مطمئن هستید که می‌خواهید بدون ذخیره خارج شوید؟")) {
                  e.preventDefault();
                }
              }}
            >
              بازگشت
            </Link>
          </section>

          <section>
            <form onSubmit={handleSubmit}>
              <section className="row">
                <section className="col-12 col-md-6">
                  <div className="form-group">
                    <label htmlFor="name">نام</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <div style={styles.error}>
                        {Array.isArray(errors.name) ? errors.name.join("، ") : errors.name}
                      </div>
                    )}
                  </div>
                </section>

                <section className="col-12 col-md-6">
                  <div className="form-group">
                    <label htmlFor="last_name">نام خانوادگی</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                    {errors.last_name && (
                      <div style={styles.error}>
                        {Array.isArray(errors.last_name) ? errors.last_name.join("، ") : errors.last_name}
                      </div>
                    )}
                  </div>
                </section>

                <section className="col-12 col-md-6">
                  <div className="form-group">
                    <label htmlFor="email">ایمیل</label>
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div style={styles.error}>
                        {Array.isArray(errors.email) ? errors.email.join("، ") : errors.email}
                      </div>
                    )}
                  </div>
                </section>

                <section className="col-12 col-md-6">
                  <div className="form-group">
                    <label htmlFor="mobile">شماره موبایل</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                    {errors.mobile && (
                      <div style={styles.error}>
                        {Array.isArray(errors.mobile) ? errors.mobile.join("، ") : errors.mobile}
                      </div>
                    )}
                  </div>
                </section>

                <section className="col-12 col-md-6">
                  <div className="form-group">
                    <label htmlFor="national_code">کد ملی</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="national_code"
                      value={formData.national_code}
                      onChange={handleChange}
                    />
                    {errors.national_code && (
                      <div style={styles.error}>
                        {Array.isArray(errors.national_code) ? errors.national_code.join("، ") : errors.national_code}
                      </div>
                    )}
                  </div>
                </section>

                <section className="col-12 col-md-6">
                  <div className="form-group">
                    <label htmlFor="birthdate">تاریخ تولد</label>
                    <DatePicker
                      id="birthdate"
                      name="birthdate"
                      calendar={persian}
                      locale={persian_fa}
                      value={formData.birthdate || ""}
                      onChange={handleDateChange}
                      className="rmdp-mobile"
                      inputClass="rmdp-input"
                      placeholder="انتخاب تاریخ (مثال: ۱۴۰۴/۰۶/۱۲)"
                      format="YYYY/MM/DD"
                      calendarPosition="bottom-right"
                      disableYearPicker
                      disableMonthPicker
                    />
                    {errors.birthdate && (
                      <div style={styles.error}>
                        {Array.isArray(errors.birthdate) ? errors.birthdate.join("، ") : errors.birthdate}
                      </div>
                    )}
                  </div>
                </section>

                <section className="col-12">
                  <button
                    type="submit"
                    className="btn btn-success btn-sm"
                    disabled={updateMutation.isLoading}
                  >
                    {updateMutation.isLoading ? "در حال ثبت..." : "تأیید"}
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

export default EditCustomerUser;