import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { updateAdmin, getAdmin } from "../../../services/user/adminService.js";
import { getPermissions } from "../../../services/user/permissionsService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-multi-date-picker/styles/layouts/mobile.css";

const styles = {
  error: {
    color: "red",
    fontSize: "0.875rem",
    marginTop: "0.25rem",
    marginBottom: "0",
  },
};

function EditAdminUser() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        national_code: "", // اضافه شده
        birthdate: null, // برای نمایش در UI
        birthdate_server: null, // برای ارسال به سرور
        password: "",
        confirm_password: "",
        permissions: [],
        roles: [],
    });
    const [errors, setErrors] = useState({
        first_name: null,
        last_name: null,
        email: null,
        mobile: null,
        national_code: null, // اضافه شده
        birthdate: null, // اضافه شده
        password: [],
        confirm_password: null,
        permissions: null,
        roles: null,
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const [permissionsOptions, setPermissionsOptions] = useState([]);
    const [rolesOptions, setRolesOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const hasFetched = useRef(false);

    // محاسبه isFormDirty
    const isFormDirty = useMemo(() => {
        return Object.values(formData).some((value) =>
            Array.isArray(value) ? value.length > 0 : !!value
        );
    }, [formData]);

    // دریافت اطلاعات کاربر و پرمیشن‌ها و رول‌ها
    useEffect(() => {
        const fetchData = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;
            setIsLoading(true);
            try {
                // دریافت اطلاعات کاربر
                const userResponse = await getAdmin(id);
                if (!userResponse.data) {
                    throw new Error("داده‌های کاربر دریافت نشد");
                }
                setFormData({
                    first_name: userResponse.data.name || "",
                    last_name: userResponse.data.last_name || "",
                    email: userResponse.data.email || "",
                    mobile: userResponse.data.mobile || "",
                    national_code: userResponse.data.national_code || "", // اضافه شده
                    birthdate: userResponse.data.birthdate ? new DateObject(userResponse.data.birthdate) : null, // اضافه شده
                    birthdate_server: userResponse.data.birthdate || null, // اضافه شده
                    password: "",
                    confirm_password: "",
                    permissions: userResponse.data.permissions || [],
                    roles: userResponse.data.roles || [],
                });

                // دریافت پرمیشن‌ها و رول‌ها
                const permissionsResponse = await getPermissions();
                if (!permissionsResponse.data?.permissions || !permissionsResponse.data?.roles) {
                    throw new Error("پاسخ API شامل data.permissions یا data.roles نیست");
                }
                setPermissionsOptions(
                    permissionsResponse.data.permissions.map((perm) => ({
                        value: perm.id,
                        label: perm.name,
                    }))
                );
                setRolesOptions(
                    permissionsResponse.data.roles.map((role) => ({
                        value: role.id,
                        label: role.name,
                    }))
                );
            } catch (error) {
                console.error("خطا در دریافت اطلاعات:", error);
                setErrorMessage(`خطایی در دریافت داده‌ها رخ داد: ${error.message}`);
                setPermissionsOptions([]); // مقدار پیش‌فرض در صورت خطا
                setRolesOptions([]); // مقدار پیش‌فرض در صورت خطا
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: name === 'password' ? [] : null }));
    };

    const handleDateChange = (date) => {
        if (date) {
            const formattedDate = date.toDate().toISOString().split("T")[0];
            setFormData((prev) => ({
                ...prev,
                birthdate: date,
                birthdate_server: formattedDate,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                birthdate: null,
                birthdate_server: null,
            }));
        }
        setErrors((prev) => ({ ...prev, birthdate: null }));
    };

    const handleSelectChange = (selected, { name }) => {
        setFormData((prev) => ({
            ...prev,
            [name]: selected ? selected.map((option) => option.value) : [],
        }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({
            first_name: null,
            last_name: null,
            email: null,
            mobile: null,
            national_code: null, // اضافه شده
            birthdate: null, // اضافه شده
            password: [],
            confirm_password: null,
            permissions: null,
            roles: null,
        });

        try {
            const adminData = {
                name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email || null,
                mobile: formData.mobile || null,
                national_code: formData.national_code || null, // اضافه شده
                birthdate: formData.birthdate_server || null, // اضافه شده
                password: formData.password || null,
                confirm_password: formData.confirm_password || null,
                permissions: formData.permissions,
                roles: formData.roles,
            };
            console.log("Data sent to API:", JSON.stringify(adminData, null, 2));
            const response = await updateAdmin(id, adminData);
            showSuccess(response.message || "کاربر با موفقیت ویرایش شد");
            navigate("/admin/user/adminusers");
        } catch (error) {
            console.error("Error response:", error.response?.data);
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors || {};
                setErrors(
                    Object.keys(validationErrors).reduce((acc, key) => {
                        acc[key] = Array.isArray(validationErrors[key])
                            ? validationErrors[key]
                            : [validationErrors[key]];
                        return acc;
                    }, {
                        first_name: null,
                        last_name: null,
                        email: null,
                        mobile: null,
                        national_code: null, // اضافه شده
                        birthdate: null, // اضافه شده
                        password: [],
                        confirm_password: null,
                        permissions: null,
                        roles: null,
                    })
                );
                showError("لطفاً خطاهای فرم را بررسی کنید.");
            } else {
                showError(error.response?.data?.error || "ویرایش کاربر ادمین با خطا مواجه شد");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const selectedPermissions = useMemo(
        () => permissionsOptions ? permissionsOptions.filter((option) => formData.permissions.includes(option.value)) : [],
        [permissionsOptions, formData.permissions]
    );

    const selectedRoles = useMemo(
        () => rolesOptions ? rolesOptions.filter((option) => formData.roles.includes(option.value)) : [],
        [rolesOptions, formData.roles]
    );

    return (
        <section className="row" dir="rtl">
            <style>
                {`
                    .rmdp-container {
                        width: 100%;
                    }
                    .rmdp-input {
                        width: 100%;
                        height: 38px;
                        padding: 0.375rem 0.75rem;
                        font-size: 0.875rem;
                        line-height: 1.5;
                        border-radius: 0.25rem;
                        border: 1px solid #ced4da;
                        background-color: #fff;
                        color: #495057;
                    }
                    .rmdp-input:focus {
                        border-color: #80bdff;
                        outline: 0;
                        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                    }
                `}
            </style>
            <section className="col-12">
                <section className="main-body-container">
                    <section className="main-body-container-header">
                        <h5>ویرایش کاربر ادمینVolume</h5>
                    </section>

                    <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
                        <Link
                            to="/admin/user/adminusers"
                            className="btn btn-primary btn-sm"
                            onClick={(e) => {
                                if (isFormDirty && !window.confirm("آیا مطمئن هستید که می‌خواهید بدون ذخیره خارج شوید؟")) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            بازگشت
                        </Link>
                    </section>

                    {isLoading && (
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">در حال بارگذاری...</span>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    <section>
                        <form onSubmit={handleSubmit}>
                            <section className="row">
                                <section className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="first_name">نام</label>
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm ${errors.first_name ? "is-invalid" : ""}`}
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                        />
                                        {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                                    </div>
                                </section>

                                <section className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="last_name">نام خانوادگی</label>
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm ${errors.last_name ? "is-invalid" : ""}`}
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                        />
                                        {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                                    </div>
                                </section>

                                <section className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="email">ایمیل</label>
                                        <input
                                            type="email"
                                            className={`form-control form-control-sm ${errors.email ? "is-invalid" : ""}`}
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>
                                </section>

                                <section className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="mobile">شماره موبایل</label>
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm ${errors.mobile ? "is-invalid" : ""}`}
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                        />
                                        {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                                    </div>
                                </section>

                                <section className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="national_code">کد ملی</label>
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm ${errors.national_code ? "is-invalid" : ""}`}
                                            name="national_code"
                                            value={formData.national_code}
                                            onChange={handleChange}
                                        />
                                        {errors.national_code && <div className="invalid-feedback">{errors.national_code}</div>}
                                    </div>
                                </section>

                                <section className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="birthdate">تاریخ تولد</label>
                                        <DatePicker
                                            id="birthdate"
                                            name="birthdate"
                                            calendar={persian}
                                            locale={persian_fa}
                                            value={formData.birthdate || ""}
                                            onChange={handleDateChange}
                                            className="rmdp-mobile"
                                            inputClass="rmdp-input"
                                            placeholder="انتخاب تاریخ (مثال: ۱۴۰۴/۰۶/۱۲)"
                                            format="YYYY/MM/DD"
                                            calendarPosition="bottom-right"
                                            disableYearPicker
                                            disableMonthPicker
                                        />
                                        {errors.birthdate && <div style={styles.error}>{errors.birthdate}</div>}
                                    </div>
                                </section>

                                <section className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="permissions">Permission‌ها</label>
                                        <Select
                                            isMulti
                                            name="permissions"
                                            options={permissionsOptions}
                                            value={selectedPermissions}
                                            onChange={handleSelectChange}
                                            placeholder="انتخاب Permission‌ها"
                                            className={errors.permissions ? "is-invalid" : ""}
                                            isRtl={true}
                                        />
                                        {errors.permissions && (
                                            <div className="invalid-feedback" style={{ display: "block" }}>
                                                {errors.permissions}
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section className="col-12 col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="roles">Role‌ها</label>
                                        <Select
                                            isMulti
                                            name="roles"
                                            options={rolesOptions}
                                            value={selectedRoles}
                                            onChange={handleSelectChange}
                                            placeholder="انتخاب Role‌ها"
                                            className={errors.roles ? "is-invalid" : ""}
                                            isRtl={true}
                                        />
                                        {errors.roles && (
                                            <div className="invalid-feedback" style={{ display: "block" }}>
                                                {errors.roles}
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section className="col-12">
                                    <button type="submit" className="btn btn-success btn-sm" disabled={isLoading}>
                                        {isLoading ? "در حال ثبت..." : "ثبت تغییرات"}
                                    </button>
                                </section>
                            </section>
                        </form>
                    </section>
                </section>
            </section>
        </section>
    );
}

export default EditAdminUser;