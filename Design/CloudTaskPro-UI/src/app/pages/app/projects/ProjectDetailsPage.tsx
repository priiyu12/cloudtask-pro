import { useState } from "react";
import { Link, useParams } from "react-router";

type Tab = "Overview" | "Tasks" | "Members" | "Activity" | "Files" | "Settings";

const project = {
  id: "p1",
  name: "Frontend Redesign",
  description:
    "Complete UI overhaul for the main product. This includes redesigning every screen from the ground up, building a new component library with design tokens, implementing dark mode, and improving accessibility to WCAG AA standard.",
  status: "In Progress",
  progress: 85,
  color: "#0EA5E9",
  created: "Nov 1, 2024",
  deadline: "Dec 28, 2024",
  priority: "High",
};

const members = [
  { label: "S", color: "#0EA5E9", name: "Sarah Chen", role: "Lead Designer", email: "sarah@company.com" },
  { label: "M", color: "#8B5CF6", name: "Marcus Webb", role: "Product Manager", email: "marcus@company.com" },
  { label: "P", color: "#22C55E", name: "Priya Sharma", role: "Frontend Engineer", email: "priya@company.com" },
];

const tasks = [
  { id: 1, name: "Redesign navigation sidebar", assignee: { label: "S", color: "#0EA5E9" }, priority: "High", status: "Done", done: true },
  { id: 2, name: "Build new button component variants", assignee: { label: "M", color: "#8B5CF6" }, priority: "Medium", status: "In Progress", done: false },
  { id: 3, name: "Update color token system", assignee: { label: "P", color: "#22C55E" }, priority: "High", status: "In Progress", done: false },
  { id: 4, name: "Design empty state illustrations", assignee: { label: "S", color: "#0EA5E9" }, priority: "Low", status: "Todo", done: false },
  { id: 5, name: "Auth flow redesign", assignee: { label: "P", color: "#22C55E" }, priority: "High", status: "Review", done: false },
];

const activityItems = [
  { user: { label: "S", color: "#0EA5E9" }, name: "Sarah Chen", action: "completed", item: "Auth flow redesign", time: "2m ago" },
  { user: { label: "M", color: "#8B5CF6" }, name: "Marcus Webb", action: "commented on", item: "Button variants", time: "1h ago" },
  { user: { label: "P", color: "#22C55E" }, name: "Priya Sharma", action: "opened PR for", item: "Color token system", time: "3h ago" },
  { user: { label: "S", color: "#0EA5E9" }, name: "Sarah Chen", action: "uploaded", item: "design-v3.fig", time: "Yesterday" },
  { user: { label: "M", color: "#8B5CF6" }, name: "Marcus Webb", action: "updated deadline for", item: "Frontend Redesign", time: "2d ago" },
];

