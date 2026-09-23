import { useCallback, useState } from "react"
import { CandidateApi } from "../services/CandidateApi"
import { getErrorMessage } from "../utils/ErrorMessage"
import { Application, ApplicationDetailResult, CandidateProfilePayload, ChatResponseData, Job } from "../types/candidate"


export const useCandidate = ()=>{
    
    const [error,setError] = useState<string|null>(null)
    const [loading,setLoading] = useState(false)


    const askMentor = async(userId:string,message:string):Promise<{success: boolean;data:ChatResponseData;}|null>=>{
        setError(null)
        setLoading(true)
        try {
            const data = await CandidateApi.askMentor({userId,message})
            console.log(data)
            return data
        } catch (error) {
            setError(getErrorMessage(error)) 
            return null
        }
        finally{
            setLoading(false)
        }
    }

    const fetchJobs = useCallback(async():Promise<Job[]|undefined>=>{
        setError(null)
        setLoading(true)
        try {
            const response = await CandidateApi.getAllJobs()
            return response.data
        } catch (error) {
            setError(getErrorMessage(error))
        }finally{
            setLoading(false)
        }
    },[])

    const applyJob = async(jobId:string,resumeUrl?:string)=>{
        setLoading(true)
        setError(null)
        try {
            const response = await CandidateApi.applyJob({jobId,resumeUrl})
            return response.data
        } catch (error) {
            setError(getErrorMessage(error))
        }
        finally{
            setLoading(false)
        }
    }

    const fetchMyApplications = useCallback(async():Promise<Application[]|undefined>=>{
        setError(null)
        setLoading(true)
        try {
            const response = await CandidateApi.getApplications()
            return response.data
        } catch (error) {
            setError(getErrorMessage(error))
        }finally{
            setLoading(false)
        }
    },[])

    const fetchApplicationById = useCallback(async(id:string):Promise<ApplicationDetailResult|undefined>=>{
        setError(null)
        setLoading(true)
        try {
            const response = await CandidateApi.getApplicationById(id)
            return response.data
        } catch (error) {
            setError(getErrorMessage(error))
        }finally{
            setLoading(false)
        }
    },[])

    const FetchJobDetails =useCallback(async(id:string):Promise<Job|undefined>=>{
        setError(null)
        setLoading(true)
        try {
            const response = await CandidateApi.getJobDetailById(id)
            return response.data
        } catch (error) {
            setError(getErrorMessage(error))
        }finally{
            setLoading(false)
        }
    },[])

    const fetchProfile = useCallback(async():Promise< CandidateProfilePayload| undefined >=>{
        setError(null)
        setLoading(true)
        try {
            const response = await CandidateApi.getProfile()
            return response.data
        } catch (error) {
            setError(getErrorMessage(error))
        }finally{
            setLoading(false)
        }
    },[])

    const saveProfile = useCallback(async(payload:CandidateProfilePayload)=>{
        setError(null)
        setLoading(true)
        try {
            const response = await CandidateApi.saveProfile(payload)
            return response.data
        } catch (error) {
            setError(getErrorMessage(error))
            throw error
        }finally{
            setLoading(false)
        }
    },[])
    
    return{
        error,loading,
        askMentor,fetchJobs,applyJob,
        fetchMyApplications,fetchApplicationById,
        FetchJobDetails,fetchProfile,saveProfile,
    }
}