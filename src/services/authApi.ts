import { api } from "./api";

export const authApi = {
    login:async(credential:{email:string,password:string})=>{
        const response = await api.post('/user/login',credential)
        return response.data
    },
    signup:async (userData:{email:string,password:string,role:string})=>{
        const response = await api.post('/user/signup',userData)
        return response.data
    },

    logout:async()=>{
        const response = await api.post('/user/logout')
        return response.data
    },

    getMe:async()=>{
        const response =await api.get('/user/getMe')
        return response.data
    }

}