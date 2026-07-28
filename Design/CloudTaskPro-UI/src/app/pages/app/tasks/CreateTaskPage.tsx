import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const PROJECTS = ["API v2 Migration", "Frontend Redesign", "Mobile App Launch", "Backend Refactor", "Design System 2.0"];
const ASSIGNEES = ["Sarah", "Marcus", "Alex", "Priya"];
const STATUSES = ["Todo", "In Progress", "Review", "Done"];

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const [priority, setPriority] = useState("Medium");

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Back link */}
      <Link
        to="/app/tasks"
        className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors w-fit"
      >
        <ArrowLeft size={15} /> All Tasks
      </Link>

      <h1 className="text-white text-2xl font-semibold mb-8">New Task</h1>

      <div className="space-y-6">
        {/* Task name */}
        <div>
          <input
            type="text"
            placeholder="Task name..."
            className="w-full bg-transparent text-white text-lg font-medium placeholder-white/20 border-b border-white/[0.08] pb-3 focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Description</label>
          <textarea
            rows={3}
            placeholder="Add a description..."
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-[#0EA5E9]/40 resize-none transition-colors"
          />
        </div>

        {/* Grid fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* Project */}
          <div>
            <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Project</label>
            <select className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-[#0EA5E9]/40 transition-colors appearance-none cursor-pointer">
              <option value="" className="bg-[#141414]">Select project...</option>
              {PROJECTS.map((p) => (
                <option key={p} value={p} className="bg-[#141414]">{p}</option>
              ))}
            </select>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Assignee</label>
            <select className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-[#0EA5E9]/40 transition-colors appearance-none cursor-pointer">
              <option value="" className="bg-[#141414]">Unassigned</option>
              {ASSIGNEES.map((a) => (
                <option key={a} value={a} className="bg-[#141414]">{a}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Status</label>
            <select className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-[#0EA5E9]/40 transition-colors appearance-none cursor-pointer">
              {STATUSES.map((s) => (
                <option key={s} value={s} className="bg-[#141414]">{s}</option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Due Date</label>
            <input
              type="date"
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-[#0EA5E9]/40 transition-colors cursor-pointer"
            />
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-white/40 text-xs font-medium mb-3 uppercase tracking-wider">Priority</label>
          <div className="flex items-center gap-3">
            {[
              { value: "High", color: "#EF4444" },
              { value: "Medium", color: "#F59E0B" },
              { value: "Low", color: "rgba(255,255,255,0.3)" },
            ].map(({ value, color }) => (
              <button
                key={value}
                onClick={() => setPriority(value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  priority === value
                    ? "border-white/20 bg-white/[0.06]"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                <span style={{ color: priority === value ? color : "rgba(255,255,255,0.5)" }}>{value}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => navigate("/app/tasks")}
            className="flex-1 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Create Task
          </button>
          <Link
            to="/app/tasks"
            className="px-6 py-3 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] text-white/60 font-medium rounded-xl text-sm transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
