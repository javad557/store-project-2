// contexts/AuthContext.jsx
import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "../admin/services/user/adminService";
import { showError } from "../utils/notifications";

const AuthContext = createContext({});

export function AuthProvider({ isAdmin, children }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("auth_token");

  // دریافت اطلاعات کاربر
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
            carts: response.data.data.carts || [],
            favorites: response.data.data.favorites || [],
            national_code :response.data.data.national_code ,
          };
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 1,
      })
    : { data: null, isLoading: false, isError: false, error: null };

  // مدیریت خطاها
  useEffect(() => {
    if (isError && token) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("auth_token");
      queryClient.invalidateQueries(["user"]);
      queryClient.removeQueries(["user"]);
      showError(
        error.response?.status === 401 || error.response?.status === 403
          ? "لطفاً دوباره وارد شوید"
          : "خطایی در دریافت اطلاعات کاربر رخ داد"
      );
      navigate("/auth/loginregister");
    }
  }, [isError, error, navigate, queryClient, token]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}