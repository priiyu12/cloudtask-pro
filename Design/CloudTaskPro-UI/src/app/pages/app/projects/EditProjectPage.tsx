import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const COLORS = ["#0EA5E9", "#8B5CF6", "#22C55E", "#F59E0B", "#EF4444", "#EC4899"];

const MEMBERS = [
  { label: "S", color: "#0EA5E9", name: "Sarah Chen", role: "Designer" },
  { label: "M", color: "#8B5CF6", name: "Marcus Webb", role: "PM" },
  { label: "A", color: "#F59E0B", name: "Alex Kim", role: "Engineer" },
  { label: "P", color: "#22C55E", name: "Priya Sharma", role: "Engineer" },
  { label: "L", color: "#EF4444", name: "Lena Müller", role: "Designer" },
];

const TIPS = [
  {
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Review milestones",
    desc: "When editing, make sure your milestones still reflect the current state of the project.",
  },
  {
    icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    title: "Notify the team",
    desc: "After saving significant changes, consider posting an update to the project activity feed.",
  },
  {
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Keep history",
    desc: "Changes are tracked automatically. Team members can see what was changed and when.",
  },
];

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [form, setForm] = useState({
    name: "Frontend Redesign",
    description:
      "Complete UI overhaul for the main product, including new component library and design tokens.",
    status: "In Progress",
    priority: "High",
    startDate: "2024-11-01",
    endDate: "2024-12-28",
    color: "#0EA5E9",
    members: ["Sarah Chen", "Marcus Webb", "Priya Sharma"],
  });

  const toggleMember = (name: string) => {
    setForm((f) => ({
      ...f,
      members: f.members.includes(name)
        ? f.members.filter((m) => m !== name)
        : [...f.members, name],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/app/projects/${id ?? "p1"}`);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      navigate("/app/projects");
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div className="p-8 max-w-6xl">
      {/* Back */}
      <Link
        to={`/app/projects/${id ?? "p1"}`}
        className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Project
      </Link>

      <h1 className="text-2xl font-semibold text-white mb-6">Edit Project</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="col-span-2 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-white/60 text-sm font-medium mb-2">
              Project Name <span className="text-[#EF4444]">*</span>
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-base placeholder-white/25 outline-none focus:border-[#0EA5E9]/50 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white/60 text-sm font-medium mb-2">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-[#0EA5E9]/50 transition-colors resize-none"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#0EA5E9]/50 transition-colors appearance-none"
              >
                {["Todo", "In Progress", "Review", "Done"].map((s) => (
                  <option key={s} value={s} className="bg-[#141414]">{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#0EA5E9]/50 transition-colors appearance-none"
              >
                {["High", "Medium", "Low"].map((p) => (
                  <option key={p} value={p} className="bg-[#141414]">{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#0EA5E9]/50 transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#0EA5E9]/50 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-white/60 text-sm font-medium mb-2">Project Color</label>
            <div className="flex items-center gap-3">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                  style={{
                    background: c,
                    outline: form.color === c ? `3px solid ${c}` : "none",
                    outlineOffset: "2px",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div>
            <label className="block text-white/60 text-sm font-medium mb-3">Team Members</label>
            <div className="space-y-2">
              {MEMBERS.map((m) => (
                <label
                  key={m.name}
                  className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:border-white/[0.1] cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={form.members.includes(m.name)}
                    onChange={() => toggleMember(m.name)}
                    className="w-4 h-4 rounded accent-[#0EA5E9]"
                  />
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: m.color }}
                  >
                    {m.label}
                  </span>
                  <div>
                    <p className="text-white text-sm">{m.name}</p>
                    <p className="text-white/40 text-xs">{m.role}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Save Changes
            </button>
            <Link
              to={`/app/projects/${id ?? "p1"}`}
              className="text-white/40 hover:text-white text-sm transition-colors px-4 py-3"
            >
              Cancel
            </Link>
          </div>

          {/* Delete */}
          <div className="pt-4 border-t border-white/[0.06]">
            <h3 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Danger Zone</h3>
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[#EF4444] text-sm font-medium">Delete this project</p>
                <p className="text-white/30 text-xs mt-0.5">
                  {confirmDelete
                    ? "This cannot be undone. Click again to confirm."
                    : "All tasks, files, and activity will be permanently removed."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleDelete}
                className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
                  confirmDelete
                    ? "bg-[#EF4444] text-white hover:bg-[#EF4444]/90"
                    : "bg-[#EF4444]/20 text-[#EF4444] hover:bg-[#EF4444]/30"
                }`}
              >
                {confirmDelete ? "Confirm Delete" : "Delete Project"}
              </button>
            </div>
          </div>
        </form>

        {/* Tips Sidebar */}
        <div className="space-y-4">
          <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider">Tips</h2>
          {TIPS.map((tip) => (
            <div key={tip.title} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#0EA5E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={tip.icon} />
                  </svg>
                </div>
                <p className="text-white text-sm font-medium">{tip.title}</p>
              </div>
              <p className="text-white/40 text-xs leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
