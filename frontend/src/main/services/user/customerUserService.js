import axiosInstance from "../../../utils/api"



export const editProfile = async(data)=>{
    return axiosInstance.post(`/main/customer_users/update`,data);
}

export const getOrders  = async()=>{
    return axiosInstance.get(`/main/customer_users/orders`);
}

export const getMyOrderItems = async(id)=>{
    return axiosInstance.get(`/main/customer_users/my_order_items/${id}`)
}

export const getMyFavorites  = async()=>{
    return axiosInstance.get(`/main/customer_users/my_favorites`);
}

export const deleteFavorite = async(id)=>{
    return axiosInstance.delete(`/main/customer_users/my_favorites/${id}`)
}

export const getMyAddresses = async()=>{
    return axiosInstance.get(`/main/customer_users/my_addresses`);
}

export const getMyAddress = async(id)=>{
    return axiosInstance.get(`/main/customer_users/my_address/${id}`);
}

export const deleteMyAddress = async(id)=>{
    return axiosInstance.delete(`/main/customer_users/my_addresses/${id}`)
}

export const getProvinces = async()=>{
    return axiosInstance.get(`/main/customer_users/all_provinces`);
}

export const getCities = async()=>{
    return axiosInstance.get(`/main/customer_users/all_cities`);
}

export const addAddress = async(data)=>{
    return axiosInstance.post(`/main/customer_users/add_address`,data);
}

export const editAddress = async(id,data)=>{
    return axiosInstance.put(`/main/customer_users/edit_address/${id}`,data);
}