import axiosInstance from "../../utils/api"; // مسیر فایل api.js



export const getDeliveries = async () => {
  return await axiosInstance.get(`/admin/deliveries`);
};

export const getDelivery = async (id) => {
  return await axiosInstance.get(`/admin/deliveries/${id}`);
};


export const updateDelivery = async (id, data) => {
  return await axiosInstance.put(`/admin/deliveries/${id}`, data);
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




// import axiosInstance from "../../utils/api"; // مسیر فایل api.js

// export const getDeliveries = async () => {
//   return await axiosInstance.get("/admin/deliveries");
// };

// export const getDelivery = async (id) => {
//   return await axiosInstance.get(`/admin/deliveries/${id}`);
// };

// export const updateDelivery = async (id, data) => {
//   return await axiosInstance.put(`/admin/deliveries/${id}`, data);
// };

// export const deleteDelivery = async (id) => {
//   return await axiosInstance.delete(`/admin/deliveries/${id}`);
// };

// export const addDelivery = async (data) => {
//   return await axiosInstance.post("/admin/deliveries", data, {
//     headers: {
//       "Content-Type": "application/json",
//       "Accept": "application/json",
//     },
//   });
// };

// // export const updateDelivery = async (id, data) => {
// //     const response = await axios.put(
// //         `/admin/deliveries/${id}`,
// //         data,
// //         {
// //             headers: {
// //                 "Content-Type": "application/json",
// //                 "Accept": "application/json",
// //             },
// //         }
// //     );
// //     return response.data; // بازگشت داده‌های پاسخ (شامل message)
// // };

// // export const deleteDelivery = async (id) => {
// //     const response = await axios.delete(`/admin/deliveries/${id}`, {
// //         headers: {
// //             "Content-Type": "application/json",
// //             "Accept": "application/json",
// //         },
// //     });
// //     return response.data; // بازگشت response.data
// // };



