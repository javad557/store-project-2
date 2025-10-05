import { useQuery } from "@tanstack/react-query";
import { getTickets } from "../../services/ticketController";
import { showError } from "../../../utils/notifications";
import { Link } from "react-router-dom";

function Ticket() {
  const { data: tickets = [], isLoading, error, isError, isSuccess } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const response = await getTickets();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });

  if (isSuccess) {
    console.log(tickets);
  }
  if (isError) {
    showError(error.response?.data?.error || "دریافت تیکت ها با خطا مواجه شد");  // تصحیح متن
  }

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
              />
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
                  </tr>
                </thead>
                <tbody>
                  {tickets.length > 0 ? (
                    tickets.map((ticket, index) => (
                      <tr key={ticket.id}>
                        <td>{index + 1}</td>
                        <td>{ticket.user.full_name}</td>
                        <td>{ticket.title}</td>
                        <td>{ticket.category_ticket.name}</td>
                        <td>{ticket.priority_ticket.name}</td>
                        <td>{ticket.seen == 0 ? "unseen" : "seen"}</td>
                        <td>{ticket.status}</td>
                        <td className="text-center">
                          <Link to={`/admin/ticket/ticket/${ticket.id}`}
                           className="btn btn-sm"
                            style={{
                              backgroundColor: '#40E0D0',
                              color: 'white',
                              border: 'none',
                              padding: '0.25rem 0.5rem',
                            }}>
                          <i className="fa fa-eye me-1"></i> مشاهده
                          </Link>
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

export default Ticket;