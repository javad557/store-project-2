import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logout as logoutService } from "../../auth/services/authService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "../../utils/notifications";
import { getProducts } from "../services/market/productServise";
import { useState } from "react";

function MainHeader() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: products = [],
    error: productError,
    isError: isProductError,
    isSuccess: isProductSuccess,
    isLoading: isProductLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await getProducts();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = async () => {
    try {
      localStorage.setItem("is_logging_out", "true");
      const response = await logoutService();
      localStorage.removeItem("auth_token");
      localStorage.removeItem("otp_token");
      localStorage.removeItem("identifier");
      localStorage.removeItem("fingerprint");
      localStorage.removeItem("is_logging_out");
      queryClient.invalidateQueries(["user"]);
      queryClient.removeQueries(["user"]);
      showSuccess(response.message || "با موفقیت از سیستم خارج شدید");
      navigate("/auth/loginregister", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("otp_token");
      localStorage.removeItem("identifier");
      localStorage.removeItem("fingerprint");
      localStorage.removeItem("is_logging_out");
      queryClient.invalidateQueries(["user"]);
      queryClient.removeQueries(["user"]);
      showError(error.message || "خطا در خروج از سیستم");
      navigate("/auth/loginregister", { replace: true });
    }
  };

  return (
    <header className="main-header mb-4" key={user ? user.id : "logged-out"}>
      <section className="top-header">
        <div className="container-xxl">
          <div className="d-md-flex justify-content-md-between align-items-md-center py-3">
            <div className="d-flex justify-content-between align-items-center d-md-block">
              <Link className="text-decoration-none" to="/main/home">
                <img
                  src="http://localhost:8000/storage/images/logo/logo.png"
                  alt="logo"
                  width={100}
                />
              </Link>
              <button
                className="btn btn-link text-dark d-md-none"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasExample"
                aria-controls="offcanvasExample"
              >
                <i className="fa fa-bars me-1"></i>
              </button>
            </div>

            <div className="mt-3 mt-md-auto search-wrapper">
              <div className="search-box">
                <div className="search-textbox">
                  <span>
                    <i className="fa fa-search"></i>
                  </span>
                  <input
                    id="search"
                    type="text"
                    className=""
                    placeholder="جستجوی محصول ..."
                    autoComplete="off"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <div
                  className={`search-result ${
                    searchQuery && !isProductLoading ? "" : "visually-hidden"
                  }`}
                >
                  {isProductLoading ? (
                    <div className="search-result-item">در حال بارگذاری...</div>
                  ) : isProductError ? (
                    <div className="search-result-item text-danger">
                      خطا در بارگذاری محصولات: {productError.message}
                    </div>
                  ) : filteredProducts.length > 0 ? (
                    <>
                      <div className="search-result-title">
                        نتایج جستجو برای{" "}
                        <span className="search-words">"{searchQuery}"</span>
                        <span className="search-result-type">در کالاها</span>
                      </div>
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="search-result-item">
                          <Link
                            className="text-decoration-none"
                            to={`/main/market/product/${product.id}`}
                          >
                            <i className="fa fa-link"></i> {product.name}
                          </Link>
                        </div>
                      ))}
                    </>
                  ) : (
                    searchQuery && (
                      <div className="search-result-item">
                        <span className="search-no-result">
                          هیچ محصولی یافت نشد
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3 mt-md-auto text-end">
              {user ? (
                <div className="d-inline-flex align-items-center header-icons">
                  {user.is_admin && (
                    <div >
                      <Link
                        to="/admin/dashboard"
                        className="btn btn-link text-dark"
                        aria-label="ورود به پنل ادمین"
                      >
                        <i className="fa fa-user-cog"></i>
                      </Link>
                    </div>
                  )}
                  <div className="px-md-2">
                    <span
                      className="btn btn-link text-dark profile-button"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa fa-user"></i>
                    </span>
                    <div
                      className="dropdown-menu dropdown-menu-end custom-drop-down"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <div>
                        <Link className="dropdown-item" to="/main/profile/my-profile">
                          <i className="fa fa-user-circle"></i>پروفایل کاربری
                        </Link>
                      </div>
                      <div>
                        <Link className="dropdown-item" to="/main/profile/my-orders">
                          <i className="fa fa-newspaper"></i>سفارشات
                        </Link>
                      </div>
                      <div>
                        <Link
                          className="dropdown-item"
                          to="/main/profile/my-favorites"
                        >
                          <i className="fa fa-heart"></i>علاقه‌مندی‌ها
                        </Link>
                      </div>
                      <hr className="dropdown-divider" />
                      <div>
                        <button className="dropdown-item" onClick={handleLogout}>
                          <i className="fa fa-sign-out-alt"></i>خروج
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="px-md-2">
                    <Link
                      className="btn btn-link position-relative text-dark header-cart-link"
                      to="/main/cart/cart"
                    >
                      <i className="fa fa-shopping-cart"></i>{" "}
                      {user.carts?.length > 0 && (
                        <span className="position-absolute badge rounded-pill bg-danger smaller-badge">
                          {user.carts.length}
                        </span>
                      )}
                    </Link>
                    {user.carts?.length > 0 && (
                      <div className="header-cart-dropdown">
                        <div className="border-bottom d-flex justify-content-between p-2">
                          <span className="text-muted">{user.carts?.length || 0} کالا</span>
                          <Link className="text-decoration-none text-info" to="/main/cart/index">
                            مشاهده سبد خرید
                          </Link>
                        </div>
                        <div className="header-cart-dropdown-body">
                          {(user.carts || []).map((cartItem) => (
                            <div
                              key={cartItem.id}
                              className="header-cart-dropdown-body-item d-flex justify-content-start align-items-center"
                            >
                              <img
                                className="flex-shrink-1"
                                src={cartItem.product?.image || "assets/images/products/default.jpg"}
                                alt={cartItem.product?.name}
                              />
                              <div className="w-100 text-truncate">
                                <Link
                                  className="text-decoration-none text-dark"
                                  to={`/main/market/product/${cartItem.product?.id}`}
                                >
                                  {cartItem.product?.name}
                                </Link>
                              </div>
                              <div className="flex-shrink-1">
                                <Link className="text-muted text-decoration-none p-1" to="#">
                                  <i className="fa fa-trash-alt"></i>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="header-cart-dropdown-footer border-top d-flex justify-content-between align-items-center p-2">
                          <div>
                            <div>مبلغ قابل پرداخت</div>
                            <div>
                              {user.carts
                                ? user.carts
                                    .reduce((total, item) => total + (item.product?.price || 0), 0)
                                    .toLocaleString("fa-IR")
                                : 0}{" "}
                              تومان
                            </div>
                          </div>
                          <div>
                            <Link className="btn btn-danger btn-sm d-block" to="/main/cart/index">
                              ثبت سفارش
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="d-inline px-md-3">
                  <Link to="/auth/loginregister" aria-label="ورود یا ثبت‌نام">
                    <i className="fa fa-user-lock" style={{ color: "#000000" }}></i>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </header>
  );
}

export default MainHeader;