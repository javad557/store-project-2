import { Link } from "react-router-dom";

function Cart(){
    return(
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
                <span>سبد خرید شما</span>
              </h2>
              <section className="content-header-link">
                {/*<a href="#">مشاهده همه</a>*/}
              </section>
            </section>
          </section>

          <section className="row mt-4">
            <section className="col-md-9 mb-3">
              <section className="content-wrapper bg-white p-3 rounded-2">
                <section className="cart-item d-md-flex py-3">
                  <section className="cart-img align-self-start flex-shrink-1">
                    <img src="assets/images/products/1.jpg" alt="" />
                  </section>
                  <section className="align-self-start w-100">
                    <p className="fw-bold">کتاب اثر مرکب نوشته دارن هاردی</p>
                    <p>
                      <span
                        style={{ backgroundColor: '#523e02' }}
                        className="cart-product-selected-color me-1"
                      ></span>{' '}
                      <span>قهوه‌ای</span>
                    </p>
                    <p>
                      <i className="fa fa-shield-alt cart-product-selected-warranty me-1"></i>{' '}
                      <span>گارانتی اصالت و سلامت فیزیکی کالا</span>
                    </p>
                    <p>
                      <i className="fa fa-store-alt cart-product-selected-store me-1"></i>{' '}
                      <span>کالا موجود در انبار</span>
                    </p>
                    <section>
                      <section className="cart-product-number d-inline-block">
                        <button className="cart-number-down" type="button">
                          -
                        </button>
                        <input
                          className=""
                          type="number"
                          min="1"
                          max="5"
                          step="1"
                          value="1"
                          readOnly
                        />
                        <button className="cart-number-up" type="button">
                          +
                        </button>
                      </section>
                      <a className="text-decoration-none ms-4 cart-delete" href="#">
                        <i className="fa fa-trash-alt"></i> حذف از سبد
                      </a>
                    </section>
                  </section>
                  <section className="align-self-end flex-shrink-1">
                    <section className="text-nowrap fw-bold">56,000 تومان</section>
                  </section>
                </section>

                <section className="cart-item d-md-flex py-3">
                  <section className="cart-img align-self-start flex-shrink-1">
                    <img src="assets/images/products/2.jpg" alt="" />
                  </section>
                  <section className="align-self-start w-100">
                    <p className="fw-bold">دستگاه آبمیوه‌گیری دنویر با کد 1016</p>
                    <p>
                      <span
                        style={{ backgroundColor: '#523e02' }}
                        className="cart-product-selected-color me-1"
                      ></span>{' '}
                      <span>قهوه‌ای</span>
                    </p>
                    <p>
                      <i className="fa fa-shield-alt cart-product-selected-warranty me-1"></i>{' '}
                      <span>گارانتی اصالت و سلامت فیزیکی کالا</span>
                    </p>
                    <p>
                      <i className="fa fa-store-alt cart-product-selected-store me-1"></i>{' '}
                      <span>کالا موجود در انبار</span>
                    </p>
                    <section>
                      <section className="cart-product-number d-inline-block">
                        <button className="cart-number-down" type="button">
                          -
                        </button>
                        <input
                          className=""
                          type="number"
                          min="1"
                          max="5"
                          step="1"
                          value="1"
                          readOnly
                        />
                        <button className="cart-number-up" type="button">
                          +
                        </button>
                      </section>
                      <a className="text-decoration-none ms-4 cart-delete" href="#">
                        <i className="fa fa-trash-alt"></i> حذف از سبد
                      </a>
                    </section>
                  </section>
                  <section className="align-self-end flex-shrink-1">
                    <section className="cart-item-discount text-danger text-nowrap mb-1">
                      تخفیف 78,000
                    </section>
                    <section className="text-nowrap fw-bold">264,000 تومان</section>
                  </section>
                </section>
              </section>
            </section>
            <section className="col-md-3">
              <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price">
                <section className="d-flex justify-content-between align-items-center">
                  <p className="text-muted">قیمت کالاها (2)</p>
                  <p className="text-muted">398,000 تومان</p>
                </section>

                <section className="d-flex justify-content-between align-items-center">
                  <p className="text-muted">تخفیف کالاها</p>
                  <p className="text-danger fw-bolder">78,000 تومان</p>
                </section>
                <section className="border-bottom mb-3"></section>
                <section className="d-flex justify-content-between align-items-center">
                  <p className="text-muted">جمع سبد خرید</p>
                  <p className="fw-bolder">320,000 تومان</p>
                </section>

                <p className="my-3">
                  <i className="fa fa-info-circle me-1"></i>کاربر گرامی خرید شما هنوز نهایی
                  نشده است. برای ثبت سفارش و تکمیل خرید باید ابتدا آدرس خود را انتخاب کنید و
                  سپس نحوه ارسال را انتخاب کنید. نحوه ارسال انتخابی شما محاسبه و به این مبلغ
                  اضافه شده خواهد شد. و در نهایت پرداخت این سفارش صورت می‌گیرد.
                </p>

                <section>
                  <Link to={`/main/cart/profilecomplition`} className="btn btn-danger d-block">
                    تکمیل فرآیند خرید
                  </Link>
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
    </section>
  </section>
  {/* end cart */}

  <section className="mb-4">
    <section className="container-xxl">
      <section className="row">
        <section className="col">
          <section className="content-wrapper bg-white p-3 rounded-2">
            {/* start content header */}
            <section className="content-header">
              <section className="d-flex justify-content-between align-items-center">
                <h2 className="content-header-title">
                  <span>کالاهای مرتبط با سبد خرید شما</span>
                </h2>
                <section className="content-header-link">
                  {/*<a href="#">مشاهده همه</a>*/}
                </section>
              </section>
            </section>
            {/* end content header */}
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
                          title="افزودن به علاقه‌مندی"
                        >
                          <i className="fa fa-heart"></i>
                        </a>
                      </section>
                      <a className="product-link" href="#">
                        <section className="product-image">
                          <img className="" src="assets/images/products/5.jpg" alt="" />
                        </section>
                        <section className="product-colors"></section>
                        <section className="product-name">
                          <h3>کتاب اطلاعات عمومی انتشارات فارابی با کد 3087</h3>
                        </section>
                        <section className="product-price-wrapper">
                          <section className="product-price">870,000 تومان</section>
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
</section>
    )
}

export default Cart;