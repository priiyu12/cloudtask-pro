import { Link } from "react-router";
import { MapPin, Mail, Calendar, CheckSquare, Folder, Flame, ArrowRight } from "lucide-react";

const recentActivity = [
  { id: 1, action: "Completed task \"Finalize API schema\"", time: "2 hours ago" },
  { id: 2, action: "Created project \"Mobile Redesign\"", time: "Yesterday" },
  { id: 3, action: "Commented on \"Sprint planning doc\"", time: "2 days ago" },
  { id: 4, action: "Assigned task to Jordan Lee", time: "3 days ago" },
];

const stats = [
  { label: "Tasks Completed", value: "134", icon: CheckSquare },
  { label: "Projects", value: "8", icon: Folder },
  { label: "Active Streak", value: "14 days", icon: Flame },
];

export default function ProfilePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-[#8B5CF6] flex items-center justify-center text-white text-3xl font-bold shrink-0">
            M
          </div>
          <div>
            <h1 className="text-white text-2xl font-semibold mb-0.5">Marcus Webb</h1>
            <p className="text-white/40 text-sm mb-2">CTO · Payload</p>
            <div className="flex items-center gap-4 text-white/40 text-sm flex-wrap">
              <span className="flex items-center gap-1.5">
                <Mail size={13} />
                marcus@payload.co
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={13} />
                San Francisco, CA
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                Joined March 2023
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/app/profile/edit"
            className="bg-white text-black font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
          >
            Edit Profile
          </Link>
          <Link
            to="/app/profile/security"
            className="bg-white/[0.04] border border-white/[0.07] text-white font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-white/[0.07] transition-colors"
          >
            Security
          </Link>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 mb-6">
        <h2 className="text-white text-sm font-semibold mb-3">Bio</h2>
        <p className="text-white/60 text-sm leading-relaxed">
          Engineering leader with 10+ years building scalable products. Currently leading the technical
          strategy at Payload, focused on open-source CMS infrastructure. Passionate about developer
          experience, distributed systems, and shipping things that matter. Previously at Vercel and
          Stripe.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Stats */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-5">Stats</h2>
          <div className="space-y-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-white/50 text-sm">
                  <stat.icon size={15} />
                  {stat.label}
                </div>
                <span className="text-white font-semibold text-sm">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white/70 text-sm leading-snug">{item.action}</p>
                  <p className="text-white/30 text-xs mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/app/activity"
            className="flex items-center gap-1 text-[#0EA5E9] text-xs mt-5 hover:text-[#0EA5E9]/80 transition-colors"
          >
            View all activity <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
