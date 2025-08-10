import axios from "axios";

const API_URL = "/api";

export const getRoles = async () => {
  return await axios.get(`${API_URL}/admin/users/roles`);
};

export const getRole = async (id) => {
  return await axios.get(`${API_URL}/admin/users/roles/${id}`);
};

export const addRole = async (data) => {
  return await axios.post(`${API_URL}/admin/users/roles`, data);
};

export const updateRole = async (id, data) => {
  return await axios.put(`${API_URL}/admin/users/roles/${id}`, data);
};

export const deleteRole = async (id) => {
  return await axios.delete(`${API_URL}/admin/users/roles/${id}`);
};
