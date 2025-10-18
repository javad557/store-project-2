function Home() {
  return (
    <>
      <section className="container-xxl my-4">
        <div className="row">
          <div className="col-md-8 pe-md-1">
            <div id="slideshow" className="owl-carousel owl-theme">
              <div className="item">
                <a className="w-100 d-block h-auto text-decoration-none" href="/slide/1">
                  <img className="w-100 rounded-2 d-block h-auto" src="assets/images/slideshow/1.jpg" alt="اسلاید 1" />
                </a>
              </div>
              <div className="item">
                <a className="w-100 d-block h-auto text-decoration-none" href="/slide/2">
                  <img className="w-100 rounded-2 d-block h-auto" src="assets/images/slideshow/2.jpg" alt="اسلاید 2" />
                </a>
              </div>
              <div className="item">
                <a className="w-100 d-block h-auto text-decoration-none" href="/slide/3">
                  <img className="w-100 rounded-2 d-block h-auto" src="assets/images/slideshow/3.jpg" alt="اسلاید 3" />
                </a>
              </div>
              <div className="item">
                <a className="w-100 d-block h-auto text-decoration-none" href="/slide/4">
                  <img className="w-100 rounded-2 d-block h-auto" src="assets/images/slideshow/4.jpg" alt="اسلاید 4" />
                </a>
              </div>
              <div className="item">
                <a className="w-100 d-block h-auto text-decoration-none" href="/slide/5">
                  <img className="w-100 rounded-2 d-block h-auto" src="assets/images/slideshow/5.jpg" alt="اسلاید 5" />
                </a>
              </div>
              <div className="item">
                <a className="w-100 d-block h-auto text-decoration-none" href="/slide/6">
                  <img className="w-100 rounded-2 d-block h-auto" src="assets/images/slideshow/6.gif" alt="اسلاید 6" />
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4 ps-md-1 mt-2 mt-md-0">
            <div className="mb-2">
              <a href="/slide/12" className="d-block">
                <img className="w-100 rounded-2" src="assets/images/slideshow/12.gif" alt="اسلاید 12" />
              </a>
            </div>
            <div className="mb-2">
              <a href="/brand/xvision" className="d-block">
                <img className="w-100 rounded-2" src="assets/images/brand/xvision.png" alt="برند اکس‌ویژن" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col">
              <div className="content-wrapper bg-white p-3 rounded-2">
                {/* start content header */}
                <div className="content-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h2 className="content-header-title">
                      <span>پیشنهاد آمازون به شما</span>
                    </h2>
                    <div className="content-header-link">
                      <a href="/products">مشاهده همه</a>
                    </div>
                  </div>
                </div>
                {/* end content header */}
                <div className="lazyload-wrapper">
                  <div className="lazyload light-owl-nav owl-carousel owl-theme">
                    <div className="item">
                      <div className="lazyload-item-wrapper">
                        <div className="product">
                          <div className="product-add-to-cart">
                            <a href="/cart/add" data-bs-toggle="tooltip" data-bs-placement="left" title="افزودن به سبد خرید">
                              <i className="fa fa-cart-plus"></i>
                            </a>
                          </div>
                          <div className="product-add-to-favorite">
                            <a href="/favorites/add" data-bs-toggle="tooltip" data-bs-placement="left" title="افزودن به علاقه‌مندی">
                              <i className="fa fa-heart"></i>
                            </a>
                          </div>
                          <a className="product-link" href="/product/2">
                            <div className="product-image">
                              <img className="" src="assets/images/products/2.jpg" alt="دستگاه آبمیوه‌گیری" />
                            </div>
                            <div className="product-colors"></div>
                            <div className="product-name">
                              <h3>دستگاه آبمیوه‌گیری دنویر با کد 1016</h3>
                            </div>
                            <div className="product-price-wrapper">
                              <div className="product-discount">
                                <span className="product-old-price">342,000</span>
                                <span className="product-discount-amount">22%</span>
                              </div>
                              <div className="product-price">264,000 تومان</div>
                            </div>
                            <div className="product-colors">
                              <div className="product-colors-item" style={{ backgroundColor: 'white' }}></div>
                              <div className="product-colors-item" style={{ backgroundColor: 'blue' }}></div>
                              <div className="product-colors-item" style={{ backgroundColor: 'red' }}></div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col">
              {/* start content header */}
              <div className="content-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>پرفروش‌ترین کالاها</span>
                  </h2>
                  <div className="content-header-link">
                    <a href="/products">مشاهده همه</a>
                  </div>
                </div>
              </div>
              {/* end content header */}
              <div className="lazyload-wrapper">
                <div className="lazyload light-owl-nav owl-carousel owl-theme">
                  <div className="item">
                    <div className="lazyload-item-wrapper">
                      <div className="product">
                        <div className="product-add-to-cart">
                          <a
                            className="product-add-to-cart-active"
                            href="/cart/add"
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            title="افزودن به سبد خرید"
                          >
                            <i className="fa fa-cart-plus"></i>
                          </a>
                        </div>
                        <div className="product-add-to-favorite">
                          <a
                            className="product-add-to-favorite-active"
                            href="/favorites/add"
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            title="افزودن به علاقه‌مندی"
                          >
                            <i className="fa fa-heart"></i>
                          </a>
                        </div>
                        <a className="product-link" href="/product/2">
                          <div className="product-image">
                            <img className="" src="assets/images/products/2.jpg" alt="دستگاه آبمیوه‌گیری" />
                          </div>
                          <div className="product-name">
                            <h3>دستگاه آبمیوه‌گیری دنویر با کد 1016</h3>
                          </div>
                          <div className="product-price-wrapper">
                            <div className="product-discount">
                              <span className="product-old-price">230,000</span>
                              <span className="product-discount-amount">10%</span>
                            </div>
                            <div className="product-price">207,000 تومان</div>
                          </div>
                          <div className="product-colors">
                            <div className="product-colors-item" style={{ backgroundColor: 'white' }}></div>
                            <div className="product-colors-item" style={{ backgroundColor: 'blue' }}></div>
                            <div className="product-colors-item" style={{ backgroundColor: 'red' }}></div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col">
              {/* start content header */}
              <div className="content-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>محبوب‌ترین کالاها</span>
                  </h2>
                  <div className="content-header-link">
                    <a href="/products">مشاهده همه</a>
                  </div>
                </div>
              </div>
              {/* end content header */}
              <div className="lazyload-wrapper">
                <div className="lazyload light-owl-nav owl-carousel owl-theme">
                  <div className="item">
                    <div className="lazyload-item-wrapper">
                      <div className="product">
                        <div className="product-add-to-cart">
                          <a href="/cart/add" data-bs-toggle="tooltip" data-bs-placement="left" title="افزودن به سبد خرید">
                            <i className="fa fa-cart-plus"></i>
                          </a>
                        </div>
                        <div className="product-add-to-favorite">
                          <a href="/favorites/add" data-bs-toggle="tooltip" data-bs-placement="left" title="افزودن به علاقه‌مندی">
                            <i className="fa fa-heart"></i>
                          </a>
                        </div>
                        <a className="product-link" href="/product/2">
                          <div className="product-image">
                            <img className="" src="assets/images/products/2.jpg" alt="دستگاه آبمیوه‌گیری" />
                          </div>
                          <div className="product-colors"></div>
                          <div className="product-name">
                            <h3>دستگاه آبمیوه‌گیری دنویر با کد 1016</h3>
                          </div>
                          <div className="product-price-wrapper">
                            <div className="product-discount">
                              <span className="product-old-price">342,000</span>
                              <span className="product-discount-amount">22%</span>
                            </div>
                            <div className="product-price">264,000 تومان</div>
                          </div>
                          <div className="product-colors">
                            <div className="product-colors-item" style={{ backgroundColor: 'white' }}></div>
                            <div className="product-colors-item" style={{ backgroundColor: 'blue' }}></div>
                            <div className="product-colors-item" style={{ backgroundColor: 'red' }}></div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="">
        <div className="container-xxl">
          {/* one column */}
          <div className="row py-4">
            <div className="col">
              <img className="d-block rounded-2 w-100" src="assets/images/ads/one-col-1.jpg" alt="تبلیغ 1" />
            </div>
          </div>
          {/* two column */}
          <div className="row py-4">
            <div className="col">
              <img className="d-block rounded-2 w-100" src="assets/images/ads/two-col-1.jpg" alt="تبلیغ 2-1" />
            </div>
            <div className="col">
              <img className="d-block rounded-2 w-100" src="assets/images/ads/two-col-2.jpg" alt="تبلیغ 2-2" />
            </div>
          </div>
          {/* four column */}
          <div className="row py-4">
            <div className="col">
              <img className="d-block rounded-2 w-100" src="assets/images/ads/four-col-1.jpg" alt="تبلیغ 4-1" />
            </div>
            <div className="col">
              <img className="d-block rounded-2 w-100" src="assets/images/ads/four-col-2.jpg" alt="تبلیغ 4-2" />
            </div>
            <div className="col">
              <img className="d-block rounded-2 w-100" src="assets/images/ads/four-col-3.jpg" alt="تبلیغ 4-3" />
            </div>
            <div className="col">
              <img className="d-block rounded-2 w-100" src="assets/images/ads/four-col-4.jpg" alt="تبلیغ 4-4" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;