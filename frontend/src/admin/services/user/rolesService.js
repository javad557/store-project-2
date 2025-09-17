import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


const API_URL = "/api";

export const getRoles = async () => {
  return await axiosInstance.get(`${API_URL}/admin/users/roles`);
};

export const getRole = async (id) => {
  return await axiosInstance.get(`${API_URL}/admin/users/roles/${id}`);
};

export const addRole = async (data) => {
  return await axiosInstance.post(`${API_URL}/admin/users/roles`, data);
};

export const updateRole = async (id, data) => {
  return await axiosInstance.put(`${API_URL}/admin/users/roles/${id}`, data);
};

export const deleteRole = async (id) => {
  return await axiosInstance.delete(`${API_URL}/admin/users/roles/${id}`);
};
