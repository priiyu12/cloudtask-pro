import { useState } from "react";
import { Link, useNavigate } from "react-router";

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
    title: "Be specific",
    desc: "Clear project names and descriptions help your team stay aligned on goals.",
  },
  {
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Set realistic deadlines",
    desc: "Buffer time reduces stress. Add 10–20% more time than you think you need.",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0",
    title: "Assign ownership",
    desc: "Invite your team early so everyone knows their responsibilities from day one.",
  },
];

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Todo",
    priority: "Medium",
    startDate: "",
    endDate: "",
    color: COLORS[0],
    members: [] as string[],
  });

  const toggleMember = (name: string) => {
    setForm((f) => ({
      ...f,
      members: f.members.includes(name) ? f.members.filter((m) => m !== name) : [...f.members, name],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/app/projects");
  };

  return (
    <div className="p-8 max-w-6xl">
      {/* Back */}
      <Link to="/app/projects" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Projects
      </Link>

      <h1 className="text-2xl font-semibold text-white mb-6">Create Project</h1>

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
              placeholder="e.g. Q2 Marketing Campaign"
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
              placeholder="Describe the project goals and scope..."
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
                <label key={m.name} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:border-white/[0.1] cursor-pointer transition-colors">
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

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Create Project
            </button>
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
