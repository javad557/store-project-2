// src/admin/pages/brands/AllBrands.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getBrands,
  deleteBrand,
} from "../../../services/market/brandService.js";
import {
  showSuccess,
  showError,
  confirmDelete,
} from "../../../../utils/notifications.jsx";

function AllBrands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getBrands();
        setBrands(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setBrands([]);
        showError("دریافت برندها با خطا مواجه شد");
      }
    };
    fetchBrands();
  }, []);

  const handleDelete = async (id, name) => {
    const isConfirmed = await confirmDelete(name);
    if (isConfirmed) {
      try {
        const response = await deleteBrand(id);
        setBrands(brands.filter((brand) => brand.id !== id));
        showSuccess(response.data.message);
      } catch (error) {
        showError("حذف برند با خطا مواجه شد");
      }
    }
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
                      <td>{brand.name}</td>
                      <td>
                        <Link
                          to={`/admin/market/brands/edit/${brand.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          ویرایش
                          <i className="fa fa-edit"></i>
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(brand.id, brand.name)}
                        >
                          حذف
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">برندی یافت نشد</td>
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

export default AllBrands;