import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addPriorityTicket } from "../../../services/priorityTicketService";
import { showError, showSuccess } from "../../../../utils/notifications";

function AddPriorityTicket() {
  const [formData, setFormData] = useState({
    name: "",
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const addPriorityMutation = useMutation({
    mutationFn: addPriorityTicket,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["priority_tickets"]);
      navigate("/admin/ticket/priority_tickets");
      showSuccess(response.data?.message || "اولویت با موفقیت اضافه شد");
    },
    onError: (error) => {
      if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.errors;
        const errorMessage = Object.values(validationErrors).flat().join(", ");
        showError(errorMessage || "خطای اعتبارسنجی رخ داده است");
      } else {
       console.log(error);
       
        showError(error.response?.data?.error || "خطا در افزودن اولویت");
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPriorityMutation.mutate({
      name: formData.name,
    });
  };

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>ایجاد اولویت</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/ticket/priority_tickets" className="btn btn-info btn-sm">
              بازگشت
            </Link>
          </section>

          <section>
            <form onSubmit={handleSubmit}>
              <section className="row">
                <section className="col-12 col-md-6 my-2">
                  <div className="form-group">
                    <label htmlFor="name">نام اولویت</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </section>

                <section className="col-12 my-3">
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

export default AddPriorityTicket;