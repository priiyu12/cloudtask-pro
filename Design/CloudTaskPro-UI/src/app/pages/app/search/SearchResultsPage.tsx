import { useRef, useState } from "react";
import { Search, FolderOpen, CheckSquare, User } from "lucide-react";

type Tab = "all" | "projects" | "tasks" | "people";

interface Project {
  id: string;
  color: string;
  name: string;
  description: string;
  status: string;
  statusColor: string;
}

interface Task {
  id: string;
  name: string;
  project: string;
  priority: string;
  priorityColor: string;
  status: string;
  statusColor: string;
}

interface Member {
  id: string;
  initial: string;
  color: string;
  name: string;
  role: string;
}

const PROJECTS: Project[] = [
  {
    id: "1",
    color: "bg-[#0EA5E9]",
    name: "Design System v2",
    description: "Rebrand component library with new tokens and accessibility improvements",
    status: "In Progress",
    statusColor: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  },
  {
    id: "2",
    color: "bg-[#8B5CF6]",
    name: "Mobile App Rewrite",
    description: "Full React Native rewrite of the iOS and Android consumer apps",
    status: "Review",
    statusColor: "bg-[#F59E0B]/10 text-[#F59E0B]",
  },
  {
    id: "3",
    color: "bg-[#22C55E]",
    name: "Infrastructure Overhaul",
    description: "Migrate to Kubernetes and set up zero-downtime deployments",
    status: "Planning",
    statusColor: "bg-white/5 text-white/40",
  },
];

const TASKS: Task[] = [
  {
    id: "1",
    name: "Redesign onboarding flow",
    project: "Design System v2",
    priority: "High",
    priorityColor: "bg-[#EF4444]/10 text-[#EF4444]",
    status: "In Progress",
    statusColor: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  },
  {
    id: "2",
    name: "Set up CI/CD pipeline",
    project: "Infrastructure Overhaul",
    priority: "Critical",
    priorityColor: "bg-[#EF4444]/10 text-[#EF4444]",
    status: "Todo",
    statusColor: "bg-white/5 text-white/40",
  },
  {
    id: "3",
    name: "Write API integration tests",
    project: "Mobile App Rewrite",
    priority: "Medium",
    priorityColor: "bg-[#F59E0B]/10 text-[#F59E0B]",
    status: "Done",
    statusColor: "bg-[#22C55E]/10 text-[#22C55E]",
  },
  {
    id: "4",
    name: "Implement push notifications",
    project: "Mobile App Rewrite",
    priority: "High",
    priorityColor: "bg-[#EF4444]/10 text-[#EF4444]",
    status: "In Progress",
    statusColor: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  },
];

const MEMBERS: Member[] = [
  { id: "1", initial: "S", color: "bg-[#22C55E]", name: "Sarah Chen", role: "Product Designer" },
  { id: "2", initial: "J", color: "bg-[#0EA5E9]", name: "James Okafor", role: "Backend Engineer" },
  { id: "3", initial: "P", color: "bg-[#8B5CF6]", name: "Priya Nair", role: "Engineering Manager" },
];

export default function SearchResultsPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const TABS: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "projects", label: "Projects" },
    { key: "tasks", label: "Tasks" },
    { key: "people", label: "People" },
  ];

  const showProjects = tab === "all" || tab === "projects";
  const showTasks    = tab === "all" || tab === "tasks";
  const showPeople   = tab === "all" || tab === "people";

  return (
    <div className="p-8 max-w-3xl">
      {/* Search input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, tasks, people…"
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl pl-11 pr-4 py-3.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#0EA5E9]/40 focus:bg-white/[0.06] transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 text-xs transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 w-fit mb-7">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.key
                ? "bg-white/[0.08] text-white"
                : "text-white/35 hover:text-white/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-7">
        {/* Projects */}
        {showProjects && (
          <section>
            <h2 className="text-white/30 text-[11px] font-semibold uppercase tracking-wider mb-3">
              Projects · {PROJECTS.length}
            </h2>
            <div className="space-y-1">
              {PROJECTS.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-3.5 rounded-xl border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.07] transition-all cursor-pointer group"
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${p.color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium group-hover:text-white/90 transition-colors">{p.name}</p>
                    <p className="text-white/30 text-[12px] truncate mt-0.5">{p.description}</p>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg flex-shrink-0 ${p.statusColor}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tasks */}
        {showTasks && (
          <section>
            <h2 className="text-white/30 text-[11px] font-semibold uppercase tracking-wider mb-3">
              Tasks · {TASKS.length}
            </h2>
            <div className="space-y-1">
              {TASKS.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-4 p-3.5 rounded-xl border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.07] transition-all cursor-pointer group"
                >
                  <CheckSquare className="w-4 h-4 text-white/20 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium group-hover:text-white/90 truncate">{t.name}</p>
                    <p className="text-white/30 text-[12px] mt-0.5">{t.project}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg ${t.priorityColor}`}>
                      {t.priority}
                    </span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg ${t.statusColor}`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* People */}
        {showPeople && (
          <section>
            <h2 className="text-white/30 text-[11px] font-semibold uppercase tracking-wider mb-3">
              People · {MEMBERS.length}
            </h2>
            <div className="space-y-1">
              {MEMBERS.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-4 p-3.5 rounded-xl border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.07] transition-all cursor-pointer group"
                >
                  <div className={`w-9 h-9 rounded-full ${m.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {m.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium group-hover:text-white/90">{m.name}</p>
                    <p className="text-white/30 text-[12px] mt-0.5">{m.role}</p>
                  </div>
                  <User className="w-4 h-4 text-white/15 flex-shrink-0" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
