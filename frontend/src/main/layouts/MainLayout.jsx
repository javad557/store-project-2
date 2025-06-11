import { Outlet } from "react-router-dom";
import "../styles/main.css";

function MainLayout() {
  return (
    <div className="min-vh-100 bg-light">
      <header className="bg-primary text-white p-3">
        <nav className="container d-flex flex-row-reverse justify-content-between align-items-center">
          <h1 className="h4 mb-0">فروشگاه</h1>
          <ul className="nav">
            <li className="nav-item">
              <a href="/" className="nav-link text-white">
                خانه
              </a>
            </li>
            <li className="nav-item">
              <a href="/products" className="nav-link text-white">
                محصولات
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="container py-4">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
