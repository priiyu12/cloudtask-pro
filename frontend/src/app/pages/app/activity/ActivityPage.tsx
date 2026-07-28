import { useState, useEffect } from "react";
import {
  CheckCircle2, AtSign, FolderOpen, UserPlus, Edit3, Trash2, GitBranch,
  MessageSquare, AlertCircle, RefreshCw,
} from "lucide-react";
import { api } from "../../../lib/api";

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  project_id: number;
  created_at: string;
};

type Project = {
  id: number;
  name: string;
};

type User = {
  id: number;
  name: string;
  avatar_color?: string | null;
};

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
  mention:  { icon: AtSign,        color: "text-accent", bg: "bg-accent/15" },
  project:  { icon: FolderOpen,    color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/15" },
  member:   { icon: UserPlus,      color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/15" },
  edit:     { icon: Edit3,         color: "text-accent", bg: "bg-accent/15" },
  delete:   { icon: Trash2,        color: "text-[#EF4444]", bg: "bg-[#EF4444]/15" },
  deploy:   { icon: GitBranch,     color: "text-[#22C55E]", bg: "bg-[#22C55E]/15" },
  comment:  { icon: MessageSquare, color: "text-muted-foreground",  bg: "bg-white/[0.08]"  },
  alert:    { icon: AlertCircle,   color: "text-[#EF4444]", bg: "bg-[#EF4444]/15" },
  update:   { icon: RefreshCw,     color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/15" },
};

const VISIBLE_INIT = 3;

export default function ActivityPage() {
  const [showAll, setShowAll] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Task[]>('/tasks').catch(() => []),
      api.get<User[]>('/users').catch(() => []),
      api.get<Project[]>('/projects').catch(() => [])
    ]).then(([tasks, users, projects]) => {
      // Sort tasks by created_at descending
      const sortedTasks = [...tasks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      const projectMap = new Map(projects.map(p => [p.id, p]));
      
      const mappedEvents: ActivityEvent[] = sortedTasks.map(task => {
        const user = users.length > 0 ? users[task.id % users.length] : { name: "Unknown User", avatar_color: "bg-[#22C55E]" };
        const project = projectMap.get(task.project_id);
        const projectName = project ? project.name : "Unknown Project";
        const date = new Date(task.created_at);
        
        return {
          id: String(task.id),
          avatarInitial: user.name.charAt(0).toUpperCase() || "?",
          avatarColor: user.avatar_color || "bg-[#22C55E]",
          actor: user.name,
          action: "created task",
          target: task.title,
          context: projectName,
          timestamp: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          iconType: "project" as const,
          _date: date
        } as ActivityEvent & { _date: Date };
      });

      // Group by Today, Yesterday, Earlier
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const grouped = new Map<string, ActivityEvent[]>();
      
      mappedEvents.forEach((event: any) => {
        const d = new Date(event._date);
        d.setHours(0, 0, 0, 0);
        
        let label = "Earlier";
        if (d.getTime() === today.getTime()) {
          label = "Today";
        } else if (d.getTime() === yesterday.getTime()) {
          label = "Yesterday";
        }
        
        if (!grouped.has(label)) {
          grouped.set(label, []);
        }
        grouped.get(label)!.push(event);
      });

      // Build groups array in correct order
      const newGroups: Group[] = [];
      if (grouped.has("Today")) newGroups.push({ label: "Today", events: grouped.get("Today")! });
      if (grouped.has("Yesterday")) newGroups.push({ label: "Yesterday", events: grouped.get("Yesterday")! });
      if (grouped.has("Earlier")) newGroups.push({ label: "Earlier", events: grouped.get("Earlier")! });

      setGroups(newGroups);
      setLoading(false);
    });
  }, []);

  const totalEvents = groups.reduce((s, g) => s + g.events.length, 0);
  const allFlat = groups.flatMap((g) => g.events.map((e) => ({ ...e, _group: g.label })));
  const visible = showAll ? allFlat : allFlat.slice(0, VISIBLE_INIT + 4);
  const visibleIds = new Set(visible.map((e) => e.id));

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="text-foreground/35 text-sm mt-0.5">Recent actions across your workspace</p>
      </div>

      {loading ? (
        <div className="text-muted-foreground text-sm">Loading activity...</div>
      ) : (
        <>
          {/* Timeline groups */}
          <div className="space-y-8">
            {groups.map((group) => {
              const groupVisible = group.events.filter((e) => visibleIds.has(e.id));
              if (groupVisible.length === 0) return null;

              return (
                <div key={group.label}>
                  {/* Date header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-foreground/25 text-[11px] font-semibold uppercase tracking-wider">{group.label}</span>
                    <div className="flex-1 h-px bg-secondary" />
                  </div>

                  {/* Events with vertical line */}
                  <div className="relative">
                    <div className="absolute left-[19px] top-0 bottom-0 w-px bg-secondary" />
                    <div className="space-y-1">
                      {groupVisible.map((event) => {
                        const meta = ICON_META[event.iconType];
                        const Icon = meta.icon;
                        return (
                          <div key={event.id} className="flex items-start gap-4 pl-1 group">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0 z-10">
                              <div className={`w-9 h-9 rounded-full ${event.avatarColor} flex items-center justify-center text-foreground text-xs font-bold ring-2 ring-[#0a0a0a]`}>
                                {event.avatarInitial}
                              </div>
                              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${meta.bg} border border-[#0a0a0a] flex items-center justify-center`}>
                                <Icon className={`w-2 h-2 ${meta.color}`} />
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 py-2.5 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-[13px] text-muted-foreground leading-relaxed">
                                  <span className="text-foreground font-medium">{event.actor}</span>{" "}
                                  {event.action}{" "}
                                  <span className="text-foreground/80 font-medium">"{event.target}"</span>
                                  {event.context !== event.target && (
                                    <> in <span className="text-foreground/45">{event.context}</span></>
                                  )}
                                </p>
                                <span className="text-foreground/20 text-[11px] flex-shrink-0 mt-0.5">{event.timestamp}</span>
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
                className="inline-flex items-center gap-2 bg-secondary border border-border hover:bg-white/[0.07] text-muted-foreground hover:text-foreground/80 text-sm px-5 py-2.5 rounded-xl transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Load more activity
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
