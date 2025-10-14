// src/admin/pages/marketing/Discounts.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCopans, deleteCopan, toggleCopanStatus } from "../../../services/marketing/discountService";
import { showSuccess, showError } from "../../../../utils/notifications";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import moment from "moment-jalaali";

function Discounts() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // دریافت کدهای تخفیف با useQuery
  const {
    data: discounts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["copans"],
    queryFn: async () => {
      const response = await getCopans();
      console.log("Raw copans response:", response);
      console.log("Discounts data:", response.data);
      return Array.isArray(response.data)
        ? response.data.map((discount) => ({
            ...discount,
            is_active: discount.status === 1,
            user_name: discount.user?.full_name || "Unknown",
            formatted_end_date: discount.end_date
              ? moment(discount.end_date).format("jYYYY/jMM/jDD")
              : "بدون تاریخ انقضا",
          }))
        : [];
    },
    onError: (error) => {
      console.error("Error fetching copans:", error);
      showError(error.response?.data?.error || "خطا در بارگذاری کدهای تخفیف");
    },
  });

  // حذف کد تخفیف
  const deleteMutation = useMutation({
    mutationFn: deleteCopan,
    onSuccess: (response, id) => {
      queryClient.setQueryData(["copans"], (oldData) =>
        Array.isArray(oldData) ? oldData.filter((discount) => discount.id !== id) : []
      );
      queryClient.invalidateQueries({ queryKey: ["copans"], refetchType: "all" });
      showSuccess(response.data?.message || "کد تخفیف با موفقیت حذف شد");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      showError(error.response?.data?.error || "حذف کد تخفیف با خطا مواجه شد");
    },
  });

  // تغییر وضعیت کد تخفیف
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) => toggleCopanStatus(id, !isActive),
    onSuccess: (response, { id, isActive }) => {
      queryClient.setQueryData(["copans"], (oldData) =>
        Array.isArray(oldData)
          ? oldData.map((discount) =>
              discount.id === id ? { ...discount, is_active: !isActive, status: !isActive ? 1 : 0 } : discount
            )
          : []
      );
      queryClient.invalidateQueries({ queryKey: ["copans"], refetchType: "all" });
      showSuccess(`کد تخفیف با موفقیت ${!isActive ? "فعال" : "غیرفعال"} شد`);
    },
    onError: (error) => {
      console.error("Toggle status error:", error);
      showError(error.response?.data?.error || "تغییر وضعیت کد تخفیف با خطا مواجه شد");
    },
  });

  // مدیریت حذف کد تخفیف
  const handleDelete = async (id, code) => {
    const result = await Swal.fire({
      title: `آیا از حذف کد تخفیف "${code || "این کد"}" مطمئن هستید؟`,
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

  // مدیریت تغییر وضعیت
  const handleToggleStatus = (id, isActive) => {
    toggleStatusMutation.mutate({ id, isActive });
  };

  // فیلتر کردن کدهای تخفیف بر اساس جستجو
  const filteredDiscounts = discounts.filter((discount) =>
    discount.user_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ?? false
  );

  return (
    <section className="row" dir="rtl">
      <style>
        {`
          .btn-group .btn {
            transition: none;
          }
          .btn .badge {
            display: none;
            position: absolute;
            bottom: -35px;
            right: 50%;
            transform: translateX(50%);
            background-color: #000;
            color: #fff;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 10;
            line-height: 1.2;
          }
          .btn:hover .badge {
            display: block;
            animation: fadeInOut 4s ease-in-out forwards;
          }
          @keyframes fadeInOut {
            0% {
              opacity: 0;
              transform: translateX(50%) translateY(5px);
            }
            20% {
              opacity: 1;
              transform: translateX(50%) translateY(0);
            }
            80% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform: translateX(50%) translateY(5px);
            }
          }
          .uniform-button {
            min-width: 120px;
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
            line-height: 1.5;
          }
          .table td, .table th {
            vertical-align: middle;
            padding: 0.5rem;
          }
          .search-container {
            max-width: 16rem;
          }
        `}
      </style>
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>کوپن تخفیف</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/marketing/copans/add" className="btn btn-info btn-sm uniform-button">
              ایجاد کوپن تخفیف
            </Link>
            <div className="search-container">
              <input
                type="text"
                className="form-control form-control-sm form-text"
                placeholder="جستجو بر اساس نام کاربر"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </section>

          <section className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>نام کاربر</th>
                  <th>کد تخفیف</th>
                  <th>میزان تخفیف</th>
                  <th>تاریخ انقضا</th>
                  <th>وضعیت</th>
                  <th className="text-center">تنظیمات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      در حال بارگذاری...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="7" className="text-center text-danger">
                      خطایی رخ داده است: {error.response?.data?.error || "لطفاً دوباره تلاش کنید."}
                    </td>
                  </tr>
                ) : filteredDiscounts.length > 0 ? (
                  filteredDiscounts.map((discount, index) => (
                    <tr key={discount.id} style={{ cursor: "pointer" }}>
                      <th>{index + 1}</th>
                      <td>{discount.user_name || "Unknown"}</td>
                      <td>{discount.code}</td>
                      <td>{discount.amount}</td>
                      <td>{discount.formatted_end_date}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={discount.is_active}
                          onChange={() => handleToggleStatus(discount.id, discount.is_active)}
                          disabled={toggleStatusMutation.isPending}
                        />
                      </td>
                      <td className="text-center">
                        <div className="btn-group">
                          <Link
                            to={`/admin/marketing/copans/edit/${discount.id}`}
                            className="btn btn-primary btn-sm me-1"
                          >
                            <FaEdit className="me-1" />ویرایش
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(discount.id, discount.code)}
                            disabled={deleteMutation.isPending}
                          >
                            <FaTrashAlt className="me-1" />حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      هیچ کد تخفیفی یافت نشد
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

export default Discounts;