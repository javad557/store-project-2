import { useState } from "react";
import { Link } from "react-router-dom";

function AdminSidebar() {
  const [isPostsDropdownOpen, setIsPostsDropdownOpen] = useState(false);

  const togglePostsDropdown = () => {
    setIsPostsDropdownOpen(!isPostsDropdownOpen);
  };

  return (
    <aside id="sidebar" className="sidebar">
      <section className="sidebar-container">
        <section className="sidebar-wrapper">
          <Link to="/admin/dashboard" className="sidebar-link">
            <i className="fas fa-home"></i>
            <span>خانه</span>
          </Link>

          {/* بخش ثابت مارکت */}
          <section className="sidebar-part-title">مارکت</section>

          <Link to="/admin/categories" className="sidebar-link">
            <span>دسته‌بندی‌ها</span>
          </Link>
        </section>
      </section>
    </aside>
  );
}

export default AdminSidebar;
