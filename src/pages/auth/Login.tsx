import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate,Link} from "react-router-dom"
import { User,Building,ShieldCheck ,Eye,EyeOff} from "lucide-react"
import { getErrorMessage } from "../../utils/ErrorMessage"
import { useGoogleLogin,TokenResponse } from "@react-oauth/google"
type userRole = 'CANDIDATE'|'COMPANY'|'ADMIN'

export default function Login(){
  const [role,setRole] = useState<userRole>('CANDIDATE')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [showPassword,setShowPassword] = useState(false)
  const [error,setError] = useState('')
  const [loading,setLoading] = useState(false)

  const {login,googleLogin} = useAuth()
  const navigate = useNavigate()

   const validationForm =()=>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
        if(!emailRegex.test(email.trim())) return 'Please enter valid email addres'

        if(password.length<6)return 'Password lenght must be atleast 6 characters long'
        
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/
        if(!passwordRegex.test(password)) return 'Password must at least contain one letter and an number'

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
      const user = await login({email,password})
      if(role && role !== user.role){
        setError(`This account is registered as ${user.role}, not ${role}.`)
        setLoading(false)
        return
      }
      switch (user.role){
        case 'CANDIDATE':
          navigate('/candidate/home')
          break;
        case 'COMPANY':
          navigate('/company/home')
          break;
        case 'ADMIN':
          navigate('/admin/home')
          break;
      }
   
      } catch (error) {
      
      setError(getErrorMessage(error))
    }finally{
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (tokenResponse:TokenResponse)=>{
    setError('')
    setLoading(true)
    try {
      const user = await googleLogin({token:tokenResponse.access_token,role})

      if(!role && role!==user.role){
        setError(`This account is registered as ${user.role}, not ${role}.`)
        setLoading(false)
        return
      }

      switch (user.role){
        case 'CANDIDATE':
          navigate('/candidate/home')
          break;
        case 'COMPANY':
          navigate('/company/home')
          break;
        case 'ADMIN':
          navigate('/admin/home')
          break;
      }

    } catch (error) {
      setError(getErrorMessage(error))
    }finally{
      setLoading(false)
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess:handleGoogleSuccess,
    onError:()=>setError('Google Sign-In error.Please try again')
  })

  

  return(<>
    <div className="min-h-screen bg-[#070913] flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-110 flex flex-col items-center">
{/* header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-slate-400 mt-2">Choose your Role/workspace and continue.</p>
        </div>
{/* role selector */}
        <div className="flex items-center justify-between bg-[#111625] border border-slate-800/80 p-1.5 rounded-2xl w-full mb-6">
          <button
            type="button"
            onClick={()=>setRole('CANDIDATE')}
            className={`flex items-center justify-center gap-2 flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
              role ==='CANDIDATE'?
              'bg-[#1E2638] text-white shadow-sm border border-slate-700/50'
              :'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className={`w-4 h-4 ${role === 'CANDIDATE'?'text-indigo-400':'text-slate-400'}`}/>
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
{/* error */}
        {error && (<>
          <div className="w-full mb-4 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-xl text-center">
            {error}
          </div>
        </>)}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-2 text-left">
            <label className="text-slate-300 font-medium text-xs">Email</label>
            <input type="text"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-[#111625] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full text-left">
            <div className="flex justify-between items-center">
              <label className="text-slate-300 font-medium text-xs">Password</label>
              <Link to='/forgot-password' className="text-xs text-indigo-400 hover:underline">
                Forgot Password?
              </Link>
            </div>
            
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-[0.99] transition-all shadow-md disabled:opacity-60 mt-1"
          >
            {loading?'Signing In ...':'Continue to workspace'}
          </button>

          

{/* google sign in */}
          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-slate-800/80 w-full" />
            <span className="bg-[#070913] px-3 text-xs text-slate-500 absolute">or</span>
          </div>

          <button
            type="button"
            onClick={()=>handleGoogleLogin()}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-medium text-sm text-slate-200 bg-[#161C2E] border border-slate-800/60 hover:bg-[#1E2638] flex items-center justify-center gap-3 transition-all"
          >
            <span>Continue with Google</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </button>

{/* sign up */}
          <div className="text-center text-xs text-slate-400 mt-2">
            <span>New to CareerAi ?</span>
            <Link to='/signup' className="text-indigo-400 font-medium hover:underline ml-1">
              Create an account
            </Link>
          </div>

        </form>

      
      </div>

    </div>

  </>)
}