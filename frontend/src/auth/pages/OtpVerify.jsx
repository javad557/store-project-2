import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // ایمپورت useAuth
import { verifyOtp } from "../services/authService";
import { getSettings } from "../../admin/services/settingsService";
import { showSuccess, showError } from "../../utils/notifications";
import logo from "../assets/images/logo.png";
import "../styles/OtpVerify.css";

function OtpVerify() {
  const [otp, setOtp] = useState("");
  const [description, setDescription] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // دریافت تابع login از AuthContext

  const { otp_token: otpToken, identifier, fingerprint, expires_at: expiresAt } = location.state || {};

  // بررسی وجود اطلاعات لازم
  useEffect(() => {
    if (!otpToken || !identifier || !fingerprint || !expiresAt) {
      showError("جلسه منقضی شده است. لطفاً دوباره وارد شوید.");
      navigate("/auth/loginregister");
    }
  }, [otpToken, identifier, fingerprint, expiresAt, navigate]);

  // لود توضیحات صفحه
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await getSettings();
        setDescription(data.otp_page_description || "کد تأیید (6 رقم) یا رمز یک‌بارمصرف (10 رقم) ارسال‌شده به ایمیل/شماره خود را وارد کنید");
      } catch (error) {
        setDescription("کد تأیید (6 رقم) یا رمز یک‌بارمصرف (10 رقم) ارسال‌شده به ایمیل/شماره خود را وارد کنید");
      }
    };
    fetchSettings();
  }, []);

  // تنظیم تایمر و شمارشگر معکوس
  useEffect(() => {
    if (!expiresAt) return;

    const expiryDate = new Date(expiresAt);
    if (isNaN(expiryDate.getTime())) {
      showError("جلسه منقضی شده است. لطفاً دوباره وارد شوید.");
      navigate("/auth/loginregister");
      return;
    }

    setIsLoading(true);
    const timer = setInterval(() => {
      const timeDiffSeconds = Math.floor((expiryDate.getTime() - Date.now()) / 1000);
      setTimeLeft(timeDiffSeconds > 0 ? timeDiffSeconds : 0);
      setIsLoading(false);
      if (timeDiffSeconds <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, navigate]);

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // تبدیل مسیر نسبی به مسیر کامل
  const resolveRedirectPath = (redirectTo) => {
    const validPaths = {
      loginregister: "/auth/loginregister",
      two_factor: "/auth/two-factor",
      recovery_codes: "/auth/recovery-codes",
    };
    if (redirectTo.startsWith("/")) {
      return redirectTo;
    }
    return validPaths[redirectTo] || `/auth/${redirectTo}`;
  };

  // تأیید OTP یا رمز یک‌بارمصرف
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$|^\d{10}$/.test(otp)) {
      showError("کد OTP باید 6 رقمی یا رمز یک‌بارمصرف 10 رقمی باشد");
      return;
    }
    try {
      const response = await verifyOtp({ otp_token: otpToken, otp, fingerprint });
      showSuccess(response.data.message);

      if (response.data.auth_token) {
        // فراخوانی تابع login از AuthContext به جای ذخیره دستی توکن
        const redirectPath = response.data.is_admin ? "/admin/dashboard" : "/dashboard";
        await login(response.data.auth_token, redirectPath);
      } else if (response.data.redirect_to) {
        const redirectPath = resolveRedirectPath(response.data.redirect_to);
        navigate(redirectPath, {
          state: {
            otp_token: otpToken,
            identifier,
            fingerprint,
          },
        });
      } else {
        // در صورت عدم وجود auth_token و redirect_to، به مسیر پیش‌فرض هدایت شود
        navigate("/auth/loginregister");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "خطا در تأیید کد OTP یا رمز یک‌بارمصرف";
      console.error("Error verifying OTP:", error);
      showError(errorMessage);

      if (error.response?.data?.redirect_to) {
        const redirectPath = resolveRedirectPath(error.response.data.redirect_to);
        navigate(redirectPath, {
          state: {
            otp_token: otpToken,
            identifier,
            fingerprint,
            error: errorMessage,
          },
        });
      }
    }
  };

  // ارسال مجدد OTP
  const handleResendOtp = async () => {
    try {
      const { data } = await axios.post("/api/auth/resend-otp", { otp_token: otpToken });
      showSuccess(data.message || "کد OTP جدید ارسال شد");
      navigate("/auth/otpverify", {
        state: {
          otp_token: data.otp_token,
          identifier,
          fingerprint,
          expires_at: data.expires_at,
        },
      });
    } catch (error) {
      showError(error.response?.data?.error || "خطا در ارسال مجدد کد OTP");
      navigate("/auth/loginregister");
    }
  };

  return (
    <section className="vh-100 d-flex justify-content-center align-items-center pb-5">
      <form onSubmit={handleVerifyOtp}>
        <section className="otp-verify-wrapper mb-5">
          <section className="otp-verify-logo">
            <a href="/">
              <img src={logo} alt="لوگو" />
            </a>
          </section>
          <section className="otp-verify-title">تأیید کد OTP یا رمز یک‌بارمصرف</section>
          <section className="otp-verify-info">{description}</section>
          <section className="otp-verify-input-text">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="کد OTP (6 رقم) یا رمز یک‌بارمصرف (10 رقم)"
              className="form-control"
              maxLength="10"
            />
          </section>
          <section className="otp-verify-btn d-grid g-2">
            <button
              type="submit"
              className="btn btn-danger"
              disabled={otp.length !== 6 && otp.length !== 10}
            >
              تأیید
            </button>
          </section>
          {isLoading ? (
            <section className="otp-verify-loading">در حال بارگذاری...</section>
          ) : timeLeft > 0 ? (
            <section className="otp-verify-timer">
              زمان باقی‌مانده: {formatTimeLeft()}
            </section>
          ) : (
            <section className="otp-verify-resend">
              <button type="button" onClick={handleResendOtp} className="btn btn-link">
                ارسال مجدد کد
              </button>
            </section>
          )}
        </section>
      </form>
    </section>
  );
}

export default OtpVerify;