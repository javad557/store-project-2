import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getVariants, updateVariant, deleteVariant } from "../../../services/market/variantService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function Variants() {
  const { productId } = useParams();
  const [variants, setVariants] = useState([]);
  const [attributeColumns, setAttributeColumns] = useState([]);
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const response = await getVariants(productId);
        console.log("واریانت‌های دریافت‌شده:", response.data);
        const variantsData = Array.isArray(response.data.variants) ? response.data.variants : [];
        setVariants(variantsData);
        setProductName(response.data.product_name || "محصول بدون نام");
        setProductImage(response.data.product_image || null);

        const allAttributes = new Set();
        variantsData.forEach((variant) => {
          if (variant.attributes && typeof variant.attributes === "object") {
            Object.keys(variant.attributes).forEach((key) => allAttributes.add(key));
          }
        });
        const columns = Array.isArray(response.data.attribute_columns)
          ? [...new Set([...response.data.attribute_columns, ...allAttributes])]
          : [...allAttributes];
        setAttributeColumns(columns);
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
      const payload = {
        color: updatedData.color,
        number: updatedData.number,
        freezed_number: updatedData.freezed_number,
        price_increase: updatedData.price_increase,
        attributes: updatedData.attributes || {},
      };

      console.log("Sending update payload:", { variantId, payload });
      await updateVariant(variantId, payload);
      setVariants(
        variants.map((variant) =>
          variant.id === variantId ? { ...variant, ...updatedData } : variant
        )
      );
      showSuccess("واریانت با موفقیت ویرایش شد");
    } catch (error) {
      console.error("Validation error:", error.response?.data);
      const errorMessage =
        error.response?.data?.errors?.join("، ") ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        "ویرایش واریانت با خطا مواجه شد";
      showError(errorMessage);
    }
  };

  const handleDeleteVariant = async (variantId, color) => {
    const result = await Swal.fire({
      title: `آیا از انتقال واریانت "${color}" به فروش غیرمستقیم مطمئن هستید؟`,
      text: "این عملیات واریانت را به حالت فروش از طریق واسطه‌ها تغییر می‌دهد!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "بله، انتقال بده!",
      cancelButtonText: "لغو",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteVariant(variantId);
        setVariants(
          variants.map((variant) =>
            variant.id === variantId ? { ...variant, number: 999 } : variant
          )
        );
        showSuccess("واریانت با موفقیت به فروش غیرمستقیم منتقل شد");
      } catch (error) {
        console.error("Validation error:", error.response?.data);
        const errorMessage =
          error.response?.data?.errors?.join("، ") ||
          error.response?.data?.error ||
          error.response?.data?.message ||
          "انتقال واریانت به فروش غیرمستقیم با خطا مواجه شد";
        showError(errorMessage);
      }
    }
  };

  const handleInputChange = (variantId, field, value) => {
    setVariants(
      variants.map((variant) =>
        variant.id === variantId
          ? field.startsWith("attributes.")
            ? {
                ...variant,
                attributes: {
                  ...variant.attributes,
                  [field.replace("attributes.", "")]: value,
                },
              }
            : field === "price_increase" || field === "number" || field === "freezed_number"
            ? { ...variant, [field]: parseInt(value) || 0 }
            : { ...variant, [field]: value }
          : variant
      )
    );
  };

  return (
    <section className="row" dir="rtl">
      <style>
        {`
          .btn-group .btn {
            transition: none;
          }
          .btn .badge {
            display: none;
            position: absolute;
            bottom: -35px;
            right: 50%;
            transform: translateX(50%);
            background-color: #000;
            color: #fff;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 10;
            line-height: 1.2;
          }
          .btn:hover .badge {
            display: block;
            animation: fadeInOut 4s ease-in-out forwards;
          }
          @keyframes fadeInOut {
            0% {
              opacity: 0;
              transform: translateX(50%) translateY(5px);
            }
            20% {
              opacity: 1;
              transform: translateX(50%) translateY(0);
            }
            80% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform: translateX(50%) translateY(5px);
            }
          }
          .uniform-button {
            min-width: 120px;
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
            line-height: 1.5;
          }
          .product-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
          }
          .product-image {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid #dee2e6;
          }
          .color-cell {
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: flex-end; /* دایره در سمت راست */
          }
          .color-circle {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1px solid #dee2e6;
            flex-shrink: 0; /* جلوگیری از تغییر اندازه دایره */
          }
          .color-input {
            width: 100px; /* عرض ثابت برای اینپوت رنگ */
            display: inline-block;
          }
          .table td, .table th {
            vertical-align: middle; /* تراز عمودی وسط */
            padding: 0.5rem; /* کاهش پدینگ برای کنترل ارتفاع */
          }
        `}
      </style>
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <div className="product-header">
              {productImage && (
                <img
                  src={productImage}
                  alt={productName}
                  className="product-image"
                  onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                />
              )}
              <h5>واریانت‌ها و انبارداری - {productName}</h5>
            </div>
          </section>

          {loading ? (
            <div className="text-center my-4">در حال بارگذاری...</div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : null}

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link
              to={`/admin/market/variants/variantmanagement/${productId}`}
              className="btn btn-info btn-sm uniform-button"
            >
              مدیریت واریانت
            </Link>
            <Link to="/admin/market/products" className="btn btn-info btn-sm uniform-button">
              بازگشت
            </Link>
          </section>

          <section className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>رنگ</th>
                  <th>سفارش فعال</th>
                  <th>تعداد</th>
                  <th>افزایش قیمت</th>
                  {attributeColumns.map((column, index) => (
                    <th key={index}>{column === `ویژگی ${index + 1}` ? "سایز" : column}</th>
                  ))}
                  <th className="text-center">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {variants.length > 0 ? (
                  variants.map((variant, index) => (
                    <tr key={variant.id}>
                      <th>{index + 1}</th>
                      <td>
                        <div className="color-cell">
                          <input
                            type="text"
                            className="form-control form-control-sm color-input"
                            value={variant.color || ""}
                            onChange={(e) => handleInputChange(variant.id, "color", e.target.value)}
                          />
                          <span
                            className="color-circle"
                            style={{ backgroundColor: variant.hex_color || "#000000" }}
                            title={variant.color}
                          ></span>
                        </div>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={variant.freezed_number || 0}
                          onChange={(e) =>
                            handleInputChange(variant.id, "freezed_number", parseInt(e.target.value))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={variant.number || 0}
                          onChange={(e) =>
                            handleInputChange(variant.id, "number", parseInt(e.target.value))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={variant.price_increase || 0}
                          onChange={(e) =>
                            handleInputChange(variant.id, "price_increase", parseInt(e.target.value))
                          }
                        />
                      </td>
                      {attributeColumns.map((column, colIndex) => (
                        <td key={colIndex}>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={variant.attributes[column] || ""}
                            onChange={(e) =>
                              handleInputChange(variant.id, `attributes.${column}`, e.target.value)
                            }
                          />
                        </td>
                      ))}
                      <td className="text-center">
                        <div className="btn-group">
                          <button
                            className="btn btn-success btn-sm position-relative me-1"
                            onClick={() =>
                              handleUpdateVariant(variant.id, {
                                color: variant.color,
                                number: variant.number,
                                freezed_number: variant.freezed_number,
                                price_increase: variant.price_increase,
                                attributes: variant.attributes || {},
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
                    <td colSpan={5 + attributeColumns.length} className="text-center">
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