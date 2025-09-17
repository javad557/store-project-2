import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


const API_URL = "/api";

export const getPermissions = async () => {
  return await axiosInstance.get(`${API_URL}/admin/users/permissions`);
};

export const getPermission = async (id) => {
  return await axiosInstance.get(`${API_URL}/admin/users/permissions/${id}`);
};

export const addPermission = async (data) => {
  return await axiosInstance.post(`${API_URL}/admin/users/permissions`, data);
};

export const updatePermission = async (id, data) => {
  return await axiosInstance.put(`${API_URL}/admin/users/permissions/${id}`, data);
};

export const deletePermission = async (id) => {
  return await axiosInstance.delete(`${API_URL}/admin/users/permissions/${id}`);
};
