import axiosInstance from "../../../utils/api"; // مسیر فایل api.js



export const getBrands = async () => {
  return await axiosInstance.get(`/admin/market/brands`);
};

export const getBrand = async (id) => {
  return await axiosInstance.get(`/admin/market/brands/${id}`);
};

export const addBrand = async (data) => {
  return await axiosInstance.post(`/admin/market/brands`, data);
};

export const updateBrand = async (id, data) => {
  return await axiosInstance.put(`/admin/market/brands/${id}`, data);
};



export const deleteBrand = async (id) => {
  return await axiosInstance.delete(`/admin/market/brands/${id}`);
};
