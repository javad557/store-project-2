import axiosInstance from "../../utils/api"


export const getOrders = async()=>{
    return await axiosInstance.get(`admin/orders`);
}

export const getOrder = async(id)=>{
    return await axiosInstance.get(`admin/orders/${id}`);
}

export const getOrderItems = async(id)=>{
    return await axiosInstance.get(`admin/orders/order_items/${id}`);
}


export const updateOrderStatus = async (orderId, newStatus) => {
  return await axiosInstance.put(`/admin/orders/${orderId}`, newStatus);
};