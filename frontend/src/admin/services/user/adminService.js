import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


export const getAdmins = async () => {
  return await axiosInstance.get(`/admin/users/adminusers`);
};

export const getAdmin = async (id) => {
  return await axiosInstance.get(`/admin/users/adminusers/${id}`);
};

export const getUser = async () => {
  return await axiosInstance.get(`/admin/users/get_user`);
};

export const addAdmin = async (data) => {
    const response = await axiosInstance.post(`/admin/users/adminusers`, data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });
    return response.data; // بازگشت response.data
};

export const updateAdmin = async (id, data) => {
    const response = await axiosInstance.put(
        `/admin/users/adminusers/${id}`,
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
    const response = await axiosInstance.delete(`/admin/users/adminusers/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });
    return response.data; // بازگشت response.data
};


export const toggleAdminStatus = async (id) => {
    const response = await axiosInstance.patch(
        `/admin/users/adminusers/changeBlock/${id}`,
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