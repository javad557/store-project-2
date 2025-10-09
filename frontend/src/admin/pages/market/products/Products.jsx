import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts, deleteProduct, toggleProductAvailability } from "../../../services/market/productService.js";
import { getCategories } from "../../../services/market/categoryService.js";
import { getBrands } from "../../../services/market/brandService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaEdit, FaTrashAlt, FaPalette, FaShieldAlt, FaImages, FaBox } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [loading, setLoading] = useState({
    products: true,
    categories: true,
    brands: true,
  });
  const [errors, setErrors] = useState({
    products: null,
    categories: null,
    brands: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        console.log("محصولات دریافت‌شده:", response.data);
        // نگاشت marketable به is_available
        const mappedProducts = Array.isArray(response.data)
          ? response.data.map((product) => ({
              ...product,
              is_available: product.marketable === 1 // تبدیل 0/1 به false/true
            }))
          : [];
        setProducts(mappedProducts);
      } catch (error) {
        console.error("خطا در دریافت محصولات:", error);
        setErrors((prev) => ({ ...prev, products: "سرویس محصولات در دسترس نیست" }));
      } finally {
        setLoading((prev) => ({ ...prev, products: false }));
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        console.log("دسته‌بندی‌ها:", response.data);
        setCategories(Array.isArray(response.data) ? response.data : []);
        if (!response.data.length) {
          showError("هیچ دسته‌بندی‌ای دریافت نشد");
        }
      } catch (error) {
        console.error("خطا در دریافت دسته‌بندی‌ها:", error);
        setErrors((prev) => ({ ...prev, categories: "سرویس دسته‌بندی‌ها در دسترس نیست" }));
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await getBrands();
        console.log("برندها:", response.data);
        // بررسی کلید data در پاسخ API
        const brandsData = Array.isArray(response.data.data) ? response.data.data : [];
        setBrands(brandsData);
        if (!brandsData.length) {
          showError("هیچ برندی دریافت نشد");
        }
      } catch (error) {
        console.error("خطا در دریافت برندها:", error);
        setErrors((prev) => ({ ...prev, brands: error.response?.data?.error || "سرویس برندها در دسترس نیست" }));
      } finally {
        setLoading((prev) => ({ ...prev, brands: false }));
      }
    };

    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: `آیا از حذف "${name}" مطمئن هستید؟`,
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
        const response = await deleteProduct(id);
        if (response.data.hasActiveOrders) {
          showError("برای محصول مورد نظر سفارش فعال وجود دارد");
        } else {
          setProducts(products.filter((product) => product.id !== id));
          showSuccess("محصول با موفقیت حذف شد");
        }
      } catch (error) {
        showError("حذف محصول با خطا مواجه شد");
      }
    }
  };

  const handleToggleAvailability = async (id, isAvailable) => {
    try {
      await toggleProductAvailability(id, !isAvailable);
      setProducts(
        products.map((product) =>
          product.id === id ? { ...product, is_available: !isAvailable } : product
        )
      );
      showSuccess(`محصول با موفقیت ${!isAvailable ? "قابل فروش" : "غیر قابل فروش"} شد`);
    } catch (error) {
      showError("تغییر وضعیت محصول با خطا مواجه شد");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? String(product.category_id) === String(selectedCategory)
      : true;
    const matchesBrand = selectedBrand ? String(product.brand_id) === String(selectedBrand) : true;
    return matchesSearch && matchesCategory && matchesBrand;
  });

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
            top: 40px;
            bottom: -50px;
            right: 50%;
            transform: translateX(50%);
            background-color: #000;
            color: #fff;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 10;
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
        `}
      </style>
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>کالاها</h5>
          </section>

          {loading.products && loading.categories && loading.brands ? (
            <div className="text-center my-4">در حال بارگذاری...</div>
          ) : (
            <>
              {errors.categories && (
                <div className="alert alert-danger text-center">{errors.categories}</div>
              )}
              {errors.brands && (
                <div className="alert alert-danger text-center">{errors.brands}</div>
              )}
            </>
          )}

          <section className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2">
            <Link to="/admin/market/products/add" className="btn btn-success btn-sm">
              ایجاد کالای جدید
            </Link>
            <div className="d-flex align-items-center">
              <div className="max-width-16-rem mx-2">
                <input
                  type="text"
                  className="form-control form-control-sm form-text"
                  placeholder="جستجو"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  console.log("دسته‌بندی انتخاب‌شده:", e.target.value);
                  setSelectedCategory(e.target.value);
                }}
                className="form-select form-select-sm mx-2"
                style={{ maxWidth: "150px" }}
                disabled={loading.categories || errors.categories}
              >
                <option value="">همه دسته‌بندی‌ها</option>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.id} value={String(category.id)}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    {errors.categories ? "دسته‌بندی‌ها در دسترس نیست" : "دسته‌بندی‌ای یافت نشد"}
                  </option>
                )}
              </select>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  console.log("برند انتخاب‌شده:", e.target.value);
                  setSelectedBrand(e.target.value);
                }}
                className="form-select form-select-sm mx-2"
                style={{ maxWidth: "150px" }}
                disabled={loading.brands || errors.brands}
              >
                <option value="">همه برندها</option>
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <option key={brand.id} value={String(brand.id)}>
                      {brand.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    {errors.brands ? "برندها در دسترس نیست" : "برندی یافت نشد"}
                  </option>
                )}
              </select>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSelectedBrand("");
                }}
                className="btn btn-primary btn-sm mx-2"
              >
                همه محصولات
              </button>
            </div>
          </section>

          <section className="table-responsive">
            <table className="table table-striped table-hover h-150px">
              <thead>
                <tr>
                  <th>#</th>
                  <th>نام کالا</th>
                  <th>دسته</th>
                  <th>قیمت</th>
                  <th>تصویر کالا</th>
                  <th>وضعیت</th>
                  <th className="max-width-16-rem text-center">تنظیمات</th>
                </tr>
              </thead>
              <tbody>
                {loading.products ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      در حال بارگذاری محصولات...
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 && !errors.products ? (
                  filteredProducts.map((product, index) => (
                    <tr key={product.id} style={{ cursor: "pointer" }}>
                      <th>{index + 1}</th>
                      <td>
                        <Link to={`/products/${product.id}`} className="text-primary">
                          {product.name}
                        </Link>
                      </td>
                      <td>
                        {categories.find((cat) => String(cat.id) === String(product.category_id))?.name || "-"}
                      </td>
                      <td>{product.price || "-"}</td>
                      <td>
                        <img
                          src={`http://localhost:8000/storage/${product.main_image}`}
                          alt={product.name}
                          className="max-height-2rem"
                          width="60px"
                          height="40px"
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={product.is_available}
                          onChange={() => handleToggleAvailability(product.id, product.is_available)}
                          className="mx-2"
                        />
                      </td>
                      <td className="text-center">
                        <div className="btn-group">
                          <Link
                            to={`/admin/market/products/edit/${product.id}`}
                            className="btn btn-primary btn-sm position-relative me-1"
                          >
                            <FaEdit />
                            <span className="badge bg-dark">ویرایش</span>
                          </Link>
                          <Link
                            to={`/admin/market/guarantees/${product.id}`}
                            className="btn btn-info btn-sm position-relative me-1"
                          >
                            <FaShieldAlt />
                            <span className="badge bg-dark">گارانتی</span>
                          </Link>
                          <Link
                            to={`/admin/market/gallery/${product.id}`}
                            className="btn btn-secondary btn-sm position-relative me-1"
                          >
                            <FaImages />
                            <span className="badge bg-dark">گالری</span>
                          </Link>
                          <Link
                            to={`/admin/market/variants/${product.id}`}
                            className="btn btn-dark btn-sm position-relative me-1"
                          >
                            <FaBox />
                            <span className="badge bg-dark">واریانت‌ها و انبارداری</span>
                          </Link>
                          <button
                            className="btn btn-danger btn-sm position-relative"
                            onClick={() => handleDelete(product.id, product.name)}
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
                    <td colSpan="7" className="text-center">
                      هیچ محصولی یافت نشد
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

export default Products;