import { useState } from "react";
import { Link, useLocation } from "react-router";
import { getSettings, saveSettings } from "../../../lib/settings";

const SETTINGS_TABS = [
  { label: "General", to: "/app/settings/general" },
  { label: "Appearance", to: "/app/settings/appearance" },
  { label: "Notifications", to: "/app/settings/notifications" },
  { label: "Billing", to: "/app/settings/billing" },
  { label: "Integrations", to: "/app/settings/integrations" },
  { label: "API Keys", to: "/app/settings/api-keys" },
];

type IntegrationStatus = "connected" | "coming_soon" | "beta" | undefined;

const integrations: Array<{
  id: string;
  letter: string;
  letterBg: string;
  name: string;
  description: string;
  status?: IntegrationStatus;
}> = [
  { id: "github", letter: "G", letterBg: "#24292e", name: "GitHub", description: "Link pull requests and issues to tasks automatically." },
  { id: "slack", letter: "S", letterBg: "#4A154B", name: "Slack", description: "Receive task notifications and updates in Slack channels." },
  { id: "gcal", letter: "C", letterBg: "#1a73e8", name: "Google Calendar", description: "Sync task deadlines and milestones to your calendar." },
  { id: "notion", letter: "N", letterBg: "#191919", name: "Notion", description: "Embed CloudTask views in Notion pages seamlessly.", status: "beta" },
  { id: "jira", letter: "J", letterBg: "#0052CC", name: "Jira", description: "Two-way sync between CloudTask and Jira issues.", status: "coming_soon" },
  { id: "linear", letter: "L", letterBg: "#5E6AD2", name: "Linear", description: "Import Linear issues and keep them in sync.", status: "coming_soon" },
];

const INTEGRATIONS_KEY = "cloudtask_integrations";

function loadConnections() {
  try {
    const raw = localStorage.getItem(INTEGRATIONS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : ["github", "slack"];
  } catch {
    return ["github", "slack"];
  }
}

function saveConnections(connections: string[]) {
  localStorage.setItem(INTEGRATIONS_KEY, JSON.stringify(connections));
}

function StatusBadge({ status, isConnected }: { status?: IntegrationStatus; isConnected: boolean }) {
  if (isConnected) {
    return (
      <span className="bg-[#22C55E]/10 text-[#22C55E] px-1.5 py-0.5 rounded-md text-[10px] font-semibold">
        Connected
      </span>
    );
  }
  if (status === "coming_soon") {
    return (
      <span className="bg-white/[0.06] text-muted-foreground px-1.5 py-0.5 rounded-md text-[10px] font-semibold">
        Coming Soon
      </span>
    );
  }
  if (status === "beta") {
    return (
      <span className="bg-[#F59E0B]/10 text-[#F59E0B] px-1.5 py-0.5 rounded-md text-[10px] font-semibold">
        Beta
      </span>
    );
  }
  return null;
}

export default function IntegrationsPage() {
  const location = useLocation();
  const [connected, setConnected] = useState<string[]>(loadConnections());
  const settings = getSettings();

  function toggle(id: string) {
    setConnected((prev) => {
      const next = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id];
      saveConnections(next);
      saveSettings({ ...settings, workspaceName: settings.workspaceName });
      return next;
    });
  }

  return (
    <div className="p-8 max-w-3xl mx-auto bg-background min-h-full">
      <div className="mb-7">
        <h1 className="text-foreground text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your workspace preferences and configuration.</p>
      </div>
      <div className="flex items-center gap-1 mb-8 border-b border-border pb-0">
        {SETTINGS_TABS.map((tab) => (
          <Link key={tab.to} to={tab.to} className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px ${location.pathname === tab.to ? "text-foreground border-white" : "text-muted-foreground border-transparent hover:text-muted-foreground"}`}>
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="grid gap-4">
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-accent text-sm flex items-center gap-2 mb-2">
          This is a static UI mockup. Third-party integrations will be implemented in a future update.
        </div>
        {integrations.map((integration) => {
          const isConnected = connected.includes(integration.id);
          const isComingSoon = integration.status === "coming_soon";
          return (
            <div key={integration.id} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-foreground font-bold text-lg shrink-0" style={{ backgroundColor: integration.letterBg }}>
                {integration.letter}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-foreground text-sm font-semibold">{integration.name}</p>
                  <StatusBadge status={integration.status} isConnected={isConnected} />
                </div>
                <p className="text-muted-foreground text-xs">{integration.description}</p>
              </div>
              {isComingSoon ? (
                <button
                  disabled
                  className="shrink-0 font-semibold px-4 py-2 rounded-xl text-xs bg-secondary border border-border text-muted-foreground opacity-50 cursor-not-allowed"
                >
                  Connect
                </button>
              ) : (
                <button
                  onClick={() => toggle(integration.id)}
                  className={`shrink-0 font-semibold px-4 py-2 rounded-xl text-xs transition-colors ${isConnected ? "bg-secondary border border-border text-muted-foreground hover:bg-[#EF4444]/10 hover:text-[#EF4444]" : "bg-primary text-primary-foreground hover:bg-white/90"}`}
                >
                  {isConnected ? "Disconnect" : "Connect"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
