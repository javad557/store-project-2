import axios from "axios";

const API_URL = "/api";

export const getPermissions = async () => {
  return await axios.get(`${API_URL}/admin/users/permissions`);
};

export const getPermission = async (id) => {
  return await axios.get(`${API_URL}/admin/users/permissions/${id}`);
};

export const addPermission = async (data) => {
  return await axios.post(`${API_URL}/admin/users/permissions`, data);
};

export const updatePermission = async (id, data) => {
  return await axios.put(`${API_URL}/admin/users/permissions/${id}`, data);
};

export const deletePermission = async (id) => {
  return await axios.delete(`${API_URL}/admin/users/permissions/${id}`);
};
