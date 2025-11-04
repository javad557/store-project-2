import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editProfile } from "../../services/user/customerUserService";
import { showError, showSuccess } from "../../../utils/notifications";

function EditProfile() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // مقداردهی اولیه با بررسی user برای جلوگیری از undefined
  const [formData, setFormData] = useState({
    name: user?.name || "",
    last_name: user?.last_name || "",
    mobile: user?.mobile || "",
    email: user?.email || "",
    national_code: user?.national_code || "",
  });

  const [errors, setErrors] = useState({
    name: null,
    last_name: null,
    mobile: null,
    email: null,
    national_code: null,
  });

  // تابع اعتبارسنجی برای هر فیلد
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "نام الزامی است";
        if (value.trim().length < 3) return "نام باید حداقل 3 کاراکتر باشد";
        return null;
      case "last_name":
        if (!value.trim()) return "نام خانوادگی الزامی است";
        if (value.trim().length < 3) return "نام خانوادگی باید حداقل 3 کاراکتر باشد";
        return null;
      case "mobile":
        if (!value.trim()) return "شماره موبایل الزامی است";
        if (!/^\d{10,15}$/.test(value.trim())) return "شماره موبایل باید بین 10 تا 15 رقم باشد";
        return null;
      case "email":
        if (!value.trim()) return "ایمیل الزامی است";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "ایمیل نامعتبر است";
        return null;
      case "national_code":
        if (!value.trim()) return "کد ملی الزامی است";
        if (!/^\d{10}$/.test(value.trim())) return "کد ملی باید 10 رقم باشد";
        return null;
      default:
        return null;
    }
  };

  // اعتبارسنجی همه فیلدها وقتی formData تغییر می‌کنه
  useEffect(() => {
    const newErrors = {
      name: validateField("name", formData.name),
      last_name: validateField("last_name", formData.last_name),
      mobile: validateField("mobile", formData.mobile),
      email: validateField("email", formData.email),
      national_code: validateField("national_code", formData.national_code),
    };
    setErrors(newErrors);
  }, [formData]); // وابستگی به formData

  // بررسی وجود خطا برای غیرفعال کردن دکمه
  const hasErrors = Object.values(errors).some((error) => error !== null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // اگر خطایی وجود داشت، فرم ارسال نشه
    if (hasErrors) {
      showError("لطفاً خطاهای فرم را برطرف کنید");
      return;
    }

    mutation.mutate({
      name: formData.name,
      last_name: formData.last_name,
      mobile: formData.mobile,
      email: formData.email,
      national_code: formData.national_code,
    });
  };

  const mutation = useMutation({
    mutationFn: (updatedData) => editProfile(updatedData),
    onSuccess: (response) => {
      showSuccess(response.data.message);
      queryClient.invalidateQueries(["user"]);
      navigate("/main/profile/my-profile");
    },
    onError: (error) => {
      if (error.response?.status === 422) {
        showError("مقادیر فرم‌ها معتبر نیستند");
        const validationErrors = error.response.data.errors || {};
        setErrors({
          name: validationErrors.name?.[0] || null,
          last_name: validationErrors.last_name?.[0] || null,
          mobile: validationErrors.mobile?.[0] || null,
          email: validationErrors.email?.[0] || null,
          national_code: validationErrors.national_code?.[0] || null,
        });
      } else {
        showError(error.response?.data?.error || "خطایی رخ داد");
      }
    },
  });

  return (
    <section className="row">
      <section className="content-wrapper bg-white p-3 rounded-2 mb-2">
        {/* start content header */}
        <section className="content-header mb-4">
          <section className="d-flex justify-content-between align-items-center">
            <h2 className="content-header-title">
              <span>ویرایش اطلاعات حساب</span>
            </h2>
            <section className="content-header-link m-2">
              <Link className="btn btn-danger text-white" to="/main/profile/my-profile">
                بازگشت
              </Link>
            </section>
          </section>
        </section>
        {/* end content header */}

        {loading ? (
          <div className="text-center my-4">
            <p>در حال بارگذاری...</p>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">در حال بارگذاری...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <section className="row">
              <section className="col-12 col-md-6 mb-2">
                <div className="form-group">
                  <label htmlFor="name" className="form-label mb-1">
                    نام
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${errors.name ? "is-invalid" : ""}`}
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
              </section>

              <section className="col-12 col-md-6 mb-2">
                <div className="form-group">
                  <label htmlFor="last_name" className="form-label mb-1">
                    نام خانوادگی
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${errors.last_name ? "is-invalid" : ""}`}
                    name="last_name"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                  {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                </div>
              </section>

              <section className="col-12 col-md-6 mb-2">
                <div className="form-group">
                  <label htmlFor="mobile" className="form-label mb-1">
                    شماره تلفن همراه
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${errors.mobile ? "is-invalid" : ""}`}
                    name="mobile"
                    id="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                  {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                </div>
              </section>

              <section className="col-12 col-md-6 mb-2">
                <div className="form-group">
                  <label htmlFor="email" className="form-label mb-1">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    className={`form-control form-control-sm ${errors.email ? "is-invalid" : ""}`}
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
              </section>

              <section className="col-12 col-md-6 mb-2">
                <div className="form-group">
                  <label htmlFor="national_code" className="form-label mb-1">
                    کد ملی
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${errors.national_code ? "is-invalid" : ""}`}
                    name="national_code"
                    id="national_code"
                    value={formData.national_code}
                    onChange={handleChange}
                  />
                  {errors.national_code && <div className="invalid-feedback">{errors.national_code}</div>}
                </div>
              </section>

              <section className="col-12 py-2">
                <button
                  type="submit"
                  className="btn btn-sm btn-primary"
                  disabled={mutation.isLoading || hasErrors}
                >
                  {mutation.isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      در حال ارسال...
                    </>
                  ) : (
                    "ثبت تغییرات"
                  )}
                </button>
              </section>
            </section>
          </form>
        )}
      </section>
    </section>
  );
}

export default EditProfile;