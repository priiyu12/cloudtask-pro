import { useState } from "react";
import { Link } from "react-router";
import { Plus, ChevronDown, Calendar } from "lucide-react";

const PRIORITY_COLORS: Record<string, string> = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "rgba(255,255,255,0.3)",
};

const PRIORITY_BG: Record<string, string> = {
  High: "bg-[#EF4444]/10 text-[#EF4444]",
  Medium: "bg-[#F59E0B]/10 text-[#F59E0B]",
  Low: "bg-white/[0.06] text-white/30",
};

interface Task {
  id: string;
  name: string;
  project: string;
  priority: "High" | "Medium" | "Low";
  assignee: { initial: string; color: string };
  due: string;
  duePast?: boolean;
}

const COLUMNS: {
  id: string;
  title: string;
  count: number;
  borderColor: string;
  tasks: Task[];
}[] = [
  {
    id: "todo",
    title: "Todo",
    count: 3,
    borderColor: "rgba(255,255,255,0.2)",
    tasks: [
      { id: "t2", name: "Design new onboarding flow", project: "Frontend Redesign", priority: "Medium", assignee: { initial: "M", color: "#8B5CF6" }, due: "Dec 20" },
      { id: "t3", name: "Write API documentation", project: "API v2 Migration", priority: "Low", assignee: { initial: "A", color: "#F59E0B" }, due: "Dec 22" },
      { id: "t10", name: "Performance optimization", project: "Frontend Redesign", priority: "Medium", assignee: { initial: "M", color: "#8B5CF6" }, due: "Dec 25" },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    count: 3,
    borderColor: "#0EA5E9",
    tasks: [
      { id: "t1", name: "Implement auth refresh tokens", project: "API v2 Migration", priority: "High", assignee: { initial: "S", color: "#0EA5E9" }, due: "Dec 16" },
      { id: "t5", name: "Set up CI/CD pipeline", project: "Backend Refactor", priority: "High", assignee: { initial: "S", color: "#0EA5E9" }, due: "Dec 14", duePast: true },
      { id: "t8", name: "User profile page redesign", project: "Frontend Redesign", priority: "Low", assignee: { initial: "P", color: "#22C55E" }, due: "Dec 18" },
    ],
  },
  {
    id: "review",
    title: "Review",
    count: 2,
    borderColor: "#F59E0B",
    tasks: [
      { id: "t4", name: "Fix mobile navigation bug", project: "Mobile App Launch", priority: "High", assignee: { initial: "P", color: "#22C55E" }, due: "Dec 15" },
      { id: "t9", name: "Analytics event tracking", project: "API v2 Migration", priority: "Medium", assignee: { initial: "S", color: "#0EA5E9" }, due: "Dec 17" },
    ],
  },
  {
    id: "done",
    title: "Done",
    count: 2,
    borderColor: "#22C55E",
    tasks: [
      { id: "t6", name: "Create design system tokens", project: "Design System 2.0", priority: "Medium", assignee: { initial: "M", color: "#8B5CF6" }, due: "Dec 10" },
      { id: "t7", name: "Database migration script", project: "Backend Refactor", priority: "High", assignee: { initial: "A", color: "#F59E0B" }, due: "Dec 9" },
    ],
  },
];

function KanbanCard({ task }: { task: Task }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] rounded-xl p-4 cursor-pointer transition-all group hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {/* Priority badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_BG[task.priority]}`}>
          {task.priority}
        </span>
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
          style={{ background: task.assignee.color }}
        >
          {task.assignee.initial}
        </div>
      </div>

      {/* Task name */}
      <p className="text-white text-sm font-medium leading-snug mb-3 group-hover:text-white transition-colors">
        {task.name}
      </p>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <span className="text-white/30 text-xs bg-white/[0.04] px-2 py-0.5 rounded-md">{task.project}</span>
        <span className={`flex items-center gap-1 text-xs ${task.duePast ? "text-[#EF4444]" : "text-white/30"}`}>
          <Calendar size={10} /> {task.due}
        </span>
      </div>
    </div>
  );
}

export default function KanbanPage() {
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [filterOpen, setFilterOpen] = useState(false);

  const projects = ["All Projects", "API v2 Migration", "Frontend Redesign", "Mobile App Launch", "Backend Refactor", "Design System 2.0"];

  return (
    <div className="p-8 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h1 className="text-white text-2xl font-semibold">Kanban</h1>
        <div className="flex items-center gap-2">
          {/* Project filter */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] text-white/60 text-sm px-3 py-2 rounded-xl hover:bg-white/[0.07] transition-colors"
            >
              {projectFilter} <ChevronDown size={13} />
            </button>
            {filterOpen && (
              <div className="absolute top-full mt-1 right-0 z-50 bg-[#141414] border border-white/[0.08] rounded-xl overflow-hidden min-w-[180px] shadow-xl">
                {projects.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setProjectFilter(p); setFilterOpen(false); }}
                    className={`block w-full text-left px-3 py-2 text-sm hover:bg-white/[0.05] transition-colors ${
                      projectFilter === p ? "text-[#0EA5E9]" : "text-white/70"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link
            to="/app/tasks/create"
            className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Plus size={15} /> New Task
          </Link>
        </div>
      </div>

      {/* Board */}
      <div className="overflow-x-auto flex-1">
        <div className="flex gap-4 h-full min-w-max pb-4">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              className="min-w-[280px] w-[280px] flex flex-col bg-white/[0.015] border border-white/[0.05] rounded-2xl overflow-hidden"
              style={{ borderLeft: `3px solid ${col.borderColor}` }}
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-semibold">{col.title}</span>
                  <span className="bg-white/[0.07] text-white/50 text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center">
                    {col.count}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
                {col.tasks.map((task) => (
                  <KanbanCard key={task.id} task={task} />
                ))}
              </div>

              {/* Add task button */}
              <div className="p-3 border-t border-white/[0.04]">
                <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-white/[0.08] text-white/30 text-sm hover:border-white/[0.15] hover:text-white/50 transition-colors">
                  <Plus size={14} /> Add task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
