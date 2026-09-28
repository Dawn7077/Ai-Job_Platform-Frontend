import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCompany } from "../../hooks/useCompanyHook";
import { ArrowLeft, Briefcase, ChevronRight, Search, User } from "lucide-react";

export const CompanyApplicationsList: React.FC = () => {
    const { jobId } = useParams<{ jobId?: string }>();
    const { 
        fetchAllApplications, 
        fetchApplicationsByJobId, 
        applications, 
        loading, 
        error 
    } = useCompany();
    
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        if (jobId) {
            fetchApplicationsByJobId(jobId, statusFilter);
        } else {
            fetchAllApplications();
        }
    }, [jobId, statusFilter, fetchAllApplications, fetchApplicationsByJobId]);

    // Client-side search filtering by candidate name/email
    const filteredApplications = applications.filter((app: any) => {
        const candidateName = app.candidate?.fullName || app.candidateName || app.candidateId || "";
        const candidateEmail = app.candidate?.email || app.email || "";
        const query = searchQuery.toLowerCase();
        return candidateName.toLowerCase().includes(query) || candidateEmail.toLowerCase().includes(query);
    });

    if (loading && applications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-500 font-medium">Loading applications...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto my-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
            {/* Header & Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-lg font-bold text-slate-800">
                        {jobId ? "Job Applicants" : "All Company Applications"}
                    </h1>
                    <p className="text-xs text-slate-500">
                        {jobId ? "Reviewing applicants for this specific position." : "Manage and track all incoming candidate applications."}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                    {jobId && (
                        <Link
                            to="/company/jobs"
                            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors mr-2"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Jobs
                        </Link>
                    )}

                    {/* Search box */}
                    <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search candidate..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="text-xs border border-slate-200 rounded-lg pl-8 pr-3 py-2 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-44"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                        <option value="">All Stages</option>
                        <option value="PENDING">Pending</option>
                        <option value="REVIEWED">Reviewed</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="OFFER">Offer</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Applications List */}
            {filteredApplications.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                    <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No applications found</p>
                    <p className="text-xs text-slate-400 mt-1">There are no candidates matching your current filter criteria.</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
                    {filteredApplications.map((app: any) => {
                        // Handle multiple possible JSON property names from backend responses
                        const candidateDisplayName = app.candidate?.fullName || app.candidateName || "Candidate";
                        const candidateEmail = app.candidate?.email || app.email || "";
                        const targetJobId = jobId || app.jobId || app.job?.id;
                        const appStage = app.status || app.stage || "PENDING";

                        return (
                            <Link
                                key={app.id}
                                to={`/company/applications/${app.id}/${targetJobId}`}
                                className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors group"
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs shrink-0">
                                        {candidateDisplayName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                            {candidateDisplayName}
                                        </p>
                                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                            <Briefcase className="w-3 h-3" /> {candidateEmail || "View details"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                                        {appStage}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};