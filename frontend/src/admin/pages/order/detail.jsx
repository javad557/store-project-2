import { useQuery } from "@tanstack/react-query";
import { showError } from "../../../utils/notifications";
import { getOrder, getOrders } from "../../services/orderService";
import { Link, useParams } from "react-router-dom";


function DetailOrder(){
    const { id } = useParams(); 

    const { data: order = [], isLoading, error, isError, isSuccess } = useQuery({
         queryKey: ['order',id],
        queryFn: () => getOrder(id),
    })

    if(isError){
        showError(error.response?.data?.error || "دریافت سفارشات با خطا مواجه شد");  // تصحیح متن
    }
    if(isSuccess){
        console.log(order.data.data.user.full_name);
    }

    return(
  <section className ="row">
  <section className ="col-12">
    <section className ="main-body-container">
      <section className ="main-body-container-header">
        <h5>فاکتور</h5>
      </section>
      <section
        className ="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2"
      >
        <Link to="/admin/orders" className ="btn btn-info btn-sm">بازگشت</Link>
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
            ):(

                 <table className ="table table-striped table-hover h-150px" id="printable">
          <thead>
            <tr>
              <th>#</th>
              <th className ="max-width-16-rem text-center">
                <i className ="fa fa-cogs"></i> تنظیمات
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className ="table-primary">
              <th>سفارش</th>
              <td className ="width-8-rem text-left">
                <a href="" className ="btn btn-dark btn-sm text-white" id="print">
                  <i className ="fa fa-print"></i>
                  چاپ
                </a>
                <Link to={`/admin/orders/order_items/${id}`} className ="btn btn-warning btn-sm">
                  <i className ="fa fa-book"></i>
                  اقلام سفارش
                </Link>
              </td>
            </tr>
           

            <tr className ="border-bottom">
              <th>شماره سفارش</th>
              <td className ="text-left font-weight-bolder">
                {order.data.data.id || 'نامشخص'}
              </td>
            </tr>
            <tr className ="border-bottom">
              <th>نام مشتری</th>
              <td className ="text-left font-weight-bolder">
                {order.data.data.user.full_name || 'نامشخص'}
              </td>
            </tr>
            <tr className ="border-bottom">
              <th>آدرس</th>
              <td className ="text-left font-weight-bolder">
                  {order.data.data.address.address || 'نامشخص'}
              </td>
            </tr>
            <tr className ="border-bottom">
              <th>شهر</th>
              <td className ="text-left font-weight-bolder">
                  {order.data.data.address.city.name || 'نامشخص'}
              </td>
            </tr>
            <tr className ="border-bottom">
              <th>کد پستی</th>
              <td className ="text-left font-weight-bolder">
                  {order.data.data.address.postal_code || 'نامشخص'}
              </td>
            </tr>
            <tr className ="border-bottom">
              <th>پلاک</th>
              <td className ="text-left font-weight-bolder">
                  {order.data.data.address.no || 'نامشخص'}
              </td>
            </tr>
            <tr className ="border-bottom">
              <th>واحد</th>
              <td className ="text-left font-weight-bolder">
                  {order.data.data.address.unit || 'نامشخص'}
              </td>
            </tr>
            <tr className ="border-bottom">
              <th>موبایل</th>
              <td className ="text-left font-weight-bolder">
                  {order.data.data.user.mobile || order.data.data.address.mobile || 'نامشخص'}
              </td>
            </tr>
            <tr className ="border-bottom">
              <th>نوع پرداخت</th>
              <td className ="text-left font-weight-bolder">
                  {order.data.data.payment_method.name || 'نامشخص'}
              </td>
            </tr>
            <tr className ="border-bottom">
              <th>شیوه ارسال</th>
              <td className ="text-left font-weight-bolder">
                  {order.data.data.delivery_method.name || 'نامشخص'}
              </td>
            </tr>
            <tr className ="border-bottom">
              <th>تاریخ پرداخت</th>
              <td className ="text-left font-weight-bolder">
                  {order.data.data.order_payment_date || 'پرداخت نشده'}
              </td>
            </tr>
            <tr className ="border-bottom">
              <th>تاریخ ارسال</th>
              <td className ="text-left font-weight-bolder">
                  {order.data.data.sent_date || 'ارسال نشده'}
              </td>
            </tr>
            <tr className ="border-bottom">
              <th>تاریخ تحویل</th>
              <td className ="text-left font-weight-bolder">
                  {order.data.data.delivery_date || 'تحویل نشده'}
              </td>
            </tr>
            <tr className ="border-bottom">
              <th>مجموع مبلغ سفارش (بدون تخفیف)</th>
              <td className ="text-left font-weight-bolder">
                {(order.data.data.finall_amount_price - order.data.data.amount_discount) || 'نامشخص'}
              </td>
            </tr>
            <tr className ="border-bottom">
              <th>مجموع تمامی مبلغ تخفیفات</th>
              <td className ="text-left font-weight-bolder">
                {order.data.data.amount_discount || 'نامشخص'}
              </td>
            </tr>
            <tr className ="border-bottom">
              <th>مبلغ نهایی</th>
              <td className ="text-left font-weight-bolder">
                {order.data.data.finall_amount_price}
              </td>
            </tr>
            <tr className ="border-bottom">
              <th>وضعیت سفارش</th>
              <td className ="text-left font-weight-bolder">
                {order.data.data.status}
              </td>
            </tr>
          </tbody>
        </table>
                
            )}
       
      </section>
    </section>
  </section>
</section>


    )
}

export default DetailOrder;