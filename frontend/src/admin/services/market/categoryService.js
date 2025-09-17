import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


const API_URL = "/api";

export const getCategories = async () => {
  return await axiosInstance.get(`${API_URL}/admin/market/categories`);
};

export const getCategory = async (id) => {
  return await axiosInstance.get(`${API_URL}/admin/market/categories/${id}`);
};

export const addCategory = async (data) => {
  return await axiosInstance.post(`${API_URL}/admin/market/categories`, data);
};

export const updateCategory = async (id, data) => {
  return await axiosInstance.put(`${API_URL}/admin/market/categories/${id}`, data);
};

export const deleteCategory = async (id) => {
  return await axiosInstance.delete(`${API_URL}/admin/market/categories/${id}`);
};
