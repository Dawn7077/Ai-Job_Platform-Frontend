import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../../hooks/useAuth" 


interface ProtectedRouteProp{
    allowedRole?:'CANDIDATE'|'COMPANY'|"ADMIN"
}

export const ProtectedRoute = ({allowedRole}:ProtectedRouteProp)=>{
    const {user ,loading,logout} = useAuth()

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
 
    if(user.status ==='SUSPENDED'){
        console.log('User is suspended, logging out...\n',user);
        logout()
        return <Navigate to='/login' replace/>
    }

    if(allowedRole && user.role !== allowedRole){
        switch (user.role){
            case 'CANDIDATE':
                return <Navigate to={user.isOnboarding ? '/candidate/home':'/candidate/isonboarding'} replace />
            case 'COMPANY':
                return <Navigate to='/company/home'replace />
            case 'ADMIN':
                return <Navigate to='/admin/home' replace/>
            default:
                return <Navigate to='/'/>
        }
    }

    return <Outlet/>
}