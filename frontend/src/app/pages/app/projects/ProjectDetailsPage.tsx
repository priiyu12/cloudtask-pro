import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { api } from "../../../lib/api";
import {
  CheckCircle2,
  Clock,
  FileText,
  Users,
  Activity,
  Settings,
  LayoutGrid,
  Download,
  Pencil,
  Trash2,
  Plus,
  UploadCloud,
} from "lucide-react";

type Project = { id: number; name: string; description: string | null; owner_id: number; created_at: string };
type Task = { id: number; title: string; description: string | null; status: string; project_id: number; created_at: string; assignee_id?: number };
type User = { id: number; name: string; email: string; avatar_color?: string; job_title?: string };
type TeamMember = { user: User; role: string };
type FileItem = { id: number; filename: string; file_url: string; file_size: number; uploaded_by_id: number; created_at?: string };

const PROJECT_COLORS = ["var(--color-accent)", "#8B5CF6", "#F59E0B", "#22C55E", "#EF4444", "#EC4899"];
const PROJECT_STATUSES = ["In Progress", "Review", "Planning", "In Progress", "Done", "In Progress"];
const PROJECT_DEADLINES = ["Dec 28", "Dec 20", "Jan 15", "Jan 30", "Dec 31", "Dec 15"];

const STATUS_COLORS: Record<string, string> = {
  "In Progress": "bg-accent/15 text-accent",
  Done: "bg-[#22C55E]/15 text-[#22C55E]",
  Completed: "bg-[#22C55E]/15 text-[#22C55E]",
  Review: "bg-[#F59E0B]/15 text-[#F59E0B]",
  Todo: "bg-white/[0.08] text-muted-foreground",
  Planning: "bg-white/[0.08] text-muted-foreground",
};

// Dynamic project members will be calculated from tasks and project owner


const TABS = ["Overview", "Tasks", "Members", "Activity", "Files", "Settings"] as const;
type Tab = (typeof TABS)[number];

