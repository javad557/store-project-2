import axiosInstance from "../../utils/api"


export const getPages = async()=>{
    return await axiosInstance.get(`/admin/marketing/pages`);
}

export const getPage = async(id)=>{
    return await axiosInstance.get(`/admin/marketing/pages/${id}`);
}

export const deletePage = async(id)=>{
    return await axiosInstance.delete(`/admin/marketing/pages/${id}`)
}

export const updatePageStatus = async (id, data) => {
  return await axiosInstance.put(`/admin/marketing/pages/updateStatus/${id}`, data);
};

export const updatePage = async(id,data)=>{
    return await axiosInstance.put(`/admin/marketing/pages/${id}`, data);
}


export const addPage = async(data)=>{
    const response = await axiosInstance.post(`/admin/marketing/pages`,data,{
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    })
    return response.data;
}