import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addGuarantee } from "../../../services/market/guaranteeService.js";
import { getProduct } from "../../../services/market/productService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

function AddGuarantee() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price_increase: "",
  });
  const [errors, setErrors] = useState({
    name: null,
    duration: null,
    price_increase: null,
  });

  // تابع اعتبارسنجی جداگانه
  const validateForm = (data) => {
    const newErrors = {
      name: null,
      duration: null,
      price_increase: null,
    };
    if (!data.name.trim()) newErrors.name = "نام گارانتی الزامی است";
    else if (data.name.trim().length < 3) newErrors.name = "نام گارانتی باید حداقل 3 کاراکتر باشد";
    if (data.duration === "" || isNaN(data.duration) || Number(data.duration) <= 0)
      newErrors.duration = "مدت گارانتی باید عدد مثبت باشد";
    if (data.price_increase === "" || isNaN(data.price_increase) || Number(data.price_increase) <= 0)
      newErrors.price_increase = "افزایش قیمت باید عدد مثبت باشد";
    return newErrors;
  };

  // اجرای اعتبارسنجی هر وقت formData تغییر کرد
  useEffect(() => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    console.log("خطاهای اعتبارسنجی:", validationErrors); // دیباگ
  }, [formData]);

  // بررسی معتبر بودن فرم برای فعال‌سازی دکمه
  const isFormValid = () =>
    formData.name.trim().length >= 3 &&
    !isNaN(formData.duration) && Number(formData.duration) > 0 &&
    !isNaN(formData.price_increase) && Number(formData.price_increase) > 0;

  // دریافت محصول با useQuery
  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await getProduct(productId);
      console.log("پاسخ getProduct:", response.data); // دیباگ
      return response.data.data || {};
    },
    onError: (error) => {
      console.error("خطا در دریافت محصول:", error);
      showError(error.response?.data?.error || "خطا در دریافت اطلاعات محصول");
    },
  });

  // افزودن گارانتی با useMutation
  const mutation = useMutation({
    mutationFn: (payload) => addGuarantee(productId, payload),
    onSuccess: (response) => {
      showSuccess(response.data.message || "گارانتی با موفقیت اضافه شد");
      queryClient.invalidateQueries(["guarantees", productId]);
      navigate(`/admin/market/guarantees/${productId}`);
    },
    onError: (error) => {
      console.error("خطا در افزودن گارانتی:", error);
      if (error.response?.status === 422) {
        showError("فیلدها نامعتبر هستند");
        const validationErrors = error.response.data.errors || {};
        setErrors(
          Object.keys(validationErrors).reduce(
            (acc, key) => ({
              ...acc,
              [key]: Array.isArray(validationErrors[key])
                ? validationErrors[key][0]
                : validationErrors[key],
            }),
            { name: null, duration: null, price_increase: null }
          )
        );
      } else {
        showError(error.response?.data?.error || "افزودن گارانتی با خطا مواجه شد");
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`تغییر ورودی: ${name} = ${value}`); // دیباگ
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.values(validationErrors).some((error) => error)) {
      setErrors(validationErrors);
      showError("لطفاً خطاهای فرم را برطرف کنید");
      return;
    }

    const payload = {
      name: formData.name,
      duration: formData.duration,
      price_increase: formData.price_increase,
    };
    console.log("داده‌های ارسالی به API:", payload); // دیباگ
    mutation.mutate(payload);
  };

  return (
    <section className="row" dir="rtl">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>
              افزودن گارانتی برای محصول: {isProductLoading ? "در حال بارگذاری..." : product?.name || "محصول"}
            </h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <div>
              <Link to={`/admin/market/guarantees/${productId}`} className="btn btn-info btn-sm">
                بازگشت
              </Link>
            </div>
          </section>

          <section>
            {productError ? (
              <div className="alert alert-danger">
                {productError.response?.data?.error || "خطا در دریافت اطلاعات محصول"}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <section className="row">
                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="name">نام گارانتی</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-control form-control-sm ${errors.name ? "is-invalid" : ""}`}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="duration">مدت گارانتی (ماه)</label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className={`form-control form-control-sm ${errors.duration ? "is-invalid" : ""}`}
                        min="1"
                      />
                      {errors.duration && <div className="invalid-feedback">{errors.duration}</div>}
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="price_increase">افزایش قیمت</label>
                      <input
                        type="number"
                        name="price_increase"
                        value={formData.price_increase}
                        onChange={handleChange}
                        className={`form-control form-control-sm ${errors.price_increase ? "is-invalid" : ""}`}
                        min="0"
                      />
                      {errors.price_increase && <div className="invalid-feedback">{errors.price_increase}</div>}
                    </div>
                  </section>

                  <section className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm"
                      disabled={mutation.isPending || !isFormValid()}
                    >
                      {mutation.isPending ? "در حال ثبت..." : "ثبت"}
                    </button>
                    {mutation.isError && (
                      <div className="alert alert-danger mt-2">
                        {mutation.error.response?.data?.error || "افزودن گارانتی با خطا مواجه شد"}
                      </div>
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

export default AddGuarantee;