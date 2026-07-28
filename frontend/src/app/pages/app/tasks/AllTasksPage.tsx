import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  User,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { api } from "../../../lib/api";

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  project_id: number;
  created_at: string;
};
type Project = {
  id: number;
  name: string;
  description: string | null;
  owner_id: number;
  created_at: string;
};

const STATUSES = ["All", "Todo", "In Progress", "Review", "Done", "Completed"];

const STATUS_COLORS: Record<string, string> = {
  "In Progress": "bg-accent/15 text-accent",
  Done: "bg-[#22C55E]/15 text-[#22C55E]",
  Review: "bg-[#F59E0B]/15 text-[#F59E0B]",
  Todo: "bg-white/[0.08] text-muted-foreground",
  Completed: "bg-[#22C55E]/15 text-[#22C55E]",
};

const PRIORITIES = ["High", "Medium", "Low"];

const PRIORITY_COLORS: Record<string, string> = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "rgba(255,255,255,0.3)",
};

function getPriorityDot(priority: string) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
      style={{ backgroundColor: PRIORITY_COLORS[priority] ?? "#fff" }}
    />
  );
}

export default function AllTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Task[]>("/tasks").catch(() => []),
      api.get<Project[]>("/projects").catch(() => []),
      api.get<any[]>("/workspaces/members").catch(() => []),
    ]).then(([taskData, projectData, membersData]) => {
      setTasks(taskData);
      setProjects(projectData);
      setMembers(membersData);
    }).finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      tasks.filter((task) => {
        const matchSearch =
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          (task.description ?? "").toLowerCase().includes(search.toLowerCase());
        const matchStatus =
          statusFilter === "All" || task.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [tasks, search, statusFilter],
  );

  const projectName = (id: number) =>
    projects.find((p) => p.id === id)?.name ?? `Project #${id}`;

  const toggleCheck = (id: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = async (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this task?")) return;
    await api.del(`/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTask?.id === taskId) setSelectedTask(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-background min-h-full text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-[clamp(1.6rem,2.4vw,2.2rem)] font-semibold tracking-[-0.04em] text-foreground">
            All Tasks
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-white/[0.07] text-muted-foreground text-xs font-medium">
            {tasks.length}
          </span>
        </div>
        <Link
          to="/app/tasks/create"
          className="inline-flex items-center gap-2 bg-accent hover:bg-[#0284C7] text-foreground rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          <Plus size={15} />
          New Task
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2.5 rounded-xl border border-border bg-white/[0.03] px-4 py-2.5">
            <Search size={15} className="text-muted-foreground shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-transparent outline-none text-foreground text-sm placeholder:text-foreground/25"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-xl border border-border bg-white/[0.03] pl-4 pr-9 py-2.5 text-muted-foreground text-sm outline-none focus:border-accent/50 transition-colors cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s} className="bg-card">
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select className="appearance-none rounded-xl border border-border bg-white/[0.03] pl-4 pr-9 py-2.5 text-muted-foreground text-sm outline-none focus:border-accent/50 transition-colors cursor-pointer">
              <option className="bg-card">All Priority</option>
              <option className="bg-card">High</option>
              <option className="bg-card">Medium</option>
              <option className="bg-card">Low</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>

          {/* Sort */}
          <button className="flex items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-4 py-2.5 text-muted-foreground text-sm hover:bg-white/[0.06] transition-colors">
            <ChevronDown size={14} />
            Sort
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-5 h-5 bg-secondary rounded-full shrink-0" />
              <div className="h-4 bg-secondary rounded w-1/3" />
              <div className="h-4 bg-secondary rounded w-24 ml-auto" />
              <div className="h-6 bg-secondary rounded-full w-20" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-16 flex flex-col items-center justify-center text-center">
          <svg className="w-24 h-24 text-foreground/10 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <h3 className="text-foreground font-medium mb-1">No tasks found</h3>
          <p className="text-muted-foreground text-sm max-w-xs">We couldn't find any tasks matching your search or filters.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.05]">
                <th className="w-10 px-4 py-3" />
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">
                  Task
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">
                  Project
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">
                  Assignee
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">
                  Priority
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">
                  Due
                </th>
                <th className="w-16 px-4 py-3 text-muted-foreground text-xs font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task, idx) => {
                let assignee = "Unassigned";
                let assigneeColor = "rgba(255,255,255,0.1)";
                const member = members.find((m: any) => m.user?.id === (task as any).assignee_id);
                if (member) {
                   assignee = member.user?.full_name || member.user?.name || member.user?.email || "Unknown";
                   assigneeColor = member.user?.avatar_color || "var(--color-accent)";
                }
                const priority = task.priority || "Medium";
                const due = (task as any).deadline ? new Date((task as any).deadline).toLocaleDateString() : "No date";
                const isOverdue = (task as any).deadline ? new Date((task as any).deadline) < new Date() : false;
                const isChecked = checkedIds.has(task.id);
                const isSelected = selectedTask?.id === task.id;
                return (
                  <tr
                    key={task.id}
                    onClick={() =>
                      setSelectedTask(isSelected ? null : task)
                    }
                    className={`border-b border-white/[0.04] last:border-0 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-secondary"
                        : "hover:bg-white/[0.025]"
                    }`}
                  >
                    {/* Checkbox */}
                    <td
                      className="px-4 py-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCheck(task.id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="w-4 h-4 rounded accent-[#0EA5E9] bg-white/[0.06] border-border cursor-pointer"
                      />
                    </td>

                    {/* Task Name */}
                    <td className="px-4 py-3 max-w-[220px]">
                      <span
                        className={`font-semibold text-sm truncate block ${
                          isChecked
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {task.title}
                      </span>
                    </td>

                    {/* Project */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground truncate block max-w-[120px]">
                        {projectName(task.project_id)}
                      </span>
                    </td>

                    {/* Assignee */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-foreground shrink-0"
                          style={{ backgroundColor: assigneeColor }}
                        >
                          {assignee[0]}
                        </span>
                        <span className="text-xs text-foreground/55 truncate">
                          {assignee}
                        </span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-medium flex items-center"
                        style={{
                          color: PRIORITY_COLORS[priority] ?? "white",
                        }}
                      >
                        {getPriorityDot(priority)}
                        {priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          STATUS_COLORS[task.status] ??
                          "bg-white/[0.08] text-muted-foreground"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>

                    {/* Due */}
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium ${
                          isOverdue ? "text-[#EF4444]" : "text-muted-foreground"
                        }`}
                      >
                        {due}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity [tr:hover_&]:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/app/tasks/${task.id}/edit`);
                          }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(task.id, e)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Right Slide-in Drawer */}
      {selectedTask && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setSelectedTask(null)}
          />
          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-80 bg-card border-l border-border z-40 flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  STATUS_COLORS[selectedTask.status] ??
                  "bg-white/[0.08] text-muted-foreground"
                }`}
              >
                {selectedTask.status}
              </span>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.07] transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              <h2 className="text-foreground text-lg font-semibold leading-snug">
                {selectedTask.title}
              </h2>

              {/* Metadata */}
              <div className="space-y-3">
                {(() => {
                  const member = members.find((m: any) => m.user?.id === (selectedTask as any).assignee_id);
                  const assignee = member?.user?.full_name || member?.user?.name || member?.user?.email || "Unassigned";
                  const assigneeColor = member?.user?.avatar_color || "var(--color-accent)";
                  const priority = selectedTask.priority || "Medium";
                  const due = selectedTask.due_date ? new Date(selectedTask.due_date).toLocaleDateString() : "No due date";
                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <User size={14} className="text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground text-xs w-20 shrink-0">
                          Assignee
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-foreground"
                            style={{ backgroundColor: assigneeColor }}
                          >
                            {assignee[0]}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {assignee}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 shrink-0 text-muted-foreground flex items-center justify-center">
                          #
                        </span>
                        <span className="text-muted-foreground text-xs w-20 shrink-0">
                          Project
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {projectName(selectedTask.project_id)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3.5 h-3.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              PRIORITY_COLORS[priority] ?? "#fff",
                          }}
                        />
                        <span className="text-muted-foreground text-xs w-20 shrink-0">
                          Priority
                        </span>
                        <span
                          className="text-xs font-medium"
                          style={{ color: PRIORITY_COLORS[priority] ?? "#fff" }}
                        >
                          {priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar
                          size={14}
                          className="text-muted-foreground shrink-0"
                        />
                        <span className="text-muted-foreground text-xs w-20 shrink-0">
                          Due
                        </span>
                        <span className="text-muted-foreground text-xs">{due}</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Description */}
              <div>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                  Description
                </p>
                <p className="text-foreground/55 text-sm leading-relaxed">
                  {selectedTask.description ?? "No description provided."}
                </p>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-5 py-4 border-t border-border flex gap-2">
              <Link
                to={`/app/tasks/${selectedTask.id}/edit`}
                className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-[#0284C7] text-foreground text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                <Pencil size={13} />
                Edit
              </Link>
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2.5 rounded-xl border border-border text-muted-foreground text-sm hover:bg-secondary transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
