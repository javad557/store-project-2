import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTickets, changeStatus } from "../../services/ticketService";
import { showError, showSuccess } from "../../../utils/notifications";
import { Link } from "react-router-dom";
import { useState } from "react";

function Tickets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading, error, isError, isSuccess } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const response = await getTickets();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
    select: (data) => {
      console.log("Raw tickets data from useQuery:", data);
      return data;
    },
  });

  console.log(tickets);
  

  const mutation = useMutation({
    mutationFn: changeStatus,
    onSuccess: (response, ticketId) => {
      showSuccess(response.data.message || "تغییر وضعیت با موفقیت انجام شد");
      queryClient.invalidateQueries(["tickets"]);
    },
    onError: (error) => {
      showError(error.response?.data?.error || "خطا در تغییر وضعیت تیکت");
    },
  });

  if (isSuccess) {
    console.log("Tickets data:", tickets);
    console.log(
      "Ticket statuses:",
      Array.isArray(tickets)
        ? [...new Set(tickets.map((ticket) => ticket.status))]
        : "Tickets is not an array"
    );
  }
  if (isError) {
    showError(error.response?.data?.error || "دریافت تیکت‌ها با خطا مواجه شد");
  }

  const closeTicket = (ticketId) => {
    console.log("to closed");
    mutation.mutate(ticketId);
  };

  const filteredTickets = Array.isArray(tickets)
    ? tickets.filter((ticket) => {
        const matchesSearch = ticket.user?.full_name
          ? ticket.user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
          : false;

        const matchesStatus = statusFilter.includes(ticket.status) || statusFilter === "all";

        return matchesSearch && matchesStatus;
      })
    : [];

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>تیکت</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <div className="max-width-16-rem">
              <input
                type="text"
                className="form-control form-control-sm form-text"
                placeholder="جستجو"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="d-flex gap-2">
              <button
                className={`btn btn-sm ${statusFilter === "open" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setStatusFilter("open")}
              >
                تیکت‌های باز
              </button>
              <button
                className={`btn btn-sm ${statusFilter === "closed" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setStatusFilter("closed")}
              >
                تیکت‌های بسته
              </button>
              <button
                className={`btn btn-sm ${statusFilter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={resetFilters}
              >
                همه تیکت‌ها
              </button>
            </div>
          </section>

          <section className="table-responsive">
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
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>نویسنده تیکت</th>
                    <th>عنوان تیکت</th>
                    <th>دسته تیکت</th>
                    <th>اولویت تیکت</th>
                    <th>دیده شده</th>
                    <th>وضعیت</th>
                    <th className="max-width-16-rem text-center">
                      <i className="fa fa-cogs"></i> تنظیمات
                    </th>
                    <th className="text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket, index) => (
                      <tr key={ticket.id}>
                        <td>{index + 1}</td>
                        <td>{ticket.user?.full_name || "نامشخص"}</td>
                        <td>{ticket.title}</td>
                        <td>{ticket.category_ticket?.name || "نامشخص"}</td>
                        <td>{ticket.priority_ticket?.name || "نامشخص"}</td>
                        <td>{ticket.has_unseen_child == true ? "unseen" : "seen"}</td>
                        <td>
                          <button
                            className={`btn btn-sm ${
                              ticket.status === "open"
                                ? "btn-success"
                                : "btn-secondary disabled"
                            }`}
                            onClick={() =>
                              ticket.status === "open" && closeTicket(ticket.id)
                            }
                            disabled={ticket.status !== "open" || mutation.isPending}
                          >
                            {ticket.status === "open" ? "باز" : "بسته"}
                          </button>
                        </td>
                        <td className="text-center">
                          <Link
                            to={`/admin/ticket/ticket/${ticket.id}`}
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "#40E0D0",
                              color: "white",
                              border: "none",
                              padding: "0.25rem 0.5rem",
                            }}
                          >
                            <i className="fa fa-eye me-1"></i> مشاهده
                          </Link>
                        </td>
                        <td className="text-center">
                          {(ticket.seen == 0 || ticket?.has_unseen_child == true) && (
                            <span
                              className="red-dot"
                              style={{
                                display: "inline-block",
                                width: "10px",
                                height: "10px",
                                backgroundColor: "red",
                                borderRadius: "50%",
                              }}
                            >
                   
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        هیچ تیکتی وجود ندارد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </section>
        </section>
      </section>
    </section>
  );
}

export default Tickets;