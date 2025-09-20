import axiosInstance from "../../../utils/api"; // مسیر فایل api.js



export const getUsers = async () => {
  return await axiosInstance.get(`/admin/users/customerusers`);
};

export const getUser = async (id) => {
  return await axiosInstance.get(`/admin/users/adminusers/${id}`);
};

export const addUser = async (data) => {
  return await axiosInstance.post(`/admin/users/adminusers`, data);
};

export const updateUser = async (id, data) => {
  return await axiosInstance.put(`/admin/users/adminusers/${id}`, data);
};

export const deleteAdmin = async (id) => {
  return await axiosInstance.delete(`/admin/users/adminusers/${id}`);
};

export const toggleAdminStatus = async (id) => {
  return await axiosInstance.patch(`/admin/users/adminusers/changeBlock/${id}`);
};