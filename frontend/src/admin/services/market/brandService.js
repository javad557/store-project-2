import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


const API_URL = "/api";

export const getBrands = async () => {
  return await axiosInstance.get(`${API_URL}/admin/market/brands`);
};

export const getBrand = async (id) => {
  return await axiosInstance.get(`${API_URL}/admin/market/brands/${id}`);
};

export const addBrand = async (data) => {
  return await axiosInstance.post(`${API_URL}/admin/market/brands`, data);
};

export const updateBrand = async (id, data) => {
  return await axiosInstance.put(`${API_URL}/admin/market/brands/${id}`, data);
};



export const deleteBrand = async (id) => {
  return await axiosInstance.delete(`${API_URL}/admin/market/brands/${id}`);
};
