import axios from "axios";

const API_URL = "/api";

export const getBanners = async () => {
  return await axios.get(`${API_URL}/admin/marketing/banners`);
};

export const getBanner = async (id) => {
  return await axios.get(`${API_URL}/admin/marketing/banners/${id}`);
};

export const addBanner = async (data) => {
  return await axios.post(`${API_URL}/admin/marketing/banners`, data);
};

export const updateBanner = async (id, data) => {
  return await axios.put(`${API_URL}/admin/marketing/banners/${id}`, data);
};

export const deleteBanner = async (id) => {
  return await axios.delete(`${API_URL}/admin/marketing/banners/${id}`);
};

export const toggleBannerStatus = async (id, status) => {
  return await axios.put(`${API_URL}/admin/marketing/banners/toggle/${id}`, {
    status: status,
  });
};
