import { Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import { useState } from "react";
import "../styles/admin.css";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-vh-100 bg-light" dir="rtl">
      <AdminHeader toggleSidebar={toggleSidebar} />
      <section className="body-container d-flex">
        <aside
          className={` ${
            isSidebarOpen ? "sidebar-open" : "sidebar-closed d-none d-md-block"
          }`}
        >
          <AdminSidebar />
        </aside>
        <main id="main-body" className="main-body">
          <Outlet />
        </main>
      </section>
    </div>
  );
}

export default AdminLayout;
