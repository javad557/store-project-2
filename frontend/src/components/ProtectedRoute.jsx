// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, position, requiredPermission }) => {
  const { user, loading, checkAuth } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!user && !loading) {
        const success = await checkAuth();
        setAuthChecked(true);
        if (!success) {
          toast.error("لطفاً ابتدا وارد شوید");
        }
      } else {
        setAuthChecked(true);
      }
    };

    verifyAuth();
  }, [user, loading, checkAuth]);

  if (!authChecked || loading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/loginregister" replace />;
  }

  // بررسی position
  if (position) {
    if (position === "admin" && user.is_admin !== 1) {
  
      toast.error("شما دسترسی کافی برای این صفحه را ندارید");
      return <Navigate to="/" replace />;
    }
    if (position === "customer" && user.is_admin !== 0 && user.is_admin !== 1) {
 
      toast.error("شما دسترسی کافی برای این صفحه را ندارید");
      return <Navigate to="/" replace />;
    }
  }

  // بررسی مجوزهای مورد نیاز
  if (requiredPermission && !user.all_permissions?.includes(requiredPermission)) {

    toast.error("شما دسترسی کافی برای این صفحه را ندارید");
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;