import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAmazingSales, deleteAmazingSale, toggleAmazingSaleStatus } from "../../../services/marketing/amazingSaleService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import moment from "moment-jalaali";

function AmazingSales() {
  const [amazingSales, setAmazingSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAmazingSales = async () => {
      try {
        const response = await getAmazingSales();
        console.log("پاسخ API:", response.data);
        const mappedSales = Array.isArray(response.data)
          ? response.data.map((sale) => ({
              ...sale,
              is_active: sale.status === 1,
              product_name: sale.product ? sale.product.name : "Unknown",
              formatted_end_date: sale.end_date
                ? moment(sale.end_date).format("jYYYY/jMM/jDD")
                : "بدون تاریخ انقضا",
            }))
          : [];
        console.log("داده‌های نگاشت‌شده:", mappedSales);
        setAmazingSales(mappedSales);
      } catch (error) {
        console.warn("دریافت فروش‌های شگفت‌انگیز با خطا مواجه شد:", error.message);
        setAmazingSales([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAmazingSales();
  }, []);

  const handleDelete = async (id, productName) => {
    const result = await Swal.fire({
      title: `آیا از حذف فروش شگفت‌انگیز برای "${productName}" مطمئن هستید؟`,
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
        await deleteAmazingSale(id);
        setAmazingSales(amazingSales.filter((sale) => sale.id !== id));
        showSuccess("فروش شگفت‌انگیز با موفقیت حذف شد");
      } catch (error) {
        console.error("خطا در حذف فروش شگفت‌انگیز:", error.response?.data, error.message);
        showError("حذف فروش شگفت‌انگیز با خطا مواجه شد");
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      // پیدا کردن فروش شگفت‌انگیز فعلی برای محاسبه وضعیت جدید
      const currentSale = amazingSales.find((sale) => sale.id === id);
      const newStatus = currentSale.is_active ? 0 : 1; // معکوس کردن وضعیت
      await toggleAmazingSaleStatus(id);
      setAmazingSales(
        amazingSales.map((sale) =>
          sale.id === id ? { ...sale, is_active: !currentSale.is_active, status: newStatus } : sale
        )
      );
      showSuccess(`فروش شگفت‌انگیز با موفقیت ${newStatus ? "فعال" : "غیرفعال"} شد`);
    } catch (error) {
      console.error("خطا در تغییر وضعیت:", error.response?.data, error.message);
      showError("تغییر وضعیت فروش شگفت‌انگیز با خطا مواجه شد");
    }
  };

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
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      در حال بارگذاری...
                    </td>
                  </tr>
                ) : filteredSales.length > 0 ? (
                  filteredSales.map((sale, index) => (
                    <tr key={sale.id} style={{ cursor: "pointer" }}>
                      <th>{index + 1}</th>
                      <td>{sale.product_name || "Unknown"}</td>
                      <td>{sale.amount}%</td>
                      <td>{sale.formatted_end_date}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={sale.is_active}
                          onChange={() => handleToggleStatus(sale.id)}
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
          </section>
        </section>
      </section>
    </section>
  );
}

export default AmazingSales;