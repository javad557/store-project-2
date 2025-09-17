import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


const API_URL = "/api";

export const getBanners = async () => {
  return await axiosInstance.get(`${API_URL}/admin/marketing/banners`);
};

export const getBanner = async (id) => {
  return await axiosInstance.get(`${API_URL}/admin/marketing/banners/${id}`);
};

export const addBanner = async (data) => {
  return await axiosInstance.post(`${API_URL}/admin/marketing/banners`, data);
};

export const updateBanner = async (id, data) => {
  return await axiosInstance.put(`${API_URL}/admin/marketing/banners/${id}`, data);
};

export const deleteBanner = async (id) => {
  return await axiosInstance.delete(`${API_URL}/admin/marketing/banners/${id}`);
};

export const toggleBannerStatus = async (id, status) => {
  return await axiosInstance.put(`${API_URL}/admin/marketing/banners/toggle/${id}`, {
    status: status,
  });
};
