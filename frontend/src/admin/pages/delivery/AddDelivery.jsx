import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDelivery } from "../../services/deliveryService";
import { showError, showSuccess } from "../../../utils/notifications";

function AddDelivery() {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    delivery_time: "",
  });

  const [errors, setErrors] = useState({
    name: null,
    amount: null,
    delivery_time: null,
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // تعریف useMutation برای افزودن روش ارسال
  const mutation = useMutation({
    mutationFn: addDelivery,
    onSuccess: (response) => {
      showSuccess(response.message);
      // منقضی کردن کش برای به‌روزرسانی لیست روش‌های ارسال
      queryClient.invalidateQueries(['deliveries']);
      navigate("/admin/deliveries");
    },
    onError: (error) => {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors || {};
        setErrors(
          Object.keys(validationErrors).reduce((acc, key) => {
            acc[key] = Array.isArray(validationErrors[key])
              ? validationErrors[key][0]
              : validationErrors[key];
            return acc;
          }, { name: null, amount: null, delivery_time: null })
        );
        showError("مقادیر فرم‌ها نامعتبر هستند");
      } else {
        showError(error.response?.data?.error || "خطا در ذخیره روش ارسال");
      }
    },
  });

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "نام روش ارسال الزامی است";
        if (value.trim().length < 3) return "نام باید حداقل 3 کاراکتر باشد";
        return null;
      case "amount":
        if (!value || Number(value) <= -1) return "هزینه باید یک عدد مثبت باشد";
        return null;
      case "delivery_time":
        if (!value.trim()) return "زمان ارسال الزامی است";
        if (value.trim().length < 3) return "زمان ارسال باید حداقل 3 کاراکتر باشد";
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // اجرای mutation با داده‌های فرم
    mutation.mutate({
      name: formData.name,
      amount: formData.amount ? Number(formData.amount) : null,
      delivery_time: formData.delivery_time,
    });
  };

  const isFormValid = () =>
    formData.name.trim().length >= 3 &&
    Number(formData.amount) > -1 &&
    formData.delivery_time.trim().length >= 3;

  return (
    <section className="row" dir="rtl">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>افزودن روش ارسال</h5>
          </section>
          <section className="d-flex justify-content-start align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/deliveries" className="btn btn-primary btn-sm">
              بازگشت
            </Link>
          </section>

          {mutation.isPending && (
            <div className="spinner-border" role="status" aria-live="polite">
              <span className="visually-hidden">در حال بارگذاری...</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <section className="row">
              <section className="col-12 col-md-6">
                <div className="form-group">
                  <label htmlFor="name">نام روش ارسال</label>
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
              <section className="col-12 col-md-6">
                <div className="form-group">
                  <label htmlFor="amount">هزینه (تومان)</label>
                  <input
                    type="number"
                    className={`form-control form-control-sm ${errors.amount ? "is-invalid" : ""}`}
                    name="amount"
                    id="amount"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                  {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                </div>
              </section>
              <section className="col-12">
                <div className="form-group">
                  <label htmlFor="delivery_time">زمان ارسال</label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${errors.delivery_time ? "is-invalid" : ""}`}
                    name="delivery_time"
                    id="delivery_time"
                    value={formData.delivery_time}
                    onChange={handleChange}
                  />
                  {errors.delivery_time && (
                    <div className="invalid-feedback">{errors.delivery_time}</div>
                  )}
                </div>
              </section>
              <section className="col-12">
                <div className="d-flex justify-content-start">
                  <button
                    type="submit"
                    className="btn btn-success btn-sm"
                    disabled={mutation.isPending || !isFormValid()}
                  >
                    {mutation.isPending ? "...در حال ارسال" : "افزودن"}
                  </button>
                </div>
              </section>
            </section>
          </form>
        </section>
      </section>
    </section>
  );
}

export default AddDelivery;