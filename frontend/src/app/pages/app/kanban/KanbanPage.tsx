import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Calendar, ChevronDown, Plus } from "lucide-react";
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
};

const COLUMNS = [
  { title: "Todo", borderColor: "rgba(255,255,255,0.2)" },
  { title: "In Progress", bordercolor: "var(--color-accent)" },
  { title: "Review", borderColor: "#F59E0B" },
  { title: "Completed", borderColor: "#22C55E" },
];

const statusAliases: Record<string, string> = {
  Done: "Completed",
};

function normalizeStatus(status: string) {
  return statusAliases[status] ?? status;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function KanbanCard({ task, projectName, onDragStart }: { task: Task; projectName: string; onDragStart: (id: number) => void }) {
  return (
    <Link
      draggable
      onDragStart={() => onDragStart(task.id)}
      to={`/app/tasks/${task.id}`}
      className="block bg-white/[0.03] border border-border hover:border-white/[0.12] rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all group hover:shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-foreground/45">
          {normalizeStatus(task.status)}
        </span>
        <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-foreground">
          {initials(projectName)}
        </div>
      </div>

      <p className="text-foreground text-sm font-medium leading-snug mb-3 group-hover:text-foreground transition-colors">
        {task.title}
      </p>

      {task.description && <p className="text-foreground/35 text-xs leading-relaxed mb-3 line-clamp-2">{task.description}</p>}

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs bg-secondary px-2 py-0.5 rounded-md">{projectName}</span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar size={10} /> {new Date(task.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </span>
      </div>
    </Link>
  );
}

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [filterOpen, setFilterOpen] = useState(false);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void Promise.all([
      api.get<Task[]>("/tasks").catch(() => []),
      api.get<Project[]>("/projects").catch(() => []),
    ]).then(([taskData, projectData]) => {
      setTasks(taskData);
      setProjects(projectData);
      setLoading(false);
    });
  }, []);

  const projectMap = useMemo(() => new Map(projects.map((project) => [project.id, project.name])), [projects]);
  const projectOptions = useMemo(() => ["All Projects", ...projects.map((project) => project.name)], [projects]);

  const filteredTasks = useMemo(() => {
    if (projectFilter === "All Projects") return tasks;
    return tasks.filter((task) => projectMap.get(task.project_id) === projectFilter);
  }, [projectFilter, projectMap, tasks]);

  const moveTask = async (status: string) => {
    if (!draggingId) return;
    const current = tasks.find((task) => task.id === draggingId);
    if (!current) return;

    setTasks((items) => items.map((task) => (task.id === draggingId ? { ...task, status } : task)));
    setDraggingId(null);

    try {
      await api.put(`/tasks/${draggingId}`, {
        title: current.title,
        description: current.description,
        status,
      });
    } catch {
      setTasks((items) => items.map((task) => (task.id === current.id ? current : task)));
    }
  };

  return (
    <div className="p-8 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.24em]">Drag and Drop</p>
          <h1 className="text-foreground text-2xl font-semibold mt-1">Kanban Board</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 bg-secondary border border-border text-muted-foreground text-sm px-3 py-2 rounded-xl hover:bg-white/[0.07] transition-colors"
            >
              {projectFilter} <ChevronDown size={13} />
            </button>
            {filterOpen && (
              <div className="absolute top-full mt-1 right-0 z-50 bg-[#141414] border border-border rounded-xl overflow-hidden min-w-[180px] shadow-xl">
                {projectOptions.map((project) => (
                  <button
                    key={project}
                    onClick={() => {
                      setProjectFilter(project);
                      setFilterOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors ${
                      projectFilter === project ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    {project}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link to="/app/tasks/create" className="flex items-center gap-2 bg-accent hover:bg-[#0284C7] text-foreground font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
            <Plus size={15} /> New Task
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden h-full">
          {COLUMNS.map((column) => (
            <div key={column.title} className="min-w-[280px] w-[280px] flex flex-col bg-white/[0.015] border border-white/[0.05] rounded-2xl overflow-hidden" style={{ borderLeft: `3px solid ${column.borderColor}` }}>
              <div className="px-4 py-3.5 border-b border-white/[0.05] flex items-center justify-between">
                <span className="text-foreground text-sm font-semibold">{column.title}</span>
              </div>
              <div className="p-3 space-y-2.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-card border border-white/[0.05] rounded-xl p-4 animate-pulse">
                    <div className="h-4 bg-secondary rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-secondary rounded w-full mb-2"></div>
                    <div className="h-4 bg-secondary rounded w-2/3 mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-secondary rounded w-1/4"></div>
                      <div className="h-3 bg-secondary rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="rounded-2xl border border-dashed border-border bg-card p-16 flex flex-col items-center justify-center text-center max-w-md">
            <svg className="w-24 h-24 text-foreground/10 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <line x1="15" y1="3" x2="15" y2="21"></line>
            </svg>
            <h3 className="text-foreground font-medium mb-1">Board is empty</h3>
            <p className="text-muted-foreground text-sm mb-6">There are no tasks available in this project to display on the Kanban board.</p>
            <Link to="/app/tasks/create" className="bg-accent hover:bg-[#0284C7] text-foreground px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              Create First Task
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto flex-1">
          <div className="flex gap-4 h-full min-w-max pb-4">
            {COLUMNS.map((column) => {
              const columnTasks = filteredTasks.filter((task) => normalizeStatus(task.status) === column.title);
              return (
                <div
                  key={column.title}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => void moveTask(column.title)}
                  className="min-w-[280px] w-[280px] flex flex-col bg-white/[0.015] border border-white/[0.05] rounded-2xl overflow-hidden"
                  style={{ borderLeft: `3px solid ${column.borderColor}` }}
                >
                  <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-sm font-semibold">{column.title}</span>
                      <span className="bg-white/[0.07] text-muted-foreground text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center">
                        {columnTasks.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
                    {columnTasks.length === 0 ? (
                      <div className="h-32 rounded-xl border border-dashed border-border flex items-center justify-center text-foreground/25 text-sm">
                        Drop tasks here
                      </div>
                    ) : (
                      columnTasks.map((task) => (
                        <KanbanCard
                          key={task.id}
                          task={task}
                          projectName={projectMap.get(task.project_id) ?? "Project"}
                          onDragStart={setDraggingId}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
