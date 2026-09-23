import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import {TopHeader} from './Header' 

export const CandidateLayout =()=>{
    
    return(
        <div className="flex h-screen bg-[#090D16] text-white overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TopHeader/>


                <main className="flex-1 overflow-y-auto bg-[#F8FAFC] text-slate-900 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-none]">
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}