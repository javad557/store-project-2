import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../../utils/notifications.jsx";
import { addDelivery } from "../../services/deliveryService.js";
import "bootstrap/dist/css/bootstrap.min.css";

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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({
      name: null,
      amount: null,
      delivery_time: null,
    });

    try {
      const response = await addDelivery({
        name: formData.name,
        amount: formData.amount ? Number(formData.amount) : "", // ارسال مقدار خام برای هماهنگی با سرور
        delivery_time: formData.delivery_time,
      });
      console.log("API response:", response); // لاگ برای دیباگ
      showSuccess(response.message); // نمایش پیام موفقیت
      navigate("/admin/deliveries");
    } catch (error) {
      console.error("Error response:", error.response?.data); // لاگ خطا
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
        showError("لطفاً خطاهای فرم را بررسی کنید.");
      } else {
        showError(error.response?.data?.error || "افزودن روش ارسال با خطا مواجه شد");
      }
    } finally {
      setIsLoading(false);
    }
  };

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

          {isLoading && (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">در حال بارگذاری...</span>
            </div>
          )}

          <section>
            <form onSubmit={handleSubmit}>
              <section className="row">
                <section className="col-12 col-md-6">
                  <div className="form-group">
                    <label htmlFor="name">نام روش ارسال</label>
                    <input
                      type="text"
                      className={`form-control form-control-sm ${errors.name ? "is-invalid" : ""}`}
                      name="name"
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
                      disabled={isLoading}
                    >
                      {isLoading ? "در حال ثبت..." : "افزودن"}
                    </button>
                  </div>
                </section>
              </section>
            </form>
          </section>
        </section>
      </section>
    </section>
  );
}

export default AddDelivery;