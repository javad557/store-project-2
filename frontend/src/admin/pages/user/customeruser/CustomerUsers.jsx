import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomers, deleteCustomer, toggleCustomerStatus } from "../../../services/user/customerService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function CustomerUsers() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // دریافت لیست کاربران مشتری با useQuery
  const {
    data: customers = [],
    isLoading: isCustomersLoading,
    error: customersError,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await getCustomers();
      console.log("API Response:", response.data); // برای دیباگ
      return Array.isArray(response.data) ? response.data : [];
    },
    onError: (error) => {
      console.warn("دریافت کاربران مشتری با خطا مواجه شد:", error.message);
      showError(error.response?.data?.error || "سرویس کاربران در دسترس نیست");
    },
  });

  // حذف کاربر مشتری با useMutation
  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: (response, id) => {
      // به‌روزرسانی لیست کاربران بدون نیاز به رفرش
      queryClient.setQueryData(["customers"], (oldData) =>
        oldData.filter((customer) => customer.id !== id)
      );
      showSuccess(response.data?.message || "کاربر مشتری با موفقیت حذف شد");
    },
    onError: (error) => {
      showError(error.response?.data?.error || "حذف کاربر مشتری با خطا مواجه شد");
    },
  });

  // تغییر وضعیت کاربر مشتری با useMutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isBlocked }) => toggleCustomerStatus(id, !isBlocked),
    onSuccess: (response, { id, isBlocked }) => {
      // به‌روزرسانی لیست کاربران بدون نیاز به رفرش
      queryClient.setQueryData(["customers"], (oldData) =>
        oldData.map((customer) =>
          customer.id === id ? { ...customer, is_blocked: !isBlocked } : customer
        )
      );
      showSuccess(response.data?.message || "وضعیت کاربر مشتری با موفقیت تغییر کرد");
    },
    onError: (error) => {
      showError(error.response?.data?.error || "تغییر وضعیت کاربر مشتری با خطا مواجه شد");
    },
  });

  // مدیریت حذف کاربر با تأیید SweetAlert
  const handleDelete = async (id, full_name) => {
    const result = await Swal.fire({
      title: `آیا از حذف کاربر "${full_name}" مطمئن هستید؟`,
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

  // مدیریت تغییر وضعیت (بلاک/آنبلاک)
  const handleToggleStatus = (id, isBlocked) => {
    toggleStatusMutation.mutate({ id, isBlocked });
  };

  // فیلتر کردن کاربران بر اساس جستجو
  const filteredCustomers = customers.filter((customer) =>
    customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="row" dir="rtl">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>مدیریت کاربران مشتری</h5>
          </section>

          <section className="d-flex justify-content-center align-items-center mt-4 mb-3 border-bottom pb-2">
            <div className="max-width-16-rem">
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
                  <th>نام و نام خانوادگی</th>
                  <th>شماره تلفن</th>
                  <th>ایمیل</th>
                  <th>میزان خرید</th>
                  <th>بلاک</th>
                  <th className="max-width-16-rem text-center">
                    <i className="fa fa-cogs"></i> تنظیمات
                  </th>
                </tr>
              </thead>
              <tbody>
                {isCustomersLoading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      در حال بارگذاری...
                    </td>
                  </tr>
                ) : customersError ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      خطا در بارگذاری کاربران
                    </td>
                  </tr>
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, index) => (
                    <tr key={customer.id} style={{ cursor: "pointer" }}>
                      <th>{index + 1}</th>
                      <td>{customer.full_name || "نامشخص"}</td>
                      <td>{customer.mobile || "نامشخص"}</td>
                      <td>{customer.email || "نامشخص"}</td>
                      <td>{customer.totalpurchases || 0}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={customer.is_blocked}
                          onChange={() => handleToggleStatus(customer.id, customer.is_blocked)}
                          disabled={toggleStatusMutation.isLoading}
                        />
                      </td>
                      <td className="text-center">
                        <div className="btn-group">
                          <Link
                            to={`/admin/user/customerusers/edit/${customer.id}`}
                            className="btn btn-primary btn-sm me-1"
                          >
                            <FaEdit className="me-1" />
                            ویرایش
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(customer.id, customer.full_name)}
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
                    <td colSpan="7" className="text-center">
                      هیچ کاربر مشتری یافت نشد
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

export default CustomerUsers;