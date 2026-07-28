import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => { setResending(false); setResent(true); }, 1500);
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 flex items-center justify-center mx-auto mb-5">
          <Mail className="w-6 h-6 text-[#0EA5E9]" />
        </div>
        <h1 className="text-white text-[22px] font-semibold tracking-tight mb-1.5">Check your email</h1>
        <p className="text-white/40 text-sm mb-1">We sent a password reset link to</p>
        <p className="text-white/70 text-sm font-medium mb-7">{email}</p>

        <button
          onClick={handleResend}
          disabled={resending || resent}
          className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl py-2.5 text-white text-sm font-medium hover:bg-white/[0.08] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {resending ? "Sending…" : resent ? "Email sent!" : "Resend email"}
        </button>

        <Link to="/login" className="flex items-center justify-center gap-1.5 text-white/35 text-sm hover:text-white/65 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7 text-center">
        <h1 className="text-white text-[22px] font-semibold tracking-tight mb-1.5">Reset your password</h1>
        <p className="text-white/40 text-sm">Enter your email and we'll send you a reset link</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}
        className="space-y-3.5"
      >
        <div>
          <label className="block text-white/55 text-xs font-medium mb-1.5">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="marcus@payload.co"
            autoFocus
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#0EA5E9]/50 focus:bg-white/[0.06] transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-sm font-semibold rounded-xl py-2.5 transition-colors shadow-[0_0_20px_rgba(14,165,233,0.25)]"
        >
          Send Reset Link
        </button>
      </form>

      <Link to="/login" className="flex items-center justify-center gap-1.5 text-white/35 text-sm hover:text-white/65 transition-colors mt-5">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to sign in
      </Link>
    </div>
  );
}
