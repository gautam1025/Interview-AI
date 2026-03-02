import { useAuth } from "../context/AuthContext";
import { LogOut, Bell, User } from "lucide-react";

function Navbar() {
  const { logout } = useAuth();

  return (
    <header
      className="fixed top-0 left-60 right-0 h-16 z-20 flex items-center justify-between px-8 border-b border-slate-100"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', boxShadow: '0 1px 0 #f1f5f9' }}
    >
      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" style={{boxShadow:'0 0 0 3px rgba(52,211,153,0.2)'}} />
        <span className="text-xs text-slate-500 font-medium">AI Engine Online</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Bell */}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200">
          <Bell size={16} />
        </button>

        {/* User chip */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0" style={{boxShadow:'0 2px 6px rgba(37,99,235,0.25)'}}>
            <User size={14} className="text-white" />
          </div>
          <span className="hidden sm:block text-sm font-semibold text-slate-700">My Account</span>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="btn-danger flex items-center gap-1.5 text-sm"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;