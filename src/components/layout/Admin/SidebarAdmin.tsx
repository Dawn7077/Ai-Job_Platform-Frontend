import { Building2, Cpu, LayoutDashboard, Settings, Users ,LogOut } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../../../hooks/useAuth"
import { useNavigate } from "react-router-dom"

export const AdminSidebar= ()=>{
    const navItems =[
        {name:'Dashboard',path:'/admin/home',icon:LayoutDashboard},
        {name:'Company Verification',path:'/admin/verifications',icon:Building2,  },
        {name:'User & Roles',path:'/admin/users',icon:Users},
        {name:'Ai System Health',path:'/admin/ai-health',icon:Cpu},
        {name:'Settings',path:'/admin/settings',icon:Settings},
    ]
    const navigate = useNavigate()
    const {logout} = useAuth() 

    const handlelogout =async()=>{
        await logout()
        navigate('/candidate/home')
    }

    return(<> 
        <aside className="w-64 bg-[#0E131F] border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0">
            <div className="flex flex-col gap-6">
                {/* Logo */}
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-indigo-600 to-indigo-400 
                        flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20
                    ">AI</div>
                    <div>
                        <h1 className="font-bold text-sm tracking-wide text-white">Career AI</h1>
                        <p className="text-[10px] text-slate-400 font-medium">Intelligence Platform</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 bg-[#141A29] rounded-xl border border-slate-800/80">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
                        SA
                    </div>
                    {/* user status */}
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white">Super Admin</span>
                        <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Online
                        </span>
                    </div>
                </div>


                {/* Navigation */}
                <nav className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-1">
                        System Control
                    </span>

                    {navItems.map(item=>{
                        const Icon = item.icon
                        return(
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({isActive})=>
                                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                                    isActive?
                                        'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                                        :'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="w-4 h-4"/>
                                    <span>{item.name}</span>
                                </div>
                                 

                            </NavLink>
                        )
                    })}

                </nav>
            </div>
            {/* footer */}

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5"> 
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                            Name
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-slate-200">UserName</span>
                            <span className="text-[10px] text-slate-500">User@Email</span>
                        </div>
                    </div>
                    <button
                    onClick={handlelogout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/60 transition-colors">
                        <LogOut className="w-4 h-4" />
                    </button>
            </div>
        </aside>
    </>)
}