import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { addCategory, getCategories } from "../../../services/market/categoryService.js";

function AddCategory() {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [nameError, setNameError] = useState("");
  const [categories, setCategories] = useState([]); // مقدار اولیه آرایه خالی
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        // مطمئن می‌شیم که response.data یه آرایه باشه
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setCategories([]); // در صورت خطا، آرایه خالی ست می‌کنیم
        showError("دریافت دسته‌بندی‌ها با خطا مواجه شد");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError("");

    if (!name.trim()) {
      setNameError("نام دسته‌بندی الزامی است");
      return;
    }

    try {
      const response = await addCategory({
        name,
        parent_id: parentId || null,
      });
      showSuccess(response.data.message);
      navigate("/admin/market/categories");
    } catch (error) {
      showError("افزودن دسته‌بندی با خطا مواجه شد");
    }
  };

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>افزودن دسته‌بندی</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/market/categories" className="btn btn-primary btn-sm">
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
                  categories.map((category) => (
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

export default AddCategory;
