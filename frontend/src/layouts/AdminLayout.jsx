import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="min-vh-100 bg-light d-flex flex-row-reverse">
      <aside className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h2 className="h5 mb-4 text-end">پنل ادمین</h2>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a href="/admin/dashboard" className="nav-link text-white text-end">
              داشبورد
            </a>
          </li>
          <li className="nav-item">
            <a href="/admin/products" className="nav-link text-white text-end">
              محصولات
            </a>
          </li>
        </ul>
      </aside>
      <div className="flex-grow-1">
        <header className="bg-white p-3 shadow-sm">
          <h1 className="h4 mb-0 text-end">پنل مدیریت</h1>
        </header>
        <main className="container py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
