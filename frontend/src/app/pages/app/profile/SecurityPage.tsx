import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Eye, EyeOff, Monitor, Smartphone, Check, LoaderCircle } from "lucide-react";
import { api } from "../../../lib/api";

const sessions = [
  {
    id: 1,
    device: "MacBook Pro 16\"",
    icon: Monitor,
    browser: "Chrome 124",
    location: "San Francisco, CA",
    lastActive: "Active now",
    current: true,
  },
  {
    id: 2,
    device: "iPhone 15 Pro",
    icon: Smartphone,
    browser: "Safari Mobile",
    location: "San Francisco, CA",
    lastActive: "3 hours ago",
    current: false,
  },
  {
    id: 3,
    device: "Windows PC",
    icon: Monitor,
    browser: "Firefox 125",
    location: "New York, NY",
    lastActive: "2 days ago",
    current: false,
  },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-10 h-5.5 rounded-full transition-colors ${enabled ? "bg-accent" : "bg-white/[0.1]"}`}
      style={{ height: "22px", width: "40px" }}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-primary rounded-full shadow transition-transform ${enabled ? "translate-x-[18px]" : "translate-x-0"
          }`}
        style={{ width: "18px", height: "18px" }}
      />
    </button>
  );
}

export default function SecurityPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [revokedSessions, setRevokedSessions] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ current_password: "", new_password: "", confirm_password: "" });

  async function handlePasswordSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordError("");
    if (form.new_password !== form.confirm_password) {
      setPasswordError("New password and confirmation must match.");
      return;
    }
    setSaving(true);
    try {
      await api.updatePassword({ current_password: form.current_password, new_password: form.new_password });
      setPasswordSaved(true);
      setForm({ current_password: "", new_password: "", confirm_password: "" });
      setTimeout(() => setPasswordSaved(false), 2500);
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Could not update password.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "flex-1 bg-secondary border border-border rounded-xl px-4 py-2.5 text-foreground text-sm outline-none focus:border-white/[0.2] transition-all";

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        to="/app/profile"
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm hover:text-muted-foreground transition-colors mb-7"
      >
        <ArrowLeft size={14} />
        Back to profile
      </Link>

      <h1 className="text-foreground text-2xl font-semibold mb-7">Security</h1>

      <div className="space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-foreground text-sm font-semibold mb-5">Change Password</h2>
          <form onSubmit={handlePasswordSave} className="space-y-3">
            <div>
              <label className="block text-muted-foreground text-xs mb-1.5">Current Password</label>
              <div className="flex items-center gap-2">
                <input
                  type={showCurrent ? "text" : "password"}
                  className={inputClass}
                  placeholder="Enter current password"
                  value={form.current_password}
                  onChange={(e) => setForm((f) => ({ ...f, current_password: e.target.value }))}
                />
                <button type="button" onClick={() => setShowCurrent((v) => !v)} className="text-muted-foreground hover:text-muted-foreground transition-colors">
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-muted-foreground text-xs mb-1.5">New Password</label>
              <div className="flex items-center gap-2">
                <input
                  type={showNew ? "text" : "password"}
                  className={inputClass}
                  placeholder="Enter new password"
                  value={form.new_password}
                  onChange={(e) => setForm((f) => ({ ...f, new_password: e.target.value }))}
                />
                <button type="button" onClick={() => setShowNew((v) => !v)} className="text-muted-foreground hover:text-muted-foreground transition-colors">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-muted-foreground text-xs mb-1.5">Confirm New Password</label>
              <div className="flex items-center gap-2">
                <input
                  type={showConfirm ? "text" : "password"}
                  className={inputClass}
                  placeholder="Confirm new password"
                  value={form.confirm_password}
                  onChange={(e) => setForm((f) => ({ ...f, confirm_password: e.target.value }))}
                />
                <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-muted-foreground hover:text-muted-foreground transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {passwordError && <p className="text-[#EF4444] text-xs">{passwordError}</p>}
            <div className="pt-1">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <LoaderCircle size={14} className="animate-spin" />
                    Updating...
                  </>
                ) : passwordSaved ? (
                  <>
                    <Check size={14} />
                    Updated!
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        </div>


      </div>
    </div>
  );
}
