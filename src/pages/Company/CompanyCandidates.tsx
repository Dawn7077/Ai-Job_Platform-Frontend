import React, { useEffect, useState } from "react"
import { useCompany } from "../../hooks/useCompanyHook"
import { ArrowLeft, MapPin, Search, Users } from "lucide-react"
import {  Link } from "react-router-dom"


export const CompanyCandidatesPage = () =>{
    const {candidates,candidatePage,totalCandidates,candidateTotalPages,
        fetchAllCandidates,loading,error
    } = useCompany()
    const [searchQuery,setSearchQuery] = useState('')
    const [skillFilter,setSkillFilter] = useState('')

    useEffect(()=>{
        fetchAllCandidates({search:searchQuery,skills:skillFilter,page:1,})
    },[fetchAllCandidates])

    const handleSearch = (e:React.FormEvent)=>{
        e.preventDefault()
        fetchAllCandidates({search:searchQuery,skills:skillFilter,page:1,})
    }

    return(
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>
                    <p className="text-xs text-slate-500 mt-1">Discover, evaluate, and invite qualified talents</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                    Total Talent:{totalCandidates}
                </span>
            </div>

            {/* Search & Filter Bar */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3"/>
                    <input type="text" 
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e)=>setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <input type="text" 
                    placeholder="Filter by skills"
                    value={skillFilter}
                    onChange={(e)=>setSkillFilter(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all"
                >
                    Search Candidate
                </button>
            </form>
            

            {error && <div className="mb-4 p-3 text-xs bg-red-50 text-red-600 rounded-lg border border-red-200">{error}</div>}
            
            {loading ?(
                <div className="text-center py-16 text-xs text-slate-400">Loading candidates...</div>
            )
            :candidates.length===0?
                (
                    <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
                        <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-slate-700">No candidates found</p>
                        <p className="text-xs text-slate-400 mt-1">Try broadening your search terms or filters.</p>
                    </div>
                ):(
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {candidates.map((candidate)=>(
                            <div key={candidate.userId} className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-900 text-sm">
                                            {candidate.firstName || candidate.lastName ? `${candidate.firstName || '' } ${candidate.lastName || '' }`:`Candidate`}
                                        </h3>
                                        <span className="font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                            {candidate.experience ? `${candidate.experience}`:`Experience not specified`}
                                        </span>
                                        <p className="text-xs text-indigo-600 font-medium mb-2">{candidate.headline || "Software Professional"}</p>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{candidate.bio || "No bio given" }</p>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{candidate.email || "No email given" }</p>

                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {candidate.skills?.slice(0,5).map((skill,idx)=>(
                                                <span key={idx} className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                            <MapPin className="w-3 h-3"/> {candidate.location || 'Remote'}
                                        </span>

                                        <Link to={`/company/candidates/${candidate.userId}`}
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            View Profile &rarr
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )


}


