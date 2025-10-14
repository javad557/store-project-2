import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAmazingSales, deleteAmazingSale, toggleAmazingSaleStatus } from "../../../services/marketing/amazingSaleService.js";
import { showSuccess, showError, confirmDelete } from "../../../../utils/notifications.jsx";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment-jalaali";

function AmazingSales() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // دریافت فروش‌های شگفت‌انگیز با useQuery
  const { data: amazingSales = [], isLoading } = useQuery({
    queryKey: ["amazingSales"],
    queryFn: async () => {
      const response = await getAmazingSales();
      const rawSales = Array.isArray(response.data) ? response.data : [];
      return rawSales.map((sale) => ({
        ...sale,
        is_active: sale.status === 1,
        product_name: sale.product ? sale.product.name : "Unknown",
        formatted_end_date: sale.end_date
          ? moment(sale.end_date).format("jYYYY/jMM/jDD")
          : "بدون تاریخ انقضا",
      }));
    },
    onError: (error) => {
      console.log("Error in fetchAmazingSales:", error.response); // برای دیباگ
      const errorMessage = error.response?.data?.error || "دریافت فروش‌های شگفت‌انگیز با خطا مواجه شد";
      showError(errorMessage);
    },
  });

  // حذف فروش شگفت‌انگیز با useMutation
  const deleteMutation = useMutation({
    mutationFn: deleteAmazingSale,
    onSuccess: (response, id) => {
      queryClient.setQueryData(["amazingSales"], (old) =>
        old.filter((sale) => sale.id !== id)
      );
      showSuccess(response.data?.message || "فروش شگفت‌انگیز با موفقیت حذف شد");
    },
    onError: (error) => {
      console.log("Error in deleteAmazingSale:", error.response); // برای دیباگ
      const errorMessage = error.response?.data?.error || "حذف فروش شگفت‌انگیز با خطا مواجه شد";
      showError(errorMessage);
    },
  });

  // تغییر وضعیت فروش شگفت‌انگیز با useMutation
  const toggleStatusMutation = useMutation({
    mutationFn: toggleAmazingSaleStatus,
    onSuccess: (response, id) => {
      queryClient.setQueryData(["amazingSales"], (old) =>
        old.map((sale) =>
          sale.id === id
            ? { ...sale, is_active: !sale.is_active, status: sale.is_active ? 0 : 1 }
            : sale
        )
      );
      showSuccess(
        response.data?.message ||
          `فروش شگفت‌انگیز با موفقیت ${!amazingSales.find((sale) => sale.id === id).is_active ? "فعال" : "غیرفعال"} شد`
      );
    },
    onError: (error) => {
      console.log("Error in toggleAmazingSaleStatus:", error.response); // برای دیباگ
      const errorMessage = error.response?.data?.error || "تغییر وضعیت فروش شگفت‌انگیز با خطا مواجه شد";
      showError(errorMessage);
    },
  });

  const handleDelete = async (id, productName) => {
    const isConfirmed = await confirmDelete(productName);
    if (isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (id) => {
    toggleStatusMutation.mutate(id);
  };

  // فیلتر کردن فروش‌ها بر اساس جستجو
  const filteredSales = amazingSales.filter((sale) =>
    sale.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="row" dir="rtl">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>فروش شگفت‌انگیز</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/marketing/amazings/add" className="btn btn-success btn-sm">
              افزودن فروش شگفت‌انگیز
            </Link>
            <div className="max-width-16-rem">
              <input
                type="text"
                className="form-control form-control-sm form-text"
                placeholder="جستجو بر اساس نام محصول"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </section>

          <section className="table-responsive">
            {isLoading ? (
              <div>در حال بارگذاری...</div>
            ) : (
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>نام محصول</th>
                    <th>درصد تخفیف</th>
                    <th>تاریخ پایان</th>
                    <th>وضعیت</th>
                    <th className="max-width-16-rem text-center">
                      <i className="fa fa-cogs"></i> تنظیمات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.length > 0 ? (
                    filteredSales.map((sale, index) => (
                      <tr key={sale.id} style={{ cursor: "pointer" }}>
                        <td>{index + 1}</td>
                        <td>{sale.product_name || "Unknown"}</td>
                        <td>{sale.amount}%</td>
                        <td>{sale.formatted_end_date}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={sale.is_active}
                            onChange={() => handleToggleStatus(sale.id)}
                            disabled={toggleStatusMutation.isLoading}
                          />
                        </td>
                        <td className="text-center">
                          <div className="btn-group">
                            <Link
                              to={`/admin/marketing/amazings/edit/${sale.id}`}
                              className="btn btn-primary btn-sm me-1"
                            >
                              <FaEdit className="me-1" />
                              ویرایش
                            </Link>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(sale.id, sale.product_name)}
                              disabled={deleteMutation.isLoading}
                            >
                              <FaTrashAlt className="me-1" />
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        هیچ فروش شگفت‌انگیزی یافت نشد
                      </td>
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

export default AmazingSales;