import { useState, useEffect } from "react";
import { api, Invite } from "../../../lib/api";
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
  mention:       { icon: AtSign,       color: "text-accent", bg: "bg-accent/15" },
  task_assign:   { icon: Bell,         color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/15" },
  project_update:{ icon: FolderOpen,   color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/15" },
  team_join:     { icon: Users,        color: "text-accent", bg: "bg-accent/15" },
  deadline:      { icon: Clock,        color: "text-[#EF4444]", bg: "bg-[#EF4444]/15" },
  task_done:     { icon: CheckCircle2, color: "text-[#22C55E]", bg: "bg-[#22C55E]/15" },
};

const INITIAL: Notification[] = [];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [tab, setTab] = useState<"all" | "unread">("all");

  useEffect(() => {
    async function loadInvites() {
      try {
        const myInvites = await api.meInvites();
        setInvites(myInvites);
      } catch (err) {
        console.error("Failed to load invites", err);
      }
    }
    loadInvites();
  }, []);

  const handleAcceptInvite = async (inviteId: number) => {
    try {
      await api.acceptInvite(inviteId);
      setInvites(invites.filter(i => i.id !== inviteId));
      window.location.reload(); // reload to update team switcher and layout
    } catch (err) {
      console.error("Failed to accept invite", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length + invites.length;

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
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-accent text-foreground text-[11px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-accent text-sm hover:text-[#38BDF8] transition-colors font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-border rounded-xl p-1 w-fit mb-6">
        {(["all", "unread"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
              tab === t
                ? "bg-white/[0.08] text-foreground"
                : "text-foreground/35 hover:text-muted-foreground"
            }`}
          >
            {t === "unread" ? `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}` : "All"}
          </button>
        ))}
      </div>

      {/* List */}
      {visible.length === 0 && invites.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center mx-auto mb-4">
            <Bell className="w-5 h-5 text-foreground/20" />
          </div>
          <p className="text-muted-foreground text-sm">You're all caught up!</p>
          <p className="text-foreground/20 text-xs mt-1">No unread notifications</p>
        </div>
      ) : (
        <div className="space-y-1">
          {invites.map((invite) => (
            <div
              key={`invite-${invite.id}`}
              className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border transition-all text-left group bg-white/[0.03] border-border hover:bg-secondary"
            >
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-foreground text-sm font-bold">
                    {invite.email[0].toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent/15 border border-[#0a0a0a] flex items-center justify-center">
                    <Users className="w-2.5 h-2.5 text-accent" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium">New Workspace Invitation</p>
                  <p className="text-muted-foreground text-[13px] mt-0.5">
                    You have been invited to join Workspace #{invite.workspace_id} as a {invite.role}.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleAcceptInvite(invite.id)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Accept Invite
              </button>
            </div>
          ))}
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
                    : "bg-white/[0.03] border-border hover:bg-secondary"
                }`}
              >
                {/* Avatar with badge */}
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full ${n.avatar.color} flex items-center justify-center text-foreground text-sm font-bold`}>
                    {n.avatar.initial}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${meta.bg} border border-[#0a0a0a] flex items-center justify-center`}>
                    <Icon className={`w-2.5 h-2.5 ${meta.color}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${n.read ? "text-muted-foreground" : "text-foreground"}`}>
                      {n.title}
                    </p>
                    <span className="text-foreground/25 text-[11px] flex-shrink-0">{n.timestamp}</span>
                  </div>
                  <p className={`text-[13px] mt-0.5 leading-relaxed ${n.read ? "text-foreground/25" : "text-foreground/45"}`}>
                    {n.body}
                  </p>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
