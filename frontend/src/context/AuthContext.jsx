// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../admin/services/user/adminService";
import { showError } from "../utils/notifications";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("توکن احراز هویت یافت نشد");
      }
      const response = await getUser();
      setUser({
        id: response.data.data.id,
        name: response.data.data.name,
        last_name: response.data.data.last_name,
        email: response.data.data.email,
        mobile: response.data.data.mobile,
        is_admin: response.data.data.is_admin === 1,
        permissions: response.data.data.permissions || [],
        roles: response.data.data.roles || [],
        all_permissions: response.data.data.all_permissions || [],
      });
      return true;
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      localStorage.removeItem("auth_token");
      showError(
        error.response?.status === 401 || error.response?.status === 403
          ? "لطفاً دوباره وارد شوید"
          : "خطایی در دریافت اطلاعات کاربر رخ داد"
      );
      navigate("/auth/loginregister");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (token, redirectTo = "/admin/dashboard") => {
    try {
      localStorage.setItem("auth_token", token);
      const success = await fetchUserData();
      if (success) {
        navigate(redirectTo);
      } else {
        navigate("/auth/loginregister");
        showError("ورود ناموفق، لطفاً دوباره تلاش کنید");
      }
    } catch (error) {
      console.error("Login error:", error);
      navigate("/auth/loginregister");
      showError("خطا در ورود، لطفاً دوباره تلاش کنید");
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await fetchUserData();
      }
    };
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login }}>
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