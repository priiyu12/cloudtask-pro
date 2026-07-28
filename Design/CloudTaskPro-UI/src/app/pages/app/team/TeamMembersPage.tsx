import { useState } from "react";
import { Link } from "react-router";

const MEMBERS = [
  { id: "m1", name: "Sarah Chen", title: "Engineering Lead", role: "Admin", color: "#0EA5E9", initials: "S", email: "sarah@payload.co", projects: 5, tasks: 28, status: "Online" },
  { id: "m2", name: "Marcus Webb", title: "CTO", role: "Admin", color: "#8B5CF6", initials: "M", email: "marcus@payload.co", projects: 8, tasks: 15, status: "Online" },
  { id: "m3", name: "Alex Kim", title: "Full-stack Dev", role: "Member", color: "#F59E0B", initials: "A", email: "alex@payload.co", projects: 4, tasks: 22, status: "Away" },
  { id: "m4", name: "Priya Sharma", title: "Product Designer", role: "Member", color: "#22C55E", initials: "P", email: "priya@payload.co", projects: 3, tasks: 19, status: "Offline" },
  { id: "m5", name: "James Okafor", title: "Backend Dev", role: "Member", color: "#EF4444", initials: "J", email: "james@payload.co", projects: 2, tasks: 11, status: "Online" },
  { id: "m6", name: "Lena Müller", title: "DevOps Lead", role: "Manager", color: "#0EA5E9", initials: "L", email: "lena@payload.co", projects: 6, tasks: 8, status: "Offline" },
];

function statusDot(status: string) {
  if (status === "Online") return "bg-[#22C55E]";
  if (status === "Away") return "bg-[#F59E0B]";
  return "bg-white/20";
}

function roleBadge(role: string) {
  if (role === "Admin") return "bg-[#EF4444]/15 text-[#EF4444]";
  if (role === "Manager") return "bg-[#F59E0B]/15 text-[#F59E0B]";
  return "bg-white/10 text-white/50";
}

export default function TeamMembersPage() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");

  const filtered = MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const onlineCount = MEMBERS.filter((m) => m.status === "Online").length;
  const avgProjects = Math.round(MEMBERS.reduce((a, m) => a + m.projects, 0) / MEMBERS.length);
  const avgTasks = Math.round(MEMBERS.reduce((a, m) => a + m.tasks, 0) / MEMBERS.length);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 text-sm font-medium">
            6
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#0EA5E9]/50 w-56"
          />
          <button
            onClick={() => setModal(true)}
            className="px-4 py-2 rounded-xl bg-[#0EA5E9] text-white text-sm font-medium hover:bg-[#0EA5E9]/90 transition-colors"
          >
            Invite Member
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Members", value: "6" },
          { label: "Online", value: String(onlineCount) },
          { label: "Avg Projects", value: String(avgProjects) },
          { label: "Avg Tasks", value: String(avgTasks) },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-sm text-white/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Member grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((member) => (
          <div
            key={member.id}
            className="group bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.14] hover:bg-white/[0.04] hover:-translate-y-0.5 transition-all duration-200"
          >
            {/* Top row */}
            <div className="flex items-start justify-between mb-4">
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
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
              <div className="font-semibold text-white">{member.name}</div>
              <div className="text-sm text-white/50">{member.title}</div>
            </div>

            {/* Email */}
            <div className="text-xs text-white/30 mb-4">{member.email}</div>

            {/* Stats */}
            <div className="text-xs text-white/40 mb-4">
              {member.projects} projects · {member.tasks} tasks completed
            </div>

            {/* View Profile */}
            <Link
              to={`/app/team/${member.id}`}
              className="block text-center py-2 rounded-xl border border-white/[0.08] text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModal(false)}
          />
          <div className="relative bg-[#111111] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-white mb-5">Invite Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Email address</label>
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#0EA5E9]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0EA5E9]/50"
                >
                  <option value="Member">Member</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setModal(false); setInviteEmail(""); }}
                className="flex-1 py-2.5 rounded-xl bg-[#0EA5E9] text-white text-sm font-medium hover:bg-[#0EA5E9]/90 transition-colors"
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
