import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


const API_URL = "/api";

export const getComments = async (search = '', status = '') => {
  try {
    const response = await axiosInstance.get(`${API_URL}/admin/market/comments`, {
      params: { search, status: status === '' ? undefined : status }, // اطمینان از ارسال status
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response;
  } catch (error) {
    console.error('خطا در سرویس دریافت نظرات:', JSON.stringify(error.response?.data || error.message, null, 2));
    throw error;
  }
};

export const getComment = async (id) => {
  return await axiosInstance.get(`${API_URL}/admin/market/comments/${id}`);
};

export const changeCommentStatus = async (id, data) => {
  return await axiosInstance.patch(`${API_URL}/admin/market/comments/changeStatus/${id}`, data);
};

