import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import { getCopan, updateCopan } from "../../../services/marketing/discountService.js";
import { getCustomers } from "../../../services/user/customerService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaArrowRight } from "react-icons/fa";
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

function EditCopan() {
  const [formData, setFormData] = useState({
    code: "",
    user_id: null,
    amount: "",
    end_date: null, // برای DatePicker (DateObject یا null)
    end_date_server: "", // برای ارسال به سرور
    used: "0", // 0: استفاده‌نشده، 1: استفاده‌شده
    status: "1", // 1: فعال، 0: غیرفعال
  });
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({
    form: null, // فقط برای خطاهای سرور
  });
  const [loading, setLoading] = useState({
    form: false,
    users: true,
    copan: true,
  });
  const navigate = useNavigate();
  const { id } = useParams();

  // دریافت اطلاعات کد تخفیف و کاربران
  useEffect(() => {
    const fetchCopan = async () => {
      try {
        const response = await getCopan(id);
        const copan = response.data;
        setFormData({
          code: copan.code || "",
          user_id: copan.user_id || null,
          amount: copan.amount ? copan.amount.toString() : "",
          end_date: copan.end_date ? new DateObject(copan.end_date) : null,
          end_date_server: copan.end_date || "",
          used: copan.used != null ? copan.used.toString() : "0", // اطمینان از مقدار معتبر
          status: copan.status != null ? copan.status.toString() : "1",
        });
      } catch (error) {
        console.error("خطا در دریافت کد تخفیف:", error);
        setErrors((prev) => ({ ...prev, form: "خطا در دریافت اطلاعات کد تخفیف" }));
        showError("خطا در دریافت اطلاعات کد تخفیف");
      } finally {
        setLoading((prev) => ({ ...prev, copan: false }));
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await getCustomers();
        const userOptions = response.data.map((user) => ({
          value: user.id,
          label: `${user.name} (${user.email})`,
        }));
        setUsers(userOptions);
      } catch (error) {
        console.error("خطا در دریافت کاربران:", error);
        setErrors((prev) => ({ ...prev, form: "خطا در دریافت لیست کاربران" }));
        showError("خطا در دریافت لیست کاربران");
      } finally {
        setLoading((prev) => ({ ...prev, users: false }));
      }
    };

    fetchCopan();
    fetchUsers();
  }, [id]);

  // مدیریت تغییرات ورودی‌ها
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // مدیریت انتخاب کاربر
  const handleUserChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, user_id: selectedOption ? selectedOption.value : null }));
  };

  // مدیریت انتخاب تاریخ
  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = date.toDate().toISOString().split("T")[0]; // فرمت YYYY-MM-DD برای سرور
      setFormData((prev) => ({
        ...prev,
        end_date: date,
        end_date_server: formattedDate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        end_date: null,
        end_date_server: "",
      }));
    }
  };

  // ارسال فرم
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, form: null }));

    const payload = {
      code: formData.code,
      user_id: formData.user_id,
      amount: Number(formData.amount) || 0, // جلوگیری از ارسال مقدار نامعتبر
      end_date: formData.end_date_server,
      used: Number(formData.used) || 0, // اطمینان از ارسال 0 یا 1
      status: Number(formData.status) || 1,
    };

    setLoading((prev) => ({ ...prev, form: true }));
    try {
      const response = await updateCopan(id, payload);
      showSuccess(response.data.message || "کد تخفیف با موفقیت ویرایش شد");
      navigate("/admin/marketing/copans");
    } catch (error) {
      console.error("خطا در ویرایش کد تخفیف:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        Object.values(error.response?.data?.errors || {}).flat().join(" ") ||
        "خطا در ویرایش کد تخفیف";
      setErrors((prev) => ({ ...prev, form: errorMessage }));
      showError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };

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
            <h5>ویرایش کد تخفیف</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <button
              className="btn btn-info btn-sm"
              onClick={() => navigate("/admin/marketing/copans")}
            >
              <FaArrowRight /> بازگشت
            </button>
          </section>

          <section>
            {loading.copan ? (
              <div>در حال بارگذاری...</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <section className="row">
                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="code">کد تخفیف</label>
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        className="form-control form-control-sm"
                        required
                      />
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="user_id">کاربر</label>
                      <Select
                        options={users}
                        onChange={handleUserChange}
                        placeholder="جستجوی کاربر..."
                        isClearable
                        isLoading={loading.users}
                        value={users.find((user) => user.value === formData.user_id) || null}
                      />
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="amount">میزان تخفیف</label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="form-control form-control-sm"
                        min="0"
                        required
                      />
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="end_date">تاریخ انقضا</label>
                      <DatePicker
                        id="end_date"
                        name="end_date"
                        calendar={persian}
                        locale={persian_fa}
                        value={formData.end_date}
                        onChange={handleDateChange}
                        className="rmdp-mobile"
                        inputClass="rmdp-input"
                        placeholder="انتخاب تاریخ (مثال: ۱۴۰۴/۰۶/۱۲)"
                        format="YYYY/MM/DD"
                        calendarPosition="bottom-right"
                      />
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="used">وضعیت استفاده</label>
                      <select
                        id="used"
                        name="used"
                        className="form-control form-control-sm"
                        value={formData.used}
                        onChange={handleInputChange}
                      >
                        <option value="0">استفاده‌نشده</option>
                        <option value="1">استفاده‌شده</option>
                      </select>
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="status">وضعیت فعال بودن</label>
                      <select
                        id="status"
                        name="status"
                        className="form-control form-control-sm"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="1">فعال</option>
                        <option value="0">غیرفعال</option>
                      </select>
                    </div>
                  </section>

                  <section className="col-12">
                    <button
                      type="submit"
                      className="btn btn-success btn-sm"
                      disabled={loading.form}
                    >
                      {loading.form ? "در حال ثبت..." : "تأیید"}
                    </button>
                    {errors.form && (
                      <div className="text-danger mt-2">{errors.form}</div>
                    )}
                  </section>
                </section>
              </form>
            )}
          </section>
        </section>
      </section>
    </section>
  );
}

export default EditCopan;