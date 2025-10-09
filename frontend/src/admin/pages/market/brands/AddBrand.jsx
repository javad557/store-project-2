// src/admin/pages/brands/EditBrand.jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addBrand } from "../../../services/market/brandService";
import { showError, showSuccess } from "../../../../utils/notifications";



function AddBrand() {

  const queryClient = useQueryClient();
  const [formData,setFormData]= useState({
    name : '',
  });
  const navigate = useNavigate();

  const handleChange = async(e)=>{
    const {name,value}=e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const mutation = useMutation({
    mutationFn: addBrand,
    onSuccess:(response)=>{
      queryClient.invalidateQueries('brands');
      showSuccess(response.data.message);
      navigate('/admin/market/brands');
    },
    onError: (error)=>{
        console.log(error);
      if(error.status === 422){
        showError('لطفا مقدار معتبر وارد کنید');
      }
      else{
        showError(error.response.data.error);
      }
    }
  })

  const handlesubmit = async(e)=>{
    e.preventDefault();
    mutation.mutate({
      name : formData.name,
    });
  }


  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>ویرایش برند</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/market/brands" className="btn btn-primary btn-sm">
              <i className="fa fa-arrow-right"></i> بازگشت
            </Link>

          </section>

          <form id="brand-form" onSubmit={handlesubmit}>
            <section className="row">
              <section className="col-12 col-md-6">
                <div className="mb-3">
                  <label htmlFor="brand-name" className="form-label">
                    نام برند
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="brand-name"
                    name="name"
                    onChange={handleChange}
                  />
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