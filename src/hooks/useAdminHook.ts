import { useState } from "react";
import { adminApi,PendingCompanies } from "../services/adminApi";
import { getErrorMessage } from "../utils/ErrorMessage";

export const useAdmin = ()=>{
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState<string|null>(null)

    const fetchPendingCompanies = async(): Promise<PendingCompanies[]> =>{
        setLoading(true)
        setError(null)

        try {
            const data = await adminApi.getPendingCompanies()
            return data.companies
        } catch (error) { 
            setError(getErrorMessage(error)) 
            return []
            //throw error
        }finally{
            setLoading(false)
        }
    }

    const verifyCompany = async(userId:string, status:'ACTIVE'|'SUSPENDED')=>{
        setLoading(true)
        setError(null)
        try {
            const data = await adminApi.verifyCompany({userId,status})
            return data
        } catch (error) {
            setError(getErrorMessage(error))
        }finally{
            setLoading(false)
        }
    }


    return {
        loading,
        error,
        fetchPendingCompanies,
        verifyCompany
    }
}