const files = [
  { name: "design-v3.fig", size: "4.2 MB", type: "Figma", updated: "Dec 14", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { name: "component-specs.pdf", size: "1.1 MB", type: "PDF", updated: "Dec 12", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { name: "meeting-notes.md", size: "12 KB", type: "Markdown", updated: "Dec 10", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { name: "screen-recordings.zip", size: "38 MB", type: "Archive", updated: "Dec 8", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
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

function PriorityDot({ priority }: { priority: string }) {
  const colors: Record<string, string> = { High: "#EF4444", Medium: "#F59E0B", Low: "#22C55E" };
  return <span className="w-2 h-2 rounded-full inline-block" style={{ background: colors[priority] ?? "#fff" }} />;
}

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [checkedTasks, setCheckedTasks] = useState<Set<number>>(new Set([1]));

  const tabs: Tab[] = ["Overview", "Tasks", "Members", "Activity", "Files", "Settings"];

  const toggleTask = (taskId: number) => {
    setCheckedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <Link to="/app/projects" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-4 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Projects
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full" style={{ background: project.color }} />
            <h1 className="text-2xl font-semibold text-white">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-sm">{project.progress}% complete</span>
            <Link
              to={`/app/projects/${id ?? "p1"}/edit`}
              className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors border border-white/[0.08]"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mt-4">
          <div className="h-full rounded-full transition-all" style={{ width: `${project.progress}%`, background: project.color }} />
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 border-b border-white/[0.06] -mb-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === t
                ? "border-[#0EA5E9] text-[#0EA5E9]"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-3 gap-5 pt-2">
          <div className="col-span-2 space-y-5">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Description</h3>
              <p className="text-white/70 text-sm leading-relaxed">{project.description}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Created", value: project.created },
                  { label: "Deadline", value: project.deadline },
                  { label: "Priority", value: project.priority },
                  { label: "Status", value: project.status },
                ].map((d) => (
                  <div key={d.label}>
                    <p className="text-white/30 text-xs mb-1">{d.label}</p>
                    <p className="text-white text-sm">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {activityItems.slice(0, 3).map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: a.user.color }}>
                      {a.user.label}
                    </span>
                    <p className="text-white/60 text-sm flex-1">
                      <span className="text-white font-medium">{a.name}</span> {a.action} <span className="text-white/80 italic">"{a.item}"</span>
                    </p>
                    <span className="text-white/30 text-xs">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: "Tasks Done", value: "12/15", color: "#22C55E" },
              { label: "Days Left", value: "14", color: "#F59E0B" },
              { label: "Files", value: "4", color: "#0EA5E9" },
            ].map((s) => (
              <div key={s.label} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
                <p className="text-white/40 text-xs mb-1">{s.label}</p>
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
              <h3 className="text-white/40 text-xs mb-3">Team</h3>
              <div className="space-y-2.5">
                {members.map((m) => (
                  <div key={m.name} className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: m.color }}>
                      {m.label}
                    </span>
                    <div>
                      <p className="text-white text-xs">{m.name}</p>
                      <p className="text-white/30 text-xs">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks */}
      {activeTab === "Tasks" && (
        <div className="pt-2 bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-white/40 text-sm">5 tasks</span>
            <button className="text-[#0EA5E9] text-sm hover:underline">+ Add task</button>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <input
                  type="checkbox"
                  checked={checkedTasks.has(t.id)}
                  onChange={() => toggleTask(t.id)}
                  className="w-4 h-4 rounded accent-[#0EA5E9] flex-shrink-0"
                />
                <span className={`flex-1 text-sm ${checkedTasks.has(t.id) ? "line-through text-white/30" : "text-white"}`}>{t.name}</span>
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: t.assignee.color }}
                >
                  {t.assignee.label}
                </span>
                <div className="flex items-center gap-1.5">
                  <PriorityDot priority={t.priority} />
                  <span className="text-white/40 text-xs">{t.priority}</span>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members */}
      {activeTab === "Members" && (
        <div className="pt-2 grid grid-cols-3 gap-4">
          {members.map((m) => (
            <div key={m.name} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 text-center">
              <span
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-3"
                style={{ background: m.color }}
              >
                {m.label}
              </span>
              <p className="text-white font-medium">{m.name}</p>
              <p className="text-white/40 text-sm mt-0.5">{m.role}</p>
              <p className="text-white/30 text-xs mt-1">{m.email}</p>
            </div>
          ))}
        </div>
      )}

      {/* Activity */}
      {activeTab === "Activity" && (
        <div className="pt-2 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-4">
          {activityItems.map((a, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: a.user.color }}>
                {a.user.label}
              </span>
              <p className="text-white/60 text-sm flex-1">
                <span className="text-white font-medium">{a.name}</span> {a.action}{" "}
                <span className="text-white/80 italic">"{a.item}"</span>
              </p>
              <span className="text-white/30 text-xs">{a.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Files */}
      {activeTab === "Files" && (
        <div className="pt-2 space-y-3">
          {files.map((f) => (
            <div key={f.name} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-4 hover:border-white/[0.1] transition-colors">
              <div className="w-10 h-10 bg-white/[0.06] rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{f.name}</p>
                <p className="text-white/30 text-xs">{f.type} · {f.size} · Updated {f.updated}</p>
              </div>
              <button className="p-2 text-white/30 hover:text-white/70 hover:bg-white/[0.06] rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      {activeTab === "Settings" && (
        <div className="pt-2 max-w-lg space-y-4">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-4">
            <h3 className="text-white text-sm font-medium">Project Settings</h3>
            <div>
              <label className="block text-white/40 text-xs mb-1.5">Visibility</label>
              <select className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm outline-none appearance-none">
                <option className="bg-[#141414]">Team only</option>
                <option className="bg-[#141414]">Public</option>
              </select>
            </div>
            <div>
              <label className="block text-white/40 text-xs mb-1.5">Notifications</label>
              <select className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm outline-none appearance-none">
                <option className="bg-[#141414]">All activity</option>
                <option className="bg-[#141414]">Mentions only</option>
                <option className="bg-[#141414]">Off</option>
              </select>
            </div>
          </div>
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-2xl p-5">
            <h3 className="text-[#EF4444] text-sm font-medium mb-2">Danger Zone</h3>
            <p className="text-white/40 text-xs mb-3">Permanently delete this project and all its data.</p>
            <button className="bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] text-sm font-medium px-4 py-2 rounded-xl transition-colors">
              Delete Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
