import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import { getAmazingSale, updateAmazingSale } from "../../../services/marketing/amazingSaleService.js";
import { getProducts } from "../../../services/market/productService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaArrowRight } from "react-icons/fa";
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

function EditAmazingSale() {
  const [formData, setFormData] = useState({
    product_id: null,
    amount: "",
    end_date: null,
    end_date_server: null,
  });
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({
    form: null,
    product_id: null,
    amount: null,
    end_date: null,
  });
  const [loading, setLoading] = useState({
    form: false,
    products: true,
    sale: true,
  });
  const navigate = useNavigate();
  const { id } = useParams(); // دریافت ID از URL

  // دریافت لیست محصولات
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        const productOptions = response.data.map((product) => ({
          value: product.id,
          label: product.name,
        }));
        setProducts(productOptions);
      } catch (error) {
        console.error("خطا در دریافت محصولات:", error);
        setErrors((prev) => ({ ...prev, products: "سرویس محصولات در دسترس نیست" }));
        showError("خطا در دریافت لیست محصولات");
      } finally {
        setLoading((prev) => ({ ...prev, products: false }));
      }
    };

    fetchProducts();
  }, []);

  // دریافت داده‌های فروش شگفت‌انگیز
  useEffect(() => {
    const fetchAmazingSale = async () => {
      try {
        const response = await getAmazingSale(id);
        const saleData = response.data;
        setFormData({
          product_id: saleData.product_id,
          amount: saleData.amount || "",
          end_date: saleData.end_date ? new DateObject(saleData.end_date) : null,
          end_date_server: saleData.end_date || null,
        });
      } catch (error) {
        console.error("خطا در دریافت فروش شگفت‌انگیز:", error);
        showError("خطا در دریافت اطلاعات فروش شگفت‌انگیز");
        navigate("/admin/marketing/amazings");
      } finally {
        setLoading((prev) => ({ ...prev, sale: false }));
      }
    };

    fetchAmazingSale();
  }, [id, navigate]);

  // مدیریت تغییرات ورودی‌ها
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // مدیریت انتخاب محصول
  const handleProductChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      product_id: selectedOption ? selectedOption.value : null,
    }));
    setErrors((prev) => ({ ...prev, product_id: null }));
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
        end_date_server: null,
      }));
    }
    setErrors((prev) => ({ ...prev, end_date: null }));
  };

  // ارسال فرم
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, form: true }));

    const payload = {
      product_id: formData.product_id,
      amount: formData.amount ? Number(formData.amount) : null,
      end_date: formData.end_date_server,
    };

    try {
      const response = await updateAmazingSale(id, payload);
      showSuccess(response.data.message || "فروش شگفت‌انگیز با موفقیت به‌روزرسانی شد");
      navigate("/admin/marketing/amazings");
    } catch (error) {
      console.error("خطا در به‌روزرسانی فروش شگفت‌انگیز:", error);
      const errorData = error.response?.data;
      let errorMessage = errorData?.message || errorData?.error || "خطا در به‌روزرسانی فروش شگفت‌انگیز";

      // مدیریت خطاهای اعتبارسنجی از سرور
      if (errorData?.errors) {
        const serverErrors = {};
        Object.keys(errorData.errors).forEach((key) => {
          serverErrors[key] = errorData.errors[key][0]; // اولین پیام خطا
        });
        setErrors((prev) => ({ ...prev, ...serverErrors }));
        errorMessage = "لطفاً خطاهای فرم را بررسی کنید.";
      }

      showError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };

  // نمایش لودینگ تا زمانی که داده‌ها لود شوند
  if (loading.sale || loading.products) {
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
            <h5>ویرایش فروش شگفت‌انگیز</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <button
              className="btn btn-info btn-sm"
              onClick={() => navigate("/admin/marketing/amazings")}
            >
              <FaArrowRight /> بازگشت
            </button>
          </section>

          <section>
            <form onSubmit={handleSubmit}>
              <section className="row">
                <section className="col-12 col-md-6">
                  <div className="form-group">
                    <label htmlFor="product_id">نام کالا</label>
                    <Select
                      options={products}
                      onChange={handleProductChange}
                      placeholder="جستجوی محصول..."
                      isClearable
                      isLoading={loading.products}
                      className={errors.product_id ? "is-invalid" : ""}
                      value={products.find((option) => option.value === formData.product_id) || null}
                    />
                    {errors.product_id && (
                      <div style={styles.error}>{errors.product_id}</div>
                    )}
                  </div>
                </section>

                <section className="col-12 col-md-6">
                  <div className="form-group">
                    <label htmlFor="amount">درصد تخفیف</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className={`form-control form-control-sm ${
                        errors.amount ? "is-invalid" : ""
                      }`}
                      min="0"
                    />
                    {errors.amount && <div style={styles.error}>{errors.amount}</div>}
                  </div>
                </section>

                <section className="col-12 col-md-6">
                  <div className="form-group">
                    <label htmlFor="end_date">تاریخ پایان</label>
                    <DatePicker
                      id="end_date"
                      name="end_date"
                      calendar={persian}
                      locale={persian_fa}
                      value={formData.end_date || ""}
                      onChange={handleDateChange}
                      className="rmdp-mobile"
                      inputClass="rmdp-input"
                      placeholder="انتخاب تاریخ (مثال: ۱۴۰۴/۰۶/۱۲)"
                      format="YYYY/MM/DD"
                      calendarPosition="bottom-right"
                      disableYearPicker
                      disableMonthPicker
                    />
                    {errors.end_date && (
                      <div style={styles.error}>{errors.end_date}</div>
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

export default EditAmazingSale;