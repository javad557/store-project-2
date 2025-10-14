import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    product_id: null,
    amount: "",
    end_date: null,
    end_date_server: null,
  });
  const [errors, setErrors] = useState({
    form: null,
    product_id: null,
    amount: null,
    end_date: null,
  });

  // دریافت لیست محصولات با useQuery
  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ["productsForSelect"], // کلید متفاوت برای جلوگیری از تداخل
    queryFn: async () => {
      const response = await getProducts();
      const rawProducts = Array.isArray(response.data.data) ? response.data.data : [];
      return rawProducts.map((product) => ({
        value: product.id,
        label: product.name,
      }));
    },
    onError: (error) => {
      console.log("Error in fetchProducts:", error.response);
      const errorMessage = error.response?.data?.error || "خطا در دریافت لیست محصولات";
      showError(errorMessage);
      setErrors((prev) => ({ ...prev, products: "سرویس محصولات در دسترس نیست" }));
    },
  });

  // دریافت داده‌های فروش شگفت‌انگیز با useQuery
  const { data: saleData, isLoading: isSaleLoading, isSuccess: isAmazingSuccess } = useQuery({
    queryKey: ["amazingSale", id],
    queryFn: async () => {
      const response = await getAmazingSale(id);
      return response.data;
    },
    onError: (error) => {
      console.log("Error in fetchAmazingSale:", error.response);
      showError("خطا در دریافت اطلاعات فروش شگفت‌انگیز");
      navigate("/admin/marketing/amazings");
    },
  });

  // به‌روزرسانی formData بعد از دریافت saleData
  useEffect(() => {
    if (isAmazingSuccess && saleData) {
      setFormData({
        product_id: saleData.product_id,
        amount: saleData.amount || "",
        end_date: saleData.end_date ? new DateObject(saleData.end_date) : null,
        end_date_server: saleData.end_date || null,
      });
    }
  }, [isAmazingSuccess, saleData]);

  // اعتبارسنجی سمت کلاینت با useEffect
  useEffect(() => {
    const newErrors = { form: null, product_id: null, amount: null, end_date: null };

    if (!formData.product_id) {
      newErrors.product_id = "انتخاب محصول الزامی است";
    }

    if (!formData.amount) {
      newErrors.amount = "درصد تخفیف الزامی است";
    } 

    if (!formData.end_date_server) {
      newErrors.end_date = "تاریخ پایان الزامی است";
    } else {
      const selectedDate = new Date(formData.end_date_server);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
    }

    setErrors(newErrors);
  }, [formData]);

  // به‌روزرسانی فروش شگفت‌انگیز با useMutation
  const updateMutation = useMutation({
    mutationFn: (payload) => updateAmazingSale(id, payload),
    onSuccess: (response) => {
      showSuccess(response.data?.message || "فروش شگفت‌انگیز با موفقیت به‌روزرسانی شد");
      queryClient.invalidateQueries(["amazingSales"]);
      navigate("/admin/marketing/amazings");
    },
    onError: (error) => {
      console.log("Error in updateAmazingSale:", error.response);
      const errorData = error.response?.data;
      let errorMessage = errorData?.error || errorData?.message || "خطا در به‌روزرسانی فروش شگفت‌انگیز";

      if (errorData?.errors) {
        const serverErrors = { form: "مقادیر فیلدها معتبر نیستند" };
        Object.keys(errorData.errors).forEach((key) => {
          serverErrors[key] = errorData.errors[key][0];
        });
        setErrors(serverErrors);
        errorMessage = "مقادیر فیلدها معتبر نیستند";
      } else {
        setErrors((prev) => ({ ...prev, form: errorMessage }));
      }

      showError(errorMessage);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      product_id: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      end_date: date,
      end_date_server: date ? date.toDate().toISOString().split("T")[0] : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.product_id || errors.amount || errors.end_date) {
      setErrors((prev) => ({ ...prev, form: "مقادیر فیلدها معتبر نیستند" }));
      showError("مقادیر فیلدها معتبر نیستند");
      return;
    }

    const payload = {
      product_id: formData.product_id,
      amount: formData.amount ? Number(formData.amount) : null,
      end_date: formData.end_date_server,
    };
    updateMutation.mutate(payload);
  };

  if (isSaleLoading || isProductsLoading) {
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
                      isLoading={isProductsLoading}
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

export default EditAmazingSale;