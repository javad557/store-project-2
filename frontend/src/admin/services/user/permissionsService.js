import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


export const getPermissions = async () => {
  return await axiosInstance.get(`/admin/users/permissions`);
};

export const getPermission = async (id) => {
  return await axiosInstance.get(`/admin/users/permissions/${id}`);
};

export const addPermission = async (data) => {
  return await axiosInstance.post(`/admin/users/permissions`, data);
};

export const updatePermission = async (id, data) => {
  return await axiosInstance.put(`/admin/users/permissions/${id}`, data);
};

export const deletePermission = async (id) => {
  return await axiosInstance.delete(`/admin/users/permissions/${id}`);
};
