import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./main/layouts/MainLayout";
import AdminLayout from "./admin/layouts/AdminLayout";
import Home from "./main/pages/Home";
import Dashboard from "./admin/pages/Dashboard";
import Categories from "./admin/pages/categories/Categories";
import AddCategory from "./admin/pages/categories/AddCategory";
import EditCategory from "./admin/pages/categories/EditCategory";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} closeOnClick />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />
        </Route>
        <Route path="*" element={<div>404 - صفحه پیدا نشد</div>} />
      </Routes>
    </Router>
  );
}

export default App;
