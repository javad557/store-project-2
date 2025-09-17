import axiosInstance from "../../utils/api"; // مسیر فایل api.js

const API_URL = "/api";

export const getSettings = async () => {
  return await axiosInstance.get(`${API_URL}/loginregistermanagment`);
};

export const getDelivery = async (id) => {
  return await axiosInstance.get(`${API_URL}/admin/deliveries/${id}`);
};


export const updateSettings = async (data) => {
    const response = await axiosInstance.put(
        `${API_URL}/loginregistermanagment/1`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        }
    );
    return response.data; // بازگشت داده‌های پاسخ (شامل message)
};

export const deleteDelivery = async (id) => {
  return await axiosInstance.delete(`${API_URL}/admin/deliveries/${id}`);
};

export const addDelivery = async (data) => {
    const response = await axiosInstance.post(`${API_URL}/admin/deliveries`, data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });
    return response.data; // بازگشت response.data
};