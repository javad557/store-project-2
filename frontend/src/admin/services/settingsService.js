import axiosInstance from "../../utils/api"; // مسیر فایل api.js



export const getSettings = async () => {
  return await axiosInstance.get(`/loginregistermanagment`);
};

export const getDelivery = async (id) => {
  return await axiosInstance.get(`/admin/deliveries/${id}`);
};


export const updateSettings = async (data) => {
    const response = await axiosInstance.put(
        `/loginregistermanagment/1`,
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
  return await axiosInstance.delete(`/admin/deliveries/${id}`);
};

export const addDelivery = async (data) => {
    const response = await axiosInstance.post(`/admin/deliveries`, data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });
    return response.data; // بازگشت response.data
};