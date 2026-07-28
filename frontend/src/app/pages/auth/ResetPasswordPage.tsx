import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { api } from "@/app/lib/api";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass !== confirmPass || !token) return;
    try {
      await api.resetPassword({ token, new_password: newPass });
      setDone(true);
    } catch (err) {
      console.error(err);
      alert("Failed to reset password. Token might be invalid or expired.");
    }
  };

  if (done) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
        </div>
        <h1 className="text-foreground text-[22px] font-semibold tracking-tight mb-1.5">Password updated!</h1>
        <p className="text-muted-foreground text-sm mb-7">Your password has been changed successfully. You can now sign in with your new password.</p>
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-accent hover:bg-[#0284C7] text-foreground text-sm font-semibold rounded-xl py-2.5 transition-colors shadow-[0_0_20px_rgba(14,165,233,0.25)]"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7 text-center">
        <h1 className="text-foreground text-[22px] font-semibold tracking-tight mb-1.5">Set new password</h1>
        <p className="text-muted-foreground text-sm">Choose a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-foreground/55 text-xs font-medium mb-1.5">New password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full bg-secondary border border-border rounded-xl px-3.5 py-2.5 pr-10 text-foreground text-sm placeholder:text-foreground/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/25 hover:text-foreground/55 transition-colors"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-foreground/55 text-xs font-medium mb-1.5">Confirm new password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Repeat your password"
              className={`w-full bg-secondary border rounded-xl px-3.5 py-2.5 pr-10 text-foreground text-sm placeholder:text-foreground/20 focus:outline-none focus:bg-white/[0.06] transition-colors ${
                confirmPass && confirmPass !== newPass
                  ? "border-[#EF4444]/50 focus:border-[#EF4444]/70"
                  : "border-border focus:border-accent/50"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/25 hover:text-foreground/55 transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPass && confirmPass !== newPass && (
            <p className="text-[#EF4444] text-[11px] mt-1.5">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-accent hover:bg-[#0284C7] text-foreground text-sm font-semibold rounded-xl py-2.5 transition-colors mt-1 shadow-[0_0_20px_rgba(14,165,233,0.25)] disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={!newPass || newPass !== confirmPass}
        >
          Reset Password
        </button>
      </form>

      <p className="text-center text-muted-foreground text-xs mt-5">
        Remember your password?{" "}
        <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
