import { useState,useEffect} from "react";
import { useAdmin } from "../../hooks/useAdminHook";
import { PendingCompanies } from "../../services/adminApi";
export default function AdminDashBoardVerification(){
    const {fetchPendingCompanies,verifyCompany,loading,error} =useAdmin()
    const [companies,setCompanies] = useState<PendingCompanies[]>([])
    useEffect(()=>{
        fetchPendingCompanies()
        .then(data=>setCompanies(data))
        .catch(()=>{})
    },[])
    const handleverify = async(userId:string,status:"ACTIVE"|"SUSPENDED")=>{
        try {
            await verifyCompany(userId,status)
            setCompanies(prev=> prev.filter(c=> c.id !== userId))
        } finally{
            console.log('done verifcation of',userId)
        }
    }

    const handleFetchPendingCompanies = async()=>{
        const data = await fetchPendingCompanies()
        setCompanies(data)
    }
 

    return (
        <div className="p-6 text-white min-h-screen bg-[#070913]">
            <h1 className="text-2xl font-bold mb-6">Pending Company Verifications</h1>
            <button
                onClick={() => handleFetchPendingCompanies()}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 active:scale-[0.98] text-xs font-medium rounded-lg transition-all text-white shadow"
            >
                fetch
            </button>
            {loading && <p className="text-slate-400 text-sm">Loading...</p>}
            {error && (
                <div className="w-full mb-4 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-xl">
                    {error}
                </div>
            )}

            {!loading && companies.length === 0 ? (
                <p className="text-slate-400 text-sm">No pending companies to review.</p>
            ) : (
                <div className="flex flex-col gap-4 max-w-3xl">
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            className="flex items-center justify-between bg-[#111625] border border-slate-800/80 p-4 rounded-xl shadow-md"
                        >
                            {/* Company Info */}
                            <div className="flex flex-col gap-1 text-left">
                                <span className="font-semibold text-sm text-white">
                                    {company.name || "Unnamed Company"}
                                </span>
                                <span className="text-xs text-slate-400">{company.email}</span>
                                <span className="text-[10px] text-slate-500 font-mono">ID: {company.id}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleverify(company.id, "ACTIVE")}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-500 active:scale-[0.98] text-xs font-medium rounded-lg transition-all text-white shadow"
                                >
                                    Approve
                                </button>
                                
                                <button
                                    onClick={() => handleverify(company.id, "SUSPENDED")}
                                    className="px-4 py-2 bg-red-950/60 border border-red-800 hover:bg-red-900/60 active:scale-[0.98] text-xs font-medium rounded-lg transition-all text-red-200"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}