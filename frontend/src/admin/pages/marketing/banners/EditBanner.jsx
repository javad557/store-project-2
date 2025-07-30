import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

function EditBanner() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [url, setUrl] = useState("");
  const [position, setPosition] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/admin/marketing/banners/${id}`, {
          headers: { "Accept": "application/json" },
        });
        const banner = response.data;
        setTitle(banner.title || "");
        setCurrentImage(banner.image || "");
        setUrl(banner.url || "");
        setPosition(banner.position || "");
      } catch (error) {
        console.warn("خطا در بارگذاری اطلاعات بنر:", error.message);
        showError("خطا در بارگذاری اطلاعات بنر: " + (error.response?.data?.error || error.message));
      }
    };
    fetchBanner();
  }, [id]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      if (image) formData.append("image", image);
      formData.append("url", url);
      formData.append("position", position);
      formData.append("_method", "PUT");

      const response = await axios.post(
        `http://localhost:8000/api/admin/marketing/banners/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
          },
        }
      );

      showSuccess(response.data.message || "بنر با موفقیت ویرایش شد");
      setImage(null);
      setTitle("");
      setUrl("");
      setPosition("");
      e.target.reset();
      navigate("/admin/marketing/banners");
    } catch (error) {
      console.warn("خطا در ویرایش بنر:", error.message);
      showError(
        error.response?.status === 404
          ? "بنر یافت نشد"
          : error.response?.status === 403
          ? "عدم دسترسی به سرور"
          : "ویرایش بنر با خطا مواجه شد: " + (error.response?.data?.error || error.message)
      );
    }
  };

  return (
    <section className="row" dir="rtl">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>ویرایش بنر</h5>
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
                    {currentImage && (
                      <div className="mb-2">
                        <img
                          src={`http://localhost:8000/storage/${currentImage}`}
                          alt="تصویر فعلی بنر"
                          style={{ maxWidth: "300px", height: "auto" }}
                        />
                      </div>
                    )}
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
                </section>

                <section className="col-12">
                  <button type="submit" className="btn btn-success btn-sm">
                    <i className="fa fa-check me-1"></i> ویرایش
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

export default EditBanner;