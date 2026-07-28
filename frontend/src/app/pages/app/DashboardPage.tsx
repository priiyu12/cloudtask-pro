import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api, type CurrentUser } from "../../lib/api";

type Project = { id: number; name: string; description: string | null; owner_id: number; created_at: string };
type Task = { id: number; title: string; description: string | null; status: string; project_id: number; created_at: string };


export default function DashboardPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [memberCount, setMemberCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.me().catch(() => null),
      api.get<Project[]>("/projects").catch(() => []),
      api.get<Task[]>("/tasks").catch(() => []),
      api.get<unknown[]>("/workspaces/members").catch(() => [])
    ]).then(([userData, projectData, taskData, membersData]) => {
      setUser(userData);
      setProjects(projectData);
      setTasks(taskData);
      setMemberCount(membersData.length);
    }).finally(() => setIsLoading(false));
  }, []);

  const counts = useMemo(() => {
    const done = tasks.filter((t) => t.status === "Done" || t.status === "Completed").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const review = tasks.filter((t) => t.status === "Review").length;
    const todo = tasks.filter((t) => t.status === "Todo").length;
    return { done, inProgress, review, todo, total: tasks.length };
  }, [tasks]);

  const recentProjects = useMemo(() => {
    const projectTasks = projects.map((project, index) => {
      const related = tasks.filter((task) => task.project_id === project.id);
      const open = related.filter((task) => task.status !== "Done" && task.status !== "Completed").length;
      const progress = related.length ? Math.round(((related.length - open) / related.length) * 100) : 0;
      const status = related.length === 0 ? "Planning" : (progress === 100 ? "Done" : "In Progress");
      return {
        id: project.id,
        name: project.name,
        progress,
        status,
        due: `Created ${new Date(project.created_at).toLocaleDateString()}`,
      };
    });
    return projectTasks.sort((a, b) => b.id - a.id).slice(0, 3);
  }, [projects, tasks]);

  const recentTasks = useMemo(
    () => [...tasks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5),
    [tasks],
  );

  const projectHealth = useMemo(() => {
    const colors = ["var(--color-accent)", "#8B5CF6", "#F59E0B", "#22C55E"];
    return recentProjects.map((p, i) => ({
      label: p.name,
      value: p.progress,
      color: colors[i % colors.length]
    }));
  }, [recentProjects]);

  const currentMix = [
    { label: "Todo", value: counts.todo },
    { label: "In Progress", value: counts.inProgress },
    { label: "Review", value: counts.review },
    { label: "Done", value: counts.done },
  ];

  const weekly = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      result.push({ day: days[d.getDay()], tasks: 0 });
    }
    
    tasks.forEach(task => {
      const taskDate = new Date(task.created_at);
      const diffTime = today.getTime() - taskDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 7 && diffDays > 0) {
        const idx = result.findIndex(r => r.day === days[taskDate.getDay()]);
        if (idx !== -1) result[idx].tasks += 1;
      } else if (diffDays === 0) {
        // Today
        result[6].tasks += 1;
      }
    });
    return result;
  }, [tasks]);

  const upcomingDeadlines = useMemo(() => {
    return recentTasks.filter(t => t.status !== "Done").map((t, i) => {
      const tones = ["bg-[#EF4444]/20 text-[#EF4444]", "bg-[#F59E0B]/20 text-[#F59E0B]", "bg-[#22C55E]/20 text-[#22C55E]"];
      return {
        title: t.title,
        due: `Task in ${t.status}`,
        tag: `T-${t.id}`,
        tone: tones[i % tones.length]
      };
    }).slice(0, 3);
  }, [recentTasks]);

  const recentActivity = useMemo(() => {
    const activity = [];
    const recentTsks = [...tasks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);
    for (const t of recentTsks) {
      activity.push({
        id: `t-${t.id}`,
        action: `Created task "${t.title}"`,
        time: new Date(t.created_at).toLocaleDateString()
      });
    }
    const recentPrjs = [...projects].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 2);
    for (const p of recentPrjs) {
      activity.push({
        id: `p-${p.id}`,
        action: `Created project "${p.name}"`,
        time: new Date(p.created_at).toLocaleDateString()
      });
    }
    return activity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);
  }, [tasks, projects]);

  const avatar = (user?.name?.[0] ?? "M").toUpperCase();

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-background min-h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-foreground font-semibold shadow-[0_0_16px_rgba(14,165,233,0.28)] bg-accent"
            style={{ backgroundColor: user?.avatar_color ?? "var(--color-accent)" }}
          >
            {isLoading ? "" : avatar}
          </div>
          <div>
            <h1 className="text-[clamp(2rem,2.8vw,3rem)] leading-none font-semibold tracking-[-0.05em] text-foreground">
              {isLoading ? "Loading..." : `Good morning, ${user?.name?.split(" ")[0] ?? "Marcus"} 👋`}
            </h1>
            <p className="text-muted-foreground mt-2">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          </div>
        </div>
        <Link to="/app/projects" className="bg-accent text-foreground rounded-full px-5 py-3 text-sm font-semibold hover:bg-[#0284C7] transition-colors">
          + New Project
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-2xl border border-white/10 bg-card p-5 animate-pulse">
                <div className="h-4 bg-secondary rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-secondary rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-secondary rounded w-1/4"></div>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-4">
            <div className="rounded-2xl border border-white/10 bg-card h-[320px] animate-pulse"></div>
            <div className="rounded-2xl border border-white/10 bg-card h-[320px] animate-pulse"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Tasks", value: counts.total, sub: "" },
          { label: "Projects", value: projects.length, sub: "" },
          { label: "Members", value: memberCount, sub: "" },
          { label: "Completed", value: counts.done, sub: "this month" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-foreground">
            <p className="text-muted-foreground text-sm">{card.label}</p>
            <div className="mt-3 text-[2rem] leading-none font-semibold">{card.value}</div>
            <p className="mt-2 text-xs text-foreground/45">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-4">
        <div className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-foreground">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground">Weekly Productivity</h2>
            <span className="text-xs text-muted-foreground">Live summary</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#202020" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#8b8b8b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8b8b8b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#fff" }} />
              <Area type="monotone" dataKey="tasks" stroke="var(--color-accent)" strokeWidth={2} fill="var(--color-accent)" fillOpacity={0.12} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-foreground">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground">Project Health</h2>
            <span className="text-xs text-muted-foreground">Live progress</span>
          </div>
          <div className="space-y-4">
            {projectHealth.length > 0 ? projectHealth.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                </div>
              </div>
            )) : <p className="text-sm text-muted-foreground">No projects yet</p>}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr_0.9fr] gap-4">
        <div className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-foreground">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground">Recent Projects</h2>
            <Link to="/app/projects" className="text-xs text-accent">View all</Link>
          </div>
          <div className="space-y-5">
            {recentProjects.length > 0 ? recentProjects.map((project, index) => (
              <div key={project.id} className={index < recentProjects.length - 1 ? "pb-4 border-b border-white/[0.05]" : ""}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${["bg-accent", "bg-[#8B5CF6]", "bg-[#F59E0B]"][index % 3]}`} />
                    <p className="text-sm text-foreground/85">{project.name}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.06] text-muted-foreground">{project.status}</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${["bg-accent", "bg-[#8B5CF6]", "bg-[#F59E0B]"][index % 3]}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-foreground/35">
                  <span>{project.due}</span>
                  <span>{project.progress}%</span>
                </div>
              </div>
            )) : <p className="text-sm text-muted-foreground">No recent projects</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-foreground">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground">Recent Tasks</h2>
            <Link to="/app/tasks" className="text-xs text-accent">View all</Link>
          </div>
          <div className="space-y-4">
            {recentTasks.length > 0 ? recentTasks.map((task, index) => (
              <div key={task.id} className={index < recentTasks.length - 1 ? "pb-4 border-b border-white/[0.05]" : ""}>
                <div className="flex items-start gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full mt-2 ${["bg-accent", "bg-[#EF4444]", "bg-[#F59E0B]", "bg-[#22C55E]"][index % 4]}`} />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground/85">{task.title}</p>
                    <p className="text-xs text-foreground/35 mt-1">{task.description}</p>
                    <p className="text-[11px] text-foreground/25 mt-1">{task.status}</p>
                  </div>
                </div>
              </div>
            )) : <p className="text-sm text-muted-foreground">No recent tasks</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-foreground">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground">Upcoming Deadlines</h2>
            <span className="text-xs text-muted-foreground">Priority</span>
          </div>
          <div className="space-y-4">
            {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((item) => (
              <div key={item.title} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/85">{item.title}</p>
                  <p className="text-xs text-foreground/35 mt-1">{item.due}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.tone}`}>{item.tag}</span>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_.9fr] gap-4">
        <div className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-foreground">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground">Recent Activity</h2>
            <span className="text-xs text-muted-foreground">Workspace timeline</span>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((item, index) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1.5 ${["bg-accent", "bg-[#F59E0B]", "bg-[#8B5CF6]", "bg-[#EF4444]", "bg-[#22C55E]"][index % 5]}`} />
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/80 leading-6">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-foreground">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground">Task States</h2>
            <span className="text-xs text-muted-foreground">Live mix</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={currentMix} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#202020" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#8b8b8b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="label" type="category" tick={{ fill: "#b8b8b8", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#fff" }} />
              <Bar dataKey="value" fill="var(--color-accent)" radius={[0, 8, 8, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
