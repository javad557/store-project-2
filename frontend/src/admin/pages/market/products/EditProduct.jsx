import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../../../services/market/categoryService.js";
import { getBrands } from "../../../services/market/brandService.js";
import { getProduct, updateProduct } from "../../../services/market/productService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaArrowRight } from "react-icons/fa";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-multi-date-picker/styles/layouts/mobile.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    brand_id: "",
    price: "",
    image: null,
    marketable: "1",
    tags: "",
    published_at: null, // برای DatePicker (DateObject یا null)
    published_at_server: "", // برای ارسال به سرور
    weight: "",
    length: "",
    width: "",
    height: "",
    description: "",
    meta: [{ key: "", value: "" }],
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState({
    product: true,
    categories: true,
    brands: true,
  });
  const [errors, setErrors] = useState({
    product: null,
    categories: null,
    brands: null,
    form: null,
  });
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    console.log("شروع بارگذاری داده‌ها...");
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id);
        console.log("داده‌های محصول دریافت‌شده:", response.data);
        const product = response.data;

        // تبدیل تاریخ میلادی به شمسی
        let publishedAt = null;
        if (product.published_at) {
          try {
            // پارس تاریخ دیتابیس
            const date = new DateObject({
              date: new Date(product.published_at), // پارس تاریخ کامل
              calendar: persian,
              locale: persian_fa,
            });
            console.log("تاریخ تبدیل‌شده به شمسی:", date.format("YYYY/MM/DD"));
            publishedAt = date;
          } catch (error) {
            console.error("خطا در تبدیل تاریخ:", error);
            showError("خطا در تبدیل تاریخ محصول");
          }
        }

        setFormData({
          name: product.name || "",
          category_id: String(product.category_id || ""),
          brand_id: String(product.brand_id || ""),
          price: product.price || "",
          marketable: String(product.marketable ?? "1"),
          tags: product.tags || "",
          published_at: publishedAt, // برای DatePicker
          published_at_server: product.published_at || "", // برای سرور
          weight: product.weight || "",
          length: product.length || "",
          width: product.width || "",
          height: product.height || "",
          description: product.description || "",
          meta: Array.isArray(product.meta) ? product.meta : [{ key: "", value: "" }],
        });
        setCurrentImage(product.image || null);
      } catch (error) {
        console.error("خطا در دریافت محصول:", error);
        setErrors((prev) => ({ ...prev, product: "خطا در دریافت اطلاعات محصول" }));
        showError("خطا در دریافت اطلاعات محصول");
      } finally {
        setLoading((prev) => ({ ...prev, product: false }));
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        console.log("دسته‌بندی‌ها دریافت‌شده:", response.data);
        setCategories(Array.isArray(response.data) ? response.data : []);
        if (!response.data.length) {
          showError("هیچ دسته‌بندی‌ای دریافت نشد");
        }
      } catch (error) {
        console.error("خطا در دریافت دسته‌بندی‌ها:", error);
        setErrors((prev) => ({ ...prev, categories: "سرویس دسته‌بندی‌ها در دسترس نیست" }));
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await getBrands();
        console.log("برندها دریافت‌شده:", response.data);
        setBrands(Array.isArray(response.data) ? response.data : []);
        if (!response.data.length) {
          showError("هیچ برندی دریافت نشد");
        }
      } catch (error) {
        console.error("خطا در دریافت برندها:", error);
        setErrors((prev) => ({ ...prev, brands: "سرویس برندها در دسترس نیست" }));
      } finally {
        setLoading((prev) => ({ ...prev, brands: false }));
      }
    };

    fetchProduct();
    fetchCategories();
    fetchBrands();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`تغییر ورودی: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    console.log("فایل انتخاب‌شده:", e.target.files[0]);
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleDateChange = (date) => {
    console.log("تاریخ انتخاب‌شده:", date);
    if (date) {
      const formattedDate = date.toDate().toISOString().split("T")[0]; // فرمت YYYY-MM-DD برای سرور
      console.log("تاریخ فرمت‌شده برای سرور:", formattedDate);
      setFormData((prev) => ({
        ...prev,
        published_at: date, // برای نمایش در DatePicker
        published_at_server: formattedDate, // برای ارسال به سرور
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        published_at: null,
        published_at_server: "",
      }));
    }
  };

  const handleMetaChange = (index, field, value) => {
    console.log(`تغییر متا: index=${index}, field=${field}, value=${value}`);
    const newMeta = [...formData.meta];
    newMeta[index][field] = value;
    setFormData((prev) => ({ ...prev, meta: newMeta }));
  };

  const addMetaField = () => {
    console.log("اضافه کردن فیلد متا");
    setFormData((prev) => ({
      ...prev,
      meta: [...prev.meta, { key: "", value: "" }],
    }));
  };

  const removeMetaField = (index) => {
    console.log(`حذف فیلد متا در ایندکس ${index}`);
    setFormData((prev) => ({
      ...prev,
      meta: prev.meta.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, form: null }));
    console.log("داده‌های فرم برای ارسال:", formData);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("category_id", formData.category_id);
    data.append("brand_id", formData.brand_id);
    data.append("price", formData.price);
    if (formData.image) data.append("image", formData.image);
    data.append("marketable", formData.marketable);
    data.append("tags", formData.tags);
    data.append("published_at", formData.published_at_server || "");
    data.append("weight", formData.weight);
    data.append("length", formData.length);
    data.append("width", formData.width);
    data.append("height", formData.height);
    data.append("description", formData.description);
    data.append("meta", JSON.stringify(formData.meta));
    data.append("_method", "PUT");

    try {
      console.log("داده‌های ارسالی به سرور:", Object.fromEntries(data));
      const response = await updateProduct(id, data);
      showSuccess(response.data.message || "محصول با موفقیت به‌روزرسانی شد");
      navigate("/admin/market/products");
    } catch (error) {
      console.error("خطا در به‌روزرسانی محصول:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "خطا در به‌روزرسانی محصول: مشکلی در سرور رخ داد";
      setErrors((prev) => ({ ...prev, form: errorMessage }));
      showError(errorMessage);
    }
  };

  console.log("وضعیت فعلی:", { loading, errors, formData });

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
            <h5>ویرایش کالا</h5>
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
            {loading.product ? (
              <div>در حال بارگذاری...</div>
            ) : errors.product ? (
              <div className="text-danger">{errors.product}</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <section className="row">
                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="name">نام کالا</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="category_id">انتخاب دسته</label>
                      <select
                        id="category_id"
                        name="category_id"
                        className="form-control form-control-sm"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        disabled={loading.categories || errors.categories}
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
                            {errors.categories ? "دسته‌بندی‌ها در دسترس نیست" : "دسته‌بندی‌ای یافت نشد"}
                          </option>
                        )}
                      </select>
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
                        disabled={loading.brands || errors.brands}
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
                            {errors.brands ? "برندها در دسترس نیست" : "برندی یافت نشد"}
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
                        value={formData.published_at} // شیء DateObject
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
                        className="form-control form-control-sm"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                      />
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
                    <button type="submit" className="btn btn-primary btn-sm">
                      ثبت
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

export default EditProduct;