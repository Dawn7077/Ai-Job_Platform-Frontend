import { api } from "./api";

export interface CreateJobPayload{
    title:string
    jobType:"REMOTE"|'HYBRID'|"ONSITE"
    description:string
    skills:string[]
    salaryMax:number
    salaryMin:number
}
export interface JobItem {
  id: string;
  companyId: string;
  title: string;
  jobType: "REMOTE" | "HYBRID" | "ONSITE";
  description: string;
  skills: string[];
  salaryMin: number;
  salaryMax: number;
  status: "OPEN" | "CLOSED";
  createdAt: string;
  updatedAt: string;
}
export interface ScheduleInterviewPayload{
    applicationId:string,
    candidateId:string,
    scheduledAt:string|Date
}
export interface SubmitEvaluationPayload{
    technicalScore:number,
    communicationScore:number,
    problemSolvingScore:number,
    notes?:string,
    decision:'HIRED' | 'REJECTED' | 'NEXT_ROUND' | 'PENDING'
}
export interface CompanyProfilePayload{
    id?:string
    userId?:string
    companyName:string
    industry?:string
    companySize?:string
    website?:string 
    location?:string 
    description?:string
    logoUrl?:string
    createdAt?:Date
    updatedAt?:Date
}

export interface CandidateQueryPayload {
    search?:string
    skills?:string
    page?:number
    limit?:number
}
export interface ExperienceItem{
    title:string
    company:string
    startDate:string
    endDate?:string 
    description?:string     
}
export interface EducationItem{
    degree:string 
    institution:string
    startYear:string
    endYear:string     
}


export interface CandidateProfileItem { 
    userId: string;
    email: string;
    firstName:string
    lastName:string
    phone?:string
    headline?:string
    bio?:string
    location?:string
    websiteUrl?:string
    githubUrl?:string
    linkedinUrl?:string
    skills:string[]
    resumeKey?:string
    experience: ExperienceItem[]
    education:EducationItem[]
}

export interface getAllCandidatePayload {
    candidates: CandidateProfileItem[],
    total: number
    page: number
    totalPages: number
}

export const companyApi ={
    getProfile:async():Promise<{success:boolean,data:CompanyProfilePayload}>=>{
        const response = await api.get('/company/profile')
        return response.data
    },
    saveProfile:async(payload:CompanyProfilePayload):Promise<{success:boolean,message:string,data:CompanyProfilePayload}>=>{
        const response = await api.post('/company/profile',payload)
        return response.data
    },
    postJob:async(payload:CreateJobPayload)=>{
        const response = await api.post('/company/jobs',payload)
        return response.data
    },
    getCompanyJobs:async():Promise<{success:boolean,data:JobItem[],totalJobs:number}>=>{
    // 
        const response = await api.get('/company/jobs')
        return response.data
    },
    getAllApplications:async()=>{
        const response = await api.get('/company/applications')
        return response.data
    },
    getApplicationsByJobId:async(jobId:string,status?:string)=>{
        const response = await api.get(`/company/applications/${jobId}`,{
            data:{status}
        })
        return response.data
    },
    getApplicationById:async(id:string,jobId:string)=>{
        const response = await api.get(`/company/application/${id}/${jobId}`)
        return response.data
    },
    updateApplicationStage:async(id:string,stage:string)=>{
        const response = await api.patch(`/company/applications/${id}/stage`,{stage})
        return response.data
    },
    scheduleInterview:async(payload:ScheduleInterviewPayload)=>{
        const response = await api.post(`/company/applications/interview`,payload)
        return response.data
    },
    getAllInterviews:async()=>{
        const response = await api.get('/company/interviews')
        return response.data
    },
    getInterviewByRoomKey:async(roomKey:string)=>{
        const response = await api.post(`/company/interview/room/${roomKey}`)
        return response.data
    },
    submitEvaluation:async(interviewId:string,payload:SubmitEvaluationPayload)=>{
        const response = await api.post(`/company/interview/${interviewId}/evaluation`,payload)
        console.log(response)
        return response.data
    },
    getAllCandidates:async(query?:CandidateQueryPayload):Promise<{success:boolean,data:getAllCandidatePayload}> =>{
        const response = await api.get(`/company/candidates`,{params:query})
        return response.data
    },
    getCandidateDetails:async(candidateId:string):Promise<{success:boolean,data:CandidateProfileItem}> =>{
        const response = await api.get(`/company/candidates/${candidateId}`)
        console.log(response)
        return response.data
    },
    
}