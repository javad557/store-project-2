import axios from "axios";

const API_URL = "/api";

export const getBrands = async () => {
  return await axios.get(`${API_URL}/admin/market/brands`);
};

export const getBrand = async (id) => {
  return await axios.get(`${API_URL}/admin/market/brands/${id}`);
};

export const addBrand = async (data) => {
  return await axios.post(`${API_URL}/admin/market/brands`, data);
};

export const updateBrand = async (id, data) => {
  return await axios.put(`${API_URL}/admin/market/brands/${id}`, data);
};

export const deleteBrand = async (id) => {
  return await axios.delete(`${API_URL}/admin/market/brands/${id}`);
};
