function InformationPages(){
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
                <span>اطلاع‌رسانی</span>
              </h2>
              <section className="content-header-link m-2">
                <a href="#" className="btn btn-danger text-white">
                  بازگشت
                </a>
              </section>
            </section>
          </section>

          <section className="row mt-4">
            <section className="col-md-12">
              <section className="content-wrapper bg-white p-3 rounded-2 mb-4">
                {/* start notification content */}
                <section
                  className="notification-alert alert alert-primary d-flex align-items-center p-2"
                  role="alert"
                >
                  <i className="fa fa-info-circle flex-shrink-0 me-2"></i>
                  <section>
                    کاربر گرامی، این یک پیام اطلاع‌رسانی است. لطفاً اطلاعات به‌روزرسانی‌شده را بررسی کنید یا برای ادامه فرآیند روی دکمه بازگشت کلیک کنید.
                  </section>
                </section>

                <section className="notification-content">
                  <p className="mb-3">
                    در این بخش می‌توانید جزئیات اطلاع‌رسانی را مشاهده کنید. این صفحه برای نمایش پیام‌های مهم مانند به‌روزرسانی‌های سیستم، اطلاعیه‌های جدید، یا نکات مربوط به حساب کاربری شما طراحی شده است.
                  </p>
                  <p className="mb-3">
                    <i className="fa fa-check-circle me-1"></i>
                    به‌روزرسانی‌های اخیر: سیستم پرداخت آنلاین بهبود یافته است.
                  </p>
                  <p className="mb-3">
                    <i className="fa fa-check-circle me-1"></i>
                    اطلاعیه: لطفاً اطلاعات حساب کاربری خود را تکمیل کنید تا از خدمات بهتر بهره‌مند شوید.
                  </p>
                </section>
                {/* end notification content */}
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

export default InformationPages;