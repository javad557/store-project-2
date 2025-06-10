import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} closeOnClick />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={<div>صفحه داشبورد ادمین</div>}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
