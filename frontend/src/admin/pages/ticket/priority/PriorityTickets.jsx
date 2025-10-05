

function PriorityTickets(){
    return(
        <section class="row">
  <section class="col-12">
    <section class="main-body-container">
      <section class="main-body-container-header">
        <h5>اولویت</h5>
      </section>

      <section
        class="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2"
      >
        <a href="" class="btn btn-info btn-sm">ایجاد اولویت</a>
        <div class="max-width-16-rem">
          <input
            type="text"
            class="form-control form-control-sm form-text"
            placeholder="جستجو"
          />
        </div>
      </section>

      <section class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>نام اولویت</th>
              <th>وضعیت</th>
              <th class="max-width-16-rem text-center">
                <i class="fa fa-cogs"></i> تنظیمات
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th></th>
              <td></td>
              <td></td>
              <td class="width-16-rem text-left">
                <a href="" class="btn btn-primary btn-sm"
                  ><i class="fa fa-edit"></i> ویرایش</a>
                <button class="btn btn-danger btn-sm delete" type="submit">
                  <i class="fa fa-trash-alt"></i> حذف
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>
  </section>
</section>

    )
}

export default PriorityTickets;