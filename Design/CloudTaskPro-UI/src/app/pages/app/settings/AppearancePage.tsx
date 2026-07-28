import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Moon, Sun, Monitor, Check } from "lucide-react";

const SETTINGS_TABS = [
  { label: "General", to: "/app/settings/general" },
  { label: "Appearance", to: "/app/settings/appearance" },
  { label: "Notifications", to: "/app/settings/notifications" },
  { label: "Billing", to: "/app/settings/billing" },
  { label: "Integrations", to: "/app/settings/integrations" },
  { label: "API Keys", to: "/app/settings/api-keys" },
];

const themes = [
  { id: "dark", label: "Dark", icon: Moon },
  { id: "light", label: "Light", icon: Sun },
  { id: "system", label: "System", icon: Monitor },
];

const accentColors = [
  { id: "sky", value: "#0EA5E9" },
  { id: "violet", value: "#8B5CF6" },
  { id: "green", value: "#22C55E" },
  { id: "amber", value: "#F59E0B" },
  { id: "red", value: "#EF4444" },
  { id: "white", value: "#fff" },
];

const densities = [
  { id: "compact", label: "Compact", description: "Tighter spacing, more content visible" },
  { id: "comfortable", label: "Comfortable", description: "Balanced spacing for everyday use" },
  { id: "spacious", label: "Spacious", description: "Generous spacing, easier to scan" },
];

export default function AppearancePage() {
  const location = useLocation();
  const [theme, setTheme] = useState("dark");
  const [accent, setAccent] = useState("#0EA5E9");
  const [density, setDensity] = useState("comfortable");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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

      <div className="space-y-6">
        {/* Theme */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-5">Theme</h2>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => {
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-xl border transition-all ${
                    active
                      ? "border-white bg-white/[0.06]"
                      : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <t.icon size={20} className={active ? "text-white" : "text-white/40"} />
                  <span className={`text-sm font-medium ${active ? "text-white" : "text-white/50"}`}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent Color */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-5">Accent Color</h2>
          <div className="flex items-center gap-3">
            {accentColors.map((c) => {
              const active = accent === c.value;
              return (
                <button
                  key={c.id}
                  onClick={() => setAccent(c.value)}
                  style={{ backgroundColor: c.value }}
                  className={`w-8 h-8 rounded-full transition-all ${
                    active ? "ring-2 ring-offset-2 ring-offset-[#0a0a0a] ring-white scale-110" : "hover:scale-105"
                  } ${c.value === "#fff" ? "border border-white/20" : ""}`}
                />
              );
            })}
          </div>
        </div>

        {/* Interface Density */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-5">Interface Density</h2>
          <div className="space-y-2">
            {densities.map((d) => {
              const active = density === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDensity(d.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                    active
                      ? "border-white/20 bg-white/[0.05]"
                      : "border-transparent hover:bg-white/[0.03]"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      active ? "border-white" : "border-white/20"
                    }`}
                  >
                    {active && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${active ? "text-white" : "text-white/50"}`}>
                      {d.label}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">{d.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-white text-black font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
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
