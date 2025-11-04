import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

function MyProfile(){

    const { user, loading } = useAuth();

    console.log(loading);
    if(!loading){
        console.log(user);
        
    }
    

    return(
        <section className="row">
  <section className="content-wrapper bg-white p-3 rounded-2 mb-2">
    {/* start content header */}
    <section className="content-header mb-4">
      <section className="d-flex justify-content-between align-items-center">
        <h2 className="content-header-title">
          <span>اطلاعات حساب</span>
        </h2>
        <section className="content-header-link">
          {/*<a href="#">مشاهده همه</a>*/}
        </section>
      </section>
    </section>
    {/* end content header */}

    <section className="d-flex justify-content-end my-4">
      <Link className="btn btn-link btn-sm text-info text-decoration-none mx-1" to={`/main/profile/my-profile/edit`}>
        <i className="fa fa-edit px-1"></i>ویرایش حساب
      </Link>
    </section>
    {loading ? (
        <div className="text-center my-4">
              <p>در حال بارگذاری...</p>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">در حال بارگذاری...</span>
              </div>
        </div>

    ) : (
         <section className="row">
      <section className="col-6 border-bottom mb-2 py-2">
        <section className="field-title">نام</section>
        <section className="field-value overflow-auto">{user.name}</section>
      </section>

      <section className="col-6 border-bottom my-2 py-2">
        <section className="field-title">نام خانوادگی</section>
        <section className="field-value overflow-auto">{user.last_name}</section>
      </section>

      <section className="col-6 border-bottom my-2 py-2">
        <section className="field-title">شماره تلفن همراه</section>
        <section className="field-value overflow-auto">{user.mobile}</section>
      </section>

      <section className="col-6 border-bottom my-2 py-2">
        <section className="field-title">ایمیل</section>
        <section className="field-value overflow-auto">{user.email}</section>
      </section>

      <section className="col-6 my-2 py-2">
        <section className="field-title">کد ملی</section>
        <section className="field-value overflow-auto">{user.national_code}</section>
      </section>

    </section>

    )}

   

  </section>
</section>
    )
}

export default MyProfile;