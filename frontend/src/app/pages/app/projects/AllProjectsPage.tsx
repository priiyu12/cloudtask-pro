import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Grid2X2, List, Search, Pencil, CalendarDays } from "lucide-react";
import { api } from "../../../lib/api";

type ProjectMember = { user: { name: string; avatar_color: string } };
type Project = { id: number; name: string; description: string | null; owner_id: number; created_at: string; members?: ProjectMember[] };

const PROJECT_COLORS = ["var(--color-accent)", "#8B5CF6", "#F59E0B", "#22C55E", "#EF4444", "#EC4899"];

const STATUS_COLORS: Record<string, string> = {
  "In Progress": "bg-accent/15 text-accent",
  Done: "bg-[#22C55E]/15 text-[#22C55E]",
  Completed: "bg-[#22C55E]/15 text-[#22C55E]",
  Review: "bg-[#F59E0B]/15 text-[#F59E0B]",
  Todo: "bg-white/[0.08] text-muted-foreground",
  Planning: "bg-white/[0.08] text-muted-foreground",
};

const FILTERS = ["All", "Active", "Review", "Done"];

function MemberAvatars({ members }: { members: { l: string; c: string }[] }) {
  const visible = members.slice(0, 3);
  const overflow = members.length - 3;
  return (
    <div className="flex items-center -space-x-2">
      {visible.map((m, i) => (
        <span
          key={i}
          className="w-7 h-7 rounded-full border-2 border-[#111111] flex items-center justify-center text-[10px] font-bold text-foreground"
          style={{ backgroundColor: m.c }}
        >
          {m.l}
        </span>
      ))}
      {overflow > 0 && (
        <span className="w-7 h-7 rounded-full border-2 border-[#111111] flex items-center justify-center text-[10px] font-bold bg-white/[0.1] text-muted-foreground">
          +{overflow}
        </span>
      )}
    </div>
  );
}

