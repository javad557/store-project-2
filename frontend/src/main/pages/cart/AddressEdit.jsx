
function AddressEdit(){
    return(
        <section className="row">
  <section className="address-add-wrapper">
    <form className="row" action="">
      <section className="col-6 mb-2">
        <label htmlFor="province" className="form-label mb-1">
          استان
        </label>
        <select name="province" className="form-select form-select-sm" id="province">
          <option value="">استان را انتخاب کنید</option>
        </select>
      </section>

      <section className="col-6 mb-2">
        <label htmlFor="city_id" className="form-label mb-1">
          شهر
        </label>
        <select name="city_id" className="form-select form-select-sm" id="city_id">
          <option value="">شهر را انتخاب کنید</option>
        </select>
      </section>

      <section className="col-12 mb-2">
        <label htmlFor="address" className="form-label mb-1">
          نشانی
        </label>
        <textarea
          name="address"
          id="address"
          cols="155"
          rows="5"
          className="form-control form-control-sm"
        ></textarea>
      </section>

      <section className="col-6 mb-2">
        <label htmlFor="postal_code" className="form-label mb-1">
          کد پستی
        </label>
        <input
          type="text"
          className="form-control form-control-sm"
          name="postal_code"
          id="postal_code"
        />
      </section>

      <section className="col-3 mb-2">
        <label htmlFor="no" className="form-label mb-1">
          پلاک
        </label>
        <input
          type="text"
          className="form-control form-control-sm"
          name="no"
          id="no"
        />
      </section>

      <section className="col-3 mb-2">
        <label htmlFor="unit" className="form-label mb-1">
          واحد
        </label>
        <input
          type="text"
          className="form-control form-control-sm"
          name="unit"
          id="unit"
        />
      </section>

      <section className="col-6 mb-2">
        <label htmlFor="mobile" className="form-label mb-1">
          شماره موبایل
        </label>
        <input
          type="text"
          className="form-control form-control-sm"
          name="mobile"
          id="mobile"
        />
      </section>

      <section className="col-6 mb-2">
        <label htmlFor="first_name" className="form-label mb-1">
          نام گیرنده
        </label>
        <input
          type="text"
          className="form-control form-control-sm"
          name="first_name"
          id="first_name"
        />
      </section>

      <section className="col-6 mb-2">
        <label htmlFor="last_name" className="form-label mb-1">
          نام خانوادگی گیرنده
        </label>
        <input
          type="text"
          className="form-control form-control-sm"
          name="last_name"
          id="last_name"
        />
      </section>

      <section className="py-1">
        <button type="submit" className="btn btn-sm btn-primary">
          ثبت تغییرات
        </button>
      </section>
    </form>
  </section>
</section>
        
    )
}

export default AddressEdit;