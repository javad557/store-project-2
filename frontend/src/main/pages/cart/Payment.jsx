

function Payment(){
    return(
        <section className="row">
  <section className="mb-4">
    <section className="container-xxl">
      <section className="row">
        <section className="col">
          {/* start content header */}
          <section className="content-header">
            <section className="d-flex justify-content-between align-items-center">
              <h2 className="content-header-title">
                <span>انتخاب نوع پرداخت</span>
              </h2>
              <section className="content-header-link">
                {/*<a href="#">مشاهده همه</a>*/}
              </section>
            </section>
          </section>

          <section className="row mt-4">
            <section className="col-md-9">
              <section className="content-wrapper bg-white p-3 rounded-2 mb-4">
                {/* start content header */}
                <section className="content-header mb-3">
                  <section className="d-flex justify-content-between align-items-center">
                    <h2 className="content-header-title content-header-title-small">
                      کد تخفیف
                    </h2>
                    <section className="content-header-link">
                      {/*<a href="#">مشاهده همه</a>*/}
                    </section>
                  </section>
                </section>

                <section
                  className="payment-alert alert alert-primary d-flex align-items-center p-2"
                  role="alert"
                >
                  <i className="fa fa-info-circle flex-shrink-0 me-2"></i>
                  <section>کد تخفیف خود را در این بخش وارد کنید.</section>
                </section>

                <section className="row">
                  <section className="col-md-5">
                    <section className="input-group input-group-sm">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="کد تخفیف را وارد کنید"
                        id="discount_code"
                        name="discount_code"
                      />
                      <button className="btn btn-primary" type="button">
                        اعمال کد
                      </button>
                    </section>
                  </section>
                </section>
              </section>

              <section className="content-wrapper bg-white p-3 rounded-2 mb-4">
                {/* start content header */}
                <section className="content-header mb-3">
                  <section className="d-flex justify-content-between align-items-center">
                    <h2 className="content-header-title content-header-title-small">
                      انتخاب نوع پرداخت
                    </h2>
                    <section className="content-header-link">
                      {/*<a href="#">مشاهده همه</a>*/}
                    </section>
                  </section>
                </section>
                <section className="payment-select">
                  <section
                    className="payment-alert alert alert-primary d-flex align-items-center p-2"
                    role="alert"
                  >
                    <i className="fa fa-info-circle flex-shrink-0 me-2"></i>
                    <section>
                      برای پیشگیری از انتقال ویروس کرونا پیشنهاد می‌کنیم روش پرداخت اینترنتی را انتخاب
                      کنید.
                    </section>
                  </section>

                  <input type="radio" name="payment_type" value="1" id="d1" />
                  <label htmlFor="d1" className="col-12 col-md-4 payment-wrapper mb-2 pt-2">
                    <section className="mb-2">
                      <i className="fa fa-credit-card mx-1"></i>
                      پرداخت آنلاین
                    </section>
                    <section className="mb-2">
                      <i className="fa fa-calendar-alt mx-1"></i>
                      درگاه پرداخت زرین‌پال
                    </section>
                  </label>

                  <section className="mb-2"></section>

                  <input type="radio" name="payment_type" value="2" id="d2" />
                  <label htmlFor="d2" className="col-12 col-md-4 payment-wrapper mb-2 pt-2">
                    <section className="mb-2">
                      <i className="fa fa-id-card-alt mx-1"></i>
                      پرداخت آفلاین
                    </section>
                    <section className="mb-2">
                      <i className="fa fa-calendar-alt mx-1"></i>
                      حداکثر در 2 روز کاری بررسی می‌شود
                    </section>
                  </label>

                  <section className="mb-2"></section>

                  <input type="radio" name="payment_type" value="3" id="d3" />
                  <label htmlFor="d3" className="col-12 col-md-4 payment-wrapper mb-2 pt-2">
                    <section className="mb-2">
                      <i className="fa fa-money-check mx-1"></i>
                      پرداخت در محل
                    </section>
                    <section className="mb-2">
                      <i className="fa fa-calendar-alt mx-1"></i>
                      پرداخت به پیک هنگام دریافت کالا
                    </section>
                  </label>
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

                <section className="d-flex justify-content-between align-items-center">
                  <p className="text-muted">هزینه ارسال</p>
                  <p className="text-warning">54,000 تومان</p>
                </section>

                <section className="d-flex justify-content-between align-items-center">
                  <p className="text-muted">تخفیف اعمال شده</p>
                  <p className="text-danger">100,000 تومان</p>
                </section>

                <p className="my-3">
                  <i className="fa fa-info-circle me-1"></i> کاربر گرامی کالاها بر اساس نوع ارسالی که
                  انتخاب می‌کنید در مدت زمان ذکر شده ارسال می‌شود.
                </p>

                <section className="border-bottom mb-3"></section>

                <section className="d-flex justify-content-between align-items-center">
                  <p className="text-muted">مبلغ قابل پرداخت</p>
                  <p className="fw-bold">274,000 تومان</p>
                </section>

                <section>
                  <section
                    id="payment-button"
                    className="text-warning border border-warning text-center py-2 pointer rounded-2 d-block"
                  >
                    نوع پرداخت را انتخاب کن
                  </section>
                  <a id="final-level" href="my-orders.html" className="btn btn-danger d-none">
                    ثبت سفارش و گرفتن کد رهگیری
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
    )
}

export default Payment;