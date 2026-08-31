import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"


export default function CandidateDash(){
    const navigate = useNavigate()
    const {logout} = useAuth() 

    const handlelogout =async()=>{
        await logout()
        navigate('/login')
    }
   
   return(<>
        <div className="min-h-screen flex items-center justify-center bg-gray-800">
            <div className="max-w-md w-full p-8 bg-blue-300 rounded-xl shadow-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Candidate Dashboard</h1>

            </div>
        </div>

        <button onClick={handlelogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
        >logout</button>
    </>)
}