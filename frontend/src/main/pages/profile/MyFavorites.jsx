import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteFavorite, getMyFavorites } from "../../services/user/customerUserService";
import { showError, showSuccess } from "../../../utils/notifications";

function MyFavorites() {
  const queryClient = useQueryClient();

  const {
    data: favorites = [],
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await getMyFavorites();
      return response.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFavorite,
     onMutate: async (id) => {
      // لغو درخواست‌های در حال انجام برای جلوگیری از تداخل
      await queryClient.cancelQueries(["favorites"]);

      // ذخیره داده‌های قبلی برای بازیابی در صورت خطا
      const previousFavorites = queryClient.getQueryData(["favorites"]) || [];

      // به‌روزرسانی خوش‌بینانه: حذف آیتم از لیست
      queryClient.setQueryData(["favorites"], (old) =>
        old ? old.filter((favorite) => favorite.product.id !== id) : []
      );

      // برگرداندن داده‌های قبلی برای استفاده در onError
      return { previousFavorites };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites"]);
      // showSuccess(response.data.message);
    },
    onError: (error) => {
      queryClient.setQueryData(["favorites"], context.previousFavorites);
      showError(error.response?.data?.error || "حذف علاقه مندی با خطا مواجه شد");
    },
  });

  const handleDelete = async (id) => {
    deleteMutation.mutate(id);
  };


  return (
    <section className="row">
      <section className="content-wrapper bg-white p-3 rounded-2 mb-2">
        {/* start content header */}
        <section className="content-header mb-4">
          <section className="d-flex justify-content-between align-items-center">
            <h2 className="content-header-title">
              <span>لیست علاقه‌مندی‌های من</span>
            </h2>
            <section className="content-header-link">
              {/*<a href="#">مشاهده همه</a>*/}
            </section>
          </section>
        </section>
        {/* end content header */}
        {isLoading ? (
          <div className="text-center my-4">
            <p>در حال بارگذاری...</p>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">در حال بارگذاری...</span>
            </div>
          </div>
        ) : isError ? (
          <div className="alert alert-danger text-center my-4">
            خطایی رخ داده است: {error.message || "لطفاً دوباره تلاش کنید."}
          </div>
        ) : favorites.length > 0 ? (
          favorites.map((favorite) => (
            <section className="cart-item d-flex py-3" key={favorite.id}>
              <section className="align-self-start w-100">
                <p className="fw-bold">{favorite.product.name}</p>
                <p>
                  <i className="fa fa-store-alt cart-product-selected-store me-1"></i>{" "}
                  <span>کالا موجود در انبار</span>
                </p>
                <section className="item-image">
                  <img
                    src={favorite.product?.image || "https://via.placeholder.com/100"}
                    alt={favorite.product.name || "محصول"}
                    width={150}
                    height={100}
                  />
                </section>
                <section>
                  <span
                    className="text-decoration-none cart-delete"
                    onClick={() => handleDelete(favorite.product.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa fa-trash-alt"></i> حذف از لیست علاقه‌مندی‌ها
                  </span>
                </section>
              </section>
              <section className="align-self-end flex-shrink-1">
                <section className="text-nowrap fw-bold">
                  {favorite.product.price
                    ? `${favorite.product.price.toLocaleString("fa-IR")} تومان`
                    : "قیمت نامشخص"}
                </section>
              </section>
            </section>
          ))
        ) : (
          <div className="alert alert-info text-center my-4">
            لیست علاقه‌مندی‌های شما خالی است.
          </div>
        )}
      </section>
    </section>
  );
}

export default MyFavorites;