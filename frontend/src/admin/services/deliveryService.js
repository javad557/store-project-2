import axios from "axios";

const API_URL = "/api";

export const getDeliveries = async () => {
  return await axios.get(`${API_URL}/admin/deliveries`);
};

export const getDelivery = async (id) => {
  return await axios.get(`${API_URL}/admin/deliveries/${id}`);
};


export const updateDelivery = async (id, data) => {
  return await axios.put(`${API_URL}/admin/deliveries/${id}`, data);
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


// export const updateDelivery = async (id, data) => {
//     const response = await axios.put(
//         `${API_URL}/admin/deliveries/${id}`,
//         data,
//         {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json",
//             },
//         }
//     );
//     return response.data; // بازگشت داده‌های پاسخ (شامل message)
// };

// export const deleteDelivery = async (id) => {
//     const response = await axios.delete(`${API_URL}/admin/deliveries/${id}`, {
//         headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json",
//         },
//     });
//     return response.data; // بازگشت response.data
// };

