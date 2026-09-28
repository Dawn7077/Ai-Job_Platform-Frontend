import { useCallback, useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"


const ICE_SERVERS ={
    iceServers:[
        {urls:'stun:stun.l.google.com:19302' },
        {urls:'stun:stun1.l.google.com:19302' },
    ]
}

export const useWebRTC = (roomKey:string)=>{
    const [localStream,setLocalStream] = useState<MediaStream|null>(null)
    const [remoteStream,setRemoteStream] = useState<MediaStream|null>(null)
    const [isConnected,setIsConnected] = useState(false)
    const [isMuted,setIsMuted] = useState(false)
    const [isVideoOff,setIsVideoOff] = useState(false)

    const pcRef = useRef<RTCPeerConnection|null>(null)
    const socketRef = useRef<Socket|null>(null)
    const localStreamRef = useRef<MediaStream|null>(null)

    const createPeerConnection = useCallback((socket:Socket,stream:MediaStream)=>{
        if(pcRef.current)return pcRef.current
        
        const pc = new RTCPeerConnection(ICE_SERVERS)

        pc.onicecandidate = (event)=>{
            if(event.candidate){
                socket.emit('ice-candidate',{roomKey,candidate:event.candidate})
            }
        }

        pc.ontrack =(event)=>{
            setRemoteStream(event.streams[0])
            setIsConnected(true)
        }
        stream.getTracks().forEach(track=>pc.addTrack(track,stream))
        pcRef.current = pc
        return pc
    },[roomKey])

    useEffect(()=>{
        if(!roomKey)return

        let mounted = true
        
        async function initCall() {
            try {
                const stream =await navigator.mediaDevices.getUserMedia({video:true,audio:true})
                if(!mounted){
                    stream.getTracks().forEach(t=>t.stop())
                    return
                }

                localStreamRef.current = stream
                setLocalStream(stream)

                const socket = io('http://localhost:3000')
                socketRef.current = socket

                socket.on('connect',()=>{
                    socket.emit('join-room',roomKey)
                })

                socket.on('peer-joined',async()=>{
                    const pc = createPeerConnection(socket,stream)
                    // pcRef.current = pc

                    const offer = await pc.createOffer()
                    await  pc.setLocalDescription(offer)
                    socket.emit('offer',{roomKey,offer})
                })

                socket.on("offer",async(offer)=>{
                    let pc = pcRef.current
                    if(!pc){
                        pc = createPeerConnection(socket,stream)
                        pcRef.current = pc
                    }

                    await pc.setRemoteDescription(new RTCSessionDescription(offer))
                    const answer = await pc.createAnswer()
                    await pc.setLocalDescription(answer)
                    socket.emit('answer',{roomKey,answer})
                })
                socket.on('answer',async(answer)=>{
                    if((pcRef.current)){
                        await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer))
                    }
                })
                socket.on('ice-candidate',async(candidate)=>{
                    if(pcRef.current && candidate){
                        try {
                            pcRef.current.addIceCandidate(new RTCIceCandidate(candidate))
                        } catch (error) {
                            console.log("Error Adding ICE candidate:",error)                        
                        }
                    }
                })

            } catch (error) {
                console.error('WebRTC initializing failed:',error)
                
            }
        }
        initCall()
        return ()=>{
            mounted=false

            if(pcRef.current){
                pcRef.current.close() 
                pcRef.current = null
            }
            if(localStreamRef.current){
                localStreamRef.current.getTracks().forEach((track)=>track.stop())
            }
            if(localStream){
                localStream.getTracks().forEach((track)=>track.stop())
            }
            if(socketRef.current){
                socketRef.current.disconnect()
                socketRef.current = null
            }
            setIsConnected(false)
            setRemoteStream(null)
            setLocalStream(null)
        }
    },[roomKey,createPeerConnection])

    const toggleMute = ()=>{
        if(localStream){
            localStream.getAudioTracks().forEach(track=>(track.enabled = !track.enabled))
            setIsMuted(!isMuted)
        }
    }

    const toggleVideo = ()=>{
        if(localStream){
            localStream.getVideoTracks().forEach(track=>(track.enabled = !track.enabled))
            setIsVideoOff(!isVideoOff)
        }
    }


    return{localStream,remoteStream,isConnected,isMuted,isVideoOff,toggleMute,toggleVideo}

}