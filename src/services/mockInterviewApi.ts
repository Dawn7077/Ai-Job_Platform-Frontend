import {io,Socket} from 'socket.io-client'
import { api } from './api'
import { SessionItem } from '../hooks/useMockInterview'

export interface StartMockPayload{
    jobId?:string
    targetRole:string
    type:"BEHAVIOUR"|"TECHNICAL"|"SYSTEM_DESIGN"
}

export const mockInterviewApi = {
    startSession:async(payload:StartMockPayload):Promise<{session:SessionItem,message:string}> => {
        const res = await api.post("/candidate/mockInterview/start",payload)
        return res.data
    },

    getAllSession:async()=>{
        const res = await api.get("/candidate/mockInterview/my-sessions")
        return res.data 
    },
    completeSession:async(sessionId:string)=>{
        const res = await api.post(`/candidate/mockInterview/${sessionId}/complete`)
        return res.data
    },

    connectSocket:():Socket=>{
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        return io(backendUrl,{
            transports:["websocket"],
            autoConnect:true,
        })
    }



    
}