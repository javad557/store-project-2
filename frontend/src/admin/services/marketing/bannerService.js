import axiosInstance from "../../../utils/api"; // مسیر فایل api.js



export const getBanners = async () => {
  return await axiosInstance.get(`/admin/marketing/banners`);
};

export const getBanner = async (id) => {
  return await axiosInstance.get(`/admin/marketing/banners/${id}`);
};

export const addBanner = async (data) => {
  return await axiosInstance.post(`/admin/marketing/banners`, data);
};

export const updateBanner = async (id, data) => {
  return await axiosInstance.put(`/admin/marketing/banners/${id}`, data);
};

export const deleteBanner = async (id) => {
  return await axiosInstance.delete(`/admin/marketing/banners/${id}`);
};

export const toggleBannerStatus = async (id, status) => {
  return await axiosInstance.put(`/admin/marketing/banners/toggle/${id}`, {
    status: status,
  });
};
