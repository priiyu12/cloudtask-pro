import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft } from "lucide-react";
import { api } from "@/app/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      await api.forgotPassword(email);
      setResent(true);
    } catch (e) {
      console.error(e);
      alert("An error occurred.");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (err) {
      console.error(err);
      alert("Failed to send reset link.");
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-5">
          <Mail className="w-6 h-6 text-accent" />
        </div>
        <h1 className="text-foreground text-[22px] font-semibold tracking-tight mb-1.5">Check your email</h1>
        <p className="text-muted-foreground text-sm mb-1">We sent a password reset link to</p>
        <p className="text-muted-foreground text-sm font-medium mb-7">{email}</p>

        <button
          onClick={handleResend}
          disabled={resending || resent}
          className="w-full bg-secondary border border-white/[0.09] rounded-xl py-2.5 text-foreground text-sm font-medium hover:bg-white/[0.08] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {resending ? "Sending…" : resent ? "Email sent!" : "Resend email"}
        </button>

        <Link to="/login" className="flex items-center justify-center gap-1.5 text-foreground/35 text-sm hover:text-foreground/65 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7 text-center">
        <h1 className="text-foreground text-[22px] font-semibold tracking-tight mb-1.5">Reset your password</h1>
        <p className="text-muted-foreground text-sm">Enter your email and we'll send you a reset link</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3.5"
      >
        <div>
          <label className="block text-foreground/55 text-xs font-medium mb-1.5">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="marcus@payload.co"
            autoFocus
            className="w-full bg-secondary border border-border rounded-xl px-3.5 py-2.5 text-foreground text-sm placeholder:text-foreground/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-accent hover:bg-[#0284C7] text-foreground text-sm font-semibold rounded-xl py-2.5 transition-colors shadow-[0_0_20px_rgba(14,165,233,0.25)]"
        >
          Send Reset Link
        </button>
      </form>

      <Link to="/login" className="flex items-center justify-center gap-1.5 text-foreground/35 text-sm hover:text-foreground/65 transition-colors mt-5">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to sign in
      </Link>
    </div>
  );
}
