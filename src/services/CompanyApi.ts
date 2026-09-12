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

export const companyApi ={
    postJob:async(payload:CreateJobPayload)=>{
        const response = await api.post('/company/jobs',payload)
        return response.data
    },
    getCompanyJobs:async():Promise<{success:boolean,data:JobItem[]}>=>{
    // 
        const response = await api.get('/company/jobs')
        return response.data
    }

}