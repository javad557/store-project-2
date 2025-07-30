import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBanners, deleteBanner, toggleBannerStatus } from "../../../services/marketing/bannerService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await getBanners();
        console.log("بنرهای دریافت‌شده:", response.data);
        const mappedBanners = Array.isArray(response.data)
          ? response.data.map(banner => ({
              ...banner,
              is_active: banner.active === 1 // تبدیل 0/1 به false/true
            }))
          : [];
        setBanners(mappedBanners);
      } catch (error) {
        console.warn("دریافت بنرها با خطا مواجه شد:", error.message);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: `آیا از حذف بنر "${title}" مطمئن هستید؟`,
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
        await deleteBanner(id);
        setBanners(banners.filter((banner) => banner.id !== id));
        showSuccess("بنر با موفقیت حذف شد");
      } catch (error) {
        showError("حذف بنر با خطا مواجه شد");
      }
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      await toggleBannerStatus(id, !isActive);
      setBanners(
        banners.map((banner) =>
          banner.id === id ? { ...banner, is_active: !isActive } : banner
        )
      );
      showSuccess(`بنر با موفقیت ${!isActive ? "فعال" : "غیرفعال"} شد`);
    } catch (error) {
      showError("تغییر وضعیت بنر با خطا مواجه شد");
    }
  };

  return (
    <section className="row" dir="rtl">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>مدیریت بنرها</h5>
          </section>

          <section className="d-flex justify-content-start align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/marketing/banners/add" className="btn btn-success btn-sm">
              افزودن بنر جدید
            </Link>
          </section>

          <section className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>عنوان</th>
                  <th>تصویر</th>
                  <th>آدرس URL</th>
                  <th>موقعیت</th>
                  <th className="text-center">تنظیمات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      در حال بارگذاری...
                    </td>
                  </tr>
                ) : banners.length > 0 ? (
                  banners.map((banner, index) => (
                    <tr key={banner.id} style={{ cursor: "pointer" }}>
                      <th>{index + 1}</th>
                      <td>{banner.title}</td>
                      <td>
                        <img
                          src={`http://localhost:8000/storage/${banner.image}`}
                          alt={banner.title}
                          width="60"
                          height="25"
                        />
                      </td>
                      <td>
                        <a href={banner.url} target="_blank" rel="noopener noreferrer">
                          {banner.url}
                        </a>
                      </td>
                      <td>{banner.position}</td>
                      <td className="text-center">
                        <div className="btn-group">
                          <Link
                            to={`/admin/marketing/banners/edit/${banner.id}`}
                            className="btn btn-primary btn-sm me-1"
                          >
                            <FaEdit className="me-1" />
                            ویرایش
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(banner.id, banner.title)}
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
                      هیچ بنری یافت نشد
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

export default Banners;