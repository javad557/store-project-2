
function ChooseAddressAndDelivery(){
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
                <span>تکمیل اطلاعات ارسال کالا (آدرس گیرنده، مشخصات گیرنده، نحوه ارسال)</span>
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
                      انتخاب آدرس و مشخصات گیرنده
                    </h2>
                    <section className="content-header-link">
                      {/*<a href="#">مشاهده همه</a>*/}
                    </section>
                  </section>
                </section>

                <section
                  className="address-alert alert alert-primary d-flex align-items-center p-2"
                  role="alert"
                >
                  <i className="fa fa-info-circle flex-shrink-0 me-2"></i>
                  <section>
                    پس از ایجاد آدرس، آدرس را انتخاب کنید.
                  </section>
                </section>

                <section className="address-select">
                  <input type="radio" name="address" value="1" id="a1" />
                  <label htmlFor="a1" className="address-wrapper mb-2 p-2">
                    <section className="mb-2">
                      <i className="fa fa-map-marker-alt mx-1"></i>
                      آدرس: استان تهران، شهر تهران، تهران، خ. حافظ، پایین‌تر از تقاطع امام خمینی، بن‌بست هاشمی، پلاک 3، واحد 4
                    </section>
                    <section className="mb-2">
                      <i className="fa fa-user-tag mx-1"></i>
                      گیرنده: کامران محمدی
                    </section>
                    <section className="mb-2">
                      <i className="fa fa-mobile-alt mx-1"></i>
                      موبایل گیرنده: 09129998877
                    </section>
                    <a className="" href="#">
                      <i className="fa fa-edit"></i> ویرایش آدرس
                    </a>
                    <span className="address-selected">کالاها به این آدرس ارسال می‌شوند</span>
                  </label>

                  <input type="radio" name="address" value="2" id="a2" />
                  <label htmlFor="a2" className="address-wrapper mb-2 p-2">
                    <section className="mb-2">
                      <i className="fa fa-map-marker-alt mx-1"></i>
                      آدرس: استان تهران، شهر تهران، تهران، خ. پاسداران، کوچه غلامی، پلاک 18، واحد 13
                    </section>
                    <section className="mb-2">
                      <i className="fa fa-user-tag mx-1"></i>
                      گیرنده: کامران محمدی
                    </section>
                    <section className="mb-2">
                      <i className="fa fa-mobile-alt mx-1"></i>
                      موبایل گیرنده: 09129998877
                    </section>
                    <a className="" href="#">
                      <i className="fa fa-edit"></i> ویرایش آدرس
                    </a>
                    <span className="address-selected">کالاها به این آدرس ارسال می‌شوند</span>
                  </label>

                  <section className="address-add-wrapper">
                    <button
                      className="address-add-button"
                      type="button"
                      dataBsToggle="modal"
                      dataBsTarget="#add-address"
                    >
                      <i className="fa fa-plus"></i> ایجاد آدرس جدید
                    </button>
                    {/* start add address Modal */}
                    <section
                      className="modal fade"
                      id="add-address"
                      tabIndex="-1"
                      aria-labelledby="add-address-label"
                      aria-hidden="true"
                    >
                      <section className="modal-dialog">
                        <section className="modal-content">
                          <section className="modal-header">
                            <h5 className="modal-title" id="add-address-label">
                              <i className="fa fa-plus"></i> ایجاد آدرس جدید
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
                                <label htmlFor="province" className="form-label mb-1">
                                  استان
                                </label>
                                <select className="form-select form-select-sm" id="province">
                                  <option selected>استان را انتخاب کنید</option>
                                  <option value="1">آذربایجان شرقی</option>
                                  <option value="2">آذربایجان غربی</option>
                                  <option value="3">تهران</option>
                                </select>
                              </section>

                              <section className="col-6 mb-2">
                                <label htmlFor="city" className="form-label mb-1">
                                  شهر
                                </label>
                                <select className="form-select form-select-sm" id="city">
                                  <option selected>شهر را انتخاب کنید</option>
                                  <option value="1">تبریز</option>
                                  <option value="2">میانه</option>
                                  <option value="3">آذرشهر</option>
                                </select>
                              </section>
                              <section className="col-12 mb-2">
                                <label htmlFor="address" className="form-label mb-1">
                                  نشانی
                                </label>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  id="address"
                                  placeholder="نشانی"
                                />
                              </section>

                              <section className="col-6 mb-2">
                                <label htmlFor="postal_code" className="form-label mb-1">
                                  کد پستی
                                </label>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  id="postal_code"
                                  placeholder="کد پستی"
                                />
                              </section>

                              <section className="col-3 mb-2">
                                <label htmlFor="no" className="form-label mb-1">
                                  پلاک
                                </label>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  id="no"
                                  placeholder="پلاک"
                                />
                              </section>

                              <section className="col-3 mb-2">
                                <label htmlFor="unit" className="form-label mb-1">
                                  واحد
                                </label>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  id="unit"
                                  placeholder="واحد"
                                />
                              </section>

                              <section className="border-bottom mt-2 mb-3"></section>

                              <section className="col-12 mb-2">
                                <section className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="receiver"
                                  />
                                  <label className="form-check-label" htmlFor="receiver">
                                    گیرنده سفارش خودم هستم
                                  </label>
                                </section>
                              </section>

                              <section className="col-6 mb-2">
                                <label htmlFor="first_name" className="form-label mb-1">
                                  نام گیرنده
                                </label>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  id="first_name"
                                  placeholder="نام گیرنده"
                                />
                              </section>

                              <section className="col-6 mb-2">
                                <label htmlFor="last_name" className="form-label mb-1">
                                  نام خانوادگی گیرنده
                                </label>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  id="last_name"
                                  placeholder="نام خانوادگی گیرنده"
                                />
                              </section>

                              <section className="col-6 mb-2">
                                <label htmlFor="mobile" className="form-label mb-1">
                                  شماره موبایل
                                </label>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  id="mobile"
                                  placeholder="شماره موبایل"
                                />
                              </section>
                            </form>
                          </section>
                          <section className="modal-footer py-1">
                            <button type="button" className="btn btn-sm btn-primary">
                              ثبت آدرس
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
                    {/* end add address Modal */}
                  </section>
                </section>
              </section>

              <section className="content-wrapper bg-white p-3 rounded-2 mb-4">
                {/* start content header */}
                <section className="content-header mb-3">
                  <section className="d-flex justify-content-between align-items-center">
                    <h2 className="content-header-title content-header-title-small">
                      انتخاب نحوه ارسال
                    </h2>
                    <section className="content-header-link">
                      {/*<a href="#">مشاهده همه</a>*/}
                    </section>
                  </section>
                </section>
                <section className="delivery-select">
                  <section
                    className="address-alert alert alert-primary d-flex align-items-center p-2"
                    role="alert"
                  >
                    <i className="fa fa-info-circle flex-shrink-0 me-2"></i>
                    <section>
                      نحوه ارسال کالا را انتخاب کنید. هنگام انتخاب لطفاً مدت زمان ارسال را در نظر
                      بگیرید.
                    </section>
                  </section>

                  <input type="radio" name="delivery_type" value="1" id="d1" />
                  <label htmlFor="d1" className="col-12 col-md-4 delivery-wrapper mb-2 pt-2">
                    <section className="mb-2">
                      <i className="fa fa-shipping-fast mx-1"></i>
                      پست پیشتاز
                    </section>
                    <section className="mb-2">
                      <i className="fa fa-calendar-alt mx-1"></i>
                      تامین کالا از 4 روز کاری آینده
                    </section>
                  </label>

                  <input type="radio" name="delivery_type" value="2" id="d2" />
                  <label htmlFor="d2" className="col-12 col-md-4 delivery-wrapper mb-2 pt-2">
                    <section className="mb-2">
                      <i className="fa fa-shipping-fast mx-1"></i>
                      تیپاکس
                    </section>
                    <section className="mb-2">
                      <i className="fa fa-calendar-alt mx-1"></i>
                      تامین کالا از 2 روز کاری آینده
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

                <p className="my-3">
                  <i className="fa fa-info-circle me-1"></i> کاربر گرامی کالاها بر اساس نوع ارسالی که
                  انتخاب می‌کنید در مدت زمان ذکر شده ارسال می‌شود.
                </p>

                <section className="border-bottom mb-3"></section>

                <section className="d-flex justify-content-between align-items-center">
                  <p className="text-muted">مبلغ قابل پرداخت</p>
                  <p className="fw-bold">374,000 تومان</p>
                </section>

                <section>
                  <section
                    id="address-button"
                    className="text-warning border border-warning text-center py-2 pointer rounded-2 d-block"
                  >
                    آدرس و نحوه ارسال را انتخاب کن
                  </section>
                  <a id="next-level" href="payment.html" className="btn btn-danger d-none">
                    ادامه فرآیند خرید
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

export default ChooseAddressAndDelivery;