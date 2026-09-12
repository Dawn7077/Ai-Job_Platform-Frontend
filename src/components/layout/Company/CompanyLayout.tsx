import React from 'react';
import { Outlet } from 'react-router-dom';
import { CompanySidebar } from './Sidebar';
import { CompanyNavbar } from './Navbar';

export const CompanyLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <CompanySidebar />
            <CompanyNavbar />
            <main className="pl-64 pt-16 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};