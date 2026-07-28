import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Trash2 } from "lucide-react";

const PROJECTS = ["API v2 Migration", "Frontend Redesign", "Mobile App Launch", "Backend Refactor", "Design System 2.0"];
const ASSIGNEES = ["Sarah", "Marcus", "Alex", "Priya"];
const STATUSES = ["Todo", "In Progress", "Review", "Done"];

// Pre-filled with t1 data
const TASK_T1 = {
  name: "Implement auth refresh tokens",
  description:
    "Implement a secure token refresh mechanism for the API authentication system. This involves creating a refresh token endpoint, storing tokens securely, handling token expiration gracefully, and ensuring the client can silently re-authenticate without disrupting the user experience.",
  project: "API v2 Migration",
  assignee: "Sarah",
  status: "In Progress",
  priority: "High",
  due: "2024-12-16",
};

export default function EditTaskPage() {
  const navigate = useNavigate();
  const [name, setName] = useState(TASK_T1.name);
  const [description, setDescription] = useState(TASK_T1.description);
  const [project, setProject] = useState(TASK_T1.project);
  const [assignee, setAssignee] = useState(TASK_T1.assignee);
  const [status, setStatus] = useState(TASK_T1.status);
  const [priority, setPriority] = useState(TASK_T1.priority);
  const [due, setDue] = useState(TASK_T1.due);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Back */}
      <Link
        to="/app/tasks"
        className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors w-fit"
      >
        <ArrowLeft size={15} /> All Tasks
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-white text-2xl font-semibold">Edit Task</h1>
        <span className="text-white/30 text-xs font-mono">t1</span>
      </div>

      <div className="space-y-6">
        {/* Task name */}
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent text-white text-lg font-medium placeholder-white/20 border-b border-white/[0.08] pb-3 focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-[#0EA5E9]/40 resize-none transition-colors"
          />
        </div>

        {/* Grid fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* Project */}
          <div>
            <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Project</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-[#0EA5E9]/40 transition-colors appearance-none cursor-pointer"
            >
              {PROJECTS.map((p) => (
                <option key={p} value={p} className="bg-[#141414]">{p}</option>
              ))}
            </select>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Assignee</label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-[#0EA5E9]/40 transition-colors appearance-none cursor-pointer"
            >
              {ASSIGNEES.map((a) => (
                <option key={a} value={a} className="bg-[#141414]">{a}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-[#0EA5E9]/40 transition-colors appearance-none cursor-pointer"
            >
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
              value={due}
              onChange={(e) => setDue(e.target.value)}
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
            Save Changes
          </button>
          <Link
            to="/app/tasks"
            className="px-6 py-3 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] text-white/60 font-medium rounded-xl text-sm transition-colors"
          >
            Cancel
          </Link>
        </div>

        {/* Danger zone */}
        <div className="pt-4 border-t border-white/[0.05]">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 text-[#EF4444]/60 hover:text-[#EF4444] text-sm transition-colors"
            >
              <Trash2 size={14} /> Delete Task
            </button>
          ) : (
            <div className="bg-[#EF4444]/5 border border-[#EF4444]/15 rounded-xl p-4">
              <p className="text-white/70 text-sm mb-3">Are you sure you want to delete this task? This cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/app/tasks")}
                  className="bg-[#EF4444] hover:bg-[#EF4444]/90 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-white/[0.05] hover:bg-white/[0.08] text-white/60 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
