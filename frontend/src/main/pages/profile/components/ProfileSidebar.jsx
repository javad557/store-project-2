import { Link } from "react-router-dom";


function ProfileSidebar (){
    return(
        
        <section className="content-wrapper bg-white p-3 rounded-2 mb-3">
                      
            <section className="sidebar-nav">
                <section className="sidebar-nav-item">
                    <span className="sidebar-nav-item-title"><Link className="p-3" to={`/main/profile/my-orders`}>سفارش های من</Link></span>
                </section>
                <section className="sidebar-nav-item">
                    <span className="sidebar-nav-item-title"><Link className="p-3" to={`/main/profile/my-addresses`}>آدرس های من</Link></span>
                </section>
                <section className="sidebar-nav-item">
                    <span className="sidebar-nav-item-title"><Link className="p-3" to={`/main/profile/my-favorites`}>لیست علاقه مندی</Link></span>
                </section>
                <section className="sidebar-nav-item">
                    <span className="sidebar-nav-item-title"><Link className="p-3" to={`/main/profile/my-profile`}>پروفایل</Link></span>
                </section>
                <section className="sidebar-nav-item">
                    <span className="sidebar-nav-item-title"><Link className="p-3" to={`/main/profile/my-tickets`}>تیکت ها</Link></span>
                </section>   
            </section>
        </section>
    )
}

export default ProfileSidebar;