import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


const API_URL = "/api";

export const getAdmins = async () => {
  return await axiosInstance.get(`${API_URL}/admin/users/adminusers`);
};

export const getAdmin = async (id) => {
  return await axiosInstance.get(`${API_URL}/admin/users/adminusers/${id}`);
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
    const response = await axiosInstance.put(
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
    const response = await axiosInstance.delete(`${API_URL}/admin/users/adminusers/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });
    return response.data; // بازگشت response.data
};


export const toggleAdminStatus = async (id) => {
    const response = await axiosInstance.patch(
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