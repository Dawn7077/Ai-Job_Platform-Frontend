import { Application, ApplicationDetailResult, CandidateProfilePayload, ChatResponseData, Job } from "../types/candidate";
import { api } from "./api";





export const CandidateApi ={
    askMentor:async(data:{userId:string,message:string}):Promise<{success:boolean;data:ChatResponseData}>=>{
        const result = await api.post('/candidate/ai-chat',data)
        return result.data
    },
    getAllJobs:async():Promise<{success:boolean,data:Job[]}>=>{
        const result = await api.get('/candidate/jobs')
        return result.data
    },
    applyJob:async(data:{jobId:string, resumeUrl?:string}):Promise<{success:boolean,data:Application}>=>{
        const result = await api.post('/application/apply',data)
        return result.data
    },

    getApplications:async():Promise<{success:boolean,data:Application[]}>=>{
        const result = await api.get('/application/my-applications')
        return result.data
    },
    getApplicationById:async(id:string):Promise<{success:boolean,data:ApplicationDetailResult}>=>{
        const result = await api.get(`/application/${id}`)
        return result.data
    },
    getJobDetailById:async(id:string):Promise<{success:boolean,data:Job}>=>{
        const result = await api.get(`/candidate/jobs/${id}`)
        return result.data
    },
    saveProfile:async(payload:CandidateProfilePayload):Promise<{success:boolean,message:string,data:CandidateProfilePayload}>=>{
        console.log(payload)
        const response = await api.post('/candidate/profile',payload)
        return response.data
    },
    getProfile:async():Promise<{success:boolean,data:CandidateProfilePayload}>=>{
        const response = await api.get('/candidate/profile')
        return response.data
    }

}