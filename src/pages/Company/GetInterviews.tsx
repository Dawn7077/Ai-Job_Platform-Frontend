import React, { useEffect } from "react";
import { useCompany } from "../../hooks/useCompanyHook";
import { useNavigate } from "react-router-dom";

export const CompanyInterviewsPage: React.FC = () => {
  const { fetchInterviews, allInterview, loading, error } = useCompany();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleJoinRoom = (roomKey: string) => {
    navigate(`/room/${roomKey}`);
  };

  const handleEvaluate = (interviewId: string) => {
    navigate(`/company/interviews/${interviewId}/evaluate`);
  };

  if (loading) return <div className="p-6">Loading scheduled interviews...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Company Interview Management</h1>

      {allInterview.length === 0 ? (
        <p className="text-gray-500">No interviews have been scheduled.</p>
      ) : (
        <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 font-semibold">Candidate ID</th>
                <th className="px-4 py-3 font-semibold">Date & Time</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allInterview.map((interview) => (
                <tr key={interview.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{interview.candidateId}</td>
                  <td className="px-4 py-3">
                    {new Date(interview.scheduledAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        interview.status === "SCHEDULED"
                          ? "bg-blue-100 text-blue-800"
                          : interview.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {interview.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {interview.status === "SCHEDULED" && (
                      <button
                        onClick={() => handleJoinRoom(interview.roomKey)}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded text-xs hover:bg-indigo-700"
                      >
                        Start Meeting
                      </button>
                    )}
                    <button
                      onClick={() => handleEvaluate(interview.id)}
                      className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs hover:bg-gray-300"
                    >
                      Evaluate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};