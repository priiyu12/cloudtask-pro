import { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

type Range = "7 days" | "30 days" | "Quarter" | "Year";

// --- Data ---
const WEEKLY_PRODUCTIVITY = [
  { week: "W45", completed: 42, created: 55 },
  { week: "W46", completed: 38, created: 48 },
  { week: "W47", completed: 55, created: 62 },
  { week: "W48", completed: 49, created: 51 },
  { week: "W49", completed: 63, created: 70 },
  { week: "W50", completed: 58, created: 65 },
  { week: "W51", completed: 71, created: 78 },
  { week: "W52", completed: 67, created: 72 },
];

const PROJECT_PROGRESS = [
  { name: "API v2 Migration", progress: 68 },
  { name: "Frontend Redesign", progress: 45 },
  { name: "Backend Refactor", progress: 82 },
  { name: "Design System 2.0", progress: 91 },
];

const PRIORITY_DATA = [
  { name: "High", value: 28 },
  { name: "Medium", value: 65 },
  { name: "Low", value: 41 },
];

const PRIORITY_COLORS = ["#EF4444", "#F59E0B", "#22C55E"];

const TEAM_VELOCITY = [
  { week: "Week 1", Sarah: 15, Marcus: 12, Alex: 8, Priya: 6 },
  { week: "Week 2", Sarah: 18, Marcus: 14, Alex: 10, Priya: 9 },
  { week: "Week 3", Sarah: 22, Marcus: 11, Alex: 9, Priya: 7 },
  { week: "Week 4", Sarah: 20, Marcus: 16, Alex: 12, Priya: 11 },
];

const MEMBER_LINES = [
  { key: "Sarah", color: "#0EA5E9" },
  { key: "Marcus", color: "#8B5CF6" },
  { key: "Alex", color: "#22C55E" },
  { key: "Priya", color: "#F59E0B" },
];

// Heatmap: 10 weeks × 7 days
const HEATMAP = Array.from({ length: 70 }, () => Math.random());

const TOP_PERFORMERS = [
  { member: "Sarah", initial: "S", color: "#0EA5E9", tasks: 38, projects: 3, avgDays: 2.1, trend: "up" },
  { member: "Marcus", initial: "M", color: "#8B5CF6", tasks: 31, projects: 4, avgDays: 2.8, trend: "up" },
  { member: "Alex", initial: "A", color: "#F59E0B", tasks: 24, projects: 2, avgDays: 3.2, trend: "down" },
  { member: "Priya", initial: "P", color: "#22C55E", tasks: 19, projects: 3, avgDays: 2.5, trend: "up" },
];

// --- Chart styling ---
const GRID_PROPS = {
  strokeDasharray: "3 3" as const,
  stroke: "rgba(255,255,255,0.04)",
};

const AXIS_PROPS = {
  tick: { fill: "rgba(255,255,255,0.35)", fontSize: 11 },
  axisLine: { stroke: "rgba(255,255,255,0.08)" },
  tickLine: { stroke: "rgba(255,255,255,0.08)" },
};

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#141414",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    color: "white",
    fontSize: 12,
  },
  cursor: { fill: "rgba(255,255,255,0.03)" },
};

// --- KPI Card ---
interface KpiProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

