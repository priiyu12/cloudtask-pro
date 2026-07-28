import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Check, AlertTriangle } from "lucide-react";

const SETTINGS_TABS = [
  { label: "General", to: "/app/settings/general" },
  { label: "Appearance", to: "/app/settings/appearance" },
  { label: "Notifications", to: "/app/settings/notifications" },
  { label: "Billing", to: "/app/settings/billing" },
  { label: "Integrations", to: "/app/settings/integrations" },
  { label: "API Keys", to: "/app/settings/api-keys" },
];

const timezones = [
  "UTC-8 (Pacific Time)",
  "UTC-7 (Mountain Time)",
  "UTC-6 (Central Time)",
  "UTC-5 (Eastern Time)",
  "UTC+0 (Greenwich Mean Time)",
  "UTC+1 (Central European Time)",
];

export default function GeneralSettingsPage() {
  const location = useLocation();
  const [saved, setSaved] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("Payload");
  const [workspaceUrl, setWorkspaceUrl] = useState("payload");
  const [timezone, setTimezone] = useState("UTC-8 (Pacific Time)");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const inputClass =
    "w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/[0.2] transition-all";

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-white text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-white/40 text-sm">Manage your workspace preferences and configuration.</p>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 mb-8 border-b border-white/[0.06] pb-0">
        {SETTINGS_TABS.map((tab) => {
          const active = location.pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px ${
                active
                  ? "text-white border-white"
                  : "text-white/40 border-transparent hover:text-white/70"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Workspace */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-5">Workspace</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-white/50 text-xs mb-1.5">Workspace Name</label>
              <input
                className={inputClass}
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-white/50 text-xs mb-1.5">Workspace URL</label>
              <div className="flex items-center bg-white/[0.04] border border-white/[0.07] rounded-xl overflow-hidden focus-within:border-white/[0.2] transition-all">
                <span className="pl-4 pr-2 py-2.5 text-white/30 text-sm whitespace-nowrap shrink-0">
                  app.cloudtaskpro.com/
                </span>
                <input
                  className="flex-1 bg-transparent py-2.5 pr-4 text-white text-sm outline-none"
                  value={workspaceUrl}
                  onChange={(e) => setWorkspaceUrl(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-white/50 text-xs mb-1.5">Timezone</label>
              <select
                className={`${inputClass} appearance-none`}
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz} className="bg-[#111]">
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white/[0.02] border border-[#EF4444]/30 rounded-2xl p-6">
          <h2 className="text-[#EF4444] text-sm font-semibold mb-2">Danger Zone</h2>
          <p className="text-white/40 text-sm mb-4">
            Permanently delete this workspace and all of its data. This action cannot be undone.
          </p>
          <button
            type="button"
            className="flex items-center gap-2 bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#EF4444]/20 transition-colors"
          >
            <AlertTriangle size={14} />
            Delete Workspace
          </button>
        </div>

        {/* Save */}
        <div>
          <button
            type="submit"
            className="flex items-center gap-2 bg-white text-black font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
          >
            {saved ? (
              <>
                <Check size={14} />
                Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
