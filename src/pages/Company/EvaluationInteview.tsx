import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCompany } from "../../hooks/useCompanyHook";
import { SubmitEvaluationPayload } from "../../services/CompanyApi"; 

export const EvaluateInterviewPage: React.FC = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const { submitEvaluation, loading, error } = useCompany();

  const [formData, setFormData] = useState<SubmitEvaluationPayload>({
    technicalScore: 5,
    communicationScore: 5,
    problemSolvingScore: 5,
    notes: "",
    decision: "NEXT_ROUND", // Matches your API payload key
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleScoreChange = (
    field: keyof SubmitEvaluationPayload,
    value: number | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!interviewId) {
      setSubmitError("Missing interview ID.");
      return;
    }

    try {
      const response = await submitEvaluation(interviewId, formData);
      if (response) {
        // Redirect back to interview list upon successful submit
        navigate("/company/interviews");
      }
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit evaluation.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border rounded-lg shadow-sm mt-8">
      <h1 className="text-xl font-bold mb-6 text-gray-800">
        Submit Candidate Evaluation
      </h1>

      {(error || submitError) && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded">
          {error || submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Technical Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Technical Score (1 - 10): {formData.technicalScore}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.technicalScore}
            onChange={(e) =>
              handleScoreChange("technicalScore", Number(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Communication Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Communication Score (1 - 10): {formData.communicationScore}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.communicationScore}
            onChange={(e) =>
              handleScoreChange("communicationScore", Number(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Problem Solving Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Problem Solving Score (1 - 10): {formData.problemSolvingScore}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.problemSolvingScore}
            onChange={(e) =>
              handleScoreChange("problemSolvingScore", Number(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Decision */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hiring Decision
          </label>
          <select
            value={formData.decision}
            onChange={(e) => handleScoreChange("decision", e.target.value)}
            className="w-full border rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="NEXT_ROUND">Next Round</option>
            <option value="HIRED">Hire</option>
            <option value="REJECTED">Reject</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        {/* Notes / Feedback */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Evaluation Notes & Feedback
          </label>
          <textarea
            rows={4}
            value={formData.notes}
            onChange={(e) => handleScoreChange("notes", e.target.value)}
            placeholder="Detailed notes regarding the candidate performance..."
            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Evaluation"}
          </button>
        </div>
      </form>
    </div>
  );
};