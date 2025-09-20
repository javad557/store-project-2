import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { showSuccess, showError } from "../../../utils/notifications.jsx";
import { getDelivery, updateDelivery } from "../../services/deliveryService.js";
import "bootstrap/dist/css/bootstrap.min.css";

function EditDelivery() {
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
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // دریافت اطلاعات روش ارسال
  useEffect(() => {
    const fetchDelivery = async () => {
      setIsLoading(true);
      try {
        const response = await getDelivery(id);
        setFormData({
          name: response.data.name || "",
          amount: response.data.amount?.toString() || "",
          delivery_time: response.data.delivery_time || "",
        });
        setFetchError(null);
      } catch (error) {
        console.error("Error fetching delivery:", error.response?.data);
        setFetchError(error.response?.data?.error || "دریافت اطلاعات روش ارسال با خطا مواجه شد");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDelivery();
  }, [id]);

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
      const response = await updateDelivery(id, {
        name: formData.name,
        amount: formData.amount ? Number(formData.amount) : "", // ارسال مقدار خام برای هماهنگی با سرور
        delivery_time: formData.delivery_time,
      });
      console.log("API response:", response);
      showSuccess(response.message);
      navigate("/admin/deliveries");
    } catch (error) {
      console.error("Error response:", error.response?.data);
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
        showError(error.response?.data?.error || "ویرایش روش ارسال با خطا مواجه شد");
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
            <h5>ویرایش روش ارسال</h5>
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

          {fetchError && (
            <div className="alert alert-danger" role="alert">
              {fetchError}
              <div className="mt-2">
                <Link to="/admin/deliveries" className="btn btn-secondary btn-sm">
                  بازگشت به لیست
                </Link>
              </div>
            </div>
          )}

          {!isLoading && !fetchError && (
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
                        disabled={fetchError}
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
                        disabled={fetchError}
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
                        disabled={fetchError}
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
                        disabled={isLoading || fetchError}
                      >
                        {isLoading ? "در حال ثبت..." : "ویرایش"}
                      </button>
                    </div>
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

export default EditDelivery;