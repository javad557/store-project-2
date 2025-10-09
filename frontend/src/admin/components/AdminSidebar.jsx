import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function AdminSidebar({ user, isUserLoading, userError, isUserError }) {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <aside id="sidebar" className="sidebar">
      <section className="sidebar-container" style={{ height: "100vh", overflowY: "auto" }}>

        <section className="sidebar-wrapper">
          <Link to="/admin/dashboard" className="sidebar-link">
            <i className="fas fa-home"></i>
            <span>خانه</span>
          </Link>
          {/* بخش مارکت */}
          <section
            className={`sidebar-part-title sidebar-dropdown-toggle ${openSection === "market" ? "sidebar-group-link-active" : ""}`}
            onClick={() => toggleSection("market")}
          >
            <div>
              <i className="fas fa-shopping-cart icon"></i>
              <span>مارکت</span>
            </div>
            <i className={`fas fa-angle-down angle ${openSection === "market" ? "rotate-90" : ""}`}></i>
          </section>
          <div className={`sidebar-dropdown ${openSection === "market" ? "sidebar-group-link-active" : ""}`}>
            <Link to="/admin/market/categories" className="sidebar-link">
              <i className="fas fa-list"></i>
              <span>دسته‌بندی‌ها</span>
            </Link>
            <Link to="/admin/market/brands" className="sidebar-link">
              <i className="fas fa-tag"></i>
              <span>برندها</span>
            </Link>
            <Link to="/admin/market/products" className="sidebar-link">
              <i className="fas fa-box"></i>
              <span>محصولات</span>
            </Link>
            <Link to="/admin/market/comments" className="sidebar-link">
              <i className="fas fa-comment"></i>
              <span>نظرات</span>
            </Link>
          </div>
          {/* سایر بخش‌ها مانند مارکتینگ، کاربران، تیکت‌ها و ... بدون تغییر */}
          <section
            className={`sidebar-part-title sidebar-dropdown-toggle ${openSection === "marketing" ? "sidebar-group-link-active" : ""}`}
            onClick={() => toggleSection("marketing")}
          >
            <div>
              <i className="fas fa-bullhorn icon"></i>
              <span>مارکتینگ</span>
            </div>
            <i className={`fas fa-angle-down angle ${openSection === "marketing" ? "rotate-90" : ""}`}></i>
          </section>
          <div className={`sidebar-dropdown ${openSection === "marketing" ? "sidebar-group-link-active" : ""}`}>
            <Link to="/admin/marketing/banners" className="sidebar-link">
              <i className="fas fa-image"></i>
              <span>بنرها</span>
            </Link>
            <Link to="/admin/marketing/copans" className="sidebar-link">
              <i className="fas fa-ticket-alt"></i>
              <span>کدهای تخفیف</span>
            </Link>
            <Link to="/admin/marketing/amazings" className="sidebar-link">
              <i className="fas fa-star"></i>
              <span>فروش شگفت‌انگیز</span>
            </Link>
          </div>
          <section
            className={`sidebar-part-title sidebar-dropdown-toggle ${openSection === "users" ? "sidebar-group-link-active" : ""}`}
            onClick={() => toggleSection("users")}
          >
            <div>
              <i className="fas fa-users icon"></i>
              <span>کاربران و دسترسی‌ها</span>
            </div>
            <i className={`fas fa-angle-down angle ${openSection === "users" ? "rotate-90" : ""}`}></i>
          </section>
          <div className={`sidebar-dropdown ${openSection === "users" ? "sidebar-group-link-active" : ""}`}>
            <Link to="/admin/user/customerusers" className="sidebar-link">
              <i className="fas fa-user"></i>
              <span>کاربران</span>
            </Link>
            <Link to="/admin/user/adminusers" className="sidebar-link">
              <i className="fas fa-user-shield"></i>
              <span>کاربران ادمین</span>
            </Link>
            <Link to="/admin/user/permissions" className="sidebar-link">
              <i className="fas fa-key"></i>
              <span>دسترسی‌ها</span>
            </Link>
            <Link to="/admin/user/roles" className="sidebar-link">
              <i className="fas fa-user-tag"></i>
              <span>نقش‌ها</span>
            </Link>
          </div>
          <section
            className={`sidebar-part-title sidebar-dropdown-toggle ${openSection === "tickets" ? "sidebar-group-link-active" : ""}`}
            onClick={() => toggleSection("tickets")}
          >
            <div>
              <i className="fas fa-users icon"></i>
              <span>تیکت‌ها</span>
            </div>
            <i className={`fas fa-angle-down angle ${openSection === "tickets" ? "rotate-90" : ""}`}></i>
          </section>
          <div className={`sidebar-dropdown ${openSection === "tickets" ? "sidebar-group-link-active" : ""}`}>
            <Link to="/admin/ticket/tickets" className="sidebar-link">
              <i className="fas fa-ticket-alt"></i>
              <span>تیکت‌ها</span>
            </Link>
            <Link to="/admin/ticket/category_tickets" className="sidebar-link">
              <i className="fas fa-folder"></i>
              <span>دسته‌بندی تیکت‌ها</span>
            </Link>
            <Link to="/admin/ticket/priority_tickets" className="sidebar-link">
              <i className="fas fa-exclamation-circle"></i>
              <span>اولویت تیکت‌ها</span>
            </Link>
          </div>
          <Link to="/admin/orders" className="sidebar-link">
            <i className="fas fa-shopping-bag"></i>
            <span>سفارشات</span>
          </Link>
          <Link to="/admin/deliveries" className="sidebar-link">
            <i className="fas fa-truck"></i>
            <span>روش‌های ارسال</span>
          </Link>
          <Link to="/admin/loginregistermanagment" className="sidebar-link">
            <i className="fas fa-sign-in-alt"></i>
            <span>لاگین رجیستر</span>
          </Link>
          <Link to="/admin/pages" className="sidebar-link">
            <i className="fas fa-file-alt"></i>
            <span>صفحات اطلاع‌رسانی</span>
          </Link>
        </section>
      </section>
    </aside>
  );
}

AdminSidebar.propTypes = {
  user: PropTypes.object,
  isUserLoading: PropTypes.bool.isRequired,
  userError: PropTypes.object,
  isUserError: PropTypes.bool.isRequired,
};

export default AdminSidebar;