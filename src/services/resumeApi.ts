import { CandidateProfilePayload } from "../types/candidate";
import { api } from "./api";

export interface ATSAnalysis{
    score:number
    strengths:string[]
    improvements:string[]
    suggestions:string[]
}

export interface ProcessResumeResponse{
    profile:CandidateProfilePayload
    resumeUrl:string
    atsAnalysis:ATSAnalysis
}

export interface resumeUploadPayload{
    fileName:string,mimeType:string
}

export const resumeApi = {
    getResumeUploadUrl:async(fileName:string,mimeType:string):Promise<{uploadUrl:string,fileKey:string}>=>{
        const response = await api.post('/candidate/resume/upload-url',{fileName,mimeType})
        console.log(response.data.result)
        return response.data.result
    },
    uploadFileToR2:async(uploadUrl:string,file:File)=>{
        if(!uploadUrl){
            throw new Error('Upload URL is invalid or missing.')
        }
        const response = await fetch(uploadUrl,{
            method:'PUT',
            headers:{
                "Content-Type":file.type
            },
            body:file
        }) 
        console.log(response)
        if (!response.ok) {
            throw new Error(`Failed to upload file to Cloudflare R2,${response?.statusText}`);
        }
        return response
    },
    processResume:async(fileKey:string ):Promise<ProcessResumeResponse>=>{
        const response = await api.post("/candidate/resume/process",{fileKey})
        return response.data.result
    },
    getReadResumeUrl:async():Promise<{success:boolean,resumeUrl: string}>=>{
        const response = await api.post("/candidate/resume/url")
        return response.data
    }
    
}