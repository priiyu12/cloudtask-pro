import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../../../lib/api";
import { Lightbulb, Clock, Users } from "lucide-react";

const COLOR_SWATCHES = ["var(--color-accent)", "#8B5CF6", "#22C55E", "#F59E0B", "#EF4444", "#EC4899"];

const TIPS = [
  {
    icon: <Lightbulb size={16} className="text-[#F59E0B]" />,
    title: "Be specific",
    desc: "Clear, descriptive names help your whole team stay aligned from day one.",
  },
  {
    icon: <Clock size={16} className="text-accent" />,
    title: "Set realistic deadlines",
    desc: "Build in 10–20% extra buffer time to handle unexpected blockers.",
  },
  {
    icon: <Users size={16} className="text-[#22C55E]" />,
    title: "Assign ownership",
    desc: "Invite team members early so everyone knows their responsibilities.",
  },
];

const fieldCls =
  "w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-accent/50 transition-colors";

export default function CreateProjectPage() {
  const navigate = useNavigate();

  // API fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [ownerId, setOwnerId] = useState<number | "">("");

  useEffect(() => {
    Promise.all([api.me(), api.get<any[]>('/workspaces/members')])
      .then(([user, membersRes]) => {
        setOwnerId(user.id);
        setTeamMembers(membersRes || []);
      })
      .catch(console.error);
  }, []);

  // Visual-only fields
  const [status, setStatus] = useState("In Progress");
  const [priority, setPriority] = useState("Medium");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_SWATCHES[0]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const toggleMember = (name: string) =>
    setSelectedMembers((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const project = await api.post<{ id: number }>("/projects", {
        name,
        description,
        owner_id: ownerId ? Number(ownerId) : 1,
      });
      navigate(`/app/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-full text-foreground p-8">
      <Link
        to="/app/projects"
        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
      >
        ← Back to Projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 max-w-5xl">
        {/* ── FORM ── */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 space-y-6">
          <div>
            <p className="text-accent text-xs font-semibold uppercase tracking-[0.22em]">New Project</p>
            <h1 className="text-foreground text-2xl font-semibold mt-2 tracking-[-0.03em]">
              Create a workspace-ready project
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              Projects connect tasks, analytics, and progress into one cloud-ready view.
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-muted-foreground text-sm font-medium mb-2">
              Project Name <span className="text-[#EF4444]">*</span>
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q2 Marketing Campaign"
              className={fieldCls}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-muted-foreground text-sm font-medium mb-2">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the outcome, scope, and team goals..."
              className={`${fieldCls} resize-none`}
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-muted-foreground text-sm font-medium mb-2">Project Manager</label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value === "" ? "" : Number(e.target.value))}
                className={`${fieldCls} appearance-none`}
              >
                <option value="" disabled>Select Manager</option>
                {teamMembers.map((m) => (
                  <option key={m.user.id} value={m.user.id} className="bg-card">
                    {m.user.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-muted-foreground text-sm font-medium mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`${fieldCls} appearance-none`}
              >
                {["In Progress", "Planning", "Review", "Done"].map((s) => (
                  <option key={s} value={s} className="bg-card">{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-muted-foreground text-sm font-medium mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`${fieldCls} appearance-none`}
              >
                {["Low", "Medium", "High", "Critical"].map((p) => (
                  <option key={p} value={p} className="bg-card">{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Start + End dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={fieldCls}
                style={{ colorScheme: "dark" }}
              />
            </div>
            <div>
              <label className="block text-muted-foreground text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={fieldCls}
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-muted-foreground text-sm font-medium mb-3">Project Color</label>
            <div className="flex items-center gap-2.5">
              {COLOR_SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{
                    backgroundColor: c,
                    outline: selectedColor === c ? `2px solid ${c}` : "2px solid transparent",
                    outlineOffset: "2px",
                  }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          {/* Team members */}
          <div>
            <label className="block text-muted-foreground text-sm font-medium mb-3">Team Members</label>
            <div className="space-y-2">
              {teamMembers.map((m) => {
                const user = m.user;
                const initials = user.name ? user.name.split(" ").map((n: string) => n[0]).join("").substring(0,2).toUpperCase() : "U";
                return (
                <label
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-white/[0.12] cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user.id.toString())}
                    onChange={() => toggleMember(user.id.toString())}
                    className="accent-[#0EA5E9] w-4 h-4 rounded"
                  />
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-foreground"
                    style={{ backgroundColor: user.avatar_color || "var(--color-accent)" }}
                  >
                    {initials}
                  </span>
                  <div>
                    <p className="text-foreground text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-foreground/35">{m.role}</p>
                  </div>
                </label>
              )})}
            </div>
          </div>

          {error && <p className="text-[#EF4444] text-sm">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-accent hover:bg-[#0284C7] disabled:opacity-50 text-foreground text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              {loading ? "Creating…" : "Create Project"}
            </button>
            <Link to="/app/projects" className="text-muted-foreground hover:text-foreground text-sm px-4 py-3 transition-colors">
              Cancel
            </Link>
          </div>
        </form>

        {/* ── TIPS SIDEBAR ── */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.22em] mb-4">Tips</p>
            <div className="space-y-4">
              {TIPS.map((tip) => (
                <div key={tip.title} className="rounded-xl border border-border bg-card p-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    {tip.icon}
                    <p className="text-foreground text-sm font-semibold">{tip.title}</p>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.22em]">CloudTask Pro</p>
            <h2 className="text-foreground font-semibold mt-2 leading-snug">Production habits from day one.</h2>
            <div className="mt-4 space-y-2.5">
              {["Private VPC-ready backend", "RDS PostgreSQL task data", "ALB + autoscaling deployment"].map((item) => (
                <div key={item} className="rounded-xl border border-border bg-white/[0.03] px-3 py-2.5 text-muted-foreground text-xs">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
