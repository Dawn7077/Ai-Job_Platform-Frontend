import { useEffect, useRef, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useMockInterview } from "../../hooks/useMockInterview"
import { AlertCircle, Award, CheckCircle, Loader2, Mic, MicOff, RefreshCw, Send } from "lucide-react"


interface BrowserSpeechWindow extends Window {
  SpeechRecognition?: new () => any;
  webkitSpeechRecognition?: new () => any;
}

export const MockInterviewRoom = ()=>{
    const {user}= useAuth()
    const candidateId = user?.id


    const {
        sessionId,transcript,isEvaluating,isThinking,
        targetRole:activeRole,interviewType:activeType,
        feedback,startInterview,endInterview,
        sendCandidateTurn,resetSession
    } = useMockInterview(candidateId || '')

    const [targetRole,setTargetRole] = useState<string>('')
    const [interviewType,setInterviewType] = useState< 'BEHAVIOUR' | 'TECHNICAL' | 'SYSTEM_DESIGN'>('BEHAVIOUR')
    const [textInput,setTextInput] = useState("")
    const [isRecording, setIsRecording] = useState(false)
    
    const transcriptEndRef = useRef<HTMLDivElement>(null)
    const recognitionRef = useRef<any>(null)

    // Scroll to bottom on new messages
    useEffect(()=>{
        transcriptEndRef.current?.scrollIntoView({behavior:"smooth"})
    },[transcript,isThinking])

    // Initialize Speech Recognition for populating text input
    useEffect(()=>{
        const win = window as unknown as BrowserSpeechWindow
        const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition

        if(SpeechRecognitionClass) {
            const recognition = new SpeechRecognitionClass()
            recognition.continuous = true
            recognition.interimResults = true
            recognition.lang = 'en-US'

            recognition.onstart = ()=> setIsRecording(true)

            recognition.onresult = (ev: any)=>{
                let finalres = ''
                let interimres =''

                for(let i=ev.resultIndex; i<ev.results.length; i++){
                    const result = ev.results[i]
                    const text = result[0].transcript;

                    if(result.isFinal){
                        finalres += text + ' '
                    }else{
                        interimres += text
                    }
                }
                setTextInput(finalres)
                // res.innerHTML = `<strong>${finalres}</strong> <span style="color: #888;">${interimres}</span>`
            }

            recognition.onerror = (ev: any)=>{
                console.log(ev.error)
                setIsRecording(false)
            }

            recognition.onsend = ()=> setIsRecording(false)
            
            recognitionRef.current = recognition

        }
    },[])

    const toggleRecording = ()=>{
        console.log('toggleRecording hit')
        if(!recognitionRef.current) {
            alert('Native speech recognition is not supported in this browser.')
            return
        }
        if(isRecording){
            recognitionRef.current.stop()
            setIsRecording(false)
        }else{
            setTextInput('')
            recognitionRef.current.start()
            setIsRecording(true)
        }
    }



    const handleManualSubmit = (e:React.FormEvent)=>{
        e.preventDefault()
        if(!textInput.trim())return

        if(isRecording && recognitionRef.current){
            recognitionRef.current?.stop()
            setIsRecording(false)
        }
        sendCandidateTurn(textInput)
        setTextInput("")
    }

    
    if(!candidateId)return <h1>userId not provided</h1>

    if(!sessionId){
        return(
            <div className="max-w-lg mx-auto my-12 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Start Mock Practice Interview</h2>
                <div>
                    <label  className="block text-xs font-semibold text-slate-600 mb-1">Target Role</label>
                    <input type="text"
                    value={targetRole}
                    onChange={(e)=>setTargetRole(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Interview Type</label>
                    <select
                     value={interviewType}
                     onChange={(e:any)=>setInterviewType(e.target.value)}
                     className="w-full px-3 py-2 border rounded-xl text-xs"
                    >
                        <option value="BEHAVIOUR">BEHAVIOUR</option>
                        <option value="TECHNICAL">TECHNICAL</option>
                        <option value="SYSTEM_DESIGN">SYSTEM DESIGN</option>
                    </select>
                </div>
                <button
                onClick={()=>startInterview(targetRole,interviewType)}
                className="w-full py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                    Begin session
                </button>
            </div>
        )
    }

    if(feedback){
        return(
            <div className="max-w-2xl mx-auto my-8 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold">
                        <Award className="w-6 h-6" />
                        <h2 className="text-lg">Interview Performance Report</h2>
                    </div>

                    <button
                    onClick={resetSession}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-slate-600 rounded-2xl shadow-sm space-y-6"
                    >
                    <RefreshCw className="w-3.5 h-3.5"/>Start New Interview
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-slate-50 border rounded-xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Overall</p>
                        <p className="text-xl font-bold text-indigo-600">{feedback.overallScore}/100</p>
                    </div>

                    <div className="p-3 bg-slate-50 border rounded-xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Communication</p>
                        <p className="text-xl font-bold text-emerald-600">{feedback.communicationScore}/100</p>
                    </div>

                    <div className="p-3 bg-slate-50 border rounded-xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Technical</p>
                        <p className="text-xl font-bold text-blue-600">{feedback.technicalScore}/100</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase mb-2 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Key Strengths
                    </h3>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                        {feedback.strengths?.map((s:string,idx:number)=>(
                            <li key={idx}>{s}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase mb-2 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-500" /> Area for improvement
                    </h3>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                        {feedback.improvements?.map((imp:string,idx:number)=>(
                            <li key={idx}>{imp}</li>
                        ))}
                    </ul>
                </div>

                <div className="p-3 bg-slate-50 border rounded-xl text-xs text-slate-700">
                    <p className="font-bold mb-1">Summary</p>
                    <p>{feedback.summary}</p>
                </div>
            </div>
        )
    }

    return(
        <div className="max-w-2xl mx-auto my-6 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
                <div>
                    <h2 className="text-sm font-bold text-slate-800">{activeRole}</h2>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">{activeType} Interview</span>
                </div>
                <button
                onClick={endInterview}
                disabled={isEvaluating}
                className="px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold rounded-lg hover:bg-rose-100 flex items-center gap-1"
                >
                    {isEvaluating?
                    <Loader2 className="w-3.5 h-3.5 animate-spin inline"/>:
                    "finish & Evaluate"}
                </button>
            </div>

            {/* Transcript Chat Area */}
            <div className="h-80 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-xl border">
                    {transcript.map((msg,idx)=>(
                        <div 
                        key={idx}
                        className={`flex ${msg.role ==='candidate'?'justify-end':'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-xs 
                                ${msg.role ==='candidate'?
                                    'bg-indigo-600 text-white rounded-br-none'
                                    :'bg-white border text-slate-800 shadow-sm rounded-bl-none'
                                }`}>
                                    <p>{msg.text}</p>
                                </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start">
                            <div className="p-3 bg-white border rounded-2xl text-xs text-slate-400 flex items-center gap-2">
                                <Loader2 className="w-3.5 h-3.5 animate-spin"/>Interviewer is thinking ...
                            </div>
                        </div>
                    )}
                <div ref={transcriptEndRef}/>
            </div>
            
            {/* Voice Controls & Input Bar */}
            <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
                <button 
                    type="button"
                    onClick={toggleRecording}
                    className={`p-2.5 rounded-xl text-white transition-colors ${
                        isRecording?'bg-rose-600 animate-pulse':"bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                    {isRecording?<MicOff className="w-3.5 h-3.5"/>:<Mic className="w-4 h-4"/>}
                </button>
                <input type="text"
                value={textInput}
                onChange={(e)=>setTextInput(e.target.value)}
                placeholder={isRecording?"Listening to your voice...":'Type or speak your answer...'}
                className="flex-1 py-2 px-3 text-xs border rounded-xl" />

                <button
                type="submit"
                className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                >
                    <Send className="w-4 h-4"/>
                </button>
                
            </form>
        </div>
    )
}