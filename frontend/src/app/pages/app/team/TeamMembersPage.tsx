import { useState, useEffect } from "react";
import { Link } from "react-router";
import { api } from "../../../lib/api";

type User = {
  id: number;
  name: string;
  email: string;
  job_title?: string;
  avatar_color?: string;
  created_at: string;
};

type TeamMember = {
  id: number;
  role: string;
  user: User;
};

type Task = {
  id: number;
  title: string;
  status: string;
  project_id: number;
  created_at: string;
};

type Project = {
  id: number;
  name: string;
  owner_id: number;
  created_at: string;
};

function statusDot(status: string) {
  if (status === "Online") return "bg-[#22C55E]";
  if (status === "Away") return "bg-[#F59E0B]";
  return "bg-white/20";
}

function roleBadge(role: string) {
  if (role === "Admin") return "bg-[#EF4444]/15 text-[#EF4444]";
  if (role === "Manager") return "bg-[#F59E0B]/15 text-[#F59E0B]";
  return "bg-white/10 text-muted-foreground";
}

export default function TeamMembersPage() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Workspace Member");

  const [membersList, setMembersList] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<TeamMember[]>('/workspaces/members'),
      api.get<Task[]>('/tasks'),
      api.get<Project[]>('/projects'),
      api.get<User>('/users/me')
    ])
      .then(([membersRes, tasksRes, projectsRes, userRes]) => {
        setMembersList(membersRes || []);
        setTasks(tasksRes || []);
        setProjects(projectsRes || []);
        setCurrentUser(userRes || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      await api.post('/workspaces/invites', { email: inviteEmail, role: inviteRole });
      alert("Invite sent successfully!");
    } catch (e: any) {
      alert("Error: " + e.message);
    }
    setModal(false);
    setInviteEmail("");
  };

  const members = membersList.map((m) => {
    const user = m.user;
    if (!user) return null;
    const userProjectsCount = projects.filter((p) => p.owner_id === user.id).length;
    const userTasksCount = tasks.filter((t) => t.assignee_id === user.id && (t.status === "Done" || t.status === "Completed")).length;
    
    // Compute initials from name safely
    const nameParts = user.name ? user.name.split(" ") : ["U"];
    const initials = nameParts.map((n) => (n[0] || "")).join("").toUpperCase().substring(0, 2);

    return {
      id: user.id.toString(),
      name: user.name,
      title: user.job_title || "Workspace Member",
      role: m.role || "Workspace Member",
      color: user.avatar_color || "var(--color-accent)",
      initials: initials || "?",
      email: user.email,
      projects: userProjectsCount,
      tasks: userTasksCount,
      status: "Online", // default display status
    };
  }).filter(Boolean) as any[];

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const onlineCount = members.filter((m) => m.status === "Online").length;
  const avgProjects = members.length > 0 ? Math.round(members.reduce((a, m) => a + m.projects, 0) / members.length) : 0;
  const avgTasks = members.length > 0 ? Math.round(members.reduce((a, m) => a + m.tasks, 0) / members.length) : 0;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-muted-foreground">Loading team members...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Team</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-muted-foreground text-sm font-medium">
            {membersList.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-secondary border border-border rounded-xl px-4 py-2 text-sm text-foreground placeholder-white/30 focus:outline-none focus:border-accent/50 w-56"
          />
          {currentUser && membersList.find(m => m.user.id === currentUser.id)?.role === "Workspace Owner" && (
            <button
              onClick={() => setModal(true)}
              className="px-4 py-2 rounded-xl bg-accent text-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              Invite Member
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Members", value: String(membersList.length) },
          { label: "Online", value: String(onlineCount) },
          { label: "Avg Projects", value: String(avgProjects) },
          { label: "Avg Tasks", value: String(avgTasks) },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Member grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((member) => (
          <div
            key={member.id}
            className="group bg-card border border-border rounded-2xl p-5 hover:border-border/80 hover:bg-secondary hover:-translate-y-0.5 transition-all duration-200"
          >
            {/* Top row */}
            <div className="flex items-start justify-between mb-4">
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-foreground font-bold text-lg"
                  style={{ backgroundColor: member.color + "30", border: `1px solid ${member.color}40` }}
                >
                  <span style={{ color: member.color }}>{member.initials}</span>
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a0a0a] ${statusDot(member.status)}`}
                />
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleBadge(member.role)}`}>
                {member.role}
              </span>
            </div>

            {/* Name + title */}
            <div className="mb-1">
              <div className="font-semibold text-foreground">{member.name}</div>
              <div className="text-sm text-muted-foreground">{member.title}</div>
            </div>

            {/* Email */}
            <div className="text-xs text-muted-foreground mb-4">{member.email}</div>

            {/* Stats */}
            <div className="text-xs text-muted-foreground mb-4">
              {member.projects} projects · {member.tasks} tasks completed
            </div>

            {/* View Profile */}
            <Link
              to={`/app/team/${member.id}`}
              className="block text-center py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              View Profile
            </Link>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl">
            No members found.
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModal(false)}
          />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-foreground mb-5">Invite Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Email address</label>
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-white/20 focus:outline-none focus:border-accent/50"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent/50"
                >
                  <option value="Workspace Member">Workspace Member</option>
                  <option value="Workspace Admin">Workspace Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="flex-1 py-2.5 rounded-xl bg-accent text-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
