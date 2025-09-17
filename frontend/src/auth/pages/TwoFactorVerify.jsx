import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyTwoFactor } from "../services/authService"; // مسیر سرویس رو درست کن
import { getSettings } from "../../admin/services/settingsService";
import { showSuccess, showError } from "../../utils/notifications";
import logo from "../assets/images/logo.png";
import "../styles/OtpVerify.css"; // فرض می‌کنم استایل‌ها مشابه OtpVerify هستند

function TwoFactorVerify() {
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const { otp_token: otpToken, identifier, fingerprint } = location.state || {};

  // بررسی وجود اطلاعات لازم
  useEffect(() => {
    console.log("TwoFactorVerify state:", { otpToken, identifier, fingerprint });
    if (!otpToken || !identifier || !fingerprint) {
      showError("جلسه منقضی شده است. لطفاً دوباره وارد شوید.");
      navigate("/auth/loginregister");
    }
  }, [otpToken, identifier, fingerprint, navigate]);

  // لود توضیحات صفحه
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await getSettings();
        setDescription(data.twofa_page_description || "لطفاً کد دو عاملی خود را وارد کنید");
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        setDescription("لطفاً کد دو عاملی خود را وارد کنید");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // تأیید کد دو عاملی
  const handleVerifyTwoFactor = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(twoFactorCode)) {
      showError("کد دو عاملی باید 6 رقمی باشد");
      return;
    }
    try {
      const response = await verifyTwoFactor({
        otp_token: otpToken,
        two_factor_code: twoFactorCode,
        fingerprint,
      });
      console.log("verifyTwoFactor response:", response.data);
      showSuccess(response.data.message);

      // هدایت بر اساس is_admin
      localStorage.setItem("auth_token", response.data.auth_token);
      localStorage.setItem("is_admin", response.data.is_admin);
      navigate(response.data.is_admin ? "/admin/dashboard" : "/dashboard");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "خطا در تأیید کد دو عاملی";
      const status = error.response?.status;

      if (status === 401 || status === 400) {
        // نگه داشتن کاربر در همان صفحه و نمایش خطا
        showError(errorMessage);
      } else {
        // هدایت به صفحه loginregister برای خطاهای دیگر (مثل 404، 410)
        showError(errorMessage);
        navigate("/auth/loginregister");
      }
      console.error("Error verifying two-factor code:", error);
    }
  };

  return (
    <section className="vh-100 d-flex justify-content-center align-items-center pb-5">
      <form onSubmit={handleVerifyTwoFactor}>
        <section className="otp-verify-wrapper mb-5">
          <section className="otp-verify-logo">
            <a href="/">
              <img src={logo} alt="لوگو" />
            </a>
          </section>
          <section className="otp-verify-title">تأیید کد دو عاملی</section>
          <section className="otp-verify-info">{description}</section>
          <section className="otp-verify-input-text">
            <input
              type="text"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              placeholder="کد دو عاملی (6 رقم)"
              className="form-control"
              maxLength="6"
            />
          </section>
          <section className="otp-verify-btn d-grid g-2">
            <button
              type="submit"
              className="btn btn-danger"
              disabled={twoFactorCode.length !== 6}
            >
              تأیید
            </button>
          </section>
        </section>
      </form>
    </section>
  );
}

export default TwoFactorVerify;