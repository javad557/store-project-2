import axiosInstance from "../../../utils/api"



export const getAllCategories = async()=>{
    return axiosInstance.get(`main/market/categories`);
}