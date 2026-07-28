import { useState } from "react";
import { Link, useNavigate } from "react-router";

const allProjects = [
  {
    id: "p1",
    name: "Frontend Redesign",
    description: "Complete UI overhaul for main product, including new component library and design tokens.",
    status: "In Progress",
    progress: 68,
    color: "#0EA5E9",
    deadline: "Dec 28",
    members: [
      { label: "S", color: "#0EA5E9" },
      { label: "M", color: "#8B5CF6" },
      { label: "P", color: "#22C55E" },
    ],
  },
  {
    id: "p2",
    name: "API v2 Migration",
    description: "Migrate all endpoints to new REST API with improved authentication and response formats.",
    status: "Review",
    progress: 85,
    color: "#8B5CF6",
    deadline: "Dec 20",
    members: [
      { label: "A", color: "#F59E0B" },
      { label: "L", color: "#EF4444" },
      { label: "S", color: "#0EA5E9" },
    ],
  },
  {
    id: "p3",
    name: "Mobile App Launch",
    description: "iOS + Android launch prep including App Store submissions and marketing assets.",
    status: "Planning",
    progress: 23,
    color: "#F59E0B",
    deadline: "Jan 15",
    members: [
      { label: "M", color: "#8B5CF6" },
      { label: "P", color: "#22C55E" },
    ],
  },
  {
    id: "p4",
    name: "Design System 2.0",
    description: "Component library rebuild with updated tokens, dark mode support, and accessibility improvements.",
    status: "In Progress",
    progress: 45,
    color: "#22C55E",
    deadline: "Jan 30",
    members: [{ label: "M", color: "#8B5CF6" }],
  },
  {
    id: "p5",
    name: "Backend Refactor",
    description: "Performance improvements and code quality enhancements across the backend services.",
    status: "In Progress",
    progress: 61,
    color: "#EF4444",
    deadline: "Dec 31",
    members: [
      { label: "A", color: "#F59E0B" },
      { label: "L", color: "#EF4444" },
    ],
  },
  {
    id: "p6",
    name: "Q1 2025 Planning",
    description: "Roadmap and OKRs for Q1 2025, including team capacity planning and sprint setup.",
    status: "Done",
    progress: 100,
    color: "#22C55E",
    deadline: "Dec 15",
    members: [
      { label: "S", color: "#0EA5E9" },
      { label: "M", color: "#8B5CF6" },
      { label: "A", color: "#F59E0B" },
      { label: "P", color: "#22C55E" },
      { label: "L", color: "#EF4444" },
    ],
  },
];

type Tab = "All" | "Active" | "Review" | "Done";
type ViewMode = "grid" | "list";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "In Progress": "bg-[#0EA5E9]/15 text-[#0EA5E9]",
    "Done": "bg-[#22C55E]/15 text-[#22C55E]",
    "Completed": "bg-[#22C55E]/15 text-[#22C55E]",
    "Review": "bg-[#F59E0B]/15 text-[#F59E0B]",
    "Todo": "bg-white/[0.08] text-white/50",
    "Planning": "bg-white/[0.08] text-white/50",
    "Overdue": "bg-[#EF4444]/15 text-[#EF4444]",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? "bg-white/[0.08] text-white/50"}`}>
      {status}
    </span>
  );
}

export default function AllProjectsPage() {
  const [tab, setTab] = useState<Tab>("All");
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = allProjects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (tab === "All") return true;
    if (tab === "Active") return p.status === "In Progress";
    if (tab === "Review") return p.status === "Review";
    if (tab === "Done") return p.status === "Done";
    return true;
  });

  const tabs: Tab[] = ["All", "Active", "Review", "Done"];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">Projects</h1>
          <span className="bg-white/[0.08] text-white/50 text-xs font-medium rounded-full px-2.5 py-0.5">
            {allProjects.length}
          </span>
        </div>
        <Link
          to="/app/projects/create"
          className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/20 w-60"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-white/[0.04] rounded-xl p-1 border border-white/[0.06]">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === t ? "bg-white/[0.1] text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-white/[0.04] rounded-xl p-1 border border-white/[0.06]">
          <button
            onClick={() => setView("grid")}
            className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? "bg-white/[0.1] text-white" : "text-white/40 hover:text-white/70"}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-1.5 rounded-lg transition-colors ${view === "list" ? "bg-white/[0.1] text-white" : "text-white/40 hover:text-white/70"}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-3 gap-5">
          {filtered.map((p) => (
            <Link
              key={p.id}
              to={`/app/projects/${p.id}`}
              className="group bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.14] transition-all block"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.color }} />
                  <h3 className="text-white font-medium text-sm group-hover:text-[#0EA5E9] transition-colors">{p.name}</h3>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <p className="text-white/40 text-xs leading-relaxed mb-4 line-clamp-2">{p.description}</p>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white/30 text-xs">Progress</span>
                  <span className="text-white/60 text-xs">{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.color }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white/30 text-xs">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Due {p.deadline}
                </div>
                <div className="flex -space-x-1.5">
                  {p.members.slice(0, 4).map((m, i) => (
                    <span
                      key={i}
                      className="w-6 h-6 rounded-full border border-[#0a0a0a] flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: m.color }}
                    >
                      {m.label}
                    </span>
                  ))}
                  {p.members.length > 4 && (
                    <span className="w-6 h-6 rounded-full border border-[#0a0a0a] bg-white/[0.1] flex items-center justify-center text-[10px] text-white/50">
                      +{p.members.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Name", "Status", "Progress", "Deadline", "Members", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-white/40 text-xs font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={p.id}
                  className={`hover:bg-white/[0.02] transition-colors ${i < filtered.length - 1 ? "border-b border-white/[0.04]" : ""}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                      <Link to={`/app/projects/${p.id}`} className="text-white text-sm hover:text-[#0EA5E9] transition-colors">
                        {p.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.color }} />
                      </div>
                      <span className="text-white/40 text-xs">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-white/50 text-sm">{p.deadline}</td>
                  <td className="px-5 py-4">
                    <div className="flex -space-x-1.5">
                      {p.members.slice(0, 3).map((m, idx) => (
                        <span
                          key={idx}
                          className="w-6 h-6 rounded-full border border-[#0a0a0a] flex items-center justify-center text-[10px] font-bold text-white"
                          style={{ background: m.color }}
                        >
                          {m.label}
                        </span>
                      ))}
                      {p.members.length > 3 && (
                        <span className="w-6 h-6 rounded-full border border-[#0a0a0a] bg-white/[0.1] flex items-center justify-center text-[10px] text-white/50">
                          +{p.members.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/app/projects/${p.id}`}
                        className="p-1.5 text-white/30 hover:text-white/70 hover:bg-white/[0.06] rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => navigate(`/app/projects/${p.id}/edit`)}
                        className="p-1.5 text-white/30 hover:text-white/70 hover:bg-white/[0.06] rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-white/30 text-sm">No projects match your filter.</div>
          )}
        </div>
      )}
    </div>
  );
}
