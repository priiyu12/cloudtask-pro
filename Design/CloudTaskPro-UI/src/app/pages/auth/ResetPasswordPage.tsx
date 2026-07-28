import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass && newPass === confirmPass) setDone(true);
  };

  if (done) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
        </div>
        <h1 className="text-white text-[22px] font-semibold tracking-tight mb-1.5">Password updated!</h1>
        <p className="text-white/40 text-sm mb-7">Your password has been changed successfully. You can now sign in with your new password.</p>
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-sm font-semibold rounded-xl py-2.5 transition-colors shadow-[0_0_20px_rgba(14,165,233,0.25)]"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7 text-center">
        <h1 className="text-white text-[22px] font-semibold tracking-tight mb-1.5">Set new password</h1>
        <p className="text-white/40 text-sm">Choose a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-white/55 text-xs font-medium mb-1.5">New password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 pr-10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#0EA5E9]/50 focus:bg-white/[0.06] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-white/55 text-xs font-medium mb-1.5">Confirm new password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Repeat your password"
              className={`w-full bg-white/[0.04] border rounded-xl px-3.5 py-2.5 pr-10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:bg-white/[0.06] transition-colors ${
                confirmPass && confirmPass !== newPass
                  ? "border-[#EF4444]/50 focus:border-[#EF4444]/70"
                  : "border-white/[0.08] focus:border-[#0EA5E9]/50"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors"
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
          className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-sm font-semibold rounded-xl py-2.5 transition-colors mt-1 shadow-[0_0_20px_rgba(14,165,233,0.25)] disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={!newPass || newPass !== confirmPass}
        >
          Reset Password
        </button>
      </form>

      <p className="text-center text-white/30 text-xs mt-5">
        Remember your password?{" "}
        <Link to="/login" className="text-white/60 hover:text-white transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
