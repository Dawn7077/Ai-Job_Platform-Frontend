import { useNavigate,Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { Bot,Sparkles } from "lucide-react"
import { useState } from "react"
import { ChatInput } from "../../components/ui/chatInput"
import { useCandidate } from "../../hooks/useCandidateHooks"
import ReactMarkdown from 'react-markdown'

interface Message{
    id:string
    sender:'user'|'ai'
    text:string
    time:string
}

export default function AiMentorChat(){
    const [messages,setMessages] = useState<Message[]>([{
        id:'1',
        sender:'ai',
        text:'Hei! I am your Ai Mentor. How can I assist with your career prep, resume, or upcoming interview today?',
        time:'Just now'
    }])
    const navigate = useNavigate()
    const {user,logout} = useAuth() 
    const {askMentor,loading,error} = useCandidate()
    // const [loading,setLoading] =useState(false)

    const handlelogout =async()=>{
        await logout()
        navigate('/login')
    }

    const handleSendMsg = async(text:string)=>{
      if(!text.trim())return

      const userMsg:Message ={
          id:Date.now().toString(),
          sender:'user',
          text,
          time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
      }

      setMessages((prev)=>[...prev,userMsg]) 

      const userId = user?.id || "default-user-id"
      const result = await askMentor(userId,text)

      if(result && result.success && result.data?.response){
        const aiResponse:Message ={
          id:(Date.now()+1).toString(),
          sender:'ai',
          text:result.data.response,
          time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
        }
        setMessages((prev)=>[...prev,aiResponse])
      }else{
        const errResponse:Message={
          id:(Date.now()+1).toString(),
          sender:'ai',
          text:error||'Sorry, I encountered an error connecting to the AI Mentor.',
          time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
        }
        setMessages((prev)=>[...prev,errResponse])
      }
        

    }
   
   return(<>
    <div className="p-6 md:p-8 max-w-5xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="mb-4 shrink-0">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                Personal Career Intelligence
            </span>
            <h1 className="text-2xl  text-indigo-600!  mt-0.5 ">Ai Mentor Chat</h1>
            <p className="mt-1 text-xs text-slate-500">
                Guidance grounded in your career goals, learning progress, and interview feedback.
            </p>
        </div>

        {/* chat header status */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-4 shrink-0">
         <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
                <Bot className="w-4 h-4"/>
            </div>
            <div >
                <h2 className="text-xs font-bold text-indigo-400!">Cai Mentor</h2>
                <span className="text-[10px] text-emerald-600 font-medium">Online</span>
            </div>
         </div>
         <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500 "/>
         </span>

        </div>





        {/* Scrollable Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 rounded-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-none]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" ? (
                 <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm"> 
                    <Bot className="w-4 h-4"/>
                  </div>

                  <div className="flex-1 text-left">
                    <div className="p-3.5 bg-white border border-slate-200/80 text-xs text-slate-700 shadow-sm leading-relaxed
                    whitespace-pre-wrap">
                      <ReactMarkdown>
                        {msg.text}
                        </ReactMarkdown>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 block pl-1">
                      {msg.time}
                    </span>
                  </div>
                 </div>
              ) : (
                <div className="flex flex-col items-end max-w-md">
                  <div className="p-3.5 bg-indigo-600 text-white rounded-2xl text-xs leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 pr-1">
                    {msg.time}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Typing / Loading Indicator */}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <span>AI Mentor is thinking...</span>
            </div>
          )}
        </div>






        {/* Chat Input Footer */}
        <div className="pt-3 mt-2 border-t border-slate-200/60 shrink-0">
          <ChatInput onSend={handleSendMsg} disabled={loading} />
          <p className="text-[10px] text-center text-slate-400 mt-2">
            AI responses are generated based on your prompt inputs.
          </p>
        </div>
    </div>

    <div className="flex gap-2 px-6 pb-6 justify-center">
          <Link to='/candidate/home'
             className="px-4 py-2 bg-indigo-200 hover:bg-indigo-300 rounded-lg font-medium transition-colors text-xs"
           >home
        </Link>
        <button onClick={handlelogout}
            className="px-4 py-2 bg-pink-200 hover:bg-pink-400 rounded-lg font-medium transition-colors text-xs"
        >logout</button>
    </div>

    
        
   </>)
}