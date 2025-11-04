// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { showError } from "../utils/notifications";
import { useAuth } from "../context/AuthContext";

const ProtectedMainRoute = ({ children, requiredPermission }) => {

  const { user, loading } = useAuth();

  const token = localStorage.getItem("auth_token");

  // اگر در حال لودینگ هستیم و توکن وجود داره، اسپینر نشون بده
  if (loading && token) {
    return <div>در حال بارگذاری صفحه...</div>;
  }

  // اگر توکن وجود نداره، پیام توست نشون بده و به صفحه لاگین هدایت کن
  if (!token) {
    showError("لطفاً ابتدا وارد شوید");
    return <Navigate to="/auth/loginregister" replace />;
  }
  
  // اگر کاربر ادمین نیست، پیام توست نشون بده و به صفحه لاگین هدایت کن
  if (user && user.is_admin === false) {
    showError("ورود غیر مجاز");
    return <Navigate to="/auth/loginregister" replace />;
  }

  // // اگر پرمیشن لازم وجود داره و کاربر اون پرمیشن رو نداره، پیام توست و خطا نشون بده
  if (requiredPermission && user && !user.all_permissions.includes(requiredPermission)) {
    showError("شما مجوز لازم برای ورود به این بخش را ندارید");

    return <div>شما مجوز لازم برای دسترسی به این بخش را ندارید.</div>;
  }

  // // اگر همه‌چیز اوکیه، کامپوننت فرزند رو رندر کن
  return children;
};

export default ProtectedMainRoute;