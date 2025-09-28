import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import MainLayout from "./main/layouts/MainLayout";
import AdminLayout from "./admin/layouts/AdminLayout";
import Home from "./main/pages/Home";
import Dashboard from "./admin/pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
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
import Deliveries from "./admin/pages/delivery/Deliveries";
import AddDelivery from "./admin/pages/delivery/AddDelivery";
import EditDelivery from "./admin/pages/delivery/EditDelivery";
import LoginRegisterSettings from "./admin/pages/loginregistermanagment/LoginRegisterManagment";
import LoginRegister from "./auth/pages/LoginRegister";
import OtpVerify from "./auth/pages/OtpVerify";
import Terms from "./auth/pages/Terms";
import RecoveryCodes from "./auth/pages/RecoveryCodes";
import TwoFactorVerify from "./auth/pages/TwoFactorVerify";

function App() {
  console.log("App component rendered");
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={5000} closeOnClick />
        <Routes>
          {/* روت‌های عمومی */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/auth">
            <Route path="loginregister" element={<LoginRegister />} />
            <Route path="otpverify" element={<OtpVerify />} />
            <Route path="terms" element={<Terms />} />
            <Route path="recovery-codes" element={<RecoveryCodes />} />
            <Route path="two-factor" element={<TwoFactorVerify />} />
          </Route>

          {/* روت‌های محافظت‌شده */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute position="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="market">
              <Route
                path="categories"
                element={
                  <ProtectedRoute requiredPermission="read_categories">
                    <Categories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="categories/add"
                element={
                  <ProtectedRoute requiredPermission="add_category">
                    <AddCategory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="categories/edit/:id"
                element={
                  <ProtectedRoute requiredPermission="edit_category">
                    <EditCategory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="brands"
                element={
                  <ProtectedRoute requiredPermission="read_brands">
                    <Brands />
                  </ProtectedRoute>
                }
              />
              <Route
                path="brands/add"
                element={
                  <ProtectedRoute requiredPermission="add_brand">
                    <AddBrand />
                  </ProtectedRoute>
                }
              />
              <Route
                path="brands/edit/:id"
                element={
                  <ProtectedRoute requiredPermission="edit_brand">
                    <EditBrand />
                  </ProtectedRoute>
                }
              />
              <Route
                path="products"
                element={
                  <ProtectedRoute requiredPermission="read_products">
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="products/add"
                element={
                  <ProtectedRoute requiredPermission="add_product">
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="products/edit/:id"
                element={
                  <ProtectedRoute requiredPermission="edit_product">
                    <EditProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="guarantees/:productId"
                element={
                  <ProtectedRoute requiredPermission="read_guarantees">
                    <Guarantees />
                  </ProtectedRoute>
                }
              />
              <Route
                path="guarantees/add/:productId"
                element={
                  <ProtectedRoute requiredPermission="add_guarantee">
                    <AddGuarantee />
                  </ProtectedRoute>
                }
              />
              <Route
                path="guarantees/edit/:guaranteeId/:productId"
                element={
                  <ProtectedRoute requiredPermission="edit_guarantee">
                    <EditGuarantee />
                  </ProtectedRoute>
                }
              />
              <Route
                path="gallery/:productId"
                element={
                  <ProtectedRoute requiredPermission="read_products">
                    <Gallery />
                  </ProtectedRoute>
                }
              />
              <Route
                path="gallery/add/:productId"
                element={
                  <ProtectedRoute requiredPermission="add_product">
                    <AddImage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="variants/:productId"
                element={
                  <ProtectedRoute requiredPermission="read_variants">
                    <Variants />
                  </ProtectedRoute>
                }
              />
              <Route
                path="variants/variantmanagement/:productId"
                element={
                  <ProtectedRoute requiredPermission="variant_management">
                    <VariantManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="comments"
                element={
                  <ProtectedRoute requiredPermission="read_comments">
                    <Comments />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="marketing">
              <Route
                path="banners"
                element={
                  <ProtectedRoute requiredPermission="read_banners">
                    <Banners />
                  </ProtectedRoute>
                }
              />
              <Route
                path="banners/add"
                element={
                  <ProtectedRoute requiredPermission="add_banner">
                    <AddBanner />
                  </ProtectedRoute>
                }
              />
              <Route
                path="banners/edit/:id"
                element={
                  <ProtectedRoute requiredPermission="edit_banner">
                    <EditBanner />
                  </ProtectedRoute>
                }
              />
              <Route
                path="copans"
                element={
                  <ProtectedRoute requiredPermission="read_copans">
                    <Copans />
                  </ProtectedRoute>
                }
              />
              <Route
                path="copans/add"
                element={
                  <ProtectedRoute requiredPermission="add_copan">
                    <AddCopan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="copans/edit/:id"
                element={
                  <ProtectedRoute requiredPermission="edit_copan">
                    <EditCopan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="amazings"
                element={
                  <ProtectedRoute requiredPermission="read_amazings">
                    <Amazings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="amazings/add"
                element={
                  <ProtectedRoute requiredPermission="add_amazing">
                    <AddAmazing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="amazings/edit/:id"
                element={
                  <ProtectedRoute requiredPermission="edit_amazing">
                    <EditAmazing />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="user">
              <Route
                path="permissions"
                element={
                  <ProtectedRoute requiredPermission="read_permissions">
                    <Permissions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="permissions/add"
                element={
                  <ProtectedRoute requiredPermission="add_permission">
                    <AddPermission />
                  </ProtectedRoute>
                }
              />
              <Route
                path="roles"
                element={
                  <ProtectedRoute requiredPermission="read_roles">
                    <Roles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="roles/add"
                element={
                  <ProtectedRoute requiredPermission="add_role">
                    <AddRole />
                  </ProtectedRoute>
                }
              />
              <Route
                path="adminusers"
                element={
                  <ProtectedRoute requiredPermission="read_adminusers">
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="adminusers/add"
                element={
                  <ProtectedRoute requiredPermission="add_adminuser">
                    <AddAdminUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="adminusers/edit/:id"
                element={
                  <ProtectedRoute requiredPermission="edit_adminuser">
                    <EditAdminUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="customerusers"
                element={
                  <ProtectedRoute requiredPermission="read_customerusers">
                    <CustomerUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="customerusers/edit/:id"
                element={
                  <ProtectedRoute requiredPermission="edit_customeruser">
                    <EditCustomerUser />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route
              path="deliveries"
              element={
                <ProtectedRoute requiredPermission="read_deliveries">
                  <Deliveries />
                </ProtectedRoute>
              }
            />
            <Route
              path="deliveries/add"
              element={
                <ProtectedRoute requiredPermission="add_delivery">
                  <AddDelivery />
                </ProtectedRoute>
              }
            />
            <Route
              path="deliveries/edit/:id"
              element={
                <ProtectedRoute requiredPermission="edit_delivery">
                  <EditDelivery />
                </ProtectedRoute>
              }
            />
            <Route
              path="loginregistermanagment"
              element={
                <ProtectedRoute requiredPermission="loginresiter_managment">
                  <LoginRegisterSettings />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<div>404 - صفحه پیدا نشد</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;