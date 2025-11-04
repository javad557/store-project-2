import { Outlet } from "react-router-dom";
import ProfileSidebar from "../components/ProfileSidebar";


function MainProfile (){
    return (
        <section className="row">
            <aside id="sidebar" className=" col-md-3">
                <ProfileSidebar/>
            </aside>
            <main id="main-body" className=" col-md-9">
                <Outlet/>
            </main>
        </section>
    )
}

export default MainProfile;