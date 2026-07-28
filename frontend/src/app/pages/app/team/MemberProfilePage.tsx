import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { api } from "../../../lib/api";

type User = {
  id: number;
  name: string;
  email: string;
  job_title?: string;
  avatar_color?: string;
  created_at: string;
};

type TeamMember = {
  id: number;
  role: string;
  user: User;
};

function statusDot(status: string) {
  if (status === "Online") return "bg-[#22C55E]";
  if (status === "Away") return "bg-[#F59E0B]";
  return "bg-white/20";
}

function roleBadgeStyle(role: string) {
  if (role === "Admin") return "bg-[#EF4444]/15 text-[#EF4444]";
  if (role === "Manager") return "bg-[#F59E0B]/15 text-[#F59E0B]";
  return "bg-white/10 text-muted-foreground";
}

function statusBadge(status: string) {
  if (status === "In Progress") return "bg-accent/15 text-accent";
  if (status === "Completed" || status === "Done") return "bg-[#22C55E]/15 text-[#22C55E]";
  return "bg-white/[0.08] text-muted-foreground";
}



export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<"overview" | "projects" | "activity">("overview");
  const [memberInfo, setMemberInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const members = await api.get<TeamMember[]>('/workspaces/members');
        const tasksData = await api.get<any[]>('/tasks').catch(() => []);
        const match = members.find(m => m.user.id.toString() === id);
        if (match) {
          const user = match.user;
          const nameParts = user.name ? user.name.split(" ") : ["U"];
          const initials = nameParts.map((n) => (n[0] || "")).join("").toUpperCase().substring(0, 2);
          
          const userProjects = projectsData.filter(p => p.owner_id === user.id || p.members?.some((pm: any) => pm.user.id === user.id)).map(p => ({
            name: p.name,
            roleInProject: p.owner_id === user.id ? "Owner" : "Member",
            status: "In Progress"
          }));

          const userTasks = tasksData.filter(t => t.assignee_id === user.id);
          const completedTasks = userTasks.filter(t => t.status === "Done" || t.status === "Completed").length;
          const completion = userTasks.length ? Math.round((completedTasks / userTasks.length) * 100) : 0;
          
          const dynamicActivity = userTasks.slice(0, 5).map(t => ({
            action: t.status === "Done" ? "Completed task" : "Assigned to task",
            detail: t.title,
            time: new Date(t.created_at).toLocaleDateString()
          }));

          setMemberInfo({
            id: user.id.toString(),
            name: user.name,
            title: user.job_title || "Member",
            role: match.role || "Member",
            color: user.avatar_color || "var(--color-accent)",
            initials: initials || "?",
            email: user.email,
            projects: userProjects.length,
            projectsList: userProjects,
            tasks: userTasks.length,
            status: "Online",
            bio: "Member of the team.",
            skills: [],
            joinDate: new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
            completion: completion,
            streak: 0,
            activity: dynamicActivity,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  const member = memberInfo;

  if (!member) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-2xl m-8 py-12">
        <h2 className="text-xl font-semibold mb-2 text-foreground">Member not found</h2>
        <p className="mb-4">We couldn't find a member with this ID.</p>
        <Link to="/app/team" className="text-accent hover:underline">Return to Team page</Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Back link */}
      <Link to="/app/team" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-muted-foreground mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Team
      </Link>

      {/* Profile header */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
                style={{ backgroundColor: member.color + "25", border: `1px solid ${member.color}40` }}
              >
                <span style={{ color: member.color }}>{member.initials}</span>
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0a0a0a] ${statusDot(member.status)}`} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-foreground">{member.name}</h1>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleBadgeStyle(member.role)}`}>
                  {member.role}
                </span>
              </div>
              <div className="text-muted-foreground text-sm">{member.title}</div>
              <div className="text-muted-foreground text-xs mt-0.5">{member.email}</div>
              <div className="text-foreground/25 text-xs mt-0.5">Joined {member.joinDate}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Projects", value: member.projects },
          { label: "Tasks", value: member.tasks },
          { label: "Completion", value: `${member.completion}%` },
          { label: "Day Streak", value: `${member.streak}d` },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-card border border-border rounded-xl p-1 w-fit mb-6">
        {(["overview", "projects", "activity"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-white/[0.08] text-foreground" : "text-muted-foreground hover:text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && (
        <div className="space-y-5">
          {/* Bio */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">About</h3>
            <p className="text-foreground/80 text-sm leading-relaxed">{member.bio}</p>
          </div>
          {/* Skills */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          {/* Contribution grid */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Contributions</h3>
            <div className="text-sm text-muted-foreground">Contributions graph coming soon.</div>
          </div>
        </div>
      )}

      {tab === "projects" && (
        <div className="space-y-3">
          {member.projectsList?.length > 0 ? member.projectsList.map((p: any) => (
            <div key={p.name} className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground text-sm">{p.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{p.roleInProject}</div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(p.status)}`}>
                {p.status}
              </span>
            </div>
          )) : (
            <div className="text-muted-foreground text-sm py-4">No active projects.</div>
          )}
        </div>
      )}

      {tab === "activity" && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="space-y-5">
            {member.activity?.length > 0 ? member.activity.map((item: any, i: number) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1 flex-shrink-0" />
                  {i < member.activity.length - 1 && <div className="w-px flex-1 bg-white/[0.06] mt-1" />}
                </div>
                <div>
                  <div className="text-sm text-foreground">
                    <span className="font-medium text-foreground">{item.action}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">{item.detail}</div>
                  <div className="text-xs text-foreground/30 mt-1">{item.time}</div>
                </div>
              </div>
            )) : (
               <div className="text-muted-foreground text-sm">No recent activity.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
