import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCompany } from "../../hooks/useCompanyHook";
import { 
    ArrowLeft, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    FileText, 
    User, 
    Building2, 
    Briefcase, 
    ChevronRight,
    Star,
    Video
} from "lucide-react";

export const CompanyApplicationDetails: React.FC = () => {
    const { id: applicationId, jobId } = useParams<{ id: string; jobId: string }>();
    const { 
        fetchApplicationById, 
        udpateApplicationStage, 
        scheduleInterview, 
        submitEvaluation, 
        currentApplication, 
        loading, 
        error 
    } = useCompany();

    // Modal / Form state for scheduling & evaluation
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [scheduledAt, setScheduledAt] = useState("");
    const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
    const [evalData, setEvalData] = useState({
        technicalScore: 5,
        communicationScore: 5,
        problemSolvingScore: 5,
        notes: "",
        decision: "HIRE"
    });

    useEffect(() => {
        if (applicationId && jobId) {
            fetchApplicationById(applicationId, jobId);
        }
    }, [applicationId, jobId, fetchApplicationById]);

    const handleStageUpdate = async (newStage: string) => {
        if (!applicationId) return;
        const res = await udpateApplicationStage(applicationId, newStage);
        if (res && res.success && jobId) {
            fetchApplicationById(applicationId, jobId);
        }
    };

    const handleScheduleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentApplication || !scheduledAt) return;

        const res = await scheduleInterview({
            applicationId: currentApplication.id,
            candidateId: currentApplication.candidateId, // Ensure your Application type includes candidateId
            scheduledAt: new Date(scheduledAt).toISOString()
        });

        if (res && res.success) {
            setIsScheduleModalOpen(false);
            if (jobId) fetchApplicationById(applicationId!, jobId);
        }
    };

    const handleEvalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Assuming currentApplication has an interview ID linked, or mock/pass active interview id
        const interviewId = currentApplication?.interviewId; 
        if (!interviewId) return;

        const res = await submitEvaluation(interviewId, evalData);
        if (res && res.success) {
            setIsEvalModalOpen(false);
            if (jobId) fetchApplicationById(applicationId!, jobId);
        }
    };

    if (loading && !currentApplication) {
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

    if (!currentApplication) {
        return (
            <div className="max-w-2xl mx-auto my-12 text-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <p className="text-sm font-semibold text-slate-700">Application Not Found</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                    The requested application record could not be retrieved.
                </p>
                <Link
                    to="/company/applications"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:underline"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Applications
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
            {/* Top Navigation */}
            <div>
                <Link
                    to="/company/applications"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Applications
                </Link>
            </div>

            {/* Header & Status Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-bold text-slate-800">
                            {currentApplication.candidateName || "Candidate Application"}
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {currentApplication.stage}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" /> 
                        Applied for: <span className="font-medium text-slate-700">{currentApplication.jobTitle || "Job Position"}</span>
                    </p>
                </div>

                {/* Workflow Actions */}
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={currentApplication.stage}
                        onChange={(e) => handleStageUpdate(e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                        <option value="APPLIED">Applied</option>
                        <option value="SCREENING">Screening</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="OFFER">Offer</option>
                        <option value="REJECTED">Rejected</option>
                    </select>

                    <button
                        onClick={() => setIsScheduleModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                    >
                        <Calendar className="w-3.5 h-3.5" /> Schedule Interview
                    </button>
                </div>
            </div>

            {/* Candidate & Resume Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Candidate Profile</h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <span className="text-slate-400 block">Email Address</span>
                            <span className="font-medium text-slate-700">{currentApplication.candidateEmail || "N/A"}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block">Phone</span>
                            <span className="font-medium text-slate-700">{currentApplication.candidatePhone || "N/A"}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <h4 className="text-xs font-semibold text-slate-700 mb-2">Cover Letter / Notes</h4>
                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {currentApplication.coverLetter || "No cover letter provided by the candidate."}
                        </p>
                    </div>
                </div>

                {/* Quick Links / Resume Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Documents</h3>
                    {currentApplication.resumeUrl ? (
                        <a
                            href={currentApplication.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group"
                        >
                            <FileText className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-800 truncate">Candidate Resume</p>
                                <p className="text-[10px] text-slate-400">Click to view document</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        </a>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No resume uploaded.</p>
                    )}
                </div>
            </div>

            {/* Schedule Interview Modal */}
            {isScheduleModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
                        <h3 className="text-sm font-bold text-slate-800">Schedule Interview</h3>
                        <form onSubmit={handleScheduleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={scheduledAt}
                                    onChange={(e) => setScheduledAt(e.target.value)}
                                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsScheduleModalOpen(false)}
                                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                                >
                                    Confirm Schedule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};