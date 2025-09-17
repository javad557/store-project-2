import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


const API_URL = "/api";

export const getProducts = async () => {
  return await axiosInstance.get(`${API_URL}/admin/market/products`);
};

export const getProduct = async (id) => {
  return await axiosInstance.get(`${API_URL}/admin/market/products/${id}`);
};

export const addProduct = async (data) => {
  return await axiosInstance.post(`${API_URL}/admin/market/products`, data);
};

export const updateProduct = async (id, data) => {
  return await axiosInstance.post(`${API_URL}/admin/market/products/${id}`, data);
};

export const deleteProduct = async (id) => {
  return await axiosInstance.delete(`${API_URL}/admin/market/products/${id}`);
};

export const toggleProductAvailability = async (id, isAvailable) => {
  return await axiosInstance.put(`${API_URL}/admin/market/products/toggle/${id}`, {
    is_available: isAvailable,
  });
};