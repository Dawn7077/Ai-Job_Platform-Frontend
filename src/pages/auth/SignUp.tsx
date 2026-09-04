import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate,Link } from "react-router-dom"
import { User,Building,ShieldCheck,Eye,EyeOff ,KeyRound, RotateCcw } from "lucide-react"

type UserRole = 'CANDIDATE'|"COMPANY" | 'ADMIN'

export default function SignUp(){
    const [role, setRole] = useState<UserRole>('CANDIDATE')
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const [showPassword,setShowPassword] = useState(false)
    const [showCPassword,setShowCPassword] = useState(false)

    const [error,setError] = useState('')
    const [loading ,setLoading]=useState(false)
    const [otp,setOtp] = useState('')
    const [isOtpSent,setIsOtpSent] =useState(false)
    const [timer,setTimer] = useState(60)
    const [resendLoading,setResendLoading] = useState(false)

    const{signupOTP,verifySignUp} = useAuth()
    const navigate = useNavigate()

    const canResend = timer ===0

    useEffect(()=>{
        if(!isOtpSent || timer<=0)return 

        const interval = setInterval(()=>{
            setTimer((prev)=> prev-1)
        },1000)
        return ()=>clearInterval(interval)

    },[isOtpSent,timer])


    const validationForm =()=>{
        if(name.trim().length <2)return 'Full name must be atleast 2 characters long'
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
        if(!emailRegex.test(email.trim())) return 'Please enter valid email addres'

        if(password.length<6)return 'Password lenght must be atleast 6 characters long'
        
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/
        if(!passwordRegex.test(password)) return 'Password must at least contain one letter and an number'

        if(password!==confirmPassword)return 'Password do not match'

        return null
    }


    const handleSendOTP = async(e:React.FormEvent)=>{
        e.preventDefault()
        setError('')
        const validationError = validationForm()
        if(validationError){
            setError(validationError)
            setLoading(false)
            return
        }
        setLoading(true)

        try {
            await signupOTP({
                name,
                email,
                password,
                role
            })
            setIsOtpSent(true)
        
        } catch (error) {
            setError(error instanceof Error? error.message : 'Error Sending OTP')
        }finally{
            setLoading(false)
        }
    }

    const handleVerify = async(e:React.FormEvent)=>{
        e.preventDefault()
        setError('') 
        if(otp.trim().length<4 ){
            setError('Please Enter a valid OTP code')
            return
        }
        setLoading(true)
        
        try {
             

            const user =  await verifySignUp({email,otp})



            switch(user.role){
                case 'CANDIDATE':
                    navigate('/candidate/home');
                    break;
                case 'COMPANY':
                    navigate('/company/home')
                    break;
                case 'ADMIN':
                    navigate('/admin/home')
                    break;
                default:
                    navigate('/')
            }
        } catch (error) {
            const err = error instanceof Error?error.message:'Error in creating a account try again'
            setError(err)
        }
        finally{
            setLoading(false)
        }
    }

    const handleResendOTP =  async(e:React.FormEvent)=>{
        e.preventDefault()
        if(!canResend || resendLoading )return
        setError('')
        setResendLoading(true)
        try {
            await signupOTP({name,email,password,role})
            setTimer(60)
        } catch (error) {
            setError(error instanceof Error? error.message:'Error with resending OTP')
        }finally{
            setResendLoading(false)
        }
    }


    
    return(<>
        <div className="min-h-screen bg-[#070913] flex items-center justify-center p-4 text-white">
            <div className="w-full max-w-110 flex flex-col items-center">

                {/* header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isOtpSent?'Verify Email':'Create an account'}
                    </h1>
                    <p className="mt-2 text-sm text-slate-400 ">
                        {isOtpSent?`Enter the OTP sent to ${email}`:'Select your role to get started.'}
                    </p>
                </div>

                {/* role btn */}
                {!isOtpSent && (
                <div className="flex items-center justify-between bg-[#111625] border border-slate-800/80 p-1.5 rounded-2xl w-full mb-6">
                    <button
                    type="button"
                    onClick={()=>setRole('CANDIDATE')}
                    className={`flex items-center justify-center gap-2 flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
                        role === 'CANDIDATE'?
                        'bg-[#1E2638] text-white shadow-sm border border-slate-700/50'
                        :'text-slate-400 hover:text-slate-200'
                    }`}
                    >
                        <User className={`w-4 h-4 ${role === 'CANDIDATE' ? 'text-indigo-400' : 'text-slate-400'}`}/>
                        <span>Candidate</span>
                    </button>


                    <button
                    type="button"
                    onClick={()=>setRole('COMPANY')}
                    className={`flex items-center justify-center gap-2 flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
                        role === 'COMPANY'?
                        'bg-[#1E2638] text-white shadow-sm border border-slate-700/50'
                        :'text-slate-400 hover:text-slate-200'
                    }`}
                    >
                        <Building className={`w-4 h-4 ${role === 'COMPANY' ? 'text-blue-400' : 'text-slate-400'}`}/>
                        <span>Company</span>
                    </button>

                    <button
                    type="button"
                    onClick={()=>setRole('ADMIN')}
                    className={`flex items-center justify-center gap-2 flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
                        role === 'ADMIN'?
                        'bg-[#1E2638] text-white shadow-sm border border-slate-700/50'
                        :'text-slate-400 hover:text-slate-200'
                    }`}
                    >
                        <ShieldCheck className={`w-4 h-4 ${role === 'ADMIN' ? 'text-green-400' : 'text-slate-400'}`}/>
                        <span>ADMIN</span>
                    </button>

                </div>)}

                {error && (<>
                    <div className="w-full mb-4 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-xl text-center">
                    {error}
                    </div>
                </>)}

                {/* Form 1 before OTP */}
                {!isOtpSent?(
                    <form onSubmit={handleSendOTP} className="flex flex-col gap-4 w-full">
                        <div className="flex flex-col gap-1.5 w-full text-left">
                            <label className="text-slate-300 font-medium text-xs">Full Name </label>
                            <input type="text"
                                required
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                                placeholder="Name"
                                className="w-full px-4 py-3 rounded-xl bg-[#111625] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 w-full text-left">
                            <label className="text-slate-300 font-medium text-xs">Email </label>
                            <input type="text"
                                required
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                placeholder="Name"
                                className="w-full px-4 py-3 rounded-xl bg-[#111625] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 w-full text-left">
                            <label className="text-slate-300 font-medium text-xs">Password</label>
                            <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 pr-11 rounded-xl bg-[#111625] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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


                        <div className="flex flex-col gap-1.5 w-full text-left">
                            <label className="text-slate-300 font-medium text-xs">Confirm Password</label>
                            <div className="relative w-full">
                            <input
                                type={showCPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 pr-11 rounded-xl bg-[#111625] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                                aria-label={showCPassword ? "Hide password" : "Show password"}
                            >
                                {showCPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            </div>
                        </div>

                        <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-[0.99] transition-all shadow-md disabled:opacity-60 mt-2"
                        >
                            {loading?'Creating account...':`Registered as ${role}`}
                        </button>

                        <div className="text-center text-xs text-slate-400 mt-2">
                            <span>Already have an account</span>
                            <Link to="/login" className="text-indigo-400 font-medium hover:underline ml-1">
                                Sign in
                            </Link>
                        </div>

                    </form>
                )
                :(
                    /* Form Step 2: OTP Verification and timer*/
                    <form onSubmit={handleVerify} className=" flex-col flex gap-4 w-full">
                        <div className="flex flex-col gap-1.5 w-full text-left">
                            <label className="text-slate-300 font-medium text-xs">Enter OTP Code</label>
                            <div className="w-full relative">
                                <input type="text"
                                    max={6}
                                    required
                                    value={otp}
                                    onChange={(e)=>{setOtp(e.target.value)}}
                                    placeholder="Enter OTP code"
                                    className="w-full px-4 py-3 pl-11 rounded-xl bg-[#111625] border border-slate-800 text-white placeholder-slate-500 text-sm 
                                    outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                /><KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                            </div>
                        </div>

                        {/* timer */}
                        <div className="flex items-center justify-between text-xs px-1 ">
                            <span className="text-slate-400">
                                {canResend ?"Didnt receive code?":`Resend available in ${timer} sec`}
                            </span>

                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled ={!canResend || resendLoading}
                                className={`flex items-center gap-1 font-medium transition-colors
                                    ${canResend && !resendLoading
                                        ?'text-indigo-400 hover:text-indigo-300 cursor-pointer'
                                        :'text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                <RotateCcw className={`w-3 h-3 ${loading?'animate-spin':''}`}/>
                                {resendLoading?'Resending...':'Resend OTP'}
                            </button>
                        </div>


                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all disabled:opacity-60 mt-2"
                        >
                            {loading?"verifying....":"Verify OTP & Complete SignUp"}
                        </button>

                        <button 
                            type="button"
                            onClick={()=>setIsOtpSent(false)}
                            className="text-xs text-slate-400 hover:text-white transition-colors underline"
                        >
                            Change details/ Go Back
                        </button>

                    </form>
                )}

                <div className="mt-6 text-xs text-center text-slate-400">
                    <span>Already have an account?</span>
                    <Link to='/login' className="text-indigo-400 font-medium hover:underline ml-1">
                        Sign In
                    </Link>
                </div>

            </div>
        </div>
        
    </>)
    
}