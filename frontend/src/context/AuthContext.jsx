// src/context/AuthContext.jsx
import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { getAdmin } from "../admin/services/user/adminService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // از ابتدا false برای مسیرهای عمومی
  const navigate = useNavigate();

  // تابع بررسی انقضای توکن
  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Invalid token format:", error);
      return true;
    }
  };

  // تابع دریافت اطلاعات کاربر
  const checkAuth = async () => {
    if (loading) return false; // جلوگیری از درخواست‌های مکرر
    setLoading(true);
    const token = localStorage.getItem("auth_token");

    if (!token) {
      setLoading(false);
      return false;
    }

    if (isTokenExpired(token)) {
 
      localStorage.removeItem("auth_token");
      setUser(null);
      setLoading(false);
      toast.error("توکن منقضی شده است");
      navigate("/auth/loginregister");
      return false;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub || decodedToken.id;
   

      const response = await getAdmin(userId);
  
      setUser({
        id: response.data.id,
        name: response.data.name,
        last_name: response.data.last_name,
        email: response.data.email,
        mobile: response.data.mobile,
        is_admin: response.data.is_admin,
        permissions: response.data.permissions || [],
        roles: response.data.roles || [],
        all_permissions: response.data.all_permissions || [],
      });
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error in checkAuth:", error);
      localStorage.removeItem("auth_token");
      setUser(null);
      setLoading(false);
      toast.error(
        error.response?.status === 401 || error.response?.status === 403
          ? "لطفاً دوباره وارد شوید"
          : "خطایی در دریافت اطلاعات کاربر رخ داد"
      );
      navigate("/auth/loginregister");
      return false;
    }
  };

  // تابع لاگین
  const login = async (token, redirectTo = "/admin/dashboard") => {

    localStorage.setItem("auth_token", token);
    const success = await checkAuth();
    if (success) {
      navigate(redirectTo);
      toast.success("ورود با موفقیت انجام شد");
    } else {
      navigate("/auth/loginregister");
      toast.error("ورود ناموفق، لطفاً دوباره تلاش کنید");
    }
  };

  // تابع لاگ‌اوت
  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setLoading(false);
    navigate("/auth/loginregister");
    toast.info("شما از سیستم خارج شدید");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};