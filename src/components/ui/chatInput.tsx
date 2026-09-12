import React, {useState} from "react";
import { Send } from "lucide-react";

interface ChatInputProps{
    onSend:(message:string)=>void
    disabled?:boolean
}

export const ChatInput:React.FC<ChatInputProps> = ({onSend,disabled})=>{
    const [text,setText] = useState('')
    
    const handleSubmit = (e :React.FormEvent)=>{
        e.preventDefault()
        if(!text.trim() || disabled)return
        onSend(text.trim())
        setText('')
    }

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <input type="text"
                value={text}
                onChange={(e)=>setText(e.target.value)}
                placeholder="Ask your Ai mentor."
                className="w-full py-3.5 pl-4 pr-24 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400
                outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm disabled:opacity-60"
            />
            <button 
            type="submit"
            disabled = {!text.trim() || disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 text-white rounded-xl text-xs font-medium transition-all">
                <span>Send</span>
                <Send className="w-3.5 h-3.5"/>
            </button>

        </form>
    )
}