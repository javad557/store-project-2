import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./main/layouts/MainLayout";
import Home from "./main/pages/Home";
import Dashboard from "./admin/pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Categories from "./admin/pages/market/categories/Categories";
import AddCategory from "./admin/pages/market/categories/AddCategory";
import EditCategory from "./admin/pages/market/categories/EditCategory";
import Brands from "./admin/pages/market/brands/Brands";
import AddBrand from "./admin/pages/market/brands/AddBrand";
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
import Pages from "./admin/pages/pages/Pages.jsx";
import AddPage from "./admin/pages/pages/AddPage.jsx";
import Editpage from "./admin/pages/pages/EditPage.jsx";
import Orders from "./admin/pages/order/Orders.jsx";
import DetailOrder from "./admin/pages/order/detail.jsx";
import OrderItems from "./admin/pages/order/orderItems.jsx";
import Tickets from "./admin/pages/ticket/Tickets.jsx";
import Ticket from "./admin/pages/ticket/Ticket.jsx";
import CategoryTickets from "./admin/pages/ticket/category/CategoryTickets.jsx";
import AddCategoryTicket from "./admin/pages/ticket/category/AddCategoryTicket.jsx";
import PriorityTickets from "./admin/pages/ticket/priority/PriorityTickets.jsx";
import AddPriorityTicket from "./admin/pages/ticket/priority/AddPriorityTicket.jsx";
import {AuthProvider } from "./context/AuthContext.jsx";
import MyAddresses from "./main/pages/profile/MyAddresses.jsx";
import MyComparison from "./main/pages/profile/MyComparison.jsx";
import MyFavorites from "./main/pages/profile/MyFavorites.jsx";
import MyOrders from "./main/pages/profile/MyOrders.jsx";
import MyProfile from "./main/pages/profile/MyProfile.jsx";
import MyTickets from "./main/pages/profile/tickets/MyTickets.jsx";
import Product from "./main/pages/market/product.jsx";
import AllProducts from "./main/pages/market/products.jsx";
import ChooseAddressAndDelivery from "./main/pages/cart/ChooseAddressAndDelivery.jsx";
import Payment from "./main/pages/cart/payment.jsx";
import ProfileComplition from "./main/pages/cart/ProfileComplition.jsx";
import AddressEdit from "./main/pages/cart/addressEdit.jsx";
import MainProfile from "./main/pages/profile/layouts/MainProfile.jsx";
import AddAddress from "./main/pages/profile/AddAddress.jsx";
import AddTicket from "./main/pages/profile/tickets/AddTicket.jsx";
import ShowTicket from "./main/pages/profile/tickets/ShowTicket.jsx";
import Cart from "./main/pages/cart/Cart.jsx";
import InformationPages from "./main/pages/InformationPages.jsx";
import EditProfile from "./main/pages/profile/EditProfile.jsx";
import AdminLayout from "./admin/layouts/AdminLayout.jsx";
import ProtectedMainRoute from "./components/ProtectedMainRoute";
import MyOrderItems from "./main/pages/profile/MyOrderItems.jsx";
import EditAddress from "./main/pages/profile/EditAddress.jsx";


