// src/admin/components/AdminSidebar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // اضافه کردن AuthContext
import PropTypes from "prop-types";

function AdminSidebar() {
  const { user, loading } = useAuth(); // گرفتن user و loading از AuthContext
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // چک کردن پرمیشن‌ها
  const hasPermission = (permission) => {
    return !loading && user?.all_permissions.includes(permission);
  };

  // تعریف پرمیشن‌های موردنیاز برای هر بخش و لینک
  const sidebarItems = {
    dashboard: { path: "/admin/dashboard", permission: null }, // بدون نیاز به پرمیشن
    market: {
      title: "مارکت",
      permission: [
        "read_categories",
        "read_brands",
        "read_products",
        "read_comments",
      ],
      items: [
        { path: "/admin/market/categories", label: "دسته‌بندی‌ها", icon: "fas fa-list", permission: "read_categories" },
        { path: "/admin/market/brands", label: "برندها", icon: "fas fa-tag", permission: "read_brands" },
        { path: "/admin/market/products", label: "محصولات", icon: "fas fa-box", permission: "read_products" },
        { path: "/admin/market/comments", label: "نظرات", icon: "fas fa-comment", permission: "read_comments" },
      ],
    },
    marketing: {
      title: "مارکتینگ",
      permission: ["read_banners", "read_copans", "read_amazings"],
      items: [
        { path: "/admin/marketing/banners", label: "بنرها", icon: "fas fa-image", permission: "read_banners" },
        { path: "/admin/marketing/copans", label: "کدهای تخفیف", icon: "fas fa-ticket-alt", permission: "read_copans" },
        { path: "/admin/marketing/amazings", label: "فروش شگفت‌انگیز", icon: "fas fa-star", permission: "read_amazings" },
      ],
    },
    users: {
      title: "کاربران و دسترسی‌ها",
      permission: [
        "read_customerusers",
        "read_adminusers",
        "read_permissions",
        "read_roles",
      ],
      items: [
        { path: "/admin/user/customerusers", label: "کاربران", icon: "fas fa-user", permission: "read_customerusers" },
        { path: "/admin/user/adminusers", label: "کاربران ادمین", icon: "fas fa-user-shield", permission: "read_adminusers" },
        { path: "/admin/user/permissions", label: "دسترسی‌ها", icon: "fas fa-key", permission: "read_permissions" },
        { path: "/admin/user/roles", label: "نقش‌ها", icon: "fas fa-user-tag", permission: "read_roles" },
      ],
    },
    tickets: {
      title: "تیکت‌ها",
      permission: ["read_tickets", "read_category_tickets", "read_priority_tickets"],
      items: [
        { path: "/admin/ticket/tickets", label: "تیکت‌ها", icon: "fas fa-ticket-alt", permission: "read_tickets" },
        { path: "/admin/ticket/category_tickets", label: "دسته‌بندی تیکت‌ها", icon: "fas fa-folder", permission: "read_category_tickets" },
        { path: "/admin/ticket/priority_tickets", label: "اولویت تیکت‌ها", icon: "fas fa-exclamation-circle", permission: "read_priority_tickets" },
      ],
    },
    orders: { path: "/admin/orders", label: "سفارشات", icon: "fas fa-shopping-bag", permission: "read_orders" },
    deliveries: { path: "/admin/deliveries", label: "روش‌های ارسال", icon: "fas fa-truck", permission: "read_deliveries" },
    loginRegister: { path: "/admin/loginregistermanagment", label: "لاگین رجیستر", icon: "fas fa-sign-in-alt", permission: "loginresiter_managment" },
    pages: { path: "/admin/pages", label: "صفحات اطلاع‌رسانی", icon: "fas fa-file-alt", permission: "read_pages" },
  };

  // بررسی نمایش بخش‌های دراپ‌داون
  const shouldShowSection = (section) => {
    if (!section.permission) return true; // برای dashboard که پرمیشن لازم نداره
    return section.permission.some((perm) => hasPermission(perm));
  };

  return (
    <aside id="sidebar" className="sidebar">
      <section className="sidebar-container" style={{ height: "100vh", overflowY: "auto" }}>
        <section className="sidebar-wrapper">
          {/* داشبورد (همیشه نمایش داده می‌شه) */}
          <Link to={sidebarItems.dashboard.path} className="sidebar-link">
            <i className="fas fa-home"></i>
            <span>{sidebarItems.dashboard.label || "خانه"}</span>
          </Link>

          {/* بخش مارکت */}
          {shouldShowSection(sidebarItems.market) && (
            <>
              <section
                className={`sidebar-part-title sidebar-dropdown-toggle ${openSection === "market" ? "sidebar-group-link-active" : ""}`}
                onClick={() => toggleSection("market")}
              >
                <div>
                  <i className="fas fa-shopping-cart icon"></i>
                  <span>{sidebarItems.market.title}</span>
                </div>
                <i className={`fas fa-angle-down angle ${openSection === "market" ? "rotate-90" : ""}`}></i>
              </section>
              <div className={`sidebar-dropdown ${openSection === "market" ? "sidebar-group-link-active" : ""}`}>
                {sidebarItems.market.items
                  .filter((item) => hasPermission(item.permission))
                  .map((item) => (
                    <Link key={item.path} to={item.path} className="sidebar-link">
                      <i className={item.icon}></i>
                      <span>{item.label}</span>
                    </Link>
                  ))}
              </div>
            </>
          )}

          {/* بخش مارکتینگ */}
          {shouldShowSection(sidebarItems.marketing) && (
            <>
              <section
                className={`sidebar-part-title sidebar-dropdown-toggle ${openSection === "marketing" ? "sidebar-group-link-active" : ""}`}
                onClick={() => toggleSection("marketing")}
              >
                <div>
                  <i className="fas fa-bullhorn icon"></i>
                  <span>{sidebarItems.marketing.title}</span>
                </div>
                <i className={`fas fa-angle-down angle ${openSection === "marketing" ? "rotate-90" : ""}`}></i>
              </section>
              <div className={`sidebar-dropdown ${openSection === "marketing" ? "sidebar-group-link-active" : ""}`}>
                {sidebarItems.marketing.items
                  .filter((item) => hasPermission(item.permission))
                  .map((item) => (
                    <Link key={item.path} to={item.path} className="sidebar-link">
                      <i className={item.icon}></i>
                      <span>{item.label}</span>
                    </Link>
                  ))}
              </div>
            </>
          )}

          {/* بخش کاربران و دسترسی‌ها */}
          {shouldShowSection(sidebarItems.users) && (
            <>
              <section
                className={`sidebar-part-title sidebar-dropdown-toggle ${openSection === "users" ? "sidebar-group-link-active" : ""}`}
                onClick={() => toggleSection("users")}
              >
                <div>
                  <i className="fas fa-users icon"></i>
                  <span>{sidebarItems.users.title}</span>
                </div>
                <i className={`fas fa-angle-down angle ${openSection === "users" ? "rotate-90" : ""}`}></i>
              </section>
              <div className={`sidebar-dropdown ${openSection === "users" ? "sidebar-group-link-active" : ""}`}>
                {sidebarItems.users.items
                  .filter((item) => hasPermission(item.permission))
                  .map((item) => (
                    <Link key={item.path} to={item.path} className="sidebar-link">
                      <i className={item.icon}></i>
                      <span>{item.label}</span>
                    </Link>
                  ))}
              </div>
            </>
          )}

          {/* بخش تیکت‌ها */}
          {shouldShowSection(sidebarItems.tickets) && (
            <>
              <section
                className={`sidebar-part-title sidebar-dropdown-toggle ${openSection === "tickets" ? "sidebar-group-link-active" : ""}`}
                onClick={() => toggleSection("tickets")}
              >
                <div>
                  <i className="fas fa-ticket-alt icon"></i>
                  <span>{sidebarItems.tickets.title}</span>
                </div>
                <i className={`fas fa-angle-down angle ${openSection === "tickets" ? "rotate-90" : ""}`}></i>
              </section>
              <div className={`sidebar-dropdown ${openSection === "tickets" ? "sidebar-group-link-active" : ""}`}>
                {sidebarItems.tickets.items
                  .filter((item) => hasPermission(item.permission))
                  .map((item) => (
                    <Link key={item.path} to={item.path} className="sidebar-link">
                      <i className={item.icon}></i>
                      <span>{item.label}</span>
                    </Link>
                  ))}
              </div>
            </>
          )}

          {/* سفارشات */}
          {hasPermission(sidebarItems.orders.permission) && (
            <Link to={sidebarItems.orders.path} className="sidebar-link">
              <i className={sidebarItems.orders.icon}></i>
              <span>{sidebarItems.orders.label}</span>
            </Link>
          )}

          {/* روش‌های ارسال */}
          {hasPermission(sidebarItems.deliveries.permission) && (
            <Link to={sidebarItems.deliveries.path} className="sidebar-link">
              <i className={sidebarItems.deliveries.icon}></i>
              <span>{sidebarItems.deliveries.label}</span>
            </Link>
          )}

          {/* لاگین رجیستر */}
          {hasPermission(sidebarItems.loginRegister.permission) && (
            <Link to={sidebarItems.loginRegister.path} className="sidebar-link">
              <i className={sidebarItems.loginRegister.icon}></i>
              <span>{sidebarItems.loginRegister.label}</span>
            </Link>
          )}

          {/* صفحات اطلاع‌رسانی */}
          {hasPermission(sidebarItems.pages.permission) && (
            <Link to={sidebarItems.pages.path} className="sidebar-link">
              <i className={sidebarItems.pages.icon}></i>
              <span>{sidebarItems.pages.label}</span>
            </Link>
          )}
        </section>
      </section>
    </aside>
  );
}

AdminSidebar.propTypes = {
  // می‌تونی پراپ‌های دیگه‌ای اگه نیازه اضافه کنی
};

export default AdminSidebar;