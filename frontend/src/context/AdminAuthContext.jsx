import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../admin/services/user/adminService";
import { showError } from "../utils/notifications";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../admin/layouts/AdminLayout";

const AdminAuthContext = createContext({});

export function AdminAuthProvider() {
  const navigate = useNavigate();

  // بررسی توکن قبل از اجرای useQuery
  const token = localStorage.getItem("auth_token");

  // اگه توکن نباشه، به صفحه لاگین هدایت کن
  useEffect(() => {
    if (!token) {
      showError("توکن احراز هویت یافت نشد");
      navigate("/auth/loginregister");
    }
  }, [token]);

  // فقط اگه توکن وجود داشته باشه، useQuery اجرا می‌شه
  const { data: user = null, isLoading: loading, isError, error } = token
    ? useQuery({
        queryKey: ["user"],
        queryFn: async () => {
          const response = await getUser();
          return {
            id: response.data.data.id,
            name: response.data.data.name,
            last_name: response.data.data.last_name,
            email: response.data.data.email,
            mobile: response.data.data.mobile,
            is_admin: response.data.data.is_admin === 1,
            permissions: response.data.data.permissions || [],
            roles: response.data.data.roles || [],
            all_permissions: response.data.data.all_permissions || [],
          };
        },
        staleTime: 5 * 60 * 1000, // کش برای 5 دقیقه معتبره
        cacheTime: 10 * 60 * 1000, // داده‌ها تا 10 دقیقه توی حافظه می‌مونن
        retry: 1, // در صورت خطا فقط یک بار retry کنه
      })
    : { data: null, isLoading: false, isError: false, error: null };

  // مدیریت خطاهای useQuery
  useEffect(() => {
    if (isError) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("auth_token");
      showError(
        error.response?.status === 401 || error.response?.status === 403
          ? "لطفاً دوباره وارد شوید"
          : "خطایی در دریافت اطلاعات کاربر رخ داد"
      );
      navigate("/auth/loginregister");
    }
  }, [isError, error]);


  return (
    <AdminAuthContext.Provider value={{ user, loading }}>
      <ProtectedRoute position="admin">
        <AdminLayout />
      </ProtectedRoute>
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}