import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { applySettings, getSettings, saveSettings } from "../../../lib/settings";

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
];

const accentColors = [
  { id: "sky", value: "#0EA5E9" },
  { id: "violet", value: "#8B5CF6" },
  { id: "green", value: "#22C55E" },
  { id: "amber", value: "#F59E0B" },
  { id: "red", value: "#EF4444" },
  { id: "rose", value: "#F43F5E" },
  { id: "emerald", value: "#10B981" },
];

const densities = [
  { id: "compact", label: "Compact", description: "Tighter spacing, more content visible" },
  { id: "comfortable", label: "Comfortable", description: "Balanced spacing for everyday use" },
  { id: "spacious", label: "Spacious", description: "Generous spacing, easier to scan" },
];

export default function AppearancePage() {
  const location = useLocation();
  const initial = getSettings();
  const [theme, setTheme] = useState(initial.theme);
  const [accent, setAccent] = useState(initial.accent);
  const [density, setDensity] = useState(initial.density);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    saveSettings({ ...getSettings(), theme, accent, density });
    applySettings({ ...getSettings(), theme, accent, density });
  }, [theme, accent, density]);

  function handleSave() {
    saveSettings({ ...getSettings(), theme, accent, density });
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
                  ? "text-foreground border-primary"
                  : "text-muted-foreground border-transparent hover:text-muted-foreground hover:border-border"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="space-y-6">
        {/* Theme */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-foreground text-sm font-semibold mb-5">Theme</h2>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((t) => {
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-xl border transition-all ${
                    active
                      ? "border-primary bg-secondary/50 shadow-sm"
                      : "border-border bg-card hover:bg-secondary"
                  }`}
                >
                  <t.icon size={20} className={active ? "text-foreground" : "text-muted-foreground"} />
                  <span className={`text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent Color */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-foreground text-sm font-semibold mb-5">Accent Color</h2>
          <div className="flex items-center gap-3">
            {accentColors
              .map((c) => {
              const active = accent === c.value;
              return (
                <button
                  key={c.id}
                  onClick={() => setAccent(c.value)}
                  style={{ backgroundColor: c.value }}
                  className={`w-8 h-8 rounded-full transition-all ${
                    active ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110" : "hover:scale-105"
                  } ${c.value === "#fff" ? "border border-border" : ""}`}
                />
              );
            })}
          </div>
        </div>

        {/* Interface Density */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-foreground text-sm font-semibold mb-5">Interface Density</h2>
          <div className="space-y-2">
            {densities.map((d) => {
              const active = density === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDensity(d.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                    active
                      ? "border-border bg-secondary"
                      : "border-transparent hover:bg-secondary/50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      active ? "border-primary" : "border-border"
                    }`}
                  >
                    {active && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>
                      {d.label}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">{d.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
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