const TASK_MEMBER_COLORS = ["var(--color-accent)", "#8B5CF6", "#22C55E", "#F59E0B", "#EF4444"];

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workspaceMembers, setWorkspaceMembers] = useState<TeamMember[]>([]);
  const [projectMembers, setProjectMembers] = useState<TeamMember[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Developer");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const numId = Number(id ?? 0);
  const color = PROJECT_COLORS[numId % PROJECT_COLORS.length];

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.get<Project>(`/projects/${id}`).catch(() => null),
      api.get<Task[]>("/tasks").then((all) => all.filter((t) => String(t.project_id) === String(id))).catch(() => []),
      api.get<TeamMember[]>("/workspaces/members").catch(() => []),
      api.get<FileItem[]>(`/files/project/${id}`).catch(() => []),
      api.get<TeamMember[]>(`/projects/${id}/members`).catch(() => []),
      api.me().catch(() => null),
    ])
      .then(([proj, taskList, membersList, fileList, projectMembersList, meUser]) => {
        setProject(proj);
        setTasks(taskList);
        setWorkspaceMembers(membersList || []);
        setFiles(fileList || []);
        setProjectMembers(projectMembersList || []);
        setCurrentUser(meUser);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-background min-h-full text-foreground p-8 flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading project…</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-background min-h-full text-foreground p-8">
        <p className="text-foreground/45">Project not found.</p>
      </div>
    );
  }

  const doneTasks = tasks.filter((t) => t.status === "Done" || t.status === "Completed").length;
  const progress = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;
  
  const status = progress === 100 ? "Done" : "In Progress";
  const statusCls = STATUS_COLORS[status] ?? "bg-white/[0.08] text-muted-foreground";
  
  const projectTeamIds = new Set<number>();
  projectTeamIds.add(project.owner_id);
  tasks.forEach(t => { if (t.assignee_id) projectTeamIds.add(t.assignee_id); });
  projectMembers.forEach(m => { if (m.user) projectTeamIds.add(m.user.id); });
  
  const team = workspaceMembers
      .filter(m => m.user && projectTeamIds.has(m.user.id))
      .map(m => {
          const pm = projectMembers.find(p => p.user?.id === m.user.id);
          return {
              id: m.user.id,
              name: m.user.name,
              role: pm ? pm.role : (m.user.job_title || m.role),
              email: m.user.email,
              color: m.user.avatar_color || "var(--color-accent)"
          };
      });

  const myWorkspaceMember = workspaceMembers.find(m => m.user.id === currentUser?.id);
  const myProjectMember = projectMembers.find(m => m.user.id === currentUser?.id);
  const isSysAdmin = currentUser && 'role' in currentUser && (currentUser as any).role === "System Admin";
  const isWorkspaceAdminOrOwner = myWorkspaceMember?.role === "Workspace Owner" || myWorkspaceMember?.role === "Workspace Admin";
  const isProjectManager = isSysAdmin || isWorkspaceAdminOrOwner || myProjectMember?.role === "Project Manager";
  const isDeveloper = myProjectMember?.role === "Developer";
  const isQA = myProjectMember?.role === "QA";
  const canEdit = isProjectManager || isDeveloper || isQA;
  
  const allowedTabs = TABS.filter(tab => {
    if (tab === "Settings") return isProjectManager;
    return true;
  });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError("");
    setInviting(true);
    try {
      const res = await api.post<TeamMember>(`/projects/${id}/members`, {
        email: inviteEmail,
        role: inviteRole,
      });
      setProjectMembers(prev => [...prev, res]);
      setShowInviteModal(false);
      setInviteEmail("");
    } catch (err: any) {
      setInviteError(err.message || "Failed to add member to project.");
    } finally {
      setInviting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    await api.del(`/projects/${id}`);
    navigate("/app/projects");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !id) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const newFile = await api.uploadFile(file, parseInt(id));
      setFiles((prev) => [...prev, newFile]);
    } catch (err) {
      console.error(err);
      // Upgrade modal is triggered automatically by the API client on 402
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="bg-background min-h-full text-foreground p-8 space-y-6">
      {/* Back */}
      <Link to="/app/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Projects
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <span className="w-4 h-4 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: color }} />
            <div>
              <h1 className="text-[clamp(1.8rem,3vw,2.8rem)] font-semibold tracking-[-0.04em] text-foreground leading-tight">
                {project.name}
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusCls}`}>{status}</span>
                <span className="text-muted-foreground text-sm">{progress}% complete</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {canEdit && (
              <Link
                to={`/app/projects/${id}/edit`}
                className="px-4 py-2 text-sm bg-accent hover:bg-accent/90 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit Project
              </Link>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: color }}
          />
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-0 border-b border-border">
        {allowedTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "Overview" && (
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Left column */}
          <div className="space-y-5">
            {/* Description */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-foreground font-semibold mb-3">Description</h2>
              <p className="text-foreground/55 text-sm leading-7">
                {project.description ?? "No description provided for this project."}
              </p>
            </div>

            {/* Details grid */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-foreground font-semibold mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Created", value: new Date(project.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                  { label: "Deadline", value: "Not set" },
                  { label: "Priority", value: "Normal" },
                  { label: "Status", value: status },
                ].map((d) => (
                  <div key={d.label} className="space-y-1">
                    <p className="text-xs text-foreground/35 font-medium">{d.label}</p>
                    <p className="text-sm text-foreground font-semibold">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-foreground font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <p className="text-sm text-foreground/45">No recent activity.</p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Stat cards */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-1">
                <CheckCircle2 size={16} className="text-[#22C55E]" />
                <span className="text-muted-foreground text-sm">Tasks Done</span>
              </div>
              <p className="text-3xl font-bold text-foreground ml-7">{doneTasks}<span className="text-foreground/25 text-lg font-normal">/{tasks.length}</span></p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-1">
                <Clock size={16} className="text-[#F59E0B]" />
                <span className="text-muted-foreground text-sm">Days Left</span>
              </div>
              <p className="text-3xl font-bold text-foreground ml-7">-</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-1">
                <FileText size={16} className="text-[#8B5CF6]" />
                <span className="text-muted-foreground text-sm">Files</span>
              </div>
              <p className="text-3xl font-bold text-foreground ml-7">{files.length}</p>
            </div>

            {/* Team */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users size={15} className="text-muted-foreground" />
                <h3 className="text-foreground font-semibold text-sm">Team</h3>
              </div>
              <div className="space-y-3">
                {team.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-foreground text-xs font-bold shrink-0"
                      style={{ backgroundColor: m.color }}
                    >
                      {m.name[0]}
                    </span>
                    <div className="min-w-0">
                      <p className="text-foreground text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-foreground/35">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TASKS TAB ── */}
      {activeTab === "Tasks" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">{tasks.length} tasks</p>
            {canEdit && (
              <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-white/5 hover:bg-white/[0.08] text-foreground rounded-lg transition-colors border border-border">
                <Plus className="w-4 h-4" />
                New Task
              </button>
            )}
          </div>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {tasks.length === 0 ? (
              <div className="p-12 text-center text-foreground/35 text-sm">No tasks for this project yet.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="w-10 px-4 py-3" />
                    <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/35 uppercase tracking-wider">Title</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/35 uppercase tracking-wider hidden md:table-cell">Assignee</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/35 uppercase tracking-wider hidden lg:table-cell">Priority</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/35 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, i) => {
                    const statusCls2 = STATUS_COLORS[task.status] ?? "bg-white/[0.08] text-muted-foreground";
                    const assignee = team.find((m) => m.id === task.assignee_id) || team[0] || { name: "?", color: "gray" };
                    return (
                      <tr key={task.id} className="border-b border-white/[0.04] hover:bg-card transition-colors">
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            readOnly
                            checked={task.status === "Done" || task.status === "Completed"}
                            className="accent-[#0EA5E9] w-4 h-4 rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-foreground text-sm font-medium">{task.title}</p>
                          {task.description && (
                            <p className="text-foreground/35 text-xs mt-0.5 line-clamp-1">{task.description}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-foreground"
                            style={{ backgroundColor: assignee.color }}
                          >
                            {assignee.name[0].toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                            <span className="text-xs text-foreground/45">Medium</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusCls2}`}>
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── MEMBERS TAB ── */}
      {activeTab === "Members" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Project Members</h2>
            {isProjectManager && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-accent hover:bg-[#0284C7] text-foreground font-semibold transition-colors"
              >
                <Plus size={14} />
                Add Member
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map((m) => (
              <div key={m.id} className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <span
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-foreground"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.name[0]}
                  </span>
                  <div>
                    <p className="text-foreground font-semibold">{m.name}</p>
                    <p className="text-muted-foreground text-xs">{m.role}</p>
                  </div>
                </div>
                <p className="text-xs text-foreground/35">{m.email}</p>
              </div>
            ))}
            {team.length === 0 && (
              <p className="text-foreground/45 text-sm p-4 col-span-full text-center">No members found.</p>
            )}
          </div>
        </div>
      )}

      {/* ── ACTIVITY TAB ── */}
      {activeTab === "Activity" && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
           <p className="text-sm text-foreground/45 text-center py-4">No recent activity.</p>
        </div>
      )}

      {/* ── FILES TAB ── */}
      {activeTab === "Files" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Project Files</h2>
            {canEdit && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-accent hover:bg-[#0284C7] text-foreground font-semibold transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <><span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Uploading...</>
                  ) : (
                    <><UploadCloud size={14} /> Upload File</>
                  )}
                </button>
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
              </>
            )}
          </div>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-foreground/35 uppercase tracking-wider">File</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/35 uppercase tracking-wider hidden md:table-cell">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/35 uppercase tracking-wider hidden lg:table-cell">Size</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/35 uppercase tracking-wider hidden lg:table-cell">Updated</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b border-white/[0.04] hover:bg-card transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center">
                        <FileText size={16} className="text-muted-foreground" />
                      </div>
                      <span className="text-foreground text-sm font-medium">{file.filename}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-xs text-muted-foreground bg-white/[0.06] px-2 py-0.5 rounded">File</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">{(file.file_size / 1024).toFixed(1)} KB</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">{file.created_at ? new Date(file.created_at).toLocaleDateString() : "Just now"}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <a href={file.file_url} download className="inline-block p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-colors">
                      <Download size={14} />
                    </a>
                  </td>
                </tr>
              ))}
              {files.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-foreground/35 text-sm">No files uploaded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* ── SETTINGS TAB ── */}
      {activeTab === "Settings" && (
        <div className="max-w-xl space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <div>
              <label className="block text-muted-foreground text-sm font-medium mb-2">Visibility</label>
              <select className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-accent/50 transition-colors appearance-none">
                <option value="private" className="bg-card">Private</option>
                <option value="team" className="bg-card">Team</option>
                <option value="public" className="bg-card">Public</option>
              </select>
            </div>
            <div>
              <label className="block text-muted-foreground text-sm font-medium mb-2">Notifications</label>
              <select className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-accent/50 transition-colors appearance-none">
                <option value="all" className="bg-card">All activity</option>
                <option value="mentions" className="bg-card">Mentions only</option>
                <option value="none" className="bg-card">None</option>
              </select>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl border border-[#EF4444]/25 bg-[#EF4444]/[0.04] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Trash2 size={16} className="text-[#EF4444]" />
              <h3 className="text-[#EF4444] font-semibold">Danger Zone</h3>
            </div>
            <p className="text-foreground/45 text-sm">
              Permanently delete this project and all of its tasks. This action cannot be undone.
            </p>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 border border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444] rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#EF4444]/15 transition-colors"
            >
              <Trash2 size={14} />
              Delete Project
            </button>
          </div>
        </div>
      )}

      {/* ── INVITE MODAL ── */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-1">Add Member to Project</h2>
              <p className="text-sm text-foreground/55 mb-6">Assign a workspace member to this project.</p>
              
              <form onSubmit={handleInvite} className="space-y-4">
                {inviteError && (
                  <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm">
                    {inviteError}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email..."
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-foreground outline-none focus:border-accent/50 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-foreground outline-none focus:border-accent/50 transition-colors appearance-none"
                  >
                    <option value="Project Manager">Project Manager</option>
                    <option value="Developer">Developer</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteModal(false);
                      setInviteError("");
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviting}
                    className="flex-1 py-2.5 rounded-xl bg-accent text-foreground font-semibold hover:bg-[#0284C7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {inviting ? "Adding..." : "Add Member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
