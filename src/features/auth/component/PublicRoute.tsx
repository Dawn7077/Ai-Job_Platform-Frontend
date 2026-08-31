import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../../hooks/useAuth"


export const PublicRoute =()=>{
    const {user} = useAuth()

    if(user){
        switch (user.role){
            case "CANDIDATE":
                return <Navigate to='/candidate/home' replace/>
            case "COMPANY":
                return <Navigate to='/company/home' replace/>
            case "ADMIN":
                return <Navigate to='/admin/home' replace/>
            default:
                return <Navigate to='/' />
        }
    }

    return <Outlet/>
}