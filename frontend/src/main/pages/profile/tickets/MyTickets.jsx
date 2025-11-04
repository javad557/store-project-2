
import { Link } from "react-router-dom";
import { changeMyTicketStatus, getMyTickets , } from "../../../services/user/customerTicketService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "../../../../utils/notifications";
import { useState } from "react";

function MyTickets(){

  const queryClient = useQueryClient();

  const {data : my_tickets = [] ,error, isLoading , isSuccess , isError}=useQuery({
    queryKey: ['my_tickets'],
    queryFn: async()=>{
      const response = await getMyTickets();
      return response.data.data;
    }
  })

   const mutation = useMutation({
    mutationFn: changeMyTicketStatus,
    onSuccess: (response, ticketId) => {
      showSuccess(response.data.message || "تغییر وضعیت با موفقیت انجام شد");
      queryClient.invalidateQueries(["tickets"]);
    },
    onError: (error) => {
      showError(error.response?.data?.error || "خطا در تغییر وضعیت تیکت");
    },
  });


  const closeTicket = (ticketId) => {
    console.log("to closed");
    mutation.mutate(ticketId);
  };


    return(

    <section className="row">
     <section className="content-header">
            <section className="d-flex justify-content-between align-items-center">
              
              <section className="content-header-link m-2">
                <Link to={`/main/profile/my-tickets/add`} className="btn btn-success text-white">ایجاد تیکت جدید</Link>
              </section>
            </section>
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
                  {my_tickets.length > 0 ? (
                    my_tickets.map((my_ticket, index) => (
                      <tr key={my_ticket.id}>
                        <td>{index + 1}</td>
                        <td>{my_ticket.user?.full_name || "نامشخص"}</td>
                        <td>{my_ticket.title}</td>
                        <td>{my_ticket.category_ticket?.name || "نامشخص"}</td>
                        <td>{my_ticket.priority_ticket?.name || "نامشخص"}</td>
                        <td>{my_ticket.has_unseen_child == true ? "unseen" : "seen"}</td>
                        <td>
                          <button
                            className={`btn btn-sm ${
                              my_ticket.status === "open"
                                ? "btn-success"
                                : "btn-secondary disabled"
                            }`}
                            onClick={() =>
                              my_ticket.status === "open" && closeTicket(my_ticket.id)
                            }
                            disabled={my_ticket.status !== "open" || mutation.isPending}
                          >
                            {my_ticket.status === "open" ? "باز" : "بسته"}
                          </button>
                        </td>
                        <td className="text-center">
                          <Link
                            to={`/main/profile/my-tickets/show/${my_ticket.id}`}
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
                          {(my_ticket?.has_unseen_child == true) && (
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

    )
}

export default MyTickets;