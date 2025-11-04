import React from 'react';

function Product() {
  return (
    <section className="row">
      {/* start cart */}
      <section className="mb-4">
        <section className="container-xxl">
          <section className="row">
            <section className="col">
              {/* start content header */}
              <section className="content-header">
                <section className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>کتاب اثر مرکب نوشته دارن هاردی</span>
                  </h2>
                  <section className="content-header-link">
                    {/*<a href="#">مشاهده همه</a>*/}
                  </section>
                </section>
              </section>

              <section className="row mt-4">
                {/* start image gallery */}
                <section className="col-md-4">
                  <section className="content-wrapper bg-white p-3 rounded-2 mb-4">
                    <section className="product-gallery">
                      <section className="product-gallery-selected-image mb-3">
                        <img src="assets/images/single-product/1.jpg" alt="" />
                      </section>
                      <section className="product-gallery-thumbs">
                        <img
                          className="product-gallery-thumb"
                          src="assets/images/single-product/1.jpg"
                          alt=""
                          dataInput="assets/images/single-product/1.jpg"
                        />
                        <img
                          className="product-gallery-thumb"
                          src="assets/images/single-product/2.jpg"
                          alt=""
                          dataInput="assets/images/single-product/2.jpg"
                        />
                        <img
                          className="product-gallery-thumb"
                          src="assets/images/single-product/3.jpg"
                          alt=""
                          dataInput="assets/images/single-product/3.jpg"
                        />
                        <img
                          className="product-gallery-thumb"
                          src="assets/images/single-product/4.jpg"
                          alt=""
                          dataInput="assets/images/single-product/4.jpg"
                        />
                        <img
                          className="product-gallery-thumb"
                          src="assets/images/single-product/5.jpg"
                          alt=""
                          dataInput="assets/images/single-product/5.jpg"
                        />
                      </section>
                    </section>
                  </section>
                </section>
                {/* end image gallery */}

                {/* start product info */}
                <section className="col-md-5">
                  <section className="content-wrapper bg-white p-3 rounded-2 mb-4">
                    {/* start content header */}
                    <section className="content-header mb-3">
                      <section className="d-flex justify-content-between align-items-center">
                        <h2 className="content-header-title content-header-title-small">
                          کتاب اثر مرکب نوشته دارن هاردی
                        </h2>
                        <section className="content-header-link">
                          {/*<a href="#">مشاهده همه</a>*/}
                        </section>
                      </section>
                    </section>
                    <section className="product-info">
                      <p>
                        <span>رنگ : قهوه ای</span>
                      </p>
                      <p>
                        <span
                          style={{ backgroundColor: '#523e02' }}
                          className="product-info-colors me-1"
                          dataBsToggle="tooltip"
                          dataBsPlacement="bottom"
                          title="قهوه ای تیره"
                        ></span>
                        <span
                          style={{ backgroundColor: '#0c4128' }}
                          className="product-info-colors me-1"
                          dataBsToggle="tooltip"
                          dataBsPlacement="bottom"
                          title="سبز یشمی"
                        ></span>
                        <span
                          style={{ backgroundColor: '#fd7e14' }}
                          className="product-info-colors me-1"
                          dataBsToggle="tooltip"
                          dataBsPlacement="bottom"
                          title="نارنجی پرتقالی"
                        ></span>
                      </p>
                      <p>
                        <i className="fa fa-shield-alt cart-product-selected-warranty me-1"></i>{' '}
                        <span>گارانتی اصالت و سلامت فیزیکی کالا</span>
                      </p>
                      <p>
                        <i className="fa fa-store-alt cart-product-selected-store me-1"></i>{' '}
                        <span>کالا موجود در انبار</span>
                      </p>
                      <p>
                        <a className="btn btn-light btn-sm text-decoration-none" href="#">
                          <i className="fa fa-heart text-danger"></i> افزودن به علاقه مندی
                        </a>
                      </p>
                      <section>
                        <section className="cart-product-number d-inline-block">
                          <button className="cart-number-down" type="button">-</button>
                          <input
                            className=""
                            type="number"
                            min="1"
                            max="5"
                            step="1"
                            value="1"
                            readOnly
                          />
                          <button className="cart-number-up" type="button">+</button>
                        </section>
                      </section>
                      <p className="mb-3 mt-5">
                        <i className="fa fa-info-circle me-1"></i>
                        کاربر گرامی خرید شما هنوز نهایی نشده است. برای ثبت سفارش و تکمیل خرید باید ابتدا
                        آدرس خود را انتخاب کنید و سپس نحوه ارسال را انتخاب کنید. نحوه ارسال انتخابی شما
                        محاسبه و به این مبلغ اضافه شده خواهد شد. و در نهایت پرداخت این سفارش صورت
                        می‌گیرد. پس از ثبت سفارش کالا بر اساس نحوه ارسال که شما انتخاب کرده‌اید کالا برای
                        شما در مدت زمان مذکور ارسال می‌گردد.
                      </p>
                    </section>
                  </section>
                </section>
                {/* end product info */}

                <section className="col-md-3">
                  <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price">
                    <section className="d-flex justify-content-between align-items-center">
                      <p className="text-muted">قیمت کالا</p>
                      <p className="text-muted">
                        1,326,000 <span className="small">تومان</span>
                      </p>
                    </section>

                    <section className="d-flex justify-content-between align-items-center">
                      <p className="text-muted">تخفیف کالا</p>
                      <p className="text-danger fw-bolder">
                        260,000 <span className="small">تومان</span>
                      </p>
                    </section>

                    <section className="border-bottom mb-3"></section>

                    <section className="d-flex justify-content-end align-items-center">
                      <p className="fw-bolder">
                        1,066,000 <span className="small">تومان</span>
                      </p>
                    </section>

                    <section>
                      <a id="next-level" href="#" className="btn btn-danger d-block">
                        افزودن به سبد خرید
                      </a>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
      {/* end cart */}

      {/* start product lazy load */}
      <section className="mb-4">
        <section className="container-xxl">
          <section className="row">
            <section className="col">
              <section className="content-wrapper bg-white p-3 rounded-2">
                {/* start content header */}
                <section className="content-header">
                  <section className="d-flex justify-content-between align-items-center">
                    <h2 className="content-header-title">
                      <span>کالاهای مرتبط</span>
                    </h2>
                    <section className="content-header-link">
                      {/*<a href="#">مشاهده همه</a>*/}
                    </section>
                  </section>
                </section>
                {/* start content header */}
                <section className="lazyload-wrapper">
                  <section className="lazyload light-owl-nav owl-carousel owl-theme">
                    <section className="item">
                      <section className="lazyload-item-wrapper">
                        <section className="product">
                          <section className="product-add-to-cart">
                            <a
                              href="#"
                              dataBsToggle="tooltip"
                              dataBsPlacement="left"
                              title="افزودن به سبد خرید"
                            >
                              <i className="fa fa-cart-plus"></i>
                            </a>
                          </section>
                          <section className="product-add-to-favorite">
                            <a
                              href="#"
                              dataBsToggle="tooltip"
                              dataBsPlacement="left"
                              title="افزودن به علاقه مندی"
                            >
                              <i className="fa fa-heart"></i>
                            </a>
                          </section>
                          <a className="product-link" href="#">
                            <section className="product-image">
                              <img className="" src="assets/images/products/3.jpg" alt="" />
                            </section>
                            <section className="product-name">
                              <h3>پکیج آموزش خطاطی و خوشنویسی با کد 624</h3>
                            </section>
                            <section className="product-price-wrapper">
                              <section className="product-price">115,000 تومان</section>
                            </section>
                            <section className="product-colors">
                              <section
                                className="product-colors-item"
                                style={{ backgroundColor: 'yellow' }}
                              ></section>
                              <section
                                className="product-colors-item"
                                style={{ backgroundColor: 'green' }}
                              ></section>
                              <section
                                className="product-colors-item"
                                style={{ backgroundColor: 'white' }}
                              ></section>
                              <section
                                className="product-colors-item"
                                style={{ backgroundColor: 'blue' }}
                              ></section>
                              <section
                                className="product-colors-item"
                                style={{ backgroundColor: 'red' }}
                              ></section>
                            </section>
                          </a>
                        </section>
                      </section>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
      {/* end product lazy load */}

      {/* start description, features and comments */}
      <section className="mb-4">
        <section className="container-xxl">
          <section className="row">
            <section className="col">
              <section className="content-wrapper bg-white p-3 rounded-2">
                {/* start content header */}
                <section id="introduction-features-comments" className="introduction-features-comments">
                  <section className="content-header">
                    <section className="d-flex justify-content-between align-items-center">
                      <h2 className="content-header-title">
                        <span className="me-2">
                          <a className="text-decoration-none text-dark" href="#introduction">
                            معرفی
                          </a>
                        </span>
                        <span className="me-2">
                          <a className="text-decoration-none text-dark" href="#features">
                            ویژگی‌ها
                          </a>
                        </span>
                        <span className="me-2">
                          <a className="text-decoration-none text-dark" href="#comments">
                            دیدگاه‌ها
                          </a>
                        </span>
                      </h2>
                      <section className="content-header-link">
                        {/*<a href="#">مشاهده همه</a>*/}
                      </section>
                    </section>
                  </section>
                </section>
                {/* start content header */}

                <section className="py-4">
                  {/* start content header */}
                  <section id="introduction" className="content-header mt-2 mb-4">
                    <section className="d-flex justify-content-between align-items-center">
                      <h2 className="content-header-title content-header-title-small">معرفی</h2>
                      <section className="content-header-link">
                        {/*<a href="#">مشاهده همه</a>*/}
                      </section>
                    </section>
                  </section>
                  <section className="product-introduction mb-4">
                    خلاصه کتاب اثر مرکب «انتخاب‌های شما تنها زمانی معنی دار است که آنها را به دلخواه به
                    رؤیاهای خود متصل کنید. انتخاب‌های شایسته و انگیزشی، همان‌هایی هستند که شما به عنوان
                    هدف خود و هسته اصلی زندگی خود در بالاترین ارزش‌های خود تعین می‌کنید. شما باید چیزی
                    را بخواهید و می‌دانید که چرا شما آن را می‌خواهید یا به راحتی می‌توانید آن از دست
                    بدهید.» «اولین گام در جهت تغییر، آگاهی است. اگر می‌خواهید از جایی که هستید به جایی که
                    می‌خواهید بروید، باید با درک انتخاب‌هایی که شما را از مقصد مورد نظر خود دور
                    می‌کنند، شروع کنید.» «فرمول کامل برای به دست آوردن خوش شانسی: آماده‌سازی (رشد شخصی) +
                    نگرش (باور / ذهنیت) + فرصت (چیز خوبی که راه را هموار می‌کند) + اقدام (انجام کاری در
                    مورد نظر) = شانس» «ما همه می‌توانیم انتخاب‌های بسیار خوبی داشته باشیم. ما می‌توانیم
                    همه چیز را کنترل کنیم. این در توانایی ماست که همه چیز را تغییر دهیم. به جای اینکه
                    غرق در گذشته شویم، باید دوباره انرژی خود را جمع کنیم، می‌توانیم از تجربیات گذشته برای
                    حرکت‌های مثبت و سازنده استفاده کنیم.» برای ایجاد تغییر، ما نیاز به این داریم که عادات
                    و رفتار خوب را ایجاد کنیم، که در کتاب از آن به عنوان تکانش یاد می‌شود. تکانش بدین
                    معنی که با ریتم منظم و دائمی و ثبات قدم همراه باشید. حرکت‌های افراطی و تفریطی، موضع
                    ‌های عجله‌ای و جوگیر شدن و عدم ریتم مناسب موجب خواهد شد که ثبات قدم نداشته باشیم و
                    حتی شاید از مسیر اصلی دور شویم و تکانش ما با لرزه‌های فراوان و یا حتی سکون و سکوت
                    مواجه شود. واقعیت رهرو آن است که آهسته و پیوسته رود اینجا پدیدار می‌گردد و باید
                    همیشه بدانیم هیچ چیز مثل عدم ثبات قدم و نداشتن ریتم مناسب در زمان تغییر، نمی‌تواند
                    تکانش را با مشکل مواجه کند! متن بالا شاید بهترین خلاصه‌ای باشد که می‌شود از کتاب
                    نوشت!
                  </section>

                  {/* start content header */}
                  <section id="features" className="content-header mt-2 mb-4">
                    <section className="d-flex justify-content-between align-items-center">
                      <h2 className="content-header-title content-header-title-small">ویژگی‌ها</h2>
                      <section className="content-header-link">
                        {/*<a href="#">مشاهده همه</a>*/}
                      </section>
                    </section>
                  </section>
                  <section className="product-features mb-4 table-responsive">
                    <table className="table table-bordered border-white">
                      <tbody>
                        <tr>
                          <td>وزن</td>
                          <td>220 گرم</td>
                        </tr>
                        <tr>
                          <td>قطع</td>
                          <td>رقعی</td>
                        </tr>
                        <tr>
                          <td>تعداد صفحات</td>
                          <td>173 صفحه</td>
                        </tr>
                        <tr>
                          <td>نوع جلد</td>
                          <td>شومیز</td>
                        </tr>
                        <tr>
                          <td>نویسنده/نویسندگان</td>
                          <td>دارن هاردی</td>
                        </tr>
                        <tr>
                          <td>مترجم</td>
                          <td>ناهید محمدی</td>
                        </tr>
                        <tr>
                          <td>ناشر</td>
                          <td>انتشارات نگین ایران</td>
                        </tr>
                        <tr>
                          <td>رده‌بندی کتاب</td>
                          <td>روان‌شناسی (فلسفه و روان‌شناسی)</td>
                        </tr>
                        <tr>
                          <td>شابک</td>
                          <td>9786227195132</td>
                        </tr>
                        <tr>
                          <td>سایر توضیحات</td>
                          <td>چهار صفحه اول رنگی</td>
                        </tr>
                      </tbody>
                    </table>
                  </section>

                  {/* start content header */}
                  <section id="comments" className="content-header mt-2 mb-4">
                    <section className="d-flex justify-content-between align-items-center">
                      <h2 className="content-header-title content-header-title-small">دیدگاه‌ها</h2>
                      <section className="content-header-link">
                        {/*<a href="#">مشاهده همه</a>*/}
                      </section>
                    </section>
                  </section>
                  <section className="product-comments mb-4">
                    <section className="comment-add-wrapper">
                      <button
                        className="comment-add-button"
                        type="button"
                        dataBsToggle="modal"
                        dataBsTarget="#add-comment"
                      >
                        <i className="fa fa-plus"></i> افزودن دیدگاه
                      </button>
                      {/* start add comment Modal */}
                      <section
                        className="modal fade"
                        id="add-comment"
                        tabIndex="-1"
                        aria-labelledby="add-comment-label"
                        aria-hidden="true"
                      >
                        <section className="modal-dialog">
                          <section className="modal-content">
                            <section className="modal-header">
                              <h5 className="modal-title" id="add-comment-label">
                                <i className="fa fa-plus"></i> افزودن دیدگاه
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                dataBsDismiss="modal"
                                aria-label="Close"
                              ></button>
                            </section>
                            <section className="modal-body">
                              <form className="row" action="#">
                                <section className="col-6 mb-2">
                                  <label htmlFor="first_name" className="form-label mb-1">
                                    نام
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="first_name"
                                    placeholder="نام ..."
                                  />
                                </section>

                                <section className="col-6 mb-2">
                                  <label htmlFor="last_name" className="form-label mb-1">
                                    نام خانوادگی
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="last_name"
                                    placeholder="نام خانوادگی ..."
                                  />
                                </section>

                                <section className="col-12 mb-2">
                                  <label htmlFor="comment" className="form-label mb-1">
                                    دیدگاه شما
                                  </label>
                                  <textarea
                                    className="form-control form-control-sm"
                                    id="comment"
                                    placeholder="دیدگاه شما ..."
                                    rows="4"
                                  ></textarea>
                                </section>
                              </form>
                            </section>
                            <section className="modal-footer py-1">
                              <button type="button" className="btn btn-sm btn-primary">
                                ثبت دیدگاه
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                dataBsDismiss="modal"
                              >
                                بستن
                              </button>
                            </section>
                          </section>
                        </section>
                      </section>
                    </section>

                    <section className="product-comment">
                      <section className="product-comment-header d-flex justify-content-start">
                        <section className="product-comment-date">۲۱ مرداد ۱۴۰۰</section>
                        <section className="product-comment-title">مجتبی مجدی</section>
                      </section>
                      <section className="product-comment-body">با این تخفیف قیمت خیلی خوبه</section>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
      {/* end description, features and comments */}
    </section>
  );
}

export default Product;