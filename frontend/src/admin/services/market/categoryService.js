import axios from "axios";

const API_URL = "/api";

export const getCategories = async () => {
  return await axios.get(`${API_URL}/admin/market/categories`);
};

export const getCategory = async (id) => {
  return await axios.get(`${API_URL}/admin/market/categories/${id}`);
};

export const addCategory = async (data) => {
  return await axios.post(`${API_URL}/admin/market/categories`, data);
};

export const updateCategory = async (id, data) => {
  return await axios.put(`${API_URL}/admin/market/categories/${id}`, data);
};

export const deleteCategory = async (id) => {
  return await axios.delete(`${API_URL}/admin/market/categories/${id}`);
};
