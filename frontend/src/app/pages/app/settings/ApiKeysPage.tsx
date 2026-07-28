import { useState } from "react";
import { Link, useLocation } from "react-router";
import { AlertTriangle, Eye, EyeOff, Copy, Check, Trash2, Plus, ExternalLink } from "lucide-react";
import { getSettings, saveSettings } from "../../../lib/settings";

const SETTINGS_TABS = [
  { label: "General", to: "/app/settings/general" },
  { label: "Appearance", to: "/app/settings/appearance" },
  { label: "Notifications", to: "/app/settings/notifications" },
  { label: "Billing", to: "/app/settings/billing" },
  { label: "Integrations", to: "/app/settings/integrations" },
  { label: "API Keys", to: "/app/settings/api-keys" },
];

type ApiKey = { id: string; name: string; created: string; lastUsed: string; scope: string; key: string };

const initialKeys: ApiKey[] = [
  { id: "1", name: "Production Integration", created: "Jan 12, 2026", lastUsed: "2 hours ago", scope: "read, write", key: "ctp_live_xK9mP2qR7nL4vW8jT3sY6uF1dA5hB0e" },
  { id: "2", name: "CI/CD Pipeline", created: "Mar 5, 2026", lastUsed: "Yesterday", scope: "read", key: "ctp_live_aZ3bN8cX2wQ5rE7mJ1kU4pI6yO9tS0f" },
];

const API_KEYS_KEY = "cloudtask_api_keys";

function loadKeys() {
  try {
    const raw = localStorage.getItem(API_KEYS_KEY);
    return raw ? (JSON.parse(raw) as ApiKey[]) : initialKeys;
  } catch {
    return initialKeys;
  }
}

function saveKeys(keys: ApiKey[]) {
  localStorage.setItem(API_KEYS_KEY, JSON.stringify(keys));
}

export default function ApiKeysPage() {
  const location = useLocation();
  const [keys, setKeys] = useState<ApiKey[]>(loadKeys());
  const [visibleKeys, setVisibleKeys] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const settings = getSettings();

  function toggleVisibility(id: string) {
    setVisibleKeys((prev) => prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]);
  }
  function copyKey(id: string, key: string) {
    navigator.clipboard.writeText(key).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }
  function deleteKey(id: string) {
    setKeys((prev) => {
      const next = prev.filter((k) => k.id !== id);
      saveKeys(next);
      saveSettings({ ...settings, workspaceName: settings.workspaceName });
      return next;
    });
  }
  function maskKey(key: string) {
    return key.slice(0, 12) + "••••••••••••••••••••" + key.slice(-4);
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
      <div className="space-y-5">
        <div className="flex items-start gap-3 bg-[#F59E0B]/[0.08] border border-[#F59E0B]/20 rounded-xl px-4 py-3.5">
          <AlertTriangle size={15} className="text-[#F59E0B] mt-0.5 shrink-0" />
          <p className="text-[#F59E0B]/80 text-sm leading-relaxed">
            API keys grant full access to your workspace. Keep them secret and never share them publicly or commit them to version control.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-sm font-semibold">API Keys</h2>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-xl text-sm hover:bg-white/90 transition-colors">
            <Plus size={14} /> New Key
          </button>
        </div>
        {keys.map((apiKey) => {
          const visible = visibleKeys.includes(apiKey.id);
          const copied = copiedId === apiKey.id;
          return (
            <div key={apiKey.id} className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-foreground text-sm font-semibold mb-1">{apiKey.name}</p>
                  <div className="flex items-center gap-3 text-foreground/35 text-xs flex-wrap">
                    <span>Created {apiKey.created}</span><span>·</span><span>Last used {apiKey.lastUsed}</span><span>·</span><span>Scope: {apiKey.scope}</span>
                  </div>
                </div>
                <button onClick={() => deleteKey(apiKey.id)} className="text-foreground/25 hover:text-[#EF4444] transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.03] border border-border rounded-xl px-4 py-2.5">
                <code className="flex-1 text-muted-foreground text-xs font-mono truncate">{visible ? apiKey.key : maskKey(apiKey.key)}</code>
                <button onClick={() => toggleVisibility(apiKey.id)} className="text-muted-foreground hover:text-muted-foreground transition-colors shrink-0">{visible ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                <button onClick={() => copyKey(apiKey.id, apiKey.key)} className="text-muted-foreground hover:text-muted-foreground transition-colors shrink-0">{copied ? <Check size={14} className="text-[#22C55E]" /> : <Copy size={14} />}</button>
              </div>
              {copied && <p className="text-[#22C55E] text-xs -mt-1">Copied to clipboard!</p>}
            </div>
          );
        })}
        <div className="flex items-center gap-2 pt-1">
          <ExternalLink size={13} className="text-muted-foreground" />
          <a href="#" className="text-muted-foreground text-sm hover:text-accent transition-colors">View API documentation</a>
        </div>
      </div>
    </div>
  );
}
