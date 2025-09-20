import axiosInstance from "../../../utils/api"; // مسیر فایل api.js



export const getRoles = async () => {
  return await axiosInstance.get(`/admin/users/roles`);
};

export const getRole = async (id) => {
  return await axiosInstance.get(`/admin/users/roles/${id}`);
};

export const addRole = async (data) => {
  return await axiosInstance.post(`/admin/users/roles`, data);
};

export const updateRole = async (id, data) => {
  return await axiosInstance.put(`/admin/users/roles/${id}`, data);
};

export const deleteRole = async (id) => {
  return await axiosInstance.delete(`/admin/users/roles/${id}`);
};
