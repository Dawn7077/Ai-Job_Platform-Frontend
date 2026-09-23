import React, { useEffect, useState } from "react";
import { useCandidate } from "../../hooks/useCandidateHooks";
import { Job } from "../../types/candidate";
import {
    Search,
    MapPin,
    Briefcase,
    Building2,
    CheckCircle2,
    X,
    Send,
    FileText,
    Bookmark,
    ArrowLeft,
    DollarSign,
    Sparkles
} from "lucide-react";

export const CandidateJobsPage: React.FC = () => {
    const { fetchJobs, FetchJobDetails, applyJob, loading, error } = useCandidate();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [detailLoading, setDetailLoading] = useState<boolean>(false);

    // Search and Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");

    // Apply modal state
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [resumeUrl, setResumeUrl] = useState("");
    const [applySuccess, setApplySuccess] = useState<string | null>(null);

    // 1. Initial Load - Fetch Job List
    

    // 2. Load Selected Job Details
    const handleSelectJob = async (jobId: string) => {
        setDetailLoading(true);
        try {
            const detail = await FetchJobDetails(jobId);
            if (detail) {
                setSelectedJob(detail);
            } else {
                // Fallback to list item if detail endpoint yields nothing
                const fallback = jobs.find((j) => j.id === jobId);
                if (fallback) setSelectedJob(fallback);
            }
        } catch {
            const fallback = jobs.find((j) => j.id === jobId);
            if (fallback) setSelectedJob(fallback);
        } finally {
            setDetailLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs().then((data) => {
            if (data && data.length > 0) {
                setJobs(data);
                // Load details for the first job by default
                handleSelectJob(data[0].id);
            }
        });
    }, [fetchJobs]);

    // 3. Handle Job Application
    const handleConfirmApply = async () => {
        if (!selectedJob || !resumeUrl.trim()) return;

        const result = await applyJob(selectedJob.id, resumeUrl);
        if (result) {
            setApplySuccess(`Successfully applied for ${selectedJob.title}!`);
            setShowApplyModal(false);
            setResumeUrl("");
            setTimeout(() => setApplySuccess(null), 5000);
        }
    };

    const filteredJobs = jobs.filter(
        (job) =>
            job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header Area */}
            <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                    Job Intelligence
                </span>
                <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Find your strongest opportunities</h1>
                <p className="text-xs text-slate-500 mt-1">
                    Ranked by role fit, career goals, demonstrated skills, and realistic growth potential.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search title, skills, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                </div>

                <div className="relative w-full md:w-64">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Location or Remote..."
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                </div>

                <button className="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors shrink-0">
                    Search jobs
                </button>
            </div>

            {/* Success Toast */}
            {applySuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium">{applySuccess}</span>
                    </div>
                    <button onClick={() => setApplySuccess(null)}>
                        <X className="w-4 h-4 text-emerald-600" />
                    </button>
                </div>
            )}

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                    {error}
                </div>
            )}

            {/* Two Column Layout (Master-Detail) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Job Cards List (5 Cols) */}
                <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-700">
                            {filteredJobs.length} matched roles
                        </span>
                        <span className="text-[11px] text-slate-400">Sorted by relevance</span>
                    </div>

                    {loading && jobs.length === 0 ? (
                        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-xs text-slate-500">Loading open positions...</p>
                        </div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                            <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-slate-600">No jobs match your criteria</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[calc(100vh-18rem)] overflow-y-auto pr-1">
                            {filteredJobs.map((job) => {
                                const isSelected = selectedJob?.id === job.id;
                                return (
                                    <div
                                        key={job.id}
                                        onClick={() => handleSelectJob(job.id)}
                                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                            isSelected
                                                ? "bg-indigo-50/50 border-indigo-500 ring-1 ring-indigo-500/20 shadow-sm"
                                                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                                                    {job.title?.charAt(0) || "J"}
                                                </div>
                                                <div>
                                                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                                        {job.jobType}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                                            {job.description}
                                        </p>

                                        {/* Skills Tags */}
                                        {job.skills && job.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {job.skills.slice(0, 3).map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-md"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {job.skills.length > 3 && (
                                                    <span className="text-[10px] text-slate-400 self-center">
                                                        +{job.skills.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Salary Range */}
                                        {(job.salaryMin || job.salaryMax) && (
                                            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                                <DollarSign className="w-3 h-3 text-emerald-600" />
                                                <span>
                                                    {job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : ""}
                                                    {job.salaryMin && job.salaryMax ? " - " : ""}
                                                    {job.salaryMax ? `$${job.salaryMax.toLocaleString()}` : ""}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Column: Selected Job Details View (7 Cols) */}
                <div className="lg:col-span-7 sticky top-20">
                    {detailLoading ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-xs text-slate-500">Fetching detailed job description...</p>
                        </div>
                    ) : selectedJob ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                            {/* Top Header Card */}
                            <div className="flex items-start justify-between pb-5 border-b border-slate-100">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
                                        {selectedJob.title?.charAt(0) || "J"}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 leading-tight">
                                            {selectedJob.title}
                                        </h2>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                                Company Workspace
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                {selectedJob.jobType}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors">
                                    <Bookmark className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Status & Salary Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold rounded-full uppercase tracking-wider">
                                    {selectedJob.status || "OPEN"}
                                </span>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-xs font-semibold rounded-full">
                                    {selectedJob.jobType}
                                </span>
                                {(selectedJob.salaryMin || selectedJob.salaryMax) && (
                                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                                        {selectedJob.salaryMin ? `$${selectedJob.salaryMin.toLocaleString()}` : ""} - {selectedJob.salaryMax ? `$${selectedJob.salaryMax.toLocaleString()}` : ""}
                                    </span>
                                )}
                            </div>

                            {/* Action Row */}
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={() => setShowApplyModal(true)}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    Apply now
                                </button>
                            </div>

                            {/* Job Description Body */}
                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    About the role
                                </h3>
                                <div className="text-xs text-slate-600 leading-relaxed space-y-2 whitespace-pre-line">
                                    {selectedJob.description}
                                </div>
                            </div>

                            {/* Required Skills Section */}
                            {selectedJob.skills && selectedJob.skills.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                        Required Skills & Tech Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedJob.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-medium rounded-lg"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-slate-600">
                                Select a job from the left panel to view full details
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Application Modal Popup */}
            {showApplyModal && selectedJob && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-bold text-slate-900">
                                Apply to {selectedJob.title}
                            </h3>
                            <button
                                onClick={() => setShowApplyModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-slate-700">
                                Resume Document Link
                            </label>
                            <div className="relative">
                                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="url"
                                    placeholder="https://drive.google.com/your-resume.pdf"
                                    value={resumeUrl}
                                    onChange={(e) => setResumeUrl(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400">
                                Share a public URL to your PDF resume (Google Drive, Dropbox, Notion, etc.)
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                                onClick={() => setShowApplyModal(false)}
                                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmApply}
                                disabled={!resumeUrl.trim()}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                            >
                                <Send className="w-3.5 h-3.5" />
                                Submit Application
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};