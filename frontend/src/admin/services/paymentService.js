import axiosInstance from "../../utils/api";



export const getPayments = async () => {
  return await axiosInstance.get(`/admin/payments`);
};