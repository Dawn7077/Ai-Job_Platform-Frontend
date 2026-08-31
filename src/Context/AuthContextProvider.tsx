import { useEffect, useState} from "react"; 
import { authApi } from "../services/authApi";
import { AuthContext } from "./AuthContext";
interface User{
    id:string
    name?:string
    email:string
    role:'CANDIDATE'|'COMPANY'|'ADMIN'
    status:string
}


export const AuthProvider:React.FC<{children:React.ReactNode}> = ({children})=>{
    const [user,setUser] = useState<User|null>(null)
    const [loading,setloading] = useState<boolean>(true)
    
    useEffect(()=>{
        const checkAuthStatus = async ()=>{
            try {
                const data = await authApi.getMe()
                if(data.success){
                    setUser(data.user)
                }
            } catch (error) {
                console.log(error)
                setUser(null)
            }finally{
                setloading(false)
            }
        }

        checkAuthStatus()
    },[])
 
    const login = async (credential:{email:string;password:string;})=>{
        const data = await authApi.login(credential)
        if(data.success){
            setUser(data.user)
            console.log(data.accessToken)
            return data.user
        }
        throw new Error(data.error||'login error')
    }

    const signup = async (userData:{email:string;password:string;role:string;})=>{
        const data = await authApi.signup(userData)
        if(data.success){
            setUser(data.user)
            return data.user
        }
        throw new Error(data.error||'singup error')
    }

    const logout =async()=>{
        try {
            await authApi.logout()
        } catch (error) {
            console.error('Error in clearing the backend session on logout.',error)
        }
        finally{
            setUser(null)
        }

        // You can also call a backend logout route here later
    }


    return(
    <AuthContext.Provider value ={{user,loading,login,signup,logout}} >
        {children}
    </AuthContext.Provider>)
}



