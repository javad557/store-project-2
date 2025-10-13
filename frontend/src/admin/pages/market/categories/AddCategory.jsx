import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { addCategory, getCategories } from "../../../services/market/categoryService.js";

function AddCategory() {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [nameError, setNameError] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // دریافت دسته‌بندی‌ها با useQuery
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return Array.isArray(response.data) ? response.data : [];
    },
    onError: () => {
      showError("دریافت دسته‌بندی‌ها با خطا مواجه شد");
    },
  });

  // افزودن دسته‌بندی با useMutation
  const addMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: (response) => {
      showSuccess(response.data.message);
      // invalidate کردن کش برای به‌روزرسانی لیست دسته‌بندی‌ها
      queryClient.invalidateQueries(["categories"]);
      navigate("/admin/market/categories");
    },
    onError: () => {
      showError("افزودن دسته‌بندی با خطا مواجه شد");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setNameError("");

    if (!name.trim()) {
      setNameError("نام دسته‌بندی الزامی است");
      return;
    }

    addMutation.mutate({
      name,
      parent_id: parentId || null,
    });
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
              disabled={addMutation.isLoading}
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
                disabled={addMutation.isLoading}
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
                disabled={isLoading || addMutation.isLoading}
              >
                <option value="">دسته‌بندی اصلی</option>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option disabled>هیچ دسته‌بندی‌ای موجود نیست</option>
                )}
              </select>
              {isLoading && <div>در حال بارگذاری دسته‌بندی‌ها...</div>}
            </div>
          </form>
        </section>
      </section>
    </section>
  );
}

export default AddCategory;