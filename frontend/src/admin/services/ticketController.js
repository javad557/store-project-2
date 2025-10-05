import axiosInstance from "../../utils/api"



export const getTickets = async ()=>{
    return await axiosInstance.get('admin/tickets');

}