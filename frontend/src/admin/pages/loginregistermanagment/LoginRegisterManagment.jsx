import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSettings, updateSettings } from "../../services/settingsService.js";
import { showSuccess, showError } from "../../../utils/notifications.jsx";
import { FaCheck } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

function LoginRegisterSettings() {
  const [settings, setSettings] = useState({
    login_page_description: "",
    too_many_attempts_error: "",
    max_attempts_per_identifier: 0,
    attempt_window_hours: 0,
    max_otpand2fa_attempts: 0,
    otpand2fa_attempt_window_hours: 0,
    otp_error_message: "",
    block_error_message: "",
    otpand2fa_block_duration_hours: 0,
    otp_expiry_minutes: 0,
    otp_page_description: "",
    one_time_password_page_description: "",
    one_time_password_count: 0,
    max_successful_otp_attempts: 0,
    successful_otp_window_hours: 0,
    too_many_successful_logins_error: "",
    twofa_page_description: "",
    twofa_error_message: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSettings();
        console.log("پاسخ کامل API:", response);
        console.log("داده‌های API:", response.data);
        if (response.data) {
          setSettings(response.data);
        } else {
          setError("هیچ تنظیمی یافت نشد");
        }
        setLoading(false);
      } catch (error) {
        console.error("خطا در دریافت تنظیمات:", error);
        setError("سرویس تنظیمات در دسترس نیست");
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: field.includes("hours") || field.includes("count") || field.includes("attempts") || field.includes("minutes")
        ? parseInt(value) || 0
        : value,
    }));
  };

 const handleSaveSettings = async () => {
  try {
    console.log("داده‌های ارسالی برای آپدیت:", settings); // برای دیباگ
    const response = await updateSettings(settings); // ذخیره پاسخ API
    showSuccess(response.message || "تنظیمات با موفقیت ذخیره شد"); // استفاده از پیام API یا پیام پیش‌فرض
  } catch (error) {
    console.error("خطا در ذخیره تنظیمات:", error.response?.data);
    const errorMessage =
      error.response?.data?.errors?.join("، ") ||
      error.response?.data?.error ||
      error.response?.data?.message ||
      "ذخیره تنظیمات با خطا مواجه شد";
    showError(errorMessage);
  }
};

  return (
    <section className="row" dir="rtl">
      <style>
        {`
          .form-control-sm {
            font-size: 0.875rem;
            padding: 0.25rem 0.5rem;
          }
          .form-group {
            margin-bottom: 1rem;
          }
          .uniform-button {
            min-width: 120px;
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
            line-height: 1.5;
          }
          .main-body-container {
            padding: 20px;
          }
          .main-body-container-header h5 {
            margin-bottom: 20px;
          }
        `}
      </style>
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>مدیریت تنظیمات لاگین و رجیستر</h5>
          </section>

          {loading ? (
            <div className="text-center my-4">در حال بارگذاری...</div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : (
            <section className="form-container">
              <div className="form-group">
                <label>توضیحات صفحه لاگین/رجیستر</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={settings.login_page_description || ""}
                  onChange={(e) => handleInputChange("login_page_description", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>خطای درخواست بیش از حد برای ورود</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={settings.too_many_attempts_error || ""}
                  onChange={(e) => handleInputChange("too_many_attempts_error", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>تعداد درخواست مجاز برای لاگین</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={settings.max_attempts_per_identifier || 0}
                  onChange={(e) => handleInputChange("max_attempts_per_identifier", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>بازه زمانی برای تعداد درخواست مجاز (ساعت)</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={settings.attempt_window_hours || 0}
                  onChange={(e) => handleInputChange("attempt_window_hours", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>تعداد خطای مجاز برای OTP و 2FA</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={settings.max_otpand2fa_attempts || 0}
                  onChange={(e) => handleInputChange("max_otpand2fa_attempts", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>بازه زمانی برای خطای مجاز OTP و 2FA (ساعت)</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={settings.otpand2fa_attempt_window_hours || 0}
                  onChange={(e) => handleInputChange("otpand2fa_attempt_window_hours", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>خطای OTP اشتباه</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={settings.otp_error_message || ""}
                  onChange={(e) => handleInputChange("otp_error_message", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>خطای بلاک بودن حساب</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={settings.block_error_message || ""}
                  onChange={(e) => handleInputChange("block_error_message", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>مدت زمان بلاکی OTP و 2FA (ساعت)</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={settings.otpand2fa_block_duration_hours || 0}
                  onChange={(e) => handleInputChange("otpand2fa_block_duration_hours", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>مدت انقضای کد OTP (دقیقه)</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={settings.otp_expiry_minutes || 0}
                  onChange={(e) => handleInputChange("otp_expiry_minutes", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>توضیحات صفحه وارد کردن کد OTP</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={settings.otp_page_description || ""}
                  onChange={(e) => handleInputChange("otp_page_description", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>توضیحات صفحه نمایش رمزهای یک‌بارمصرف</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={settings.one_time_password_page_description || ""}
                  onChange={(e) => handleInputChange("one_time_password_page_description", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>تعداد رمزهای یک‌بارمصرف</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={settings.one_time_password_count || 0}
                  onChange={(e) => handleInputChange("one_time_password_count", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>حداکثر تعداد ورود موفق مجاز</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={settings.max_successful_otp_attempts || 0}
                  onChange={(e) => handleInputChange("max_successful_otp_attempts", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>بازه زمانی برای ورود موفق مجاز (ساعت)</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={settings.successful_otp_window_hours || 0}
                  onChange={(e) => handleInputChange("successful_otp_window_hours", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>خطای ورود بیش از حد مجاز</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={settings.too_many_successful_logins_error || ""}
                  onChange={(e) => handleInputChange("too_many_successful_logins_error", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>توضیحات صفحه وارد کردن کد 2FA</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={settings.twofa_page_description || ""}
                  onChange={(e) => handleInputChange("twofa_page_description", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>خطای اشتباه بودن کد 2FA</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={settings.twofa_error_message || ""}
                  onChange={(e) => handleInputChange("twofa_error_message", e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-end mt-4">
                <button
                  className="btn btn-success btn-sm uniform-button"
                  onClick={handleSaveSettings}
                >
                  <FaCheck className="me-1" /> ثبت تغییرات
                </button>
              </div>
            </section>
          )}

        </section>
      </section>
    </section>
  );
}

export default LoginRegisterSettings;