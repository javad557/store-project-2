import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addCategoryTicket } from "../../../services/categoryTicketService";
import { showError, showSuccess } from "../../../../utils/notifications";

function AddCategoryTicket (){


  const [formData,setFormData]=useState({
    'name':'',
  });

   const QueryClient= useQueryClient()
   const navigate = useNavigate()


  const addCategory = useMutation({
    mutationFn: addCategoryTicket,
    onSuccess:(response)=>{
      QueryClient.invalidateQueries('category_tickets');
      navigate('/admin/ticket/category_tickets');
      showSuccess(response.data.message);
    },
     onError:(error)=>{
      showError(error.response?.data?.error ,'خطا در افزودن صغحه اطلاع رسانی');
     }
  })

  const handleChange = (e)=>{
    const {value}=e.target;
    setFormData((prev) => ({ ...prev, name: value }));
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    addCategory.mutate({
       name:formData.name
    })
  }

    return(
        <section class="row">
  <section class="col-12">
    <section class="main-body-container">
      <section class="main-body-container-header">
        <h5>ایجاد دسته بندی</h5>
      </section>

      <section
        class="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2"
      >
          <Link to="/admin/ticket/category_tickets" class="btn btn-info btn-sm">بازگشت</Link>
      </section>

      <section>
        <form onSubmit={handleSubmit}>
          <section class="row">
            <section class="col-12 col-md-6 my-2">
              <div class="form-group">
                <label for="name">نام دسته</label>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  name="name"
                  id=""
                  onChange={handleChange}
                />
              </div>
            </section>

            <section class="col-12 my-3">
              <button class="btn btn-primary btn-sm">ثبت</button>
            </section>
          </section>
        </form>
      </section>
    </section>
  </section>
</section>

    )
}


export default AddCategoryTicket;