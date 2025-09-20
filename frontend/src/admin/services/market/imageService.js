import axiosInstance from "../../../utils/api"; // مسیر فایل api.js




export const getImages = async (productId) => {
  return await axiosInstance.get(`/admin/market/gallery/${productId}`);
};

export const getImage = async (id) => {
  return await axiosInstance.get(`/admin/market/gallery/${id}`);
};

export const addImage = async (productId, data) => {
  return await axiosInstance.post(`/admin/market/gallery/${productId}`, data);
};

export const updateImage = async (productId, image, data) => {
  return await axiosInstance.put(`/admin/market/gallery/${productId}/${image}`, data);
};

export const deleteImage = async (id) => {
  return await axiosInstance.delete(`/admin/market/gallery/${id}`);
};

export const setMainImage = async (productId, imageId, isMain) => {
  return await axiosInstance.put(`/admin/market/gallery/set-main/${imageId}/${productId}`, {
    is_main: isMain,
  });
};