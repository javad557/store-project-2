
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { sendOtp } from "../services/authService";
import { getSettings } from "../../admin/services/settingsService";
import { showSuccess, showError } from "../../utils/notifications";
import logo from "../assets/images/logo.png";
import "../styles/LoginRegister.css";function LoginRegisterInner() {
  const [identifier, setIdentifier] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();  // لود توضیحات از API
  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const response = await getSettings();
        
        setDescription(response.data.login_page_description || "شماره موبایل یا پست الکترونیک خود را وارد کنید");
      } catch (error) {
     
        setDescription("شماره موبایل یا پست الکترونیک خود را وارد کنید");
      }
    };
    fetchDescription();
  }, []);  // تولید Fingerprint
  useEffect(() => {
    const initializeFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setFingerprint(result.visitorId);
      
      } catch (error) {
        
      }
    };
    initializeFingerprint();
  }, []);  const handleSendOtp = async (e) => {
    e.preventDefault();// اعتبارسنجی اولیه identifier
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^09[0-9]{9}$/;
if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
  showError("لطفاً ایمیل یا شماره موبایل معتبر وارد کنید");
  return;
}

try {
  if (!executeRecaptcha) {
    throw new Error("reCAPTCHA not loaded");
  }
  const token = await executeRecaptcha("login");
 
  const response = await sendOtp({ identifier, recaptcha_token: token, fingerprint });
  showSuccess(response.data.message || "کد OTP ارسال شد");

  // ذخیره اطلاعات در localStorage برای مدیریت رفرش صفحه
  localStorage.setItem("otp_token", response.data.otp_token);
  localStorage.setItem("identifier", identifier);
  localStorage.setItem("fingerprint", fingerprint);

  // هدایت به صفحه OtpVerify یا TwoFactorVerify
  navigate("/auth/otpverify", {
    state: {
      otp_token: response.data.otp_token,
      identifier,
      fingerprint,
      expires_at: response.data.expires_at,
    },
  });
} catch (error) {
  showError(error.response?.data?.error || "خطا در ارسال درخواست");
  console.error("Error:", error);
}  };  return (
    <section className="vh-100 d-flex justify-content-center align-items-center pb-5">
      <form onSubmit={handleSendOtp}>
        <section className="login-wrapper mb-5">
          <section className="login-logo">
            <a href="/">
              <img src={logo} alt="لوگو" />
            </a>
          </section>
          <section className="login-title">ورود / ثبت نام</section>
          <section className="login-info">{description}</section>
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
            <a href="/auth/terms">شرایط و قوانین</a> را خوانده‌ام و پذیرفته‌ام
          </section>
          {/* متن جایگزین برای رعایت قوانین Google */}
          <div style={{ textAlign: "center", marginTop: "10px", fontSize: "12px", color: "#666" }}>
            This site is protected by reCAPTCHA and the Google{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>{" "}
            apply.
          </div>
        </section>
      </form>
    </section>
  );
}// Wrap the component with GoogleReCaptchaProvider
function LoginRegister() {
  const siteKey = "6LcyyKYrAAAAAKbGqimAWtMS-n0FDJL6TWyXN_tB";  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      useRecaptchaNet={true} // استفاده از دامنه recaptcha.net برای دور زدن مشکلات فایروال
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
      container={{
        parameters: {
          badge: "none", // مخفی کردن بج reCAPTCHA
        },
      }}
    >
      <LoginRegisterInner />
    </GoogleReCaptchaProvider>
  );
}export default LoginRegister;

