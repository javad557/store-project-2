import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addBanner, getBanner, updateBanner } from "../../../services/marketing/bannerService";
import { showError, showSuccess } from "../../../../utils/notifications";

function AddBanner() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    url: "",
    position: "",
  });

  const [errors, setErrors] = useState({
    title: null,
    image: null,
    url: null,
    position: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const inputValue = name === "image" ? files[0] : value;
    setFormData((prev) => ({ ...prev, [name]: inputValue }));
  };

  const mutation = useMutation({
    mutationFn: (updatedData) => updateBanner(id, updatedData),
    onSuccess: (response) => {
      queryClient.invalidateQueries(["banners"]);
      showSuccess(response.data.message);
      navigate("/admin/marketing/banners");
    },
    onError: (error) => {
      if (error.response.status === 422) {
        const validationErrors = error.response.data.errors || {};
        setErrors(
          Object.keys(validationErrors).reduce((acc, key) => {
            acc[key] = Array.isArray(validationErrors[key])
              ? validationErrors[key][0]
              : validationErrors[key];
            return acc;
          }, { title: null, image: null, url: null, position: null })
        );
        showError("مقادیر فرم‌ها نامعتبر هستند");
      } else {
        showError(error.response.data.error);
      }
    },
  });

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["banner", id],
    queryFn: () => getBanner(id),
  });

  // به‌روزرسانی formData با داده‌های سرور
  useEffect(() => {
    if (data?.data?.data) {
      setFormData({
        title: data.data.data.title || "",
        url: data.data.data.url || "",
        position: String(data.data.data.position) || "", // تبدیل به رشته
        image: "",
      });
    }
  }, [data]);

  // اعتبارسنجی خودکار هنگام تغییر formData
  useEffect(() => {
    const newErrors = {
      title: validateField("title", formData.title),
      url: validateField("url", formData.url),
      position: validateField("position", formData.position),
    };
    setErrors(newErrors);
  }, [formData]);

  const validateField = (name, value) => {
    switch (name) {
      case "title":
        if (!value || typeof value !== "string" || !value.trim())
          return "عنوان بنر الزامی است";
        if (value.trim().length < 3) return "عنوان بنر نباید کمتر از 3 کاراکتر باشد";
        return null;
      case "image":
        if (!value) return "تصویر بنر الزامی است";
        if (typeof value === "string") return null; // مقدار اولیه خالی معتبر است
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(value.type)) return "فقط فایل‌های JPG یا PNG مجاز هستند";
        if (value.size > 5 * 1024 * 1024) return "حجم فایل باید کمتر از 5 مگابایت باشد";
        return null;
      case "url":
        if (!value || typeof value !== "string" || !value.trim())
          return "آدرس بنر الزامی است";
        return null;
      case "position":
        if (!value && value !== 0) return "موقعیت بنر الزامی است";
        if (isNaN(value)) return "موقعیت باید یک عدد باشد";
        return null;
      default:
        return null;
    }
  };

  const isFormValid = () => {
    return !Object.values(errors).some((error) => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()){
      return
    } 
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("image", formData.image);
    submitData.append("url", formData.url);
    submitData.append("position", formData.position);
    mutation.mutate(submitData);
  };

  return (
    <section className="row" dir="rtl">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>افزودن بنر جدید</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/marketing/banners" className="btn btn-primary btn-sm">
              <i className="fa fa-arrow-right me-1"></i> بازگشت
            </Link>
          </section>
          {isLoading ? (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">در حال بارگذاری...</span>
            </div>
          ) : isError ? (
            <div className="alert alert-danger">خطا در بارگذاری اطلاعات</div>
          ) : (
            <section>
              <form onSubmit={handleSubmit}>
                <section className="row">
                  <section className="col-12">
                    <div className="form-group mb-3">
                      <label htmlFor="title" className="form-label">
                        عنوان بنر
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-sm ${errors.title ? "is-invalid" : ""}`}
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                      />
                      {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                    </div>

                    <div className="form-group mb-3">
                      <label htmlFor="image" className="form-label">
                        عکس بنر
                      </label>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        className={`form-control form-control-sm ${errors.image ? "is-invalid" : ""}`}
                        name="image"
                        onChange={handleChange}
                      />
                      {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                    </div>

                    <div className="form-group mb-3">
                      <label htmlFor="url" className="form-label">
                        آدرس URL
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-sm ${errors.url ? "is-invalid" : ""}`}
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                      />
                      {errors.url && <div className="invalid-feedback">{errors.url}</div>}
                    </div>

                    <div className="form-group mb-3">
                      <label htmlFor="position" className="form-label">
                        موقعیت بنر
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-sm ${errors.position ? "is-invalid" : ""}`}
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                      />
                      {errors.position && <div className="invalid-feedback">{errors.position}</div>}
                    </div>
                  </section>

                  <section className="col-12">
                    <button
                      type="submit"
                      className="btn btn-success btn-sm"
                      disabled={mutation.isPending || !isFormValid()}
                    >
                      <i className="fa fa-check me-1"></i>
                      {mutation.isPending ? "در حال ارسال" : "افزودن"}
                    </button>
                  </section>
                </section>
              </form>
            </section>
          )}
        </section>
      </section>
    </section>
  );
}

export default AddBanner;