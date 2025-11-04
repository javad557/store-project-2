import axiosInstance from "../../../utils/api"



export const getBanners = async()=>{
    return axiosInstance.get(`/main/market/banners`);
}