import { useCallback, useState } from "react";
import { ProcessResumeResponse, resumeApi } from "../services/resumeApi";
import { getErrorMessage } from "../utils/ErrorMessage";

export type uploadStage = 'idle' | 'getting_url' | 'uploading_r2' | 'parsing_ai' | 'success' | 'error';

export function useResumeHook(){
    const [stage,setStage] = useState<uploadStage>('idle')
    const [error,setError] = useState<string | null>(null)
    const [result,setResult] = useState<ProcessResumeResponse | null>(null)
    const [loading,setLoading] = useState(false)

    const uploadAndProcess = useCallback(async(file:File)=>{
        setStage('getting_url')
        setError(null)
        setLoading(true)
        try {
            const  {uploadUrl,fileKey}  = await resumeApi.getResumeUploadUrl(file.name,file.type)
            console.log("fileKey=>",fileKey )
            if(!uploadUrl ||!fileKey){
                throw new Error ('Error on obtaining a valid upload URL or file key')
            }
            setStage('uploading_r2')
            const res = await resumeApi.uploadFileToR2(uploadUrl,file) 
            if(!res.ok){
                throw new Error( res.statusText)
            }

            setStage('parsing_ai')
            const data = await resumeApi.processResume(fileKey)
            setResult(data)
            setStage('success')
            console.log(data,'\n===>\n',result)
            return data

        } catch (error) {
            setStage('error')
            setError(getErrorMessage(error))
        }finally{
            setLoading(false)
        }
    },[])

    const reset= ()=>{
        setStage('idle')
        setError(null)
        setResult(null)
    }

    return{
        stage,error,loading,result,setResult,
        uploadAndProcess,reset
    }

}