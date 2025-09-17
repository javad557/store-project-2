import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


const API_URL = "/api";

export const getUsers = async () => {
  return await axiosInstance.get(`${API_URL}/admin/users/customerusers`);
};

export const getUser = async (id) => {
  return await axiosInstance.get(`${API_URL}/admin/users/adminusers/${id}`);
};

export const addUser = async (data) => {
  return await axiosInstance.post(`${API_URL}/admin/users/adminusers`, data);
};

export const updateUser = async (id, data) => {
  return await axiosInstance.put(`${API_URL}/admin/users/adminusers/${id}`, data);
};

export const deleteAdmin = async (id) => {
  return await axiosInstance.delete(`${API_URL}/admin/users/adminusers/${id}`);
};

export const toggleAdminStatus = async (id) => {
  return await axiosInstance.patch(`${API_URL}/admin/users/adminusers/changeBlock/${id}`);
};