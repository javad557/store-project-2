import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./main/layouts/MainLayout";
import AdminLayout from "./admin/layouts/AdminLayout";
import Home from "./main/pages/Home";
import Dashboard from "./admin/pages/Dashboard";

import Categories from "./admin/pages/market/categories/Categories";
import AddCategory from "./admin/pages/market/categories/AddCategory";
import EditCategory from "./admin/pages/market/categories/EditCategory";

import Brands from "./admin/pages/market/brands/Brands";
import AddBrand from "./admin/pages/market/brands/AddBrand";
import EditBrand from "./admin/pages/market/brands/EditBrand";

import Products from "./admin/pages/market/products/Products";
import AddProduct from "./admin/pages/market/products/AddProduct";
import EditProduct from "./admin/pages/market/products/EditProduct";

import Guarantees from "./admin/pages/market/guarantees/Guarantees";
import AddGuarantee from "./admin/pages/market/guarantees/AddGuarantee";
import EditGuarantee from "./admin/pages/market/guarantees/EditGuarantee";

import Gallery from "./admin/pages/market/gallery/Gallery";
import AddImage from "./admin/pages/market/gallery/AddImage";

import Variants from "./admin/pages/market/variants/Variants";
import VariantManagement from "./admin/pages/market/variants/VariantManagement";


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
            <Route path="market">
              
                <Route path="categories" element={<Categories />} />
                <Route path="categories/add" element={<AddCategory />} />
                <Route path="categories/edit/:id" element={<EditCategory />} />

                <Route path="brands" element={<Brands />} />
                <Route path="brands/add" element={<AddBrand />} />
                <Route path="brands/edit/:id" element={<EditBrand />} />

                <Route path="products" element={<Products />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />

                <Route path="guarantees/:productId" element={<Guarantees />} />
                <Route path="guarantees/add/:productId" element={<AddGuarantee />} />
                <Route path="guarantees/edit/:guaranteeId/:productId" element={<EditGuarantee />} />

                <Route path="gallery/:productId" element={<Gallery />} />
                <Route path="gallery/add/:productId" element={<AddImage />} />

                <Route path="variants/:productId" element={<Variants />} />
                <Route path="variants/variantmanagement/:productId" element={<VariantManagement />} />

            </Route>
        </Route>
        <Route path="*" element={<div>404 - صفحه پیدا نشد</div>} />
      </Routes>
    </Router>
  );
}

export default App;
