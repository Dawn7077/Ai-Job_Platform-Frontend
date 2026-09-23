export interface Job{
    id:string
    companyId:string
    title:string
    jobType:"REMOTE"|"HYBRID"|"ONSITE"
    description:string
    skills:string[]
    salaryMax:number
    salaryMin:number
    status:'OPEN'|'CLOSED'
    createdAt:Date
    updatedAt:Date
    
}

export interface ChatResponseData {
    userReq: string;
    intent: string;
    response: string;
}

export interface Application {
    id:string
    jobId:string
    candidateId:string
    stage:"APPLIED"|"SCREENING"|"INTERVEIW"|"OFFER"|"HIRED"|"REJECTED"
    resumeUrl?:string
    createdAt?:string
    updatedAt?:string
}

export interface ApplicationDetailResult{
    application:Application,
    job:Job|null
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


export interface CandidateProfilePayload {
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
    experience: ExperienceItem[]
    education:EducationItem[]
}