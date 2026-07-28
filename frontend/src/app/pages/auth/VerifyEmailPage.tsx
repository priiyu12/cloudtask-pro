import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail } from "lucide-react";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => { setResending(false); setResent(true); }, 1500);
  };

  return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-5">
        <Mail className="w-6 h-6 text-accent" />
      </div>

      <h1 className="text-foreground text-[22px] font-semibold tracking-tight mb-1.5">Verify your email</h1>
      <p className="text-muted-foreground text-sm mb-1">We sent a verification link to</p>
      <p className="text-muted-foreground text-sm font-medium mb-7">marcus@payload.co</p>

      <button
        type="button"
        disabled
        className="w-full bg-accent hover:bg-[#0284C7] text-foreground text-sm font-semibold rounded-xl py-2.5 transition-colors shadow-[0_0_20px_rgba(14,165,233,0.25)] mb-3"
      >
        Open Email App
      </button>

      <button
        onClick={handleResend}
        disabled={resending || resent}
        className="w-full bg-secondary border border-white/[0.09] rounded-xl py-2.5 text-foreground text-sm font-medium hover:bg-white/[0.08] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        {resending ? "Sending…" : resent ? "Email resent!" : "Resend email"}
      </button>

      <p className="text-muted-foreground text-xs">
        Already verified?{" "}
        <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
          Sign in
        </Link>
      </p>

      <p className="text-foreground/20 text-[11px] mt-5 leading-relaxed">
        Didn't receive anything? Check your spam folder or make sure you entered the right email address.
      </p>
    </div>
  );
}
