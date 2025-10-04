import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addPage } from "../../services/pageService";
import { showError, showSuccess } from "../../../utils/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function AddPage(){

    const [formData,setFormData]=useState({
        title: "",
        body: "",
    })

     const [errors, setErrors] = useState({
         title: null,
         body: null,
     });

    const navigate =useNavigate();
    const queryClient = useQueryClient();

    const validateField = (name, value) => {
        switch (name) {
          case "title":
            if (!value.trim()) return "  عنوان الزامی است";
            if (value.trim().length < 3) return "عنوان باید حداقل 3 کاراکتر باشد";
            return null;
          case "body":
            if (!value.trim()) return "  محتوی الزامی است";
            if (value.trim().length < 3) return "محتوی باید حداقل 3 کاراکتر باشد";
            return null;
          default:
            return null;
        }
    };


    const mutation = useMutation({
        mutationFn: addPage,
        onSuccess:(response)=>{
            queryClient.invalidateQueries(['pages']);
            navigate("/admin/pages")
            showSuccess(response.message || 'صفحه اطلاع رسانی شما با موفقیت افزوده شد' );
        },
         onError: (error)=>{
            console.log(error);
            if(error.status === 422){
                
                 showError('فیلدها نا معتبر هستند' );
                 const validationErrors = error.response.data.errors || {};
                   setErrors(
                      Object.keys(validationErrors).reduce((acc, key) => {
                        acc[key] = Array.isArray(validationErrors[key])
                          ? validationErrors[key][0]
                          : validationErrors[key];
                          return acc;
                        }, { title: null, body: null})
                    );
            }
            else{
                showError(error.response?.data?.error ,'خطا در افزودن صغحه اطلاع رسانی' );
            }
         }
    })

    const handleChange = (e)=>{
        const {name,value}=e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        const error = validateField(name,value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    }

    const handleSubmit =async(e)=>{
         e.preventDefault();

         mutation.mutate({
            title : formData.title,
            body : formData.body,
         })
    }

    const isFormValid = () =>
          formData.title.trim().length >= 3 &&
          formData.body.trim().length >= 3

return(
        <section className ="row">
  <section className ="col-12">
    <section className ="main-body-container">
      <section className ="main-body-container-header">
        <h5>ایجاد پیج</h5>
      </section>

      <section
        className ="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2"
      >
        <Link to="/admin/pages" className ="btn btn-info btn-sm">بازگشت</Link>
      </section>

      <section>
        <form onSubmit={handleSubmit}>
        
        <section className="row">

            <section className="col-12">
                <div className="form-group">
                  <label htmlFor="title">عنوان</label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${errors.title ? 'is-invalid' : ''} `}
                    name="title"
                    id="title"
                    onChange={handleChange}
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>
            </section>

            <section className="col-12">
                <div className="form-group mb-3">
                    <label htmlFor="body">محتوی</label>
                    <textarea
                      className={`form-control form-control-sm ${errors.body ? 'is-invalid' : ''} `}
                      name="body"
                      id="body"
                      rows="5"
                      onChange={handleChange}
                    />
                    {errors.body && <div className="invalid-feedback">{errors.body}</div>}
                </div>
            </section>

            <section className ="col-12">
              <button className ="btn btn-primary btn-sm"
               disabled={mutation.isPending || !isFormValid()}
                  >
                    {mutation.isPending ? "...در حال ارسال" : "افزودن"}
              </button>
            </section>
          </section>
        </form>
      </section>
    </section>
  </section>
</section>

    )
}

export default AddPage;