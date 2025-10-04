import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPage, updatePage } from "../../services/pageService";
import { showError, showSuccess } from "../../../utils/notifications";


function Editpage(){

    const { id } = useParams();
    const queryClient = useQueryClient();
    const navigate=useNavigate();

    const [formData,setFormData]=useState({
        title:'',
        body:'',
    })

    const [errors,setErrors]=useState({
        title:null,
        body:null,
    })


     const { data, isLoading, error,isError }=useQuery({
        queryKey: ['page',id],
        queryFn:() => getPage(id),
    })

    useEffect(()=>{
        if(data){
            setFormData({
                title: data.data.data.title,
                body: data.data.data.body,
            })
        }
    },[data])


    const editMutation = useMutation({
        mutationFn:(updatedData) => updatePage(id, updatedData),
        onSuccess:(response)=>{
            showSuccess(response.data.message);
            queryClient.invalidateQueries(['pages']);
            navigate("/admin/pages");
        },
        onError:(error)=>{
           if(error.response?.status === 422){
              showError('مقادیر فرم ها معتبر نیستند');
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
              showError(error.response?.data?.error);
           }
        }
    })


    const validateField = (name,value)=>{
        switch(name){
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
    }

    const handleChange = async(e)=>{
        const {name,value}=e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        const error = validateField(name,value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
            editMutation.mutate({
            title : formData.title,
            body : formData.body,
      })
    }

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
        {isLoading ? (
                <div className="spinner-border" role="status">
              <span className="visually-hidden">در حال بارگذاری...</span>
            </div>

        ): error ? (
             <div className="alert alert-danger">خطا در بارگذاری اطلاعات</div>
        ) : (
             <form onSubmit={handleSubmit}>
        
        <section className="row">

            <section className="col-12">
                <div className="form-group">
                  <label htmlFor="title">عنوان</label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${errors.title !== null ? "is-invalid" : ""}`}
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {errors.title &&  <div className="invalid-feedback">{errors.title}</div>}

                </div>
            </section>

            <section className="col-12">
                <div className="form-group mb-3">
                    <label htmlFor="body">محتوی</label>
                    <textarea
                      className={`form-control form-control-sm ${errors.body !== null ? "is-invalid" : ""}`}
                      name="body"
                      id="body"
                      rows="5"
                      value={formData.body}
                      onChange={handleChange}
                    />
                    {errors.body &&  <div className="invalid-feedback">{errors.body}</div>}
                   
                </div>
            </section>

            <section className ="col-12">
              <button className ="btn btn-primary btn-sm"
                  >افزودن
              </button>
            </section>
          </section>
        </form>

        )}
       
      </section>
    </section>
  </section>
</section>

    )
}


export default Editpage;