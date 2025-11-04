import { useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { addProductToFavorites, getMostViewed, getTopSellers } from '../services/market/productServise';
import { getBanners } from '../services/market/bannerService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Link } from 'react-router-dom';
import { showError, showSuccess } from '../../utils/notifications';
import { useAuth } from '../../context/AuthContext';

function Home() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // درخواست برای پرفروش‌ترین محصولات
  const {
    data: topSellers = [],
    error: topSellersError,
    isError: isTopSellersError,
    isLoading: isTopSellersLoading,
  } = useQuery({
    queryKey: ['products', 'top-sellers'],
    queryFn: async () => {
      const response = await getTopSellers();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });

  // درخواست برای پربازدیدترین محصولات
  const {
    data: mostViewed = [],
    error: mostViewedError,
    isError: isMostViewedError,
    isLoading: isMostViewedLoading,
  } = useQuery({
    queryKey: ['products', 'most-viewed'],
    queryFn: async () => {
      const response = await getMostViewed();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });

  // درخواست برای بنرها
  const {
    data: banners = [],
    error: bannerError,
    isError: isBannerError,
    isLoading: isBannerLoading,
  } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const response = await getBanners();
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });

  // فیلتر کردن بنرها بر اساس position
  const slideshowBanners = banners.filter((banner) => banner.position === 1);
  const sideBanners = banners.filter((banner) => banner.position === 2);
  const oneColBanner = banners.find((banner) => banner.position === 3);
  const twoColBanners = banners.filter((banner) => banner.position === 4);

  // بررسی اینکه آیا محصول در لیست علاقه‌مندی‌ها وجود دارد
  const isFavorite = (productId) => {
    return user?.favorites?.some((favorite) => favorite.product_id === productId) || false;
  };

  // Mutation برای افزودن/حذف محصول از علاقه‌مندی‌ها
  const { mutate: addToFavorite } = useMutation({
    mutationFn: addProductToFavorites,
    onMutate: async (productId) => {
      await queryClient.cancelQueries(['user']);
      const previousUser = queryClient.getQueryData(['user']);
      queryClient.setQueryData(['user'], (old) => {
        if (!old) return old;
        const isAlreadyFavorite = old.favorites?.some((f) => f.product_id === productId);
        if (isAlreadyFavorite) {
          return {
            ...old,
            favorites: old.favorites.filter((f) => f.product_id !== productId),
          };
        } else {
          return {
            ...old,
            favorites: [...(old.favorites || []), { product_id: productId }],
          };
        }
      });
      return { previousUser };
    },
    onError: (error, productId, context) => {
      queryClient.setQueryData(['user'], context.previousUser);
      showError(error.response?.data?.error || 'خطا در تغییر وضعیت علاقه‌مندی محصول');
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries(['user']);
    },
  });


  return (
    <>
      {/* بخش بنرها بدون تغییر */}
      <section className="container-xxl my-4">
        <div className="row">
          <div className="col-md-8 pe-md-1">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              loop={slideshowBanners.length >= 2}
              autoplay={{
                delay: 20000,
                disableOnInteraction: false,
              }}
              speed={500}
            >
              {isBannerLoading ? (
                <div>Loading banners...</div>
              ) : isBannerError ? (
                <div>Error loading banners: {bannerError.message}</div>
              ) : slideshowBanners.length > 0 ? (
                slideshowBanners.map((banner) => (
                  <SwiperSlide key={banner.url}>
                    <a className="w-100 d-block h-auto text-decoration-none" >
                      <img
                        className="w-100 rounded-2 d-block h-auto"
                        src={banner.image}
                        alt={banner.title}
                      />
                    </a>
                  </SwiperSlide>
                ))
              ) : (
                <div>No banners available for slideshow</div>
              )}
            </Swiper>
          </div>
          <div className="col-md-4 ps-md-1 mt-2 mt-md-0">
            <div className="mb-2">
              {isBannerLoading ? (
                <div>Loading side banner...</div>
              ) : sideBanners[0] ? (
                <a  className="d-block">
                  <img
                    className="w-100 rounded-2"
                    src={sideBanners[0].image}
                    alt={sideBanners[0].title}
                  />
                </a>
              ) : (
                <div>No banner available for position 2</div>
              )}
            </div>
            <div className="mb-2">
              {isBannerLoading ? (
                <div>Loading side banner...</div>
              ) : sideBanners[1] ? (
                <a className="d-block">
                  <img
                    className="w-100 rounded-2"
                    src={sideBanners[1].image}
                    alt={sideBanners[1].title}
                  />
                </a>
              ) : (
                <div>No banner available for position 2</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* بخش پرفروش‌ترین کالاها */}
      <section className="bg-white py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col">
              <div className="content-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>پرفروش‌ترین کالاها</span>
                  </h2>
                  <hr />
                  <br /> <br /> <br /> <br />
                 
                  <div className="content-header-link">
                    <Link to="/main/market/products">مشاهده همه</Link>
                  </div>
                </div>
              </div>
              <div className="lazyload-wrapper">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={10}
                  slidesPerView={Math.min(topSellers.length, 4) || 1}
                  navigation
                  pagination={{ clickable: true }}
                  loop={topSellers.length >= 4}
                  breakpoints={{
                    0: { slidesPerView: Math.min(topSellers.length, 1) || 1 },
                    576: { slidesPerView: Math.min(topSellers.length, 2) || 1 },
                    768: { slidesPerView: Math.min(topSellers.length, 3) || 1 },
                    992: { slidesPerView: Math.min(topSellers.length, 4) || 1 },
                  }}
                >
                  {isTopSellersLoading ? (
                    <div>Loading top sellers...</div>
                  ) : isTopSellersError ? (
                    <div>Error loading top sellers: {topSellersError.message}</div>
                  ) : topSellers.length > 0 ? (
                    topSellers.map((product) => (
                      <SwiperSlide key={product.id}>
                        <div className="product">
                          {user && (
                            <div className="product-add-to-favorite">
                              <span
                                onClick={() => addToFavorite(product.id)}
                                className={`product-add-to-favorite-active ${isFavorite(product.id) ? 'favorited' : ''}`}
                                title={isFavorite(product.id) ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                              >
                                <i className={`fa ${isFavorite(product.id) ? 'fas fa-heart' : 'far fa-heart'}`}></i>
                              </span>
                            </div>
                          )}
                          <Link className="product-link" to={`/main/market/product/${product.id}`}>
                            <div className="product-image">
                              <img
                                className="w-100 h-auto"
                                src={product.image_url ? product.image_url : '/assets/images/default-product.jpg'}
                                alt={product.name}
                              />
                            </div>
                            <div className="product-name">
                              <h3>{product.name}</h3>
                            </div>
                            <div className="product-price-wrapper">
                              <div className="product-discount">
                                <span className="product-old-price">{product.original_price || product.price}</span>
                                {product.discount && (
                                  <span className="product-discount-amount">{product.discount}%</span>
                                )}
                              </div>
                              <div className="product-price">{product.price} تومان</div>
                            </div>
                            <div className="product-colors">
                              {(product.colors || []).map((color, index) => (
                                <div
                                  key={index}
                                  className="product-colors-item"
                                  style={{ backgroundColor: color }}
                                ></div>
                              ))}
                            </div>
                          </Link>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <div>No top sellers available</div>
                  )}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* بخش محبوب‌ترین کالاها */}
      <section className="py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col">
              <div className="content-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>محبوب‌ترین کالاها</span>
                  </h2>
                   <hr />
                  <br /> <br /> <br /> <br />
                  <div className="content-header-link">
                    <Link to="/main/market/products">مشاهده همه</Link>
                  </div>
                </div>
              </div>
              <div className="lazyload-wrapper">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={10}
                  slidesPerView={Math.min(mostViewed.length, 4) || 1}
                  navigation
                  pagination={{ clickable: true }}
                  loop={mostViewed.length >= 4}
                  breakpoints={{
                    0: { slidesPerView: Math.min(mostViewed.length, 1) || 1 },
                    576: { slidesPerView: Math.min(mostViewed.length, 2) || 1 },
                    768: { slidesPerView: Math.min(mostViewed.length, 3) || 1 },
                    992: { slidesPerView: Math.min(mostViewed.length, 4) || 1 },
                  }}
                >
                  {isMostViewedLoading ? (
                    <div>Loading most viewed...</div>
                  ) : isMostViewedError ? (
                    <div>Error loading most viewed: {mostViewedError.message}</div>
                  ) : mostViewed.length > 0 ? (
                    mostViewed.map((product) => (
                      <SwiperSlide key={product.id}>
                        <div className="product">
                          {user && (
                            <div className="product-add-to-favorite">
                              <span
                                onClick={() => addToFavorite(product.id)}
                                className={`product-add-to-favorite-active ${isFavorite(product.id) ? 'favorited' : ''}`}
                                title={isFavorite(product.id) ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                              >
                                <i className={`fa ${isFavorite(product.id) ? 'fas fa-heart' : 'far fa-heart'}`}></i>
                              </span>
                            </div>
                          )}
                          <Link className="product-link" href={`/main/market/product/${product.id}`}>
                            <div className="product-image">
                              <img
                                className="w-100 h-auto"
                                src={product.image_url ? product.image_url : '/assets/images/default-product.jpg'}
                                alt={product.name}
                              />
                            </div>
                            <div className="product-name">
                              <h3>{product.name}</h3>
                            </div>
                            <div className="product-price-wrapper">
                              <div className="product-discount">
                                <span className="product-old-price">{product.original_price || product.price}</span>
                                {product.discount && (
                                  <span className="product-discount-amount">{product.discount}%</span>
                                )}
                              </div>
                              <div className="product-price">{product.price} تومان</div>
                            </div>
                            <div className="product-colors">
                              {(product.colors || []).map((color, index) => (
                                <div
                                  key={index}
                                  className="product-colors-item"
                                  style={{ backgroundColor: color }}
                                ></div>
                              ))}
                            </div>
                          </Link>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <div>No most viewed products available</div>
                  )}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* بخش بنرهای پایینی بدون تغییر */}
      <section className="">
        <div className="container-xxl">
          <div className="row py-4">
            <div className="col">
              {isBannerLoading ? (
                <div>Loading one-col banner...</div>
              ) : oneColBanner ? (
                <img
                  className="d-block rounded-2 w-100"
                  src={oneColBanner.image}
                  alt={oneColBanner.title}
                />
              ) : (
                <div>No banner available for position 3</div>
              )}
            </div>
          </div>
          <div className="row py-4">
            {isBannerLoading ? (
              <div>Loading two-col banners...</div>
            ) : twoColBanners.length > 0 ? (
              twoColBanners.slice(0, 2).map((banner) => (
                <div className="col" key={banner.url}>
                  <img
                    className="d-block rounded-2 w-100"
                    src={banner.image}
                    alt={banner.title}
                  />
                </div>
              ))
            ) : (
              <div>No banners available for position 4</div>
            )}
          </div>
        </div>

  
  <footer className="footer">
    <section className="container-xxl my-4">
      <section className="row">
        <section className="col">
          <section className="footer-shop-features d-md-flex justify-content-md-around align-items-md-center">
            <section className="footer-shop-features-item">
              <img src="assets/images/footer/1.png" alt="" />
              <section className="text-center">امکان تحویل اکسپرس</section>
            </section>

            <section className="footer-shop-features-item">
              <img src="assets/images/footer/2.png" alt="" />
              <section className="text-center">امکان پرداخت در محل</section>
            </section>

            <section className="footer-shop-features-item">
              <img src="assets/images/footer/3.png" alt="" />
              <section className="text-center">7 روز هفته، 24 ساعته</section>
            </section>

            <section className="footer-shop-features-item">
              <img src="assets/images/footer/4.png" alt="" />
              <section className="text-center">7 روز ضمانت بازگشت کالا</section>
            </section>

            <section className="footer-shop-features-item">
              <img src="assets/images/footer/5.png" alt="" />
              <section className="text-center">ضمانت اصل بودن کالا</section>
            </section>
          </section>
        </section>
      </section>
      <section className="row">
        <section className="col-md">
          <section>
            <a className="text-decoration-none text-muted d-inline-block my-2" href="#">
              شرایط و قوانین
            </a>
          </section>
          <section>
            <Link className="text-decoration-none text-muted d-inline-block my-2" to={`/main/informationpages/1`}>
              درباره ما
            </Link>
          </section>
          <section>
            <a className="text-decoration-none text-muted d-inline-block my-2" href="#">
              تماس با ما
            </a>
          </section>
          <section>
            <a className="text-decoration-none text-muted d-inline-block my-2" href="#">
              فرصت‌های شغلی
            </a>
          </section>
          <section>
            <a className="text-decoration-none text-muted d-inline-block my-2" href="#">
              سوالات متداول
            </a>
          </section>
        </section>

        <section className="col-md-5">
          <section>
            <section className="text-dark fw-bold">با ما همراه باشید</section>
            <section className="my-3">
              <a href="#" className="text-muted text-decoration-none me-5">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-muted text-decoration-none me-5">
                <i className="fab fa-telegram"></i>
              </a>
              <a href="#" className="text-muted text-decoration-none me-5">
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="#" className="text-muted text-decoration-none me-5">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-muted text-decoration-none me-5">
                <i className="fab fa-linkedin"></i>
              </a>
            </section>
          </section>
        </section>
      </section>
      <section className="row my-5">
        <section className="col">
          <section className="fw-bold">شرکت آمازون</section>
          <section className="text-muted footer-intro">
            ما همواره تلاش می‌کنیم بهترین خدمات را به مشتریان آمازون ارائه کنیم. به شما کمک
            می‌کنیم بهترین انتخاب را داشته باشید و با اطمینان خاطر خرید را انجام بدهید و در
            کوتاه‌ترین زمان ممکن کالای خود را دریافت کنید. همچنین ما 24 ساعته در هفت روز
            هفته به مشتریان‌مان خدمات ارائه می‌دهیم. و 7 روز ضمانت برگشت برای تمامی کالاها
            داریم.
          </section>
        </section>
      </section>

      <section className="row border-top pt-4">
        <section className="col">
          <section className="text-muted footer-intro text-center">
            کلیه حقوق این وبسایت متعلق به شرکت آمازون می‌باشد.
          </section>
        </section>
      </section>
    </section>
  </footer>
        
      </section>
    </>
  );
}

export default Home;