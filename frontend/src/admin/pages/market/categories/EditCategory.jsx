import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import {
  getCategory,
  updateCategory,
  getCategories,
} from "../../../services/market/categoryService.js";

// تابع جداگانه برای اعتبارسنجی فرم
const validateForm = (formData) => {
  const errors = {
    name: null,
    parent_id: null,
  };

  // اعتبارسنجی نام
  if (!formData.name.trim()) {
    errors.name = "نام دسته‌بندی الزامی است";
  } else if (formData.name.trim().length < 3) {
    errors.name = "نام باید حداقل 3 کاراکتر باشد";
  }

  // parent_id اختیاری است، پس نیازی به اعتبارسنجی ندارد
  return errors;
};

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    parent_id: "",
  });

  const [errors, setErrors] = useState({
    name: null,
    parent_id: null,
  });

  // دریافت اطلاعات دسته‌بندی فعلی با useQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const response = await getCategory(id);
      return response.data.data;
    },
  });

  // پر کردن formData با داده‌های دریافت‌شده
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        parent_id: data.parent_id || "",
      });
    }
  }, [data]);

 // ... بقیه کدها بدون تغییر
const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
  queryKey: ["categories"],
  queryFn: async () => {
    const response = await getCategories();
    return Array.isArray(response.data.data) ? response.data.data : [];
  },
  onError: () => {
    showError("دریافت دسته‌بندی‌ها با خطا مواجه شد");
  },
});

  // اعتبارسنجی خودکار هنگام تغییر formData
  useEffect(() => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
  }, [formData]);

  // به‌روزرسانی دسته‌بندی با useMutation
  const mutation = useMutation({
    mutationFn: (updatedData) => updateCategory(id, updatedData),
    onSuccess: (response) => {
      showSuccess(response.data.message || "دسته‌بندی با موفقیت ویرایش شد");
      queryClient.invalidateQueries(["categories"]);
      queryClient.invalidateQueries(["category", id]);
      navigate("/admin/market/categories");
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
          }, { name: null, parent_id: null })
        );
        showError("اطلاعات فرم نامعتبر هستند");
      } else {
        showError(error.response?.data?.error || "خطا در ویرایش دسته‌بندی");
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (!newErrors.name && !newErrors.parent_id) {
      mutation.mutate({
        name: formData.name,
        parent_id: formData.parent_id || null,
      });
    }
  };

  const isFormValid = () => formData.name.trim().length >= 3;

  return (
    <section className="row" dir="rtl">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>ویرایش دسته‌بندی</h5>
          </section>

          <section className="d-flex justify-content-start align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/market/categories" className="btn btn-primary btn-sm">
              بازگشت
            </Link>
          </section>

          {isLoading ? (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">در حال بارگذاری...</span>
            </div>
          ) : isError ? (
            <div className="alert alert-danger">خطا در بارگذاری اطلاعات</div>
          ) : (
            <section>
              <form onSubmit={handleSubmit}>
                <section className="row">
                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="name">نام دسته‌بندی</label>
                      <input
                        type="text"
                        className={`form-control form-control-sm ${errors.name ? "is-invalid" : ""}`}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={mutation.isLoading}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="parent_id">دسته‌بندی والد</label>
                      <select
                        className={`form-control form-control-sm ${errors.parent_id ? "is-invalid" : ""}`}
                        name="parent_id"
                        value={formData.parent_id}
                        onChange={handleChange}
                        disabled={isCategoriesLoading || mutation.isLoading}
                      >
                        <option value="">دسته‌بندی اصلی</option>
                        {categories.length > 0 ? (
                          categories
                            .filter((category) => category.id !== Number(id))
                            .map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))
                        ) : (
                          <option disabled>هیچ دسته‌بندی‌ای موجود نیست</option>
                        )}
                      </select>
                      {errors.parent_id && (
                        <div className="invalid-feedback">{errors.parent_id}</div>
                      )}
                      {isCategoriesLoading && (
                        <div className="text-muted">در حال بارگذاری دسته‌بندی‌ها...</div>
                      )}
                    </div>
                  </section>

                  <section className="col-12">
                    <div className="d-flex justify-content-start">
                      <button
                        type="submit"
                        className="btn btn-success btn-sm"
                        disabled={mutation.isLoading || !isFormValid()}
                      >
                        {mutation.isLoading ? "در حال ارسال" : "ویرایش"}
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

export default EditCategory;