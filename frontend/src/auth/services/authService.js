import axios from "axios";

const API_URL = "/api/auth";

export const sendOtp = async (data) => {
  return await axios.post(`${API_URL}/otp/send`, data);
};

export const getLoginInfo = async () => {
  return await axios.get(`${API_URL}/login-info`);
};