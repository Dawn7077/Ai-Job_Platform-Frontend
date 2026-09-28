import { useCallback, useState } from "react";
import { companyApi, CompanyProfilePayload, CreateJobPayload, JobItem, ScheduleInterviewPayload, SubmitEvaluationPayload } from "../services/CompanyApi";
import { getErrorMessage } from "../utils/ErrorMessage";
import { Application, Interview } from "../types/candidate";

export function useCompany(){
    const [loading,setLoading] =useState(false)
    const [error,setError] =useState<string|null>(null)
    const [jobs,setJobs] = useState<JobItem[]>([])
    const [totalJobs,setTotalJobs] = useState(0)
    const [applications,setApplications] = useState<Application[]>([])
    const [currentApplication,setCurrentApplication] = useState<Application|null>(null)
    const [currentInterview,setCurrentInterview] = useState<Interview|null>(null)
    const [allInterview,setAllInterview] = useState<Interview[]>([])
    const [companyProfile,setCompanyProfile] = useState<CompanyProfilePayload|null>(null)

    const saveProfile = async(payload:CompanyProfilePayload)=>{
        setLoading(true)
        setError(null)

        try {
            const response = await companyApi.saveProfile(payload)
            return response
        } catch (error) {
            setError(getErrorMessage(error))
        }finally{
            setLoading(false)
        }
    }

    const fetchProfile = useCallback(async():Promise<CompanyProfilePayload|undefined>=>{
        setLoading(true)
        setError(null)

        try {
            const response = await companyApi.getProfile()
            if(response.success){
                setCompanyProfile(response.data)
            }
            return response.data
        } catch (error) {
            setError(getErrorMessage(error))
        }finally{
            setLoading(false)
        }
    },[])

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


    
    const fetchAllApplications = useCallback(async()=>{
        setLoading(true)
        setError(null)
        try {
            const response = await companyApi.getAllApplications()
            if(response.success){
                setApplications(response.applications)
            }
            return response
        } catch (error) {
             setError(getErrorMessage(error))
        }
        finally{
           setLoading(false)
        }
    },[])

    const fetchApplicationsByJobId = useCallback(async(jobId:string,status?:string)=>{
        setLoading(true)
        setError(null)
        try {
            const response = await companyApi.getApplicationsByJobId(jobId,status)
            if(response.success){
                setApplications(response.applications)
            }
            return response
        } catch (error) {
             setError(getErrorMessage(error))
        }
        finally{
           setLoading(false)
        }
    },[])

    const fetchApplicationById = useCallback(async(id:string,jobId:string)=>{
        setLoading(true)
        setError(null)
        try {
            const response = await companyApi.getApplicationById(id,jobId)
            if(response.success){
                setCurrentApplication(response.application)
            }
            return response
        } catch (error) {
             setError(getErrorMessage(error))
        }
        finally{
           setLoading(false)
        }
    },[])

    const udpateApplicationStage = async(id:string,status:string)=>{
        setLoading(true)
        setError(null)
        try {
            const response = await companyApi.updateApplicationStage(id,status)
            return response
        } catch (error) {
             setError(getErrorMessage(error))
        }
        finally{
           setLoading(false)
        }
    }

    const fetchInterviews= useCallback(async()=>{
        setLoading(true)
        setError(null)
        try {
            const response = await companyApi.getAllInterviews()
            if(response.success){
                setAllInterview(response.interviews)
            }
            return response
        } catch (error) {
             setError(getErrorMessage(error))
        }
        finally{
           setLoading(false)
        }
    },[])


    const scheduleInterview = async(payload:ScheduleInterviewPayload)=>{
        setLoading(true)
        setError(null)
        try {
            const response = await companyApi.scheduleInterview(payload)
            return response
        } catch (error) {
             setError(getErrorMessage(error))
        }
        finally{
           setLoading(false)
        }
    }
    const fetchInterviewByRoomKey = useCallback(async(roomKey:string)=>{
        setLoading(true)
        setError(null)
        try {
            const response = await companyApi.getInterviewByRoomKey(roomKey)
            if(response.success){
                setCurrentInterview(response.interview)
            }
            return response
        } catch (error) {
             setError(getErrorMessage(error))
        }
        finally{
           setLoading(false)
        }
    },[])
    const submitEvaluation = async(interviewId:string,payload:SubmitEvaluationPayload)=>{
        setLoading(true)
        setError(null)
        try {
            const response = await companyApi.submitEvaluation(interviewId,payload)
            console.log(response)
            return response
        } catch (error) {
             setError(getErrorMessage(error))
        }
        finally{
           setLoading(false)
        }
    }

    return {
        loading,error,jobs,totalJobs,
        applications,currentApplication,companyProfile,
        allInterview,currentInterview,createJob,fetchJobs,
        fetchAllApplications,fetchApplicationsByJobId,
        fetchApplicationById,udpateApplicationStage,
        scheduleInterview,fetchInterviewByRoomKey,
        submitEvaluation,fetchProfile,saveProfile,
        fetchInterviews,
    }
}