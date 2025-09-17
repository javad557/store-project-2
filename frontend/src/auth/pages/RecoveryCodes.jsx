import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getRecoveryCodes, login } from "../services/authService";
import { showSuccess, showError } from "../../utils/notifications";
import { getSettings } from "../../admin/services/settingsService";
import logo from "../assets/images/logo.png";
import "../styles/RecoveryCodes.css";

function RecoveryCodes() {
  const [description, setDescription] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const { otp_token: otpToken } = location.state || {};

  // بررسی وجود otp_token
  useEffect(() => {
    console.log("RecoveryCodes otpToken:", otpToken); // لاگ برای دیباگ
    if (!otpToken) {
      showError("جلسه منقضی شده است. لطفاً دوباره وارد شوید.");
      navigate("/auth/loginregister");
    }
  }, [otpToken, navigate]);

  // لود توضیحات صفحه
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await getSettings();
        setDescription(
          data.one_time_password_page_description ||
            "لطفا رمزهای یکبار مصرف خود را در جایی امن ذخیره کنید و توجه کنید که این رمزها تنها کلید شما برای ورود به حساب کاربریتان در هنگام عدم دسترسی به ایمیل یا موبایل هستند"
        );
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        setDescription(
          "لطفا رمزهای یکبار مصرف خود را در جایی امن ذخیره کنید و توجه کنید که این رمزها تنها کلید شما برای ورود به حساب کاربریتان در هنگام عدم دسترسی به ایمیل یا موبایل هستند"
        );
      }
    };
    fetchSettings();
  }, []);

  // دریافت رمزهای یک‌بارمصرف
  useEffect(() => {
    const fetchRecoveryCodes = async () => {
      setIsLoading(true);
      try {
        const { recovery_codes } = await getRecoveryCodes(otpToken);
        setRecoveryCodes(recovery_codes || []);
      } catch (error) {
        showError(error.message || "خطا در دریافت رمزهای یک‌بارمصرف");
        console.error("Error fetching recovery codes:", error);
        navigate("/auth/loginregister");
      } finally {
        setIsLoading(false);
      }
    };
    if (otpToken) {
      fetchRecoveryCodes();
    }
  }, [otpToken, navigate]);

  // اجرای متد login
const handleLogin = async () => {
    try {
        console.log("Starting login with otpToken:", otpToken); // لاگ otpToken
        const response = await login(otpToken);
        console.log("API response:", response); // لاگ پاسخ کامل API
        const { message, auth_token, is_admin } = response;
        console.log("Extracted data:", { message, auth_token, is_admin }); // لاگ داده‌های استخراج‌شده
        if (!auth_token) {
            throw new Error("auth_token در پاسخ API وجود ندارد");
        }
        showSuccess(message || "ورود با موفقیت انجام شد");
        localStorage.setItem("auth_token", auth_token);
        console.log("Stored auth_token:", localStorage.getItem("auth_token")); // لاگ بعد از ذخیره
        localStorage.removeItem("otp_token");
        console.log("otp_token removed, localStorage:", localStorage); // لاگ localStorage
        navigate(is_admin === 1 ? "/admin/dashboard" : "/dashboard");
    } catch (error) {
        console.error("Login error:", error.response ? error.response.data : error.message);
        showError(error.message || "خطا در ورود");
        navigate("/auth/loginregister");
    }
};
  return (
    <section className="vh-100 d-flex justify-content-center align-items-center pb-5">
      <div className="recovery-codes-wrapper mb-5">
        <section className="recovery-codes-logo">
          <a href="/">
            <img src={logo} alt="لوگو" />
          </a>
        </section>
        <section className="recovery-codes-title">رمزهای یک‌بارمصرف</section>
        <section className="recovery-codes-info" style={{ color: "red" }}>
          {description}
        </section>
        {isLoading ? (
          <section className="recovery-codes-loading">در حال بارگذاری...</section>
        ) : recoveryCodes.length === 0 ? (
          <section className="recovery-codes-error">هیچ رمزی دریافت نشد</section>
        ) : (
          <section className="recovery-codes-list">
            <ul style={{ userSelect: "none" }}>
              {recoveryCodes.map((code, index) => (
                <li key={index}>{code}</li>
              ))}
            </ul>
          </section>
        )}
        <section className="recovery-codes-btn d-grid g-2">
          <button
            type="button"
            onClick={handleLogin}
            className="btn btn-danger"
            disabled={isLoading || recoveryCodes.length === 0}
          >
            ذخیره کردم
          </button>
        </section>
      </div>
    </section>
  );
}

export default RecoveryCodes;