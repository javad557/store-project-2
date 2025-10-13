// src/admin/pages/marketing/Banners.jsx
import { Link } from "react-router-dom";
import { deleteBanner, getBanners } from "../../../services/marketing/bannerService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { confirmDelete, showError, showSuccess } from "../../../../utils/notifications";

function Banners() {
  const queryClient = useQueryClient();

  const { data: banners = [], error, isError, isSuccess, isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const response = await getBanners();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: (response, id) => {
      queryClient.setQueryData(["banners"], (oldData) =>
        oldData.filter((banner) => banner.id !== id)
      );
      queryClient.invalidateQueries(["banners"]);
      showSuccess(response.data.message || "بنر با موفقیت حذف شد");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      showError(error.response?.data?.error || "خطا در حذف بنر");
    },
  });

  const handleDelete = async (id, name) => {
    const isConfirmed = await confirmDelete(name || "این بنر");
    if (isConfirmed) {
      deleteMutation.mutate(id);
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

          {isLoading ? (
            <div className="text-center my-4">
              <p>در حال بارگذاری...</p>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">در حال بارگذاری...</span>
              </div>
            </div>
          ) : isError ? (
            <div className="text-center my-4 text-danger">
              خطایی رخ داده است: {error.message || "لطفاً دوباره تلاش کنید."}
            </div>
          ) : (
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
                  {banners.length > 0 ? (
                    banners.map((banner, index) => (
                      <tr key={banner.id}>
                        <td>{index + 1}</td>
                        <td>{banner.title}</td>
                        <td> {/* اضافه کردن <td> برای تصویر */}
                          <img
                            src={`http://localhost:8000/storage/${banner.image}`}
                            alt={banner.title || "بنر"}
                            width="90"
                            height="45"
                            onError={(e) => {
                              e.target.src = "/src/admin/assets/images/placeholder.png"; // تصویر پیش‌فرض در صورت خطا
                            }}
                          />
                        </td>
                        <td>{banner.url}</td>
                        <td>{banner.position}</td>
                        <td>
                          <Link
                            to={`/admin/marketing/banners/edit/${banner.id}`}
                            className="btn btn-primary btn-sm me-2"
                          >
                            <i className="fa fa-edit me-1"></i>ویرایش
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(banner.id, banner.title)}
                            disabled={deleteMutation.isPending}
                          >
                            <i className="fa fa-trash me-1"></i>
                            {deleteMutation.isPending ? "در حال حذف" : "حذف"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        هیچ بنری وجود ندارد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          )}
        </section>
      </section>
    </section>
  );
}

export default Banners;