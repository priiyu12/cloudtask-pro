import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../../../lib/api";

type Project = { id: number; name: string; owner_id: number; created_at: string; description: string | null };
type Task = { id: number; project_id: number; status: string };
type User = { id: number; name: string };

function statusBadge(status: string) {
  if (status === "In Progress") return "bg-accent/15 text-accent";
  if (status === "Review") return "bg-[#8B5CF6]/15 text-[#8B5CF6]";
  if (status === "Done") return "bg-[#22C55E]/15 text-[#22C55E]";
  if (status === "Planning") return "bg-[#F59E0B]/15 text-[#F59E0B]";
  return "bg-white/10 text-muted-foreground";
}

const STATUS_OPTIONS = ["All", "In Progress", "Review", "Done", "Planning"];

const WORKSPACE_COLORS: Record<string, string> = {
  Payload: "var(--color-accent)",
  "Acme Corp": "#8B5CF6",
  "Startup.io": "#22C55E",
  Techflow: "#F59E0B",
};

export default function AdminProjectsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  useEffect(() => {
    api.get<Project[]>("/admin/projects").then(setProjects).catch(() => setProjects([]));
    api.get<Task[]>("/tasks").then(setTasks).catch(() => setTasks([]));
    api.get<User[]>("/admin/users").then(setUsers).catch(() => setUsers([]));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      const updated = await api.put<Project>(`/admin/projects/${editingProject.id}`, { 
        name: editName,
        description: editDesc
      });
      setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
      setEditingProject(null);
    } catch (e) {
      console.error(e);
      alert("Failed to update project.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project? This will also delete all of its tasks.")) return;
    try {
      await api.del(`/admin/projects/${id}`);
      setProjects((prev) => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete project.");
    }
  };

  const filtered = projects.map((p, index) => {
    const owner = users.find(u => u.id === p.owner_id);
    const pTasks = tasks.filter(t => t.project_id === p.id);
    
    let computedStatus = "Planning";
    if (pTasks.length > 0) {
      const allDone = pTasks.every(t => t.status === "Done" || t.status === "Completed");
      const someReview = pTasks.some(t => t.status === "Review");
      if (allDone) {
        computedStatus = "Done";
      } else if (someReview) {
        computedStatus = "Review";
      } else {
        computedStatus = "In Progress";
      }
    }

    const workspaceNames = Object.keys(WORKSPACE_COLORS);
    const workspace = workspaceNames[p.id % workspaceNames.length];

    return {
      id: p.id,
      name: p.name,
      workspace: owner ? `${owner.name}'s Workspace` : workspace,
      workspaceColor: WORKSPACE_COLORS[workspace],
      members: 1, 
      tasks: pTasks.length,
      status: computedStatus,
      created: new Date(p.created_at).toLocaleDateString(undefined, { month: "short", year: "numeric", day: "numeric" }),
    };
  }).filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.workspace.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/app/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-muted-foreground transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Admin
          </Link>
          <span className="text-foreground/20">/</span>
          <h1 className="text-2xl font-bold text-foreground">Projects Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-secondary border border-border rounded-xl px-4 py-2 text-sm text-foreground placeholder-white/30 focus:outline-none focus:border-accent/50 w-52"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-secondary border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-accent/50"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Project", "Workspace", "Members", "Tasks", "Status", "Created", "Actions"].map((h) => (
                <th key={h} className="text-left text-xs text-muted-foreground font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((p) => {
              return (
                <tr key={p.id} className="hover:bg-card transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="text-sm font-medium text-foreground">{p.name}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: p.workspaceColor }}
                      />
                      <span className="text-sm text-muted-foreground">{p.workspace}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.members}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.tasks}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(p.status)}`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.created}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {/* View */}
                      <Link to={`/app/projects/${p.id}`} className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors" title="View">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      {/* Edit */}
                      <button 
                        onClick={() => { setEditingProject(p as unknown as Project); setEditName(p.name); setEditDesc(""); }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {/* Delete */}
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {filtered.length > 0 ? 1 : 0}–{filtered.length} of {projects.length} projects</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-border hover:border-border hover:text-muted-foreground transition-colors disabled:opacity-50" disabled>← Prev</button>
          <button className="px-3 py-1.5 rounded-lg border border-border hover:border-border hover:text-muted-foreground transition-colors disabled:opacity-50" disabled>Next →</button>
        </div>
      </div>
      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-foreground mb-4">Edit Project</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent/50"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
