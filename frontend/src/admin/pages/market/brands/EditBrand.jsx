// src/admin/pages/brands/EditBrand.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { getBrand, updateBrand } from "../../../services/market/brandService.js";

function EditBrand() {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandResponse = await getBrand(id);
        setName(brandResponse.data.name);
      } catch (error) {
        showError("دریافت اطلاعات با خطا مواجه شد");
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError("");

    if (!name.trim()) {
      setNameError("نام برند الزامی است");
      return;
    }

    try {
      const response = await updateBrand(id, { name });
      showSuccess(response.data.message);
      navigate("/admin/market/brands");
    } catch (error) {
      showError("به‌روزرسانی برند با خطا مواجه شد");
    }
  };

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>ویرایش برند</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/market/brands" className="btn btn-primary btn-sm">
              <i className="fa fa-arrow-right"></i> بازگشت
            </Link>
            <button
              type="submit"
              form="brand-form"
              className="btn btn-success btn-sm"
            >
              <i className="fa fa-check"></i> تأیید
            </button>
          </section>

          <form id="brand-form" onSubmit={handleSubmit}>
            <section className="row">
              <section className="col-12 col-md-6">
                <div className="mb-3">
                  <label htmlFor="brand-name" className="form-label">
                    نام برند
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${
                      nameError ? "is-invalid" : ""
                    }`}
                    id="brand-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {nameError && (
                    <div className="invalid-feedback">{nameError}</div>
                  )}
                </div>
              </section>

              <section className="col-12">
                <button
                  type="submit"
                  className="btn btn-success btn-sm"
                >
                  <i className="fa fa-check"></i> ثبت
                </button>
              </section>
            </section>
          </form>
        </section>
      </section>
    </section>
  );
}

export default EditBrand;