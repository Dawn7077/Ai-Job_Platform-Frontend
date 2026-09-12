import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Search,
    FileText,
    Video,
    ClipboardCheck,
    GitMerge,
    Building2,
    MessageSquare,
    Bell,
    Activity,
    Settings,
    ShieldCheck,
    Command
} from 'lucide-react';

interface NavItem {
    label: string;
    icon: React.ElementType;
    path: string;
    badge?: string;
}

export const CompanySidebar: React.FC = () => {
    const location = useLocation();

    const mainNav: NavItem[] = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/company/dashboard' },
        { label: 'Jobs', icon: Briefcase, path: '/company/jobs' },
        { label: 'Candidates', icon: Users, path: '/company/candidates' },
        { label: 'Candidate Search', icon: Search, path: '/company/search' },
        { label: 'Applications', icon: FileText, path: '/company/applications' },
        { label: 'Interviews', icon: Video, path: '/company/interviews' },
        { label: 'Assessments', icon: ClipboardCheck, path: '/company/assessments' },
        { label: 'Hiring Pipeline', icon: GitMerge, path: '/company/pipeline' },
        { label: 'Company Profile', icon: Building2, path: '/company/profile' },
        { label: 'Feedback', icon: MessageSquare, path: '/company/feedback' },
    ];

    const bottomNav: NavItem[] = [
        { label: 'Notifications', icon: Bell, path: '/company/notifications', badge: '4' },
        { label: 'Activity', icon: Activity, path: '/company/activity' },
        { label: 'Privacy & Settings', icon: Settings, path: '/company/settings' },
    ];

    return (
        <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-30 select-none border-r border-slate-800">
            {/* Logo Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                        <Command className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-white text-base tracking-tight">Northstar</span>
                </div>
            </div>

            {/* Company / Workspace Switcher */}
            <div className="p-3 border-b border-slate-800/80">
                <div className="p-2.5 bg-slate-800/60 hover:bg-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition-colors">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-7 h-7 rounded-md bg-indigo-950 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-700/50">
                            NV
                        </div>
                        <div className="truncate">
                            <p className="text-xs font-semibold text-white truncate">NovaWorks</p>
                            <p className="text-[10px] text-slate-400">Company</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-2">
                    Hiring Intelligence
                </p>
                {mainNav.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                                isActive
                                    ? 'bg-indigo-600 text-white font-semibold'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Utilities */}
            <div className="p-3 border-t border-slate-800 space-y-1">
                {bottomNav.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4 text-slate-400" />
                                <span>{item.label}</span>
                            </div>
                            {item.badge && (
                                <span className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}

                {/* Privacy Badge Card */}
                <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-slate-200">Privacy protected</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Only approved profile data is shared.</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};