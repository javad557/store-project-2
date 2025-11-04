import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../services/user/customerUserService";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";

function MyOrders() {
  const { user, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState("all"); // حالت برای فیلتر

  const { data: orders, isLoading, error, isError, isSuccess } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => getOrders(),
    enabled: !!user?.id, // فقط وقتی user.id وجود داره اجرا بشه
  });


  // تبدیل وضعیت به متن فارسی
  const getStatusText = (status) => {
    switch (status) {
      case "Awaiting_payment":
        return "در انتظار پرداخت";
      case "paid":
        return "پرداخت شده";
      case "processed":
        return "در حال پردازش";
      case "sent":
        return "ارسال شده";
      case "delivered":
        return "تحویل شده";
      default:
        return "نامشخص";
    }
  };

  // تبدیل تاریخ به فرمت فارسی با مدیریت خطا
  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      return "تاریخ نامعتبر";
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "تاریخ نامعتبر";
      }
      const formatter = Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return formatter.format(date);
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "تاریخ نامعتبر";
    }
  };

  // انتخاب تاریخ مناسب بر اساس وضعیت
  const getRelevantDate = (order) => {
    if (order.delivery_date) return { label: "تاریخ تحویل", value: formatDate(order.delivery_date) };
    if (order.sent_date) return { label: "تاریخ ارسال", value: formatDate(order.sent_date) };
    if (order.processing_date) return { label: "تاریخ پردازش", value: formatDate(order.processing_date) };
    if (order.order_payment_date) return { label: "تاریخ پرداخت", value: formatDate(order.order_payment_date) };
    return { label: "تاریخ ثبت سفارش", value: formatDate(order.order_registration_date) };
  };

  // فیلتر کردن سفارشات
  const filteredOrders =
    filter === "all"
      ? orders?.data?.data
      : orders?.data?.data?.filter((order) => order.status === filter) || [];

  return (
    <section className="row">
      <section className="content-wrapper bg-white p-3 rounded-2 mb-2">
        {/* start content header */}
        <section className="content-header">
          <section className="d-flex justify-content-between align-items-center">
            <h2 className="content-header-title">
              <span>تاریخچه سفارشات</span>
            </h2>
            <section className="content-header-link">
              {/*<a href="#">مشاهده همه</a>*/}
            </section>
          </section>
        </section>
        {/* end content header */}

        {/* فیلترهای وضعیت */}
        <section className="d-flex justify-content-center my-4">
          <button
            className={`btn btn-sm mx-1 ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setFilter("all")}
          >
            همه
          </button>
          <button
            className={`btn btn-sm mx-1 ${filter === "Awaiting_payment" ? "btn-info" : "btn-outline-info"}`}
            onClick={() => setFilter("Awaiting_payment")}
          >
            در انتظار پرداخت
          </button>
          <button
            className={`btn btn-sm mx-1 ${filter === "paid" ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setFilter("paid")}
          >
            پرداخت شده
          </button>
          <button
            className={`btn btn-sm mx-1 ${filter === "processed" ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setFilter("processed")}
          >
            در حال پردازش
          </button>
          <button
            className={`btn btn-sm mx-1 ${filter === "sent" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setFilter("sent")}
          >
            ارسال شده
          </button>
          <button
            className={`btn btn-sm mx-1 ${filter === "delivered" ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setFilter("delivered")}
          >
            تحویل شده
          </button>
        </section>

        {/* نمایش اسپینر در حال لودینگ */}
        {(isLoading || authLoading) && (
          <div className="text-center my-4">
            <p>در حال بارگذاری...</p>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">در حال بارگذاری...</span>
            </div>
          </div>
        )}

        {/* نمایش پیام خطا */}
        {isError && (
          <div className="alert alert-danger text-center my-4">
            خطایی رخ داد: {error?.message || "دریافت سفارشات با مشکل مواجه شد"}
          </div>
        )}

        {/* نمایش سفارشات */}
        {isSuccess && (
          <>
            <section className="content-header mb-3">
              <section className="d-flex justify-content-between align-items-center">
                <h2 className="content-header-title content-header-title-small">
                  {filter === "all" ? "همه سفارشات" : getStatusText(filter)}
                </h2>
                <section className="content-header-link">
                  {/*<a href="#">مشاهده همه</a>*/}
                </section>
              </section>
            </section>

            <section className="order-wrapper">
              {filteredOrders?.length > 0 ? (
                filteredOrders.map((order) => {
                  const relevantDate = getRelevantDate(order);
                  return (
                    <section className="order-item" key={order.id}>
                      <section className="d-flex justify-content-between">
                        <section>
                          <section className="order-item-date">
                            <i className="fa fa-calendar-alt"></i> {relevantDate.label}: {relevantDate.value}
                          </section>
                          <section className="order-item-id">
                            <i className="fa fa-id-card-alt"></i> کد سفارش: {order.id}
                          </section>
                          <section className="order-item-status">
                            <i className="fa fa-clock"></i> {getStatusText(order.status)}
                          </section>
                          <section className="order-item-price">
                            <i className="fa fa-money-bill"></i> مبلغ کل: {order.amount_price.toLocaleString("fa-IR")} تومان
                          </section>
                          <section className="order-item-discount">
                            <i className="fa fa-tags"></i> تخفیف: {order.amount_discount.toLocaleString("fa-IR")} تومان
                          </section>
                          <section className="order-item-final-price">
                            <i className="fa fa-money-check-alt"></i> مبلغ نهایی: {order.finall_amount_price.toLocaleString("fa-IR")} تومان
                          </section>
                          <section className="order-item-products">
                            
                            <Link  className="btn btn-link btn-sm text-info text-decoration-none mx-1"
                             to={`/main/profile/my_order_items/${order.id}`}>
                                <span>اقلام سفارش</span>
                            </Link>

                          </section>
                        </section>
                        {order.status == 'Awaiting_payment' &&
                         <section className="order-item-link">
                          <Link href={`/order/${order.id}/payment`}>پرداخت سفارش</Link>
                        </section>
                        }
                       
                      </section>
                    </section>
                  );
                })
              ) : (
                <div className="alert alert-info text-center my-4">
                  هیچ سفارشی با این وضعیت یافت نشد
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </section>
  );
}

export default MyOrders;