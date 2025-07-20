import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getGuarantees, deleteGuarantee } from "../../../services/market/guaranteeService.js";
import { getProduct } from "../../../services/market/productService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function Guarantees() {
  const [guarantees, setGuarantees] = useState([]);
  const [product, setProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState({
    guarantees: true,
    product: true,
  });
  const [errors, setErrors] = useState({
    guarantees: null,
    product: null,
  });
  const navigate = useNavigate();
  const { productId } = useParams();

  useEffect(() => {
    console.log("productId from useParams:", productId);
    const fetchProduct = async () => {
      try {
        const response = await getProduct(productId);
        console.log("محصول دریافت‌شده:", response.data);
        setProduct(response.data);
      } catch (error) {
        console.error("خطا در دریافت محصول:", error);
        if (error.response?.status >= 500) {
          setErrors((prev) => ({ ...prev, product: "سرویس محصول در دسترس نیست" }));
        }
      } finally {
        setLoading((prev) => ({ ...prev, product: false }));
      }
    };

    const fetchGuarantees = async () => {
      try {
        const response = await getGuarantees(productId);
        console.log("گارانتی‌ها:", response.data);
        setGuarantees(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("خطا در دریافت گارانتی‌ها:", error);
        if (error.response?.status >= 500) {
          setErrors((prev) => ({ ...prev, guarantees: "سرویس گارانتی‌ها در دسترس نیست" }));
        }
        setGuarantees([]);
      } finally {
        setLoading((prev) => ({ ...prev, guarantees: false }));
      }
    };

    fetchProduct();
    fetchGuarantees();
  }, [productId]);

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: `آیا از حذف گارانتی "${name}" مطمئن هستید؟`,
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
        await deleteGuarantee(id);
        setGuarantees(guarantees.filter((guarantee) => guarantee.id !== id));
        showSuccess("گارانتی با موفقیت حذف شد");
      } catch (error) {
        showError("حذف گارانتی با خطا مواجه شد");
      }
    }
  };

  const filteredGuarantees = guarantees.filter((guarantee) =>
    guarantee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="row" dir="rtl">
      <style>
        {`
          .custom-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
             font-size: 0.75rem; /* کاهش فونت برای دکمه‌های کوچکتر */
            padding:0 0.4rem;
            border-radius: 0.25rem;
            border: none;
            cursor: pointer;
            transition: none;
          }
          .edit-button {
            background-color: #007bff;
            color: white;
          }
          .delete-button {
            background-color: #dc3545;
            color: white;
          }
          .custom-button:hover {
            background-color: inherit; /* حفظ رنگ اصلی */
            transform: none; /* جلوگیری از تغییر اندازه */
            box-shadow: none; /* حذف سایه */
          }
        `}
      </style>
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>
              گارانتی‌های محصول: {loading.product ? "در حال بارگذاری..." : product?.name || "محصول"}
            </h5>
          </section>

          {(loading.guarantees || loading.product) && (
            <div className="text-center my-4">در حال بارگذاری...</div>
          )}

          {errors.product && (
            <div className="alert alert-danger text-center">{errors.product}</div>
          )}
          {errors.guarantees && (
            <div className="alert alert-danger text-center">{errors.guarantees}</div>
          )}

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <div>
              <Link to={`/admin/market/guarantees/add/${productId}`} className="btn btn-success btn-sm me-2">
                افزودن گارانتی جدید
              </Link>
              <Link to="/admin/market/products" className="btn btn-info btn-sm">
                بازگشت
              </Link>
            </div>
           
          </section>

          <section className="table-responsive">
            <table className="table table-striped table-hover h-150px">
              <thead>
                <tr>
                  <th>#</th>
                  <th>نام گارانتی</th>
                  <th>مدت اعتبار (ماه)</th>
                  <th>افزایش قیمت</th>
                  <th className="max-width-16-rem text-center">تنظیمات</th>
                </tr>
              </thead>
              <tbody>
                {loading.guarantees ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      در حال بارگذاری گارانتی‌ها...
                    </td>
                  </tr>
                ) : filteredGuarantees.length > 0 ? (
                  filteredGuarantees.map((guarantee, index) => (
                    <tr key={guarantee.id}>
                      <th>{index + 1}</th>
                      <td>{guarantee.name}</td>
                      <td>{guarantee.pivot?.duration !== undefined ? guarantee.pivot.duration : "-"}</td>
                      <td>{guarantee.pivot?.price_increase !== undefined ? guarantee.pivot.price_increase : "-"}</td>
                      <td className="text-center">
                        <div className="btn-group">
                          <Link
                            to={`/admin/market/guarantees/edit/${guarantee.id}/${productId}`}
                            className="custom-button edit-button"
                          >
                            <FaEdit /> ویرایش
                          </Link>
                          <button
                            className="custom-button delete-button"
                            onClick={() => handleDelete(guarantee.id, guarantee.name)}
                          >
                            <FaTrashAlt /> حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      هیچ گارانتی‌ای یافت نشد
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

export default Guarantees;