import { useCallback, useState } from "react";
import { companyApi, CreateJobPayload, JobItem } from "../services/CompanyApi";
import { getErrorMessage } from "../utils/ErrorMessage";

export function useCompany(){
    const [loading,setLoading] =useState(false)
    const [error,setError] =useState<string|null>(null)
    const [jobs,setJobs] = useState<JobItem[]>([])
    const [totalJobs,setTotalJobs] = useState(0)

    const createJob = async(payload:CreateJobPayload)=>{
        setLoading(true)
        setError(null)

        try {
            const response = await companyApi.postJob(payload)
            return response
        } catch (error) {
            setError(getErrorMessage(error))
        }finally{
            setLoading(false)
        }
    }
    // useCallback
    const fetchJobs = useCallback(
        async()=>{
        setLoading(true)
        setError(null)
        try {
            const response = await companyApi.getCompanyJobs()
            if(response.success){
                setJobs(response.data)
                setTotalJobs(response.totalJobs)
            }
            return response 
        } catch (error) {
            setError(getErrorMessage(error))
        }
        finally{
           setLoading(false)
        }
        

    },[])
    

    return {
        loading,error,
        createJob,fetchJobs,
        jobs,totalJobs
    }
}