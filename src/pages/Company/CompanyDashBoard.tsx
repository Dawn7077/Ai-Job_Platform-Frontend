import { useNavigate,Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"  




// src/pages/CompanyJobsPage.tsx
import React, { useState, useEffect } from "react";
import { Plus, Briefcase, ListFilter } from "lucide-react";
import { useCompany } from "../../hooks/useCompanyHook"; 

type ViewMode = "LIST" | "CREATE";

export const CompanyDash: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("LIST");
  const { jobs,totalJobs, fetchJobs, createJob, loading, error } = useCompany();
  const {logout} = useAuth()
  const navigate = useNavigate()


  // Initial form state
  const [formData, setFormData] = useState({
    title: "",
    jobType: "REMOTE" as "REMOTE" | "HYBRID" | "ONSITE",
    description: "",
    skills: "",
    salaryMin: 0,
    salaryMax: 0,
  });

  // Fetch jobs when switching to LIST or on initial render
  useEffect(() => {
    if (viewMode === "LIST") {
      fetchJobs();
    }
  }, [viewMode, fetchJobs]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await createJob({
      title: formData.title,
      jobType: formData.jobType,
      description: formData.description,
      skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      salaryMin: Number(formData.salaryMin),
      salaryMax: Number(formData.salaryMax),
    });

    if (response) {
      // Reset form, re-fetch jobs, and toggle back to list view
      setFormData({
        title: "",
        jobType: "REMOTE",
        description: "",
        skills: "",
        salaryMin: 0,
        salaryMax: 0,
      });
      await fetchJobs();
      setViewMode("LIST");
    }
  };


  const handlelogout =async()=>{
        await logout()
        navigate('/login')
    }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Top Page Header with View Toggle Controls */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {viewMode === "CREATE" ? "Create a high-signal job" : "Job Listings"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {viewMode === "CREATE"
              ? "Define what matters clearly so candidates can self-assess and matching stays explainable."
              : "Manage all active, draft, and closed job postings for your organization."}
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("LIST")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "LIST"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            All Jobs
          </button>
          <button
            onClick={() => setViewMode("CREATE")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "CREATE"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Create Job
          </button>
        </div>
      </div>

      {/* CONDITIONAL RENDER BASED ON VIEW MODE */}
      {viewMode === "LIST" ? (
        /* SECTION 1: All Jobs List View */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800">Active & Draft Postings</h2>
            <span className="text-xs text-slate-500">
              Showing {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 text-xs bg-red-50 text-red-600 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          {totalJobs &&
        <div className="mb-4 p-3 text-xs bg-blue-50 text-blue-600 rounded-lg border border-blue-200">
                total jobs listed by our company: {totalJobs}
              </div>

          }

          {loading ? (
            <div className="text-center py-16 text-xs text-slate-400">Loading postings...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">No job postings created yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Switch to "Create Job" to publish your first position.
              </p>
              <button
                onClick={() => setViewMode("CREATE")}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create First Job
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-5 border border-slate-200 rounded-xl hover:border-slate-300 transition-all bg-slate-50/50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          {job.jobType}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            job.status === "OPEN"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {job.description}
                      </p>
                    </div>

                    <div className="text-right whitespace-nowrap pl-4">
                      <p className="text-xs font-bold text-slate-900">
                        ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-200/60">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* SECTION 2: Create Job View */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Post a New Job</h2>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
              <input
                type="text"
                className="w-full text-xs border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Full Stack Engineer"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Type</label>
              <select
                className="w-full text-xs border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                value={formData.jobType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jobType: e.target.value as "REMOTE" | "HYBRID" | "ONSITE",
                  })
                }
              >
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">Onsite</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                placeholder="React, Node.js, TypeScript"
                className="w-full text-xs border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Min Salary ($)
                </label>
                <input
                  type="number"
                  className="w-full text-xs border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={formData.salaryMin}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryMin: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Max Salary ($)
                </label>
                <input
                  type="number"
                  className="w-full text-xs border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={formData.salaryMax}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryMax: Number(e.target.value) })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={5}
                className="w-full text-xs border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white text-xs font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {loading ? "Posting Job..." : "Publish Job Posting"}
            </button>
          </form>
        </div>
      )}


      <div className="flex gap-2 px-6 pb-6 justify-center">
          <Link to='/candidate/home'
             className="px-4 py-2 bg-indigo-200 hover:bg-indigo-300 rounded-lg font-medium transition-colors text-xs"
           >home
        </Link>
        <button onClick={handlelogout}
            className="px-4 py-2 bg-pink-200 hover:bg-pink-400 rounded-lg font-medium transition-colors text-xs"
        >logout</button>
    </div>
    </div>
  );
};