import {Bell, Search, Shield} from 'lucide-react'
export const AdminHeader = ( )=>{
    return(
        <header className="h-14 bg-[#0E131F] border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0">
                <div className="relative w-80">
                   <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"/>
                    <input type="text"
                    placeholder='Search companies candidate systems...'
                    className='w-full bg-[#141A29] border border-slate-800 text-xs text-slate-200 pl-9 pr-4 py-1.5
                    rounded-xl outline-none focus:border-indigo-500 transition-all placeholder-slate-500'
                    />
                </div>

                <div className="flex items-center gap-3">
                    <span className="bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 text-[9px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Shield className="w-3 h-3" /> Admin 
                    </span>

                    <button className="relative p-2 rounded-xl bg-[#141A29] border border-slate-800 text-slate-400 hover:text-white transition-colors">
                        <Bell className="w-4 h-4" />
                        {/* <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> */}
                    </button>
                </div>
        </header>
    )
}