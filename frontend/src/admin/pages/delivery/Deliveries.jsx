import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDeliveries, deleteDelivery } from "../../services/deliveryService.js";
import { showError,handleDelete } from "../../../utils/notifications.jsx";

function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // برای جلوگیری از به‌روزرسانی state بعد از unmount

    const fetchDeliveries = async () => {
      try {
        setIsLoading(true);
        const response = await getDeliveries();
        if (isMounted) {
          setDeliveries(Array.isArray(response.data.data) ? response.data.data : []);
        }
      } catch (error) {
        if (isMounted) {
          setDeliveries([]);
          showError(error.response?.data?.error || "دریافت روش‌های ارسال با خطا مواجه شد");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDeliveries();

    return () => {
      isMounted = false; // cleanup برای جلوگیری از به‌روزرسانی state بعد از unmount
    };
  }, []); // آرایه وابستگی خالی برای اجرای یک‌باره

 

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>مدیریت روش‌های ارسال</h5>
          </section>
          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/deliveries/add" className="btn btn-success btn-sm ms-auto">
              <i className="fa fa-plus"></i> افزودن روش ارسال جدید
            </Link>
          </section>
          {isLoading ? (
            <div className="text-center my-4">
              <p>در حال بارگذاری...</p>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">در حال بارگذاری...</span>
              </div>
            </div>
          ) : (
            <section className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>نام روش ارسال</th>
                    <th>هزینه (تومان)</th>
                    <th>زمان ارسال</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.length > 0 ? (
                    deliveries.map((delivery, index) => (
                      <tr key={delivery.id}>
                        <td>{index + 1}</td>
                        <td>{delivery.name}</td>
                        <td>{delivery.amount}</td>
                        <td>{delivery.delivery_time}</td>
                        <td>
                          <Link
                            to={`/admin/deliveries/edit/${delivery.id}`}
                            className="btn btn-primary btn-sm me-2"
                          >
                            ویرایش
                            <i className="fa fa-edit ms-1"></i>
                          </Link>
                           <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleDelete(
                                delivery.id,
                                delivery.name,
                                deleteDelivery,
                                setDeliveries,
                                deliveries,
                                "روش ارسال"
                              )
                            }
                          >
                            حذف
                            <i className="fa fa-trash ms-1"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        هیچ روش ارسالی وجود ندارد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          )}
        </section>
      </section>
    </section>
  );
}

export default Deliveries;