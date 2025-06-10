import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const showSuccess = (message) => {
  toast.success(
    <>
      <strong>{message}</strong>
      <br />
      <br />
      <span>عملیات با موفقیت انجام شد.</span>
    </>,
    { autoClose: 5000 }
  );
};

export const showError = (message) => {
  toast.error(
    <>
      <strong>{message}</strong>
      <br />
      <br />
      <span>عملیات با خطا مواجه شد.</span>
    </>,
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
