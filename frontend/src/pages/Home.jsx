function Home() {
  return (
    <div className="text-end">
      <div className="jumbotron bg-secondary text-white p-4 mb-4 rounded">
        <h2 className="h3">خوش آمدید به فروشگاه ما!</h2>
        <p>بهترین محصولات با بهترین قیمت‌ها</p>
      </div>
      <div className="row">
        {[1, 2, 3].map((item) => (
          <div key={item} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body text-end">
                <h5 className="card-title">محصول {item}</h5>
                <p className="card-text">توضیح مختصر درباره محصول {item}</p>
                <a href="/products/1" className="btn btn-primary">
                  مشاهده جزئیات
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
