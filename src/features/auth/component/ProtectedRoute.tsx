import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../../hooks/useAuth" 


interface ProtectedRouteProp{
    allowedRole?:'CANDIDATE'|'COMPANY'|"ADMIN"
}

export const ProtectedRoute = ({allowedRole}:ProtectedRouteProp)=>{
    const {user ,loading} = useAuth()

    if(loading){
        return(<>
            <div className="min-h-screen flex items-center justify-center bg-[#070913] text-white">
                <p className="text-sm text-slate-400 animate-pulse">Verifying session ...</p>
            </div>
        </>)
    }


    if(!user){
        return <Navigate to='/login' replace/>
    }

    if(allowedRole && user.role !== allowedRole){
        switch (user.role){
            case 'CANDIDATE':
                return <Navigate to='/candidate/home'/>
            case 'COMPANY':
                return <Navigate to='/company/home'/>
            case 'ADMIN':
                return <Navigate to='/admin/home'/>
            default:
                return <Navigate to='/'/>
        }
    }

    return <Outlet/>
}