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
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validFormats = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    const imageErrors = [];
    if (!file) {
      imageErrors.push("لطفاً یک تصویر انتخاب کنید");
    } else if (!validFormats.includes(file.type)) {
      imageErrors.push("فرمت تصویر غیرمجاز است (فقط jpg, jpeg, png مجاز است)");
    } else if (file.size > maxSize) {
      imageErrors.push("حجم تصویر بیش از 2 مگابایت است");
    } else {
      setImage(file);
    }

    setErrors(imageErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = [];

    if (!title.trim()) {
      newErrors.push("عنوان بنر الزامی است");
    }
    if (!image) {
      newErrors.push("عکس بنر الزامی است");
    }
    if (!position.trim()) {
      newErrors.push("موقعیت بنر الزامی است");
    }

    setErrors(newErrors);
    if (newErrors.length > 0) {
      showError("لطفاً فیلدهای الزامی را پر کنید");
      return;
    }

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
            "Accept": "application/json",
          },
        }
      );

      showSuccess(response.data.message || "بنر با موفقیت اضافه شد");
      setTitle("");
      setImage(null);
      setUrl("");
      setPosition("");
      setErrors([]);
      e.target.reset();
      navigate("/admin/marketing/banners");
    } catch (error) {
      console.warn("خطا در ارسال داده‌ها به سرور:", error.message);
      showError(
        error.response?.status === 404
          ? "سرور در دسترس نیست"
          : error.response?.status === 403
          ? "عدم دسترسی به سرور"
          : "افزودن بنر با خطا مواجه شد: " + (error.response?.data?.error || error.message)
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
            <Link to="/admin/marketing/banners" className="btn btn-primary btn-sm">
              <i className="fa fa-arrow-right me-1"></i> بازگشت
            </Link>
          </section>

          <section>
            <form onSubmit={handleSubmit}>
              <section className="row">
                <section className="col-12">
                  <div className="form-group mb-3">
                    <label htmlFor="title" className="form-label">
                      عنوان بنر
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="image" className="form-label">
                      عکس بنر
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleImageChange}
                      className="form-control form-control-sm"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="url" className="form-label">
                      آدرس URL
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="position" className="form-label">
                      موقعیت بنر
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    />
                  </div>

                  {errors.length > 0 && (
                    <div className="text-danger mt-2">
                      {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  )}
                </section>

                <section className="col-12">
                  <button type="submit" className="btn btn-success btn-sm">
                    <i className="fa fa-check me-1"></i> افزودن
                  </button>
                </section>
              </section>
            </form>
          </section>
        </section>
      </section>
    </section>
  );
}

export default AddBanner;