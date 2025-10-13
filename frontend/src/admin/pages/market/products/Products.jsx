import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  deleteProduct,
  toggleProductAvailability,
} from "../../../services/market/productService.js";
import { getCategories } from "../../../services/market/categoryService.js";
import { getBrands } from "../../../services/market/brandService.js";
import { showSuccess, showError } from "../../../../utils/notifications.jsx";
import { FaEdit, FaTrashAlt, FaShieldAlt, FaImages, FaBox } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function Products() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // دریافت محصولات با useQuery
  const {
    data: products = [],
    isLoading: isProductsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await getProducts();
      const mappedProducts = Array.isArray(response.data.data)
        ? response.data.data.map((product) => ({
            ...product,
            is_available: product.marketable === 1, // تبدیل marketable به is_available
          }))
        : [];
      return mappedProducts;
    },
    onError: () => {
      showError("سرویس محصولات در دسترس نیست");
    },
  });

  // دریافت دسته‌بندی‌ها با useQuery
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
    onError: () => {
      showError("سرویس دسته‌بندی‌ها در دسترس نیست");
    },
  });

  // دریافت برندها با useQuery
  const {
    data: brands = [],
    isLoading: isBrandsLoading,
    error: brandsError,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await getBrands();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
    onError: () => {
      showError("سرویس برندها در دسترس نیست");
    },
  });

  // حذف محصول با useMutation
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (response, id) => {
      if (response.data.hasActiveOrders) {
        showError("برای محصول مورد نظر سفارش فعال وجود دارد");
      } else {
        queryClient.setQueryData(["products"], (old) =>
          old.filter((product) => product.id !== id)
        );
        showSuccess("محصول با موفقیت حذف شد");
      }
    },
    onError: () => {
      showError("حذف محصول با خطا مواجه شد");
    },
  });

  // تغییر وضعیت موجودی با useMutation
  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, isAvailable }) => toggleProductAvailability(id, !isAvailable),
    onSuccess: (response, { id, isAvailable }) => {
      queryClient.setQueryData(["products"], (old) =>
        old.map((product) =>
          product.id === id ? { ...product, is_available: !isAvailable } : product
        )
      );
      showSuccess(`محصول با موفقیت ${!isAvailable ? "قابل فروش" : "غیر قابل فروش"} شد`);
    },
    onError: () => {
      showError("تغییر وضعیت محصول با خطا مواجه شد");
    },
  });

  // تابع تأیید حذف با SweetAlert2
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
      deleteMutation.mutate(id);
    }
  };

  // فیلتر محصولات
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? String(product.category_id) === String(selectedCategory)
      : true;
    const matchesBrand = selectedBrand
      ? String(product.brand_id) === String(selectedBrand)
      : true;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  // استایل‌های inline
  const styles = `
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
    .max-height-2rem {
      max-height: 2rem;
    }
    .max-width-16-rem {
      max-width: 16rem;
    }
  `;

  return (
    <section className="row" dir="rtl">
      <style>{styles}</style>
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>کالاها</h5>
          </section>

          {(isProductsLoading && isCategoriesLoading && isBrandsLoading) ||
          productsError ||
          categoriesError ||
          brandsError ? (
            <div className="text-center my-4">
              {isProductsLoading && isCategoriesLoading && isBrandsLoading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">در حال بارگذاری...</span>
                </div>
              ) : (
                <>
                  {productsError && (
                    <div className="alert alert-danger text-center">
                      سرویس محصولات در دسترس نیست
                    </div>
                  )}
                  {categoriesError && (
                    <div className="alert alert-danger text-center">
                      سرویس دسته‌بندی‌ها در دسترس نیست
                    </div>
                  )}
                  {brandsError && (
                    <div className="alert alert-danger text-center">
                      سرویس برندها در دسترس نیست
                    </div>
                  )}
                </>
              )}
            </div>
          ) : null}

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
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select form-select-sm mx-2"
                style={{ maxWidth: "150px" }}
                disabled={isCategoriesLoading || categoriesError}
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
                    دسته‌بندی‌ای یافت نشد
                  </option>
                )}
              </select>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="form-select form-select-sm mx-2"
                style={{ maxWidth: "150px" }}
                disabled={isBrandsLoading || brandsError}
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
                    برندی یافت نشد
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
                {isProductsLoading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      در حال بارگذاری محصولات...
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 && !productsError ? (
                  filteredProducts.map((product, index) => (
                    <tr key={product.id} style={{ cursor: "pointer" }}>
                      <th>{index + 1}</th>
                      <td>
                        <Link to={`/products/${product.id}`} className="text-primary">
                          {product.name}
                        </Link>
                      </td>
                      <td>
                        {categories.find((cat) => String(cat.id) === String(product.category_id))
                          ?.name || "-"}
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
                          onChange={() =>
                            toggleAvailabilityMutation.mutate({
                              id: product.id,
                              isAvailable: product.is_available,
                            })
                          }
                          className="mx-2"
                          disabled={toggleAvailabilityMutation.isLoading}
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
                            disabled={deleteMutation.isLoading}
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