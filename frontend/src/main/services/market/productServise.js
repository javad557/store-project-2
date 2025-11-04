import axiosInstance from "../../../utils/api"



export const getProducts = async()=>{
    return axiosInstance.get(`/main/market/products`);
}


export const getFiltredProducts = async(data)=>{
    return axiosInstance.post(`/main/market/products/filtred_products`,data);
}


export const getTopSellers = async()=>{
    return axiosInstance.get(`/main/market/products/top_sellers`);
}


export const getMostViewed = async()=>{
    return axiosInstance.get(`/main/market/products/most_viewed`);
}


export const addProductToFavorites = async(id)=>{
    return axiosInstance.post(`/main/market/products/add_product_to_favorites/${id}`)
}