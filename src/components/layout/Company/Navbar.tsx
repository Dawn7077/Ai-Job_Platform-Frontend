import React from 'react';
import { Search } from 'lucide-react';

export const CompanyNavbar: React.FC = () => {
    return (
        <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-8">
            {/* Search Bar */}
            <div className="relative w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search candidates, jobs, interviews..."
                    className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200 text-slate-500 font-mono px-1.5 py-0.5 rounded">
                    ⌘K
                </span>
            </div>

            {/* Right Profile / Controls */}
            <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
                    Interactive product preview
                </span>
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                    NV
                </div>
            </div>
        </header>
    );
};