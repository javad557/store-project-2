import axiosInstance from "../../../utils/api"



export const getAllBrands = async()=>{
    return axiosInstance.get(`main/market/brands`);
}