import { useNavigate,Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"


export default function ResumeStudio(){
    const navigate = useNavigate()
    const {logout} = useAuth() 

    const handlelogout =async()=>{
        await logout()
        navigate('/login')
    }
   
   return(<>
        <div className="min-h-screen flex items-center justify-center bg-gray-800">
            <div className="max-w-md w-full p-8 bg-blue-300 rounded-xl shadow-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Resume Studio WIP</h1>

            </div>
        </div>
        
        <Link to='/candidate/home'
             className="px-4 py-2 bg-green-600 hover:bg-red-300 rounded-lg font-medium transition-colors"
        >home</Link>
        <button onClick={handlelogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
        >logout</button>
    </>)
}