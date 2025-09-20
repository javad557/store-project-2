import axiosInstance from "../../../utils/api"; // مسیر فایل api.js



export const getCategories = async () => {
  return await axiosInstance.get(`/admin/market/categories`);
};

export const getCategory = async (id) => {
  return await axiosInstance.get(`/admin/market/categories/${id}`);
};

export const addCategory = async (data) => {
  return await axiosInstance.post(`/admin/market/categories`, data);
};

export const updateCategory = async (id, data) => {
  return await axiosInstance.put(`/admin/market/categories/${id}`, data);
};

export const deleteCategory = async (id) => {
  return await axiosInstance.delete(`/admin/market/categories/${id}`);
};
