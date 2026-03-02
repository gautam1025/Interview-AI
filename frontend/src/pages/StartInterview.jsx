import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
  BrainCircuit, ChevronDown, Loader2,
  Layers, Gauge, Lightbulb, ArrowRight, AlertCircle,
} from "lucide-react";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "AI Engineer",
  "Data Scientist",
  "Mobile Developer",
];

const EXPERIENCE_LEVELS = [
  { value: "Fresher",  desc: "0 – 6 months" },
  { value: "1 Year",   desc: "~1 year" },
  { value: "2 Years",  desc: "~2 years" },
  { value: "3+ Years", desc: "Senior level" },
];

function StartInterview() {
  const [role, setRole]                 = useState("");
  const [experienceLevel, setExp]       = useState("");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const navigate = useNavigate();

  const handleStart = async (e) => {
    e.preventDefault();
    if (!role || !experienceLevel) { setError("Please select both a role and experience level."); return; }
    setLoading(true); setError("");
    try {
      const { data } = await API.post("/interview/create", { role, experienceLevel });
      navigate(`/interview/${data._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to start interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-8">

      {/* Page header */}
      <div>
        <div className="mb-3"><span className="badge-blue">AI Powered</span></div>
        <h1 className="text-2xl font-bold text-slate-800">Start New Interview</h1>
        <p className="text-slate-500 mt-1 text-sm leading-relaxed">
          Configure your session below. Our AI will generate tailored questions based on your role and experience.
        </p>
      </div>

      {/* Info chips */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: BrainCircuit, title: "AI Generated", desc: "Dynamic questions",  color: "text-blue-500",    bg: "bg-blue-50"    },
          { icon: Layers,       title: "Multi-role",   desc: "7+ tech roles",      color: "text-violet-500", bg: "bg-violet-50" },
          { icon: Gauge,        title: "4 Levels",     desc: "Fresher to Senior",  color: "text-emerald-500", bg: "bg-emerald-50" },
        ].map(({ icon: Icon, title, desc, color, bg }) => (
          <div key={title} className="card p-4 text-center">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mx-auto mb-2`}>
              <Icon size={17} className={color} />
            </div>
            <p className="text-sm font-semibold text-slate-700">{title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="card">
        <div className="flex items-center gap-2.5 mb-6 pb-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Lightbulb size={14} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Session Configuration</h2>
            <p className="text-xs text-slate-400">Choose your role and experience level</p>
          </div>
        </div>

        <form onSubmit={handleStart} className="space-y-6">

          {/* Role dropdown */}
          <div>
            <label className="label-base">Job Role *</label>
            <div className="relative">
              <select
                value={role}
                onChange={e => { setRole(e.target.value); setError(""); }}
                className="input-base appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>Select a role…</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Experience level cards */}
          <div>
            <label className="label-base">Experience Level *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              {EXPERIENCE_LEVELS.map(({ value, desc }) => {
                const active = experienceLevel === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { setExp(value); setError(""); }}
                    className={`relative flex flex-col items-start p-3.5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                      active
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`text-sm font-semibold mb-0.5 ${active ? "text-blue-700" : "text-slate-700"}`}>{value}</span>
                    <span className="text-xs text-slate-400">{desc}</span>
                    {active && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !role || !experienceLevel}
            className="w-full btn-primary flex items-center justify-center gap-2.5 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 size={15} className="animate-spin" /> Generating Questions…</>
            ) : (
              <>Start Interview <ArrowRight size={15} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StartInterview;