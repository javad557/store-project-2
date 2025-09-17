import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSettings } from "../../admin/services/settingsService";
import { showError } from "../../utils/notifications";
import logo from "../assets/images/logo.png";
import "../styles/Terms.css";

function Terms() {
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  // لود توضیحات از API (در صورت نیاز)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSettings();
        console.log("Settings API response:", response);
        setDescription(
          response.data.terms_page_description ||
            "لطفاً شرایط و قوانین استفاده از خدمات ما را مطالعه کنید."
        );
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        setDescription("لطفاً شرایط و قوانین استفاده از خدمات ما را مطالعه کنید.");
        showError("خطا در بارگذاری تنظیمات");
      }
    };
    fetchSettings();
  }, []);

  return (
    <section className="vh-100 d-flex justify-content-center align-items-center pb-5">
      <div className="terms-wrapper mb-5">
        <section className="terms-logo">
          <a href="/">
            <img src={logo} alt="لوگو" />
          </a>
        </section>
        <section className="terms-title">شرایط و قوانین</section>
        <section className="terms-info">{description}</section>
        <section className="terms-content">
          <h3>1. مقدمه</h3>
          <p>
            با استفاده از این وب‌سایت و خدمات آن، شما موافقت خود را با شرایط و قوانین ذکرشده در این سند اعلام می‌کنید. لطفاً این شرایط را با دقت مطالعه کنید. در صورت عدم موافقت با این شرایط، از استفاده از وب‌سایت خودداری کنید.
          </p>

          <h3>2. قوانین استفاده</h3>
          <p>
            شما متعهد می‌شوید که از وب‌سایت تنها برای اهداف قانونی استفاده کنید. هرگونه استفاده غیرمجاز، مانند تلاش برای دسترسی غیرمجاز به سیستم‌ها، نقض حریم خصوصی دیگران، یا انتشار محتوای غیرقانونی، ممنوع است.
          </p>

          <h3>3. حریم خصوصی</h3>
          <p>
            ما متعهد به حفاظت از اطلاعات شخصی شما هستیم. اطلاعات شما، از جمله ایمیل یا شماره موبایل، تنها برای ارائه خدمات، تأیید هویت، و بهبود تجربه کاربری استفاده می‌شود. برای اطلاعات بیشتر، به <a href="/privacy-policy">سیاست حفظ حریم خصوصی</a> مراجعه کنید.
          </p>

          <h3>4. مسئولیت‌های کاربر</h3>
          <p>
            شما مسئول حفظ امنیت حساب کاربری خود هستید. هرگونه فعالیت انجام‌شده با حساب شما به عهده خودتان است. لطفاً از به اشتراک گذاشتن اطلاعات ورود خود با دیگران خودداری کنید.
          </p>

          <h3>5. محدودیت مسئولیت</h3>
          <p>
            این وب‌سایت خدمات خود را «همان‌گونه که هست» ارائه می‌دهد. ما هیچ‌گونه تضمینی در مورد در دسترس بودن مداوم خدمات یا عدم وقوع خطا ارائه نمی‌دهیم. همچنین، ما مسئول خسارات ناشی از استفاده نادرست از وب‌سایت نیستیم.
          </p>

          <h3>6. تغییرات در شرایط</h3>
          <p>
            ما حق داریم این شرایط و قوانین را در هر زمان تغییر دهیم. تغییرات از طریق وب‌سایت اطلاع‌رسانی می‌شوند و ادامه استفاده شما از وب‌سایت به معنای پذیرش شرایط جدید است.
          </p>

          <h3>7. تماس با ما</h3>
          <p>
            در صورت داشتن هرگونه سؤال یا مشکل در مورد شرایط و قوانین، می‌توانید از طریق ایمیل <a href="mailto:support@example.com">support@example.com</a> یا شماره تماس 123456789-021 با ما در ارتباط باشید.
          </p>
        </section>
        <section className="terms-back-btn d-grid g-2">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => navigate("/auth/loginregister")}
          >
            بازگشت به صفحه ورود
          </button>
        </section>
      </div>
    </section>
  );
}

export default Terms;