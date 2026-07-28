import { useEffect, useState } from "react";
import { api } from "../../../lib/api";

function planBadge(plan: string) {
  if (plan === "Pro") return "bg-accent/15 text-accent";
  if (plan === "Enterprise") return "bg-[#8B5CF6]/15 text-[#8B5CF6]";
  return "bg-white/10 text-muted-foreground";
}

function statusBadge(status: string) {
  if (status === "Active") return "bg-[#22C55E]/15 text-[#22C55E]";
  return "bg-[#EF4444]/15 text-[#EF4444]";
}

type FilterTab = "All" | "Active" | "Suspended" | "Admin";

export default function UsersManagementPage() {
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("All");
  const [users, setUsers] = useState<Array<{ id: number; name: string; email: string; created_at: string; role: string; plan: string; is_active: boolean }>>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("Member");

  const [editingUser, setEditingUser] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    api.get<any[]>("/admin/users").then(setUsers).catch(() => setUsers([]));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.post("/admin/users", {
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole
      });
      setUsers([created as any, ...users]);
      setShowAddModal(false);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRole("Member");
    } catch (e: any) {
      console.error(e);
      alert("Failed to add user: " + (e.message || "Unknown error"));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const updated = await api.put(`/admin/users/${editingUser.id}`, {
        name: editName,
        email: editEmail,
        role: editRole
      });
      setUsers(users.map(u => u.id === editingUser.id ? updated as any : u));
      setEditingUser(null);
    } catch (e: any) {
      console.error(e);
      alert("Failed to update user: " + (e.message || "Unknown error"));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user? This will also unassign their tasks.")) return;
    try {
      await api.del(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete user.");
    }
  };

  const handleToggleStatus = async (user: any) => {
    try {
      const updated = await api.patch(`/admin/users/${user.id}/status`, {
        is_active: !user.is_active
      });
      setUsers(users.map(u => u.id === user.id ? { ...u, is_active: !user.is_active } : u));
    } catch (e: any) {
      console.error(e);
      alert("Failed to update status: " + (e.message || "Unknown error"));
    }
  };

  const handleResetPassword = async (user: any) => {
    const newPassword = prompt(`Enter new password for ${user.email}:`);
    if (!newPassword) return;
    try {
      await api.post(`/admin/users/${user.id}/reset-password`, { new_password: newPassword });
      alert("Password has been reset successfully!");
    } catch (e: any) {
      console.error(e);
      alert("Failed to reset password: " + (e.message || "Unknown error"));
    }
  };

  const filtered = users.map((u, index) => ({
    id: u.id,
    initials: u.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    name: u.name,
    email: u.email,
    plan: u.email === "admin@cloudtaskpro.in" ? "Pro" : index % 3 === 0 ? "Enterprise" : "Free",
    role: u.role,
    status: u.is_active ? "Active" : "Suspended",
    is_active: u.is_active,
    joined: new Date(u.created_at).toLocaleDateString(undefined, { month: "short", year: "numeric" }),
    color: ["var(--color-accent)", "#8B5CF6", "#F59E0B", "#22C55E", "#EF4444"][index % 5],
  })).filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      filterTab === "All" ||
      (filterTab === "Active" && u.is_active) ||
      (filterTab === "Suspended" && !u.is_active) ||
      (filterTab === "Admin" && u.role === "Admin");
    return matchSearch && matchTab;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Users Management</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-secondary border border-border rounded-xl px-4 py-2 text-sm text-foreground placeholder-white/30 focus:outline-none focus:border-accent/50 w-52"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-card border border-border rounded-xl p-1 w-fit mb-6">
        {(["All", "Active", "Suspended", "Admin"] as FilterTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilterTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterTab === t ? "bg-white/[0.08] text-foreground" : "text-muted-foreground hover:text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mb-4 text-foreground/35 text-sm">
        Loaded live from the backend users table. Admin login is required for this page.
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["User", "Plan", "Role", "Status", "Joined", "Actions"].map((h) => (
                <th key={h} className="text-left text-xs text-muted-foreground font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-card transition-colors">
                {/* User */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: u.color + "25", color: u.color }}
                    >
                      {u.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </td>
                {/* Plan */}
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${planBadge(u.plan)}`}>{u.plan}</span>
                </td>
                {/* Role */}
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{u.role}</td>
                {/* Status */}
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(u.status)}`}>{u.status}</span>
                </td>
                {/* Joined */}
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{u.joined}</td>
                {/* Actions */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    {/* Edit */}
                    <button 
                      onClick={() => {
                        setEditingUser(u);
                        setEditName(u.name);
                        setEditEmail(u.email);
                        setEditRole(u.role);
                      }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors" title="Edit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {/* Reset Password */}
                    <button
                      onClick={() => handleResetPassword(u)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                      title="Force Reset Password"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4v-3.252a1 1 0 01.293-.707l8.96-8.96A6 6 0 0115 7h.01" />
                      </svg>
                    </button>
                    {/* Suspend/Activate */}
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        u.status === "Active"
                          ? "text-muted-foreground hover:text-[#F59E0B] hover:bg-[#F59E0B]/10"
                          : "text-muted-foreground hover:text-[#22C55E] hover:bg-[#22C55E]/10"
                      }`}
                      title={u.status === "Active" ? "Suspend Account" : "Activate Account"}
                    >
                      {u.status === "Active" ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                    {/* Delete */}
                    <button 
                      onClick={() => handleDelete(u.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors" title="Delete Account">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing 1–{filtered.length} of {users.length} users</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-border hover:border-border hover:text-muted-foreground transition-colors">← Prev</button>
          <button className="px-3 py-1.5 rounded-lg border border-border hover:border-border hover:text-muted-foreground transition-colors">Next →</button>
        </div>
      </div>
      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-foreground mb-4">Add User</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                <input required type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input required type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <input required type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
                <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent/50">
                  <option value="Registered User">Registered User</option>
                  <option value="System Admin">System Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-foreground mb-4">Edit User</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                <input required type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input required type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
                <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent/50">
                  <option value="Registered User">Registered User</option>
                  <option value="System Admin">System Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
