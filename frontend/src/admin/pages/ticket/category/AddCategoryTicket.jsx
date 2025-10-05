function AddCategoryTicket (){
    return(
        <section class="row">
  <section class="col-12">
    <section class="main-body-container">
      <section class="main-body-container-header">
        <h5>ایجاد دسته بندی</h5>
      </section>

      <section
        class="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2"
      >
        <a href="" class="btn btn-info btn-sm">بازگشت</a>
      </section>

      <section>
        <form action="" id="">
          <section class="row">
            <section class="col-12 col-md-6 my-2">
              <div class="form-group">
                <label for="name">نام دسته</label>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  name=""
                  id=""
                  value=""
                />
              </div>
            </section>

            <section class="col-12 col-md-6 my-2">
              <div class="form-group">
                <label for="status">وضعیت</label>
                <select name="" class="form-control form-control-sm" id="">
                  <option value="0">غیرفعال</option>
                  <option value="1">فعال</option>
                </select>
              </div>
            </section>

            <section class="col-12 my-3">
              <button class="btn btn-primary btn-sm">ثبت</button>
            </section>
          </section>
        </form>
      </section>
    </section>
  </section>
</section>

    )
}


export default AddCategoryTicket;