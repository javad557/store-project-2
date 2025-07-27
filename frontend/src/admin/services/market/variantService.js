import axios from "axios";

const API_URL = "/api";


export const getVariants = async (productId) => {
  return await axios.get(`${API_URL}/admin/market/variants/${productId}`);
};

export const updateVariant = async (variant, data) => {
  return await axios.put(`${API_URL}/admin/market/variants/${variant}`, data);
};

export const deleteVariant = async (variant) => {
  return await axios.delete(`${API_URL}/admin/market/variants/${variant}`);
};

export const getProduct = async (id) => {
  return await axios.get(`${API_URL}/admin/market/products/${id}`);
};

export const saveVariants = async (productId, data) => {
  return await axios.post(`${API_URL}/admin/market/variants/${productId}`, data);
};

