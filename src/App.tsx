import './App.css'
import { Routes,Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import CandidateDash from './pages/Candidate/CandidateDashBoard'
import CompanyDash from './pages/Company/CompanyDashBoard'
import AdminDash from './pages/Admin/AdminDashBoard' 
import { ProtectedRoute } from './features/auth/component/ProtectedRoute'
import { PublicRoute } from './features/auth/component/PublicRoute'

function App() { 

  return (
   <>
    <Routes>
      {/* public routes */}
      <Route path='/' element={<h1>Home Page</h1>}/>

      <Route element={<PublicRoute/>}>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
      </Route>

      {/* Candidate routes */}
      <Route element={<ProtectedRoute allowedRole='CANDIDATE'/>}>
        <Route path='/candidate/home' element={<CandidateDash/>}/>
      </Route>  

      {/* Company routes */}
      <Route element={<ProtectedRoute allowedRole='COMPANY'/>}>
        <Route path='/company/home' element={<CompanyDash/>}/>
      </Route>  
      
      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRole='ADMIN'/>}>
        <Route path='/admin/home' element={<AdminDash/>}/>
      </Route>  
      

    </Routes>
   </>
  )
}

export default App
