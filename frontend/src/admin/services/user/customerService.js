import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


const API_URL = "/api";

export const getCustomers = async () => {
  return await axiosInstance.get(`${API_URL}/admin/users/customerusers`);
};

export const getCustomer = async (id) => {
  return await axiosInstance.get(`${API_URL}/admin/users/customerusers/${id}`);
};

export const addCustomer = async (data) => {
    const response = await axiosInstance.post(`${API_URL}/admin/users/customerusers`, data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });
    return response.data; // بازگشت response.data
};

export const updateCustomer = async (id, data) => {
    const response = await axiosInstance.put(
        `${API_URL}/admin/users/customerusers/${id}`,
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

export const deleteCustomer = async (id) => {
    const response = await axios.delete(`${API_URL}/admin/users/customerusers/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });
    return response.data; // بازگشت response.data
};


export const toggleCustomerStatus = async (id) => {
    const response = await axios.patch(
        `${API_URL}/admin/users/customerusers/changeBlock/${id}`,
        {},
        {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        }
    );
    return response.data; // بازگشت داده‌های پاسخ (شامل message)
};