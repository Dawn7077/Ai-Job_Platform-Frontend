import React, { useEffect, useState } from "react";
import { Save, Building2, Globe, MapPin, Users, Loader2 } from "lucide-react";
import { CompanyProfilePayload } from "../../services/CompanyApi";// Adjust path as needed
import { useCompany } from "../../hooks/useCompanyHook";   // Adjust path as needed

export default function CompanyProfile() {
    const { loading, error: apiError, fetchProfile, saveProfile } = useCompany();
    const [localError, setLocalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState<CompanyProfilePayload>({
        companyName: '',
        industry: '',
        companySize: '',
        website: '',
        location: '',
        description: '',
        logoUrl: '',
    });

    useEffect(() => {
        const loadProfile = async () => {
            const profile = await fetchProfile();
            if (profile) {
                setFormData({
                    companyName: profile.companyName || '',
                    industry: profile.industry || '',
                    companySize: profile.companySize || '',
                    website: profile.website || '',
                    location: profile.location || '',
                    description: profile.description || '',
                    logoUrl: profile.logoUrl || '',
                });
            }
        };

        loadProfile();
    }, [fetchProfile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        setSuccessMessage('');

        if (!formData.companyName.trim()) {
            setLocalError('Company Name is required.');
            return;
        }

        try {
            await saveProfile(formData);
            setSuccessMessage('Company profile updated successfully!');
        } catch {
            // Error handled via apiError in hook
        }
    };

    const activeError = localError || apiError;

    if (loading && !formData.companyName) {
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
                        <h1 className="text-2xl font-bold">Company Profile</h1>
                        <p className="text-xs text-slate-400 mt-1">Manage your organization details, brand presence, and public profile.</p>
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
                    {/* Organization Information */}
                    <div>
                        <h2 className="text-sm font-semibold text-indigo-400 flex items-center gap-2 mb-4">
                            <Building2 className="w-4 h-4" /> Organization Details
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-slate-300 mb-1.5 font-medium">Company Name *</label>
                                <input
                                    type="text"
                                    value={formData.companyName}
                                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                    placeholder="Acme Corp"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-300 mb-1.5 font-medium">Industry</label>
                                <input
                                    type="text"
                                    value={formData.industry || ''}
                                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                    placeholder="Software & Technology"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-slate-300 mb-1.5 font-medium">Company Size</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.companySize || ''}
                                        onChange={e => setFormData({ ...formData, companySize: e.target.value })}
                                        placeholder="e.g. 50-200 employees"
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500"
                                    />
                                    <Users className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-300 mb-1.5 font-medium">Location</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.location || ''}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="San Francisco, CA"
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500"
                                    />
                                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Online Presence & Branding */}
                    <div>
                        <h2 className="text-sm font-semibold text-indigo-400 flex items-center gap-2 mb-4">
                            <Globe className="w-4 h-4" /> Branding & Links
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-300 mb-1.5 font-medium">Website URL</label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={formData.website || ''}
                                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="https://acme.com"
                                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-xs outline-none focus:border-indigo-500"
                                    />
                                    <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-300 mb-1.5 font-medium">Logo URL</label>
                                <input
                                    type="url"
                                    value={formData.logoUrl || ''}
                                    onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                                    placeholder="https://acme.com/logo.png"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-xs outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Company Description */}
                    <div>
                        <label className="block text-xs text-slate-300 mb-1.5 font-medium">Company Description</label>
                        <textarea
                            rows={4}
                            value={formData.description || ''}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Tell candidates about your company culture, mission, tech stack, and benefits..."
                            className="w-full px-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500 resize-none"
                        />
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