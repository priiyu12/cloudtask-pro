const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

type JwtPayload = { sub?: string; exp?: number; role?: string };

export type CurrentUser = {
  id: number;
  name: string;
  email: string;
  job_title?: string | null;
  bio?: string | null;
  location?: string | null;
  timezone?: string | null;
  language?: string | null;
  job_title?: string | null;
  avatar_color?: string | null;
  current_workspace_id?: number | null;
  role: string;
  created_at: string;
};

export type Workspace = {
  id: number;
  name: string;
  created_at: string;
};

export type WorkspaceMembership = {
  workspace: Workspace;
  role: string;
};

export type Team = {
  id: number;
  workspace_id: number;
  name: string;
  created_at: string;
};

export type Invite = {
  id: number;
  workspace_id: number;
  email: string;
  role: string;
  status: string;
  created_at: string;
};

export function getTokenPayload(): JwtPayload | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem("cloudtask_token");
}

export function setToken(token: string) {
  localStorage.setItem("cloudtask_token", token);
}

export function clearToken() {
  localStorage.removeItem("cloudtask_token");
}

async function request<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    if (response.status === 402) {
      window.dispatchEvent(new CustomEvent("show-upgrade-modal"));
    }
    const text = await response.text();
    try {
      const json = JSON.parse(text);
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      } else if (json.detail) {
        throw new Error(json.detail);
      }
    } catch (e) {
      if (e instanceof Error && e.message !== "Unexpected end of JSON input" && !e.message.includes("Unexpected token")) {
        throw e;
      }
    }
    throw new Error(text || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  del: (path: string) => request<void>(path, { method: "DELETE" }),
  me: () => request<CurrentUser>("/users/me"),
  meWorkspaces: () => request<WorkspaceMembership[]>("/users/me/workspaces"),
  meInvites: () => request<Invite[]>("/users/me/invites"),
  switchWorkspace: (workspace_id: number) => request<CurrentUser>("/users/me/workspace", { method: "PUT", body: JSON.stringify({ workspace_id }) }),
  acceptInvite: (invite_id: number) => request<unknown>(`/workspaces/invites/${invite_id}/accept`, { method: "POST" }),
  updateMe: (body: Partial<CurrentUser>) => request<CurrentUser>("/users/me", { method: "PUT", body: JSON.stringify(body) }),
  updatePassword: (body: { current_password: string; new_password: string }) =>
    request<{ message: string }>("/users/me/password", { method: "PUT", body: JSON.stringify(body) }),
  forgotPassword: (email: string) => request<{ message: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (body: { token: string; new_password: string }) => request<{ message: string }>("/auth/reset-password", { method: "POST", body: JSON.stringify(body) }),
  getSubscription: () => request<any>("/billing/subscription"),
  upgradeSubscription: (plan_name: string) => request<any>("/billing/upgrade", { method: "POST", body: JSON.stringify({ plan_name }) }),
  getInvoices: () => request<{ id: string; date: string; amount: string; status: string }[]>("/billing/invoices"),
  getFiles: (project_id: number) => request<any>(`/files/project/${project_id}`),
  getAllFiles: () => request<any>("/files"),
  getStorageUsage: () => request<any>("/files/usage"),
  uploadFile: async (file: File, project_id?: number) => {
    const formData = new FormData();
    formData.append("file", file);
    
    let url = "/files";
    if (project_id) {
      url += `?project_id=${project_id}`;
    }

    const init = {
      method: "POST",
      body: formData,
      headers: {
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
    };

    const response = await fetch(`${API_URL}${url}`, init);
    if (!response.ok) {
      if (response.status === 402) {
        window.dispatchEvent(new CustomEvent("show-upgrade-modal"));
      }
      const text = await response.text();
      throw new Error(text || `Upload failed: ${response.status}`);
    }
    return response.json();
  },
  getProjects: () => request<any>("/projects"),
};
