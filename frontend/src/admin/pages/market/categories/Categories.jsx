import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  // دریافت دسته‌بندی‌ها با useQuery
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      const rawCategories = Array.isArray(response.data.data) ? response.data.data : [];
      return rawCategories.map((category) => ({
        ...category,
        parent_name: category.parent_id
          ? rawCategories.find((parent) => parent.id === category.parent_id)?.name || "-"
          : null,
      }));
    },
    onError: (error) => {
      console.log("Error in fetchCategories:", error.response); // برای دیباگ
      const errorMessage = error.response?.data?.error || "دریافت دسته‌بندی‌ها با خطا مواجه شد";
      showError(errorMessage);
    },
  });

  // حذف دسته‌بندی با useMutation
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (response, id) => {
      queryClient.setQueryData(["categories"], (old) =>
        old.filter((category) => category.id !== id)
      );
      showSuccess(response.data.message);
    },
    onError: (error) => {
      console.log("Error in deleteCategory:", error.response); // برای دیباگ
      const errorMessage = error.response?.data?.error || "حذف دسته‌بندی با خطا مواجه شد";
      showError(errorMessage);
    },
  });

  const handleDelete = async (id, name) => {
    const isConfirmed = await confirmDelete(name);
    if (isConfirmed) {
      deleteMutation.mutate(id);
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
            {isLoading ? (
              <div>در حال بارگذاری...</div>
            ) : (
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
                            ویرایش
                            <i className="fa fa-edit"></i>
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(category.id, category.name)}
                            disabled={deleteMutation.isLoading}
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
            )}
          </section>
        </section>
      </section>
    </section>
  );
}

export default Categories;