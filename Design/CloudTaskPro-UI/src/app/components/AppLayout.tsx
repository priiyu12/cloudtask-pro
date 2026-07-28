import { Outlet, Link, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, FolderOpen, CheckSquare, LayoutGrid, Calendar,
  BarChart3, Activity, Users, Bell, Folder, Settings, ShieldCheck,
  Search, ChevronRight, Cloud, Menu, X,
} from "lucide-react";
import { useState } from "react";

interface NavItemDef {
  icon: React.ElementType;
  label: string;
  to: string;
  matchPrefix?: string;
}

const NAV: Array<{ group: string; items: NavItemDef[] }> = [
  {
    group: "Overview",
    items: [{ icon: LayoutDashboard, label: "Dashboard", to: "/app/dashboard" }],
  },
  {
    group: "Workspace",
    items: [
      { icon: FolderOpen, label: "Projects", to: "/app/projects" },
      { icon: CheckSquare, label: "Tasks", to: "/app/tasks" },
      { icon: LayoutGrid, label: "Kanban", to: "/app/kanban" },
      { icon: Calendar, label: "Calendar", to: "/app/calendar" },
    ],
  },
  {
    group: "Insights",
    items: [
      { icon: BarChart3, label: "Analytics", to: "/app/analytics" },
      { icon: Activity, label: "Activity", to: "/app/activity" },
    ],
  },
  {
    group: "Collaboration",
    items: [
      { icon: Users, label: "Team", to: "/app/team" },
      { icon: Bell, label: "Notifications", to: "/app/notifications" },
      { icon: Folder, label: "Files", to: "/app/files" },
    ],
  },
  {
    group: "Account",
    items: [
      { icon: Settings, label: "Settings", to: "/app/settings/general", matchPrefix: "/app/settings" },
      { icon: ShieldCheck, label: "Admin", to: "/app/admin", matchPrefix: "/app/admin" },
    ],
  },
];

function SidebarItem({ icon: Icon, label, to, matchPrefix }: NavItemDef) {
  const location = useLocation();
  const prefix = matchPrefix ?? to;
  const isActive =
    location.pathname === to ||
    location.pathname.startsWith(to + "/") ||
    (matchPrefix ? location.pathname.startsWith(matchPrefix) : false);

  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 px-3 py-[7px] rounded-xl text-[13px] transition-all duration-150 ${
        isActive
          ? "bg-white text-black font-semibold"
          : "text-white/40 hover:text-white/80 hover:bg-white/[0.05]"
      }`}
    >
      <Icon className="w-[15px] h-[15px] flex-shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-[18px] border-b border-white/[0.05]">
        <div className="w-7 h-7 rounded-lg bg-[#0EA5E9] flex items-center justify-center shadow-[0_0_14px_rgba(14,165,233,0.35)]">
          <Cloud className="w-4 h-4 text-white" />
        </div>
        <Link to="/" className="text-white font-semibold tracking-tight text-sm">CloudTask Pro</Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <p className="text-white/20 text-[10px] font-semibold uppercase tracking-wider px-3 mb-1.5">{group}</p>
            <div className="space-y-0.5">
              {items.map(item => <SidebarItem key={item.to} {...item} />)}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/[0.05]">
        <Link to="/app/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group">
          <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-xs text-white font-bold flex-shrink-0">M</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">Marcus Webb</p>
            <p className="text-white/35 text-[10px] truncate">CTO · Payload</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 flex-shrink-0 transition-colors" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <aside className="hidden md:flex flex-col w-[220px] flex-shrink-0 bg-[#0d0d0d] border-r border-white/[0.05]">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[220px] flex flex-col bg-[#0d0d0d] border-r border-white/[0.05] z-10">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between h-[54px] px-5 border-b border-white/[0.05] bg-[#0a0a0a] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-white/40 hover:text-white transition-colors" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/app/search")}
              className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-1.5 text-white/25 hover:text-white/55 hover:bg-white/[0.06] transition-colors min-w-[160px] md:min-w-[240px]"
            >
              <Search className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="flex-1 text-left text-[13px]">Search anything...</span>
              <kbd className="hidden lg:flex text-[10px] border border-white/[0.1] rounded px-1.5 py-0.5 text-white/20">⌘K</kbd>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <Link to="/app/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-xl text-white/40 hover:text-white/80 hover:bg-white/[0.05] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-[9px] right-[9px] w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
            </Link>
            <Link to="/app/profile" className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-xs text-white font-bold hover:ring-2 hover:ring-[#8B5CF6]/40 transition-all ml-1">
              M
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
