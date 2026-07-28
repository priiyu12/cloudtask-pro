import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Folder,
  User,
  Flag,
  CheckCircle2,
  Pencil,
  Trash2,
  MessageSquare,
  Activity,
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

const STATUS_COLORS: Record<string, string> = {
  "In Progress": "bg-accent/15 text-accent",
  Done: "bg-[#22C55E]/15 text-[#22C55E]",
  Review: "bg-[#F59E0B]/15 text-[#F59E0B]",
  Todo: "bg-white/[0.08] text-muted-foreground",
  Completed: "bg-[#22C55E]/15 text-[#22C55E]",
};

const STATIC_COMMENTS: any[] = [];
const STATIC_ACTIVITY: any[] = [];

export default function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get<Task>(`/tasks/${id}`)
      .then((t) => {
        setTask(t);
        return Promise.all([
          api.get<Project>(`/projects/${t.project_id}`),
          api.get<any[]>('/workspaces/members').catch(() => [])
        ]);
      })
      .then(([p, m]) => {
        setProject(p);
        setMembers(m);
      })
      .catch(() => setTask(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await api.del(`/tasks/${id}`);
    navigate("/app/tasks");
  };

  if (loading) {
    return (
      <div className="p-8 text-muted-foreground bg-background min-h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent/30 border-t-[#0EA5E9] rounded-full animate-spin" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-8 text-foreground/45 bg-background min-h-full">
        Task not found.{" "}
        <Link to="/app/tasks" className="text-accent underline">
          Back to tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-background min-h-full text-foreground">
      {/* Back link */}
      <Link
        to="/app/tasks"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Tasks
      </Link>

      {/* Title + Status */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <h1 className="text-[clamp(1.6rem,2.5vw,2.4rem)] font-semibold tracking-[-0.04em] text-foreground leading-tight">
          {task.title}
        </h1>
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
            STATUS_COLORS[task.status] ?? "bg-white/[0.08] text-muted-foreground"
          }`}
        >
          {task.status}
        </span>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: col-span-2 */}
        <div className="col-span-2 space-y-5">
          {/* Description */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-3">
              Description
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {task.description ?? "No description provided."}
            </p>
          </div>

          {/* Comments */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare size={15} className="text-muted-foreground" />
              <h2 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Comments
              </h2>
              <span className="ml-auto text-foreground/25 text-xs">
                {STATIC_COMMENTS.length}
              </span>
            </div>

            <div className="space-y-5">
              {STATIC_COMMENTS.length === 0 ? (
                <div className="text-muted-foreground text-sm">No comments yet.</div>
              ) : (
                STATIC_COMMENTS.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-foreground shrink-0 mt-0.5"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.initial}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-foreground text-xs font-semibold">
                          {c.author}
                        </span>
                        <span className="text-muted-foreground text-xs">{c.time}</span>
                      </div>
                      <p className="text-foreground/55 text-sm leading-relaxed">
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment input */}
            <div className="mt-5 pt-4 border-t border-white/[0.05] flex gap-3">
              <span className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[11px] font-bold text-foreground shrink-0 mt-0.5">
                Y
              </span>
              <div className="flex-1 relative">
                <textarea
                  rows={2}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-white/[0.03] border border-border rounded-xl px-4 py-2.5 text-foreground/80 text-sm placeholder:text-foreground/25 focus:outline-none focus:border-accent/40 resize-none transition-colors"
                />
                <button
                  disabled={!commentText.trim()}
                  className="mt-2 px-4 py-1.5 bg-accent hover:bg-[#0284C7] disabled:opacity-40 text-foreground text-xs font-semibold rounded-lg transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Activity size={15} className="text-muted-foreground" />
              <h2 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Activity
              </h2>
            </div>

            <div className="space-y-4">
              {STATIC_ACTIVITY.length === 0 ? (
                <div className="text-muted-foreground text-sm">No activity yet.</div>
              ) : (
                STATIC_ACTIVITY.map((a) => (
                  <div key={a.id} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground/55 text-xs leading-relaxed">
                        {a.text}{" "}
                        {a.from && (
                          <span className="text-muted-foreground line-through">
                            {a.from}
                          </span>
                        )}{" "}
                        {a.to && (
                          <span className="text-foreground/80 font-medium">{a.to}</span>
                        )}{" "}
                        — by{" "}
                        <span className="text-muted-foreground font-medium">{a.by}</span>
                      </p>
                      <p className="text-foreground/25 text-xs mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: col-span-1 */}
        <div className="col-span-1 space-y-5">
          {/* Details Card */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4">
              Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User size={14} className="text-muted-foreground shrink-0" />
                <span className="text-foreground/35 text-xs w-20 shrink-0">
                  Assignee
                </span>
                {(() => {
                  const member = members.find(m => m.user?.id === (task as any).assignee_id);
                  if (!member) return <span className="text-muted-foreground text-xs">Unassigned</span>;
                  const u = member.user;
                  const name = u.full_name || u.name || u.email || "Unknown";
                  const initial = (u.name ? u.name[0] : "U").toUpperCase();
                  const color = u.avatar_color || "var(--color-accent)";
                  return (
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-foreground" style={{ backgroundColor: color }}>
                        {initial}
                      </span>
                      <span className="text-muted-foreground text-xs">{name}</span>
                    </div>
                  );
                })()}
              </div>

              {/* Project */}
              <div className="flex items-center gap-3">
                <Folder size={14} className="text-muted-foreground shrink-0" />
                <span className="text-foreground/35 text-xs w-20 shrink-0">
                  Project
                </span>
                <span className="text-muted-foreground text-xs truncate">
                  {project?.name ?? `Project #${task.project_id}`}
                </span>
              </div>

              {/* Priority */}
              <div className="flex items-center gap-3">
                <Flag size={14} className="text-muted-foreground shrink-0" />
                <span className="text-foreground/35 text-xs w-20 shrink-0">
                  Priority
                </span>
                <span className="text-[#EF4444] text-xs font-medium">
                  High
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <CheckCircle2 size={14} className="text-muted-foreground shrink-0" />
                <span className="text-foreground/35 text-xs w-20 shrink-0">
                  Status
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    STATUS_COLORS[task.status] ??
                    "bg-white/[0.08] text-muted-foreground"
                  }`}
                >
                  {task.status}
                </span>
              </div>

              {/* Due */}
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-muted-foreground shrink-0" />
                <span className="text-foreground/35 text-xs w-20 shrink-0">
                  Due
                </span>
                <span className="text-muted-foreground text-xs">Dec 16, 2024</span>
              </div>

              {/* Created */}
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-muted-foreground shrink-0" />
                <span className="text-foreground/35 text-xs w-20 shrink-0">
                  Created
                </span>
                <span className="text-muted-foreground text-xs">
                  {new Date(task.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <Link
              to={`/app/tasks/${task.id}/edit`}
              className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-[#0284C7] text-foreground text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              <Pencil size={14} />
              Edit Task
            </Link>
            <button className="flex items-center justify-center gap-2 w-full border border-[#22C55E]/40 text-[#22C55E] hover:bg-[#22C55E]/10 text-sm font-medium py-3 rounded-xl transition-colors">
              <CheckCircle2 size={14} />
              Mark Complete
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className={`flex items-center justify-center gap-2 w-full border text-sm font-medium py-3 rounded-xl transition-colors ${
                confirmDelete
                  ? "border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]"
                  : "border-border text-muted-foreground hover:border-[#EF4444]/50 hover:text-[#EF4444]"
              }`}
            >
              <Trash2 size={14} />
              {confirmDelete ? "Confirm Delete" : "Delete Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
