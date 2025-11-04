import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addTicket, getRelatedTickets, markTicketsAsSeen } from "../../services/ticketService";
import { showError, showSuccess } from "../../../utils/notifications";
import { useRef, useState, useEffect } from "react";

function Ticket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const ticketIdsRef = useRef([]);
  const lastTicketIdRef = useRef(id);

  // دریافت تیکت‌های مرتبط
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["relatedTickets", id],
    queryFn: () => getRelatedTickets(id),
  });

  const tickets = isSuccess ? data?.data?.data?.tickets || [] : [];
  const currentUserId = data?.data?.data?.current_user?.id;
  const mainTicket = tickets.length > 0 ? tickets[0] : null;

  const [formData, setFormData] = useState({
    body: "",
  });

  // Mutation برای افزودن تیکت جدید
  const addTicketMutation = useMutation({
    mutationFn: addTicket,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["relatedTickets", id]);
      showSuccess(response.data.message);
      setFormData({ body: "" });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || "ارسال تیکت موفقیت‌آمیز نبود";
      showError(errorMessage);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        queryClient.clear();
        navigate("/auth/loginregister");
      }
    },
  });

  // Mutation برای seen
  const markSeenMutation = useMutation({
    mutationFn: markTicketsAsSeen,
    onSuccess:()=>{
       queryClient.invalidateQueries(["newTickets"]);
    },
    onError: (error) => {
      showError(error.response?.data?.error || "خطا در به‌روزرسانی وضعیت دیده‌شده");
    },
  });

  // بروزرسانی seen تیکت‌ها
  useEffect(() => {
    if (isSuccess && tickets.length > 0) {
      const ids = tickets.map((t) => t.id);
      ticketIdsRef.current = ids;
      markSeenMutation.mutate(ids);
    }
  }, [isSuccess, tickets]);

  const handleChange = (e) => {
    setFormData({ body: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const lastTicket = tickets[tickets.length - 1];
    addTicketMutation.mutate({
      parent_id: lastTicket.id,
      title: mainTicket.title,
      body: formData.body,
      category_id: mainTicket.category_id,
      priority_id: mainTicket.priority_id,
    });
  };

  if (isError) {
    showError(error.response?.data?.error || "خطا در دریافت اطلاعات تیکت");
  }

  // استایل وضعیت دیده‌شده
  const seenStatusStyle = {
    color: "#28a745",
    fontSize: "0.9rem",
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#e6f4ea",
    padding: "2px 8px",
    borderRadius: "12px",
  };

  const unseenStatusStyle = {
    color: "#6c757d",
    fontSize: "0.9rem",
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: "2px 8px",
    borderRadius: "12px",
  };

  const iconStyle = {
    fontSize: "1rem",
    marginLeft: "4px",
  };

  return (
    <section className="row">
      <section className="col-12">
        {isLoading ? (
          <div className="text-center my-4">
            <p>در حال بارگذاری...</p>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">در حال بارگذاری...</span>
            </div>
          </div>
        ) : (
          isSuccess && (
            <section className="main-body-container">
              <section className="main-body-container-header">
                <h5>نمایش تیکت‌ها</h5>
              </section>

              <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
                <Link to="/admin/ticket/tickets" className="btn btn-info btn-sm">
                  بازگشت
                </Link>
              </section>

              {/* ✅ نمایش تمام تیکت‌ها به‌ترتیب */}
              {tickets.map((ticket, index) => (
                <section key={ticket.id} className="card mb-3">
                  {/* فقط برای تیکت اصلی کادر قرمز */}
                  <section
                    className={`card-header ${
                      index === 0 ? "text-white bg-custom-pink" : "bg-light"
                    }`}
                  >
                    <small>
                      از: {ticket.user?.full_name || "نامشخص"} -{" "}
                      {new Date(ticket.created_at).toLocaleDateString("fa-IR")}
                    </small>
                  </section>

                  <section className="card-body">
                    {index === 0 && <h5 className="card-title">موضوع: {ticket.title}</h5>}
                    <p className="card-text">{ticket.body}</p>

                    {ticket.user_id == currentUserId && (
                      <p className="card-text">
                        {ticket.seen == 1 ? (
                          <span style={seenStatusStyle}>
                            <i className="bi bi-check-circle-fill" style={iconStyle}></i>دیده شده
                          </span>
                        ) : (
                          <span style={unseenStatusStyle}>
                            <i className="bi bi-eye-slash" style={iconStyle}></i>دیده نشده
                          </span>
                        )}
                      </p>
                    )}
                  </section>
                </section>
              ))}

              {/* فرم پاسخ */}
              <section className="mt-4">
                <form onSubmit={handleSubmit}>
                  <section className="row">
                    <section className="col-12">
                      <div className="form-group">
                        <label htmlFor="body">پاسخ تیکت</label>
                        <textarea
                          className="form-control form-control-sm"
                          rows="4"
                          name="body"
                          value={formData.body}
                          onChange={handleChange}
                        ></textarea>
                        <section className="col-12 mt-2">
                          <button className="btn btn-primary btn-sm">ثبت</button>
                        </section>
                      </div>
                    </section>
                  </section>
                </form>
              </section>
            </section>
          )
        )}
      </section>
    </section>
  );
}

export default Ticket;
