import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Loader2, Send, AlertCircle, FileQuestion } from "lucide-react";

function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(`/interview/${id}`);
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(""));
      } catch {
        setError("Failed to load interview questions.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await API.post(`/interview/submit/${id}`, { answers });
      navigate(`/evaluation/${id}`);
    } catch {
      setError("Submission failed. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-400 animate-fade-in">
      <Loader2 size={28} className="animate-spin text-blue-500" />
      <p className="text-sm font-medium">Loading your questions…</p>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <div className="mb-2"><span className="badge-blue">Interview Session</span></div>
        <h1 className="text-2xl font-bold text-slate-800">Answer the Questions</h1>
        <p className="text-slate-500 text-sm mt-1">
          Take your time. Answer each question as thoroughly as possible.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" /> {error}
        </div>
      )}

      {/* Questions */}
      {questions.map((q, index) => (
        <div key={index} className="card space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileQuestion size={14} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Question {index + 1}
              </p>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">{q}</p>
            </div>
          </div>
          <textarea
            className="input-base resize-none"
            rows={5}
            placeholder="Write your answer here…"
            value={answers[index]}
            onChange={(e) => handleChange(index, e.target.value)}
          />
          <div className="flex justify-end">
            <span className="text-xs text-slate-400">{answers[index].length} characters</span>
          </div>
        </div>
      ))}

      {/* Submit */}
      {questions.length > 0 && (
        <div className="flex justify-end pt-2 pb-8">
          <button
            onClick={handleSubmit}
            disabled={submitting || answers.every(a => !a.trim())}
            className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><Loader2 size={15} className="animate-spin" /> Submitting…</>
            ) : (
              <><Send size={15} /> Submit Interview</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default Interview;