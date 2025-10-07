import axiosInstance from "../../utils/api"




export const getCategoryTickets = async()=>{
    return await axiosInstance.get('admin/tickets/category_tickets');
}

export const deleteCategoryTicket = async(id)=>{
    return await axiosInstance.delete(`admin/tickets/category_tickets/${id}`);
}

export const updateCategoryTicket = async (id, data) => {
  return await axiosInstance.put(`admin/tickets/category_tickets/${id}`, data);
}

export const addCategoryTicket = async(data)=>{
    return await axiosInstance.post(`admin/tickets/category_tickets`, data)
}