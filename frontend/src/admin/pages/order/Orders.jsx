import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getOrders, updateOrderStatus } from "../../services/orderService";
import { getDeliveries } from "../../services/deliveryService";
import { getPayments } from "../../services/paymentService";
import { Link } from "react-router-dom";
import { confirmOrderStatusChange, showError, showSuccess } from "../../../utils/notifications";  // فرض: این رو import کن (اگر نداری، اضافه کن)

function Orders() {
  // دریافت سفارشات
  const { data: orders = [], isLoading, error, isError, isSuccess } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await getOrders();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });

  // دریافت روش‌های پرداخت
  const { data: paymentMethods = [] } = useQuery({
    queryKey: ["payment_methods"],
    queryFn: async () => {
      const response = await getPayments();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });

  // دریافت روش‌های ارسال
  const { data: deliveryMethods = [] } = useQuery({
    queryKey: ["delivery_methods"],
    queryFn: async () => {
      const response = await getDeliveries();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });

  // وضعیت‌های ثابت (۵ تا – حل مشکل dropdown)
  const statusOptions = [
    "Awaiting_payment",
    "paid",
    "delivered",
    "processed",
    "sent"
  ];

  // مدیریت حالت‌های فیلتر
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // دسترسی به QueryClient برای به‌روزرسانی کش
  const queryClient = useQueryClient();

  // تعریف رنگ‌ها برای وضعیت‌ها
  const statusStyles = {
    "Awaiting_payment": "btn-warning",
    "delivered": "btn-success",
    "paid": "btn-info",
    "processed": "btn-orange",
    "sent": "btn-primary",
  };

  // Mutation برای تغییر وضعیت
  const mutation = useMutation({
    mutationFn: ({ orderId, newStatus }) => updateOrderStatus(orderId, { newStatus }),
    onSuccess: (response, { orderId, newStatus }) => {  // destructuring برای سادگی
      // به‌روزرسانی کش برای سفارشات (حل TypeError – آرایه ساده)
      queryClient.setQueryData(["orders"], (oldData) => 
        oldData.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      queryClient.invalidateQueries(["orders"]);  // refetch برای sync
      showSuccess(response.data.message);
    },
    onError: (error) => {
      showError(error.response.data.error);
    },
  });

   const handleStatusChange = async(orderId, currentStatus) => {
    // چک اختیاری: اگر orders خالی باشه، statusOptions رو فیلتر کن
    const availableStatuses = statusOptions.filter(status => status !== currentStatus);
    const result=await confirmOrderStatusChange(currentStatus,availableStatuses);
    if(result.isConfirmed){
         mutation.mutate({ orderId, newStatus: result.value });
    }
  };

  // فیلتر کردن سفارشات بر اساس تمام معیارها
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.user?.full_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPaymentMethod =
      !selectedPaymentMethod || order.payment_method?.name === selectedPaymentMethod;
    const matchesDeliveryMethod =
      !selectedDeliveryMethod || order.delivery_method?.name === selectedDeliveryMethod;
    const matchesStatus = !selectedStatus || order.status === selectedStatus;

    return matchesSearch && matchesPaymentMethod && matchesDeliveryMethod && matchesStatus;
  });

  if (isError) {
    showError(error.response?.data?.error || "دریافت سفارشات با خطا مواجه شد");  // تصحیح متن
  }

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>سفارشات</h5>
          </section>

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <div className="d-flex gap-3">
              {/* دراپ‌داون روش‌های پرداخت */}
              <select
                className="form-select form-select-sm"
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                <option value="">همه روش‌های پرداخت</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.name}>
                    {method.name}
                  </option>
                ))}
              </select>

              {/* دراپ‌داون روش‌های ارسال */}
              <select
                className="form-select form-select-sm"
                value={selectedDeliveryMethod}
                onChange={(e) => setSelectedDeliveryMethod(e.target.value)}
              >
                <option value="">همه روش‌های ارسال</option>
                {deliveryMethods.map((method) => (
                  <option key={method.id} value={method.name}>
                    {method.name}
                  </option>
                ))}
              </select>

              {/* دراپ‌داون وضعیت‌های سفارش */}
              <select
                className="form-select form-select-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">همه وضعیت‌ها</option>
                {statusOptions.map((status) => (  // حالا از statusOptions ثابت استفاده کن
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="max-width-16-rem">
              <input
                type="text"
                className="form-control form-control-sm form-text"
                placeholder="جستجو"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              <table className="table table-striped table-hover h-150px">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>نام کاربر</th>
                    <th>مبلغ سفارش</th>
                    <th>میزان تخفیف</th>
                    <th>مبلغ نهایی</th>
                    <th>شیوه پرداخت</th>
                    <th>شیوه ارسال</th>
                    <th>وضعیت سفارش</th>
                    <th>فاکتور</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <tr key={order.id}>
                        <td>{index + 1}</td>
                        <td>{`${order.user?.full_name || ""}`}</td>
                        <td>{order.amount_price}</td>
                        <td>{order.amount_discount}</td>
                        <td>{order.finall_amount_price}</td>
                        <td>{order.payment_method?.name || "نامشخص"}</td>
                        <td>{order.delivery_method?.name || "نامشخص"}</td>
                        <td>
                          <button
                            className={`btn btn-sm ${statusStyles[order.status] || "btn-secondary"}`}
                            onClick={() => handleStatusChange(order.id, order.status)}
                          >
                            {order.status}
                          </button>
                        </td>
                        <td>
                          <Link
                            to={`/admin/orders/detail/${order.id}`}
                            className="dropdown-item text-right"
                          >
                            <i className="fa fa-images"></i> فاکتور
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        هیچ سفارشی وجود ندارد.
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

export default Orders;