import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Server, Database, Shield, Zap } from "lucide-react";
import { api } from "../../../lib/api";

type Project = { id: number; name: string };

const STATUSES = ["Todo", "In Progress", "Review", "Completed"];

const INFO_PILLS = [
  { icon: Server, label: "Private VPC-ready backend" },
  { icon: Database, label: "RDS PostgreSQL task data" },
  { icon: Shield, label: "ALB + autoscaling" },
  { icon: Zap, label: "Real-time sync" },
];

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState("Todo");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<Project[]>("/projects").then((data) => {
      setProjects(data);
      if (data[0]) setProjectId(String(data[0].id));
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const task = await api.post<{ id: number }>("/tasks", {
        title,
        description,
        status,
        project_id: Number(projectId),
      });
      navigate(`/app/tasks/${task.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-background min-h-full text-foreground">
      <Link
        to="/app/tasks"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={15} />
        All Tasks
      </Link>

      <div className="max-w-5xl mx-auto grid grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left: Form */}
        <div className="rounded-3xl border border-border bg-white/[0.03] p-8">
          <div className="mb-7">
            <p className="text-accent text-xs font-semibold uppercase tracking-[0.24em]">
              New Task
            </p>
            <h1 className="text-foreground text-3xl font-semibold mt-2 tracking-[-0.03em]">
              Create a task
            </h1>
            <p className="text-foreground/35 text-sm mt-1.5">
              Define what needs to get done and assign it to a project.
            </p>
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
                placeholder="What needs to be done?"
                className="w-full bg-transparent text-foreground text-xl font-medium placeholder:text-foreground/20 border-b border-border pb-3 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-muted-foreground text-xs font-medium mb-2 uppercase tracking-wider">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What needs to happen? Add context, links, or acceptance criteria..."
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground/80 text-sm placeholder:text-foreground/20 focus:outline-none focus:border-accent/40 resize-none transition-colors"
              />
            </div>

            {/* Project + Status grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-muted-foreground text-xs font-medium mb-2 uppercase tracking-wider">
                  Project
                </label>
                <select
                  required
                  value={projectId}
                  onChange={(event) => setProjectId(event.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground/80 text-sm focus:outline-none focus:border-accent/40 transition-colors cursor-pointer"
                >
                  {projects.map((project) => (
                    <option
                      key={project.id}
                      value={project.id}
                      className="bg-[#141414]"
                    >
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

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
            </div>

            {/* No projects warning */}
            {projects.length === 0 && (
              <Link
                to="/app/projects/create"
                className="block rounded-xl border border-accent/20 bg-accent/[0.07] p-4 text-accent text-sm hover:bg-accent/10 transition-colors"
              >
                ⚠️ Create a project first so this task has a home →
              </Link>
            )}

            {error && <p className="text-[#EF4444] text-sm">{error}</p>}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={loading || !projectId}
                className="flex-1 bg-accent hover:bg-[#0284C7] disabled:opacity-50 text-foreground font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Create Task"
                )}
              </button>
              <Link
                to="/app/tasks"
                className="px-6 py-3 bg-secondary border border-border hover:bg-white/[0.07] text-muted-foreground font-medium rounded-xl text-sm transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Right: Info Panel */}
        <div className="rounded-3xl border border-border bg-card p-7 space-y-7">
          <div>
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center mb-4">
              <Zap size={18} className="text-accent" />
            </div>
            <h3 className="text-foreground font-semibold text-lg tracking-[-0.02em]">
              CloudTask Pro
            </h3>
            <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
              Tasks are synced in real-time across your team with enterprise-grade infrastructure.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.05]" />

          {/* Info pills */}
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              Infrastructure
            </p>
            {INFO_PILLS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
              >
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon size={13} className="text-accent" />
                </div>
                <span className="text-foreground/55 text-xs font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.05]" />

          {/* Quick tip */}
          <div className="rounded-xl bg-accent/[0.06] border border-accent/20 p-4">
            <p className="text-accent text-xs font-semibold mb-1">
              💡 Quick Tip
            </p>
            <p className="text-foreground/45 text-xs leading-relaxed">
              Start task names with a verb: "Build", "Fix", "Review", "Deploy"
              — it makes priorities instantly clear.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
