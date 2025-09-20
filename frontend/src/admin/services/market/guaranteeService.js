import axiosInstance from "../../../utils/api"; // مسیر فایل api.js




export const getGuarantees = async (productId) => {
  return await axiosInstance.get(`/admin/market/guarantees/${productId}`);
};

export const getGuarantee = async (guaranteeId,productId) => {
  return await axiosInstance.get(`/admin/market/guarantees/${guaranteeId}/${productId}`);
};

export const addGuarantee = async (productId,data) => {
  return await axiosInstance.post(`/admin/market/guarantees/${productId}`, data);
};

export const updateGuarantee = async (guaranteeId,productId, data) => {
  return await axiosInstance.put(`/admin/market/guarantees/${guaranteeId}/${productId}`, data);
};

export const deleteGuarantee = async (id) => {
  return await axiosInstance.delete(`/admin/market/guarantees/${id}`);
};
