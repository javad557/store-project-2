import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdmins, deleteAdmin, toggleAdminStatus } from "../../../services/user/adminService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function AdminUsers() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await getAdmins();
                console.log("API Response:", response.data); // برای دیباگ
                const mappedAdmins = Array.isArray(response.data) ? response.data : [];
                setAdmins(mappedAdmins);
            } catch (error) {
                console.warn("دریافت کاربران ادمین با خطا مواجه شد:", error.message);
                setAdmins([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
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
                const response = await deleteAdmin(id);
                setAdmins(admins.filter((admin) => admin.id !== id));
                showSuccess(response.message); // استفاده از پیام سرور
            } catch (error) {
                showError(error.response?.data?.error || "حذف کاربر ادمین با خطا مواجه شد");
            }
        }
    };

    const handleToggleStatus = async (id, isBlocked) => {
        try {
            const response = await toggleAdminStatus(id, !isBlocked);
            setAdmins(
                admins.map((admin) =>
                    admin.id === id ? { ...admin, is_blocked: !isBlocked } : admin
                )
            );
            showSuccess(response.message); // استفاده از پیام سرور
        } catch (error) {
            showError(error.response?.data?.error || "تغییر وضعیت کاربر ادمین با خطا مواجه شد");
        }
    };

    const filteredAdmins = admins.filter((admin) =>
        admin.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="row" dir="rtl">
            <section className="col-12">
                <section className="main-body-container">
                    <section className="main-body-container-header">
                        <h5>مدیریت کاربران ادمین</h5>
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

                    <section className="d-flex justify-content-start align-items-center mb-3">
                        <Link to="/admin/user/adminusers/add" className="btn btn-success btn-sm">
                            افزودن کاربر ادمین
                        </Link>
                    </section>

                    <section className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>نام و نام خانوادگی</th>
                                    <th>ایمیل</th>
                                    <th>دسترسی‌ها</th>
                                    <th>نقش‌ها</th>
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
                                ) : filteredAdmins.length > 0 ? (
                                    filteredAdmins.map((admin, index) => (
                                        <tr key={admin.id} style={{ cursor: "pointer" }}>
                                            <th>{index + 1}</th>
                                            <td>{admin.full_name || "نامشخص"}</td>
                                            <td>{admin.email}</td>
                                            <td>
                                                <ul className="list-unstyled">
                                                    {admin.permissions?.length > 0 ? (
                                                        admin.permissions.map((permission, idx) => (
                                                            <li key={idx}>{permission}</li>
                                                        ))
                                                    ) : (
                                                        <li>بدون دسترسی</li>
                                                    )}
                                                </ul>
                                            </td>
                                            <td>
                                                <ul className="list-unstyled">
                                                    {admin.roles?.length > 0 ? (
                                                        admin.roles.map((role, idx) => (
                                                            <li key={idx}>{role}</li>
                                                        ))
                                                    ) : (
                                                        <li>بدون نقش</li>
                                                    )}
                                                </ul>
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={admin.is_blocked}
                                                    onChange={() => handleToggleStatus(admin.id, admin.is_blocked)}
                                                />
                                            </td>
                                            <td className="text-center">
                                                <div className="btn-group">
                                                    <Link
                                                        to={`/admin/user/adminusers/edit/${admin.id}`}
                                                        className="btn btn-primary btn-sm me-1"
                                                    >
                                                        <FaEdit className="me-1" />
                                                        ویرایش
                                                    </Link>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(admin.id, admin.full_name)}
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
                                            هیچ کاربر ادمینی یافت نشد
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

export default AdminUsers;