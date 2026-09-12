import { api } from "./api";
export interface ChatResponseData {
    userReq: string;
    intent: string;
    response: string;
}

export const CandidateApi ={
    askMentor:async(data:{userId:string,message:string}):Promise<{success:boolean;data:ChatResponseData}>=>{
        const result = await api.post('/candidate/ai-chat',data)
        return result.data
    }
}