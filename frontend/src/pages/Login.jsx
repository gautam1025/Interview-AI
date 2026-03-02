import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BrainCircuit, Loader2, Eye, EyeOff } from "lucide-react";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      login(data.token);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">

        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-4"
            style={{ boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}
          >
            <BrainCircuit size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Interview AI</h1>
          <p className="text-slate-500 text-sm mt-1">Assessment Platform</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-500 mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label-base">Email address</label>
              <input
                type="email" value={email} required
                placeholder="you@example.com"
                className="input-base"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label-base">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} value={password} required
                  placeholder="••••••••"
                  className="input-base pr-11"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">{error}</div>
            )}
            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-3 mt-1">
              {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in…</> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            New here?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


export default Login;