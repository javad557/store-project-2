
function MainHeader  (){

    return(

        <header className="header mb-4">
  {/* start top-header logo, searchbox and cart */}
  <section className="top-header">
    <div className="container-xxl">
      <div className="d-md-flex justify-content-md-between align-items-md-center py-3">
        <div className="d-flex justify-content-between align-items-center d-md-block">
          <a className="text-decoration-none" href="index.html">
            <img src="assets/images/logo/8.png" alt="logo" />
          </a>
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
              <span><i className="fa fa-search"></i></span>
              <input
                id="search"
                type="text"
                className=""
                placeholder="جستجو ..."
                autoComplete="off"
              />
            </div>
            <div className="search-result visually-hidden">
              <div className="search-result-title">
                نتایج جستجو برای <span className="search-words">"موبایل شیا"</span>
                <span className="search-result-type">در دسته بندی ها</span>
              </div>
              <div className="search-result-item">
                <a className="text-decoration-none" href="#">
                  <i className="fa fa-link"></i> دسته موبایل و وسایل جانبی
                </a>
              </div>

              <div className="search-result-title">
                نتایج جستجو برای <span className="search-words">"موبایل شیا"</span>
                <span className="search-result-type">در برندها</span>
              </div>
              <div className="search-result-item">
                <a className="text-decoration-none" href="#">
                  <i className="fa fa-link"></i> برند شیائومی
                </a>
              </div>
              <div className="search-result-item">
                <a className="text-decoration-none" href="#">
                  <i className="fa fa-link"></i> برند توشیبا
                </a>
              </div>
              <div className="search-result-item">
                <a className="text-decoration-none" href="#">
                  <i className="fa fa-link"></i> برند شیانگ پینگ
                </a>
              </div>

              <div className="search-result-title">
                نتایج جستجو برای <span className="search-words">"موبایل شیا"</span>
                <span className="search-result-type">در کالاها</span>
              </div>
              <div className="search-result-item">
                <span className="search-no-result">موردی یافت نشد</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 mt-md-auto text-end">
          <div className="d-inline px-md-3">
            <button
              className="btn btn-link text-decoration-none text-dark dropdown-toggle profile-button"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fa fa-user"></i>
            </button>
            <div
              className="dropdown-menu dropdown-menu-end custom-drop-down"
              ariaLabelledBy="dropdownMenuButton1"
            >
              <div>
                <a className="dropdown-item" href="my-profile.html">
                  <i className="fa fa-user-circle"></i>پروفایل کاربری
                </a>
              </div>
              <div>
                <a className="dropdown-item" href="my-orders.html">
                  <i className="fa fa-newspaper"></i>سفارشات
                </a>
              </div>
              <div>
                <a className="dropdown-item" href="my-favorites.html">
                  <i className="fa fa-heart"></i>لیست علاقه مندی
                </a>
              </div>
              <hr className="dropdown-divider" />
              <div>
                <a className="dropdown-item" href="#">
                  <i className="fa fa-sign-out-alt"></i>خروج
                </a>
              </div>
            </div>
          </div>
          <div className="header-cart d-inline ps-3 border-start position-relative">
            <a
              className="btn btn-link position-relative text-dark header-cart-link"
              href="/cart"
            >
              <i className="fa fa-shopping-cart"></i>{' '}
              <span
                style={{ top: '80%' }}
                className="position-absolute start-0 translate-middle badge rounded-pill bg-danger"
              >
                2
              </span>
            </a>
            <div className="header-cart-dropdown">
              <div className="border-bottom d-flex justify-content-between p-2">
                <span className="text-muted">2 کالا</span>
                <a className="text-decoration-none text-info" href="cart.html">
                  مشاهده سبد خرید
                </a>
              </div>
              <div className="header-cart-dropdown-body">
                <div className="header-cart-dropdown-body-item d-flex justify-content-start align-items-center">
                  <img
                    className="flex-shrink-1"
                    src="assets/images/products/1.jpg"
                    alt=""
                  />
                  <div className="w-100 text-truncate">
                    <a className="text-decoration-none text-dark" href="#">
                      کتاب اثر مرکب اثر دارن هاردی انتشارات معیار علم
                    </a>
                  </div>
                  <div className="flex-shrink-1">
                    <a className="text-muted text-decoration-none p-1" href="#">
                      <i className="fa fa-trash-alt"></i>
                    </a>
                  </div>
                </div>

                <div className="header-cart-dropdown-body-item d-flex justify-content-start align-items-center">
                  <img
                    className="flex-shrink-1"
                    src="assets/images/products/2.jpg"
                    alt=""
                  />
                  <div className="w-100 text-truncate">
                    <a className="text-decoration-none text-dark" href="#">
                      دستگاه آبمیوه‌گیری دنویر با کد 1016
                    </a>
                  </div>
                  <div className="flex-shrink-1">
                    <a className="text-muted text-decoration-none p-1" href="#">
                      <i className="fa fa-trash-alt"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="header-cart-dropdown-footer border-top d-flex justify-content-between align-items-center p-2">
                <div>
                  <div>مبلغ قابل پرداخت</div>
                  <div>1,326,000 تومان</div>
                </div>
                <div>
                  <a className="btn btn-danger btn-sm d-block" href="cart.html">
                    ثبت سفارش
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* end top-header logo, searchbox and cart */}

  {/* start menu */}
  <nav className="top-nav">
    <div className="container-xxl">
      <nav>
        <div className="d-none d-md-flex justify-content-md-start position-relative">
          <div className="super-navbar-item me-4">
            <div className="super-navbar-item-toggle">
              <i className="fa fa-bars me-1"></i>
              دسته‌بندی کالاها
            </div>
            <div className="sublist-wrapper position-absolute w-100">
              <div className="position-relative sublist-area">
                <div className="sublist-item">
                  <div className="sublist-item-toggle">کالای دیجیتال</div>
                  <div className="sublist-item-sublist">
                    <div className="sublist-item-sublist-wrapper d-flex justify-content-around align-items-center">
                      <div className="sublist-column col">
                        <a href="#" className="sub-category">
                          لوازم جانبی موبایل
                        </a>
                        <a href="#" className="sub-sub-category">
                          اسپیکر موبایل
                        </a>
                        <a href="#" className="sub-sub-category">
                          پاور بانک
                        </a>
                        <a href="#" className="sub-sub-category">
                          قاب موبایل
                        </a>
                        <a href="#" className="sub-sub-category">
                          هولدر نگهدارنده
                        </a>
                        <a href="#" className="sub-sub-category">
                          شارژر بیسیم
                        </a>
                        <a href="#" className="sub-sub-category">
                          انواع شارژر
                        </a>
                        <a href="#" className="sub-category">
                          گوشی موبایل
                        </a>
                        <a href="#" className="sub-sub-category">
                          سامسونگ
                        </a>
                        <a href="#" className="sub-sub-category">
                          هوآوی
                        </a>
                        <a href="#" className="sub-sub-category">
                          اپل
                        </a>
                        <a href="#" className="sub-sub-category">
                          آنر
                        </a>
                        <a href="#" className="sub-sub-category">
                          نوکیا
                        </a>
                        <a href="#" className="sub-category">
                          واقعیت مجازی
                        </a>
                        <a href="#" className="sub-category">
                          مچ‌بند هوشمند
                        </a>
                      </div>
                      {/* سایر ستون‌های دسته‌بندی مشابه */}
                    </div>
                  </div>
                </div>
                {/* سایر آیتم‌های دسته‌بندی مشابه */}
              </div>
            </div>
          </div>
          <div className="border-start my-2 mx-1"></div>
          <div className="navbar-item"><a href="#">سوپرمارکت</a></div>
          <div className="navbar-item"><a href="#">تخفیف‌ها و پیشنهادها</a></div>
          <div className="navbar-item"><a href="#">آمازون من</a></div>
          <div className="navbar-item"><a href="#">آمازون پلاس</a></div>
          <div className="navbar-item"><a href="#">درباره ما</a></div>
          <div className="navbar-item"><a href="#">فروشنده شوید</a></div>
          <div className="navbar-item"><a href="#">فرصت‌های شغلی</a></div>
        </div>

        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="offcanvasExample"
          ariaLabelledBy="offcanvasExampleLabel"
          style={{ zIndex: 9999999 }}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasExampleLabel">
              <a className="text-decoration-none" href="index.html">
                <img src="assets/images/logo/8.png" alt="logo" />
              </a>
            </h5>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>
          <div className="offcanvas-body">
            <div className="navbar-item"><a href="#">سوپرمارکت</a></div>
            <div className="navbar-item"><a href="#">تخفیف‌ها و پیشنهادها</a></div>
            <div className="navbar-item"><a href="#">آمازون من</a></div>
            <div className="navbar-item"><a href="#">آمازون پلاس</a></div>
            <div className="navbar-item"><a href="#">درباره ما</a></div>
            <div className="navbar-item"><a href="#">فروشنده شوید</a></div>
            <div className="navbar-item"><a href="#">فرصت‌های شغلی</a></div>

            <hr className="border-bottom" />
            <div className="navbar-item"><a href="#">دسته‌بندی</a></div>

            <div className="sidebar-nav mt-2 px-3">
              <div className="sidebar-nav-item">
                <span className="sidebar-nav-item-title">
                  کالای دیجیتال <i className="fa fa-angle-left"></i>
                </span>
                <div className="sidebar-nav-sub-wrapper">
                  <div className="sidebar-nav-sub-item">
                    <span className="sidebar-nav-sub-item-title">
                      <a href="#">لوازم جانبی موبایل</a>
                      <i className="fa fa-angle-left"></i>
                    </span>
                    <div className="sidebar-nav-sub-sub-wrapper">
                      <div className="sidebar-nav-sub-sub-item">
                        <a href="#">هندزفری</a>
                      </div>
                      <div className="sidebar-nav-sub-sub-item">
                        <a href="#">هدست</a>
                      </div>
                      <div className="sidebar-nav-sub-sub-item">
                        <a href="#">اسپیکر موبایل</a>
                      </div>
                      <div className="sidebar-nav-sub-sub-item">
                        <a href="#">پاوربانک</a>
                      </div>
                      <div className="sidebar-nav-sub-sub-item">
                        <a href="#">هندزفری بیسیم</a>
                      </div>
                      <div className="sidebar-nav-sub-sub-item">
                        <a href="#">قاب موبایل</a>
                      </div>
                      <div className="sidebar-nav-sub-sub-item">
                        <a href="#">هولدر نگهدارنده</a>
                      </div>
                      <div className="sidebar-nav-sub-sub-item">
                        <a href="#">شارژر بیسیم</a>
                      </div>
                      <div className="sidebar-nav-sub-sub-item">
                        <a href="#">مونوپاد</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* سایر آیتم‌های منوی موبایل مشابه */}
            </div>
          </div>
        </div>
      </nav>
    </div>
  </nav>
</header>

    )

}
   

