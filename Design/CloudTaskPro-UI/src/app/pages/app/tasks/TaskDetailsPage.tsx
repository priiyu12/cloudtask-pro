import { Link } from "react-router";
import { ArrowLeft, Calendar, Folder, User, Flag, CheckCircle2, Pencil, Trash2, MessageSquare, Activity } from "lucide-react";

const TASK = {
  id: "t1",
  name: "Implement auth refresh tokens",
  project: "API v2 Migration",
  priority: "High",
  status: "In Progress",
  assignee: { name: "Sarah", initial: "S", color: "#0EA5E9" },
  due: "Dec 16, 2024",
  created: "Dec 1, 2024",
  description:
    "Implement a secure token refresh mechanism for the API authentication system. This involves creating a refresh token endpoint, storing tokens securely, handling token expiration gracefully, and ensuring the client can silently re-authenticate without disrupting the user experience. The implementation should follow OAuth 2.0 best practices and include proper token rotation to prevent replay attacks.",
};

const COMMENTS = [
  {
    id: 1,
    author: "Marcus",
    initial: "M",
    color: "#8B5CF6",
    time: "2 hours ago",
    text: "I've reviewed the initial implementation. The token rotation logic looks solid. One suggestion — consider adding a grace period for simultaneous requests during token refresh to avoid race conditions.",
  },
  {
    id: 2,
    author: "Priya",
    initial: "P",
    color: "#22C55E",
    time: "Yesterday at 4:30 PM",
    text: "Tested on mobile. The silent refresh is working smoothly on iOS. Android had one edge case with background refreshes — added a note in the test doc.",
  },
  {
    id: 3,
    author: "Alex",
    initial: "A",
    color: "#F59E0B",
    time: "Dec 13 at 11:00 AM",
    text: "API docs will need to be updated once this ships. I'll create a draft once the endpoint signatures are finalised. Should I use the existing auth doc structure?",
  },
];

const ACTIVITY = [
  { id: 1, text: "Status changed from \"Todo\" to \"In Progress\"", time: "Dec 5, 2024" },
  { id: 2, text: "Assigned to Sarah by Marcus", time: "Dec 3, 2024" },
  { id: 3, text: "Task created", time: "Dec 1, 2024" },
];

const STATUS_STYLES: Record<string, string> = {
  "In Progress": "bg-[#0EA5E9]/15 text-[#0EA5E9]",
  "Done": "bg-[#22C55E]/15 text-[#22C55E]",
  "Review": "bg-[#F59E0B]/15 text-[#F59E0B]",
  "Todo": "bg-white/[0.08] text-white/50",
};

const PRIORITY_COLORS: Record<string, string> = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "rgba(255,255,255,0.3)",
};

export default function TaskDetailsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Back */}
      <Link
        to="/app/tasks"
        className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors w-fit"
      >
        <ArrowLeft size={15} /> All Tasks
      </Link>

      {/* Title row */}
      <div className="flex items-start gap-3 mb-8">
        <h1 className="text-white text-2xl font-semibold leading-snug flex-1">{TASK.name}</h1>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 mt-1 ${STATUS_STYLES[TASK.status]}`}>
          {TASK.status}
        </span>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: 2/3 */}
        <div className="col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-white text-sm font-semibold mb-4">Description</h2>
            <p className="text-white/60 text-sm leading-relaxed">{TASK.description}</p>
          </div>

          {/* Comments */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare size={14} className="text-white/40" />
              <h2 className="text-white text-sm font-semibold">Comments</h2>
              <span className="bg-white/[0.06] text-white/40 text-xs px-2 py-0.5 rounded-full">{COMMENTS.length}</span>
            </div>
            <div className="space-y-5">
              {COMMENTS.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                    style={{ background: c.color }}
                  >
                    {c.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-white text-sm font-medium">{c.author}</span>
                      <span className="text-white/30 text-xs">{c.time}</span>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Comment input */}
            <div className="mt-5 pt-5 border-t border-white/[0.05] flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0EA5E9] flex items-center justify-center text-xs font-bold text-white shrink-0">
                S
              </div>
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-2.5 text-white/70 text-sm placeholder-white/20 focus:outline-none focus:border-[#0EA5E9]/40 transition-colors"
              />
            </div>
          </div>

          {/* Activity log */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Activity size={14} className="text-white/40" />
              <h2 className="text-white text-sm font-semibold">Activity</h2>
            </div>
            <div className="space-y-4">
              {ACTIVITY.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-white/60 text-sm">{a.text}</p>
                    <p className="text-white/30 text-xs mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: 1/3 */}
        <div className="space-y-4">
          {/* Metadata card */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <h2 className="text-white text-sm font-semibold mb-4">Details</h2>
            <div className="space-y-3.5">
              <div className="flex items-center gap-2.5">
                <User size={13} className="text-white/30 shrink-0" />
                <span className="text-white/40 text-xs w-20 shrink-0">Assignee</span>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: TASK.assignee.color }}
                  >
                    {TASK.assignee.initial}
                  </div>
                  <span className="text-white/70 text-xs">{TASK.assignee.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Folder size={13} className="text-white/30 shrink-0" />
                <span className="text-white/40 text-xs w-20 shrink-0">Project</span>
                <span className="text-white/70 text-xs">{TASK.project}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Flag size={13} className="text-white/30 shrink-0" />
                <span className="text-white/40 text-xs w-20 shrink-0">Priority</span>
                <span className="text-xs font-medium" style={{ color: PRIORITY_COLORS[TASK.priority] }}>
                  {TASK.priority}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={13} className="text-white/30 shrink-0" />
                <span className="text-white/40 text-xs w-20 shrink-0">Status</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[TASK.status]}`}>
                  {TASK.status}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar size={13} className="text-white/30 shrink-0" />
                <span className="text-white/40 text-xs w-20 shrink-0">Due</span>
                <span className="text-white/70 text-xs">{TASK.due}</span>
              </div>
              <div className="pt-2 border-t border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                  <Calendar size={13} className="text-white/30 shrink-0" />
                  <span className="text-white/40 text-xs w-20 shrink-0">Created</span>
                  <span className="text-white/50 text-xs">{TASK.created}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <Link
              to={`/app/tasks/${TASK.id}/edit`}
              className="flex items-center justify-center gap-2 w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
            >
              <Pencil size={14} /> Edit Task
            </Link>
            <button className="flex items-center justify-center gap-2 w-full bg-[#22C55E]/10 hover:bg-[#22C55E]/15 border border-[#22C55E]/20 text-[#22C55E] font-medium px-4 py-2.5 rounded-xl text-sm transition-colors">
              <CheckCircle2 size={14} /> Mark Complete
            </button>
            <button className="flex items-center justify-center gap-2 w-full bg-white/[0.03] hover:bg-[#EF4444]/10 border border-white/[0.06] hover:border-[#EF4444]/20 text-white/40 hover:text-[#EF4444] font-medium px-4 py-2.5 rounded-xl text-sm transition-colors">
              <Trash2 size={14} /> Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
