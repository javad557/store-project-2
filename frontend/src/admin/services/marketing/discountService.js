import axiosInstance from "../../../utils/api"; // مسیر فایل api.js



export const getCopans = async () => {
  return await axiosInstance.get(`/admin/marketing/copans`);
};

export const getCopan = async (id) => {
  return await axiosInstance.get(`/admin/marketing/copans/${id}`);
};

export const addCopan = async (data) => {
  return await axiosInstance.post(`/admin/marketing/copans`, data);
};

export const updateCopan = async (id, data) => {
  return await axiosInstance.put(`/admin/marketing/copans/${id}`, data);
};

export const deleteCopan = async (id) => {
  return await axiosInstance.delete(`/admin/marketing/copans/${id}`);
};

export const toggleCopanStatus = async (id) => {
  return await axiosInstance.patch(`/admin/marketing/copans/changeStatus/${id}`);
};
