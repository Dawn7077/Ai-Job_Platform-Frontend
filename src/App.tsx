import './App.css'
import { Routes,Route } from 'react-router-dom'

import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import { PublicRoute } from './features/auth/component/PublicRoute'
import { ProtectedRoute } from './features/auth/component/ProtectedRoute'
import { ForgotPassword } from './pages/auth/ForgotPassword'

import { CandidateLayout } from './components/layout/Candidate/CandidateLayout'
import CandidateDash from './pages/Candidate/CandidateDashBoard'
import AiMentorChat from './pages/Candidate/AiMentor'
import ResumeStudio from './pages/Candidate/ResumeStudio'

import {CompanyDash} from './pages/Company/CompanyDashBoard'
import AdminDash from './pages/Admin/AdminDashBoard' 
import { AdminLayout } from './components/layout/Admin/AdminLayout'
import AdminDashBoardVerification from './pages/Admin/AdminHome'
import { CompanyLayout } from './components/layout/Company/CompanyLayout'
import { CandidateJobsPage } from './pages/Candidate/JobPages'
import { MyApplicationsPage } from './pages/Candidate/ApplicationsPage'
import { ApplicationDetailsView } from './pages/Candidate/ApplicationDetails'
// import { Testpage } from './pages/test'
import UserManagement from './pages/Admin/UserManagement'
import CandidateOnboarding from './pages/Candidate/CandidateOnboarding'
import CandidateProfile from './pages/Candidate/CandidateProfile'

function App() { 

  return (
   <>
    <Routes>
      {/* public routes */}
      {/* <Route path='/' element={<h1>Home Page</h1>}/> */}
      <Route path='/' element={<UserManagement/>}/>

      <Route element={<PublicRoute/>}>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
      </Route>



      <Route element={<ProtectedRoute allowedRole='CANDIDATE'/>}>
          <Route path='/candidate/onboarding' element={<CandidateOnboarding/>}/>
      </Route>  
      
      {/* Candidate routes */}
      <Route element={<ProtectedRoute allowedRole='CANDIDATE'/>}>
        
        <Route element={<CandidateLayout/>}>
          <Route path='/candidate/home' element={<CandidateDash/>}/>
          <Route path='/candidate/ai-mentor' element={<AiMentorChat/>}/>
          <Route path='/candidate/resume' element={<ResumeStudio/>}/>
          <Route path='/candidate/jobs' element={<CandidateJobsPage/>}/>
          <Route path='/candidate/applications' element={<MyApplicationsPage/>}/>
          <Route path='/candidate/applications/:id' element={<ApplicationDetailsView/>}/>
          <Route path='/candidate/getProfile' element={<CandidateProfile/>}/>
        </Route>
      </Route>  



      {/* Company routes */}
      <Route element={<ProtectedRoute allowedRole='COMPANY'/>}>
        <Route element={<CompanyLayout/>}>
          <Route path='/company/home' element={<CompanyDash/>}/>
          <Route path='/company/dashboard' element={<CompanyDash/>}/>
          <Route path='/company/jobs' element={<CompanyDash/>}/>
        </Route>
      </Route>  

      
      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRole='ADMIN'/>}>
        <Route element={<AdminLayout/>}>
          <Route path='/admin/home' element={<AdminDash/>}/>
          <Route path='/admin/verifications' element={<AdminDashBoardVerification/>}/>
          <Route path='/admin/users' element={<UserManagement/>}/>
        </Route>
      </Route>  
      

    </Routes>
   </>
  )
}

export default App
