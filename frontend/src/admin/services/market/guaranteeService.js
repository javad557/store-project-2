import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


const API_URL = "/api";

export const getGuarantees = async (productId) => {
  return await axiosInstance.get(`${API_URL}/admin/market/guarantees/${productId}`);
};

export const getGuarantee = async (guaranteeId,productId) => {
  return await axiosInstance.get(`${API_URL}/admin/market/guarantees/${guaranteeId}/${productId}`);
};

export const addGuarantee = async (productId,data) => {
  return await axiosInstance.post(`${API_URL}/admin/market/guarantees/${productId}`, data);
};

export const updateGuarantee = async (guaranteeId,productId, data) => {
  return await axiosInstance.put(`${API_URL}/admin/market/guarantees/${guaranteeId}/${productId}`, data);
};

export const deleteGuarantee = async (id) => {
  return await axiosInstance.delete(`${API_URL}/admin/market/guarantees/${id}`);
};
