import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  confirmDelete,
  showSuccess,
  showError,
} from "../../../utils/notifications.jsx";
import {
  getCategories,
  deleteCategory,
} from "../../services/categoryService.js";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      setCategories([]);
      showError("دریافت دسته‌بندی‌ها با خطا مواجه شد");
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const isConfirmed = await confirmDelete(
      `${name}؟ با این کار همه محصولات زیرمجموعه این دسته‌بندی حذف خواهند شد`
    );
    if (isConfirmed) {
      try {
        const response = await deleteCategory(id);
        showSuccess(response.data.message);
        fetchCategories();
      } catch (error) {
        showError(
          error.response?.data?.error || "حذف دسته‌بندی با خطا مواجه شد"
        );
      }
    }
  };

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>دسته‌بندی‌ها</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/categories/add" className="btn btn-success btn-sm">
              <i className="fa fa-plus"></i> ایجاد دسته‌بندی
            </Link>
            <div className="max-width-16-rem">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="جستجو"
              />
            </div>
          </section>

          <section className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>نام دسته‌بندی</th>
                  <th>دسته‌بندی والد</th>
                  <th className="max-width-16-rem text-center">
                    <i className="fa fa-cogs"></i> تنظیمات
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      در حال بارگذاری...
                    </td>
                  </tr>
                ) : Array.isArray(categories) && categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      دسته‌بندی‌ای یافت نشد
                    </td>
                  </tr>
                ) : (
                  categories.map((category, index) => (
                    <tr key={category.id}>
                      <th>{index + 1}</th>
                      <td>{category.name}</td>
                      <td>{category.parent_name || "دسته‌بندی اصلی"}</td>
                      <td className="width-16-rem text-left">
                        <Link
                          to={`/admin/categories/edit/${category.id}`}
                          className="btn btn-primary btn-sm me-2"
                        >
                          <i className="fa fa-edit"></i> ویرایش
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDelete(category.id, category.name)
                          }
                        >
                          <i className="fa fa-trash-alt"></i> حذف
                        </button>
                      </td>
                    </tr>
                  ))
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
