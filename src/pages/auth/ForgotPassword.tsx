import { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom"; 
import { ArrowLeft, KeyRound, Mail,RotateCcw,EyeOff,Eye} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const ForgotPassword = ()=>{
    const [step,setStep] = useState<1|2>(1)
    const [email,setEmail] = useState('')
    const [otp,setOtp] = useState('')
    const [message,setMessage] = useState('')
    const [newPassword,setNewPassword] = useState('')
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const [showPassword,setShowPassword] = useState(false)

    const [resendLoading,setResendLoading] = useState(false) 
    const [timer,setTimer] = useState(60)

    const[msgTimer,setMsgTimer] = useState(10)

    const canResend = timer === 0
    
    const navigate = useNavigate()
    const {forgotPassOtpSent,resetPassword} = useAuth()

    useEffect(()=>{
        if(step !== 2 || timer<=0)return

        const interval = setInterval(()=>{
            setTimer((prev)=>prev-1)
        },1000)

        return ()=>clearInterval(interval)
    },[step,timer])

    useEffect(()=>{
        if(!message || msgTimer<=10)return

        const interval = setInterval(()=>{
            
            setTimer((prev)=>{
                    if(prev<=1){
                        setMessage('')
                        return 0 
                    }
                   return  prev-1
            })
        },1000)

        return ()=>clearInterval(interval)
    },[message,msgTimer])

    const handleSendOtp = async(e:React.FormEvent)=>{
        e.preventDefault()
        setError('')
        setLoading(true)

        try{
            const res = await forgotPassOtpSent(email)
            if(res.success){
                setMessage('OTP sent to your email')
                setMsgTimer(10)
                setTimer(60)
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
            const res = await resetPassword({email,otp,newPassword})
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

    const handleResendOTP =  async(e:React.FormEvent)=>{
        e.preventDefault()
        if(!canResend || resendLoading)return 

        setError('')
        setResendLoading(true)
        try {
            const res = await forgotPassOtpSent(email)
            if(res.success){
                setMessage('New OTP has been sent to your email')
                setTimer(60)
            }
        } catch (error) {
            setError(error instanceof Error?error.message:'Error with resending OTP')
        }finally{
            setResendLoading(false)
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
                {(message && msgTimer>0)
                
                && (
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

                    {/* timer */}
                    <div className="flex items-center justify-between text-xs px-1">
                        <span className="text-slate-400">
                            {canResend?"Didn't receive code?":`Resend available in ${timer}`}
                        </span>

                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={!canResend || resendLoading}
                            className={`flex items-center gap-1 font-medium transition-colors ${
                                canResend && !resendLoading?
                                'text-indigo-400 hover:text-indigo-300 cursor-pointer'
                                :'text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            <RotateCcw className={`w-3 h-3 ${resendLoading?'animate-spin':''}`}/>
                            {resendLoading ?'Resending...':'Resend OTP'}
                        </button>

                    </div>
                    {/* password */}

                        <div className="flex flex-col gap-2 text-left ">
                            <label className="text-slate-300 font-medium text-xs">New Password</label>
                            
                            <div className="relative w-full">
                                <input
                                    type={showPassword?'text':'password'}
                                    required
                                    value = {newPassword}
                                    onChange ={(e)=>setNewPassword(e.target.value)}
                                    placeholder="Enter your new password"
                                    className="w-full px-4 py-3 rounded-xl bg-[#111625] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                             </div>
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
                            onClick={()=>{
                                setStep(1)
                                setMessage('')
                            }} 
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