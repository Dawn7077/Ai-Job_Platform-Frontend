import { createContext } from "react"; 

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
    verifySignUp:(data:{email:string,otp:string})=>Promise<User>
    googleLogin:(data:{token:string;role:'CANDIDATE'|'COMPANY'|'ADMIN'})=>Promise<User>
    logout:()=>Promise<void>

}

export const AuthContext = createContext<AuthContextType|undefined>(undefined)
