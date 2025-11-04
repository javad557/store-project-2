import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getMyOrderItems } from "../../services/user/customerUserService";

function MyOrderItems() {
  const { id } = useParams();

  const { data: order_items = [], isLoading, error, isError, isSuccess } = useQuery({
    queryKey: ["order_items", id],
    queryFn: async () => {
      const response = await getMyOrderItems(id);
      return response.data.data; // داده‌ها رو درست استخراج می‌کنه
    },
  });

  if (isSuccess) {
    console.log(order_items); // لاگ درست
  }

  return (
    <section className="row">
      <section className="content-wrapper bg-white p-3 rounded-2 mb-2">
        <section className="content-header">
          <section className="d-flex justify-content-between align-items-center">
            <h2 className="content-header-title">
              <span>اقلام سفارش</span>
            </h2>
            <section className="content-header-link">
              <Link to="/main/profile/my-orders">بازگشت به سفارشات</Link>
            </section>
          </section>
        </section>

        {isLoading && (
          <div className="text-center my-4">
            <p>در حال بارگذاری...</p>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">در حال بارگذاری...</span>
            </div>
          </div>
        )}

        {isError && (
          <div className="alert alert-danger text-center my-4">
            خطایی رخ داده است: {error.message || "لطفاً دوباره تلاش کنید."}
          </div>
        )}

        {!isLoading && !isError && order_items.length === 0 && (
          <div className="alert alert-info text-center my-4">
            هیچ آیتمی برای این سفارش یافت نشد.
          </div>
        )}

        {!isLoading && !isError && order_items.length > 0 && (
          <section className="order-items-wrapper">
            {order_items.map((order_item) => (
              <section className="order-item" key={order_item.id}>
                <section className="d-flex justify-content-between align-items-center">
                  <section className="item-details">
                    <h5 className="item-title">نام محصول: {order_item.variant.product.name}</h5>
                    <p className="item-quantity">رنگ: {order_item.variant.color.name}</p>
                    <p className="item-quantity">تعداد: {order_item.number}</p>
                    <p className="item-quantity">
                      تخفیف: {order_item.discount.toLocaleString("fa-IR")} تومان
                    </p>
                    <p className="item-price">
                      قیمت واحد: {order_item.variant.product.price.toLocaleString("fa-IR")} تومان
                    </p>
                    <p className="item-total">
                      قیمت کل پس از تخفیف: {((order_item.variant.product.price - order_item.discount) * order_item.number).toLocaleString("fa-IR")} تومان
                    </p>
                  </section>
                  <section className="item-image">
                    <img
                      src={order_item.variant.product.image || "https://via.placeholder.com/100"}
                      alt="تصویر محصول"
                      width={150}
                      height={100}
                    />
                  </section>
                </section>
              </section>
            ))}
          </section>
        )}
      </section>
    </section>
  );
}

export default MyOrderItems;