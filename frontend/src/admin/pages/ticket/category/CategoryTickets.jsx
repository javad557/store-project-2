function CategoryTicket() {
  return (
    
    <section className="row">
      <section className="col-12">
        <section className="main-body-container">
          <section className="main-body-container-header">
            <h5>دسته بندی</h5>
          </section>

          <section
            className="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2"
          >
            <a href="" className="btn btn-info btn-sm">ایجاد دسته بندی</a>
            <div className="max-width-16-rem">
              <input
                type="text"
                className="form-control form-control-sm form-text"
                placeholder="جستجو"
              />
            </div>
          </section>

          <section className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>نام دسته بندی</th>
                  <th>وضعیت</th>
                  <th className="max-width-16-rem text-center">
                    <i className="fa fa-cogs"></i> تنظیمات
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th></th>
                  <td></td>
                  <td></td>
                  <td className="width-16-rem text-left">
                    <a href="" className="btn btn-primary btn-sm">
                      <i className="fa fa-edit"></i> ویرایش
                    </a>
                    <button className="btn btn-danger btn-sm delete" type="submit">
                      <i className="fa fa-trash-alt"></i> حذف
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </section>
      </section>
    </section>
  );
}

export default CategoryTicket;