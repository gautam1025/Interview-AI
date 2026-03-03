import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
  Trophy, Clock, Target, TrendingUp,
  ChevronRight, Calendar, Briefcase, Loader2,
  AlertCircle, Code2, ArrowUpRight,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"

/* ─── helpers ─────────────────────────────────────────────── */
const pct = s => Math.min((s || 0) * 10, 100); // score/10 → percent
const scoreColor = s => s >= 7 ? "text-emerald-600" : s >= 5 ? "text-amber-600" : "text-red-500";
const barColor = s => s >= 7 ? "bg-emerald-500" : s >= 5 ? "bg-amber-400" : "bg-red-400";
const badgeCls = s => s >= 7 ? "badge-green" : s >= 5 ? "badge-amber" : "badge-red";
const badgeLbl = s => s >= 7 ? "Strong" : s >= 5 ? "Average" : "Needs Work";

/* ─── StatCard ────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, accent }) {
  const a = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100" },
    emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100" },
    violet: { bg: "bg-violet-50", icon: "text-violet-600", border: "border-violet-100" },
    amber: { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-100" },
  }[accent] || {};

  return (
    <div className="card hover:-translate-y-0.5 transition-all duration-300 group cursor-default" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.06)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center`}>
          <Icon size={18} className={a.icon} />
        </div>
        <ArrowUpRight size={14} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
      </div>
      <p className="text-2xl font-bold text-slate-800 mb-0.5">{value}</p>
      <p className="text-sm font-medium text-slate-600">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────── */
function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/interview");
        setSessions(data);
      } catch {
        setError("Failed to load sessions.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = sessions.length;
  const avgScore = total
    ? (sessions.reduce((s, x) => s + (x.totalScore || 0), 0) / total).toFixed(1)
    : 0;
  const best = total ? Math.max(...sessions.map(s => s.totalScore || 0)) : 0;
  const lastDate = sessions[0]
    ? new Date(sessions[0].createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";

  const chartData = sessions
    .filter(s => s.totalScore)
    .map((s, index) => ({
      label: `Attempt ${index + 1}`,
      score: s.totalScore,
    }));

  return (
    <div className="animate-fade-in space-y-8">

      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back 👋</h1>
          <p className="text-slate-500 mt-1 text-sm">Track your interview performance and progress</p>
        </div>
        <button onClick={() => navigate("/start")} className="btn-primary flex items-center gap-2 text-sm self-start sm:self-auto">
          <Code2 size={15} /> New Interview
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard icon={Trophy} label="Total Sessions" value={total} sub="All time" accent="blue" />
        <StatCard icon={Target} label="Average Score" value={`${avgScore}/10`} sub="Across all sessions" accent="emerald" />
        <StatCard icon={TrendingUp} label="Best Score" value={`${best}/10`} sub="Personal best" accent="violet" />
        <StatCard icon={Clock} label="Last Session" value={lastDate} sub="Most recent" accent="amber" />
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.06)' }}>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-800">Performance Trend</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Score progression over completed interviews
          </p>
        </div>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
            Complete interviews to see performance trend.
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.06)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Interview History</h2>
            <p className="text-xs text-slate-400 mt-0.5">{total} session{total !== 1 ? "s" : ""} recorded</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading sessions…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center justify-center py-16 gap-2 text-red-500">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && total === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Code2 size={36} className="mb-3 text-slate-200" />
            <p className="text-sm font-medium text-slate-500">No sessions yet</p>
            <p className="text-xs mt-1">Start your first interview to see results here</p>
            <button onClick={() => navigate("/start")} className="btn-primary mt-5 text-sm">
              Start Interview
            </button>
          </div>
        )}

        {/* Table rows */}
        {!loading && !error && total > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-6 py-3.5 font-semibold">Role</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Experience</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Score</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Status</th>
                  <th className="text-left px-6 py-3.5 font-semibold">Date</th>
                  <th className="text-right px-6 py-3.5 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sessions.map((s, i) => (
                  <tr key={s._id || i} className="hover:bg-slate-50/70 transition-colors duration-150 group">
                    {/* Role */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Briefcase size={13} className="text-blue-500" />
                        </div>
                        <span className="font-medium text-slate-800">{s.role || "—"}</span>
                      </div>
                    </td>
                    {/* Experience */}
                    <td className="px-6 py-4">
                      <span className="badge-slate">{s.experienceLevel || "—"}</span>
                    </td>
                    {/* Score */}
                    <td className="px-6 py-4">
                      {s.totalScore ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className={`h-full rounded-full ${barColor(s.totalScore)}`} style={{ width: `${pct(s.totalScore)}%` }} />
                          </div>
                          <span className={`font-semibold text-sm ${scoreColor(s.totalScore)}`}>
                            {s.totalScore}/10
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Incomplete</span>
                      )}
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      {s.totalScore ? (
                        <span className={badgeCls(s.totalScore)}>{badgeLbl(s.totalScore)}</span>
                      ) : (
                        <span className="badge-slate">In Progress</span>
                      )}
                    </td>
                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar size={12} />
                        <span className="text-xs">
                          {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </td>
                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      {s.totalScore ? (
                        <button
                          onClick={() => navigate(`/evaluation/${s._id}`)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all duration-200"
                        >
                          View Report <ChevronRight size={12} />
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/interview/${s._id}`)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all duration-200"
                        >
                          Continue <ChevronRight size={12} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;