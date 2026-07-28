import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { api } from "../../../lib/api";

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  project_id: number;
};
type Project = { id: number; name: string };

const STATUSES = ["Todo", "In Progress", "Review", "Completed"];

export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Todo");
  const [projectId, setProjectId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [taskLoaded, setTaskLoaded] = useState(false);

  useEffect(() => {
    if (!id) return;
    void Promise.all([
      api.get<Task>(`/tasks/${id}`),
      api.get<Project[]>("/projects"),
    ])
      .then(([task, projectData]) => {
        setTitle(task.title);
        setDescription(task.description ?? "");
        setStatus(task.status);
        setProjectId(task.project_id);
        setProjects(projectData);
        setTaskLoaded(true);
      })
      .catch(() => setError("Task not found."));
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!id) return;
    setError("");
    setLoading(true);

    try {
      await api.put(`/tasks/${id}`, { title, description, status });
      navigate(`/app/tasks/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update task.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await api.del(`/tasks/${id}`);
    navigate("/app/tasks");
  };

  const currentProject = projects.find((p) => p.id === projectId);

  return (
    <div className="p-6 lg:p-8 bg-background min-h-full text-foreground">
      <Link
        to={id ? `/app/tasks/${id}` : "/app/tasks"}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Task
      </Link>

      <div className="max-w-3xl mx-auto space-y-5">
        {/* Main Edit Card */}
        <div className="rounded-3xl border border-border bg-white/[0.03] p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
                <Pencil size={15} className="text-accent" />
              </div>
              <div>
                <p className="text-accent text-[10px] font-semibold uppercase tracking-[0.24em]">
                  Editing
                </p>
                <h1 className="text-foreground text-xl font-semibold tracking-[-0.02em]">
                  Edit Task
                </h1>
              </div>
            </div>
            <span className="text-foreground/20 text-xs font-mono bg-secondary px-2.5 py-1 rounded-lg">
              #{id}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-muted-foreground text-xs font-medium mb-2 uppercase tracking-wider">
                Task Name
              </label>
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Task title..."
                className="w-full bg-transparent text-foreground text-xl font-medium placeholder:text-foreground/20 border-b border-border pb-3 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-muted-foreground text-xs font-medium mb-2 uppercase tracking-wider">
                Description
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what this task involves..."
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground/80 text-sm placeholder:text-foreground/20 focus:outline-none focus:border-accent/40 resize-none transition-colors"
              />
            </div>

            {/* Status + Project row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-muted-foreground text-xs font-medium mb-2 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground/80 text-sm focus:outline-none focus:border-accent/40 transition-colors cursor-pointer"
                >
                  {STATUSES.map((item) => (
                    <option key={item} value={item} className="bg-[#141414]">
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground text-xs font-medium mb-2 uppercase tracking-wider">
                  Project
                </label>
                <div className="rounded-xl border border-border bg-card px-4 py-3 text-muted-foreground text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                  {taskLoaded
                    ? currentProject?.name ?? `Project #${projectId}`
                    : "Loading..."}
                </div>
              </div>
            </div>

            {error && <p className="text-[#EF4444] text-sm">{error}</p>}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={loading}
                className="flex-1 bg-accent hover:bg-[#0284C7] disabled:opacity-50 text-foreground font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
              <Link
                to={id ? `/app/tasks/${id}` : "/app/tasks"}
                className="px-6 py-3 bg-secondary border border-border hover:bg-white/[0.07] text-muted-foreground font-medium rounded-xl text-sm transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-[#EF4444]/20 bg-[#EF4444]/[0.03] p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle size={14} className="text-[#EF4444]" />
            </div>
            <div>
              <h3 className="text-[#EF4444] text-sm font-semibold">
                Danger Zone
              </h3>
              <p className="text-foreground/35 text-xs mt-0.5 leading-relaxed">
                Deleting a task is permanent and cannot be undone. All associated
                data will be removed.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              confirmDelete
                ? "bg-[#EF4444] text-foreground hover:bg-[#DC2626]"
                : "border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10"
            }`}
          >
            <Trash2 size={13} />
            {confirmDelete ? "Yes, delete this task" : "Delete Task"}
          </button>

          {confirmDelete && (
            <p className="text-foreground/35 text-xs mt-3">
              Click again to confirm permanent deletion.{" "}
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-muted-foreground underline hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
