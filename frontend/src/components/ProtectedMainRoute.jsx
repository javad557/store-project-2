// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { showError } from "../utils/notifications";
import { useAuth } from "../context/AuthContext";

const ProtectedMainRoute = ({ children }) => {

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
  
  // // اگر همه‌چیز اوکیه، کامپوننت فرزند رو رندر کن
  return children;
};

export default ProtectedMainRoute;