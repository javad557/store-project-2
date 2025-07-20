import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getCategories,
  deleteCategory,
} from "../../../services/market/categoryService.js";
import {
  showSuccess,
  showError,
  confirmDelete,
} from "../../../../utils/notifications.jsx";

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const rawCategories = Array.isArray(response.data) ? response.data : [];
        // اضافه کردن parent_name توی فرانت‌اند
        const categoriesWithParentName = rawCategories.map((category) => ({
          ...category,
          parent_name: category.parent_id
            ? rawCategories.find((parent) => parent.id === category.parent_id)
                ?.name || "-"
            : null,
        }));
        setCategories(categoriesWithParentName);
      } catch (error) {
        setCategories([]);
        showError("دریافت دسته‌بندی‌ها با خطا مواجه شد");
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id, name) => {
    const isConfirmed = await confirmDelete(name);
    if (isConfirmed) {
      try {
        const response = await deleteCategory(id);
        setCategories(categories.filter((category) => category.id !== id));
        showSuccess(response.data.message);
      } catch (error) {
        showError("حذف دسته‌بندی با خطا مواجه شد");
      }
    }
  };

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>مدیریت دسته‌بندی‌ها</h5>
          </section>
          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/market/categories/add" className="btn btn-success btn-sm">
              <i className="fa fa-plus"></i> افزودن
            </Link>
          </section>
          <section className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>نام</th>
                  <th>دسته‌بندی والد</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <tr key={category.id}>
                      <td>{index + 1}</td>
                      <td>{category.name}</td>
                      <td>
                        {category.parent_id
                          ? category.parent_name || "-"
                          : "دسته‌بندی اصلی"}
                      </td>
                      <td>
                        <Link
                          to={`/admin/market/categories/edit/${category.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          {" "}
                          ویرایش
                          <i className="fa fa-edit"></i>
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDelete(category.id, category.name)
                          }
                        >
                          حذف
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">دسته‌بندی‌ای یافت نشد</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </section>
      </section>
    </section>
  );
}

export default Categories;
