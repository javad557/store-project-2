import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getDeliveries,
  deleteDelivery,
} from "../../services/deliveryService.js";
import {
  showSuccess,
  showError,
  confirmDelete,
} from "../../../utils/notifications.jsx";

function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await getDeliveries();
        const rawDeliveries = Array.isArray(response.data) ? response.data : [];
        // بررسی و فیلتر کردن داده‌های ناقص
        const validDeliveries = rawDeliveries.filter(
          (delivery) => delivery.id && delivery.name && delivery.amount != null && delivery.delivery_time
        );
        setDeliveries(validDeliveries);
      } catch (error) {
        setDeliveries([]);
        showError("دریافت روش‌های ارسال با خطا مواجه شد");
        console.error("Error fetching deliveries:", error);
      }
    };
    fetchDeliveries();
  }, []);

  const handleDelete = async (id, name) => {
    const isConfirmed = await confirmDelete(name);
    if (isConfirmed) {
      try {
        const response = await deleteDelivery(id);
        setDeliveries(deliveries.filter((delivery) => delivery.id !== id));
        showSuccess(response.data.message);
      } catch (error) {
        showError("حذف روش ارسال با خطا مواجه شد");
      }
    }
  };

  return (
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>مدیریت روش‌های ارسال</h5>
          </section>
          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/deliveries/add" className="btn btn-success btn-sm">
              <i className="fa fa-plus"></i> افزودن روش ارسال
            </Link>
          </section>
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
                      <td>{delivery.name || "-"}</td>
                      <td>
                        {delivery.amount != null
                          ? delivery.amount.toLocaleString()
                          : "-"}
                      </td>
                      <td>{delivery.delivery_time || "-"}</td>
                      <td>
                        <Link
                          to={`/admin/deliveries/edit/${delivery.id}`}
                          className="btn btn-primary btn-sm me-2"
                        >
                          <i className="fa fa-edit"></i> ویرایش
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDelete(delivery.id, delivery.name)
                          }
                        >
                          <i className="fa fa-trash"></i> حذف
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">روش ارسالی یافت نشد</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </section>
      </section>
    </section>
  );
}

export default Deliveries;