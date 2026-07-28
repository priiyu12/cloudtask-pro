import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Check } from "lucide-react";
import { getSettings, saveSettings } from "../../../lib/settings";

const SETTINGS_TABS = [
  { label: "General", to: "/app/settings/general" },
  { label: "Appearance", to: "/app/settings/appearance" },
  { label: "Notifications", to: "/app/settings/notifications" },
  { label: "Billing", to: "/app/settings/billing" },
  { label: "Integrations", to: "/app/settings/integrations" },
  { label: "API Keys", to: "/app/settings/api-keys" },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="relative shrink-0 rounded-full transition-colors"
      style={{
        width: 40,
        height: 22,
        backgroundColor: enabled ? "var(--color-accent)" : "rgba(255,255,255,0.1)",
      }}
    >
      <span
        className="absolute top-0.5 bg-primary rounded-full shadow transition-transform"
        style={{
          width: 18,
          height: 18,
          left: 2,
          transform: enabled ? "translateX(18px)" : "translateX(0)",
        }}
      />
    </button>
  );
}

const notificationGroups = [
  {
    id: "tasks",
    label: "Tasks",
    items: [
      { id: "task_assigned", label: "Task assigned to you", description: "Get notified when a task is assigned to you" },
      { id: "task_due", label: "Task due soon", description: "Reminders 24 hours before a task is due" },
      { id: "task_comment", label: "Comments on your tasks", description: "When someone comments on tasks you own" },
      { id: "task_completed", label: "Task completed", description: "When a task you assigned gets completed" },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    items: [
      { id: "project_invite", label: "Project invitations", description: "When you're invited to a new project" },
      { id: "project_update", label: "Project status updates", description: "When a project's status changes" },
      { id: "project_deadline", label: "Project deadline reminders", description: "7 days before project deadline" },
    ],
  },
  {
    id: "team",
    label: "Team",
    items: [
      { id: "team_join", label: "New team member", description: "When someone joins your workspace" },
      { id: "team_mention", label: "Mentions", description: "When someone @mentions you" },
    ],
  },
];

export default function NotificationsSettingsPage() {
  const location = useLocation();
  const [saved, setSaved] = useState(false);
  const [toggles, setToggles] = useState<Record<string, boolean>>(getSettings().notifications);

  useEffect(() => {
    saveSettings({ ...getSettings(), notifications: toggles });
  }, [toggles]);

  function handleToggle(id: string) {
    setToggles((t) => ({ ...t, [id]: !t[id] }));
  }

  function handleSave() {
    saveSettings({ ...getSettings(), notifications: toggles });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-7">
        <h1 className="text-foreground text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your workspace preferences and configuration.</p>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 mb-8 border-b border-border pb-0">
        {SETTINGS_TABS.map((tab) => {
          const active = location.pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px ${
                active
                  ? "text-foreground border-white"
                  : "text-muted-foreground border-transparent hover:text-muted-foreground"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="space-y-6">
        {notificationGroups.map((group) => (
          <div key={group.id} className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-foreground text-sm font-semibold mb-5">{group.label}</h2>
            <div className="space-y-5">
              {group.items.map((item, i) => (
                <div key={item.id}>
                  {i > 0 && <div className="border-t border-white/[0.04] mb-5" />}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground text-sm font-medium">{item.label}</p>
                      <p className="text-foreground/35 text-xs mt-0.5">{item.description}</p>
                    </div>
                    <Toggle enabled={toggles[item.id] ?? false} onChange={() => handleToggle(item.id)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
        >
          {saved ? (
            <>
              <Check size={14} />
              Saved!
            </>
          ) : (
            "Save Preferences"
          )}
        </button>
      </div>
    </div>
  );
}
