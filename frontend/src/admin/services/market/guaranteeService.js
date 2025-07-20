import axios from "axios";

const API_URL = "/api";

export const getGuarantees = async (productId) => {
  return await axios.get(`${API_URL}/admin/market/guarantees/${productId}`);
};

export const getGuarantee = async (guaranteeId,productId) => {
  return await axios.get(`${API_URL}/admin/market/guarantees/${guaranteeId}/${productId}`);
};

export const addGuarantee = async (productId,data) => {
  return await axios.post(`${API_URL}/admin/market/guarantees/${productId}`, data);
};

export const updateGuarantee = async (guaranteeId,productId, data) => {
  return await axios.put(`${API_URL}/admin/market/guarantees/${guaranteeId}/${productId}`, data);
};

export const deleteGuarantee = async (id) => {
  return await axios.delete(`${API_URL}/admin/market/guarantees/${id}`);
};
