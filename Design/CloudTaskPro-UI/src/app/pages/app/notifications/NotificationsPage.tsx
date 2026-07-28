import { useState } from "react";
import {
  CheckCircle2, AtSign, UserPlus, FolderOpen, Users, Clock, Bell,
} from "lucide-react";

type NotifType = "task_complete" | "mention" | "task_assign" | "project_update" | "team_join" | "deadline" | "task_done";

interface Notification {
  id: string;
  type: NotifType;
  avatar: { initial: string; color: string };
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

const TYPE_META: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
  task_complete: { icon: CheckCircle2, color: "text-[#22C55E]", bg: "bg-[#22C55E]/15" },
  mention:       { icon: AtSign,       color: "text-[#0EA5E9]", bg: "bg-[#0EA5E9]/15" },
  task_assign:   { icon: Bell,         color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/15" },
  project_update:{ icon: FolderOpen,   color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/15" },
  team_join:     { icon: Users,        color: "text-[#0EA5E9]", bg: "bg-[#0EA5E9]/15" },
  deadline:      { icon: Clock,        color: "text-[#EF4444]", bg: "bg-[#EF4444]/15" },
  task_done:     { icon: CheckCircle2, color: "text-[#22C55E]", bg: "bg-[#22C55E]/15" },
};

const INITIAL: Notification[] = [
  {
    id: "1",
    type: "task_complete",
    avatar: { initial: "S", color: "bg-[#22C55E]" },
    title: "Sarah completed a task",
    body: "\"Redesign onboarding flow\" has been marked as complete in Design System v2.",
    timestamp: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "mention",
    avatar: { initial: "J", color: "bg-[#0EA5E9]" },
    title: "James mentioned you",
    body: "@marcus can you review the API docs PR before end of day? Need your sign-off.",
    timestamp: "14 min ago",
    read: false,
  },
  {
    id: "3",
    type: "task_assign",
    avatar: { initial: "P", color: "bg-[#8B5CF6]" },
    title: "Task assigned to you",
    body: "\"Set up CI/CD pipeline\" in Infrastructure Overhaul has been assigned to you by Priya.",
    timestamp: "1 hr ago",
    read: false,
  },
  {
    id: "4",
    type: "project_update",
    avatar: { initial: "A", color: "bg-[#F59E0B]" },
    title: "Project status updated",
    body: "\"Mobile App Rewrite\" moved from In Progress → Review. 3 tasks are awaiting approval.",
    timestamp: "3 hr ago",
    read: false,
  },
  {
    id: "5",
    type: "team_join",
    avatar: { initial: "L", color: "bg-[#0EA5E9]" },
    title: "New team member joined",
    body: "Lena Fischer joined the workspace. Welcome them to the CloudTask Pro team!",
    timestamp: "Yesterday",
    read: true,
  },
  {
    id: "6",
    type: "deadline",
    avatar: { initial: "M", color: "bg-[#EF4444]" },
    title: "Deadline approaching",
    body: "\"Q4 Roadmap Presentation\" is due in 24 hours. 2 subtasks are still incomplete.",
    timestamp: "Yesterday",
    read: true,
  },
  {
    id: "7",
    type: "task_done",
    avatar: { initial: "D", color: "bg-[#22C55E]" },
    title: "Task marked done",
    body: "\"Write API integration tests\" was completed by Dev Bot. All checks passing.",
    timestamp: "Dec 14",
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL);
  const [tab, setTab] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const visible = tab === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-white text-2xl font-semibold tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-[#0EA5E9] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-[#0EA5E9] text-sm hover:text-[#38BDF8] transition-colors font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 w-fit mb-6">
        {(["all", "unread"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
              tab === t
                ? "bg-white/[0.08] text-white"
                : "text-white/35 hover:text-white/60"
            }`}
          >
            {t === "unread" ? `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}` : "All"}
          </button>
        ))}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <Bell className="w-5 h-5 text-white/20" />
          </div>
          <p className="text-white/40 text-sm">You're all caught up!</p>
          <p className="text-white/20 text-xs mt-1">No unread notifications</p>
        </div>
      ) : (
        <div className="space-y-1">
          {visible.map((n) => {
            const meta = TYPE_META[n.type];
            const Icon = meta.icon;
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`w-full flex items-start gap-4 p-4 rounded-2xl border transition-all text-left group ${
                  n.read
                    ? "bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.03]"
                    : "bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.05]"
                }`}
              >
                {/* Avatar with badge */}
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full ${n.avatar.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {n.avatar.initial}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${meta.bg} border border-[#0a0a0a] flex items-center justify-center`}>
                    <Icon className={`w-2.5 h-2.5 ${meta.color}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${n.read ? "text-white/60" : "text-white"}`}>
                      {n.title}
                    </p>
                    <span className="text-white/25 text-[11px] flex-shrink-0">{n.timestamp}</span>
                  </div>
                  <p className={`text-[13px] mt-0.5 leading-relaxed ${n.read ? "text-white/25" : "text-white/45"}`}>
                    {n.body}
                  </p>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-[#0EA5E9] flex-shrink-0 mt-1.5" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
