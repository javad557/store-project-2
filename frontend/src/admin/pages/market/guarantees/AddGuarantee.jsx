import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addGuarantee } from "../../../services/market/guaranteeService.js";
import { getProduct } from "../../../services/market/productService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

// اضافه کردن استایل‌های سفارشی
const styles = {
  error: {
    color: 'red',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
    marginBottom: '0',
  },
};

function AddGuarantee() {
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price_increase: "",
  });
  const [product, setProduct] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({
    form: false,
    product: true,
  });
  const navigate = useNavigate();
  const { productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(productId);
        console.log("محصول دریافت‌شده:", response.data);
        setProduct(response.data);
      } catch (error) {
        console.error("خطا در دریافت محصول:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        showError("خطا در دریافت اطلاعات محصول");
      } finally {
        setLoading((prev) => ({ ...prev, product: false }));
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "نام گارانتی الزامی است";
    if (formData.duration === "" || isNaN(formData.duration) || Number(formData.duration) <= 0)
      newErrors.duration = "مدت گارانتی باید عدد مثبت باشد";
    if (formData.price_increase === "" || isNaN(formData.price_increase) || Number(formData.price_increase) <= 0)
      newErrors.price_increase = "افزایش قیمت باید عدد مثبت باشد";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: formData.name,
      duration: formData.duration,
      price_increase: formData.price_increase,
    };
    console.log('داده‌های خام فرم:', formData);
    console.log('داده‌های ارسالی به API:', payload);

    setLoading((prev) => ({ ...prev, form: true }));
    try {
      await addGuarantee(productId, payload);
      showSuccess("گارانتی با موفقیت اضافه شد");
      navigate(`/admin/market/guarantees/${productId}`);
    } catch (error) {
      console.error("خطا در افزودن گارانتی:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 422) {
        showError(error.response.data.error || "داده‌های ارسالی نامعتبر است");
      } else {
        showError("افزودن گارانتی با خطا مواجه شد");
      }
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };

  return (
    <section className="row" dir="rtl">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>
              افزودن گارانتی برای محصول: {loading.product ? "در حال بارگذاری..." : product?.name || "محصول"}
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
                    {errors.name && <div style={styles.error}>{errors.name}</div>}
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
                    {errors.duration && <div style={styles.error}>{errors.duration}</div>}
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
                    {errors.price_increase && <div style={styles.error}>{errors.price_increase}</div>}
                  </div>
                </section>

                <section className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={loading.form}
                  >
                    {loading.form ? "در حال ثبت..." : "ثبت"}
                  </button>
                </section>
              </section>
            </form>
          </section>
        </section>
      </section>
    </section>
  );
}

export default AddGuarantee;