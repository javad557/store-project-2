import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { deleteMyAddress, getMyAddresses } from "../../services/user/customerUserService";

function MyAddresses() {
    const queryClient = useQueryClient();

  const { data: addresses = [], isError, isSuccess, error, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await getMyAddresses();
      return response.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMyAddress,
     onMutate: async (id) => {
      // لغو درخواست‌های در حال انجام برای جلوگیری از تداخل
      await queryClient.cancelQueries(["addresses"]);

      // ذخیره داده‌های قبلی برای بازیابی در صورت خطا
      const previousAddresses = queryClient.getQueryData(["addresses"]) || [];

      // به‌روزرسانی خوش‌بینانه: حذف آیتم از لیست
      queryClient.setQueryData(["addresses"], (old) =>
        old ? old.filter((address) => address.id !== id) : []
      );

      // برگرداندن داده‌های قبلی برای استفاده در onError
      return { previousAddresses };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["addresses"]);
      // showSuccess(response.data.message);
    },
    onError: (error) => {
      queryClient.setQueryData(["addresses"], context.previousAddresses);
      showError(error.response?.data?.error || "حذف ادرس با خطا مواجه شد");
    },
  });


    const handleDelete = async (id) => {
      
    deleteMutation.mutate(id);
  };


  return (
    <section className="row">
      <section className="content-wrapper bg-white p-3 rounded-2 mb-2">
        <section className="content-header mb-4">
          <section className="d-flex justify-content-between align-items-center">
            <h2 className="content-header-title">
              <span>آدرس‌های من</span>
            </h2>
          </section>
        </section>

        <section className="my-addresses">
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
          ) : addresses.length > 0 ? (
            addresses.map((addresse) => (
              <section className="my-address-wrapper mb-2 p-2" key={addresse.id}>
                <section className="mb-2">
                  <i className="fa fa-map-marker-alt mx-1"></i>
                  آدرس: {addresse.city?.name || "نامشخص"}، {addresse.province?.name || "نامشخص"}، {addresse.address}، پلاک {addresse.no}، واحد {addresse.unit}
                </section>
                <section className="mb-2">
                  <i className="fa fa-mobile-alt mx-1"></i>
                  موبایل گیرنده: {addresse.mobile}
                </section>
                <section>
                  <span
                    className="text-decoration-none cart-delete"
                    onClick={() => handleDelete(addresse.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa fa-trash-alt"></i> حذف ادرس
                  </span>
                </section>
                <Link className="btn btn-outline-primary btn-sm" to={`/main/profile/my-addresses/edit/${addresse.id}`}>
                  <i className="fa fa-edit"></i> ویرایش آدرس
                </Link>
              </section>
            ))
          ) : (
            <div className="alert alert-info text-center my-4">
              هیچ آدرسی یافت نشد.
            </div>
          )}
        </section>

        <section className="add-address mt-3">
          <Link className="btn btn-primary btn-sm" to="/main/profile/my-addresses/add">
            <i className="fa fa-plus"></i> ایجاد آدرس جدید
          </Link>
        </section>
      </section>
    </section>
  );
}

export default MyAddresses;