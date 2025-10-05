import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const showSuccess = (message) => {
  toast.success(
    <div>
      <strong>{message}</strong>
      <br />
      <br />
      <span>عملیات با موفقیت انجام شد.</span>
    </div>,
    { autoClose: 5000 }
  );
};

export const showError = (message) => {
  toast.error(
    <div>
      <strong>{message}</strong>
      <br />
      <br />
      <span>عملیات با خطا مواجه شد.</span>
    </div>,
    { autoClose: 5000 }
  );
};

export const confirmDelete = async (itemName) => {
  const result = await Swal.fire({
    title: `آیا از حذف ${itemName} اطمینان دارید؟`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#0d6efd",
    confirmButtonText: "بله، حذف کن",
    cancelButtonText: "خیر",
  });
  return result.isConfirmed;
};


// تابع عمومی handleDelete
export const handleDelete = async (
  id, // شناسه آیتم برای حذف
  name, // نام آیتم برای نمایش توی پیام تأیید
  deleteFunction, // تابع حذف API (مثل deleteDelivery یا deleteBrand)
  setItems, // تابع setter برای به‌روزرسانی state
  items, // آرایه فعلی (مثل deliveries یا brands)
  entityName // نام موجودیت برای پیام خطا (مثل "روش ارسال" یا "برند")
) => {
  const isConfirmed = await confirmDelete(name);
  if (isConfirmed) {
    try {
      const response = await deleteFunction(id);
      setItems(items.filter((item) => item.id !== id));
      showSuccess(response.data.message);
    } catch (error) {
      showError(error.response?.data?.error || `حذف ${entityName} با خطا مواجه شد`);
    }
  }
};


export const confirmOrderStatusChange =async (currentStatus,availableStatuses)=>{
  const result = await Swal.fire({
        title: "تغییر وضعیت سفارش",
        text: `وضعیت فعلی: ${currentStatus}. وضعیت جدید را انتخاب کنید:`,
        input: "select",
        inputOptions: availableStatuses.reduce((acc, status) => {
          acc[status] = status;
          return acc;
        }, {}),
        inputValue: currentStatus,
        showCancelButton: true,
        confirmButtonText: "تأیید",
        cancelButtonText: "لغو",
        inputValidator: (value) => {
          if (!value) {
            return "لطفاً یک وضعیت انتخاب کنید!";
          }
          if (value === currentStatus) {
            return "لطفاً وضعیتی متفاوت با وضعیت فعلی انتخاب کنید!";
          }
        },
      })
      return result;
}