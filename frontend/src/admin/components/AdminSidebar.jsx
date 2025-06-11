import { useState } from "react";

function AdminSidebar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <aside id="sidebar" className="sidebar">
      <section className="sidebar-container">
        <section className="sidebar-wrapper">
          <a href="#" className="sidebar-link">
            <i className="fas fa-home"></i>
            <span>خانه</span>
          </a>

          <section className="sidebar-part-title">بخش محتوی</section>

          <section className="sidebar-group-link">
            <section
              className="sidebar-dropdown-toggle pointer"
              onClick={toggleDropdown}
            >
              <i className="fas fa-chart-bar icon"></i>
              <span>نوشته‌ها</span>
              <i
                className={`fas fa-angle-left angle ${
                  isDropdownOpen ? "rotate-90" : ""
                }`}
              ></i>
            </section>
            <section
              className={`sidebar-dropdown ${isDropdownOpen ? "" : "d-none"}`}
            >
              <a href="#">مقالات</a>
              <a href="#">پست‌ها</a>
              <a href="#">دوره‌ها</a>
            </section>
          </section>
        </section>
      </section>
    </aside>
  );
}

export default AdminSidebar;
