import axiosInstance from "../../../utils/api"; // مسیر فایل api.js





export const getVariants = async (productId) => {
  return await axiosInstance.get(`/admin/market/variants/${productId}`);
};

export const updateVariant = async (variant, data) => {
  return await axiosInstance.put(`/admin/market/variants/${variant}`, data);
};

export const deleteVariant = async (variant) => {
  return await axiosInstance.delete(`/admin/market/variants/${variant}`);
};

export const getProduct = async (id) => {
  return await axiosInstance.get(`/admin/market/products/${id}`);
};

export const saveVariants = async (productId, data) => {
  return await axiosInstance.post(`/admin/market/variants/${productId}`, data);
};

