import axios from "axios";

const API_URL = "/api";

export const getSettings = async () => {
  return await axios.get(`${API_URL}/admin/loginregistermanagment`);
};

export const getDelivery = async (id) => {
  return await axios.get(`${API_URL}/admin/deliveries/${id}`);
};


export const updateSettings = async (data) => {
    const response = await axios.put(
        `${API_URL}/admin/loginregistermanagment/1`,
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
  return await axios.delete(`${API_URL}/admin/deliveries/${id}`);
};

export const addDelivery = async (data) => {
    const response = await axios.post(`${API_URL}/admin/deliveries`, data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });
    return response.data; // بازگشت response.data
};