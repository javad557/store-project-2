import axios from "axios";

const API_URL = "/api";

export const getAdmins = async () => {
  return await axios.get(`${API_URL}/admin/users/adminusers`);
};

export const getAdmin = async (id) => {
  return await axios.get(`${API_URL}/admin/users/adminusers/${id}`);
};

export const addAdmin = async (data) => {
    const response = await axios.post(`${API_URL}/admin/users/adminusers`, data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });
    return response.data; // بازگشت response.data
};

export const updateAdmin = async (id, data) => {
    const response = await axios.put(
        `${API_URL}/admin/users/adminusers/${id}`,
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

export const deleteAdmin = async (id) => {
    const response = await axios.delete(`${API_URL}/admin/users/adminusers/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });
    return response.data; // بازگشت response.data
};


export const toggleAdminStatus = async (id) => {
    const response = await axios.patch(
        `${API_URL}/admin/users/adminusers/changeBlock/${id}`,
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