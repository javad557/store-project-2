import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { showError } from "../../../utils/notifications";
import { getOrder, getOrderItems } from "../../services/orderService";


function OrderItems (){

    const { id } = useParams(); 

    const { data: orderItems = [], isLoading, error, isError, isSuccess } = useQuery({
        queryKey: ['orderItems',id],
        queryFn: () => getOrderItems(id),
    })

    if(isError){
        showError(error.response?.data?.error || "دریافت سفارشات با خطا مواجه شد");  // تصحیح متن
    }
    if(isSuccess){
        console.log(orderItems.data.data.items);
    }



    return(

        <section className ="row">
  <section className ="col-12">
    <section className ="main-body-container">
      <section className ="main-body-container-header">
        <h5>جزئیات سفارش</h5>
      </section>
      <section
        className ="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2"
      >
        <Link to={`/admin/orders/detail/${id}`} className ="btn btn-info btn-sm">بازگشت</Link>
      </section>

      <section className ="table-responsive">
        {isLoading ? (
            <div className="text-center my-4">
                <p>در حال بارگذاری...</p>
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">در حال بارگذاری...</span>
                </div>
            </div>
        ): error ? (
            <div className="text-center my-4 text-danger">
                  خطایی رخ داده است. لطفاً دوباره تلاش کنید.
            </div>
        ) : (

             <table className ="table table-striped table-hover h-150px">
          <thead>
            <tr>
              <th>#</th>
              <th>نام محصول</th>
              <th>تعداد</th>
              <th>جمع قیمت محصول</th>
              <th>جمع تخفیف ها</th>
              <th>مبلغ نهایی</th>
              <th>رنگ</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.data.data.items.length > 0 ? (
                orderItems.data.data.items.map((item, index) => (
                    <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.variant.product.name}</td>
                        <td>{item.number}</td>
                        <td>{(item.variant.product.price + item.variant.price_increase)*item.number}</td>
                        <td>{item.discount || 0}</td>
                        <td>{((item.variant.product.price + item.variant.price_increase)*item.number)-item.discount}</td>
                        <td>{item.variant.color.name || 'بدون رنگ'}</td>
                    </tr>
                ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        هیچ ایتمی وجود ندارد.
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


    )
}

export default OrderItems;