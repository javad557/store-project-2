import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    brand_id: "",
    price: "",
    image: null,
    marketable: "1",
    tags: "",
    published_at: null, // برای DatePicker
    published_at_server: "", // برای سرور
    weight: "",
    length: "",
    width: "",
    height: "",
    description: "",
    meta: [{ key: "", value: "" }],
  });
  const [currentImage, setCurrentImage] = useState(null);

  // دریافت محصول با useQuery
  const {data: product,isLoading: isProductLoading,error: productError, isError :isProductError
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await getProduct(id);
      console.log("پاسخ getProduct:", response.data); // دیباگ
      const productData = response.data.data || {};
      // تبدیل تاریخ میلادی به شمسی
      let publishedAt = null;
      if (productData.published_at) {
        try {
          const date = new DateObject({
            date: new Date(productData.published_at),
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
      return {
        ...productData,
        category_id: String(productData.category_id || ""),
        brand_id: String(productData.brand_id || ""),
        marketable: String(productData.marketable ?? "1"),
        published_at: publishedAt,
        published_at_server: productData.published_at || "",
        meta: Array.isArray(productData.meta) ? productData.meta : [{ key: "", value: "" }],
      };
    },
   
  });


    useEffect(()=>{
          if(product){
              console.log("داده‌های محصول برای فرم:", product); // دیباگ
              setFormData({
                name: product.name || "",
                category_id: product.category_id || "",
                brand_id: product.brand_id || "",
                price: product.price || "",
                marketable: product.marketable || "1",
                tags: product.tags || "",
                published_at: product.published_at || null,
                weight: product.weight || "",
                length: product.length || "",
                width: product.width || "",
                height: product.height || "",
                description: product.description || "",
                meta: product.meta || [{ key: "", value: "" }],
          });
            setCurrentImage(product.image || null);
          }
      },[product])
  


  // دریافت دسته‌بندی‌ها با useQuery
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      console.log("پاسخ getCategories:", response.data); // دیباگ
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
    onError: () => {
      showError("سرویس دسته‌بندی‌ها در دسترس نیست");
    },
  });

  // دریافت برندها با useQuery
  const {
    data: brands = [],
    isLoading: isBrandsLoading,
    error: brandsError,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await getBrands();
      console.log("پاسخ getBrands:", response.data); // دیباگ
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
    onError: () => {
      showError("سرویس برندها در دسترس نیست");
    },
  });

  // به‌روزرسانی محصول با useMutation
  const mutation = useMutation({
    mutationFn: (data) => updateProduct(id, data),
    onSuccess: (response) => {
      showSuccess(response.data.message || "محصول با موفقیت به‌روزرسانی شد");
      queryClient.invalidateQueries(["products"]);
      navigate("/admin/market/products");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "خطا در به‌روزرسانی محصول: مشکلی در سرور رخ داد";
      showError(errorMessage);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = date.toDate().toISOString().split("T")[0];
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
  };

  const handleMetaChange = (index, field, value) => {
    const newMeta = [...formData.meta];
    newMeta[index][field] = value;
    setFormData((prev) => ({ ...prev, meta: newMeta }));
  };

  const addMetaField = () => {
    setFormData((prev) => ({
      ...prev,
      meta: [...prev.meta, { key: "", value: "" }],
    }));
  };

  const removeMetaField = (index) => {
    setFormData((prev) => ({
      ...prev,
      meta: prev.meta.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    mutation.mutate(data);
  };

  // استایل‌های inline
  const styles = `
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
  `;


  if(isProductError){
      console.error("خطا در دریافت محصول:", productError);
      showError(productError.response?.data?.error || "خطا در دریافت اطلاعات محصول");
  }

  return (
    <section className="row" dir="rtl">
      <style>{styles}</style>
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
            {isProductLoading ? (
              <div className="text-center my-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">در حال بارگذاری...</span>
                </div>
              </div>
            ) : productError ? (
              <div className="alert alert-danger">
                {productError.response?.data?.error || "خطا در دریافت اطلاعات محصول"}
              </div>
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
                            {categoriesError ? "دسته‌بندی‌ها در دسترس نیست" : "دسته‌بندی‌ای یافت نشد"}
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
                        disabled={isBrandsLoading || brandsError}
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
                            {brandsError ? "برندها در دسترس نیست" : "برندی یافت نشد"}
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
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm"
                      disabled={mutation.isLoading}
                    >
                      ثبت
                    </button>
                    {mutation.isError && (
                      <div className="alert alert-danger mt-2">{mutation.error.message}</div>
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