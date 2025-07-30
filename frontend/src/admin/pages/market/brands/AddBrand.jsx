import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

function AddBanner() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [position, setPosition] = useState("");
  const [titleError, setTitleError] = useState("");
  const [imageError, setImageError] = useState("");
  const [urlError, setUrlError] = useState("");
  const [positionError, setPositionError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTitleError("");
    setImageError("");
    setUrlError("");
    setPositionError("");

    let hasError = false;

    if (!title.trim()) {
      setTitleError("عنوان بنر الزامی است");
      hasError = true;
    }
    if (!image) {
      setImageError("عکس بنر الزامی است");
      hasError = true;
    }
    if (!position.trim()) {
      setPositionError("موقعیت بنر الزامی است");
      hasError = true;
    }

    if (hasError) return;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);
      formData.append("url", url);
      formData.append("position", position);

      const response = await axios.post(
        "http://localhost:8000/api/admin/marketing/banners",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showSuccess(response.data.message);
      navigate("/admin/market/banners");
    } catch (error) {
      console.warn("خطا در ارسال داده‌ها به سرور:", error.message);
      showError(
        error.response?.status === 404
          ? "سرور در دسترس نیست"
          : error.response?.status === 403
          ? "عدم دسترسی به سرور"
          : "افزودن بنر با خطا مواجه شد"
      );
    }
  };

  return (
    <section className="row" dir="rtl">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>افزودن بنر جدید</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/market/banners" className="btn btn-primary btn-sm">
              <i className="fa fa-arrow-right me-1"></i> بازگشت
            </Link>
            <button
              type="submit"
              form="banner-form"
              className="btn btn-success btn-sm"
            >
              <i className="fa fa-check me-1"></i> تأیید
            </button>
          </section>

          <form id="banner-form" onSubmit={handleSubmit}>
            <section className="row">
              <section className="col-12 col-md-6">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    عنوان بنر
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${titleError ? "is-invalid" : ""}`}
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {titleError && (
                    <div className="invalid-feedback">{titleError}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    عکس بنر
                  </label>
                  <input
                    type="file"
                    className={`form-control form-control-sm ${imageError ? "is-invalid" : ""}`}
                    id="image"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  {imageError && (
                    <div className="invalid-feedback">{imageError}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="url" className="form-label">
                    آدرس URL
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${urlError ? "is-invalid" : ""}`}
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  {urlError && (
                    <div className="invalid-feedback">{urlError}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="position" className="form-label">
                    موقعیت بنر
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${positionError ? "is-invalid" : ""}`}
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                  {positionError && (
                    <div className="invalid-feedback">{positionError}</div>
                  )}
                </div>
              </section>

              <section className="col-12">
                <button type="submit" className="btn btn-success btn-sm">
                  <i className="fa fa-check me-1"></i> ثبت
                </button>
              </section>
            </section>
          </form>
        </section>
      </section>
    </section>
  );
}

export default AddBanner;