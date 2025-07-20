import axios from "axios";

const API_URL = "/api";

export const getProducts = async () => {
  return await axios.get(`${API_URL}/admin/market/products`);
};

export const getProduct = async (id) => {
  return await axios.get(`${API_URL}/admin/market/products/${id}`);
};

export const addProduct = async (data) => {
  return await axios.post(`${API_URL}/admin/market/products`, data);
};

export const updateProduct = async (id, data) => {
  return await axios.post(`${API_URL}/admin/market/products/${id}`, data);
};

export const deleteProduct = async (id) => {
  return await axios.delete(`${API_URL}/admin/market/products/${id}`);
};

export const toggleProductAvailability = async (id, isAvailable) => {
  return await axios.put(`${API_URL}/admin/market/products/toggle/${id}`, {
    is_available: isAvailable,
  });
};