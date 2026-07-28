import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../../../lib/api";

const GROWTH = [
  { month: "Jul", value: 62 },
  { month: "Aug", value: 78 },
  { month: "Sep", value: 91 },
  { month: "Oct", value: 105 },
  { month: "Nov", value: 134 },
  { month: "Dec", value: 158 },
];

const PLANS = [
  { name: "Free", count: 520, pct: 61, color: "#ffffff40" },
  { name: "Pro", count: 287, pct: 34, color: "var(--color-accent)" },
  { name: "Enterprise", count: 40, pct: 5, color: "#8B5CF6" },
];

const RECENT_SIGNUPS = [
  { initials: "DK", name: "Daniel Kim", email: "daniel@startup.io", plan: "Pro", joined: "Dec 28, 2024", status: "Active" },
  { initials: "MR", name: "Maya Rodriguez", email: "maya@techco.com", plan: "Free", joined: "Dec 27, 2024", status: "Active" },
  { initials: "TP", name: "Tom Parker", email: "tom@agency.co", plan: "Enterprise", joined: "Dec 26, 2024", status: "Active" },
  { initials: "SL", name: "Sofia Lopez", email: "sofia@design.io", plan: "Pro", joined: "Dec 25, 2024", status: "Active" },
  { initials: "RN", name: "Ryan Nguyen", email: "ryan@dev.com", plan: "Free", joined: "Dec 24, 2024", status: "Suspended" },
];

const SYSTEM_STATUS = [
  { name: "API", uptime: "99.98%" },
  { name: "Database", uptime: "99.99%" },
  { name: "CDN", uptime: "100%" },
  { name: "Auth", uptime: "99.97%" },
];

const maxGrowth = Math.max(...GROWTH.map((g) => g.value));

function planBadge(plan: string) {
  if (plan === "Pro") return "bg-accent/15 text-accent";
  if (plan === "Enterprise") return "bg-[#8B5CF6]/15 text-[#8B5CF6]";
  return "bg-white/10 text-muted-foreground";
}

function statusBadge(status: string) {
  if (status === "Active") return "bg-[#22C55E]/15 text-[#22C55E]";
  return "bg-[#EF4444]/15 text-[#EF4444]";
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<{ id: number }[]>([]);
  const [projects, setProjects] = useState<{ id: number }[]>([]);
  const [tasks, setTasks] = useState<{ id: number; status: string }[]>([]);

  useEffect(() => {
    void Promise.all([
      api.get("/users").catch(() => []),
      api.get("/projects").catch(() => []),
      api.get("/tasks").catch(() => []),
    ]).then(([u, p, t]) => {
      setUsers(u as { id: number }[]);
      setProjects(p as { id: number }[]);
      setTasks(t as { id: number; status: string }[]);
    });
  }, []);

  const completed = tasks.filter((task) => task.status === "Completed" || task.status === "Done").length;
  const activeProjects = projects.length;
  const totalUsers = users.length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-[#EF4444]/15 text-[#EF4444] text-xs font-medium">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/app/admin/users"
            className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            Manage Users
          </Link>
          <Link
            to="/app/admin/projects"
            className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            Manage Projects
          </Link>
          <Link
            to="/app/admin/teams"
            className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            Manage Teams
          </Link>
          <Link
            to="/app/admin/settings"
            className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            Settings
          </Link>
          <Link
            to="/app/admin/logs"
            className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            System Logs
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-sm text-muted-foreground mb-2">Total Users</div>
          <div className="text-3xl font-bold text-foreground mb-1">{totalUsers}</div>
          <div className="text-xs font-medium text-accent">Live from /users</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-sm text-muted-foreground mb-2">Active Workspaces</div>
          <div className="text-3xl font-bold text-foreground mb-1">1</div>
          <div className="text-xs font-medium text-[#8B5CF6]">Demo workspace</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-sm text-muted-foreground mb-2">Total Projects</div>
          <div className="text-3xl font-bold text-foreground mb-1">{activeProjects}</div>
          <div className="text-xs font-medium text-[#22C55E]">Live from /projects</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-sm text-muted-foreground mb-2">Tasks Completed</div>
          <div className="text-3xl font-bold text-foreground mb-1">{completed}</div>
          <div className="text-xs font-medium text-[#F59E0B]">Live from /tasks</div>
        </div>
      </div>

      {/* Two panel row */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        {/* User Growth */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-medium text-muted-foreground mb-5">User Growth (Last 6 Months)</h3>
          <div className="flex items-end gap-3 h-36">
            {GROWTH.map((g) => (
              <div key={g.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">{g.value}</span>
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${(g.value / maxGrowth) * 96}px`,
                    backgroundcolor: "var(--color-accent)",
                    opacity: 0.7 + (g.value / maxGrowth) * 0.3,
                  }}
                />
                <span className="text-xs text-muted-foreground">{g.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-medium text-muted-foreground mb-5">Plan Distribution</h3>
          <div className="space-y-4">
            {PLANS.map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-muted-foreground">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.count} users ({p.pct}%)</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${p.pct}%`, backgroundColor: p.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent signups table */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Recent Signups</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["User", "Plan", "Joined", "Status"].map((h) => (
                <th key={h} className="text-left text-xs text-muted-foreground font-medium pb-3 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {RECENT_SIGNUPS.map((u) => (
              <tr key={u.email}>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                      {u.initials}
                    </div>
                    <div>
                      <div className="text-sm text-foreground font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${planBadge(u.plan)}`}>{u.plan}</span>
                </td>
                <td className="py-3 pr-4 text-sm text-muted-foreground">{u.joined}</td>
                <td className="py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(u.status)}`}>{u.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* System status */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">System Status</h3>
        <div className="grid grid-cols-4 gap-4">
          {SYSTEM_STATUS.map((s) => (
            <div key={s.name} className="flex items-center justify-between bg-card rounded-xl p-3 border border-white/[0.04]">
              <div>
                <div className="text-sm font-medium text-foreground">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.uptime} uptime</div>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E]">
                Operational
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
