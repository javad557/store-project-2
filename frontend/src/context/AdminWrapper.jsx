// src/components/AdminWrapper.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { getUser } from "../admin/services/user/adminService";
import { showError } from "../utils/notifications";

const AdminWrapper = () => {
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
  

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await fetchUserData();
      } else {
        navigate("/auth/loginregister");
      }
    };
    initializeAuth();
  }, [navigate]);

  // استفاده از useMemo برای بهینه‌سازی context
  const contextValue = useMemo(() => ({ user, setUser, loading }), [user, setUser, loading]);

  return (
    <div>
      <Outlet context={contextValue} />
    </div>
  );
};

export default AdminWrapper;