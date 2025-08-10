import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCopans, deleteCopan, toggleCopanStatus } from "../../../services/marketing/discountService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import moment from "moment-jalaali"; // اضافه کردن moment-jalaali

function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await getCopans();
        console.log("پاسخ API:", response.data);
        const mappedDiscounts = Array.isArray(response.data)
          ? response.data.map(discount => ({
              ...discount,
              is_active: discount.status === 1,
              user_name: discount.user ? discount.user.full_name : "Unknown",
              formatted_end_date: discount.end_date
                ? moment(discount.end_date).format("jYYYY/jMM/jDD") // تبدیل به تاریخ شمسی
                : "بدون تاریخ انقضا"
            }))
          : [];
        console.log("داده‌های نگاشت‌شده:", mappedDiscounts);
        setDiscounts(mappedDiscounts);
      } catch (error) {
        console.warn("دریافت کدهای تخفیف با خطا مواجه شد:", error.message);
        setDiscounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  const handleDelete = async (id, code) => {
    const result = await Swal.fire({
      title: `آیا از حذف کد تخفیف "${code}" مطمئن هستید؟`,
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
        await deleteCopan(id);
        setDiscounts(discounts.filter((discount) => discount.id !== id));
        showSuccess("کد تخفیف با موفقیت حذف شد");
      } catch (error) {
        showError("حذف کد تخفیف با خطا مواجه شد");
      }
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      await toggleCopanStatus(id, !isActive);
      setDiscounts(
        discounts.map((discount) =>
          discount.id === id ? { ...discount, is_active: !isActive } : discount
        )
      );
      showSuccess(`کد تخفیف با موفقیت ${!isActive ? "فعال" : "غیرفعال"} شد`);
    } catch (error) {
      showError("تغییر وضعیت کد تخفیف با خطا مواجه شد");
    }
  };

  const filteredDiscounts = discounts.filter((discount) =>
    discount.user_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="row" dir="rtl">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>کوپن تخفیف</h5>
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
            <Link to="/admin/marketing/copans/add" className="btn btn-info btn-sm">
              ایجاد کوپن تخفیف
            </Link>
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
                ) : filteredDiscounts.length > 0 ? (
                  filteredDiscounts.map((discount, index) => (
                    <tr key={discount.id} style={{ cursor: "pointer" }}>
                      <th>{index + 1}</th>
                      <td>{discount.user_name || "Unknown"}</td>
                      <td>{discount.code}</td>
                      <td>{discount.amount}</td>
                      <td>{discount.formatted_end_date}</td> {/* استفاده از تاریخ فرمت‌شده */}
                      <td>
                        <input
                          type="checkbox"
                          checked={discount.is_active}
                          onChange={() => handleToggleStatus(discount.id, discount.is_active)}
                        />
                      </td>
                      <td className="text-center">
                        <div className="btn-group">
                          <Link
                            to={`/admin/marketing/copans/edit/${discount.id}`}
                            className="btn btn-primary btn-sm me-1"
                          >
                            <FaEdit className="me-1" />
                            ویرایش
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(discount.id, discount.code)}
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