import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { authApi } from "../../services/authApi";
import { ArrowLeft, KeyRound, Mail} from "lucide-react";

export const ForgotPassword = ()=>{
    const [step,setStep] = useState<1|2>(1)
    const [email,setEmail] = useState('')
    const [otp,setOtp] = useState('')
    const [message,setMessage] = useState('')
    const [newPassword,setNewPassword] = useState('')
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    
    const navigate = useNavigate()

    const handleSendOtp = async(e:React.FormEvent)=>{
        e.preventDefault()
        setError('')
        setLoading(true)

        try{
            const res = await authApi.forgotPassword(email)
            if(res.success){
                setMessage('OTP sent to your email')
                setStep(2)
            }
        }
        catch(error){
            const err = error instanceof Error?error.message:'Error in sending OTP!! try again'
            setError(err)
        }finally{
            setLoading(false)
        }
    }

    const handleResetPassword = async(e:React.FormEvent)=>{
        e.preventDefault()
        setError('')
        setLoading(true)
        try{
            const res = await authApi.resetPassword({email,otp,newPassword})
            if(res.success){
                alert('Password reset successful, Please login with your new password')
                navigate('/login')
            }
        }
        catch(error){
            const err = error instanceof Error?error.message:'Error in resetting password!! try again'
            setError(err)
        }finally{
            setLoading(false)
        }
    }



    return (
        <div className="min-h-screen bg-[#070913] flex items-center justify-center p-4 text-white">
            <div className="w-full max-w-md flex flex-col items-center">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-indigo-600/10 border-indigo-500/20 rounded-2xl flex items-center justify-center mb-auto  text-indigo-400">
                        {step === 1 ? <Mail className="w-6 h-6"/> : <KeyRound className="w-6 h-6"/>}
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {step === 1 ? 'Forgot Password' : 'Enter Security Code'}
                    </h1>
                    <p className="text-sm text-slate-400 mt-2">
                        {step === 1 ?
                         "Enter your account email and we'll send you a 6-digit verification code." :
                         `We have sent a code to ${email}. Please enter it below to reset your password.`}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="w-full mb-4 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-xl text-center">
                        {error}
                    </div>
                )}

                {/* message */}
                {message && (
                    <div className="w-full mb-4 p-3 bg-green-950/40 border border-green-800 text-green-300 text-xs rounded-xl text-center">
                        {message}
                    </div>
                )}

                {/* Step 1 Form - Email */}
                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="flex flex-col gap-5 w-full">
                        <div className="flex flex-col gap-2 text-left">
                            <label className="text-xs text-slate-400">Email</label>
                            <input type="email"
                            required
                            value ={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            placeholder="Enter your email" 
                            className="w-full px-4 py-3 rounded-xl bg-[#111625] border border-slate-800 text-white placeholder-slate-500 text-sm 
                            outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"/>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all shadow-md disabled:opacity-60"
                        >
                            {loading? "Sending OTP...":"Send Verification OTP"}
                        </button>
                    </form>
                ) : (
                    /* Step 2 Form: Reset to new password */
                     <form 
                       onSubmit={handleResetPassword} className="flex flex-col gap-5 w-full"
                     >
                        <div className="flex flex-col gap-2 text-left">
                            <label className="text-slate-300 font-medium text-xs">Verification Code (OTP)</label>
                            <input
                                type="text"
                                maxLength={6}
                                required
                                value ={otp}
                                onChange={(e)=>setOtp(e.target.value)}
                                placeholder="Enter the 6-digit OTP"
                                className="w-full px-4 py-3 rounded-xl bg-[#111625] border border-slate-800 text-white tracking-widest text-center
                                placeholder-slate-500 text-base outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                             />
                                
                        </div>

                        <div className="flex flex-col gap-2 text-left">
                            <label className="text-slate-300 font-medium text-xs">New Password</label>
                            <input
                                type="password"
                                required
                                value = {newPassword}
                                onChange ={(e)=>setNewPassword(e.target.value)}
                                placeholder="Enter your new password"
                                className="w-full px-4 py-3 rounded-xl bg-[#111625] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                        </div>


                        <button
                            type="submit"
                            disabled={loading}  
                            className="w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all shadow-md disabled:opacity-60"
                            >
                                {loading?"Resetting Password...":"Reset Password"}
                        </button>

                        <button
                            type="button"
                            onClick={()=>setStep(1)} 
                            className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1 mt-1"
                            >
                               <ArrowLeft className="w-4 h-4" />Re-enter email address
                        </button>

                     </form>
                )}

                <div className="text-center text-xs text-slate-400 mt-6">
                    <span>Remember your password?</span>
                    <Link to='/login' className="text-indigo-400 font-medium hover:underline ml-1">
                        Sign in
                    </Link>
                </div>

            </div>
        </div>
        
    )


}