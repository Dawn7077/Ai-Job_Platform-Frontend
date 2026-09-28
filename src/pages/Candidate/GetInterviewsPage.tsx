import React, { useEffect } from "react";
import { useCandidate } from "../../hooks/useCandidateHooks";  
import { useNavigate } from "react-router-dom";

export const CandidateInterviewsPage: React.FC = () => {
  const { fetchInterviews, allInterview, loading, error } = useCandidate();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleJoinRoom = (roomKey: string) => {
    navigate(`/room/${roomKey}`);
  };

  if (loading) return <div className="p-6">Loading interviews...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Scheduled Interviews</h1>

      {allInterview.length === 0 ? (
        <p className="text-gray-500">No interviews scheduled yet.</p>
      ) : (
        <div className="grid gap-4">
          {allInterview.map((interview) => (
            <div
              key={interview.id}
              className="border rounded-lg p-4 shadow-sm flex items-center justify-between bg-white"
            >
              <div>
                <p className="font-semibold text-lg">Interview ID: {interview.id}</p>
                <p className="text-sm text-gray-600">
                  Scheduled: {new Date(interview.scheduledAt).toLocaleString()}
                </p>
                <span
                  className={`inline-block text-xs px-2 py-1 rounded mt-2 ${
                    interview.status === "SCHEDULED"
                      ? "bg-blue-100 text-blue-800"
                      : interview.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {interview.status}
                </span>
              </div>

              {interview.status === "SCHEDULED" && (
                <button
                  onClick={() => handleJoinRoom(interview.roomKey)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Join Call
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};