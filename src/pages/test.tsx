import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCandidate } from "../hooks/useCandidateHooks";
import { Application } from "../types/candidate";
import { ArrowLeft,  } from "lucide-react";


export const Testpage:React.FC = ()=>{
    const {id} = useParams<{id:string}>()
    const {fetchApplicationById,loading,error} = useCandidate()
    const [application,setApplication] = useState<Application|null>(null)

    useEffect(()=>{
        if(id){
            fetchApplicationById(id)
            .then(data=>{
                if(data)setApplication(data)
            })
        }
    },[id,fetchApplicationById])

    if(loading){
        return(
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-500 font-medium">Loading application record...</p>
            </div>
        )
    }
    if(error){
        return(
            <div className="max-w-2xl mx-auto my-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
            </div>
        )
    }

    if ( application) {
        return (
            <div className="max-w-2xl mx-auto my-12 text-center p-8 bg-white border border-slate-200 rounded-2xl">
                <p className="text-sm font-semibold text-slate-700">Application Not Found</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                    The requested application record could not be retrieved.
                </p>
                <Link
                    to="/candidate/applications"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:underline"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to My Applications
                </Link>
            </div>
        );
    }


    return(
        <div className="p-6  md:p-8 max-w-3xl mx-auto space-y-6 ">
            <div>
                <Link
                    to="/candidate/applications"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to My Applications
                </Link>
            </div>
        </div>
    )
}