import { useState } from "react";
import {
  CheckCircle2, AtSign, FolderOpen, UserPlus, Edit3, Trash2, GitBranch,
  MessageSquare, AlertCircle, RefreshCw,
} from "lucide-react";

interface ActivityEvent {
  id: string;
  avatarInitial: string;
  avatarColor: string;
  actor: string;
  action: string;
  target: string;
  context: string;
  timestamp: string;
  iconType: "complete" | "mention" | "project" | "member" | "edit" | "delete" | "deploy" | "comment" | "alert" | "update";
}

type Group = { label: string; events: ActivityEvent[] };

const ICON_META: Record<ActivityEvent["iconType"], { icon: React.ElementType; color: string; bg: string }> = {
  complete: { icon: CheckCircle2,  color: "text-[#22C55E]", bg: "bg-[#22C55E]/15" },
  mention:  { icon: AtSign,        color: "text-[#0EA5E9]", bg: "bg-[#0EA5E9]/15" },
  project:  { icon: FolderOpen,    color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/15" },
  member:   { icon: UserPlus,      color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/15" },
  edit:     { icon: Edit3,         color: "text-[#0EA5E9]", bg: "bg-[#0EA5E9]/15" },
  delete:   { icon: Trash2,        color: "text-[#EF4444]", bg: "bg-[#EF4444]/15" },
  deploy:   { icon: GitBranch,     color: "text-[#22C55E]", bg: "bg-[#22C55E]/15" },
  comment:  { icon: MessageSquare, color: "text-white/50",  bg: "bg-white/[0.08]"  },
  alert:    { icon: AlertCircle,   color: "text-[#EF4444]", bg: "bg-[#EF4444]/15" },
  update:   { icon: RefreshCw,     color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/15" },
};

const GROUPS: Group[] = [
  {
    label: "Today",
    events: [
      {
        id: "1",
        avatarInitial: "S",
        avatarColor: "bg-[#22C55E]",
        actor: "Sarah Chen",
        action: "completed",
        target: "Redesign onboarding flow",
        context: "Design System v2",
        timestamp: "10:42 AM",
        iconType: "complete",
      },
      {
        id: "2",
        avatarInitial: "J",
        avatarColor: "bg-[#0EA5E9]",
        actor: "James Okafor",
        action: "mentioned you in",
        target: "API docs review thread",
        context: "Infrastructure Overhaul",
        timestamp: "9:15 AM",
        iconType: "mention",
      },
      {
        id: "3",
        avatarInitial: "P",
        avatarColor: "bg-[#8B5CF6]",
        actor: "Priya Nair",
        action: "updated project status to Review in",
        target: "Mobile App Rewrite",
        context: "Mobile App Rewrite",
        timestamp: "8:03 AM",
        iconType: "update",
      },
    ],
  },
  {
    label: "Yesterday",
    events: [
      {
        id: "4",
        avatarInitial: "L",
        avatarColor: "bg-[#0EA5E9]",
        actor: "Lena Fischer",
        action: "joined the workspace",
        target: "CloudTask Pro",
        context: "Workspace",
        timestamp: "4:50 PM",
        iconType: "member",
      },
      {
        id: "5",
        avatarInitial: "M",
        avatarColor: "bg-[#EF4444]",
        actor: "Marcus Webb",
        action: "deleted task",
        target: "Legacy auth migration",
        context: "Infrastructure Overhaul",
        timestamp: "2:18 PM",
        iconType: "delete",
      },
      {
        id: "6",
        avatarInitial: "S",
        avatarColor: "bg-[#22C55E]",
        actor: "Sarah Chen",
        action: "deployed branch",
        target: "feat/token-refresh",
        context: "Design System v2",
        timestamp: "11:05 AM",
        iconType: "deploy",
      },
      {
        id: "7",
        avatarInitial: "J",
        avatarColor: "bg-[#0EA5E9]",
        actor: "James Okafor",
        action: "left a comment on",
        target: "Set up CI/CD pipeline",
        context: "Infrastructure Overhaul",
        timestamp: "9:40 AM",
        iconType: "comment",
      },
    ],
  },
  {
    label: "December 12",
    events: [
      {
        id: "8",
        avatarInitial: "P",
        avatarColor: "bg-[#8B5CF6]",
        actor: "Priya Nair",
        action: "created project",
        target: "Q1 2025 Planning",
        context: "Workspace",
        timestamp: "3:22 PM",
        iconType: "project",
      },
      {
        id: "9",
        avatarInitial: "M",
        avatarColor: "bg-[#F59E0B]",
        actor: "Marcus Webb",
        action: "edited task description for",
        target: "Implement push notifications",
        context: "Mobile App Rewrite",
        timestamp: "1:10 PM",
        iconType: "edit",
      },
      {
        id: "10",
        avatarInitial: "L",
        avatarColor: "bg-[#0EA5E9]",
        actor: "Lena Fischer",
        action: "flagged deadline risk on",
        target: "Q4 Roadmap Presentation",
        context: "Design System v2",
        timestamp: "10:55 AM",
        iconType: "alert",
      },
    ],
  },
];

const VISIBLE_INIT = 3;

export default function ActivityPage() {
  const [showAll, setShowAll] = useState(false);
  const totalEvents = GROUPS.reduce((s, g) => s + g.events.length, 0);

  // Flatten all events to apply "load more" limit
  const allFlat = GROUPS.flatMap((g) => g.events.map((e) => ({ ...e, _group: g.label })));
  const visible = showAll ? allFlat : allFlat.slice(0, VISIBLE_INIT + 4);
  const visibleIds = new Set(visible.map((e) => e.id));

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-white text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="text-white/35 text-sm mt-0.5">Recent actions across your workspace</p>
      </div>

      {/* Timeline groups */}
      <div className="space-y-8">
        {GROUPS.map((group) => {
          const groupVisible = group.events.filter((e) => visibleIds.has(e.id));
          if (groupVisible.length === 0) return null;

          return (
            <div key={group.label}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-white/25 text-[11px] font-semibold uppercase tracking-wider">{group.label}</span>
                <div className="flex-1 h-px bg-white/[0.05]" />
              </div>

              {/* Events with vertical line */}
              <div className="relative">
                <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/[0.05]" />
                <div className="space-y-1">
                  {groupVisible.map((event) => {
                    const meta = ICON_META[event.iconType];
                    const Icon = meta.icon;
                    return (
                      <div key={event.id} className="flex items-start gap-4 pl-1 group">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0 z-10">
                          <div className={`w-9 h-9 rounded-full ${event.avatarColor} flex items-center justify-center text-white text-xs font-bold ring-2 ring-[#0a0a0a]`}>
                            {event.avatarInitial}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${meta.bg} border border-[#0a0a0a] flex items-center justify-center`}>
                            <Icon className={`w-2 h-2 ${meta.color}`} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 py-2.5 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-[13px] text-white/60 leading-relaxed">
                              <span className="text-white font-medium">{event.actor}</span>{" "}
                              {event.action}{" "}
                              <span className="text-white/80 font-medium">"{event.target}"</span>
                              {event.context !== event.target && (
                                <> in <span className="text-white/45">{event.context}</span></>
                              )}
                            </p>
                            <span className="text-white/20 text-[11px] flex-shrink-0 mt-0.5">{event.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load more */}
      {!showAll && totalEvents > visible.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] text-white/50 hover:text-white/80 text-sm px-5 py-2.5 rounded-xl transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Load more activity
          </button>
        </div>
      )}
    </div>
  );
}