export default function AllProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.get<Project[]>("/projects").catch(() => []),
      api.get<any[]>("/tasks").catch(() => [])
    ]).then(([projectData, taskData]) => {
      setProjects(projectData);
      setTasks(taskData);
    }).finally(() => setIsLoading(false));
  }, []);

  const getMeta = (project: Project, allProjects: Project[]) => {
    const index = allProjects.findIndex((p) => p.id === project.id);
    const i = index >= 0 ? index : 0;
    
    const projectTasks = tasks.filter((t) => t.project_id === project.id);
    const openTasks = projectTasks.filter((t) => t.status !== "Done" && t.status !== "Completed").length;
    const progress = projectTasks.length ? Math.round(((projectTasks.length - openTasks) / projectTasks.length) * 100) : 0;
    const status = projectTasks.length === 0 ? "Planning" : (progress === 100 ? "Done" : "In Progress");

    return {
      color: PROJECT_COLORS[i % PROJECT_COLORS.length],
      status: status,
      progress: progress,
      deadline: `Created ${new Date(project.created_at).toLocaleDateString()}`,
      members: project.members?.length 
        ? project.members.map((m) => ({
            l: m.user?.name ? m.user.name.charAt(0).toUpperCase() : (m.user as any)?.full_name?.charAt(0)?.toUpperCase() || "U",
            c: m.user?.avatar_color || "var(--color-accent)"
          }))
        : [],
    };
  };

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const query = search.toLowerCase();
        const matchSearch =
          p.name.toLowerCase().includes(query) || (p.description ?? "").toLowerCase().includes(query);
        const meta = getMeta(p, projects);
        const matchFilter =
          activeFilter === "All" ||
          (activeFilter === "Active" && meta.status === "In Progress") ||
          (activeFilter === "Review" && meta.status === "Review") ||
          (activeFilter === "Done" && meta.status === "Done");
        return matchSearch && matchFilter;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projects, search, activeFilter],
  );

  return (
    <div className="bg-background min-h-full text-foreground p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-[clamp(1.75rem,2.5vw,2.4rem)] font-semibold tracking-[-0.04em] text-foreground">
            Projects
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-white/[0.08] text-muted-foreground text-sm font-semibold">
            {projects.length}
          </span>
        </div>
        <Link
          to="/app/projects/create"
          className="rounded-full bg-accent hover:bg-[#0284C7] text-foreground text-sm font-semibold px-5 py-2.5 transition-colors flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> New Project
        </Link>
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.03] px-4 py-2.5 flex-1">
            <Search size={15} className="text-muted-foreground shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-transparent outline-none text-foreground placeholder:text-foreground/25 text-sm"
            />
          </div>
          <div className="flex items-center rounded-xl border border-border bg-white/[0.03] p-1">
            <button
              onClick={() => setLayout("grid")}
              className={`p-2 rounded-lg transition-colors ${layout === "grid" ? "bg-white/[0.1] text-foreground" : "text-foreground/35 hover:text-muted-foreground"}`}
              aria-label="Grid view"
            >
              <Grid2X2 size={16} />
            </button>
            <button
              onClick={() => setLayout("list")}
              className={`p-2 rounded-lg transition-colors ${layout === "list" ? "bg-white/[0.1] text-foreground" : "text-foreground/35 hover:text-muted-foreground"}`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeFilter === filter ? "bg-primary text-primary-foreground" : "text-foreground/45 hover:text-foreground/75 hover:bg-secondary"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse flex flex-col gap-3">
              <div className="h-4 bg-secondary rounded w-1/2"></div>
              <div className="h-8 bg-secondary rounded w-full mt-2"></div>
              <div className="h-4 bg-secondary rounded w-3/4 mt-auto"></div>
            </div>
          ))}
        </div>
      ) : !filtered.length ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-16 flex flex-col items-center justify-center text-center">
          <svg className="w-24 h-24 text-foreground/10 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
            <path d="M12 10v6" />
            <path d="M9 13h6" />
          </svg>
          <h3 className="text-foreground font-medium mb-1">No projects found</h3>
          <p className="text-muted-foreground text-sm max-w-xs">We couldn't find any projects matching your search criteria.</p>
        </div>
      ) : layout === "grid" ? (
        /* ── GRID VIEW ── */
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const meta = getMeta(project, projects);
            const statusCls = STATUS_COLORS[meta.status] ?? "bg-white/[0.08] text-muted-foreground";
            return (
              <div
                key={project.id}
                onClick={() => navigate(`/app/projects/${project.id}`)}
                className="group relative bg-card border border-border rounded-2xl p-5 hover:border-border/80 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                {/* Edit icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/app/projects/${project.id}/edit`);
                  }}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-muted-foreground hover:text-foreground"
                  aria-label="Edit project"
                >
                  <Pencil size={13} />
                </button>

                {/* Card header */}
                <div className="flex items-start gap-3 pr-8">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: meta.color }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-foreground font-semibold text-[15px] leading-snug truncate">{project.name}</p>
                    </div>
                    <span className={`mt-1.5 inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusCls}`}>
                      {meta.status}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-xs mt-3 line-clamp-2 leading-relaxed">
                  {project.description ?? "No description provided for this project."}
                </p>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] text-foreground/35 mb-1.5">
                    <span>Progress</span>
                    <span>{meta.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${meta.progress}%`, backgroundColor: meta.color }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-foreground/35">
                    <CalendarDays size={12} />
                    <span>Due {meta.deadline}</span>
                  </div>
                  <MemberAvatars members={meta.members} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── LIST VIEW ── */
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-foreground/35 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/35 uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/35 uppercase tracking-wider hidden lg:table-cell">Progress</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/35 uppercase tracking-wider hidden lg:table-cell">Deadline</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/35 uppercase tracking-wider hidden xl:table-cell">Members</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-foreground/35 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => {
                const meta = getMeta(project, projects);
                const statusCls = STATUS_COLORS[meta.status] ?? "bg-white/[0.08] text-muted-foreground";
                return (
                  <tr
                    key={project.id}
                    className="border-b border-white/[0.04] hover:bg-card transition-colors group"
                  >
                    {/* Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                        <div className="min-w-0">
                          <p className="text-foreground text-sm font-semibold truncate">{project.name}</p>
                          {project.description && (
                            <p className="text-foreground/35 text-xs truncate max-w-[220px]">{project.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusCls}`}>
                        {meta.status}
                      </span>
                    </td>
                    {/* Progress */}
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${meta.progress}%`, backgroundColor: meta.color }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium shrink-0">{meta.progress}%</span>
                      </div>
                    </td>
                    {/* Deadline */}
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays size={12} />
                        <span>Due {meta.deadline}</span>
                      </div>
                    </td>
                    {/* Members */}
                    <td className="px-4 py-4 hidden xl:table-cell">
                      <MemberAvatars members={meta.members} />
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/app/projects/${project.id}`}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg bg-secondary hover:bg-white/[0.08]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View
                        </Link>
                        <button
                          onClick={() => navigate(`/app/projects/${project.id}/edit`)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
