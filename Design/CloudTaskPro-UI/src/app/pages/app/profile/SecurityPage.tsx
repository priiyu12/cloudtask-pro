import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Eye, EyeOff, Monitor, Smartphone, Check } from "lucide-react";

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
      className={`relative w-10 h-5.5 rounded-full transition-colors ${
        enabled ? "bg-[#0EA5E9]" : "bg-white/[0.1]"
      }`}
      style={{ height: "22px", width: "40px" }}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${
          enabled ? "translate-x-[18px]" : "translate-x-0"
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
  const [twoFactor, setTwoFactor] = useState(false);
  const [revokedSessions, setRevokedSessions] = useState<number[]>([]);

  function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2500);
  }

  const inputClass =
    "flex-1 bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/[0.2] transition-all";

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        to="/app/profile"
        className="inline-flex items-center gap-1.5 text-white/40 text-sm hover:text-white/70 transition-colors mb-7"
      >
        <ArrowLeft size={14} />
        Back to profile
      </Link>

      <h1 className="text-white text-2xl font-semibold mb-7">Security</h1>

      <div className="space-y-6">
        {/* Change Password */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-5">Change Password</h2>
          <form onSubmit={handlePasswordSave} className="space-y-3">
            <div>
              <label className="block text-white/50 text-xs mb-1.5">Current Password</label>
              <div className="flex items-center gap-2">
                <input
                  type={showCurrent ? "text" : "password"}
                  className={inputClass}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-white/50 text-xs mb-1.5">New Password</label>
              <div className="flex items-center gap-2">
                <input
                  type={showNew ? "text" : "password"}
                  className={inputClass}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-white/50 text-xs mb-1.5">Confirm New Password</label>
              <div className="flex items-center gap-2">
                <input
                  type={showConfirm ? "text" : "password"}
                  className={inputClass}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="pt-1">
              <button
                type="submit"
                className="flex items-center gap-2 bg-white text-black font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
              >
                {passwordSaved ? (
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

        {/* Two-Factor Authentication */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-white text-sm font-semibold mb-1">Two-Factor Authentication</h2>
              <p className="text-white/40 text-sm">
                Add an extra layer of security to your account using an authenticator app.
              </p>
            </div>
            <Toggle enabled={twoFactor} onChange={() => setTwoFactor((v) => !v)} />
          </div>
          {twoFactor && (
            <div className="flex items-center gap-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl px-4 py-2.5">
              <Check size={14} className="text-[#22C55E]" />
              <span className="text-[#22C55E] text-sm font-medium">Two-factor authentication is enabled</span>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-5">Active Sessions</h2>
          <div className="space-y-4">
            {sessions.map((session) => {
              const revoked = revokedSessions.includes(session.id);
              if (revoked) return null;
              return (
                <div key={session.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/[0.04] border border-white/[0.07] rounded-xl flex items-center justify-center">
                      <session.icon size={16} className="text-white/50" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">{session.device}</span>
                        {session.current && (
                          <span className="text-[10px] font-semibold bg-[#0EA5E9]/15 text-[#0EA5E9] px-1.5 py-0.5 rounded-md">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-white/35 text-xs">
                        {session.browser} · {session.location} · {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => setRevokedSessions((s) => [...s, session.id])}
                      className="text-white/40 text-xs hover:text-[#EF4444] transition-colors"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <div className="border-t border-white/[0.06] mt-5 pt-4">
            <button className="text-[#EF4444] text-sm hover:text-[#EF4444]/80 transition-colors">
              Sign out all other sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
