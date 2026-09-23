import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CandidateProfilePayload } from "../../types/candidate" 
import { useCandidate } from "../../hooks/useCandidateHooks"
import { ArrowRight, CheckCircle2, Plus, X } from "lucide-react"



export default function CandidateOnboarding(){
    const navigate = useNavigate()
    const [step,setStep] = useState(1) 
    const [errorLocal,setLocalError] = useState('')
    const {loading,error:apiError,saveProfile} = useCandidate()

    const [formData,setFormData] = useState<CandidateProfilePayload>({
        firstName:'',
        lastName:'',
        phone:'',
        headline:'',
        bio:'',
        skills:[],
        experience:[],
        education:[],
    })

    const [skillsInput,setSkillsInput] = useState('')

    const handleAddSkill = (e:React.KeyboardEvent|React.MouseEvent)=>{
        if('key' in e && e.key !=='Enter')return
        e.preventDefault()

        const input = skillsInput.trim()
        if(input && !formData.skills.includes(input)){
            setFormData(prev=>({...prev,skills:[...prev.skills,input]}))
            setSkillsInput('')
        }
    }

    const handleRemoveSkills = (skillstoRemove:string)=>{
        setFormData(prev=>({
            ...prev,
            skills:prev.skills.filter(s=> s!==skillstoRemove)
        }))
    }

    const handleNextStep =()=>{
        setLocalError('')
        if(step===1){
            if(!formData.firstName.trim() || !formData.lastName.trim() ){
                setLocalError('FirstName and LastName are required.')
                return
            }
        }
        setStep(prev=> prev +1)
    }


    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault()
        setLocalError('')

        if(formData.skills.length ===0){
            setLocalError('Please add at least one skill to continue.')
            return
        }
 
        try {
            await saveProfile(formData)
            navigate('/candidate/home')

        } catch {
            // setLocalError(getErrorMessage(errorLocal))
        } 

    }
    const activeError = errorLocal || apiError

    return(
    <div className="min-h-screen bg-[#070913] flex items-center justify-center p-4 text-white">
        <div className="w-full max-w-xl bg-[#111625] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
           
            {/* Stepper Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-400' : 'text-slate-500'}`}>
                        <div className="w-8 h-8 rounded-full border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center font-medium text-xs">1</div>
                        <span className="text-xs font-medium hidden sm:inline">Basic Info</span>
                    </div>
                    <div className="h-px flex-1 bg-slate-800 mx-3" />
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-400' : 'text-slate-500'}`}>
                        <div className="w-8 h-8 rounded-full border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center font-medium text-xs">2</div>
                        <span className="text-xs font-medium hidden sm:inline">Skills & Bio</span>
                    </div>
                </div>
            </div>

            {/* Error */}
            { activeError && (
                <div className="mb-6 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-xl text-center">
                    {activeError}
                </div>
            ) }

            {/* Step 1: Basic Information */}
                {step === 1 && (
                    <div className="space-y-5">
                        <div>
                            <h2 className="text-xl font-bold">Complete your Profile</h2>
                            <p className="text-xs text-slate-400 mt-1">Let employers know who you are.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-300 mb-1.5 font-medium">First Name *</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    placeholder="John"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-300 mb-1.5 font-medium">Last Name *</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    placeholder="Doe"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-slate-300 mb-1.5 font-medium">Phone Number</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1 (555) 000-0000"
                                className="w-full px-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-slate-300 mb-1.5 font-medium">Professional Headline</label>
                            <input
                                type="text"
                                value={formData.headline}
                                onChange={e => setFormData({ ...formData, headline: e.target.value })}
                                placeholder="Full-Stack Developer | React & Node.js"
                                className="w-full px-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="w-full py-3 px-4 mt-2 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center gap-2 transition-all"
                        >
                            <span>Next: Skills & Bio</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}


                {/* Step 2: Skills & Bio */}
                {step === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <h2 className="text-xl font-bold">Skills & Bio</h2>
                            <p className="text-xs text-slate-400 mt-1">Add your tech stack so jobs can match with you.</p>
                        </div>

                        {/* Skills Input */}
                        <div>
                            <label className="block text-xs text-slate-300 mb-1.5 font-medium">Skills *</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={skillsInput}
                                    onChange={e => setSkillsInput(e.target.value)}
                                    onKeyDown={handleAddSkill}
                                    placeholder="e.g. React, TypeScript, Node.js"
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSkill}
                                    className="px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-medium flex items-center gap-1 transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add</span>
                                </button>
                            </div>

                            {/* Skills Badges */}
                            <div className="flex flex-wrap gap-2 min-h-11 p-2 bg-[#161C2E]/50 border border-slate-800 rounded-xl">
                                {formData.skills.length === 0 && (
                                    <span className="text-xs text-slate-500 self-center px-1">No skills added yet.</span>
                                )}
                                {formData.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkills(skill)}
                                            className="hover:text-red-400 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Bio Input */}
                        <div>
                            <label className="block text-xs text-slate-300 mb-1.5 font-medium">Short Bio</label>
                            <textarea
                                rows={3}
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell employers about your background and passion..."
                                className="w-full px-4 py-2.5 rounded-xl bg-[#161C2E] border border-slate-800 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500 resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="py-3 px-4 rounded-xl font-medium text-sm text-slate-400 bg-slate-800/40 hover:bg-slate-800 transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 px-4 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{loading ? 'Saving Profile...' : 'Complete Setup'}</span>
                            </button>
                        </div>
                    </form>
                )}


        </div>
    </div>
    )
}