// src/admin/pages/market/AddProduct.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "../../../services/market/categoryService.js";
import { getBrands } from "../../../services/market/brandService.js";
import { addProduct } from "../../../services/market/productService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaArrowRight } from "react-icons/fa";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
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

function AddProduct() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    brand_id: "",
    price: "",
    marketable: "1",
    published_at: null, // برای DatePicker
    published_at_server: "", // برای ارسال به سرور
    description: "",
  });
  const [errors, setErrors] = useState({
    form: null,
    name: null,
    category_id: null,
    price: null,
  });

  // تابع اعتبارسنجی فرم
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "نام کالا الزامی است";
    if (!formData.category_id) newErrors.category_id = "انتخاب دسته الزامی است";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0)
      newErrors.price = "قیمت باید عدد غیرمنفی باشد";
    return newErrors;
  };

  // اعتبارسنجی پویا با تغییر formData
  useEffect(() => {
    const validationErrors = validateForm();
    setErrors((prev) => ({
      ...prev,
      name: validationErrors.name || null,
      category_id: validationErrors.category_id || null,
      price: validationErrors.price || null,
    }));
  }, [formData]);

  // دریافت دسته‌بندی‌ها
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      console.log("Raw categories response:", response);
      console.log("Categories data:", response.data.data);
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
    onError: () => {
      showError("سرویس دسته‌بندی‌ها در دسترس نیست");
      setErrors((prev) => ({ ...prev, form: "سرویس دسته‌بندی‌ها در دسترس نیست" }));
    },
  });

  // دریافت برندها
  const {
    data: brands = [],
    isLoading: isBrandsLoading,
    isError: isBrandsError,
    error: brandsError,
    isSuccess: isBrandsSuccess,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await getBrands();
      console.log("Raw brands response:", response);
      console.log("Brands data:", response.data.data);
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });

  // مدیریت خطای دریافت برندها
  useEffect(() => {
    if (isBrandsError && brandsError) {
      console.error("Error fetching brands:", brandsError);
      setErrors((prev) => ({ ...prev, form: brandsError.response?.data?.error || "سرویس برندها در دسترس نیست" }));
      showError(brandsError.response?.data?.error || "سرویس برندها در دسترس نیست");
    } else if (isBrandsSuccess && !brands.length) {
      showError("هیچ برندی دریافت نشد");
    }
  }, [isBrandsError, brandsError, isBrandsSuccess, brands]);

  // افزودن محصول
  const addMutation = useMutation({
    mutationFn: (data) => addProduct(data),
    onSuccess: (response) => {
      showSuccess(response.data?.message || "محصول با موفقیت ایجاد شد");
      queryClient.invalidateQueries({ queryKey: ["products"], refetchType: "all" });
      navigate("/admin/market/products", { replace: true });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "خطا در ایجاد محصول";
      setErrors((prev) => ({ ...prev, form: errorMessage }));
      showError(errorMessage);
    },
  });

  // مدیریت تغییرات ورودی‌ها
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input change: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, form: null }));
  };

  // مدیریت انتخاب تاریخ
  const handleDateChange = (date) => {
    console.log("Selected date:", date);
    if (date) {
      const formattedDate = date.toDate().toISOString().split("T")[0];
      console.log("Formatted date for server:", formattedDate);
      setFormData((prev) => ({
        ...prev,
        published_at: date,
        published_at_server: formattedDate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        published_at: null,
        published_at_server: "",
      }));
    }
    setErrors((prev) => ({ ...prev, form: null }));
  };

  // ارسال فرم
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...validationErrors, form: null }));
      showError("لطفاً خطاهای فرم را برطرف کنید");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("category_id", formData.category_id);
    data.append("brand_id", formData.brand_id);
    data.append("price", formData.price);
    data.append("marketable", formData.marketable);
    data.append("published_at", formData.published_at_server || "");
    data.append("description", formData.description);

    console.log("Sending add product payload:", Object.fromEntries(data));
    addMutation.mutate(data);
  };

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
          .form-group {
            margin-bottom: 1.5rem;
          }
          .btn-sm {
            min-width: 120px;
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
            line-height: 1.5;
          }
        `}
      </style>
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>ایجاد کالا</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <button
              className="btn btn-info btn-sm"
              onClick={() => navigate("/admin/market/products")}
            >
              <FaArrowRight /> بازگشت
            </button>
          </section>

          <section>
            {isCategoriesLoading || isBrandsLoading ? (
              <div className="text-center my-4">در حال بارگذاری...</div>
            ) : errors.form ? (
              <div className="text-center text-danger my-4">
                {errors.form}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <section className="row">
                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="name">نام کالا</label>
                      <input
                        type="text"
                        className={`form-control form-control-sm ${errors.name ? "is-invalid" : ""}`}
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.name && <div style={styles.error}>{errors.name}</div>}
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="category_id">انتخاب دسته</label>
                      <select
                        id="category_id"
                        name="category_id"
                        className={`form-control form-control-sm ${errors.category_id ? "is-invalid" : ""}`}
                        value={formData.category_id}
                        onChange={handleInputChange}
                        disabled={isCategoriesLoading || categoriesError}
                        required
                      >
                        <option value="">انتخاب کنید</option>
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <option key={category.id} value={String(category.id)}>
                              {category.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            دسته‌بندی‌ای یافت نشد
                          </option>
                        )}
                      </select>
                      {errors.category_id && <div style={styles.error}>{errors.category_id}</div>}
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="brand_id">انتخاب برند</label>
                      <select
                        id="brand_id"
                        name="brand_id"
                        className="form-control form-control-sm"
                        value={formData.brand_id}
                        onChange={handleInputChange}
                        disabled={isBrandsLoading || isBrandsError}
                      >
                        <option value="">ندارد</option>
                        {brands.length > 0 ? (
                          brands.map((brand) => (
                            <option key={brand.id} value={String(brand.id)}>
                              {brand.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            برندی یافت نشد
                          </option>
                        )}
                      </select>
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="marketable">امکان فروش</label>
                      <select
                        id="marketable"
                        name="marketable"
                        className="form-control form-control-sm"
                        value={formData.marketable}
                        onChange={handleInputChange}
                      >
                        <option value="1">قابل فروش</option>
                        <option value="0">غیر قابل فروش</option>
                      </select>
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="published_at">تاریخ انتشار</label>
                      <DatePicker
                        id="published_at"
                        name="published_at"
                        calendar={persian}
                        locale={persian_fa}
                        value={formData.published_at}
                        onChange={handleDateChange}
                        className="rmdp-mobile"
                        inputClass="rmdp-input"
                        placeholder="انتخاب تاریخ (مثال: ۱۴۰۴/۰۴/۲۰)"
                        format="YYYY/MM/DD"
                        calendarPosition="bottom-right"
                      />
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="price">قیمت کالا</label>
                      <input
                        type="number"
                        className={`form-control form-control-sm ${errors.price ? "is-invalid" : ""}`}
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                      />
                      {errors.price && <div style={styles.error}>{errors.price}</div>}
                    </div>
                  </section>

                  <section className="col-12">
                    <div className="form-group">
                      <label htmlFor="description">توضیحات</label>
                      <textarea
                        id="description"
                        name="description"
                        className="form-control form-control-sm"
                        rows="6"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                  </section>

                  <section className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm"
                      disabled={addMutation.isPending || Object.keys(errors).some(
                        (key) => key !== "form" && errors[key]
                      )}
                    >
                      {addMutation.isPending ? "در حال ثبت..." : "ثبت"}
                    </button>
                    {errors.form && (
                      <div className="text-danger mt-2">{errors.form}</div>
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

export default AddProduct;