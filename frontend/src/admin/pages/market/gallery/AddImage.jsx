import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; // اضافه کردن useNavigate
import { addImage } from "../../../services/market/imageService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";

function AddImage() {
  const { productId } = useParams();
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate(); // اضافه کردن هوک navigate

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFormats = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    const fileErrors = [];
    const validFiles = selectedFiles.filter((file, index) => {
      if (!validFormats.includes(file.type)) {
        fileErrors.push(`فایل ${file.name} فرمت غیرمجاز دارد (فقط jpg, jpeg, png مجاز است)`);
        return false;
      }
      if (file.size > maxSize) {
        fileErrors.push(`فایل ${file.name} بیش از 2 مگابایت است`);
        return false;
      }
      return true;
    });

    setFiles(validFiles);
    setErrors(fileErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      showError("لطفاً حداقل یک تصویر معتبر انتخاب کنید");
      return;
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    try {
      const response = await addImage(productId, formData);
      showSuccess(response.data.message || "تصاویر با موفقیت آپلود شدند");
      setFiles([]);
      setErrors([]);
      e.target.reset();
      navigate(`/admin/market/gallery/${productId}`); // هدایت به صفحه گالری
    } catch (error) {
      showError("خطا در آپلود تصاویر: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>ایجاد عکس برای محصول</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to={`/admin/market/gallery/${productId}`} className="btn btn-info btn-sm">
              بازگشت
            </Link>
          </section>

          <section>
            <form onSubmit={handleSubmit}>
              <section className="row">
                <section className="col-12">
                  <div className="form-group">
                    <label htmlFor="images">تصویر</label>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      className="form-control form-control-sm"
                    />
                    {errors.length > 0 && (
                      <div className="text-danger mt-2">
                        {errors.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                <section className="col-12">
                  <button type="submit" className="btn btn-primary btn-sm">
                    ثبت
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

export default AddImage;