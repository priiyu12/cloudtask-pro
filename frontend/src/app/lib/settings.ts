const SETTINGS_KEY = "cloudtask_settings";

export type AppSettings = {
  theme: "dark" | "light" | "system";
  accent: string;
  density: "compact" | "comfortable" | "spacious";
  workspaceName: string;
  workspaceUrl: string;
  timezone: string;
  notifications: Record<string, boolean>;
  language: string;
};

export const defaultSettings: AppSettings = {
  theme: "dark",
  accent: "#0EA5E9",
  density: "comfortable",
  workspaceName: "CloudTask Pro",
  workspaceUrl: "cloudtask-pro",
  timezone: "UTC-8 (Pacific Time)",
  notifications: {
    task_assigned: true,
    task_due: true,
    task_comment: true,
    task_completed: true,
    project_invite: true,
    project_update: true,
    project_deadline: true,
    team_join: true,
    team_mention: true,
  },
  language: "English",
};

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  applySettings(settings);
}

export function applySettings(settings = getSettings()) {
  const root = document.documentElement;
  root.classList.toggle("dark", settings.theme !== "light");
  root.dataset.theme = settings.theme;
  root.style.setProperty("--accent", settings.accent);
  root.style.setProperty("--accent-rgb", hexToRgb(settings.accent));
  
  let fontSize = "16px";
  if (settings.density === "compact") fontSize = "14px";
  else if (settings.density === "spacious") fontSize = "18px";
  root.style.setProperty("--font-size", fontSize);
}

function hexToRgb(hex: string) {
  const cleaned = hex.replace("#", "");
  const bigint = Number.parseInt(cleaned.length === 3 ? cleaned.split("").map((c) => c + c).join("") : cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b}`;
}
