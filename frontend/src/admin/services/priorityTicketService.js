import axiosInstance from "../../utils/api"




export const getPriorityTickets = async()=>{
    return await axiosInstance.get('admin/tickets/priority_tickets');
}

export const deletePriorityTicket = async(id)=>{
    return await axiosInstance.delete(`admin/tickets/priority_tickets/${id}`);
}

export const updatePriorityTicket = async (id, data) => {
  return await axiosInstance.put(`admin/tickets/priority_tickets/${id}`, data);
}

export const addPriorityTicket = async(data)=>{
    return await axiosInstance.post(`admin/tickets/priority_tickets`, data)
}