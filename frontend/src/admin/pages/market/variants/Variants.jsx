import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getVariants, updateVariant, deleteVariant, detectColor, detectAttributes } from "../../../services/market/variantService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function Variants() {
  const { productId } = useParams(); // دریافت productId از URL
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const response = await getVariants(productId);
        console.log("واریانت‌های دریافت‌شده:", response.data);
        setVariants(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("خطا در دریافت واریانت‌ها:", error);
        setError("سرویس واریانت‌ها در دسترس نیست");
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, [productId]);

  const handleUpdateVariant = async (variantId, updatedData) => {
    try {
      // بررسی سفارش فعال
      const variant = variants.find((v) => v.id === variantId);
      if (variant.has_active_orders) {
        showError("برای واریانت مورد نظر سفارش فعال وجود دارد");
        return;
      }

      // اجرای متدهای تشخیص رنگ و ویژگی‌ها
      await detectColor(updatedData.color);
      await detectAttributes(updatedData);

      // ارسال درخواست ویرایش
      await updateVariant(variantId, updatedData);
      setVariants(
        variants.map((variant) =>
          variant.id === variantId ? { ...variant, ...updatedData } : variant
        )
      );
      showSuccess("واریانت با موفقیت ویرایش شد");
    } catch (error) {
      showError("ویرایش واریانت با خطا مواجه شد");
    }
  };

  const handleDeleteVariant = async (variantId, color) => {
    const result = await Swal.fire({
      title: `آیا از حذف واریانت "${color}" مطمئن هستید؟`,
      text: "این عملیات قابل بازگشت نیست!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "بله، حذف کن!",
      cancelButtonText: "لغو",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteVariant(variantId);
        if (response.data.has_active_orders) {
          showError("برای واریانت مورد نظر سفارش فعال وجود دارد");
        } else {
          setVariants(variants.filter((variant) => variant.id !== variantId));
          showSuccess("واریانت با موفقیت حذف شد");
        }
      } catch (error) {
        showError("حذف واریانت با خطا مواجه شد");
      }
    }
  };

  const handleInputChange = (variantId, field, value) => {
    setVariants(
      variants.map((variant) =>
        variant.id === variantId ? { ...variant, [field]: value } : variant
      )
    );
  };

  return (
    <section className="row" dir="rtl">
      <style>
        {`
          .btn .badge {
            display: none;
            opacity: 0;
            transition: opacity 0.7s ease, transform 0.7s ease;
          }
          .btn:hover .badge {
            display: block;
            opacity: 1;
            bottom: -30px;
            right: 50%;
            transform: translateX(50%);
          }
          .uniform-button {
            min-width: 120px;
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
            line-height: 1.5;
          }
        `}
      </style>
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>واریانت‌ها و انبارداری</h5>
          </section>

          {loading ? (
            <div className="text-center my-4">در حال بارگذاری...</div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : null}

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to={`/admin/market/variants/manage/${productId}`} className="btn btn-info btn-sm uniform-button">
              مدیریت واریانت
            </Link>
            <Link to="/admin/market/products" className="btn btn-info btn-sm uniform-button">
              بازگشت
            </Link>
          </section>

          <section className="table-responsive">
            <table className="table table-striped table-hover h-150px">
              <thead>
                <tr>
                  <th>#</th>
                  <th>رنگ</th>
                  <th>سفارش فعال</th>
                  <th>افزایش قیمت</th>
                  <th>تعداد</th>
                  <th className="text-center">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {variants.length > 0 ? (
                  variants.map((variant, index) => (
                    <tr key={variant.id}>
                      <th>{index + 1}</th>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={variant.color || ""}
                          onChange={(e) => handleInputChange(variant.id, "color", e.target.value)}
                        />
                      </td>
                      <td>{variant.has_active_orders ? "بله" : "خیر"}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={variant.price_increase || 0}
                          onChange={(e) => handleInputChange(variant.id, "price_increase", parseFloat(e.target.value))}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={variant.quantity || 0}
                          onChange={(e) => handleInputChange(variant.id, "quantity", parseInt(e.target.value))}
                        />
                      </td>
                      <td className="text-center">
                        <div className="btn-group">
                          <button
                            className="btn btn-success btn-sm position-relative me-1"
                            onClick={() =>
                              handleUpdateVariant(variant.id, {
                                color: variant.color,
                                price_increase: variant.price_increase,
                                quantity: variant.quantity,
                              })
                            }
                          >
                            <FaCheck />
                            <span className="badge bg-dark">تأیید</span>
                          </button>
                          <button
                            className="btn btn-danger btn-sm position-relative"
                            onClick={() => handleDeleteVariant(variant.id, variant.color)}
                          >
                            <FaTrashAlt />
                            <span className="badge bg-dark">حذف</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      هیچ واریانتی یافت نشد
                    </td>
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

export default Variants;