

function Ticket (){
    return (
        <section class="row">
  <section class="col-12">
    <section class="main-body-container">
      <section class="main-body-container-header">
        <h5>نمایش تیکت ها</h5>
      </section>

      <section
        class="d-flex justify-content-between align-items-center mt-4 mb-3 border-bottom pb-2"
      >
        <a href="" class="btn btn-info btn-sm">بازگشت</a>
      </section>

      <section class="card mb-3">
        <section class="card-header text-white bg-custom-pink"></section>
        <section class="card-body">
          <h5 class="card-title">موضوع :</h5>
          <p class="card-text"></p>
        </section>
      </section>

      <section>
        <form action="">
          <section class="row">
            <section class="col-12">
              <div class="form-group">
                <label for="">پاسخ تیکت </label>

                ‍<textarea
                  class="form-control form-control-sm"
                  rows="4"
                  name=""
                ></textarea>

                <section class="col-12">
                  <button class="btn btn-primary btn-sm">ثبت</button>
                </section>
              </div>
            </section>
          </section>
        </form>
      </section>
    </section>
  </section>
</section>

    )
}

export default Ticket;