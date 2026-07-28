import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../../../lib/api";

type Setting = { key: string; value: string | null };

export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = () => {
    api.get<Setting[]>("/admin/settings").then(setSettings).catch(() => setSettings([]));
  };

  const getSetting = (key: string) => settings.find(s => s.key === key)?.value || "";

  const handleChange = (key: string, value: string) => {
    setSettings(prev => {
      const exists = prev.find(s => s.key === key);
      if (exists) return prev.map(s => s.key === key ? { ...s, value } : s);
      return [...prev, { key, value }];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const setting of settings) {
        await api.put(`/admin/settings/${setting.key}`, { value: setting.value });
      }
      alert("Settings saved successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/app/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Admin
        </Link>
        <span className="text-foreground/20">/</span>
        <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">General Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Platform Name</label>
              <input
                type="text"
                value={getSetting("platform_name")}
                onChange={(e) => handleChange("platform_name", e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent/50"
                placeholder="CloudTask Pro"
              />
              <p className="text-xs text-muted-foreground mt-1.5">The name of your platform displayed in emails and headers.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Maintenance Mode</label>
              <select
                value={getSetting("maintenance_mode")}
                onChange={(e) => handleChange("maintenance_mode", e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent/50"
              >
                <option value="">Disabled</option>
                <option value="enabled">Enabled</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1.5">If enabled, non-admin users will be prevented from logging in.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Signups Allowed</label>
              <select
                value={getSetting("signups_allowed")}
                onChange={(e) => handleChange("signups_allowed", e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent/50"
              >
                <option value="">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1.5">If disabled, the registration page will be blocked.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
