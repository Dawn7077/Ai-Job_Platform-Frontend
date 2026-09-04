import { api } from "./api";

export const authApi = {
    login:async(credential:{email:string,password:string})=>{
        const response = await api.post('/user/login',credential)
        return response.data
    },
    signupOTP:async (userData:{email:string,password:string,role:string})=>{
        const response = await api.post('/user/signup-otp',userData)
        return response.data
    },
    verifySignUp:async(data:{email:string,otp:string})=>{
        const response = await api.post('/user/verify-signup',data)
        return response.data
    },

    logout:async()=>{
        const response = await api.post('/user/logout')
        return response.data
    },

    getMe:async()=>{
        const response =await api.get('/user/getMe')
        return response.data
    },
    forgotPassword:async(email:string)=>{
        const response = await api.post('/user/forgot-password',{email})
        return response.data
    },
    resetPassword: async(data:{email:string,otp:string,newPassword:string})=>{
        const response = await api.post('/user//reset-password',data)
        return response.data
    },
    googleLogin:async(data:{token:string;role:'CANDIDATE'|'COMPANY'|'ADMIN'})=>{
        const response = await api.post('/user/google-login',data)
        return response.data
    }

}