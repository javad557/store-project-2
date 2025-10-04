import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePage, getPages, updatePageStatus } from "../../services/pageService";
import { confirmDelete, showError, showSuccess } from "../../../utils/notifications";
import { Link } from "react-router-dom";

function Pages() {
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading, error, isError, isSuccess } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const response = await getPages();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
    // refetchOnWindowFocus: false 

  });

  // Mutation برای تغییر وضعیت
const statusMutation = useMutation({
  mutationFn: ({ id, status }) => updatePageStatus(id, { status }),
  onSuccess: (response, { id, status }) => {
    queryClient.setQueryData(["pages"], (oldData) =>
      oldData.map((page) => (page.id === id ? { ...page, status: status } : page))
    );
    showSuccess(response.data.message || "وضعیت صفحه با موفقیت تغییر کرد");
    queryClient.invalidateQueries(["pages"]);
  },
  onError: (error) => {
    showError(error.response?.data?.error || "تغییر وضعیت صفحه با خطا مواجه شد");
  },
});

  const deleteMutation = useMutation({
    mutationFn: deletePage,
    onSuccess: (response, id) => {
      queryClient.setQueryData(["pages"], (oldData) =>
        oldData.filter((page) => page.id !== id)
      );
      queryClient.invalidateQueries(["pages"]);
      showSuccess(response.data.message);
    },
    onError: (error) => {
      showError(error.response?.data?.error || "حذف صفحه اطلاع‌رسانی با خطا مواجه شد");
    },
  });

  const handleDelete = async (id, name) => {
    const isConfirmed = await confirmDelete(name);
    if (isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusChange = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1; // تغییر وضعیت (1 به 0 یا 0 به 1)
    statusMutation.mutate({ id, status: newStatus });
  };

  if (isError) {
    showError(error.response?.data?.error || "دریافت صفحات اطلاع‌رسانی با خطا مواجه شد");
  }
  if (isSuccess) {
    console.log("success");
  }

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>پیج ساز</h5>
          </section>

          <section
            className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2"
          >
            <Link to="/admin/pages/add" className="btn btn-info btn-sm">
              ایجاد صفحه اطلاع‌رسانی
            </Link>
          </section>

          {isLoading ? (
            <div className="text-center my-4">
              <p>در حال بارگذاری...</p>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">در حال بارگذاری...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center my-4 text-danger">
              خطایی رخ داده است. لطفاً دوباره تلاش کنید.
            </div>
          ) : (
            <section className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>عنوان</th>
                    <th>متن</th>
                    <th>وضعیت</th>
                    <th className="max-width-16-rem text-center">
                      <i className="fa fa-cogs"></i> تنظیمات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pages.length > 0 ? (
                    pages.map((page, index) => (
                      <tr key={page.id}>
                        <td>{index + 1}</td>
                        <td>{page.title}</td>
                        <td style={{ maxWidth: "200px" }} title={page.body}>
                          {page.body.substring(0, 38) + "..."}
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={page.status === 1}
                            onChange={() => handleStatusChange(page.id, page.status)}
                            disabled={statusMutation.isPending}
                          />
                        </td>
                        <td>
                          <Link
                            to={`/admin/pages/edit/${page.id}`}
                            className="btn btn-primary btn-sm me-2"
                          >
                            <i className="fa fa-edit me-1"></i>ویرایش
                          </Link>
                          <button
                            onClick={() => handleDelete(page.id, page.name)}
                            className="btn btn-danger btn-sm"
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? (
                              <span>
                                <span
                                  className="spinner-border spinner-border-sm me-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                در حال حذف...
                              </span>
                            ) : (
                              <span>
                                <i className="fa fa-trash me-1"></i>حذف
                              </span>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        هیچ صفحه‌ای وجود ندارد.
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

export default Pages;