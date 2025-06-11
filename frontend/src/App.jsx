import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./main/layouts/MainLayout";
import AdminLayout from "./admin/layouts/AdminLayout";
import Home from "./main/pages/Home";
import Dashboard from "./admin/pages/Dashboard";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} closeOnClick />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="*" element={<div>404 - صفحه پیدا نشد</div>} />
      </Routes>
    </Router>
  );
}

export default App;
