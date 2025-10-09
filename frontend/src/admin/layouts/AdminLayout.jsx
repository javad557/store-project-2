import { Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import { useState } from "react";
import "../styles/admin.css";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../services/user/adminService"; // فرض می‌کنم این سرویس برای دریافت کاربر است

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { data: user, isLoading: isUserLoading, error: userError, isError: isUserError } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  console.log(user);
  

  return (
    <div className="min-vh-100 bg-light" dir="rtl">
      <AdminHeader
        toggleSidebar={toggleSidebar}
        user={user}
        isUserLoading={isUserLoading}
        userError={userError}
        isUserError={isUserError}
      />
      <section className="body-container d-flex">
        <aside
          className={` ${
            isSidebarOpen ? "sidebar-open" : "sidebar-closed d-none d-md-block"
          }`}
        >
          <AdminSidebar
           toggleSidebar={toggleSidebar}
        user={user}
        isUserLoading={isUserLoading}
        userError={userError}
        isUserError={isUserError} />
        </aside>
        <main id="main-body" className="main-body">
          <Outlet />
        </main>
      </section>
    </div>
  );
}

export default AdminLayout;