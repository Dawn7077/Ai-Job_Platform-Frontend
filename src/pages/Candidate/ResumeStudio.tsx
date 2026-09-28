import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useState } from "react"
import { useResumeHook } from "../../hooks/useResumeHook"


export default function ResumeStudio(){
    const [selectedFile, setFile] =useState<File|null>(null)
    const {stage,error,loading,reset,result,setResult,uploadAndProcess} = useResumeHook()
    const navigate = useNavigate()
    const {logout} = useAuth() 

    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files && e.target.files[0]){
            const file = e.target.files[0]

            if(!allowedMimeTypes.includes(file.type) ){
                alert('Please upload the file that is of following types: PDF, DOCS/DOXC')        
            }
            if(file.size > 5 * 1024* 1024){//5mb limit
                alert('File sixe exeeds 5MB  limit')  
            }
            setFile(file)
        }
    }

    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault()
        if(!selectedFile)return

        try {
           const data =  await uploadAndProcess(selectedFile) 
           setResult(data)
           console.log(result)
        } catch  {
            // 
        }
    }


 
   
   return(<>
    <div className="w-full max-w-2xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-xl text-white">
      <h2 className="text-xl font-bold mb-4">Resume Analyzer & Profile Importer</h2>
        {stage ==='idle' || stage==='error'?(
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 
                    rounded-lg p-8 text-center cursor-pointer transition-colors
                ">
                    <input type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id='resume-input' />

                    <label htmlFor="resume-input" className="cursor-pointer block">
                        <span className="text-slate-400 block mb-2">
                            {selectedFile ? selectedFile.name :'Click to select your resume PDF'}
                        </span>
                        <span className="text-xs text-slate-500 block">PDF upto 5MB</span>
                    </label>
                </div>
                {error && <div className="border p-3 bg-red-900/30 border-e-red-500 text-red-300 rounded text-sm">{error}</div>}

                <button
                type="submit"
                disabled={!selectedFile}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50  
                text-white font-medium rounded-lg transition-all"
                >
                    Upload & Auto-Populate Profile
                </button>

            </form>
        ):stage!=='success'?(
            <div className="py-12 text-center space-y-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                <p className="text-slate-300 font-medium">
                    {stage ==='getting_url' && 'Preparing secure storage upload...'}
                    {stage ==='uploading_r2' && 'Uploading document to cloudFlare R2...'}
                    {stage ==='parsing_ai' && 'Extracting skills, experience, and scoring ATS score via AI...'}
                </p>
            </div>
        ):(
            <div className="space-y-6">
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm">
                 Resume uploaded successfully! Your candidate profile has been populated with extracted skills and history. 
                </div>

                {result?.atsAnalysis && (
                    <div className="p-5 bg-slate-800/60 rounded-lg border border-slate-700 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg text-white">ATS Readiness Score</h3>
                            <span className="text-2xl font-extrabold text-indigo-400">{result.atsAnalysis.score}/100</span>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Key Strengths</h4>
                            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                                {result.atsAnalysis.strengths.map((str,idx)=>(
                                    <li key={idx}>{str}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Recommended Improvements</h4>
                            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                                {result.atsAnalysis.improvements.map((imp,idx)=>(
                                    <li key={idx}>{imp}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            {result.resumeUrl && (
                                <a href={result.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 text-center py-2 bg-slate-800 hover:bg-indigo-700 text-slate-200 text-sm font-medium rounded-lg transition-all"
                                >View Uploaded Resume</a>
                            )}
                            <button
                            onClick={reset}
                            className="flex-1 text-center py-2 bg-slate-800 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all"
                            >
                                Upload Another Resume
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}

      




       
        
        
    
      </div>
    </>)
}