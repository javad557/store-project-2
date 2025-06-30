import axios from "axios";

const API_URL = "/api";

export const getCategories = async () => {
  return await axios.get(`${API_URL}/categories`);
};

export const getCategory = async (id) => {
  return await axios.get(`${API_URL}/categories/${id}`);
};

export const addCategory = async (data) => {
  return await axios.post(`${API_URL}/categories`, data);
};

export const updateCategory = async (id, data) => {
  return await axios.put(`${API_URL}/categories/${id}`, data);
};

export const deleteCategory = async (id) => {
  return await axios.delete(`${API_URL}/categories/${id}`);
};
