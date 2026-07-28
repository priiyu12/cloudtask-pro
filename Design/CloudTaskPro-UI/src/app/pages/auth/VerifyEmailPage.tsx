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
      <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 flex items-center justify-center mx-auto mb-5">
        <Mail className="w-6 h-6 text-[#0EA5E9]" />
      </div>

      <h1 className="text-white text-[22px] font-semibold tracking-tight mb-1.5">Verify your email</h1>
      <p className="text-white/40 text-sm mb-1">We sent a verification link to</p>
      <p className="text-white/70 text-sm font-medium mb-7">marcus@payload.co</p>

      <button
        onClick={() => navigate("/app/dashboard")}
        className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-sm font-semibold rounded-xl py-2.5 transition-colors shadow-[0_0_20px_rgba(14,165,233,0.25)] mb-3"
      >
        Open Email App
      </button>

      <button
        onClick={handleResend}
        disabled={resending || resent}
        className="w-full bg-white/[0.05] border border-white/[0.09] rounded-xl py-2.5 text-white text-sm font-medium hover:bg-white/[0.08] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        {resending ? "Sending…" : resent ? "Email resent!" : "Resend email"}
      </button>

      <p className="text-white/30 text-xs">
        Already verified?{" "}
        <Link to="/login" className="text-white/60 hover:text-white transition-colors">
          Sign in
        </Link>
      </p>

      <p className="text-white/20 text-[11px] mt-5 leading-relaxed">
        Didn't receive anything? Check your spam folder or make sure you entered the right email address.
      </p>
    </div>
  );
}
