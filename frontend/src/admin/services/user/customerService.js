import axios from "axios";

const API_URL = "/api";

export const getCustomers = async () => {
  return await axios.get(`${API_URL}/admin/users/customerusers`);
};

export const getCustomer = async (id) => {
  return await axios.get(`${API_URL}/admin/users/customerusers/${id}`);
};

export const addCustomer = async (data) => {
    const response = await axios.post(`${API_URL}/admin/users/customerusers`, data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });
    return response.data; // بازگشت response.data
};

export const updateCustomer = async (id, data) => {
    const response = await axios.put(
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