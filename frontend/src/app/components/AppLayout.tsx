import { Outlet, Link, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, FolderOpen, CheckSquare, LayoutGrid, Calendar,
  BarChart3, Activity, Users, Bell, Folder, Settings, ShieldCheck,
  Search, ChevronRight, Cloud, Menu, X, LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { clearToken, getTokenPayload, api, CurrentUser, WorkspaceMembership } from "../lib/api";
import { UpgradeModal } from "./UpgradeModal";
import { ToastProvider } from "./Toast";
import { ConfirmDialogProvider } from "./ConfirmDialog";
import { GlobalSearchModal } from "./GlobalSearchModal";

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
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
      }`}
    >
      <Icon className="w-[15px] h-[15px] flex-shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [workspaces, setWorkspaces] = useState<WorkspaceMembership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const meData = await api.me();
        setUser(meData);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
      try {
        const workspacesData = await api.meWorkspaces();
        setWorkspaces(workspacesData);
      } catch (err) {
        console.error("Failed to fetch workspaces", err);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSwitchWorkspace = async (workspaceId: number) => {
    try {
      await api.switchWorkspace(workspaceId);
      window.location.reload();
    } catch (err) {
      console.error("Failed to switch workspace", err);
    }
  };
  const tokenPayload = getTokenPayload();
  const tokenEmail = tokenPayload?.sub;
  const isAdmin = tokenPayload?.role === "Admin";
  const nav = NAV.map((group) => ({
    ...group,
    items: group.group === "Account" && !isAdmin
      ? group.items.filter((item) => item.to !== "/app/admin")
      : group.items,
  }));

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-[18px] border-b border-sidebar-border">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-[0_0_14px_rgba(14,165,233,0.35)]">
          <Cloud className="w-4 h-4 text-foreground" />
        </div>
        <Link to="/" className="text-foreground font-semibold tracking-tight text-sm">CloudTask Pro</Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {nav.map(({ group, items }) => (
          <div key={group}>
            <p className="text-sidebar-foreground/40 text-[10px] font-semibold uppercase tracking-wider px-3 mb-1.5">{group}</p>
            <div className="space-y-0.5">
              {items.map(item => <SidebarItem key={item.to} {...item} />)}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border">
        <Link to="/app/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sidebar-accent transition-colors group">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs text-white font-bold flex-shrink-0" style={user?.avatar_color ? { backgroundColor: user.avatar_color } : {}}>
            {user?.name?.[0]?.toUpperCase() ?? (tokenEmail?.[0] ?? "U").toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sidebar-foreground text-xs font-medium truncate">{user?.name ?? (isAdmin ? "CloudTask Admin" : "User")}</p>
            <p className="text-sidebar-foreground/60 text-[10px] truncate">{user?.job_title || workspaces.find(w => w.workspace.id === user?.current_workspace_id)?.role || (isAdmin ? "Administrator" : "Member")}</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-sidebar-foreground/30 group-hover:text-sidebar-foreground/60 flex-shrink-0 transition-colors" />
        </Link>
        <button
          onClick={() => {
            clearToken();
            navigate("/login");
          }}
          className="mt-3 w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <ConfirmDialogProvider>
        {workspaces.length === 0 && !loading && user ? (
          <div className="flex h-screen bg-background items-center justify-center p-6" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-2 mb-6 justify-center">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-foreground font-semibold tracking-tight text-lg">CloudTask Pro</span>
              </div>
              <h2 className="text-2xl font-semibold text-foreground text-center mb-2">Welcome aboard!</h2>
              <p className="text-muted-foreground text-center text-sm mb-8">Let's set up your first workspace to get started.</p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("workspaceName") as string;
                if (!name.trim()) return;
                try {
                  await api.post("/workspaces", { name });
                  window.location.reload();
                } catch (err) {
                  console.error("Failed to create workspace", err);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Workspace Name</label>
                    <input 
                      name="workspaceName" 
                      placeholder="e.g. Acme Corp" 
                      autoFocus
                      required
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <button type="submit" className="w-full bg-primary text-primary-foreground font-semibold rounded-xl px-4 py-3 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    Create Workspace
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
        <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <aside className="hidden md:flex flex-col w-[220px] flex-shrink-0 bg-sidebar border-r border-sidebar-border">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[220px] flex flex-col bg-sidebar border-r border-sidebar-border z-10">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between h-[54px] px-5 bg-background flex-shrink-0 border-b border-border">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 bg-secondary border border-border rounded-xl px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors min-w-[160px] md:min-w-[240px]"
            >
              <Search className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="flex-1 text-left text-[13px]">Search anything...</span>
              <kbd className="hidden lg:flex text-[10px] border border-border rounded px-1.5 py-0.5 text-muted-foreground">⌘K</kbd>
            </button>
          </div>
          <div className="flex items-center gap-4">
            {workspaces.length > 0 && (
              <select
                value={user?.current_workspace_id ?? ""}
                onChange={(e) => handleSwitchWorkspace(Number(e.target.value))}
                className="text-[13px] bg-secondary border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="" disabled>Select Workspace</option>
                {workspaces.map(w => (
                  <option key={w.workspace.id} value={w.workspace.id}>{w.workspace.name}</option>
                ))}
              </select>
            )}
            <Link to="/app/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground/80 hover:bg-secondary transition-colors">
              <Bell className="w-4 h-4" />
              {/* Optional: Add unread indicator here if we fetch invites */}
            </Link>
            <Link to="/app/profile" className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs text-white font-bold hover:ring-2 hover:ring-accent/40 transition-all ml-1" style={user?.avatar_color ? { backgroundColor: user.avatar_color } : {}}>
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <UpgradeModal />
    </div>
        )}
      </ConfirmDialogProvider>
    </ToastProvider>
  );
}
