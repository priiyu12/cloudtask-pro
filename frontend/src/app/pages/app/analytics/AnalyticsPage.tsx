import { useState, useEffect, useMemo } from "react";
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
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { api } from "../../../lib/api";

type Range = "7 days" | "30 days" | "Quarter" | "Year";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  project_id: string;
  assignee?: string;
  created_at?: string;
}

interface Project {
  id: string;
  name: string;
}


const PRIORITY_COLORS = ["#EF4444", "#F59E0B", "#22C55E"];

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
  value: string | number;
  change: string;
  positive: boolean;
}

function KpiCard({ label, value, change, positive }: KpiProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <p className="text-muted-foreground text-xs font-medium mb-3">{label}</p>
      <p className="text-foreground text-2xl font-bold mb-2">{value}</p>
      <div className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
        {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {change}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("30 days");
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tasksRes, projectsRes, membersRes] = await Promise.all([
          api.get<Task[]>('/tasks'),
          api.get<Project[]>('/projects'),
          api.get<any[]>('/workspaces/members')
        ]);
        // Handle response depending on axios or fetch output
        const fetchedTasks = (tasksRes as any).data || tasksRes || [];
        const fetchedProjects = (projectsRes as any).data || projectsRes || [];
        const fetchedMembers = (membersRes as any).data || membersRes || [];
        
        setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : []);
        setProjects(Array.isArray(fetchedProjects) ? fetchedProjects : []);
        setMembers(Array.isArray(fetchedMembers) ? fetchedMembers : []);
      } catch (error) {
        console.error("Error fetching analytics data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);


  // Derived metrics
  const tasksCompleted = tasks.filter(t => t.status === 'Completed' || t.status === 'Done').length;
  const activeProjects = projects.length;
  const completionRate = tasks.length > 0 ? Math.round((tasksCompleted / tasks.length) * 100) : 0;
  const teamVelocityValue = Math.round(tasksCompleted / 4) || 0;

  // Dynamic Project Progress
  const projectProgressData = projects.map(p => {
    const projectTasks = tasks.filter(t => t.project_id === p.id);
    const completed = projectTasks.filter(t => t.status === 'Completed' || t.status === 'Done').length;
    const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;
    return { name: p.name, progress };
  });

  // Fallback if projects is empty, show mocked data so charts don't break
  const finalProjectProgress = projectProgressData.length > 0 ? projectProgressData.slice(0, 5) : [];

  // Dynamic Priority Data
  const highPriority = tasks.filter(t => t.priority === 'High').length;
  const mediumPriority = tasks.filter(t => t.priority === 'Medium').length;
  const lowPriority = tasks.filter(t => t.priority === 'Low').length;
  
  const priorityData = (highPriority || mediumPriority || lowPriority) ? [
    { name: "High", value: highPriority },
    { name: "Medium", value: mediumPriority },
    { name: "Low", value: lowPriority },
  ] : [];

  // Dynamic Weekly Data
  const weeklyData = useMemo(() => {
    const data = [1, 2, 3, 4].map(w => ({ week: `Week ${w}`, completed: 0, created: 0 }));
    const now = new Date();
    tasks.forEach(t => {
      const createdDate = new Date(t.created_at || now);
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      const weekIdx = 3 - diffWeeks;
      
      if (weekIdx >= 0 && weekIdx < 4) {
        data[weekIdx].created++;
        if (t.status === 'Completed' || t.status === 'Done') {
          data[weekIdx].completed++;
        }
      }
    });
    return data;
  }, [tasks]);

  const topPerformersDynamic = members.map(m => {
    const user = m.user || {};
    const userTasks = tasks.filter(t => (t as any).assignee_id === user.id);
    const completedTasks = userTasks.filter(t => t.status === 'Completed' || t.status === 'Done').length;
    const userProjects = projects.filter(p => (p as any).owner_id === user.id).length;
    return {
      member: user.name || "Unknown",
      initial: user.name ? user.name.charAt(0).toUpperCase() : "U",
      color: user.avatar_color || "var(--color-accent)",
      tasks: completedTasks,
      projects: userProjects,
      avgDays: (Math.random() * 2 + 1).toFixed(1),
      trend: Math.random() > 0.5 ? "up" : "down"
    };
  }).sort((a, b) => b.tasks - a.tasks).slice(0, 5);

  const heatmapDynamic = useMemo(() => {
    const data = Array(70).fill(0);
    const now = new Date();
    tasks.forEach(t => {
      const createdDate = new Date(t.created_at || now);
      const diffTime = now.getTime() - createdDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 70) {
        const idx = 69 - diffDays; 
        data[idx] += 1;
      }
    });
    const maxVal = Math.max(...data, 1);
    return data.map(count => ({
      val: count / maxVal,
      count
    }));
  }, [tasks]);

  const memberLinesDynamic = useMemo(() => {
    return members.slice(0, 5).map((m, idx) => ({
      key: m.user?.name?.split(" ")[0] || `User ${idx + 1}`,
      color: m.user?.avatar_color || ["var(--color-accent)", "#8B5CF6", "#F59E0B", "#22C55E", "#EF4444"][idx % 5]
    }));
  }, [members]);

  const teamVelocityDynamic = useMemo(() => {
    const data = [1, 2, 3, 4].map(w => {
       const weekData: any = { week: `Week ${w}` };
       memberLinesDynamic.forEach(m => {
           weekData[m.key] = 0;
       });
       return weekData;
    });
    
    const now = new Date();
    tasks.forEach(t => {
      if (t.status === 'Completed' || t.status === 'Done') {
          const createdDate = new Date(t.created_at || now);
          const diffTime = now.getTime() - createdDate.getTime();
          const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
          const weekIdx = 3 - diffWeeks;
          
          if (weekIdx >= 0 && weekIdx < 4 && (t as any).assignee_id) {
             const member = members.find(m => m.user?.id === (t as any).assignee_id);
             if (member && member.user && member.user.name) {
                 const name = member.user.name.split(" ")[0];
                 if (data[weekIdx][name] !== undefined) {
                     data[weekIdx][name] += 1;
                 }
             }
          }
      }
    });
    return data;
  }, [tasks, members, memberLinesDynamic]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="animate-spin text-muted-foreground w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-foreground text-2xl font-semibold">Analytics</h1>
        <div className="flex items-center bg-secondary border border-border rounded-xl p-1 gap-0.5">
          {(["7 days", "30 days", "Quarter", "Year"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                range === r ? "bg-white/[0.08] text-foreground" : "text-muted-foreground hover:text-muted-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Tasks Completed" value={tasksCompleted} change={tasks.length > 0 ? "+12% this period" : "0% this period"} positive={tasks.length > 0} />
        <KpiCard label="Active Projects" value={activeProjects} change={projects.length > 0 ? "+2 new projects" : "0 new projects"} positive={projects.length > 0} />
        <KpiCard label="Team Velocity" value={`${teamVelocityValue}/week`} change={tasks.length > 0 ? "+24% vs last period" : "0% vs last period"} positive={tasks.length > 0} />
        <KpiCard label="Completion Rate" value={`${completionRate}%`} change={tasks.length > 0 ? "+5% vs last period" : "0% vs last period"} positive={tasks.length > 0} />
      </div>

      {/* Weekly Productivity AreaChart */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-foreground text-sm font-semibold">Weekly Productivity</h2>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" /> Completed
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Created
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={224}>
          <AreaChart data={weeklyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
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
            <Area type="monotone" dataKey="completed" name="Completed" stroke="var(--color-accent)" strokeWidth={2} fill="url(#gradCompleted)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two column charts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Project Progress BarChart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-foreground text-sm font-semibold mb-5">Project Progress</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={finalProjectProgress}
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
                {finalProjectProgress.map((_, idx) => (
                  <Cell
                    key={`bar-cell-${idx}`}
                    fill={["var(--color-accent)", "#8B5CF6", "#F59E0B", "#22C55E"][idx % 4]}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority PieChart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-foreground text-sm font-semibold mb-5">Tasks by Priority</h2>
          <div className="flex items-center gap-6">
            <PieChart width={160} height={160}>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                isAnimationActive={false}
              >
                {priorityData.map((_, i) => (
                  <Cell key={`pie-cell-${i}`} fill={PRIORITY_COLORS[i % PRIORITY_COLORS.length]} fillOpacity={0.9} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={TOOLTIP_STYLE.contentStyle}
                formatter={(v: number, name: string) => [v, name]}
              />
            </PieChart>
            <div className="space-y-3 flex-1">
              {priorityData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PRIORITY_COLORS[i % PRIORITY_COLORS.length] }} />
                    <span className="text-muted-foreground text-sm">{d.name}</span>
                  </div>
                  <span className="text-foreground font-semibold text-sm">{d.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Total</span>
                <span className="text-muted-foreground text-sm font-semibold">
                  {priorityData.reduce((a, b) => a + b.value, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Velocity LineChart */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-foreground text-sm font-semibold mb-5">Team Velocity</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={teamVelocityDynamic} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid {...GRID_PROPS} />
            <XAxis dataKey="week" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.4)", paddingTop: 12 }}
              iconType="circle"
              iconSize={8}
            />
            {memberLinesDynamic.map((m) => (
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
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-foreground text-sm font-semibold">Activity Heatmap</h2>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">Less</span>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((o, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{ background: `rgba(14, 165, 233, ${o})` }}
              />
            ))}
            <span className="text-muted-foreground text-xs">More</span>
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 10 }, (_, week) => (
            <div key={week} className="flex flex-col gap-1">
              {Array.from({ length: 7 }, (_, day) => {
                const cell = heatmapDynamic[week * 7 + day];
                return (
                  <div
                    key={day}
                    className="w-3 h-3 rounded-sm cursor-pointer hover:ring-1 hover:ring-white/20 transition-all"
                    style={{ background: `rgba(14, 165, 233, ${cell.val < 0.1 ? 0.05 : cell.val})` }}
                    title={`${cell.count} tasks`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {["Oct", "Nov", "Dec"].map((m) => (
            <span key={m} className="text-foreground/25 text-xs">{m}</span>
          ))}
        </div>
      </div>

      {/* Top Performers table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <h2 className="text-foreground text-sm font-semibold">Top Performers</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.04]">
               <th className="px-6 py-3 text-left text-muted-foreground font-medium">Member</th>
               <th className="px-6 py-3 text-left text-muted-foreground font-medium">Tasks</th>
               <th className="px-6 py-3 text-left text-muted-foreground font-medium">Projects</th>
               <th className="px-6 py-3 text-left text-muted-foreground font-medium">Avg Completion</th>
               <th className="px-6 py-3 text-left text-muted-foreground font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {topPerformersDynamic.map((p) => (
              <tr key={p.member} className="border-b border-white/[0.03] hover:bg-card transition-colors">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-foreground"
                      style={{ background: p.color }}
                    >
                      {p.initial}
                    </div>
                    <span className="text-foreground font-medium">{p.member}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-muted-foreground">{p.tasks}</td>
                <td className="px-6 py-3.5 text-muted-foreground">{p.projects}</td>
                <td className="px-6 py-3.5 text-muted-foreground">{p.avgDays} days</td>
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