function App() {
  return (
    <Router>
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

       <Route path="/admin" element={
        <AuthProvider isAdmin={true}>
          <ProtectedRoute>
              <AdminLayout/>
          </ProtectedRoute>
        </AuthProvider>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="market">
            <Route path="categories" element={<ProtectedRoute requiredPermission="read_categories"><Categories /></ProtectedRoute>} />
            <Route path="categories/add" element={<ProtectedRoute requiredPermission="add_category"><AddCategory /></ProtectedRoute>} />
            <Route path="categories/edit/:id" element={<ProtectedRoute requiredPermission="edit_category"><EditCategory /></ProtectedRoute>} />
            <Route path="brands" element={<ProtectedRoute requiredPermission="read_brands"><Brands /></ProtectedRoute>} />
            <Route path="brands/add" element={<ProtectedRoute requiredPermission="add_brand"><AddBrand /></ProtectedRoute>} />
            <Route path="products" element={<ProtectedRoute requiredPermission="read_products"><Products /></ProtectedRoute>} />
            <Route path="products/add" element={<ProtectedRoute requiredPermission="add_product"><AddProduct /></ProtectedRoute>} />
            <Route path="products/edit/:id" element={<ProtectedRoute requiredPermission="edit_product"><EditProduct /></ProtectedRoute>} />
            <Route path="guarantees/:productId" element={<ProtectedRoute requiredPermission="read_guarantees"><Guarantees /></ProtectedRoute>} />
            <Route path="guarantees/add/:productId" element={<ProtectedRoute requiredPermission="add_guarantee"><AddGuarantee /></ProtectedRoute>} />
            <Route path="guarantees/edit/:guaranteeId/:productId" element={<ProtectedRoute requiredPermission="edit_guarantee"><EditGuarantee /></ProtectedRoute>} />
            <Route path="gallery/:productId" element={<ProtectedRoute requiredPermission="read_products"><Gallery /></ProtectedRoute>} />
            <Route path="gallery/add/:productId" element={<ProtectedRoute requiredPermission="add_product"><AddImage /></ProtectedRoute>} />
            <Route path="variants/:productId" element={<ProtectedRoute requiredPermission="read_variants"><Variants /></ProtectedRoute>} />
            <Route path="variants/variantmanagement/:productId" element={<ProtectedRoute requiredPermission="variant_management"><VariantManagement /></ProtectedRoute>} />
            <Route path="comments" element={<ProtectedRoute requiredPermission="read_comments"><Comments /></ProtectedRoute>} />
          </Route>
          <Route path="marketing">
            <Route path="banners" element={<ProtectedRoute requiredPermission="read_banners"><Banners /></ProtectedRoute>} />
            <Route path="banners/add" element={<ProtectedRoute requiredPermission="add_banner"><AddBanner /></ProtectedRoute>} />
            <Route path="banners/edit/:id" element={<ProtectedRoute requiredPermission="edit_banner"><EditBanner /></ProtectedRoute>} />
            <Route path="copans" element={<ProtectedRoute requiredPermission="read_copans"><Copans /></ProtectedRoute>} />
            <Route path="copans/add" element={<ProtectedRoute requiredPermission="add_copan"><AddCopan /></ProtectedRoute>} />
            <Route path="copans/edit/:id" element={<ProtectedRoute requiredPermission="edit_copan"><EditCopan /></ProtectedRoute>} />
            <Route path="amazings" element={<ProtectedRoute requiredPermission="read_amazings"><Amazings /></ProtectedRoute>} />
            <Route path="amazings/add" element={<ProtectedRoute requiredPermission="add_amazing"><AddAmazing /></ProtectedRoute>} />
            <Route path="amazings/edit/:id" element={<ProtectedRoute requiredPermission="edit_amazing"><EditAmazing /></ProtectedRoute>} />
          </Route>
          <Route path="user">
            <Route path="permissions" element={<ProtectedRoute requiredPermission="read_permissions"><Permissions /></ProtectedRoute>} />
            <Route path="permissions/add" element={<ProtectedRoute requiredPermission="add_permission"><AddPermission /></ProtectedRoute>} />
            <Route path="roles" element={<ProtectedRoute requiredPermission="read_roles"><Roles /></ProtectedRoute>} />
            <Route path="roles/add" element={<ProtectedRoute requiredPermission="add_role"><AddRole /></ProtectedRoute>} />
            <Route path="adminusers" element={<ProtectedRoute requiredPermission="read_adminusers"><AdminUsers /></ProtectedRoute>} />
            <Route path="adminusers/add" element={<ProtectedRoute requiredPermission="edit_adminuser"><AddAdminUser /></ProtectedRoute>} />
            <Route path="adminusers/edit/:id" element={<ProtectedRoute requiredPermission="edit_adminuser"><EditAdminUser /></ProtectedRoute>} />
            <Route path="customerusers" element={<ProtectedRoute requiredPermission="read_customerusers"><CustomerUsers /></ProtectedRoute>} />
            <Route path="customerusers/edit/:id" element={<ProtectedRoute requiredPermission="edit_customeruser"><EditCustomerUser /></ProtectedRoute>} />
          </Route>
          <Route path="deliveries" element={<ProtectedRoute requiredPermission="read_deliveries"><Deliveries /></ProtectedRoute>} />
          <Route path="deliveries/add" element={<ProtectedRoute requiredPermission="add_delivery"><AddDelivery /></ProtectedRoute>} />
          <Route path="deliveries/edit/:id" element={<ProtectedRoute requiredPermission="edit_delivery"><EditDelivery /></ProtectedRoute>} />
          <Route path="loginregistermanagment" element={<ProtectedRoute requiredPermission="loginresiter_managment"><LoginRegisterSettings /></ProtectedRoute>} />
          <Route path="pages" element={<ProtectedRoute requiredPermission="read_pages"><Pages /></ProtectedRoute>} />
          <Route path="pages/add" element={<ProtectedRoute requiredPermission="add_page"><AddPage /></ProtectedRoute>} />
          <Route path="pages/edit/:id" element={<ProtectedRoute requiredPermission="edit_page"><Editpage /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute requiredPermission="read_orders"><Orders /></ProtectedRoute>} />
          <Route path="orders/detail/:id" element={<ProtectedRoute requiredPermission="read_orders"><DetailOrder /></ProtectedRoute>} />
          <Route path="orders/order_items/:id" element={<ProtectedRoute requiredPermission="read_orders"><OrderItems /></ProtectedRoute>} />
          <Route path="ticket">
            <Route path="tickets" element={<ProtectedRoute requiredPermission="read_tickets"><Tickets /></ProtectedRoute>} />
            <Route path="ticket/:id" element={<ProtectedRoute requiredPermission="read_tickets"><Ticket /></ProtectedRoute>} />
            <Route path="category_tickets" element={<ProtectedRoute requiredPermission="read_tickets"><CategoryTickets /></ProtectedRoute>} />
            <Route path="category_tickets/add" element={<ProtectedRoute requiredPermission="read_tickets"><AddCategoryTicket /></ProtectedRoute>} />
            <Route path="priority_tickets" element={<ProtectedRoute requiredPermission="read_tickets"><PriorityTickets /></ProtectedRoute>} />
            <Route path="priority_tickets/add" element={<ProtectedRoute requiredPermission="read_tickets"><AddPriorityTicket /></ProtectedRoute>} />
          </Route>
        </Route>
        <Route path="*" element={<div>404 - صفحه پیدا نشد</div>} />
      


        {/* روت‌های مشتری با والد userAuthProvider */}
      <Route path="/main" element={
        <AuthProvider>
          <MainLayout/>
        </AuthProvider>
        }>
        <Route path="home" element={<Home />} />
        <Route path="profile" element={
          <ProtectedMainRoute>
              <MainProfile/>
          </ProtectedMainRoute>
          }>
          <Route path="my-addresses" element={<MyAddresses/>}/>
          <Route path="my-addresses/add" element={<AddAddress/>}/>
          <Route path="my-addresses/edit/:id" element={<EditAddress/>}/>
          <Route path="my-comparison" element={<MyComparison/>} />
          <Route path="my-favorites" element={<MyFavorites/>} />
          <Route path="my-orders" element={<MyOrders/>} />
          <Route path="my_order_items/:id" element={<MyOrderItems/>} />
          <Route path="my-profile" element={<MyProfile/>} />
          <Route path="my-profile/edit" element={<EditProfile/>} />
          <Route path="my-tickets" element={<MyTickets/>} />
          <Route path="my-tickets/add" element={<AddTicket/>} />
          <Route path="my-tickets/show/:id" element={<ShowTicket/>} />
        </Route>
        <Route path="market">
          <Route path="products" element={<AllProducts/>}/>
          <Route path="product/:id" element={<Product/>}/>
        </Route>
        <Route
            path="cart"
            element={
              <ProtectedRoute>
                <div>{/* این div برای جلوگیری از خطای رندر لازم است */}</div>
              </ProtectedRoute>
            }
          >
            <Route path="cddressedit" element={<AddressEdit/>}/>
            <Route path="chooseaddressanddelivery" element={<ChooseAddressAndDelivery/>}/>
            <Route path="cart" element={<Cart/>}/>
            <Route path="payment" element={<Payment/>}/>
            <Route path="profilecomplition" element={<ProfileComplition/>}/>
        </Route>
         <Route path="informationpages/:id" element={<InformationPages />} />
        </Route>
       </Routes>
    </Router>
  );
}

export default App;