function KpiCard({ label, value, change, positive }: KpiProps) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
      <p className="text-white/40 text-xs font-medium mb-3">{label}</p>
      <p className="text-white text-2xl font-bold mb-2">{value}</p>
      <div className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
        {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {change}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("30 days");

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl font-semibold">Analytics</h1>
        <div className="flex items-center bg-white/[0.04] border border-white/[0.07] rounded-xl p-1 gap-0.5">
          {(["7 days", "30 days", "Quarter", "Year"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                range === r ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Tasks Completed" value="134" change="+12% this period" positive />
        <KpiCard label="Active Projects" value="12" change="+2 new projects" positive />
        <KpiCard label="Team Velocity" value="18/week" change="+24% vs last period" positive />
        <KpiCard label="Completion Rate" value="87%" change="+5% vs last period" positive />
      </div>

      {/* Weekly Productivity AreaChart */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white text-sm font-semibold">Weekly Productivity</h2>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-white/40">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9]" /> Completed
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/40">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Created
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={224}>
          <AreaChart data={WEEKLY_PRODUCTIVITY} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...GRID_PROPS} />
            <XAxis dataKey="week" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Area type="monotone" dataKey="created" name="Created" stroke="#8B5CF6" strokeWidth={1.5} fill="url(#gradCreated)" isAnimationActive={false} />
            <Area type="monotone" dataKey="completed" name="Completed" stroke="#0EA5E9" strokeWidth={2} fill="url(#gradCompleted)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two column charts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Project Progress BarChart */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-5">Project Progress</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={PROJECT_PROGRESS}
              layout="vertical"
              margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid {...GRID_PROPS} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} {...AXIS_PROPS} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" {...AXIS_PROPS} width={130} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(v: number) => [`${v}%`, "Progress"]}
              />
              <Bar dataKey="progress" radius={[0, 6, 6, 0]} maxBarSize={22} isAnimationActive={false}>
                {PROJECT_PROGRESS.map((_, idx) => (
                  <Cell
                    key={`bar-cell-${idx}`}
                    fill={["#0EA5E9", "#8B5CF6", "#F59E0B", "#22C55E"][idx]}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority PieChart */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-5">Tasks by Priority</h2>
          <div className="flex items-center gap-6">
            <PieChart width={160} height={160}>
              <Pie
                data={PRIORITY_DATA}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                isAnimationActive={false}
              >
                {PRIORITY_DATA.map((_, i) => (
                  <Cell key={`pie-cell-${i}`} fill={PRIORITY_COLORS[i]} fillOpacity={0.9} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={TOOLTIP_STYLE.contentStyle}
                formatter={(v: number, name: string) => [v, name]}
              />
            </PieChart>
            <div className="space-y-3 flex-1">
              {PRIORITY_DATA.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PRIORITY_COLORS[i] }} />
                    <span className="text-white/60 text-sm">{d.name}</span>
                  </div>
                  <span className="text-white font-semibold text-sm">{d.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-white/40 text-xs">Total</span>
                <span className="text-white/70 text-sm font-semibold">
                  {PRIORITY_DATA.reduce((a, b) => a + b.value, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Velocity LineChart */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-white text-sm font-semibold mb-5">Team Velocity</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={TEAM_VELOCITY} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid {...GRID_PROPS} />
            <XAxis dataKey="week" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.4)", paddingTop: 12 }}
              iconType="circle"
              iconSize={8}
            />
            {MEMBER_LINES.map((m) => (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                name={m.key}
                stroke={m.color}
                strokeWidth={2}
                dot={{ fill: m.color, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white text-sm font-semibold">Activity Heatmap</h2>
          <div className="flex items-center gap-2">
            <span className="text-white/30 text-xs">Less</span>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((o, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{ background: `rgba(14, 165, 233, ${o})` }}
              />
            ))}
            <span className="text-white/30 text-xs">More</span>
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 10 }, (_, week) => (
            <div key={week} className="flex flex-col gap-1">
              {Array.from({ length: 7 }, (_, day) => {
                const val = HEATMAP[week * 7 + day];
                return (
                  <div
                    key={day}
                    className="w-3 h-3 rounded-sm cursor-pointer hover:ring-1 hover:ring-white/20 transition-all"
                    style={{ background: `rgba(14, 165, 233, ${val < 0.1 ? 0.05 : val})` }}
                    title={`${Math.round(val * 10)} tasks`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {["Oct", "Nov", "Dec"].map((m) => (
            <span key={m} className="text-white/25 text-xs">{m}</span>
          ))}
        </div>
      </div>

      {/* Top Performers table */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <h2 className="text-white text-sm font-semibold">Top Performers</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.04]">
              <th className="px-6 py-3 text-left text-white/40 font-medium">Member</th>
              <th className="px-6 py-3 text-left text-white/40 font-medium">Tasks</th>
              <th className="px-6 py-3 text-left text-white/40 font-medium">Projects</th>
              <th className="px-6 py-3 text-left text-white/40 font-medium">Avg Completion</th>
              <th className="px-6 py-3 text-left text-white/40 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {TOP_PERFORMERS.map((p) => (
              <tr key={p.member} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: p.color }}
                    >
                      {p.initial}
                    </div>
                    <span className="text-white font-medium">{p.member}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-white/70">{p.tasks}</td>
                <td className="px-6 py-3.5 text-white/70">{p.projects}</td>
                <td className="px-6 py-3.5 text-white/70">{p.avgDays} days</td>
                <td className="px-6 py-3.5">
                  {p.trend === "up" ? (
                    <span className="flex items-center gap-1 text-[#22C55E] text-xs">
                      <TrendingUp size={12} /> Improving
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[#EF4444] text-xs">
                      <TrendingDown size={12} /> Declining
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
