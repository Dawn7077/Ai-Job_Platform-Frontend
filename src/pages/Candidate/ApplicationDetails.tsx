import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCandidate } from "../../hooks/useCandidateHooks";
import { ApplicationDetailResult } from "../../types/candidate";
import { ArrowLeft, Calendar, FileText, ExternalLink, ShieldCheck, Tag, Briefcase,    } from "lucide-react";

export const ApplicationDetailsView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { fetchApplicationById, loading, error } = useCandidate();
    const [details, setDetails] = useState<ApplicationDetailResult | null>(null);

    useEffect(() => {
        if (id) {
            fetchApplicationById(id).then((data) => {
                if (data) setDetails(data);
            });
        }
    }, [id, fetchApplicationById]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-500 font-medium">Loading application record...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto my-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
            </div>
        );
    }

    if (!details || !details.application) {
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

    const { application, job } = details;

    console.log(application,'\n',job)

    return (
        <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
            <div>
                <Link
                    to="/candidate/applications"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to My Applications
                </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between pb-6 border-b border-slate-100">
                    <div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                            Application Record
                        </span>
                        <h1 className="text-xl font-bold text-slate-900 mt-0.5">
                            {job?.title || "Job Application"}
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">Application ID: {application.id}</p>
                    </div>

                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {application.stage || "APPLIED"}
                    </span>
                </div>

                {/* Job Summary Banner if available */}
                {job && (
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-wrap items-center gap-4 text-xs text-slate-600">
                        {/* {job.company && (
                            <span className="flex items-center gap-1 font-medium text-slate-800">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" /> {job.company}
                            </span>
                        )}
                        {job.location && (
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                            </span>
                        )} */}
                        {job.jobType && (
                            <span className="flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {job.jobType}
                            </span>
                        )}
                    </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50/80 border border-slate-100 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Submitted On
                        </span>
                        <p className="text-xs font-semibold text-slate-800">
                            {application.createdAt
                                ? new Date(application.createdAt).toLocaleString()
                                : "N/A"}
                        </p>
                    </div>

                    <div className="p-4 bg-slate-50/80 border border-slate-100 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <Tag className="w-3 h-3" /> Status
                        </span>
                        <p className="text-xs font-semibold text-slate-800">
                            {application.stage || "Under Review"}
                        </p>
                    </div>
                </div>

                {/* Resume Section */}
                <div className="pt-2">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                        Submitted Assets
                    </h3>

                    {application.resumeUrl ? (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800">Submitted Resume</p>
                                    <p className="text-[10px] text-slate-400 truncate max-w-xs">
                                        {application.resumeUrl}
                                    </p>
                                </div>
                            </div>

                            <a
                                href={application.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                            >
                                View File
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No resume attached for this record.</p>
                    )}
                </div>

                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center gap-2 text-[11px] text-indigo-800">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Your application details are securely encrypted and accessible only to hiring team managers.</span>
                </div>
            </div>
        </div>
    );
};