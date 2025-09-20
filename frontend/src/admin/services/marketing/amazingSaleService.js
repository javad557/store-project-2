import axiosInstance from "../../../utils/api"; // مسیر فایل api.js



export const getAmazingSales = async () => {
  return await axiosInstance.get(`/admin/marketing/amazings`);
};

export const getAmazingSale = async (id) => {
  return await axiosInstance.get(`/admin/marketing/amazings/${id}`);
};

export const addAmazingSale = async (data) => {
  return await axiosInstance.post(`/admin/marketing/amazings`, data);
};

export const updateAmazingSale = async (id, data) => {
  return await axiosInstance.put(`/admin/marketing/amazings/${id}`, data);
};

export const deleteAmazingSale = async (id) => {
  return await axiosInstance.delete(`/admin/marketing/amazings/${id}`);
};

export const toggleAmazingSaleStatus = async (id) => {
  return await axiosInstance.patch(`/admin/marketing/amazings/changeStatus/${id}`);
};
