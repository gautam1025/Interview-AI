import { NavLink } from "react-router-dom";
import { LayoutDashboard, PlayCircle, BrainCircuit, BarChart3 } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Overview",        icon: LayoutDashboard },
  { to: "/start",     label: "Start Interview",  icon: PlayCircle      },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-100 flex flex-col z-30" style={{boxShadow:'1px 0 0 #f1f5f9'}}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0" style={{boxShadow:'0 2px 8px rgba(37,99,235,0.3)'}}>
          <BrainCircuit size={18} className="text-white" />
        </div>
        <div className="leading-tight min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">Interview AI</p>
          <p className="text-xs text-slate-400 font-medium truncate">Assessment Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={`flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center gap-2 px-2">
          <BarChart3 size={13} className="text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;