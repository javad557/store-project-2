import { useState } from "react";
import logo from "/src/admin/assets/images/logo.png";
import avatar from "/src/admin/assets/images/avatar-2.jpg";

function AdminHeader({ toggleSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleComments = () => setShowComments(!showComments);
  const toggleProfile = () => setShowProfile(!showProfile);

  return (
    <header className="header">
      <section className="sidebar-header bg-gray">
        <section className="d-flex justify-content-between flex-md-row-reverse px-2">
          <span
            id="sidebar-toggle-show"
            className="d-inline d-md-none pointer"
            onClick={toggleSidebar}
          >
            <i className="fas fa-toggle-off"></i>
          </span>
          <span
            id="sidebar-toggle-hide"
            className="d-none d-md-inline pointer"
            onClick={toggleSidebar}
          >
            <i className="fas fa-toggle-on"></i>
          </span>
          <span>
            <img className="logo" src={logo} alt="Logo" />
          </span>
          <span id="menu-toggle" className="d-md-none">
            <i className="fas fa-ellipsis-h"></i>
          </span>
        </section>
      </section>
      <section className="body-header">
        <section className="d-flex justify-content-between">
          <section>
            <span className="mr-5">
              <i className="fas fa-search p-1 mx-2 d-md-inline pointer"></i>
            </span>
            <span
              id="full-screen"
              className="pointer p-1 d-none d-md-inline mx-5"
            >
              <i className="fas fa-indent"></i>
            </span>
          </section>
          <section>
            <span className="ml-2 ml-md-4 position-relative">
              <span
                className="pointer dropdown-toggle"
                onClick={toggleNotifications}
                data-bs-toggle="dropdown"
              >
                <i className="far fa-bell"></i>
                <sup className="badge badge-danger">4</sup>
              </span>
              <ul
                className={`dropdown-menu ${showNotifications ? "show" : ""}`}
                style={{ left: "auto", right: 0 }}
              >
                <li className="dropdown-item">
                  <section className="d-flex justify-content-between">
                    <span className="px-2">نوتیفیکیشن‌ها</span>
                    <span className="px-2">
                      <span className="badge badge-danger">جدید</span>
                    </span>
                  </section>
                </li>
                <li className="dropdown-item">
                  <section className="media">
                    <img
                      className="notification-img"
                      src={avatar}
                      alt="Avatar"
                    />
                    <section className="media-body pr-1">
                      <h5 className="notification-user">محمد هاشمی</h5>
                      <p className="notification-text">این یک متن تستی است</p>
                      <p className="notification-time">30 دقیقه پیش</p>
                    </section>
                  </section>
                </li>
              </ul>
            </span>
            <span className="ml-2 ml-md-4 position-relative">
              <span
                className="pointer dropdown-toggle"
                onClick={toggleComments}
                data-bs-toggle="dropdown"
              >
                <i className="far fa-comment-alt">
                  <sup className="badge badge-danger">3</sup>
                </i>
              </span>
              <ul
                className={`dropdown-menu ${showComments ? "show" : ""}`}
                style={{ left: "auto", right: 0 }}
              >
                <li className="dropdown-item">
                  <input
                    type="text"
                    className="form-control form-control-sm my-2 mx-2"
                    placeholder="جستجو ..."
                  />
                </li>
                <li className="dropdown-item">
                  <section className="media">
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="notification-img"
                    />
                    <section className="media-body pr-1">
                      <section className="d-flex justify-content-between">
                        <h5 className="comment-user">محمد هاشمی</h5>
                        <span>
                          <i className="fas fa-circle text-success comment-user-status"></i>
                        </span>
                      </section>
                    </section>
                  </section>
                </li>
              </ul>
            </span>
            <span className="ml-3 ml-md-5 position-relative">
              <span
                className="pointer dropdown-toggle"
                onClick={toggleProfile}
                data-bs-toggle="dropdown"
              >
                <img className="header-avatar" src={avatar} alt="Avatar" />
                <span className="header-username">کامران محمدی</span>
                <i className="fas fa-angle-down"></i>
              </span>
              <ul
                className={`dropdown-menu ${showProfile ? "show" : ""}`}
                style={{ left: "auto", right: 0 }}
              >
                <li>
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-sign-out-alt"></i> خروج
                  </a>
                </li>
              </ul>
            </span>
          </section>
        </section>
      </section>
    </header>
  );
}

export default AdminHeader;
