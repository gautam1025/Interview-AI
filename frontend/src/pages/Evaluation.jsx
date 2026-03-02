import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
  Trophy, TrendingUp, ChevronLeft, Loader2, AlertCircle,
  Star, CheckCircle2, XCircle, BookOpen, ArrowUpRight,
} from "lucide-react";

/* ─── Score Ring ──────────────────────────────────────────── */
function ScoreRing({ score }) {
  const pct    = Math.min((score || 0) * 10, 100);
  const r      = 52;
  const circ   = 2 * Math.PI * r;
  const color  = score >= 7 ? "#10b981" : score >= 5 ? "#f59e0b" : "#ef4444";
  const bgClr  = score >= 7 ? "#d1fae5" : score >= 5 ? "#fef3c7" : "#fee2e2";
  const label  = score >= 7 ? "Excellent" : score >= 5 ? "Average" : "Needs Work";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36 flex items-center justify-center rounded-full" style={{ backgroundColor: bgClr }}>
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle
            cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={circ - (pct / 100) * circ}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>
        <div className="relative text-center">
          <p className="text-3xl font-bold text-slate-800">{score ?? "—"}</p>
          <p className="text-xs text-slate-500 font-medium">/10</p>
        </div>
      </div>
      <span className="mt-3 text-sm font-semibold px-3 py-1 rounded-full border" style={{ color, backgroundColor: bgClr, borderColor: color + "33" }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Score Bar ───────────────────────────────────────────── */
function ScoreBar({ label, score }) {
  const pct   = Math.min((score || 0) * 10, 100);
  const color = score >= 7 ? "bg-emerald-500" : score >= 5 ? "bg-amber-400" : "bg-red-400";
  const tColor= score >= 7 ? "text-emerald-600" : score >= 5 ? "text-amber-600" : "text-red-500";
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-slate-600 font-medium">{label}</span>
        <span className={`text-sm font-bold ${tColor}`}>{score}/10</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ─── Feedback Section ────────────────────────────────────── */
function FeedbackSection({ title, icon: Icon, items, variant }) {
  const s = {
    green: { wrap: "border-emerald-200 bg-emerald-50", title: "text-emerald-800", icon: "text-emerald-600", dot: "bg-emerald-500", item: "bg-white border-emerald-100 text-emerald-800" },
    red:   { wrap: "border-red-200 bg-red-50",         title: "text-red-800",     icon: "text-red-600",     dot: "bg-red-500",     item: "bg-white border-red-100 text-red-800"         },
    blue:  { wrap: "border-blue-200 bg-blue-50",       title: "text-blue-800",    icon: "text-blue-600",    dot: "bg-blue-500",    item: "bg-white border-blue-100 text-blue-800"       },
  }[variant];

  const list = Array.isArray(items) ? items : [];
  return (
    <div className={`rounded-2xl border overflow-hidden`} style={{ borderColor: s.wrap.split(" ")[0].replace("border-","") }}>
      <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${s.wrap}`}>
        <Icon size={16} className={s.icon} />
        <h3 className={`text-sm font-semibold ${s.title}`}>{title}</h3>
        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full bg-white/70 ${s.title} font-medium border`}>
          {list.length} point{list.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="bg-white px-5 py-4 space-y-2.5">
        {list.length === 0
          ? <p className="text-sm text-slate-400 italic">No items noted.</p>
          : list.map((item, i) => (
            <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl border text-sm ${s.item}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${s.dot} mt-1.5 flex-shrink-0`} />
              <p className="leading-relaxed">{item}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
function Evaluation() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await API.get(`/interview/${id}`);
        setData(res);
      } catch {
        setError("Failed to load evaluation report.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-400 animate-fade-in">
      <Loader2 size={28} className="animate-spin text-blue-500" />
      <p className="text-sm font-medium">Loading your evaluation report…</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-400 animate-fade-in">
      <AlertCircle size={28} className="text-red-400" />
      <p className="text-sm font-medium text-red-500">{error}</p>
      <button onClick={() => navigate("/dashboard")} className="btn-secondary text-sm mt-2">Back to Dashboard</button>
    </div>
  );

  const ev = data?.evaluation || {};
  const { technicalScore, clarityScore, confidenceScore, structureScore, overallScore, strengths, weaknesses, improvementPlan } = ev;

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">

      {/* Back */}
      <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors group">
        <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Dashboard
      </button>

      {/* Hero card */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <ScoreRing score={overallScore} />
          <div className="flex-1 text-center sm:text-left">
            <div className="mb-2"><span className="badge-blue text-xs">Evaluation Report</span></div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">{data?.role || "Interview"} Assessment</h1>
            <p className="text-sm text-slate-500 mb-4">Detailed analysis of your performance across all evaluated dimensions.</p>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                <Star size={11} className="text-amber-500" />
                <span className="font-medium">{data?.experienceLevel || "N/A"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                <Trophy size={11} className="text-blue-500" />
                <span className="font-medium">Overall: {overallScore ?? "—"}/10</span>
              </div>
            </div>
          </div>
          <button onClick={() => navigate("/start")} className="btn-primary text-sm flex items-center gap-2 shrink-0">
            New Session <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="card">
        <div className="flex items-center gap-2.5 mb-5 pb-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <TrendingUp size={14} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Score Breakdown</h2>
            <p className="text-xs text-slate-400">Performance by category</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ScoreBar label="Technical"   score={technicalScore}  />
          <ScoreBar label="Clarity"     score={clarityScore}    />
          <ScoreBar label="Confidence"  score={confidenceScore} />
          <ScoreBar label="Structure"   score={structureScore}  />
        </div>
      </div>

      {/* Feedback */}
      <div className="space-y-5">
        <FeedbackSection title="Strengths"              icon={CheckCircle2} items={strengths || []}        variant="green" />
        <FeedbackSection title="Areas for Improvement" icon={XCircle}      items={weaknesses || []}       variant="red"   />
        <FeedbackSection title="Improvement Plan"      icon={BookOpen}     items={improvementPlan || []}  variant="blue"  />
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white text-center">
        <Trophy size={30} className="mx-auto mb-3 text-blue-200" />
        <h3 className="text-lg font-bold mb-1">Ready to Improve?</h3>
        <p className="text-blue-200 text-sm mb-5">Practice makes perfect. Start another session to boost your score.</p>
        <button
          onClick={() => navigate("/start")}
          className="bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-all duration-200 text-sm"
        >
          Start New Interview
        </button>
      </div>
    </div>
  );
}

export default Evaluation;