import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { showSuccess, showError } from "../../../utils/notifications.jsx";
import {
  getCategory,
  updateCategory,
  getCategories,
} from "../../services/market/categoryService.js";

function EditCategory() {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [nameError, setNameError] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // لود دسته‌بندی فعلی
        const categoryResponse = await getCategory(id);
        setName(categoryResponse.data.name);
        setParentId(categoryResponse.data.parent_id || "");

        // لود دسته‌بندی‌های والد برای دراپ‌داون
        const categoriesResponse = await getCategories();
        setCategories(
          Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []
        );
      } catch (error) {
        setCategories([]);
        showError("دریافت اطلاعات با خطا مواجه شد");
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError("");

    if (!name.trim()) {
      setNameError("نام دسته‌بندی الزامی است");
      return;
    }

    try {
      const response = await updateCategory(id, {
        name,
        parent_id: parentId || null,
      });
      showSuccess(response.data.message);
      navigate("/admin/categories");
    } catch (error) {
      showError("به‌روزرسانی دسته‌بندی با خطا مواجه شد");
    }
  };

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>ویرایش دسته‌بندی</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/categories" className="btn btn-primary btn-sm">
              <i className="fa fa-arrow-right"></i> بازگشت
            </Link>
            <button
              type="submit"
              form="category-form"
              className="btn btn-success btn-sm"
            >
              <i className="fa fa-check"></i> تأیید
            </button>
          </section>

          <form id="category-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="category-name" className="form-label">
                نام دسته‌بندی
              </label>
              <input
                type="text"
                className={`form-control ${nameError ? "is-invalid" : ""}`}
                id="category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {nameError && <div className="invalid-feedback">{nameError}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="parent-category" className="form-label">
                دسته‌بندی والد
              </label>
              <select
                className="form-select"
                id="parent-category"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
              >
                <option value="">دسته‌بندی اصلی</option>
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories
                    .filter((category) => category.id !== Number(id)) // جلوگیری از انتخاب خودش
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                ) : (
                  <option disabled>هیچ دسته‌بندی‌ای موجود نیست</option>
                )}
              </select>
            </div>
          </form>
        </section>
      </section>
    </section>
  );
}

export default EditCategory;
