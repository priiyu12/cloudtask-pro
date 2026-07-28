import { useEffect, useState } from "react";
import { Search, Activity, Clock, User, ShieldAlert } from "lucide-react";
import { api } from "../../../lib/api";

interface SystemLog {
  id: number;
  action: string;
  user_id?: number | null;
  target?: string | null;
  ip_address?: string | null;
  status: "success" | "error" | "warning" | "info";
  created_at: string;
}

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // API endpoint for logs: GET /logs
    api.get<SystemLog[]>("/logs")
      .then(setLogs)
      .catch((e) => {
        console.error("Failed to fetch logs", e);
        // Fallback to empty if endpoint not ready
        setLogs([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.target?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "error": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "warning": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "success": return "text-green-400 bg-green-400/10 border-green-400/20";
      default: return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-background min-h-full text-foreground">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[clamp(1.6rem,2.4vw,2.2rem)] font-semibold tracking-[-0.04em] text-foreground flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-accent" />
            System Logs
          </h1>
          <p className="text-muted-foreground mt-1">Audit and monitor all system activities and security events.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2.5 rounded-xl border border-border bg-white/[0.03] px-4 py-2.5">
            <Search size={15} className="text-muted-foreground shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search logs by action or target..."
              className="w-full bg-transparent outline-none text-foreground text-sm placeholder:text-foreground/25"
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading system logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-4 border border-white/[0.05]">
              <Activity className="w-8 h-8 text-foreground/20" />
            </div>
            <h3 className="text-foreground font-medium mb-1">No logs found</h3>
            <p className="text-muted-foreground text-sm max-w-sm">No system activities match your current search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-card">
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timestamp</th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target</th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User ID</th>
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-card transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-foreground/90">{log.action}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted-foreground font-mono">{log.target || "-"}</span>
                    </td>
                    <td className="px-5 py-4">
                      {log.user_id ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {log.user_id}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-md border ${getStatusColor(log.status)}`}>
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
