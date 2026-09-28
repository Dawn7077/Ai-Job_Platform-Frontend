import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWebRTC } from "../../hooks/useWebRTC";

export const InterviewRoomPage: React.FC = () => {
  const { roomKey } = useParams<{ roomKey: string }>();
  const navigate = useNavigate();

  const {
    localStream,
    remoteStream,
    isConnected,
    isMuted,
    isVideoOff,
    toggleMute,
    toggleVideo,
  } = useWebRTC(roomKey || "");

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Attach local stream to <video> tag
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach remote stream to <video> tag
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleLeaveCall = () => {
    // Stop local media tracks before navigating away
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 bg-gray-800 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-lg font-semibold">Interview Room: {roomKey}</h1>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isConnected ? "bg-green-600" : "bg-yellow-600"
          }`}
        >
          {isConnected ? "Connected" : "Waiting for peer..."}
        </span>
      </div>

      {/* Video Viewports */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 items-center justify-center relative">
        {/* Remote Video (Other Participant) */}
        <div className="relative w-full h-full min-h-[300px] bg-black rounded-lg overflow-hidden flex items-center justify-center border border-gray-800">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!remoteStream && (
            <p className="absolute text-gray-400 text-sm">
              Waiting for candidate/interviewer to join...
            </p>
          )}
        </div>

        {/* Local Video (Self View) */}
        <div className="relative w-full h-full min-h-[300px] bg-black rounded-lg overflow-hidden flex items-center justify-center border border-gray-800">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted // Muted locally to prevent audio feedback loop
            className="w-full h-full object-cover transform -scale-x-100"
          />
          {isVideoOff && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-400">
              Camera Off
            </div>
          )}
        </div>
      </div>

      {/* Media Controls Bar */}
      <div className="p-4 bg-gray-800 flex justify-center items-center space-x-4 border-t border-gray-700">
        <button
          onClick={toggleMute}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            isMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>

        <button
          onClick={toggleVideo}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            isVideoOff ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          {isVideoOff ? "Start Video" : "Stop Video"}
        </button>

        <button
          onClick={handleLeaveCall}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition"
        >
          End Call
        </button>
      </div>
    </div>
  );
};