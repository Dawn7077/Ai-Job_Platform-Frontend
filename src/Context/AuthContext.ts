import { createContext } from "react"; 

interface ApiResponse{
    success:boolean,
    message:true
}

interface User{
    id:string
    name?:string
    email:string
    role:'CANDIDATE'|'COMPANY'|'ADMIN'
    status:string
}

interface AuthContextType{
    user:User|null
    loading:boolean
    login:(credential:{email:string;password:string;})=>Promise<User>
    signupOTP:(userData:{name:string;email:string;password:string;role:string;})=>Promise<User>
    
    verifySignUp:(data:{email:string,otp:string})=>Promise<{success:boolean;requiresApproval?:boolean;message?:string;user:User}>
    googleLogin:(data:{token:string;role:'CANDIDATE'|'COMPANY'|'ADMIN'})=>Promise<User>
    forgotPassOtpSent:(email:string)=>Promise<ApiResponse>
    resetPassword:(data:{email:string,otp:string,newPassword:string})=>Promise<ApiResponse>

    logout:()=>Promise<void>

}

export const AuthContext = createContext<AuthContextType|undefined>(undefined)
