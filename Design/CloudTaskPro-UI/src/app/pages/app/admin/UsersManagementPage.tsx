import { useState } from "react";

const ALL_USERS = [
  { id: 1, initials: "S", name: "Sarah Chen", email: "sarah@payload.co", plan: "Pro", role: "Admin", status: "Active", joined: "Jan 2024", color: "#0EA5E9" },
  { id: 2, initials: "M", name: "Marcus Webb", email: "marcus@payload.co", plan: "Pro", role: "Admin", status: "Active", joined: "Jan 2024", color: "#8B5CF6" },
  { id: 3, initials: "A", name: "Alex Kim", email: "alex@payload.co", plan: "Pro", role: "Member", status: "Active", joined: "Feb 2024", color: "#F59E0B" },
  { id: 4, initials: "P", name: "Priya Sharma", email: "priya@payload.co", plan: "Free", role: "Member", status: "Active", joined: "Mar 2024", color: "#22C55E" },
  { id: 5, initials: "J", name: "James Okafor", email: "james@payload.co", plan: "Free", role: "Member", status: "Active", joined: "Apr 2024", color: "#EF4444" },
  { id: 6, initials: "L", name: "Lena Müller", email: "lena@payload.co", plan: "Pro", role: "Manager", status: "Active", joined: "Feb 2024", color: "#0EA5E9" },
  { id: 7, initials: "D", name: "David Park", email: "david@acme.co", plan: "Enterprise", role: "Admin", status: "Active", joined: "Nov 2023", color: "#8B5CF6" },
  { id: 8, initials: "E", name: "Emma Wilson", email: "emma@startup.io", plan: "Free", role: "Member", status: "Suspended", joined: "Jun 2024", color: "#F59E0B" },
];

function planBadge(plan: string) {
  if (plan === "Pro") return "bg-[#0EA5E9]/15 text-[#0EA5E9]";
  if (plan === "Enterprise") return "bg-[#8B5CF6]/15 text-[#8B5CF6]";
  return "bg-white/10 text-white/40";
}

function statusBadge(status: string) {
  if (status === "Active") return "bg-[#22C55E]/15 text-[#22C55E]";
  return "bg-[#EF4444]/15 text-[#EF4444]";
}

type FilterTab = "All" | "Active" | "Suspended" | "Admin";

export default function UsersManagementPage() {
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("All");

  const filtered = ALL_USERS.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      filterTab === "All" ||
      (filterTab === "Active" && u.status === "Active") ||
      (filterTab === "Suspended" && u.status === "Suspended") ||
      (filterTab === "Admin" && u.role === "Admin");
    return matchSearch && matchTab;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Users Management</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#0EA5E9]/50 w-52"
          />
          <button className="px-4 py-2 rounded-xl border border-white/[0.08] text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white/[0.02] border border-white/[0.06] rounded-xl p-1 w-fit mb-6">
        {(["All", "Active", "Suspended", "Admin"] as FilterTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilterTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterTab === t ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden mb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["User", "Plan", "Role", "Status", "Joined", "Actions"].map((h) => (
                <th key={h} className="text-left text-xs text-white/30 font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                {/* User */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: u.color + "25", color: u.color }}
                    >
                      {u.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{u.name}</div>
                      <div className="text-xs text-white/30">{u.email}</div>
                    </div>
                  </div>
                </td>
                {/* Plan */}
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${planBadge(u.plan)}`}>{u.plan}</span>
                </td>
                {/* Role */}
                <td className="px-5 py-3.5 text-sm text-white/50">{u.role}</td>
                {/* Status */}
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(u.status)}`}>{u.status}</span>
                </td>
                {/* Joined */}
                <td className="px-5 py-3.5 text-sm text-white/40">{u.joined}</td>
                {/* Actions */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    {/* Edit */}
                    <button className="p-1.5 rounded-lg text-white/30 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/10 transition-colors" title="Edit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {/* Suspend/Activate */}
                    <button
                      className={`p-1.5 rounded-lg transition-colors ${
                        u.status === "Active"
                          ? "text-white/30 hover:text-[#F59E0B] hover:bg-[#F59E0B]/10"
                          : "text-white/30 hover:text-[#22C55E] hover:bg-[#22C55E]/10"
                      }`}
                      title={u.status === "Active" ? "Suspend" : "Activate"}
                    >
                      {u.status === "Active" ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-white/30">
        <span>Showing 1–{filtered.length} of 847 users</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-white/20 hover:text-white/60 transition-colors">← Prev</button>
          <button className="px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-white/20 hover:text-white/60 transition-colors">Next →</button>
        </div>
      </div>
    </div>
  );
}
