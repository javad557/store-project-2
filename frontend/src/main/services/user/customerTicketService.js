import axiosInstance from "../../../utils/api";



export const getMyTickets = async()=>{
    return axiosInstance.get(`/main/customer_users/tickets/my_tickets`);
}

export const getRelatedTickets = async (id)=>{
    return await axiosInstance.get(`/main/customer_users/tickets/get_related_tickets/${id}`);
}


export const addTicket = async(data)=>{
    return await axiosInstance.post(`/main/customer_users/tickets/`,data);
}


export const markTicketsAsSeen = async(ticketIds)=>{
    return await axiosInstance.post(`/main/customer_users/tickets/mark_tickets_as_seen`,{ ticketIds });
}

export const changeMyTicketStatus = async(id)=>{
    return await axiosInstance.post(`/main/customer_users/tickets/change_status/${id}`)
}


export const getCategoryTickets = async()=>{
    return axiosInstance.get(`/main/customer_users/tickets/category_tickets`);
}


export const getPriorityTickets = async()=>{
    return axiosInstance.get(`/main/customer_users/tickets/priority_tickets`);
}