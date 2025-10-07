import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { deletePriorityTicket, getPriorityTickets, updatePriorityTicket } from "../../../services/priorityTicketService";
import { confirmDelete, showError, showSuccess } from "../../../../utils/notifications";
import { useState } from "react";

function PriorityTickets() {
  const queryClient = useQueryClient();
  
  // State برای ذخیره مقادیر اینپوت‌ها
  const [priorityData, setPriorityData] = useState({});

  const { data: priority_tickets, error, isError, isLoading } = useQuery({
    queryKey: ['priority_tickets'],
    queryFn: async () => {
      const response = await getPriorityTickets();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePriorityTicket,
    onSuccess: (response, id) => {
      queryClient.setQueryData(["priority_tickets"], (oldData) =>
        oldData.filter((priority_ticket) => priority_ticket.id !== id)
      );
      queryClient.invalidateQueries(["priority_tickets"]);
      showSuccess(response.data.message || "اولویت با موفقیت حذف شد");
    },
    onError: (error) => {
      showError(error.response?.data?.error || "حذف اولویت با خطا مواجه شد");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }) => updatePriorityTicket(id, { name }),
    onSuccess: (response, { id, name }) => {
      queryClient.setQueryData(["priority_tickets"], (oldData) =>
        oldData.map((priority_ticket) =>
          priority_ticket.id === id ? { ...priority_ticket, name } : priority_ticket
        )
      );
      queryClient.invalidateQueries(["priority_tickets"]);
      showSuccess(response.data.message || "اولویت با موفقیت به‌روزرسانی شد");
    },
    onError: (error) => {
      showError(error.response?.data?.error || "به‌روزرسانی اولویت با خطا مواجه شد");
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

  const handleInputChange = (id, field, value) => {
    setPriorityData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  if (isError) {
    console.log(error);
  }

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>اولویت</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/ticket/priority_tickets/add" className="btn btn-info btn-sm">
              ایجاد اولویت
            </Link>
            <div className="max-width-16-rem">
              <input
                type="text"
                className="form-control form-control-sm form-text"
                placeholder="جستجو"
              />
            </div>
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
                    <th>نام اولویت</th>
                    <th className="max-width-16-rem text-center">
                      <i className="fa fa-cogs"></i> تنظیمات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {priority_tickets.length > 0 ? (
                    priority_tickets.map((priority_ticket, index) => (
                      <tr key={priority_ticket.id}>
                        <td>{index + 1}</td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={
                              priorityData[priority_ticket.id]?.name ?? priority_ticket.name
                            }
                            onChange={(e) =>
                              handleInputChange(priority_ticket.id, "name", e.target.value)
                            }
                          />
                        </td>
                        <td className="width-16-rem text-left">
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() =>
                              handleUpdate(
                                priority_ticket.id,
                                priorityData[priority_ticket.id]?.name ?? priority_ticket.name
                              )
                            }
                          >
                            <span>
                              <i className="fa fa-check me-1"></i>تأیید
                            </span>
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(priority_ticket.id, priority_ticket.name)}
                          >
                            <span>
                              <i className="fa fa-trash me-1"></i>حذف
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        هیچ اولویتی وجود ندارد.
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

export default PriorityTickets;