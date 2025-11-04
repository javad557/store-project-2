import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { addTicket, getCategoryTickets, getPriorityTickets } from "../../../services/user/customerTicketService";
import { showError, showSuccess } from "../../../../utils/notifications";
import { useState } from "react";

function AddTicket() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    priority_id: "",
    body: "",
  });

  const [errors, setErrors] = useState({});

  // دریافت دسته‌بندی و اولویت‌ها
  const { data: categoryTickets = [], isError: isCategoryError, error: categoryError } = useQuery({
    queryKey: ["categoryTickets"],
    queryFn: async () => (await getCategoryTickets()).data.data,
  });

  const { data: priorityTickets = [], isError: isPriorityError, error: priorityError } = useQuery({
    queryKey: ["priorityTickets"],
    queryFn: async () => (await getPriorityTickets()).data.data,
  });

  const validateField = (name, value) => {
    if (!value?.trim()) {
      switch (name) {
        case "title":
          return "عنوان تیکت الزامی است";
        case "category_id":
          return "دسته‌بندی تیکت الزامی است";
        case "priority_id":
          return "اولویت تیکت الزامی است";
        case "body":
          return "محتوای تیکت الزامی است";
      }
    }
    return null;
  };

  const createTicketMutation = useMutation({
    mutationFn: addTicket,
    onSuccess: (response) => {
      showSuccess(response.data.message);
      queryClient.invalidateQueries(["my_tickets"]);
      navigate("/main/profile/my-tickets");
    },
    onError: (error) => {
      if (error.response?.status === 422) {
        showError("مقادیر فرم معتبر نیستند");
        const validationErrors = error.response.data.errors || {};
        setErrors({
          title: validationErrors.title?.[0] || null,
          category_id: validationErrors.category_id?.[0] || null,
          priority_id: validationErrors.priority_id?.[0] || null,
          body: validationErrors.body?.[0] || null,
        });
      } else {
        showError(error.response?.data?.error || "خطایی رخ داد");
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      newErrors[key] = validateField(key, formData[key]);
    });
    setErrors(newErrors);

    if (Object.values(newErrors).every((err) => err === null)) {
      createTicketMutation.mutate(formData);
    }
  };

  if (isCategoryError) showError(categoryError?.response?.data?.error || "خطا در دریافت دسته‌بندی‌ها");
  if (isPriorityError) showError(priorityError?.response?.data?.error || "خطا در دریافت اولویت‌ها");

  return (

        <section className="content-wrapper bg-white p-3 rounded-2 mb-2">
          <section className="d-flex justify-content-between align-items-center">
            <h5>افزودن تیکت</h5>
            <Link to="/main/profile/my-tickets" className="btn btn-danger text-white">بازگشت</Link>
          </section>
          <hr />
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label>عنوان</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`form-control form-control-sm ${errors.title ? "is-invalid" : ""}`}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              <div className="col-md-4 mb-3">
                <label>دسته‌بندی</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className={`form-select form-select-sm ${errors.category_id ? "is-invalid" : ""}`}
                >
                  <option value="">انتخاب کنید</option>
                  {categoryTickets.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category_id && <div className="invalid-feedback">{errors.category_id}</div>}
              </div>

              <div className="col-md-4 mb-3">
                <label>اولویت</label>
                <select
                  name="priority_id"
                  value={formData.priority_id}
                  onChange={handleChange}
                  className={`form-select form-select-sm ${errors.priority_id ? "is-invalid" : ""}`}
                >
                  <option value="">انتخاب کنید</option>
                  {priorityTickets.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {errors.priority_id && <div className="invalid-feedback">{errors.priority_id}</div>}
              </div>

              <div className="col-12 mb-3">
                <label>متن</label>
                <textarea
                  name="body"
                  rows="4"
                  value={formData.body}
                  onChange={handleChange}
                  className={`form-control form-control-sm ${errors.body ? "is-invalid" : ""}`}
                ></textarea>
                {errors.body && <div className="invalid-feedback">{errors.body}</div>}
              </div>

              <div className="col-12">
                <button className="btn btn-primary btn-sm" disabled={createTicketMutation.isPending}>
                  {createTicketMutation.isPending ? "در حال ارسال..." : "ثبت"}
                </button>
              </div>
            </div>
          </form>
        </section>
  );
}

export default AddTicket;
