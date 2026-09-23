import React, { useEffect, useState } from "react";
import { useCandidate } from "../../hooks/useCandidateHooks";
import { Application } from "../../types/candidate";
import { Link } from "react-router-dom";
import { Clock, ExternalLink, FileCheck, Layers } from "lucide-react";

export const MyApplicationsPage: React.FC = () => {
    const { fetchMyApplications, loading, error } = useCandidate();
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        fetchMyApplications().then((data) => {
            if (data) setApplications(data);
        });
    }, [fetchMyApplications]);

    const getStageBadgeColor =  (stage?:string)=>{
        switch(stage?.toUpperCase()){
            case "ACCEPTED":
            case "HIRED":
            case "OFFER":
                return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
            case "REJECTED":
                return "bg-rose-50 text-rose-700 border-rose-200/60";
            case "INTERVIEW":
            case "ASSESSMENT":
                return "bg-amber-50 text-amber-700 border-amber-200/60";
            default:
                return "bg-slate-100 text-slate-700 border-slate-200";
        }
    }

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Applications</h1>
                <p className="text-xs text-slate-500 mt-1">
                    Track your current status across all roles you have applied for.
                </p>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                    {error}
                </div>
            )}

            {loading && applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-slate-500 font-medium">Loading your applications...</p>
                </div>
            ) : applications.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6">
                    <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No applications submitted yet</p>
                    <p className="text-xs text-slate-400 mt-1 mb-4">
                        Explore available openings to get started.
                    </p>
                    <Link
                        to="/candidate/jobs"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="py-3.5 px-5">Job Reference / ID</th>
                                    <th className="py-3.5 px-5">Current Stage</th>
                                    <th className="py-3.5 px-5">Applied On</th>
                                    <th className="py-3.5 px-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4 px-5 font-semibold text-slate-800">
                                            {app.jobId}
                                        </td>
                                        <td className="py-4 px-5">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStageBadgeColor(
                                                    app.stage
                                                )}`}
                                            >
                                                <Layers className="w-3 h-3" />
                                                {app.stage || "APPLIED"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                 
                                                { app.createdAt ?
                                                (new Date(app.createdAt ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })) 
                                                :
                                                (<span>N/A</span>)
                                                }
                                            </div>
                                        </td>
                                        
                                        <td className="py-4 px-5 text-right">
                                            <Link
                                                to={`/candidate/applications/${app.id}`}
                                                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-xs hover:underline"
                                            >
                                                View Details
                                                <ExternalLink className="w-3 h-3" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};