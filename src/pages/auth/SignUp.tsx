import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate,Link } from "react-router-dom"
import { User,Building,ShieldCheck,Eye,EyeOff} from "lucide-react"

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

    const{signup} = useAuth()
    const navigate = useNavigate()


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


    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault()
        setError('')
        setLoading(true)

        const validationError = validationForm()
        if(validationError){
            setError(validationError)
            setLoading(false)
            return
        }
        
        try {
             

            const user = await signup({
                name,
                email,
                password,
                role
            })



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


    
    return(<>
        <div className="min-h-screen bg-[#070913] flex items-center justify-center p-4 text-white">
            <div className="w-full max-w-110 flex flex-col items-center">

                {/* header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight"> Create an account</h1>
                    <p className="mt-2 text-sm text-slate-400 ">Select your role to get started.</p>
                </div>

                {/* role btn */}
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

                </div>

                {error && (<>
                    <div className="w-full mb-4 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-xl text-center">
                    {error}
                    </div>
                </>)}

                {/* Form */}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
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
            </div>
        </div>
        
    </>)
    
}