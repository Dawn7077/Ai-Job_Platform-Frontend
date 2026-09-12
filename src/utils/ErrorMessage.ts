import { AxiosError } from "axios";

export const getErrorMessage = (error:unknown):string=>{
    if(error instanceof AxiosError){
        console.log(error)
        return error.response?.data?.message || error.message
    }
    if(error instanceof Error){
        console.log(error)
        return error.message
    }
    return 'An unexpected error occured'
}