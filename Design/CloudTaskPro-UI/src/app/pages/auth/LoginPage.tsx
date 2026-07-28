import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Github } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <div className="mb-7 text-center">
        <h1 className="text-white text-[22px] font-semibold tracking-tight mb-1.5">Welcome back</h1>
        <p className="text-white/40 text-sm">Sign in to continue to CloudTask Pro</p>
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
        onSubmit={(e) => { e.preventDefault(); navigate("/app/dashboard"); }}
        className="space-y-3.5"
      >
        <div>
          <label className="block text-white/55 text-xs font-medium mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="marcus@payload.co"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#0EA5E9]/50 focus:bg-white/[0.06] transition-colors"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-white/55 text-xs font-medium">Password</label>
            <Link to="/forgot-password" className="text-[#0EA5E9] text-xs hover:text-[#38BDF8] transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
          Sign In
        </button>
      </form>

      <p className="text-center text-white/30 text-xs mt-5">
        Don't have an account?{" "}
        <Link to="/register" className="text-white/60 hover:text-white transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}
