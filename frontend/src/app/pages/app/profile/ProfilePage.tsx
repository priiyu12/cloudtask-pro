import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Calendar, CheckSquare, Flame, Folder, LoaderCircle, Mail, MapPin } from "lucide-react";
import { api, type CurrentUser } from "../../../lib/api";

type Project = { id: number; name: string; description: string | null; owner_id: number; created_at: string };
type Task = { id: number; title: string; description: string | null; status: string; project_id: number; created_at: string };

export default function ProfilePage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([
      api.me().catch(() => null),
      api.get<Project[]>("/projects").catch(() => []),
      api.get<Task[]>("/tasks").catch(() => []),
    ]).then(([userData, projectData, taskData]) => {
      if (!alive) return;
      setUser(userData);
      setProjects(projectData);
      setTasks(taskData);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const doneTasks = tasks.filter((t) => t.status === "Done" || t.status === "Completed").length;
    let activeStreak = 1;
    if (user && user.created_at) {
        const days = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));
        activeStreak = Math.max(1, days);
    }
    return [
      { label: "Tasks Completed", value: doneTasks.toString(), icon: CheckSquare },
      { label: "Projects", value: projects.length.toString(), icon: Folder },
      { label: "Active Streak", value: `${activeStreak} days`, icon: Flame },
    ];
  }, [tasks, projects, user]);

  const recentActivity = useMemo(() => {
    const activity = [];
    const recentTasks = [...tasks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);
    for (const t of recentTasks) {
      activity.push({
        id: `t-${t.id}`,
        action: `Created task "${t.title}"`,
        time: new Date(t.created_at).toLocaleDateString()
      });
    }
    const recentProjects = [...projects].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 2);
    for (const p of recentProjects) {
      activity.push({
        id: `p-${p.id}`,
        action: `Created project "${p.name}"`,
        time: new Date(p.created_at).toLocaleDateString()
      });
    }
    return activity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4);
  }, [tasks, projects]);

  const avatarLetter = (user?.name?.trim()?.[0] ?? "U").toUpperCase();
  const avatarColor = user?.avatar_color ?? "var(--color-accent)";

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="h-64 rounded-3xl border border-border bg-white/[0.03] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-foreground text-3xl font-bold shrink-0"
            style={{ backgroundColor: avatarColor }}
          >
            {avatarLetter}
          </div>
          <div>
            <h1 className="text-foreground text-2xl font-semibold mb-0.5">{user?.name ?? "CloudTask User"}</h1>
            <p className="text-muted-foreground text-sm mb-2">{user?.job_title ?? "Workspace member"}</p>
            <div className="flex items-center gap-4 text-muted-foreground text-sm flex-wrap">
              <span className="flex items-center gap-1.5">
                <Mail size={13} />
                {user?.email ?? "user@cloudtaskpro.com"}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={13} />
                {user?.location ?? "Remote"}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                Joined {new Date(user?.created_at ?? Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/app/profile/edit"
            className="bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
          >
            Edit Profile
          </Link>
          <Link
            to="/app/profile/security"
            className="bg-secondary border border-border text-foreground font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-white/[0.07] transition-colors"
          >
            Security
          </Link>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="text-foreground text-sm font-semibold mb-3">Bio</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {user?.bio ??
            "Builds and ships CloudTask Pro as a polished workspace for product teams, with a focus on clarity, speed, and strong product fundamentals."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-foreground text-sm font-semibold mb-5">Stats</h2>
          <div className="space-y-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-muted-foreground text-sm">
                  <stat.icon size={15} />
                  {stat.label}
                </div>
                <span className="text-foreground font-semibold text-sm">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-foreground text-sm font-semibold mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-muted-foreground text-sm leading-snug">{item.action}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/app/activity"
            className="flex items-center gap-1 text-accent text-xs mt-5 hover:text-accent/80 transition-colors"
          >
            View all activity <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
