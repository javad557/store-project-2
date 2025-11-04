import axiosInstance from "../../utils/api"



export const getTickets = async ()=>{
    return await axiosInstance.get('admin/tickets');
}

export const getRelatedTickets = async (id)=>{
    return await axiosInstance.get(`admin/tickets/get_related_tickets/${id}`);
}


export const getNewTickets = async ()=>{
    return await axiosInstance.get('admin/tickets/newTickets');
}

export const getTicket = async(id)=>{
    return await axiosInstance.get(`admin/tickets/${id}`);
}

export const addTicket = async(data)=>{
    return await axiosInstance.post(`admin/tickets`,data);
}

export const changeStatus = async(id)=>{
    return await axiosInstance.post(`admin/tickets/change_status/${id}`)
}

export const markTicketsAsSeen = async(ticketIds)=>{
    return await axiosInstance.post(`admin/tickets/mark_tickets_as_seen/`,{ ticketIds });
}