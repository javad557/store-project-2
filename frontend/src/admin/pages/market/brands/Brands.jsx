import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { deleteBrand, getBrands, updateBrand } from "../../../services/market/brandService";
import { confirmDelete, showError, showSuccess } from "../../../../utils/notifications";
import { useState } from "react";

function AllBrands() {
  const queryClient = useQueryClient();

  // State برای مدیریت مقادیر اینپوت‌ها
  const [brandNames, setBrandNames] = useState({});

  // دریافت لیست برندها
  const { data: brands = [], error, isError, isSuccess, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await getBrands();
      const brandsData = Array.isArray(response.data.data) ? response.data.data : [];
      // مقدار اولیه برای اینپوت‌ها
      setBrandNames(
        brandsData.reduce((acc, brand) => ({ ...acc, [brand.id]: brand.name }), {})
      );
      return brandsData;
    },
  });

  // Mutation برای حذف برند
  const deleteMutation = useMutation({
    mutationFn: deleteBrand,
    onSuccess: (response, id) => {
      queryClient.setQueryData(["brands"], (oldData) =>
        oldData.filter((brand) => brand.id !== id)
      );
      queryClient.invalidateQueries(["brands"]);
      showSuccess(response.data.message);
    },
    onError: (error) => {
      showError(error.response?.data?.error || "حذف برند با خطا مواجه شد");
    },
  });

  // Mutation برای به‌روزرسانی برند
  const updateMutation = useMutation({
    mutationFn: ({ id, name }) => updateBrand(id, { name }),
    onSuccess: (response) => {
      queryClient.invalidateQueries(["brands"]);
      showSuccess(response.data.message || "برند با موفقیت به‌روزرسانی شد");
    },
    onError: (error) => {
      showError(error.response?.data?.error || "به‌روزرسانی برند با خطا مواجه شد");
    },
  });

  const handleDelete = async (id, name) => {
    const isConfirmed = await confirmDelete(name);
    if (isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const handleUpdate = (id) => {
    const name = brandNames[id];
    if (!name || name.trim() === "") {
      showError("نام برند نمی‌تواند خالی باشد");
      return;
    }
    updateMutation.mutate({ id, name });
  };

  const handleInputChange = (id, value) => {
    setBrandNames((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>مدیریت برندها</h5>
          </section>
          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/market/brands/add" className="btn btn-success btn-sm">
              <i className="fa fa-plus"></i> افزودن
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
              خطایی رخ داده است. لطفاً دوباره تلاش کنید.
            </div>
          ) : (
            <section className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>نام برند</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.length > 0 ? (
                    brands.map((brand, index) => (
                      <tr key={brand.id}>
                        <td>{index + 1}</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={brandNames[brand.id] || ""}
                            onChange={(e) => handleInputChange(brand.id, e.target.value)}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleUpdate(brand.id)}
                          >
                            <i className="fa fa-check me-1"></i> ثبت تغییرات
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(brand.id, brand.name)}
                          >
                            <i className="fa fa-trash me-1"></i> حذف
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        هیچ برندی وجود ندارد.
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

export default AllBrands;