import { Outlet } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import "../styles/css/style.css";
import "../styles/css/cart.css";
import "../styles/css/address.css";
import "../styles/css/payment.css";
import "../styles/css/filter.css";
import "../styles/css/product.css";
import "../styles/css/profile.css";
import "../styles/css/bootstrap/bootstrap-reboot.rtl.min.css";
import "../styles/css/bootstrap/bootstrap.rtl.min.css";
import "../styles/fontawesome/css/all.min.css";




function MainLayout() {
  return (

    <div className="" dir="rtl">
    <MainHeader/>
    
    <main id="main-body-one-col" class="main-body">
       <Outlet />

    </main>
    </div>
   
  );
}

export default MainLayout;
