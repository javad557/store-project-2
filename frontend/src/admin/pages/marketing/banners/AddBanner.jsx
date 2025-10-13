
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addBanner } from "../../../services/marketing/bannerService";
import { showError, showSuccess } from "../../../../utils/notifications";


function AddBanner() {

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formData,setFormData]=useState({
    title : "",
    image : "",
    url : "",
    position : "",
  })

   const [errors,setErrors]=useState({
    title : null,
    image : null,
    url : null,
    position : null,
  })


const handleChange = (e) => {
    const { name, value, files } = e.target;
    const inputValue = name === "image" ? files[0] : value;
    // const error = validateField(name, inputValue);
    // setErrors((prev) => ({ ...prev, [name]: error }));
    setFormData((prev) => ({ ...prev, [name]: inputValue }));
};

  const mutation = useMutation({
    mutationFn: addBanner,
    onSuccess: (response)=>{
      queryClient.invalidateQueries(['banners']);
      showSuccess(response.data.message);
      navigate("/admin/marketing/banners")
    },
    onError: (error)=>{
      if(error.response.status === 422){
         const validationErrors = error.response.data.errors || {};
        setErrors(
          Object.keys(validationErrors).reduce((acc, key) => {
            acc[key] = Array.isArray(validationErrors[key])
              ? validationErrors[key][0]
              : validationErrors[key];
            return acc;
          }, { name: null, amount: null, delivery_time: null })
        );
        showError('مقادیر فرم ها نامعتبر هستند');
      }
      else{
        showError(error.response.data.error);
      }
    }
  })


  const validateField = (name, value) => {
    switch (name) {
        case "title":
            if (!value.trim()) return "عنوان بنر الزامی است";
            if (value.trim().length < 3) return "عنوان بنر نباید کمتر از 3 کاراکتر باشد";
            return null;
        case "image":
            if (!value) return "تصویر بنر الزامی است";
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (value && !allowedTypes.includes(value.type)) return "فقط فایل‌های JPG یا PNG مجاز هستند";
            if (value && value.size > 5 * 1024 * 1024) return "حجم فایل باید کمتر از 5 مگابایت باشد";
            return null;
        case "url":
            if (!value.trim()) return "آدرس بنر الزامی است";
            return null;
        case "position":
            if (!value.trim()) return "موقعیت بنر الزامی است";
            if (value && isNaN(value)) return "موقعیت باید یک عدد باشد";
            return null;
        default:
            return null;
    }
};



 const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("image", formData.image); // فایل تصویر
    data.append("url", formData.url);
    data.append("position", formData.position);

    mutation.mutate(data);
  };


const isFormValid = () => {
    const newErrors = {
        title: validateField("title", formData.title),
        image: validateField("image", formData.image),
        url: validateField("url", formData.url),
        position: validateField("position", formData.position),
    };
    return !Object.values(newErrors).some((error) => error);
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
                       className={`form-control form-control-sm ${errors.title ? "is-invalid" : ""}`}
                      id="title"
                      name="title"
                      onChange={handleChange}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="image" className="form-label">
                      عکس بنر
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className={`form-control form-control-sm ${errors.image ? "is-invalid" : ""}`}
                      name="image"
                       onChange={handleChange}
                    />
                    {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="url" className="form-label">
                      آدرس URL
                    </label>
                    <input
                      type="text"
                       className={`form-control form-control-sm ${errors.url ? "is-invalid" : ""}`}
                      id="url"
                      name="url"
                       onChange={handleChange}
                    />
                     {errors.url && <div className="invalid-feedback">{errors.url}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="position" className="form-label">
                      موقعیت بنر
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-sm ${errors.position ? "is-invalid" : ""}`}
                      id="position"
                      name="position"
                       onChange={handleChange}
                    />
                     {errors.position && <div className="invalid-feedback">{errors.position}</div>}
                  </div>
                </section>

                <section className="col-12">
                  <button type="submit" className="btn btn-success btn-sm"
                  disabled={mutation.isPending || !isFormValid()}>
                    <i className="fa fa-check me-1"></i> 
                    {mutation.isPending ? 'در حال ارسال' : 'افزودن'}
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