import axios from "axios";

export const API_URL = "/api";

export const getImages = async (productId) => {
  return await axios.get(`${API_URL}/admin/market/gallery/${productId}`);
};

export const getImage = async (id) => {
  return await axios.get(`${API_URL}/admin/market/gallery/${id}`);
};

export const addImage = async (productId, data) => {
  return await axios.post(`${API_URL}/admin/market/gallery/${productId}`, data);
};

export const updateImage = async (productId, image, data) => {
  return await axios.put(`${API_URL}/admin/market/gallery/${productId}/${image}`, data);
};

export const deleteImage = async (id) => {
  return await axios.delete(`${API_URL}/admin/market/gallery/${id}`);
};

export const setMainImage = async (productId, imageId, isMain) => {
  return await axios.put(`${API_URL}/admin/market/gallery/set-main/${imageId}/${productId}`, {
    is_main: isMain,
  });
};