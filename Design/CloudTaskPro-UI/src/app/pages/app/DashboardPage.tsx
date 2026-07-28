import { Link } from "react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const productivityData = [
  { day: "Mon", tasks: 8 },
  { day: "Tue", tasks: 12 },
  { day: "Wed", tasks: 6 },
  { day: "Thu", tasks: 15 },
  { day: "Fri", tasks: 10 },
  { day: "Sat", tasks: 18 },
  { day: "Sun", tasks: 11 },
];

const projectHealthData = [
  { name: "Frontend", value: 68, color: "#0EA5E9" },
  { name: "API v2", value: 85, color: "#8B5CF6" },
  { name: "Mobile", value: 23, color: "#F59E0B" },
  { name: "Design", value: 45, color: "#22C55E" },
];

const recentProjects = [
  {
    id: "p1",
    name: "Frontend Redesign",
    status: "In Progress",
    progress: 68,
    deadline: "Dec 28",
    color: "#0EA5E9",
    members: [
      { label: "S", color: "#0EA5E9" },
      { label: "M", color: "#8B5CF6" },
      { label: "P", color: "#22C55E" },
    ],
  },
  {
    id: "p2",
    name: "API v2 Migration",
    status: "Review",
    progress: 85,
    deadline: "Dec 20",
    color: "#8B5CF6",
    members: [
      { label: "A", color: "#F59E0B" },
      { label: "L", color: "#EF4444" },
      { label: "S", color: "#0EA5E9" },
    ],
  },
  {
    id: "p3",
    name: "Mobile App Launch",
    status: "Planning",
    progress: 23,
    deadline: "Jan 15",
    color: "#F59E0B",
    members: [
      { label: "M", color: "#8B5CF6" },
      { label: "P", color: "#22C55E" },
    ],
  },
];

const recentTasks = [
  { id: 1, name: "Update navigation components", project: "Frontend Redesign", due: "Dec 16", priority: "#0EA5E9" },
  { id: 2, name: "Review API endpoint specs", project: "API v2 Migration", due: "Dec 15", priority: "#EF4444" },
  { id: 3, name: "Design onboarding screens", project: "Mobile App Launch", due: "Dec 20", priority: "#F59E0B" },
  { id: 4, name: "Set up CI/CD pipeline", project: "Backend Refactor", due: "Dec 18", priority: "#EF4444" },
  { id: 5, name: "Write component docs", project: "Design System 2.0", due: "Dec 22", priority: "#22C55E" },
];

const deadlines = [
  { name: "API v2 Migration", days: 6, color: "#EF4444" },
  { name: "Frontend Redesign", days: 14, color: "#F59E0B" },
  { name: "Backend Refactor", days: 17, color: "#22C55E" },
];

const activities = [
  { user: "S", color: "#0EA5E9", name: "Sarah Chen", action: "completed task", task: "Auth flow redesign", project: "Frontend Redesign", time: "2m ago" },
  { user: "A", color: "#F59E0B", name: "Alex Kim", action: "pushed commit to", task: "endpoint refactor", project: "API v2 Migration", time: "18m ago" },
  { user: "M", color: "#8B5CF6", name: "Marcus Webb", action: "reviewed PR in", task: "button variants", project: "Design System 2.0", time: "1h ago" },
  { user: "L", color: "#EF4444", name: "Lena Müller", action: "opened issue in", task: "DB query optimization", project: "Backend Refactor", time: "2h ago" },
  { user: "P", color: "#22C55E", name: "Priya Sharma", action: "updated task", task: "App Store assets", project: "Mobile App Launch", time: "3h ago" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "In Progress": "bg-[#0EA5E9]/15 text-[#0EA5E9]",
    "Done": "bg-[#22C55E]/15 text-[#22C55E]",
    "Completed": "bg-[#22C55E]/15 text-[#22C55E]",
    "Review": "bg-[#F59E0B]/15 text-[#F59E0B]",
    "Todo": "bg-white/[0.08] text-white/50",
    "Planning": "bg-white/[0.08] text-white/50",
    "Overdue": "bg-[#EF4444]/15 text-[#EF4444]",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? "bg-white/[0.08] text-white/50"}`}>
      {status}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Good morning, Marcus 👋</h1>
          <p className="text-white/40 text-sm mt-0.5">December 14, 2024</p>
        </div>
        <Link
          to="/app/projects/create"
          className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Projects", value: "12", sub: "+2 this week", color: "#0EA5E9", icon: "M3 7h18M3 12h18M3 17h18" },
          { label: "Open Tasks", value: "47", sub: "3 urgent", color: "#F59E0B", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
          { label: "Completed", value: "134", sub: "+18 this month", color: "#22C55E", icon: "M5 13l4 4L19 7" },
          { label: "Team Members", value: "8", sub: "2 online", color: "#8B5CF6", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" },
        ].map((card) => (
          <div key={card.label} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/40 text-sm">{card.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${card.color}20` }}>
                <svg className="w-4 h-4" style={{ color: card.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-white/40 text-xs mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Area Chart */}
        <div className="col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
          <h2 className="text-white text-sm font-medium mb-4">Weekly Productivity</h2>
          <ResponsiveContainer width="100%" height={192}>
            <AreaChart data={productivityData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#141414",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  color: "white",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.6)" }}
              />
              <Area
                type="monotone"
                dataKey="tasks"
                name="Tasks"
                stroke="#0EA5E9"
                strokeWidth={2}
                fill="#0EA5E9"
                fillOpacity={0.08}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Project Health Mini Bars */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
          <h2 className="text-white text-sm font-medium mb-4">Project Health</h2>
          <div className="space-y-3">
            {projectHealthData.map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-white/60 text-xs">{p.name}</span>
                  </div>
                  <span className="text-white/40 text-xs">{p.value}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${p.value}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3-col content grid */}
      <div className="grid grid-cols-3 gap-5">
        {/* Recent Projects */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-sm font-medium">Recent Projects</h2>
            <Link to="/app/projects" className="text-[#0EA5E9] text-xs hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {recentProjects.map((p) => (
              <Link key={p.id} to={`/app/projects/${p.id}`} className="block group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-white text-sm group-hover:text-[#0EA5E9] transition-colors">{p.name}</span>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden mb-1.5">
                  <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.color }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-xs">Due {p.deadline}</span>
                  <div className="flex -space-x-1.5">
                    {p.members.map((m, i) => (
                      <span
                        key={i}
                        className="w-5 h-5 rounded-full border border-[#0a0a0a] flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ background: m.color }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-sm font-medium">Recent Tasks</h2>
            <Link to="/app/tasks" className="text-[#0EA5E9] text-xs hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentTasks.map((t) => (
              <div key={t.id} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: t.priority }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.project} · Due {t.due}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-sm font-medium">Upcoming Deadlines</h2>
          </div>
          <div className="space-y-4">
            {deadlines.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">{d.name}</p>
                  <p className="text-white/40 text-xs mt-0.5">in {d.days} days</p>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${d.color}20`, color: d.color }}
                >
                  {d.days}d
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
        <h2 className="text-white text-sm font-medium mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {activities.map((a, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: a.color }}
              >
                {a.user}
              </span>
              <p className="text-white/60 text-sm flex-1">
                <span className="text-white font-medium">{a.name}</span>{" "}
                {a.action}{" "}
                <span className="text-white/80 italic">"{a.task}"</span>{" "}
                in <span className="text-white/80">{a.project}</span>
              </p>
              <span className="text-white/30 text-xs flex-shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
