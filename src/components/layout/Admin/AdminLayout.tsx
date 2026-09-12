import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./SidebarAdmin";
import { AdminHeader } from "./Header";

export const AdminLayout =()=>{
    return(
        <div className="flex h-screen bg-[#080B11] text-slate-100 overflow-hidden font-sans">
            <AdminSidebar />

            <div className="flex-1 overflow-y-auto bg-[#0B0F19] p-6">

                <AdminHeader/>

                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Outlet/>
                </main>

            </div>
        </div>
    )
}