import { api } from "./api";


export const register=async (formData)=>{
  
    const res=await api.post("/register",formData)
    return res;
}
export const login=async (formData)=>{
    const res=await api.post("/login",formData);
   
    return res;
}
export const getUserProfile = async () => {
  const res = await api.get('/profile'); 
 
  return res.data; 
};



