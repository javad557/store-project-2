import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {  getDelivery, updateDelivery } from "../../services/deliveryService";
import { showError, showSuccess } from "../../../utils/notifications";




function EditDelivery(){

  const {id} = useParams();

  const [formData,setFormData]=useState({
    name:'',
    amount:'',
    delivery_time:'',
  })

  const navigate = useNavigate();

  const[isLoading , setIsLoading]=useState(true);

  const [errors,setErrors]=useState({
    name:null,
    amount:null,
    delivery_time:null,
  })

  const validateField =(name,value)=>{
    switch (name){
      case "name":
        if (!value.trim()) return "نام روش ارسال الزامی است";
        if (value.trim().length < 3) return "نام باید حداقل 3 کاراکتر باشد";
        return null;
      case "amount":
         if (!value || Number(value) <= -1) return "هزینه باید یک عدد مثبت باشد";
         return null;
      case "delivery_time":
         if (!value.trim()) return "زمان ارسال الزامی است";
        if (value.trim().length < 3) return "زمان ارسال باید حداقل 3 کاراکتر باشد";
        return null;
      default:
        return null;
    }
  }


  const handleChange = async(e)=>{
    const {name,value}=e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error =  validateField(name,value);
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async(e)=>{
     e.preventDefault()
    try{
      const response = await updateDelivery(id,{
        name:formData.name,
        amount:formData.amount,
        delivery_time:formData.delivery_time,
      })
      showSuccess(response.data.message || 'روش ارسال با موفقیت ویرایش شد');
      navigate("/admin/deliveries");
    }
    catch (error){
      if(error.response?.status == 422){
        const validationErrors = error.response.data.errors || {};
        setErrors(
          Object.keys(validationErrors).reduce((acc, key) => {
            acc[key] = Array.isArray(validationErrors[key])
              ? validationErrors[key][0]
              : validationErrors[key];
            return acc;
          }, { name: null, amount: null, delivery_time: null })
        );
        showError('اطلاعات فرم نامعتبر هستند');
      }
      else{
        showError(error.response?.data?.error || 'خطا در ویرایش روش ارسال');
      }
    }
  }

  useEffect(()=>{
 
    const fetchDeliveries= async()=>{
      try{
         const response = await getDelivery(id);
         setFormData({
          name:response.data.name || '',
          amount: response.data.amount != null ? String(response.data.amount) : "",
          delivery_time:response.data.delivery_time || '',
         })
          console.log(response.data);
      }
      catch (error) {
        showError(error.response?.data?.error || 'دریافت اطلاعات روش ارسال با خطا مواجه شد');
      }
      finally{
        setIsLoading(false);
      }
    }
    fetchDeliveries();
  },[])


  const isFormValid = () =>
    formData.name.trim().length >= 3 &&
    Number(formData.amount) > -1 &&
    formData.delivery_time.trim().length >= 3;



  return(

    <section className="row" dir="rtl">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>ویرایش روش ارسال</h5>
          </section>

          <section className="d-flex justify-content-start align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/deliveries" className="btn btn-primary btn-sm">
              بازگشت
            </Link>
          </section>

          {isLoading ? (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">در حال بارگذاری...</span>
              </div>
          ):(
             <section>
              <form onSubmit={handleSubmit}>
                <section className="row">
                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="name">نام روش ارسال</label>
                      <input
                        type="text"
                        className={`form-control form-control-sm ${errors.name !== null ? "is-invalid" : "" }`}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                       {errors.name && <div className="invalid-feedback">{errors.name}</div> }
                    </div>
                  </section>

                  <section className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="amount">هزینه (تومان)</label>
                      <input
                        type="number"
                        className={`form-control form-control-sm ${errors.amount ? "is-invalid" : "" }`}
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                      />
                       {errors.amount && <div className="invalid-feedback">{errors.amount}</div> }
                    </div>
                  </section>

                  <section className="col-12">
                    <div className="form-group">
                      <label htmlFor="delivery_time">زمان ارسال</label>
                      <input
                        type="text"
                          className={`form-control form-control-sm ${errors.delivery_time ? "is-invalid" : "" }`}
                        name="delivery_time"
                        value={formData.delivery_time}
                        onChange={handleChange}
                      />
                       {errors.delivery_time && <div className="invalid-feedback">{errors.delivery_time}</div> }
                    </div>
                  </section>

                  <section className="col-12">
                    <div className="d-flex justify-content-start">
                      <button
                        type="submit"
                        className="btn btn-success btn-sm"
                        disabled ={isLoading || !isFormValid() }
                      >
                        {isLoading ? 'در حال ارسال' : 'ویرایش'}
                      </button>
                    </div>
                  </section>
                </section>
              </form>
            </section>

          )}
          
        </section>
      </section>
    </section>

  )
}


export default EditDelivery;







    // <section className="row" dir="rtl">
    //   <section className="col-12">
    //     <section className="main-body-container">
    //       <section className="main-body-container-header">
    //         <h5>ویرایش روش ارسال</h5>
    //       </section>

    //       <section className="d-flex justify-content-start align-items-center mt-4 mb-3 border-bottom pb-2">
    //         <Link to="/admin/deliveries" className="btn btn-primary btn-sm">
    //           بازگشت
    //         </Link>
    //       </section>

    //         <section>
    //           <form >
    //             <section className="row">
    //               <section className="col-12 col-md-6">
    //                 <div className="form-group">
    //                   <label htmlFor="name">نام روش ارسال</label>
    //                   <input
    //                     type="text"
    //                     className="form-control form-control-sm "
    //                     name="name"
    //                   />
    //                 </div>
    //               </section>

    //               <section className="col-12 col-md-6">
    //                 <div className="form-group">
    //                   <label htmlFor="amount">هزینه (تومان)</label>
    //                   <input
    //                     type="number"
    //                     className="form-control form-control-sm "
    //                     name="amount"
    //                   />
    //                 </div>
    //               </section>

    //               <section className="col-12">
    //                 <div className="form-group">
    //                   <label htmlFor="delivery_time">زمان ارسال</label>
    //                   <input
    //                     type="text"
    //                     className="form-control form-control-sm"
    //                     name="delivery_time"
    //                   />
    //                 </div>
    //               </section>

    //               <section className="col-12">
    //                 <div className="d-flex justify-content-start">
    //                   <button
    //                     type="submit"
    //                     className="btn btn-success btn-sm"
    //                   >
    //                ویرایش
    //                   </button>
    //                 </div>
    //               </section>
    //             </section>
    //           </form>
    //         </section>
          
    //     </section>
    //   </section>
    // </section>



//  <div className="spinner-border" role="status">
//               <span className="visually-hidden">در حال بارگذاری...</span>
//             </div>
