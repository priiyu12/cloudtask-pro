import { useState } from "react";
import { Link, useLocation } from "react-router";

const SETTINGS_TABS = [
  { label: "General", to: "/app/settings/general" },
  { label: "Appearance", to: "/app/settings/appearance" },
  { label: "Notifications", to: "/app/settings/notifications" },
  { label: "Billing", to: "/app/settings/billing" },
  { label: "Integrations", to: "/app/settings/integrations" },
  { label: "API Keys", to: "/app/settings/api-keys" },
];

type IntegrationStatus = "connected" | "available" | "coming_soon" | "beta";

interface Integration {
  id: string;
  letter: string;
  letterBg: string;
  name: string;
  description: string;
  status: IntegrationStatus;
}

const integrations: Integration[] = [
  {
    id: "github",
    letter: "G",
    letterBg: "#24292e",
    name: "GitHub",
    description: "Link pull requests and issues to tasks automatically.",
    status: "connected",
  },
  {
    id: "slack",
    letter: "S",
    letterBg: "#4A154B",
    name: "Slack",
    description: "Receive task notifications and updates in Slack channels.",
    status: "connected",
  },
  {
    id: "gcal",
    letter: "C",
    letterBg: "#1a73e8",
    name: "Google Calendar",
    description: "Sync task deadlines and milestones to your calendar.",
    status: "available",
  },
  {
    id: "notion",
    letter: "N",
    letterBg: "#191919",
    name: "Notion",
    description: "Embed CloudTask views in Notion pages seamlessly.",
    status: "beta",
  },
  {
    id: "jira",
    letter: "J",
    letterBg: "#0052CC",
    name: "Jira",
    description: "Two-way sync between CloudTask and Jira issues.",
    status: "coming_soon",
  },
  {
    id: "linear",
    letter: "L",
    letterBg: "#5E6AD2",
    name: "Linear",
    description: "Import Linear issues and keep them in sync.",
    status: "coming_soon",
  },
];

export default function IntegrationsPage() {
  const location = useLocation();
  const [connected, setConnected] = useState<string[]>(["github", "slack"]);

  function toggle(id: string) {
    setConnected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
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

      <div className="grid grid-cols-1 gap-4">
        {integrations.map((integration) => {
          const isConnected = connected.includes(integration.id);
          const isComingSoon = integration.status === "coming_soon";
          const isBeta = integration.status === "beta";

          return (
            <div
              key={integration.id}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4"
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{ backgroundColor: integration.letterBg }}
              >
                {integration.letter}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white text-sm font-semibold">{integration.name}</span>
                  {isConnected && (
                    <span className="text-[10px] font-semibold bg-[#22C55E]/10 text-[#22C55E] px-1.5 py-0.5 rounded-md">
                      Connected
                    </span>
                  )}
                  {isComingSoon && (
                    <span className="text-[10px] font-semibold bg-white/[0.06] text-white/40 px-1.5 py-0.5 rounded-md">
                      Coming Soon
                    </span>
                  )}
                  {isBeta && (
                    <span className="text-[10px] font-semibold bg-[#F59E0B]/10 text-[#F59E0B] px-1.5 py-0.5 rounded-md">
                      Beta
                    </span>
                  )}
                </div>
                <p className="text-white/40 text-xs">{integration.description}</p>
              </div>

              {/* Action */}
              {isComingSoon ? (
                <button
                  disabled
                  className="shrink-0 bg-white/[0.03] border border-white/[0.06] text-white/20 font-semibold px-4 py-2 rounded-xl text-xs cursor-not-allowed"
                >
                  Connect
                </button>
              ) : isConnected ? (
                <button
                  onClick={() => toggle(integration.id)}
                  className="shrink-0 bg-white/[0.04] border border-white/[0.07] text-white/60 font-semibold px-4 py-2 rounded-xl text-xs hover:bg-[#EF4444]/10 hover:border-[#EF4444]/20 hover:text-[#EF4444] transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => toggle(integration.id)}
                  className="shrink-0 bg-white text-black font-semibold px-4 py-2 rounded-xl text-xs hover:bg-white/90 transition-colors"
                >
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
