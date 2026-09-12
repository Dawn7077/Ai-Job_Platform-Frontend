import { useState } from "react"
import { CandidateApi, ChatResponseData } from "../services/CandidateApi"
import { getErrorMessage } from "../utils/ErrorMessage"


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

    
    return{
        error,loading,
        askMentor,
    }
}