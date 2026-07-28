import { useState } from "react";
import { Link, useParams } from "react-router";

const MEMBERS: Record<string, {
  id: string; name: string; title: string; role: string; color: string; initials: string;
  email: string; projects: number; tasks: number; status: string;
  bio: string; skills: string[]; joinDate: string; completion: number; streak: number;
}> = {
  m1: {
    id: "m1", name: "Sarah Chen", title: "Engineering Lead", role: "Admin", color: "#0EA5E9", initials: "S",
    email: "sarah@payload.co", projects: 5, tasks: 28, status: "Online",
    bio: "Sarah leads the engineering team at Payload, driving technical strategy and mentoring developers. She has over 8 years of experience in full-stack development and distributed systems.",
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS", "System Design"],
    joinDate: "March 2024", completion: 92, streak: 14,
  },
  m2: {
    id: "m2", name: "Marcus Webb", title: "CTO", role: "Admin", color: "#8B5CF6", initials: "M",
    email: "marcus@payload.co", projects: 8, tasks: 15, status: "Online",
    bio: "Marcus is the CTO of Payload, responsible for engineering vision and product architecture. He brings 12 years of experience building scalable SaaS platforms.",
    skills: ["Architecture", "Go", "Kubernetes", "Leadership", "Product Strategy"],
    joinDate: "January 2024", completion: 88, streak: 21,
  },
  m3: {
    id: "m3", name: "Alex Kim", title: "Full-stack Dev", role: "Member", color: "#F59E0B", initials: "A",
    email: "alex@payload.co", projects: 4, tasks: 22, status: "Away",
    bio: "Alex is a full-stack developer passionate about building great user experiences. Specializes in React and Node.js applications.",
    skills: ["React", "Next.js", "Node.js", "MongoDB", "GraphQL"],
    joinDate: "February 2024", completion: 85, streak: 7,
  },
  m4: {
    id: "m4", name: "Priya Sharma", title: "Product Designer", role: "Member", color: "#22C55E", initials: "P",
    email: "priya@payload.co", projects: 3, tasks: 19, status: "Offline",
    bio: "Priya crafts intuitive and beautiful product experiences. She brings a user-centered approach to every design decision.",
    skills: ["Figma", "UX Research", "Prototyping", "Design Systems", "Accessibility"],
    joinDate: "March 2024", completion: 90, streak: 5,
  },
  m5: {
    id: "m5", name: "James Okafor", title: "Backend Dev", role: "Member", color: "#EF4444", initials: "J",
    email: "james@payload.co", projects: 2, tasks: 11, status: "Online",
    bio: "James builds robust backend services and APIs. He is passionate about performance optimization and clean architecture.",
    skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    joinDate: "April 2024", completion: 78, streak: 3,
  },
  m6: {
    id: "m6", name: "Lena Müller", title: "DevOps Lead", role: "Manager", color: "#0EA5E9", initials: "L",
    email: "lena@payload.co", projects: 6, tasks: 8, status: "Offline",
    bio: "Lena leads the DevOps team, ensuring reliable infrastructure and smooth deployments. Expert in cloud infrastructure and CI/CD pipelines.",
    skills: ["Kubernetes", "Terraform", "AWS", "GitHub Actions", "Monitoring"],
    joinDate: "February 2024", completion: 95, streak: 9,
  },
};

const PROJECTS = [
  { name: "Frontend Redesign", status: "In Progress", roleInProject: "Lead Engineer" },
  { name: "API v2 Migration", status: "Review", roleInProject: "Contributor" },
  { name: "Design System", status: "Done", roleInProject: "Technical Advisor" },
];

const ACTIVITY = [
  { action: "Completed task", detail: "Implement authentication middleware", time: "2 hours ago" },
  { action: "Commented on", detail: "API v2 Migration — endpoint design discussion", time: "5 hours ago" },
  { action: "Merged PR", detail: "#142 — Add rate limiting to API", time: "Yesterday" },
  { action: "Created task", detail: "Set up monitoring dashboard", time: "2 days ago" },
  { action: "Joined project", detail: "Design System", time: "3 days ago" },
];

function statusDot(status: string) {
  if (status === "Online") return "bg-[#22C55E]";
  if (status === "Away") return "bg-[#F59E0B]";
  return "bg-white/20";
}

function statusBadge(status: string) {
  if (status === "In Progress") return "bg-[#0EA5E9]/15 text-[#0EA5E9]";
  if (status === "Review") return "bg-[#8B5CF6]/15 text-[#8B5CF6]";
  if (status === "Done") return "bg-[#22C55E]/15 text-[#22C55E]";
  return "bg-white/10 text-white/50";
}

function roleBadgeStyle(role: string) {
  if (role === "Admin") return "bg-[#EF4444]/15 text-[#EF4444]";
  if (role === "Manager") return "bg-[#F59E0B]/15 text-[#F59E0B]";
  return "bg-white/10 text-white/50";
}

// Generate contribution grid data
const GRID = Array.from({ length: 84 }, (_, i) => {
  const v = Math.random();
  return v < 0.3 ? 0 : v < 0.5 ? 0.2 : v < 0.7 ? 0.4 : v < 0.85 ? 0.7 : 1;
});

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const member = MEMBERS[id || "m1"] || MEMBERS["m1"];
  const [tab, setTab] = useState<"overview" | "projects" | "activity">("overview");

  return (
    <div className="p-8">
      {/* Back link */}
      <Link to="/app/team" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Team
      </Link>

      {/* Profile header */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 mb-6">
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
                <h1 className="text-xl font-bold text-white">{member.name}</h1>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleBadgeStyle(member.role)}`}>
                  {member.role}
                </span>
              </div>
              <div className="text-white/50 text-sm">{member.title}</div>
              <div className="text-white/30 text-xs mt-0.5">{member.email}</div>
              <div className="text-white/25 text-xs mt-0.5">Joined {member.joinDate}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-xl border border-white/[0.08] text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors">
              Send Message
            </button>
            <button className="px-4 py-2 rounded-xl border border-white/[0.08] text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors">
              Edit Role ▾
            </button>
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
          <div key={s.label} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-white/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-white/[0.02] border border-white/[0.06] rounded-xl p-1 w-fit mb-6">
        {(["overview", "projects", "activity"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/70"
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
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-sm font-medium text-white/60 mb-3">About</h3>
            <p className="text-white/80 text-sm leading-relaxed">{member.bio}</p>
          </div>
          {/* Skills */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-sm font-medium text-white/60 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] text-xs font-medium border border-[#0EA5E9]/20">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          {/* Contribution grid */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-sm font-medium text-white/60 mb-4">Contributions</h3>
            <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
              {GRID.map((opacity, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm"
                  style={{
                    backgroundColor: opacity === 0 ? "rgba(255,255,255,0.04)" : `rgba(14,165,233,${opacity})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "projects" && (
        <div className="space-y-3">
          {PROJECTS.map((p) => (
            <div key={p.name} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-white text-sm">{p.name}</div>
                <div className="text-xs text-white/40 mt-0.5">{p.roleInProject}</div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(p.status)}`}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === "activity" && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
          <div className="space-y-5">
            {ACTIVITY.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-[#0EA5E9] mt-1 flex-shrink-0" />
                  {i < ACTIVITY.length - 1 && <div className="w-px flex-1 bg-white/[0.06] mt-1" />}
                </div>
                <div className="pb-5 last:pb-0">
                  <div className="text-sm text-white/80">
                    <span className="text-white/40">{item.action}</span> {item.detail}
                  </div>
                  <div className="text-xs text-white/30 mt-0.5">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
