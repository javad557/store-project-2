import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


const API_URL = "/api";


export const getVariants = async (productId) => {
  return await axiosInstance.get(`${API_URL}/admin/market/variants/${productId}`);
};

export const updateVariant = async (variant, data) => {
  return await axiosInstance.put(`${API_URL}/admin/market/variants/${variant}`, data);
};

export const deleteVariant = async (variant) => {
  return await axiosInstance.delete(`${API_URL}/admin/market/variants/${variant}`);
};

export const getProduct = async (id) => {
  return await axiosInstance.get(`${API_URL}/admin/market/products/${id}`);
};

export const saveVariants = async (productId, data) => {
  return await axiosInstance.post(`${API_URL}/admin/market/variants/${productId}`, data);
};

