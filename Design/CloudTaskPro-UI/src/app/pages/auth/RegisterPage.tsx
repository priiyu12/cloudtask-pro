import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Github } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <div className="mb-7 text-center">
        <h1 className="text-white text-[22px] font-semibold tracking-tight mb-1.5">Create your account</h1>
        <p className="text-white/40 text-sm">Free forever. No credit card required.</p>
      </div>

      <button
        onClick={() => navigate("/app/dashboard")}
        className="w-full flex items-center justify-center gap-2.5 bg-white/[0.05] border border-white/[0.09] rounded-xl py-2.5 text-white text-sm font-medium hover:bg-white/[0.08] transition-colors mb-5"
      >
        <Github className="w-4 h-4" />
        Continue with GitHub
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-white/[0.07]" />
        <span className="text-white/25 text-xs">or</span>
        <div className="flex-1 h-px bg-white/[0.07]" />
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); navigate("/verify-email"); }}
        className="space-y-3.5"
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-white/55 text-xs font-medium mb-1.5">First name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={set("firstName")}
              placeholder="Marcus"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#0EA5E9]/50 focus:bg-white/[0.06] transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/55 text-xs font-medium mb-1.5">Last name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={set("lastName")}
              placeholder="Webb"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#0EA5E9]/50 focus:bg-white/[0.06] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-white/55 text-xs font-medium mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="marcus@payload.co"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#0EA5E9]/50 focus:bg-white/[0.06] transition-colors"
          />
        </div>

        <div>
          <label className="block text-white/55 text-xs font-medium mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={set("password")}
              placeholder="Min. 8 characters"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 pr-10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#0EA5E9]/50 focus:bg-white/[0.06] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-sm font-semibold rounded-xl py-2.5 transition-colors mt-1 shadow-[0_0_20px_rgba(14,165,233,0.25)]"
        >
          Create Account
        </button>
      </form>

      <p className="text-center text-white/20 text-[11px] mt-4 leading-relaxed">
        By creating an account, you agree to our{" "}
        <Link to="/terms" className="text-white/40 hover:text-white/70 transition-colors underline underline-offset-2">Terms of Service</Link>
        {" "}and{" "}
        <Link to="/privacy" className="text-white/40 hover:text-white/70 transition-colors underline underline-offset-2">Privacy Policy</Link>.
      </p>

      <p className="text-center text-white/30 text-xs mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-white/60 hover:text-white transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
