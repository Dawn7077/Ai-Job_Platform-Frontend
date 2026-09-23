import { useEffect, useState} from "react"; 
import { authApi } from "../services/authApi";
import { AuthContext } from "./AuthContext";
interface User{
    id:string
    name?:string
    email:string
    role:'CANDIDATE'|'COMPANY'|'ADMIN'
    status:string
    isOnboarding?:boolean
}


export const AuthProvider:React.FC<{children:React.ReactNode}> = ({children})=>{
    const [user,setUser] = useState<User|null>(null)
    const [loading,setloading] = useState<boolean>(true)
    
    useEffect(()=>{
        const checkAuthStatus = async ()=>{
            try {
                const data = await authApi.getMe()
                if(data.success){
                    setUser({
                        ...data.user,
                        isOnboarding:data.isOnboarding ?? data.user?.isOnboarding
                    })
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
            const updatedUser = {
                ...data.user,
                isOnboarding:data.isOnboarding
            }
            setUser(updatedUser)
            console.log('isOnboarding:',updatedUser)
            return {user:data.user,isOnboarding:data.isOnboarding}
        }
        throw new Error(data.message ||data.error||'login error')
    }
    const googleLogin = async(googleData:{token:string;role:'CANDIDATE' | 'COMPANY' | 'ADMIN'})=>{
        const data = await authApi.googleLogin(googleData)
        if(data.success){
            const updatedUser = {
                ...data.user,
                isOnboarding:data.isOnboarding
            }
            setUser(updatedUser)
            return updatedUser
        }
        throw new Error(data.message ||data.error||'Google login error')
    }

    const signupOTP = async (userData:{email:string;password:string;role:string;})=>{
        const data = await authApi.signupOTP(userData)
        if(data.success){
            // setUser(data.user)
            return data 
        }
        
        throw new Error(data.message ||data.error||'singup error')
    }
    const verifySignUp = async (data:{email:string,otp:string})=>{
        const res = await authApi.verifySignUp(data)
        if(res.success){
            if(!res.requiresApproval && res.user)setUser(res.user)
            return res
        }
        throw new Error(res.message ||res.error||'Verification Error')
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

    const forgotPassOtpSent = async(email:string)=>{
        const res = await authApi.forgotPassword(email)
        if(res.success){
            return res
        }
        throw new Error(res.message || res.error || 'Error in resetting the Forgot Password OTP')
    }

    const resetPassword = async(data:{email:string,otp:string,newPassword:string})=>{
        const res = await authApi.resetPassword(data)
        if(res.success){
            return res
        }
        throw new Error(res.message || res.error || 'Error in resetting the New Password')
    }


    return(
    <AuthContext.Provider value ={{user,loading,login,signupOTP,verifySignUp,logout,googleLogin,forgotPassOtpSent,resetPassword}} >
        {children}
    </AuthContext.Provider>)
}



