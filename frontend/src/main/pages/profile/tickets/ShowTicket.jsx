import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addTicket, getRelatedTickets, markTicketsAsSeen } from "../../../services/user/customerTicketService";
import { showError, showSuccess } from "../../../../utils/notifications";
import { useRef, useState, useEffect } from "react";

function ShowTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const ticketIdsRef = useRef([]);

  // دریافت تیکت‌های مرتبط از سرور
  const { data: ticketsData, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ['relatedTickets', id],
    queryFn: () => getRelatedTickets(id),
  });

  const [formData, setFormData] = useState({
    parent_id: '',
    title: '',
    body: '',
    category_id: '',
    priority_id: '',
  });

  const addTicketMutation = useMutation({
    mutationFn: addTicket,
    onSuccess: (response) => {
      queryClient.invalidateQueries(['relatedTickets', id]);
      showSuccess(response.data.message);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'ارسال تیکت موفقیت‌آمیز نبود';
      showError(errorMessage);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        queryClient.clear();
        navigate('/auth/loginregister');
      }
    }
  });

  const markSeenMutation = useMutation({
    mutationFn: markTicketsAsSeen,
    onSuccess: () => {
      queryClient.invalidateQueries(['relatedTickets', id]);
    },
    onError: (error) => {
      console.error(error);
      showError(error.response?.data?.error || 'خطا در به‌روزرسانی وضعیت seen');
    }
  });

  useEffect(() => {
    if (isSuccess && ticketsData?.data?.data?.tickets?.length) {
      const allIds = ticketsData.data.data.tickets.map(t => t.id);
      ticketIdsRef.current = allIds;
      markSeenMutation.mutate(allIds);
    }
  }, [isSuccess, ticketsData]);

  const handleChange = (e) => {
    const { value } = e.target;
    const tickets = ticketsData?.data?.data?.tickets || [];
    const mainTicket = tickets.find(t => t.id === parseInt(id));

    setFormData({
      parent_id: parseInt(id),
      title: mainTicket?.title || '',
      body: value,
      category_id: mainTicket?.category_id || '',
      priority_id: mainTicket?.priority_id || '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTicketMutation.mutate(formData);
  };

  if (isError) {
    showError(error.response?.data?.error || "دریافت تیکت‌ها با خطا مواجه شد");
  }

  const seenStyle = {
    color: '#28a745',
    fontSize: '0.9rem',
    backgroundColor: '#e6f4ea',
    padding: '2px 8px',
    borderRadius: '12px',
  };

  const unseenStyle = {
    color: '#6c757d',
    fontSize: '0.9rem',
    backgroundColor: '#f8f9fa',
    padding: '2px 8px',
    borderRadius: '12px',
  };

  if (isLoading) {
    return (
      <div className="text-center my-4">
        <p>در حال بارگذاری...</p>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  const tickets = ticketsData?.data?.data?.tickets || [];
  const currentUserId = ticketsData?.data?.data?.current_user?.id;

  if (isSuccess && tickets.length === 0) {
    return (
      <div className="text-center my-4 text-danger">
        تیکتی برای نمایش وجود ندارد.
      </div>
    );
  }

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>نمایش تیکت‌ها</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/main/profile/my-tickets" className="btn btn-info btn-sm">بازگشت</Link>
          </section>

          {tickets.map((ticket, index) => (
  <section key={ticket.id} className="card mb-3">
    {index === 0 ? (
      // 🔴 تیکت اصلی با هدر قرمز
      <section className="card-header text-white bg-custom-pink">
        <small>
          از: {ticket.user?.full_name || 'نامشخص'} -{" "}
          {new Date(ticket.created_at).toLocaleDateString('fa-IR')}
        </small>
      </section>
    ) : (
      // ⚪ پاسخ‌ها با نمایش ساده‌ی نام نویسنده
      <section className="p-2 border-bottom bg-light">
        <small className="text-muted">
          {ticket.user?.full_name || 'نامشخص'} -{" "}
          {new Date(ticket.created_at).toLocaleDateString('fa-IR')}
        </small>
      </section>
    )}

    <section className="card-body">
      <h6 className="card-title">موضوع: {ticket.title}</h6>
      <p className="card-text">{ticket.body}</p>

      <p className="card-text">
        {ticket.user_id === currentUserId && (
          ticket.seen == 1 ? (
            <span style={seenStyle}>
              <i className="bi bi-check-circle-fill ms-1"></i>دیده شده
            </span>
          ) : (
            <span style={unseenStyle}>
              <i className="bi bi-eye-slash ms-1"></i>دیده نشده
            </span>
          )
        )}
      </p>
    </section>
  </section>
))}


          <section className="mt-4">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="ticketReply">پاسخ تیکت</label>
                <textarea
                  id="ticketReply"
                  className="form-control form-control-sm"
                  rows="4"
                  name="body"
                  onChange={handleChange}
                ></textarea>
                <button className="btn btn-primary btn-sm mt-2">ثبت</button>
              </div>
            </form>
          </section>
        </section>
      </section>
    </section>
  );
}

export default ShowTicket;
