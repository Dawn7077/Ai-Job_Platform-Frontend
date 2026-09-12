import axios from "axios"; 

export const api = axios.create({
    baseURL:'http://localhost:3000/',
    withCredentials: true,
    headers:{
        'Content-Type':'application/json'
    }
})

api.interceptors.response.use(
    (response)=> response,

    (error)=> {
        const message = error.response?.data?.message || error.message || 'An unexpected error occured'
        return Promise.reject(new Error(message,{cause:error}))
    }
)