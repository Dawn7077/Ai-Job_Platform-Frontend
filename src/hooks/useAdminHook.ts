import {  useCallback, useState } from "react";
import { adminApi,PendingCompanies, UserFilterParams } from "../services/adminApi";
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

    const fetchUsers = useCallback(async(params:UserFilterParams)=>{
        setError(null)
        setLoading(true)
        try {
            const data = await adminApi.getUser(params)
            return data
        } catch (error) {
            setError(getErrorMessage(error))
        }finally{
            setLoading(false)
        }
    },[]) 

    const udpateUserStatus = async(userId:string,status:"PENDING"|'ACTIVE'|'SUSPENDED')=>{
        setError(null)
        setLoading(true)
        try {
            const data = await adminApi.updateUserStatus(userId,status)
            return data
        } catch (error) {
            setError(getErrorMessage(error))
        }finally{
            setLoading(false)
        }
    }
    const udpateUserRole = async(userId:string,role:'CANDIDATE'|'COMPANY'|'ADMIN')=>{
        setError(null)
        setLoading(true)
        try {
            const data = await adminApi.updateUserRole(userId,role)
            return data
        } catch (error) {
            setError(getErrorMessage(error))
        }finally{
            setLoading(false)
        }
    }

    const deleteUser = async(userId:string)=>{
        setError(null)
        setLoading(true)
        try {
            const data = await adminApi.deleteUser(userId)
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
        verifyCompany,fetchUsers,
        udpateUserStatus,udpateUserRole,
        deleteUser
    }
}