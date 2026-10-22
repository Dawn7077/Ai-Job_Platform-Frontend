import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { mockInterviewApi } from "../services/mockInterviewApi";

export interface TranscriptItem {
  role: "interviewer" | "candidate";
  text: string;
  timestamp: string | Date;
}

export interface FeedbackItem {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  strengths: string[];
  improvements: string[];
  summary: string;
}

export interface SessionItem {
  id: string;
  candidateId: string;
  jobId?: string | null;
  type?: 'BEHAVIOUR' | 'TECHNICAL' | 'SYSTEM_DESIGN';
  targetRole: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  transcript: TranscriptItem[];
  feedback?: FeedbackItem | null;
  createdAt: Date;
  updatedAt?: Date;
}

// interface BrowserSpeechWindow extends Window {
//   SpeechRecognition?: new () => any;
//   webkitSpeechRecognition?: new () => any;
// }

export const useMockInterview = (candidateId: string) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackItem | null>(null);
  const [targetRole,setTargetRole] = useState<string>('')
  const [interviewType,setInterviewType] = useState<'BEHAVIOUR' | 'TECHNICAL' | 'SYSTEM_DESIGN'>('BEHAVIOUR')
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false); 

  const socketRef = useRef<Socket | null>(null); 

  const sendCandidateTurn = (text:string)=>{
    console.log('sendCandidateTurnhit',text)
    if(!sessionId)return

    setTranscript((prev)=>[
      ...prev,
      {role:"candidate",text,timestamp:new Date() }
    ])

    socketRef.current?.emit('candidate_turn',{
      sessionId,
      candidateId,
      responseText:text,
    })
  }

  const speakText =(text:string)=>{
    console.log('speakhit',text)
    if("speechSynthesis" in window){
      window.speechSynthesis.cancel()
      const speakOut = new SpeechSynthesisUtterance(text)
      speakOut.rate = 1.0
      window.speechSynthesis.speak(speakOut)
    }
  }
 
  useEffect(() => {
    const socket = mockInterviewApi.connectSocket();
    socketRef.current = socket;

    socket.on("ai_thinking", (data: { status: boolean }) => {
      setIsThinking(data.status);
    });
    socket.on("interviewer_turn", (data: { interviewerReply:string,session:SessionItem }) => {
      setTranscript(data.session.transcript);
      speakText(data.interviewerReply)
    });

    socket.on("evaluating",(data: { status: boolean })=>{
      setIsEvaluating(data.status)
    })
    socket.on("session_completed",(data: { feedback:FeedbackItem, session:SessionItem})=>{
      setFeedback(data.feedback)
      setIsEvaluating(false)
    })

    return ()=>{
      socket.disconnect()
    }

  }, []); // Added empty array so it only connects once

  const startInterview = async(role:string,type:'BEHAVIOUR' | 'TECHNICAL' | 'SYSTEM_DESIGN')=>{
    try {
      const response = await mockInterviewApi.startSession({targetRole:role,type})
      const {session,message} = response
      setSessionId(session.id)
      setTranscript(session.transcript)
      setTargetRole(session.targetRole||role)
      setInterviewType(session.type || type)

      socketRef.current?.emit('join_room',{sessionId:session.id})

      speakText(message)
    } catch (error) {
      console.log(error)
    }
  }   

  const endInterview = ()=>{
    if(!sessionId)return
    socketRef.current?.emit("complete_session",{sessionId,candidateId})
  }

  const resetSession = ()=>{
    setSessionId(null)
    setFeedback(null)
    setTranscript([])
    setTargetRole('')
    setInterviewType('BEHAVIOUR')
  }

  return{
    sessionId,transcript,isThinking,targetRole,
    interviewType,isEvaluating,feedback,
    startInterview,sendCandidateTurn,
    speakText,endInterview,resetSession
  }

};