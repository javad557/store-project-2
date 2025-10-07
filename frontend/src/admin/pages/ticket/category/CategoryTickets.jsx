import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { deleteCategoryTicket, getCategoryTickets, updateCategoryTicket } from "../../../services/categoryTicketService";
import { confirmDelete, showError, showSuccess } from "../../../../utils/notifications";
import { useState } from "react";

function CategoryTicket() {
  const queryClient = useQueryClient();
  
  // State برای ذخیره مقادیر اینپوت‌ها
  const [categoryNames, setCategoryNames] = useState({});

  const { data: category_tickets, error, isSuccess, isError, isLoading } = useQuery({
    queryKey: ['category_tickets'],
    queryFn: async () => {
      const response = await getCategoryTickets();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoryTicket,
    onSuccess: (response, id) => {
      queryClient.setQueryData(["category_tickets"], (oldData) =>
        oldData.filter((category_ticket) => category_ticket.id !== id)
      );
      queryClient.invalidateQueries(["category_tickets"]);
      showSuccess(response.data.message);
    },
    onError: (error) => {
      showError(error.response?.data?.error || "حذف دسته بندی تیکت با خطا مواجه شد");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }) => updateCategoryTicket(id, { name }),
    onSuccess: (response, { id, name }) => {
      queryClient.setQueryData(["category_tickets"], (oldData) =>
        oldData.map((category_ticket) =>
          category_ticket.id === id ? { ...category_ticket, name } : category_ticket
        )
      );
      queryClient.invalidateQueries(["category_tickets"]);
      showSuccess(response.data.message || "نام دسته‌بندی با موفقیت به‌روزرسانی شد");
    },
    onError: (error) => {
      showError(error.response?.data?.error || "به‌روزرسانی نام دسته‌بندی با خطا مواجه شد");
    },
  });

  const handleDelete = async (id, name) => {
    const isConfirmed = await confirmDelete(name);
    if (isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const handleUpdate = (id, name) => {
    updateMutation.mutate({ id, name });
  };

  const handleNameChange = (id, value) => {
    setCategoryNames((prev) => ({ ...prev, [id]: value }));
  };

  if (isError) {
    console.log(error);
  }

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>دسته‌بندی</h5>
          </section>

          <section
            className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2"
          >
            <Link to="/admin/ticket/category_tickets/add" className="btn btn-info btn-sm">
              ایجاد دسته‌بندی
            </Link>
          </section>

          {isLoading ? (
            <div className="text-center my-4">
              <p>در حال بارگذاری...</p>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">در حال بارگذاری...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center my-4 text-danger">
              خطایی رخ داده است. لطفاً دوباره تلاش کنید.
            </div>
          ) : (
            <section className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>نام دسته‌بندی</th>
                    <th>
                      <i className="fa fa-cogs"></i> تنظیمات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {category_tickets.length > 0 ? (
                    category_tickets.map((category_ticket, index) => (
                      <tr key={category_ticket.id}>
                        <td>{index + 1}</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={categoryNames[category_ticket.id] ?? category_ticket.name}
                            onChange={(e) => handleNameChange(category_ticket.id, e.target.value)}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(category_ticket.id, category_ticket.name)}
                          >
                            <span>
                              <i className="fa fa-trash me-1"></i>حذف
                            </span>
                          </button>
                          
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() =>
                              handleUpdate(category_ticket.id, categoryNames[category_ticket.id] ?? category_ticket.name)
                            }
                          >
                            <span>
                              <i className="fa fa-check me-1"></i>تأیید
                            </span>
                          </button>
                          
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        هیچ دسته‌بندی تیکتی وجود ندارد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          )}
        </section>
      </section>
    </section>
  );
}

export default CategoryTicket;