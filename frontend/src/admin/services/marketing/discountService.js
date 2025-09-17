import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


const API_URL = "/api";

export const getCopans = async () => {
  return await axiosInstance.get(`${API_URL}/admin/marketing/copans`);
};

export const getCopan = async (id) => {
  return await axiosInstance.get(`${API_URL}/admin/marketing/copans/${id}`);
};

export const addCopan = async (data) => {
  return await axiosInstance.post(`${API_URL}/admin/marketing/copans`, data);
};

export const updateCopan = async (id, data) => {
  return await axiosInstance.put(`${API_URL}/admin/marketing/copans/${id}`, data);
};

export const deleteCopan = async (id) => {
  return await axiosInstance.delete(`${API_URL}/admin/marketing/copans/${id}`);
};

export const toggleCopanStatus = async (id) => {
  return await axiosInstance.patch(`${API_URL}/admin/marketing/copans/changeStatus/${id}`);
};
