import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCustomer, updateCustomer } from "../../../services/user/customerService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
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
    password: [], // آرایه برای نمایش چندین خطای رمز عبور
    password_confirmation: null,
  });
  const [loading, setLoading] = useState({
    form: false,
    customer: true,
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const hasFetched = useRef(false);

  const isFormDirty = useMemo(() => {
    return Object.values(formData).some((value) => (typeof value === "string" ? !!value : !!value));
  }, [formData]);

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      setLoading((prev) => ({ ...prev, customer: true }));
      try {
        const userResponse = await getCustomer(id);
        if (!userResponse.data) {
          throw new Error("داده‌های کاربر دریافت نشد");
        }
        setFormData({
          name: userResponse.data.name || "",
          last_name: userResponse.data.last_name || "",
          email: userResponse.data.email || "",
          mobile: userResponse.data.mobile || "",
          national_code: userResponse.data.national_code || "",
          birthdate: userResponse.data.birthdate ? new DateObject(userResponse.data.birthdate) : null,
          birthdate_server: userResponse.data.birthdate || null,
          password: "",
          password_confirmation: "",
        });
        console.log("User Response:", userResponse.data);
      } catch (error) {
        console.error("خطا در دریافت اطلاعات کاربر:", error);
        showError("خطا در دریافت اطلاعات کاربر");
        navigate("/admin/user/customerusers");
      } finally {
        setLoading((prev) => ({ ...prev, customer: false }));
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: name === 'password' ? [] : null }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, form: true }));
    setErrors({ form: null, name: null, last_name: null, email: null, mobile: null, national_code: null, birthdate: null, password: [], password_confirmation: null });
    try {
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
      const response = await updateCustomer(id, customerData);
      showSuccess(response.message || "کاربر با موفقیت ویرایش شد");
      navigate("/admin/user/customerusers");
    } catch (error) {
      console.error("خطا در به‌روزرسانی کاربر:", error);
      const errorData = error.response?.data;
      let errorMessage = errorData?.message || errorData?.error || "خطا در به‌روزرسانی کاربر";
      if (errorData?.errors) {
        const serverErrors = {};
        Object.keys(errorData.errors).forEach((key) => {
          serverErrors[key] = Array.isArray(errorData.errors[key])
            ? errorData.errors[key]
            : [errorData.errors[key]];
        });
        setErrors((prev) => ({ ...prev, form: "لطفاً خطاهای فرم را بررسی کنید.", ...serverErrors }));
        errorMessage = "لطفاً خطاهای فرم را بررسی کنید.";
      }
      showError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };

  if (loading.customer) {
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
                    {errors.name && <div style={styles.error}>{errors.name}</div>}
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
                    {errors.last_name && <div style={styles.error}>{errors.last_name}</div>}
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
                    {errors.email && <div style={styles.error}>{errors.email}</div>}
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
                    {errors.mobile && <div style={styles.error}>{errors.mobile}</div>}
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
                    {errors.national_code && <div style={styles.error}>{errors.national_code}</div>}
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
                    {errors.birthdate && <div style={styles.error}>{errors.birthdate}</div>}
                  </div>
                </section>

                <section className="col-12 col-md-6">
                  <div className="form-group">
                    <label htmlFor="password">رمز عبور</label>
                    <input
                      type="password"
                      className="form-control form-control-sm"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="برای تغییر رمز عبور، مقدار جدید وارد کنید"
                    />
                    {errors.password && errors.password.length > 0 && (
                      <div style={styles.error}>{errors.password.join('، ')}</div>
                    )}
                  </div>
                </section>

                <section className="col-12 col-md-6">
                  <div className="form-group">
                    <label htmlFor="password_confirmation">تأیید رمز عبور</label>
                    <input
                      type="password"
                      className="form-control form-control-sm"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      placeholder="تأیید رمز عبور جدید"
                    />
                    {errors.password_confirmation && (
                      <div style={styles.error}>{errors.password_confirmation}</div>
                    )}
                  </div>
                </section>

                <section className="col-12">
                  <button
                    type="submit"
                    className="btn btn-success btn-sm"
                    disabled={loading.form}
                  >
                    {loading.form ? "در حال ثبت..." : "تأیید"}
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