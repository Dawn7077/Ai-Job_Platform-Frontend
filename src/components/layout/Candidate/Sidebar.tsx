import { 
    Bot, Briefcase, Code2, FileText, LayoutDashboard, Send,
    Video,Zap,Bell,ShieldCheck, 
    LogOut,
    ChevronRight,
    ChevronLeft
    } from "lucide-react"
import { useAuth } from "../../../hooks/useAuth"
import { NavLink } from "react-router-dom"
import { useState } from "react"

export const Sidebar =()=> {
    const [isSideBarOpen,setSideBarOpen] = useState(true) 
    
    const mainNav =[
        {name:'DashBoard',path:'/candidate/home',icon: LayoutDashboard},
        {name:'AI Mentor',path:'/candidate/ai-mentor',icon: Bot},
        {name:'Resume Studio',path:'/candidate/resume',icon: FileText},
        {name:'Find Job',path:'/candidate/jobs',icon: Briefcase},
        {name:'Application',path:'/candidate/applications',icon: Send},
        {name:'Auto Apply',path:'/candidate/auto-apply',icon: Zap},
        {name:'Interviews',path:'/candidate/onboarding',icon: Video},
        // {name:'Interviews',path:'/candidate/interviews',icon: Video},
        // {name:'Mock Interviews',path:'/candidate/mock-interviews',icon: Code2},
        {name:'Mock Interviews',path:'/candidate/getProfile',icon: Code2},
        // {name:'',path:'/candidate/interviews',icon: Video},
    ]
 
    const {user} =useAuth()


    return(
         <aside className={`bg-[#0B101D] border-r border-slate-800/60 flex flex-col justify-between p-4  shrink-0
            ${isSideBarOpen?'w-20':'w-64'} transition-all duration-300 relative
         `}>
            <button
                onClick={()=>setSideBarOpen(!isSideBarOpen)}
                className="absolute -right-3 top-6 bg-indigo-600 text-white p-1 rounded-full
                 border border-slate-800 shadow-md hover:bg-indigo-500 transition-colors z-10"
                title={isSideBarOpen?"Expand Sidebar":"Collapse SideBar"}
            >
                {isSideBarOpen?<ChevronRight className="w-3.5 h-3.5"/>:<ChevronLeft className="w-3.5 h-3.5"/>}
            </button>

            {/* Logo */}
            <div className="flex flex-col gap-6 overflow-hidden">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">CaI</div>
                    {
                        !isSideBarOpen &&
                        <span className="font-bold text-base text-white tracking-wide">Career AI</span>
                    }
                </div>

            
{/* profile */}
            <div className={`flex items-center gap-3 p-2 bg-[#121829] rounded-xl border border-slate-800/80 ${isSideBarOpen ? 'justify-center':''}`}>
                
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-semibold">{user?.name}
                </div>
                {!isSideBarOpen &&
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-white">{user?.name}</span>
                    <span className="text-[10px] text-slate-400">{user?.role || 'Candidate'}</span>
                </div>
                }
            </div>

            <nav className="flex flex-col gap-1">
                {!isSideBarOpen &&
                    <span className="text-[10px] font-semibold text-slate-500 uppercase px-2 mb-1 whitespace-nowrap">Career Intelligence</span>
                }
                
                {mainNav.map((item)=>{
                    const Icon = item.icon
                    return(
                        <NavLink
                            key={item.path}
                            to={item.path}
                            title={isSideBarOpen?item.name:undefined}
                            className={({isActive})=>
                                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all
                                ${isSideBarOpen?'justify-center':''}
                                ${isActive?
                                    'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                                    :'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                }`
                            }
                        >
                            <Icon className="w-4 h-4"/>
                            {!isSideBarOpen && 
                                <span className="truncate">
                                {item.name}
                                </span>
                            }

                        </NavLink>
                    )
                })

                }
            </nav>
            </div>


            {/* footer */}
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-800/60">
                <button 
                title={isSideBarOpen?'Notifications':undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 ${isSideBarOpen?'justify-center':''}`}>
                    <Bell className="w-4 h-4" />
                    {!isSideBarOpen && <span>Notifications</span>}
                </button>
                <button 
                title={isSideBarOpen?'Settings':undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 ${isSideBarOpen?'justify-center':''}`}>
                    <ShieldCheck className="w-4 h-4" />
                    {!isSideBarOpen && <span>Settings</span>}
                </button>
                <button
                title={isSideBarOpen?'Logout':undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 ${isSideBarOpen?'justify-center':''}`}>
                    <LogOut className="w-4 h-4" />
                    {!isSideBarOpen && 
                        <span>Logout</span>
                    }
                </button>
            </div>
         </aside>
    )
}