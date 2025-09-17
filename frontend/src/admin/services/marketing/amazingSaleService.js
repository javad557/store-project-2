import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


const API_URL = "/api";

export const getAmazingSales = async () => {
  return await axiosInstance.get(`${API_URL}/admin/marketing/amazings`);
};

export const getAmazingSale = async (id) => {
  return await axiosInstance.get(`${API_URL}/admin/marketing/amazings/${id}`);
};

export const addAmazingSale = async (data) => {
  return await axiosInstance.post(`${API_URL}/admin/marketing/amazings`, data);
};

export const updateAmazingSale = async (id, data) => {
  return await axiosInstance.put(`${API_URL}/admin/marketing/amazings/${id}`, data);
};

export const deleteAmazingSale = async (id) => {
  return await axiosInstance.delete(`${API_URL}/admin/marketing/amazings/${id}`);
};

export const toggleAmazingSaleStatus = async (id) => {
  return await axiosInstance.patch(`${API_URL}/admin/marketing/amazings/changeStatus/${id}`);
};
