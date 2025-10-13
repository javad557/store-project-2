import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGuarantees, deleteGuarantee } from "../../../services/market/guaranteeService.js";
import { getProduct } from "../../../services/market/productService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function Guarantees() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // دریافت محصول با useQuery
  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await getProduct(productId);
      console.log("پاسخ getProduct:", response.data); // دیباگ
      return response.data.data || {};
    },
    onError: (error) => {
      console.error("خطا در دریافت محصول:", error);
      showError(error.response?.data?.error || "سرویس محصول در دسترس نیست");
    },
  });

  // دریافت گارانتی‌ها با useQuery
  const {
    data: guarantees = [],
    isLoading: isGuaranteesLoading,
    error: guaranteesError,
  } = useQuery({
    queryKey: ["guarantees", productId],
    queryFn: async () => {
      const response = await getGuarantees(productId);
      console.log("پاسخ getGuarantees:", response.data); // دیباگ
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
    onError: (error) => {
      console.error("خطا در دریافت گارانتی‌ها:", error);
      showError(error.response?.data?.error || "سرویس گارانتی‌ها در دسترس نیست");
    },
  });

  // حذف گارانتی با useMutation
  const deleteMutation = useMutation({
    mutationFn: deleteGuarantee,
    onSuccess: (response, id) => {
      queryClient.setQueryData(["guarantees", productId], (old) =>
        old.filter((guarantee) => guarantee.id !== id)
      );
      showSuccess("گارانتی با موفقیت حذف شد");
    },
    onError: (error) => {
      showError(error.response?.data?.error || "حذف گارانتی با خطا مواجه شد");
    },
  });

  // تابع تأیید حذف با SweetAlert2
  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: `آیا از حذف گارانتی "${name}" مطمئن هستید؟`,
      text: "این عملیات قابل بازگشت نیست!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "بله، حذف کن!",
      cancelButtonText: "لغو",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  // فیلتر گارانتی‌ها
  const filteredGuarantees = guarantees.filter((guarantee) =>
    guarantee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // استایل‌های inline
  const styles = `
    .custom-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      padding: 0 0.4rem;
      border-radius: 0.25rem;
      border: none;
      cursor: pointer;
      transition: none;
    }
    .edit-button {
      background-color: #007bff;
      color: white;
    }
    .delete-button {
      background-color: #dc3545;
      color: white;
    }
    .custom-button:hover {
      background-color: inherit;
      transform: none;
      box-shadow: none;
    }
    .max-width-16-rem {
      max-width: 16rem;
    }
  `;

  return (
    <section className="row" dir="rtl">
      <style>{styles}</style>
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>
              گارانتی‌های محصول: {isProductLoading ? "در حال بارگذاری..." : product?.name || "محصول"}
            </h5>
          </section>

          {(isGuaranteesLoading || isProductLoading) && (
            <div className="text-center my-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">در حال بارگذاری...</span>
              </div>
            </div>
          )}

          {productError && (
            <div className="alert alert-danger text-center">
              {productError.response?.data?.error || "سرویس محصول در دسترس نیست"}
            </div>
          )}
          {guaranteesError && (
            <div className="alert alert-danger text-center">
              {guaranteesError.response?.data?.error || "سرویس گارانتی‌ها در دسترس نیست"}
            </div>
          )}

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <div>
              <Link to={`/admin/market/guarantees/add/${productId}`} className="btn btn-success btn-sm me-2">
                افزودن گارانتی جدید
              </Link>
              <Link to="/admin/market/products" className="btn btn-info btn-sm">
                بازگشت
              </Link>
            </div>
            <div className="max-width-16-rem mx-2">
              <input
                type="text"
                className="form-control form-control-sm form-text"
                placeholder="جستجو"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </section>

          <section className="table-responsive">
            <table className="table table-striped table-hover h-150px">
              <thead>
                <tr>
                  <th>#</th>
                  <th>نام گارانتی</th>
                  <th>مدت اعتبار (ماه)</th>
                  <th>افزایش قیمت</th>
                  <th className="max-width-16-rem text-center">تنظیمات</th>
                </tr>
              </thead>
              <tbody>
                {isGuaranteesLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      در حال بارگذاری گارانتی‌ها...
                    </td>
                  </tr>
                ) : filteredGuarantees.length > 0 ? (
                  filteredGuarantees.map((guarantee, index) => (
                    <tr key={guarantee.id}>
                      <th>{index + 1}</th>
                      <td>{guarantee.name}</td>
                      <td>{guarantee.pivot?.duration !== undefined ? guarantee.pivot.duration : "-"}</td>
                      <td>{guarantee.pivot?.price_increase !== undefined ? guarantee.pivot.price_increase : "-"}</td>
                      <td className="text-center">
                        <div className="btn-group">
                          <Link
                            to={`/admin/market/guarantees/edit/${guarantee.id}/${productId}`}
                            className="custom-button edit-button"
                          >
                            <FaEdit /> ویرایش
                          </Link>
                          <button
                            className="custom-button delete-button"
                            onClick={() => handleDelete(guarantee.id, guarantee.name)}
                            disabled={deleteMutation.isLoading}
                          >
                            <FaTrashAlt /> حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      هیچ گارانتی‌ای یافت نشد
                    </td>
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

export default Guarantees;