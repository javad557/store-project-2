import axios from "axios";

const API_URL = "/api";

export const getCopans = async () => {
  return await axios.get(`${API_URL}/admin/marketing/copans`);
};

export const getCopan = async (id) => {
  return await axios.get(`${API_URL}/admin/marketing/copans/${id}`);
};

export const addCopan = async (data) => {
  return await axios.post(`${API_URL}/admin/marketing/copans`, data);
};

export const updateCopan = async (id, data) => {
  return await axios.put(`${API_URL}/admin/marketing/copans/${id}`, data);
};

export const deleteCopan = async (id) => {
  return await axios.delete(`${API_URL}/admin/marketing/copans/${id}`);
};

export const toggleCopanStatus = async (id) => {
  return await axios.patch(`${API_URL}/admin/marketing/copans/changeStatus/${id}`);
};
