import { useState } from "react";
import { Link } from "react-router";

const ALL_PROJECTS = [
  { id: 1, name: "Frontend Redesign", workspace: "Payload", members: 5, tasks: 12, status: "In Progress", created: "Oct 2024" },
  { id: 2, name: "API v2 Migration", workspace: "Payload", members: 6, tasks: 18, status: "Review", created: "Nov 2024" },
  { id: 3, name: "CloudTask Core", workspace: "Acme Corp", members: 8, tasks: 34, status: "In Progress", created: "Sep 2024" },
  { id: 4, name: "Marketing Site", workspace: "Startup.io", members: 3, tasks: 7, status: "Done", created: "Aug 2024" },
  { id: 5, name: "Mobile App", workspace: "Techflow", members: 4, tasks: 22, status: "Planning", created: "Dec 2024" },
  { id: 6, name: "Design Refresh", workspace: "Acme Corp", members: 2, tasks: 8, status: "In Progress", created: "Nov 2024" },
  { id: 7, name: "Backend API", workspace: "Techflow", members: 5, tasks: 15, status: "Review", created: "Oct 2024" },
  { id: 8, name: "Analytics Platform", workspace: "Startup.io", members: 7, tasks: 28, status: "Planning", created: "Dec 2024" },
];

function statusBadge(status: string) {
  if (status === "In Progress") return "bg-[#0EA5E9]/15 text-[#0EA5E9]";
  if (status === "Review") return "bg-[#8B5CF6]/15 text-[#8B5CF6]";
  if (status === "Done") return "bg-[#22C55E]/15 text-[#22C55E]";
  if (status === "Planning") return "bg-[#F59E0B]/15 text-[#F59E0B]";
  return "bg-white/10 text-white/40";
}

const STATUS_OPTIONS = ["All", "In Progress", "Review", "Done", "Planning"];

const WORKSPACE_COLORS: Record<string, string> = {
  Payload: "#0EA5E9",
  "Acme Corp": "#8B5CF6",
  "Startup.io": "#22C55E",
  Techflow: "#F59E0B",
};

export default function AdminProjectsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = ALL_PROJECTS.filter((p) => {
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
          <Link to="/app/admin" className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Admin
          </Link>
          <span className="text-white/20">/</span>
          <h1 className="text-2xl font-bold text-white">Projects Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#0EA5E9]/50 w-52"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#0EA5E9]/50"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden mb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["Project", "Workspace", "Members", "Tasks", "Status", "Created", "Actions"].map((h) => (
                <th key={h} className="text-left text-xs text-white/30 font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((p) => {
              const color = WORKSPACE_COLORS[p.workspace] || "#0EA5E9";
              return (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  {/* Project */}
                  <td className="px-5 py-3.5">
                    <div className="text-sm font-medium text-white">{p.name}</div>
                  </td>
                  {/* Workspace */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm text-white/50">{p.workspace}</span>
                    </div>
                  </td>
                  {/* Members */}
                  <td className="px-5 py-3.5 text-sm text-white/50">{p.members}</td>
                  {/* Tasks */}
                  <td className="px-5 py-3.5 text-sm text-white/50">{p.tasks}</td>
                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(p.status)}`}>{p.status}</span>
                  </td>
                  {/* Created */}
                  <td className="px-5 py-3.5 text-sm text-white/40">{p.created}</td>
                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {/* View */}
                      <button className="p-1.5 rounded-lg text-white/30 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/10 transition-colors" title="View">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {/* Suspend */}
                      <button className="p-1.5 rounded-lg text-white/30 hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 transition-colors" title="Suspend">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </button>
                      {/* Delete */}
                      <button className="p-1.5 rounded-lg text-white/30 hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-white/30">
        <span>Showing 1–{filtered.length} of 2,341 projects</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-white/20 hover:text-white/60 transition-colors">← Prev</button>
          <button className="px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-white/20 hover:text-white/60 transition-colors">Next →</button>
        </div>
      </div>
    </div>
  );
}
