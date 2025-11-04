import { Link } from "react-router-dom";

function ProfileComplition(){
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
                <span>تکمیل اطلاعات حساب کاربری</span>
              </h2>
              <section className="content-header-link">
                {/*<a href="#">مشاهده همه</a>*/}
              </section>
            </section>
          </section>

          <section className="row mt-4">
            <section className="col-md-9">
              <form
                id="profile_completion"
                action=""
                className="content-wrapper bg-white p-3 rounded-2 mb-4"
              >
                <section
                  className="payment-alert alert alert-primary d-flex align-items-center p-2"
                  role="alert"
                >
                  <i className="fa fa-info-circle flex-shrink-0 me-2"></i>
                  <section>
                    اطلاعات حساب کاربری خود را (فقط یک بار، برای همیشه) وارد کنید.
                    از این پس کالاها برای شخصی با این مشخصات ارسال می‌شود.
                  </section>
                </section>

                <section className="row pb-3">
                  <section className="col-12 col-md-6 my-2">
                    <div className="form-group">
                      <label htmlFor="first_name">نام</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="first_name"
                        id="first_name"
                      />
                    </div>
                  </section>

                  <section className="col-12 col-md-6 my-2">
                    <div className="form-group">
                      <label htmlFor="last_name">نام خانوادگی</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="last_name"
                        id="last_name"
                      />
                    </div>
                  </section>

                  <section className="col-12 col-md-6 my-2">
                    <div className="form-group">
                      <label htmlFor="mobile">موبایل (اختیاری)</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="mobile"
                        id="mobile"
                      />
                    </div>
                  </section>

                  <section className="col-12 col-md-6 my-2">
                    <div className="form-group">
                      <label htmlFor="email">ایمیل (اختیاری)</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="email"
                        id="email"
                      />
                    </div>
                  </section>

                  <section className="col-12 col-md-6 my-2">
                    <div className="form-group">
                      <label htmlFor="national_code">کد ملی</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="national_code"
                        id="national_code"
                      />
                    </div>
                  </section>
                </section>
              </form>
            </section>
            <section className="col-md-3">
              <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price">
                <section className="d-flex justify-content-between align-items-center">
                  <p className="text-muted">کالاها</p>
                  <p className="text-muted" id="total_product_price">
                    تومان
                  </p>
                </section>

                <section className="d-flex justify-content-between align-items-center">
                  <p className="text-muted">تخفیف کالاها</p>
                  <p className="text-danger fw-bolder" id="total_discount">
                    تومان
                  </p>
                </section>
                <section className="border-bottom mb-3"></section>
                <section className="d-flex justify-content-between align-items-center">
                  <p className="text-muted">جمع سبد خرید</p>
                  <p className="fw-bolder" id="total_price">
                    تومان
                  </p>
                </section>

                <p className="my-3">
                  <i className="fa fa-info-circle me-1"></i>کاربر گرامی خرید شما هنوز
                  نهایی نشده است. برای ثبت سفارش و تکمیل خرید باید ابتدا آدرس خود را
                  انتخاب کنید و سپس نحوه ارسال را انتخاب کنید. نحوه ارسال انتخابی شما
                  محاسبه و به این مبلغ اضافه شده خواهد شد. و در نهایت پرداخت این سفارش
                  صورت می‌گیرد.
                </p>

                <section>
                  <Link to={`/main/cart/payment`} type="button" className="btn btn-danger d-block w-100">
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
</section>
    )
}

export default ProfileComplition;