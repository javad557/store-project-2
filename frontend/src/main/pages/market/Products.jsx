import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllBrands } from "../../services/market/brandServise";
import { getAllCategories } from "../../services/market/categoryServise";
import { addProductToFavorites, getFiltredProducts } from "../../services/market/productServise";
import { useAuth } from "../../../context/AuthContext";

function Products() {

   const { user } = useAuth();
   const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    sort: "",
    category_id: "",
    brand_id: "",
    min_price: "",
    max_price: "",
    page: 1,
  });

  const [priceRange, setPriceRange] = useState({
    min: "",
    max: "",
  });

  const applyPriceFilter = () => {
    updateFilter("min_price", priceRange.min);
    updateFilter("max_price", priceRange.max);
  };

  const {
    data: brands = [],
    isLoading: isBrandLoading,
    error: brandError,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await getAllBrands();
      return response.data.data;
    },
  });

  const {
    data: categories = [],
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getAllCategories();
      return response.data.data;
    },
  });

  const {
    data: filtered_products,
    isLoading: isProductsLoading,
    error: productsError,
    refetch,
  } = useQuery({
    queryKey: ["filtered_products", filters],
    queryFn: () => getFiltredProducts(filters),
    enabled: false,
  });

  if(!isProductsLoading){
    console.log(filtered_products);
  }

  useEffect(() => {
    console.log("فیلترها:", filters);
    refetch();
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? value : 1,
    }));
  };

  const CategoryTree = ({ category, depth = 0 }) => {
    const hasChildren = category.all_children && category.all_children.length > 0;
    const isOpen = openCategories[category.id];
    const indent = depth * 20;

    return (
      <div className="sidebar-nav-item">
        <div
          className="sidebar-nav-item-title d-flex justify-content-between align-items-center"
          style={{
            cursor: hasChildren ? "pointer" : "default",
            userSelect: "none",
            paddingLeft: `${indent}px`,
          }}
          onClick={() => hasChildren && toggleCategory(category.id)}
        >
          <span
            onClick={(e) => {
              e.stopPropagation();
              updateFilter("category_id", category.id);
            }}
            style={{
              cursor: "pointer",
              color: filters.category_id === category.id ? "#d32f2f" : "inherit",
              fontWeight: filters.category_id === category.id ? "bold" : "normal",
            }}
          >
            {category.name}
          </span>

          {hasChildren && (
            <i
              className="fa fa-angle-left ms-2"
              style={{
                transition: "transform 0.2s",
                transform: isOpen ? "rotate(-90deg)" : "rotate(0deg)",
              }}
            />
          )}
        </div>

        {hasChildren && isOpen && (
          <div>
            {category.all_children.map((child) => (
              <CategoryTree key={child.id} category={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const [openCategories, setOpenCategories] = useState({});
  const toggleCategory = (id) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const products = filtered_products?.data?.data || [];
  const pagination = filtered_products?.data?.meta || {};

  const deleteFilters = () => {
    setFilters({
      sort: "",
      category_id: "",
      brand_id: "",
      min_price: "",
      max_price: "",
      page: 1,
    });
  };

  const findCategoryById = (categories, id) => {
    for (const cat of categories) {
      if (cat.id == id) return cat;
      if (cat.all_children && cat.all_children.length > 0) {
        const found = findCategoryById(cat.all_children, id);
        if (found) return found;
      }
    }
    return null;
  };

   // Mutation برای افزودن/حذف محصول از علاقه‌مندی‌ها
  const { mutate: addToFavorite } = useMutation({
    mutationFn: addProductToFavorites,
    onMutate: async (productId) => {
      await queryClient.cancelQueries(['user']);
      const previousUser = queryClient.getQueryData(['user']);
      queryClient.setQueryData(['user'], (old) => {
        if (!old) return old;
        const isAlreadyFavorite = old.favorites?.some((f) => f.product_id === productId);
        if (isAlreadyFavorite) {
          return {
            ...old,
            favorites: old.favorites.filter((f) => f.product_id !== productId),
          };
        } else {
          return {
            ...old,
            favorites: [...(old.favorites || []), { product_id: productId }],
          };
        }
      });
      return { previousUser };
    },
    onError: (error, productId, context) => {
      queryClient.setQueryData(['user'], context.previousUser);
      showError(error.response?.data?.error || 'خطا در تغییر وضعیت علاقه‌مندی محصول');
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries(['user']);
    },
  });

   // بررسی اینکه آیا محصول در لیست علاقه‌مندی‌ها وجود دارد
  const isFavorite = (productId) => {
    return user?.favorites?.some((favorite) => favorite.product_id === productId) || false;
  };

return (
  <section className="container-fluid px-4">
    <section className="row gx-4 align-items-start">
      {/* لودینگ و خطا */}
      {isBrandLoading || isCategoryLoading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="text-center">
            <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">در حال بارگذاری...</span>
            </div>
            <p className="mt-3">در حال بارگذاری...</p>
          </div>
        </div>
      ) : brandError || categoryError ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="text-center text-danger">
            <p>خطایی رخ داده است. لطفاً دوباره تلاش کنید.</p>
            <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
              تلاش مجدد
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* سایدبار */}
          <aside id="sidebar" className="col-md-3">
            {/* دسته‌بندی‌ها */}
            <section className="content-wrapper bg-white p-4 rounded-2 shadow-sm mb-3">
              <h2 className="h6 fw-bold mb-3">دسته‌بندی‌ها</h2>
              <section className="sidebar-nav">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <CategoryTree key={category.id} category={category} />
                  ))
                ) : (
                  <div className="sidebar-nav-item">
                    <span className="sidebar-nav-item-title">دسته‌بندی‌ای یافت نشد</span>
                  </div>
                )}
              </section>
            </section>

            {/* محدوده قیمت */}
            <section className="content-wrapper bg-white p-4 rounded-2 shadow-sm mb-3">
              <h2 className="h6 fw-bold mb-3">محدوده قیمت</h2>
              <section className="sidebar-price-range d-flex justify-content-between gap-2 mb-3">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="از ..."
                  value={priceRange.min}
                  onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                />
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="تا ..."
                  value={priceRange.max}
                  onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                />
              </section>
              <div className="d-grid">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={applyPriceFilter}
                  disabled={!priceRange.min && !priceRange.max}
                >
                  اعمال قیمت
                </button>
              </div>
            </section>

            {/* برندها */}
            <section className="content-wrapper bg-white p-4 rounded-2 shadow-sm">
              <h2 className="h6 fw-bold mb-3">برند</h2>
              <section className="content-header-link">
                {brands.map((brand) => (
                  <ul key={brand.id} className="list-unstyled mb-0">
                    <li
                      style={{
                        cursor: "pointer",
                        color: filters.brand_id == brand.id ? "#d32f2f" : "inherit",
                        fontWeight: filters.brand_id == brand.id ? "bold" : "normal",
                      }}
                      onClick={() => updateFilter("brand_id", brand.id)}
                    >
                      {brand.name}
                    </li>
                  </ul>
                ))}
              </section>
            </section>
          </aside>

          {/* محتوای اصلی */}
          <main id="main-body" className="main-body col-md-9">
            <section className="content-wrapper bg-white p-4 rounded-2 shadow-sm">
              {/* مرتب‌سازی */}
              <section className="sort mb-4">
                <span className="me-2">مرتب سازی بر اساس:</span>
                <span
                  className={`btn btn-sm mx-1 ${filters.sort === "latest" ? "btn-info" : "btn-light"}`}
                  onClick={() => updateFilter("sort", "latest")}
                >
                  جدیدترین
                </span>
                <span
                  className={`btn btn-sm mx-1 ${filters.sort === "most_expensive" ? "btn-info" : "btn-light"}`}
                  onClick={() => updateFilter("sort", "most_expensive")}
                >
                  گران‌ترین
                </span>
                <span
                  className={`btn btn-sm mx-1 ${filters.sort === "cheapest" ? "btn-info" : "btn-light"}`}
                  onClick={() => updateFilter("sort", "cheapest")}
                >
                  ارزان‌ترین
                </span>
                <span
                  className={`btn btn-sm mx-1 ${filters.sort === "most_views" ? "btn-info" : "btn-light"}`}
                  onClick={() => updateFilter("sort", "most_views")}
                >
                  پربازدیدترین
                </span>
                <span
                  className={`btn btn-sm mx-1 ${filters.sort === "best_selling" ? "btn-info" : "btn-light"}`}
                  onClick={() => updateFilter("sort", "best_selling")}
                >
                  پرفروش‌ترین
                </span>
                <span className="btn btn-sm btn-outline-danger mx-1" onClick={deleteFilters}>
                  حذف فیلترها
                </span>
              </section>

              {/* نتیجه جستجو */}
              <section className="filters mb-4">
                <span className="d-inline-block border p-1 rounded bg-light">نتیجه جستجو برای : </span>

                {filters.brand_id && brands.find(b => b.id == filters.brand_id) && (
                  <span className="d-inline-block border p-1 rounded bg-light mx-1">
                    برند: <span className="badge bg-info text-dark">
                      {brands.find(b => b.id == filters.brand_id).name}
                    </span>
                  </span>
                )}

                {filters.category_id && findCategoryById(categories, filters.category_id) && (
                  <span className="d-inline-block border p-1 rounded bg-light mx-1">
                    دسته: <span className="badge bg-info text-dark">
                      {findCategoryById(categories, filters.category_id).name}
                    </span>
                  </span>
                )}

                {filters.min_price && (
                  <span className="d-inline-block border p-1 rounded bg-light mx-1">
                    قیمت از: <span className="badge bg-info text-dark">{filters.min_price} تومان</span>
                  </span>
                )}
                {filters.max_price && (
                  <span className="d-inline-block border p-1 rounded bg-light mx-1">
                    قیمت تا: <span className="badge bg-info text-dark">{filters.max_price} تومان</span>
                  </span>
                )}
              </section>

              {/* محصولات */}
              {isProductsLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : productsError ? (
                <div className="text-center text-danger py-5">خطا در بارگذاری محصولات</div>
              ) : (
                <>
                  <section className="main-product-wrapper row g-3">
                    {products.length > 0 ? (
                      products.slice(0, 9).map((product) => {
                        // محاسبه درصد تخفیف و قیمت نهایی
                        const discountPercent = product.discount?.amount || 0;
                        const finalPrice = Math.round(product.price * (1 - discountPercent / 100));

                        return (
                          <div key={product.id} className="col-md-4 mb-4">
                            <section className="product h-100 d-flex flex-column bg-white p-3 rounded-2 shadow-sm position-relative">
                              {/* علاقه‌مندی */}
                              <section className="product-add-to-favorite position-absolute top-0 end-0 p-2">
                                {user && (
                                  <div className="product-add-to-favorite">
                                    <span
                                      onClick={() => addToFavorite(product.id)}
                                      className={`product-add-to-favorite-active ${isFavorite(product.id) ? 'favorited' : ''}`}
                                      title={isFavorite(product.id) ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                                    >
                                      <i className={`fa ${isFavorite(product.id) ? 'fas fa-heart' : 'far fa-heart'}`}></i>
                                    </span>
                                  </div>
                                )}
                              </section>

                              <a className="product-link text-decoration-none text-dark" href="#">
                                {/* تصویر محصول */}
                                <section className="product-image mb-3">
                                  <img
                                    src={product.image_url || "assets/images/products/1.jpg"}
                                    alt={product.name}
                                    className="w-100 rounded"
                                    style={{ height: '180px', objectFit: 'cover' }}
                                  />
                                </section>

                                {/* نام محصول */}
                                <section className="product-name flex-grow-1">
                                  <h3 className="h6 fw-bold">{product.name}</h3>
                                </section>

                                {/* قیمت + تخفیف */}
                                <section className="product-price-wrapper mt-2">
                                  <div className="d-flex align-items-center gap-1 flex-wrap">
                                    {/* قیمت اصلی — خاکستری + خط فقط اگر تخفیف داشت */}
                                    <span
                                      className="text-muted"
                                      style={{
                                        fontSize: '0.875rem',
                                        textDecoration: product.discount ? 'line-through' : 'none',
                                      }}
                                    >
                                      {product.price.toLocaleString()} تومان
                                    </span>

                                    {/* فقط اگر تخفیف داشت */}
                                    {discountPercent > 0 && (
                                      <>
                                        {/* کادر قرمز: درصد تخفیف */}
                                        <span
                                          className="badge bg-danger text-white"
                                          style={{
                                            fontSize: '0.7rem',
                                            padding: '0.15rem 0.4rem',
                                            borderRadius: '0.25rem',
                                          }}
                                        >
                                          -{discountPercent}%
                                        </span>

                                        {/* قیمت نهایی — قرمز و bold */}
                                        <span
                                          className="text-danger fw-bold"
                                          style={{ fontSize: '0.95rem' }}
                                        >
                                          {finalPrice.toLocaleString()} تومان
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </section>
                              </a>
                            </section>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-12 text-center py-5">
                        <p>محصولی یافت نشد.</p>
                      </div>
                    )}
                  </section>

                  {/* صفحه‌بندی */}
                  {pagination.last_page > 1 && (
                    <section className="my-4 d-flex justify-content-center">
                      <nav>
                        <ul className="pagination">
                          <li className={`page-item ${filters.page === 1 ? "disabled" : ""}`}>
                            <button
                              className="page-link"
                              onClick={() => updateFilter("page", filters.page - 1)}
                              disabled={filters.page === 1}
                            >
                              قبلی
                            </button>
                          </li>
                          {filters.page > 1 && (
                            <li className="page-item">
                              <button
                                className="page-link"
                                onClick={() => updateFilter("page", filters.page - 1)}
                              >
                                {filters.page - 1}
                              </button>
                            </li>
                          )}
                          <li className="page-item active">
                            <button className="page-link">{filters.page}</button>
                          </li>
                          {filters.page < pagination.last_page && (
                            <li className="page-item">
                              <button
                                className="page-link"
                                onClick={() => updateFilter("page", filters.page + 1)}
                              >
                                {filters.page + 1}
                              </button>
                            </li>
                          )}
                          <li className={`page-item ${filters.page === pagination.last_page ? "disabled" : ""}`}>
                            <button
                              className="page-link"
                              onClick={() => updateFilter("page", filters.page + 1)}
                              disabled={filters.page === pagination.last_page}
                            >
                              بعدی
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </section>
                  )}
                </>
              )}
            </section>
          </main>
        </>
      )}
    </section>
  </section>
);
}

export default Products;