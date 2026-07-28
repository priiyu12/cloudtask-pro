import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, Pencil, Trash2, X, ChevronDown, Calendar, User } from "lucide-react";

const TASKS = [
  { id: "t1", name: "Implement auth refresh tokens", project: "API v2 Migration", priority: "High", status: "In Progress", assignee: { name: "Sarah", initial: "S", color: "#0EA5E9" }, due: "Dec 16", duePast: false },
  { id: "t2", name: "Design new onboarding flow", project: "Frontend Redesign", priority: "Medium", status: "Todo", assignee: { name: "Marcus", initial: "M", color: "#8B5CF6" }, due: "Dec 20", duePast: false },
  { id: "t3", name: "Write API documentation", project: "API v2 Migration", priority: "Low", status: "Todo", assignee: { name: "Alex", initial: "A", color: "#F59E0B" }, due: "Dec 22", duePast: false },
  { id: "t4", name: "Fix mobile navigation bug", project: "Mobile App Launch", priority: "High", status: "Review", assignee: { name: "Priya", initial: "P", color: "#22C55E" }, due: "Dec 15", duePast: false },
  { id: "t5", name: "Set up CI/CD pipeline", project: "Backend Refactor", priority: "High", status: "In Progress", assignee: { name: "Sarah", initial: "S", color: "#0EA5E9" }, due: "Dec 14", duePast: true },
  { id: "t6", name: "Create design system tokens", project: "Design System 2.0", priority: "Medium", status: "Done", assignee: { name: "Marcus", initial: "M", color: "#8B5CF6" }, due: "Dec 10", duePast: false },
  { id: "t7", name: "Database migration script", project: "Backend Refactor", priority: "High", status: "Done", assignee: { name: "Alex", initial: "A", color: "#F59E0B" }, due: "Dec 9", duePast: false },
  { id: "t8", name: "User profile page redesign", project: "Frontend Redesign", priority: "Low", status: "In Progress", assignee: { name: "Priya", initial: "P", color: "#22C55E" }, due: "Dec 18", duePast: false },
  { id: "t9", name: "Analytics event tracking", project: "API v2 Migration", priority: "Medium", status: "Review", assignee: { name: "Sarah", initial: "S", color: "#0EA5E9" }, due: "Dec 17", duePast: false },
  { id: "t10", name: "Performance optimization", project: "Frontend Redesign", priority: "Medium", status: "Todo", assignee: { name: "Marcus", initial: "M", color: "#8B5CF6" }, due: "Dec 25", duePast: false },
];

const STATUS_STYLES: Record<string, string> = {
  "In Progress": "bg-[#0EA5E9]/15 text-[#0EA5E9]",
  "Done": "bg-[#22C55E]/15 text-[#22C55E]",
  "Review": "bg-[#F59E0B]/15 text-[#F59E0B]",
  "Todo": "bg-white/[0.08] text-white/50",
};

const PRIORITY_COLORS: Record<string, string> = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "rgba(255,255,255,0.3)",
};

