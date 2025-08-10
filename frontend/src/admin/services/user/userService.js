import axios from "axios";

const API_URL = "/api";

export const getUsers = async () => {
  return await axios.get(`${API_URL}/admin/users/customerusers`);
};

export const getUser = async (id) => {
  return await axios.get(`${API_URL}/admin/users/adminusers/${id}`);
};

export const addUser = async (data) => {
  return await axios.post(`${API_URL}/admin/users/adminusers`, data);
};

export const updateUser = async (id, data) => {
  return await axios.put(`${API_URL}/admin/users/adminusers/${id}`, data);
};

export const deleteAdmin = async (id) => {
  return await axios.delete(`${API_URL}/admin/users/adminusers/${id}`);
};

export const toggleAdminStatus = async (id) => {
  return await axios.patch(`${API_URL}/admin/users/adminusers/changeBlock/${id}`);
};