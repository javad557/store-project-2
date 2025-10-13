import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCustomers, deleteCustomer, toggleCustomerStatus } from "../../../services/user/customerService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function CustomerUsers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await getCustomers();
                console.log("API Response:", response.data); // برای دیباگ
                const mappedCustomers = Array.isArray(response.data) ? response.data : [];
                setCustomers(mappedCustomers);
            } catch (error) {
                console.warn("دریافت کاربران مشتری با خطا مواجه شد:", error.message);
                setCustomers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

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
            try {
                const response = await deleteCustomer(id);
                
                setCustomers(customers.filter((customer) => customer.id !== id));
                showSuccess(response.data.message);
            } catch (error) {
                showError(error.response?.data?.error || "حذف کاربر مشتری با خطا مواجه شد");
            }
        }
    };

    const handleToggleStatus = async (id, isBlocked) => {
        try {
            const response = await toggleCustomerStatus(id, !isBlocked);
            setCustomers(
                customers.map((customer) =>
                    customer.id === id ? { ...customer, is_blocked: !isBlocked } : customer
                )
            );
            showSuccess(response.message);
        } catch (error) {
            showError(error.response?.data?.error || "تغییر وضعیت کاربر مشتری با خطا مواجه شد");
        }
    };

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
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            در حال بارگذاری...
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
                                                    onChange={() =>
                                                        handleToggleStatus(customer.id, customer.is_blocked)
                                                    }
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
                                                        onClick={() =>
                                                            handleDelete(customer.id, customer.full_name)
                                                        }
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