function Select({ label, options }: { label: string; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(label);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] text-white/60 text-sm px-3 py-2 rounded-xl hover:bg-white/[0.07] transition-colors"
      >
        {value} <ChevronDown size={13} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-[#141414] border border-white/[0.08] rounded-xl overflow-hidden min-w-[140px] shadow-xl">
          <button
            onClick={() => { setValue(label); setOpen(false); }}
            className="block w-full text-left px-3 py-2 text-white/50 text-sm hover:bg-white/[0.05] transition-colors"
          >
            {label}
          </button>
          {options.map((o) => (
            <button
              key={o}
              onClick={() => { setValue(o); setOpen(false); }}
              className="block w-full text-left px-3 py-2 text-white/80 text-sm hover:bg-white/[0.05] transition-colors"
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AllTasksPage() {
  const [selectedTask, setSelectedTask] = useState<typeof TASKS[0] | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="p-8 flex gap-6 min-h-0">
      {/* Main content */}
      <div className={`flex-1 min-w-0 transition-all duration-200 ${selectedTask ? "max-w-[calc(100%-340px)]" : ""}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-white text-2xl font-semibold">All Tasks</h1>
            <span className="bg-white/[0.06] text-white/50 text-xs font-medium px-2.5 py-1 rounded-full">
              {TASKS.length}
            </span>
          </div>
          <Link
            to="/app/tasks/create"
            className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Plus size={15} /> New Task
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <Select label="Status" options={["Todo", "In Progress", "Review", "Done"]} />
          <Select label="Priority" options={["High", "Medium", "Low"]} />
          <Select label="Assignee" options={["Sarah", "Marcus", "Alex", "Priya"]} />
          <Select label="Sort: Due Date" options={["Sort: Priority", "Sort: Name", "Sort: Created"]} />
        </div>

        {/* Table */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.05]">
                <th className="w-10 px-4 py-3 text-left" />
                <th className="px-4 py-3 text-left text-white/40 font-medium">Task</th>
                <th className="px-4 py-3 text-left text-white/40 font-medium hidden lg:table-cell">Project</th>
                <th className="px-4 py-3 text-left text-white/40 font-medium hidden md:table-cell">Assignee</th>
                <th className="px-4 py-3 text-left text-white/40 font-medium">Priority</th>
                <th className="px-4 py-3 text-left text-white/40 font-medium">Status</th>
                <th className="px-4 py-3 text-left text-white/40 font-medium hidden md:table-cell">Due</th>
                <th className="w-16 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {TASKS.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => setSelectedTask(task.id === selectedTask?.id ? null : task)}
                  className={`border-b border-white/[0.03] cursor-pointer transition-colors group ${
                    selectedTask?.id === task.id ? "bg-white/[0.04]" : "hover:bg-white/[0.025]"
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleCheck(task.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        checked.has(task.id)
                          ? "bg-[#0EA5E9] border-[#0EA5E9]"
                          : "border-white/[0.2] hover:border-white/40"
                      }`}
                    >
                      {checked.has(task.id) && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </td>
                  {/* Task name */}
                  <td className="px-4 py-3.5">
                    <span className={`font-medium ${checked.has(task.id) ? "line-through text-white/30" : "text-white"}`}>
                      {task.name}
                    </span>
                  </td>
                  {/* Project */}
                  <td className="px-4 py-3.5 text-white/40 hidden lg:table-cell">{task.project}</td>
                  {/* Assignee */}
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ background: task.assignee.color }}
                      >
                        {task.assignee.initial}
                      </div>
                      <span className="text-white/60">{task.assignee.name}</span>
                    </div>
                  </td>
                  {/* Priority */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: PRIORITY_COLORS[task.priority] }}
                      />
                      <span style={{ color: PRIORITY_COLORS[task.priority] }} className="text-xs font-medium">
                        {task.priority}
                      </span>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[task.status]}`}>
                      {task.status}
                    </span>
                  </td>
                  {/* Due */}
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className={`text-xs ${task.duePast ? "text-[#EF4444]" : "text-white/40"}`}>
                      {task.due}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/app/tasks/${task.id}/edit`)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right drawer panel */}
      {selectedTask && (
        <div className="w-80 shrink-0 bg-[#0d0d0d] border-l border-white/[0.05] rounded-2xl p-6 h-fit sticky top-8">
          <div className="flex items-start justify-between mb-5">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[selectedTask.status]}`}>
              {selectedTask.status}
            </span>
            <button
              onClick={() => setSelectedTask(null)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <h2 className="text-white font-semibold text-base mb-4 leading-snug">{selectedTask.name}</h2>

          <div className="space-y-3 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-xs flex items-center gap-1.5"><User size={11} /> Assignee</span>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ background: selectedTask.assignee.color }}
                >
                  {selectedTask.assignee.initial}
                </div>
                <span className="text-white/70 text-xs">{selectedTask.assignee.name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-xs">Project</span>
              <span className="text-white/70 text-xs">{selectedTask.project}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-xs">Priority</span>
              <span className="text-xs font-medium" style={{ color: PRIORITY_COLORS[selectedTask.priority] }}>
                {selectedTask.priority}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-xs flex items-center gap-1.5"><Calendar size={11} /> Due</span>
              <span className={`text-xs ${selectedTask.duePast ? "text-[#EF4444]" : "text-white/70"}`}>
                {selectedTask.due}
              </span>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-white/40 text-xs mb-2">Description</p>
            <p className="text-white/60 text-xs leading-relaxed">
              This task involves completing the implementation and ensuring all acceptance criteria are met. Review with the team before marking as complete.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/app/tasks/${selectedTask.id}/edit`}
              className="flex-1 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white text-xs font-semibold px-3 py-2 rounded-xl text-center transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => setSelectedTask(null)}
              className="flex-1 bg-white/[0.05] border border-white/[0.07] hover:bg-white/[0.08] text-white/70 text-xs font-medium px-3 py-2 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
