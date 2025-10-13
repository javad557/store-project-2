import axiosInstance from "../../../utils/api"; // مسیر فایل api.js


export const getCustomers = async () => {
  return await axiosInstance.get(`/admin/users/customerusers`);
};

export const getCustomer = async (id) => {
  return await axiosInstance.get(`/admin/users/customerusers/${id}`);
};

export const addCustomer = async (data) => {
    const response = await axiosInstance.post(`/admin/users/customerusers`, data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });
    return response.data; // بازگشت response.data
};

export const updateCustomer = async (id, data) => {
    const response = await axiosInstance.put(
        `/admin/users/customerusers/${id}`,
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
   return await axiosInstance.delete( `/admin/users/customerusers/${id}`);
};


export const toggleCustomerStatus = async (id) => {
    const response = await axiosInstance.patch(
        `/admin/users/customerusers/changeBlock/${id}`,
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