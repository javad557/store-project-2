import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addTicket, getAllTickets, markTicketsAsSeen } from "../../services/ticketService"; // اضافه کردن markTicketsAsSeen
import { showError, showSuccess } from "../../../utils/notifications";
import { useRef, useState, useEffect } from "react"; // اضافه کردن useEffect

function Ticket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const ticketIdsRef = useRef([]); // برای ذخیره IDهای تیکت‌های نمایش‌داده‌شده

  // دریافت همه تیکت‌ها
  const { data: allTicketsData, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ['allTicketsData'],
    queryFn: () => getAllTickets(),
  });

  const mainTicket = isSuccess ? allTicketsData?.data?.data?.find(t => t.id === parseInt(id)) : null;
  const lastTicketIdRef = useRef(id);

  const [formData, setFormData] = useState({
    parent_id: '',
    title: '',
    body: '',
    category_id: '',
    priority_id: '',
  });

  // Mutation برای افزودن تیکت
  const addTicketMutation = useMutation({
    mutationFn: addTicket,
    onSuccess: (response) => {
      queryClient.invalidateQueries(['allTicketsData']);
      showSuccess(response.data.message);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'ارسال تیکت موفقیت آمیز نبود';
      showError(errorMessage);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        queryClient.clear();
        navigate('/auth/loginregister');
      }
    }
  });

  // Mutation جدید برای به‌روزرسانی seen
  const markSeenMutation = useMutation({
    mutationFn: markTicketsAsSeen, // فرضاً تابع جدید در ticketService
    onSuccess: () => {
      queryClient.invalidateQueries(['allTicketsData']); // به‌روزرسانی کش
    },
    onError: (error) => {
      console.log(error);
      
      showError(error.response?.data?.error || 'خطا در به‌روزرسانی وضعیت seen');
    }
  });

  // جمع‌آوری IDهای تیکت‌های نمایش‌داده‌شده و ارسال درخواست
 useEffect(() => {
  if (isSuccess && mainTicket) {
    const ticketIds = ticketIdsRef.current; // فقط IDها رو بگیر
    console.log(ticketIds);
    
    if (ticketIds.length > 0) {
      markSeenMutation.mutate(ticketIds); // ارسال مستقیم IDها به سرور
    }
  }
}, [isSuccess, mainTicket]); // وابستگی به isSuccess و mainTicket

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      body: value,
      parent_id: parseInt(lastTicketIdRef.current),
      title: mainTicket?.title || '',
      category_id: mainTicket?.category_id || '',
      priority_id: mainTicket?.priority_id || '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTicketMutation.mutate({
      parent_id: formData.parent_id,
      title: formData.title,
      body: formData.body,
      category_id: formData.category_id,
      priority_id: formData.priority_id,
    });
  };

  if (isError) {
    showError(error.response?.data?.error || "دریافت تیکت‌ها با خطا مواجه شد");
  }

  const answers = (parentId) => {
    const allTickets = allTicketsData?.data?.data || [];
    return allTickets.map((ticket) => {
      if (ticket.parent_id == parentId) {
        lastTicketIdRef.current = ticket.id;
        // اضافه کردن ID تیکت به ticketIdsRef
        if (!ticketIdsRef.current.includes(ticket.id)) {
          ticketIdsRef.current.push(ticket.id);
        }
        return (
          <section key={ticket.id} className="card-body">
            <p>{ticket.user.full_name}</p>
            <p className="card-text">{ticket.body}</p>
            <hr />
            {answers(ticket.id)}
          </section>
        );
      }
      return null;
    }).filter(Boolean);
  };

  if (isSuccess && !mainTicket) {
    return (
      <div className="text-center my-4 text-danger">
        تیکت مورد نظر یافت نشد.
      </div>
    );
  }

  // اضافه کردن ID تیکت اصلی به ticketIdsRef
  if (isSuccess && mainTicket && !ticketIdsRef.current.includes(mainTicket.id)) {
    ticketIdsRef.current.push(mainTicket.id);
  }

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
        ) : error ? (
          <div className="text-center my-4 text-danger">
            خطایی رخ داده است. لطفاً دوباره تلاش کنید.
          </div>
        ) : isSuccess ? (
          <section className="main-body-container">
            <section className="main-body-container-header">
              <h5>نمایش تیکت ها</h5>
            </section>

            <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
              <Link to="/admin/ticket/tickets" className="btn btn-info btn-sm">بازگشت</Link>
            </section>

            <section className="card mb-3">
              <section className="card-header text-white bg-custom-pink">
                <small>از: {mainTicket?.user?.full_name || 'نامشخص'} - {new Date(mainTicket?.created_at).toLocaleDateString('fa-IR')}</small>
              </section>
              <section className="card-body">
                <h5 className="card-title">موضوع: {mainTicket?.title}</h5>
                <p className="card-text">{mainTicket?.body}</p>
              </section>
            </section>

            {answers(parseInt(id))}

            <section className="mt-4">
              <form onSubmit={handleSubmit}>
                <section className="row">
                  <section className="col-12">
                    <div className="form-group">
                      <label htmlFor="">پاسخ تیکت</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="4"
                        name="body"
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
        ) : null}
      </section>
    </section>
  );
}

export default Ticket;