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

import Comments from "./admin/pages/market/comments/Comments";




import Banners from "./admin/pages/marketing/banners/Banners";
import AddBanner from "./admin/pages/marketing/banners/AddBanner";
import EditBanner from "./admin/pages/marketing/banners/EditBanner";

import Copans from "./admin/pages/marketing/copans/Copans";
import AddCopan from "./admin/pages/marketing/copans/AddCopan";
import EditCopan from "./admin/pages/marketing/copans/EditCopan";

import Amazings from "./admin/pages/marketing/amazings/Amazings";
import AddAmazing from "./admin/pages/marketing/amazings/AddAmazing";
import EditAmazing from "./admin/pages/marketing/amazings/EditAmazing";



import Permissions from "./admin/pages/user/permission/Permissions";
import AddPermission from "./admin/pages/user/permission/AddPermission";


import Roles from "./admin/pages/user/role/Roles";
import AddRole from "./admin/pages/user/role/AddRole";

import AdminUsers from "./admin/pages/user/adminuser/AdminUsers";
import AddAdminUser from "./admin/pages/user/adminuser/AddAdminUser";
import EditAdminUser from "./admin/pages/user/adminuser/EditAdminUser";

import CustomerUsers from "./admin/pages/user/customeruser/CustomerUsers";
import EditCustomerUser from "./admin/pages/user/customeruser/EditCustomerUser";


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

                <Route path="comments" element={<Comments />} />

            </Route>

            <Route path="marketing">

              <Route path="banners" element={<Banners />} />
              <Route path="banners/add" element={<AddBanner />} />
              <Route path="banners/edit/:id" element={<EditBanner />} />


              <Route path="copans" element={<Copans />} />
              <Route path="copans/add" element={<AddCopan />} />
              <Route path="copans/edit/:id" element={<EditCopan />} />

              <Route path="amazings" element={<Amazings />} />
              <Route path="amazings/add" element={<AddAmazing />} />
              <Route path="amazings/edit/:id" element={<EditAmazing />} />

            </Route>

             <Route path="user">

              <Route path="permissions" element={<Permissions />} />
              <Route path="permissions/add" element={<AddPermission />} />

              <Route path="roles" element={<Roles />} />
              <Route path="roles/add" element={<AddRole />} />

              <Route path="adminusers" element={<AdminUsers />} />
              <Route path="adminusers/add" element={<AddAdminUser />} />
              <Route path="adminusers/edit/:id" element={<EditAdminUser />} />

              <Route path="customerusers" element={<CustomerUsers />} />
              <Route path="customerusers/edit/:id" element={<EditCustomerUser />} />




             </Route>
        </Route>
        <Route path="*" element={<div>404 - صفحه پیدا نشد</div>} />
      </Routes>
    </Router>
  );
}

export default App;
