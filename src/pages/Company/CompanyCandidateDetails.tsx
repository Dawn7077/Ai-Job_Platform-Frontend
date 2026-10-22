import { useNavigate, useParams } from "react-router-dom"
import { useCompany } from "../../hooks/useCompanyHook"
import { useEffect } from "react"
import { ArrowLeft, Mail, MapPin, Send } from "lucide-react"


export const CompanyCandidateDetails:React.FC = ()=>{
    const {candidateId} = useParams<{candidateId:string}>()
    const navigate = useNavigate()
    const {currentCandidate,fetchCandidateDetails,loading,error} = useCompany()

    useEffect(()=>{
        if(candidateId){
            fetchCandidateDetails(candidateId)
        }
    },[candidateId,fetchCandidateDetails])

    if(loading)return <div className="text-center py-24 text-xs text-slate-400">Loading candidate details...</div>;
    if (error) return <div className="p-8 max-w-3xl mx-auto text-xs text-red-600 bg-red-50 rounded-xl mt-8">{error}</div>;
    if(!currentCandidate)return <div className="text-center py-24 text-xs text-slate-400">Candidate not found.</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button
            onClick={()=>navigate(-1)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6"
            >
                <ArrowLeft className="w-4 h-4"/>Back to Candidates
            </button>

            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
                {/* Header Profile Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            {currentCandidate.firstName || currentCandidate.lastName ? `${currentCandidate.firstName || ''} ${currentCandidate.lastName || ''}` : "Candidate Profile"}
                        </h1>
                        <p className="text-sm font-medium text-indigo-600 mt-1">
                            {currentCandidate.headline || 'Professional Developer'}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{currentCandidate.email}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{currentCandidate.location ||'Remote'}</span>
                        </div>
                    </div>

                    <button
                    onClick={()=>alert("Still working on invitation feature")}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                        <Send className="w-3.5 h-3.5" /> Invite Candidate
                    </button>
                </div>

                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About Candidate</h3>
                    <p className="text-xs text-slate-700 leading-relaxed">{currentCandidate.bio || "No summary provided."}</p>
                </div>

                {/* Skills */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-1.5">
                        {currentCandidate.skills?.map((skill,idx)=>(
                            <span key={idx} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* resume */}
                {currentCandidate.resumeKey && (
                    <div className="pt-4 border-t border-slate-100">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Resume</h3>
                        <a href={currentCandidate.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
                        >
                            View Resume Document &rarr;
                        </a>
                    </div>  
                )}
            </div>
        </div>
    )
}