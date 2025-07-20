// src/admin/pages/brands/AddBrand.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { addBrand } from "../../../services/market/brandService.js";

function AddBrand() {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError("");

    if (!name.trim()) {
      setNameError("نام برند الزامی است");
      return;
    }

    try {
      const response = await addBrand({ name });
      showSuccess(response.data.message);
      navigate("/admin/market/brands");
    } catch (error) {
      showError("افزودن برند با خطا مواجه شد");
    }
  };

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>افزودن برند</h5>
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

export default AddBrand;