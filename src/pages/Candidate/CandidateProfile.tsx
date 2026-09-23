import React, { useEffect, useState } from "react";
import { Plus, X, Save, User, Briefcase, GraduationCap, Trash2, Loader2, MapPin, Globe,  } from "lucide-react";
import { CandidateProfilePayload } from "../../types/candidate";
import { useCandidate } from "../../hooks/useCandidateHooks";

export default function CandidateProfile() {
    const { loading, error: apiError, fetchProfile, saveProfile } = useCandidate();
    const [localError, setLocalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState<CandidateProfilePayload>({
        firstName: '',
        lastName: '',
        phone: '',
        headline: '',
        bio: '',
        location: '',
        websiteUrl: '',
        githubUrl: '',
        linkedinUrl: '',
        skills: [],
        experience: [],
        education: [],
    });

    const [skillsInput, setSkillsInput] = useState('');

    // Dynamic state for adding experience
    const [expInput, setExpInput] = useState({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
    });

    // Dynamic state for adding education
    const [eduInput, setEduInput] = useState({
        degree: '',
        institution: '',
        startYear: '',
        endYear: '',
    });

    useEffect(() => {
        const loadProfile = async () => {
            const profile = await fetchProfile();
            if (profile) {
                setFormData({
                    firstName: profile.firstName || '',
                    lastName: profile.lastName || '',
                    phone: profile.phone || '',
                    headline: profile.headline || '',
                    bio: profile.bio || '',
                    location: profile.location || '',
                    websiteUrl: profile.websiteUrl || '',
                    githubUrl: profile.githubUrl || '',
                    linkedinUrl: profile.linkedinUrl || '',
                    skills: profile.skills || [],
                    experience: profile.experience || [],
                    education: profile.education || [],
                });
            }
        };

        loadProfile();
    }, [fetchProfile]);

    // Skill Handlers
    const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
        if ('key' in e && e.key !== 'Enter') return;
        e.preventDefault();

        const input = skillsInput.trim();
        if (input && !formData.skills.includes(input)) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, input] }));
            setSkillsInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }));
    };

    // Experience Handlers
    const handleAddExperience = () => {
        if (!expInput.title.trim() || !expInput.company.trim() || !expInput.startDate.trim()) {
            setLocalError('Please fill in Title, Company, and Start Date for experience.');
            return;
        }
        setLocalError('');
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, { ...expInput }]
        }));
        setExpInput({ title: '', company: '', startDate: '', endDate: '', description: '' });
    };

    const handleRemoveExperience = (index: number) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    // Education Handlers
    const handleAddEducation = () => {
        if (!eduInput.degree.trim() || !eduInput.institution.trim() || !eduInput.startYear.trim() || !eduInput.endYear.trim()) {
            setLocalError('Please fill in Degree, Institution, Start Year, and End Year.');
            return;
        }
        setLocalError('');
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, { ...eduInput }]
        }));
        setEduInput({ degree: '', institution: '', startYear: '', endYear: '' });
    };

    const handleRemoveEducation = (index: number) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        setSuccessMessage('');

        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setLocalError('First Name and Last Name are required.');
            return;
        }

        if (formData.skills.length === 0) {
            setLocalError('Please add at least one skill.');
            return;
        }

        try {
            await saveProfile(formData);
            setSuccessMessage('Profile updated successfully!');
        } catch {
            // Error handled via apiError in hook
        }
    };

    const activeError = localError || apiError;

    if (loading && !formData.firstName) {
        return (
            <div className="min-h-screen bg-[#070913] flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#070913] text-white p-4 md:p-8 flex justify-center">
            <div className="w-full max-w-3xl bg-[#111625] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
                    <div>
                        <h1 className="text-2xl font-bold">Candidate Profile</h1>
                        <p className="text-xs text-slate-400 mt-1">Manage your public information, experience, and skills.</p>
                    </div>
                </div>

                {/* Notifications */}
                {activeError && (
                    <div className="mb-6 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-xl text-center">
                        {activeError}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-6 p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs rounded-xl text-center">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div>
                        <h2 className="text-sm font-semibold text-indigo-400 flex items-center gap-2 mb-4">
                            <User className="w-4 h-4" /> Personal Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-slate-300 mb-1.5 font-medium">First Name *</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    placeholder="John"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-300 mb-1.5 font-medium">Last Name *</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    placeholder="Doe"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-slate-300 mb-1.5 font-medium">Phone Number</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-300 mb-1.5 font-medium">Location</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="New York, USA"
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500"
                                    />
                                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-slate-300 mb-1.5 font-medium">Professional Headline</label>
                            <input
                                type="text"
                                value={formData.headline}
                                onChange={e => setFormData({ ...formData, headline: e.target.value })}
                                placeholder="Full-Stack Developer | React & Node.js"
                                className="w-full px-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Links & Portfolios */}
                    <div>
                        <h2 className="text-sm font-semibold text-indigo-400 flex items-center gap-2 mb-4">
                            <Globe className="w-4 h-4" /> Online Presence & Links
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-slate-300 mb-1.5 font-medium">Personal Website</label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={formData.websiteUrl}
                                        onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                                        placeholder="https://myportfolio.com"
                                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-xs outline-none focus:border-indigo-500"
                                    />
                                    <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-300 mb-1.5 font-medium">GitHub Profile</label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={formData.githubUrl}
                                        onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                                        placeholder="https://github.com/username"
                                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-xs outline-none focus:border-indigo-500"
                                    />
                                    {/* <Github className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" /> */}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-300 mb-1.5 font-medium">LinkedIn Profile</label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={formData.linkedinUrl}
                                        onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                                        placeholder="https://linkedin.com/in/username"
                                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-xs outline-none focus:border-indigo-500"
                                    />
                                    {/* < className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" /> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-xs text-slate-300 mb-1.5 font-medium">Bio</label>
                        <textarea
                            rows={4}
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell recruiters about your background, goals, and experience..."
                            className="w-full px-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500 resize-none"
                        />
                    </div>

                    {/* Skills */}
                    <div>
                        <h2 className="text-sm font-semibold text-indigo-400 flex items-center gap-2 mb-3">
                            <Briefcase className="w-4 h-4" /> Skills
                        </h2>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={skillsInput}
                                onChange={e => setSkillsInput(e.target.value)}
                                onKeyDown={handleAddSkill}
                                placeholder="e.g. TypeScript, React, Express"
                                className="flex-1 px-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-medium flex items-center gap-1 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add</span>
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 min-h-11 p-3 bg-[#161C2E]/50 border border-slate-800 rounded-xl">
                            {formData.skills.length === 0 && (
                                <span className="text-xs text-slate-500 self-center">No skills added.</span>
                            )}
                            {formData.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                                >
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(skill)}
                                        className="hover:text-red-400 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Experience Section */}
                    <div>
                        <h2 className="text-sm font-semibold text-indigo-400 flex items-center gap-2 mb-3">
                            <Briefcase className="w-4 h-4" /> Experience
                        </h2>

                        {/* List Existing Experience */}
                        {formData.experience.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {formData.experience.map((exp, index) => (
                                    <div key={index} className="p-3 bg-[#161C2E] border border-slate-800 rounded-xl flex items-start justify-between">
                                        <div>
                                            <h4 className="text-xs font-semibold text-white">{exp.title} at {exp.company}</h4>
                                            <p className="text-[11px] text-slate-400">{exp.startDate} - {exp.endDate || 'Present'}</p>
                                            {exp.description && <p className="text-xs text-slate-300 mt-1">{exp.description}</p>}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExperience(index)}
                                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Experience Input Group */}
                        <div className="p-4 bg-[#161C2E]/40 border border-slate-800 rounded-xl space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Job Title *"
                                    value={expInput.title}
                                    onChange={e => setExpInput({ ...expInput, title: e.target.value })}
                                    className="px-3 py-2 bg-[#161C2E] border border-slate-800 rounded-lg text-xs outline-none focus:border-indigo-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Company *"
                                    value={expInput.company}
                                    onChange={e => setExpInput({ ...expInput, company: e.target.value })}
                                    className="px-3 py-2 bg-[#161C2E] border border-slate-800 rounded-lg text-xs outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Start Date (e.g. Jan 2022) *"
                                    value={expInput.startDate}
                                    onChange={e => setExpInput({ ...expInput, startDate: e.target.value })}
                                    className="px-3 py-2 bg-[#161C2E] border border-slate-800 rounded-lg text-xs outline-none focus:border-indigo-500"
                                />
                                <input
                                    type="text"
                                    placeholder="End Date (e.g. Present)"
                                    value={expInput.endDate}
                                    onChange={e => setExpInput({ ...expInput, endDate: e.target.value })}
                                    className="px-3 py-2 bg-[#161C2E] border border-slate-800 rounded-lg text-xs outline-none focus:border-indigo-500"
                                />
                            </div>
                            <textarea
                                rows={2}
                                placeholder="Description (optional)"
                                value={expInput.description}
                                onChange={e => setExpInput({ ...expInput, description: e.target.value })}
                                className="w-full px-3 py-2 bg-[#161C2E] border border-slate-800 rounded-lg text-xs outline-none focus:border-indigo-500 resize-none"
                            />
                            <button
                                type="button"
                                onClick={handleAddExperience}
                                className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Experience
                            </button>
                        </div>
                    </div>

                    {/* Education Section */}
                    <div>
                        <h2 className="text-sm font-semibold text-indigo-400 flex items-center gap-2 mb-3">
                            <GraduationCap className="w-4 h-4" /> Education
                        </h2>

                        {/* List Existing Education */}
                        {formData.education.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {formData.education.map((edu, index) => (
                                    <div key={index} className="p-3 bg-[#161C2E] border border-slate-800 rounded-xl flex items-start justify-between">
                                        <div>
                                            <h4 className="text-xs font-semibold text-white">{edu.degree}</h4>
                                            <p className="text-[11px] text-slate-400">{edu.institution} ({edu.startYear} - {edu.endYear})</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveEducation(index)}
                                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Education Input Group */}
                        <div className="p-4 bg-[#161C2E]/40 border border-slate-800 rounded-xl space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Degree (e.g. B.S. Computer Science) *"
                                    value={eduInput.degree}
                                    onChange={e => setEduInput({ ...eduInput, degree: e.target.value })}
                                    className="px-3 py-2 bg-[#161C2E] border border-slate-800 rounded-lg text-xs outline-none focus:border-indigo-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Institution *"
                                    value={eduInput.institution}
                                    onChange={e => setEduInput({ ...eduInput, institution: e.target.value })}
                                    className="px-3 py-2 bg-[#161C2E] border border-slate-800 rounded-lg text-xs outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Start Year (e.g. 2018) *"
                                    value={eduInput.startYear}
                                    onChange={e => setEduInput({ ...eduInput, startYear: e.target.value })}
                                    className="px-3 py-2 bg-[#161C2E] border border-slate-800 rounded-lg text-xs outline-none focus:border-indigo-500"
                                />
                                <input
                                    type="text"
                                    placeholder="End Year (e.g. 2022) *"
                                    value={eduInput.endYear}
                                    onChange={e => setEduInput({ ...eduInput, endYear: e.target.value })}
                                    className="px-3 py-2 bg-[#161C2E] border border-slate-800 rounded-lg text-xs outline-none focus:border-indigo-500"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddEducation}
                                className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Education
                            </button>
                        </div>
                    </div>

                    {/* Save Action */}
                    <div className="pt-4 border-t border-slate-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="py-3 px-6 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{loading ? 'Saving Changes...' : 'Save Profile'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}