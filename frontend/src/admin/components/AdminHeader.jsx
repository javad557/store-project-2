import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../auth/services/authService";
import { showSuccess, showError } from "../../utils/notifications";
import logo from "/src/admin/assets/images/logo.png";
import { useQuery } from "@tanstack/react-query";
import { getNewTickets } from "../services/ticketService";
import { getNewComments } from "../services/market/commentService";
import PropTypes from "prop-types";

function AdminHeader({ toggleSidebar, user, isUserLoading, userError, isUserError }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const { data: newTickets = [], isError: isTicketError, error: ticketError, isLoading: isNewTicketLoading } = useQuery({
    queryKey: ["newTickets"],
    queryFn: async () => {
      const response = await getNewTickets();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });

  const { data: newComments = [], isError: isCommentError, isSuccess: isCommentSuccess, error: commentError, isLoading: isNewCommentLoading } = useQuery({
    queryKey: ["newComments"],
    queryFn: async () => {
      const response = await getNewComments();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });

  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleComments = () => setShowComments(!showComments);
  const toggleProfile = () => setShowProfile(!showProfile);

  const handleLogout = async () => {
    try {
      console.log("Starting logout...");
      localStorage.setItem("is_logging_out", "true");
      const response = await logout();
      console.log("Logout response:", response);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("otp_token");
      localStorage.removeItem("identifier");
      localStorage.removeItem("fingerprint");
      console.log("localStorage cleared");
      localStorage.removeItem("is_logging_out");
      showSuccess(response.message || "با موفقیت از سیستم خارج شدید");
      navigate("/auth/loginregister", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.setItem("is_logging_out", "true");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("otp_token");
      localStorage.removeItem("identifier");
      localStorage.removeItem("fingerprint");
      console.log("localStorage cleared in catch");
      localStorage.removeItem("is_logging_out");
      showError(error.message || "خطا در خروج از سیستم");
      navigate("/auth/loginregister", { replace: true });
    }
  };

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
                {isNewTicketLoading ? (
                  ""
                ) : (
                  newTickets.length > 0 && (
                    <sup className="badge badge-danger">{newTickets.length}</sup>
                  )
                )}
              </span>
              <ul
                className={`dropdown-menu ${showNotifications ? "show" : ""}`}
                style={{ left: "auto", right: 0 }}
              >
                <li className="dropdown-item">
                  <section className="d-flex justify-content-between">
                    <span className="px-2">
                      {newTickets.length > 0 && (
                        <span className="badge badge-danger">جدید</span>
                      )}
                    </span>
                  </section>
                </li>
                {isTicketError ? (
                  <li className="dropdown-item">
                    <p className="text-danger">
                      خطا در بارگذاری تیکت‌ها: {ticketError.message}
                    </p>
                  </li>
                ) : newTickets.length > 0 ? (
                  newTickets.map((newTicket, index) => (
                    <li key={newTicket.id || index} className="dropdown-item">
                      <section className="media">
                        <Link
                          to={`/admin/ticket/ticket/${newTicket.root_parent.id}`}
                          className="ticket-link"
                        >
                          <section>
                            <h5 className="notification-text">
                              {newTicket.user.full_name}
                            </h5>
                            <p className="notification-text">
                              {newTicket.body.substring(0, 25)}
                            </p>
                            <hr />
                          </section>
                        </Link>
                      </section>
                    </li>
                  ))
                ) : (
                  <li className="dropdown-item">
                    <p>هیچ تیکت جدیدی وجود ندارد</p>
                  </li>
                )}
              </ul>
            </span>
            <span className="ml-2 ml-md-4 position-relative">
              <span
                className="pointer dropdown-toggle"
                onClick={toggleComments}
                data-bs-toggle="dropdown"
              >
                <i className="far fa-comment-alt">
                  {newComments.length > 0 && (
                    <sup className="badge badge-danger">{newComments.length}</sup>
                  )}
                </i>
              </span>
              <ul
                className={`dropdown-menu ${showComments ? "show" : ""}`}
                style={{ left: "auto", right: 0 }}
              >
                {isCommentError ? (
                  <li className="dropdown-item">
                    <p className="text-danger">
                      خطا در بارگذاری کامنت‌ها: {commentError.message}
                    </p>
                  </li>
                ) : newComments.length > 0 ? (
                  newComments.map((newComment, index) => (
                    <li key={newComment.id || index} className="dropdown-item">
                      <section className="media">
                        <Link to={`/admin/market/comments`} className="ticket-link">
                          <section>
                            <h5 className="notification-text">
                              {newComment.user.full_name}
                            </h5>
                            <p className="notification-text">
                              {newComment.body.substring(0, 25)}
                            </p>
                            <hr />
                          </section>
                        </Link>
                      </section>
                    </li>
                  ))
                ) : (
                  <li className="dropdown-item">
                    <p>هیچ کامنت جدیدی وجود ندارد</p>
                  </li>
                )}
              </ul>
            </span>
            <span className="ml-3 ml-md-5 position-relative">
              <span
                className="pointer dropdown-toggle"
                onClick={toggleProfile}
                data-bs-toggle="dropdown"
              >
                {isUserLoading ? (
                  <span className="header-username">در حال دریافت اطلاعات</span>
                ) : isUserError ? (
                  <span className="header-username text-danger">
                    خطا در دریافت اطلاعات کاربر
                  </span>
                ) : user ? (
                  <span className="header-username">
                    {user.data?.data?.full_name || "کاربر"} <i className="fas fa-user user-icon me-2"></i>
                  </span>
                ) : (
                  <span className="header-username">کاربری یافت نشد</span>
                )}
              </span>
              <ul
                className={`dropdown-menu ${showProfile ? "show" : ""}`}
                style={{ left: "auto", right: 0 }}
              >
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> خروج
                  </button>
                </li>
              </ul>
            </span>
          </section>
        </section>
      </section>
    </header>
  );
}

AdminHeader.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  user: PropTypes.object,
  isUserLoading: PropTypes.bool.isRequired,
  userError: PropTypes.object,
  isUserError: PropTypes.bool.isRequired,
};

export default AdminHeader;