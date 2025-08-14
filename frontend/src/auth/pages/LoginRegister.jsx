import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, getLoginInfo } from "../services/authService";
import { showSuccess, showError } from "../../utils/notifications";
import logo from "../assets/images/logo.png";
import "../styles/LoginRegister.css";

function LoginRegister() {
  const [identifier, setIdentifier] = useState("");
  const [loginInfo, setLoginInfo] = useState("شماره موبایل یا پست الکترونیک خود را وارد کنید"); // پیش‌فرض
  const navigate = useNavigate();

  // دریافت توضیح صفحه از دیتابیس
  useEffect(() => {
    const fetchLoginInfo = async () => {
      try {
        const response = await getLoginInfo();
        setLoginInfo(response.data.info || "شماره موبایل یا پست الکترونیک خود را وارد کنید");
      } catch (error) {
        showError("دریافت اطلاعات صفحه با خطا مواجه شد");
        console.error("Error fetching login info:", error);
      }
    };
    fetchLoginInfo();
  }, []);

  // ارسال OTP با reCAPTCHA
  const handleSendOtp = async (e) => {
    e.preventDefault();
    // اعتبارسنجی ساده برای موبایل یا ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^09\d{9}$/;
    if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      showError("شماره موبایل یا ایمیل معتبر نیست");
      return;
    }

    // اجرای reCAPTCHA v3
    try {
      const token = await window.grecaptcha.execute("YOUR_RECAPTCHA_SITE_KEY", { action: "login" });
      try {
        const response = await sendOtp({ identifier, recaptcha_token: token });
        showSuccess(response.data.message || "کد OTP ارسال شد");
        navigate("/auth/otp-verify"); // هدایت به صفحه وارد کردن کد OTP
      } catch (error) {
        showError(error.response?.data?.error || "ارسال کد OTP با خطا مواجه شد");
        console.error("Error sending OTP:", error);
      }
    } catch (error) {
      showError("خطا در اعتبارسنجی reCAPTCHA");
      console.error("reCAPTCHA error:", error);
    }
  };

  return (
    <section className="vh-100 d-flex justify-content-center align-items-center pb-5">
      <form onSubmit={handleSendOtp}>
        <section className="login-wrapper mb-5">
          <section className="login-logo">
            <a href="/">
              <img src={logo} alt="لوگو" />
            </a>
          </section>
          <section className="login-title">ورود / ثبت نام</section>
          <section className="login-info">{loginInfo}</section>
          <section className="login-input-text">
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="موبایل یا ایمیل"
              className="form-control"
            />
          </section>
          <section className="login-btn d-grid g-2">
            <button type="submit" className="btn btn-danger">
              تأیید
            </button>
          </section>
          <section className="login-terms-and-conditions">
            <a href="/terms">شرایط و قوانین</a> را خوانده‌ام و پذیرفته‌ام
          </section>
        </section>
      </form>
    </section>
  );
}

export default LoginRegister;