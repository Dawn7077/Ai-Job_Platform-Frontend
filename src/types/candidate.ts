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
    resumeKey?:string
    experience: ExperienceItem[]
    education:EducationItem[]
}

export interface Interview{
    id :string
    applicationId:string
    candidateId:string
    companyId:string
    roomKey :string
    scheduledAt:Date
    status : "SCHEDULED" | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    createdAt :Date
    updatedAt:Date
}

export interface InterviewEvaluation{
    id:string      
    interviewId:string
    technicalScore:number
    communicationScore:number 
    problemSolvingScore:number      
    notes:string        
    decision:"HIRED"|"REJECTED"|"NEXT_ROUND"|"PENDING"
    createdAt?:Date      
}