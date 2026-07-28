import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Github } from "lucide-react";
import { api, setToken } from "../../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api.post<{ access_token: string }>("/auth/login", { email, password });
      setToken(data.access_token);
      navigate("/app/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-7 text-center">
        <h1 className="text-foreground text-[22px] font-semibold tracking-tight mb-1.5">Welcome back</h1>
        <p className="text-muted-foreground text-sm">Sign in to continue to CloudTask Pro</p>
      </div>



      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-foreground/55 text-xs font-medium mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="demo@cloudtaskpro.com"
            className="w-full bg-secondary border border-border rounded-xl px-3.5 py-2.5 text-foreground text-sm placeholder:text-foreground/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-colors"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-foreground/55 text-xs font-medium">Password</label>
            <Link to="/forgot-password" className="text-accent text-xs hover:text-[#38BDF8] transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-secondary border border-border rounded-xl px-3.5 py-2.5 pr-10 text-foreground text-sm placeholder:text-foreground/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/25 hover:text-foreground/55 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error ? <p className="text-[#EF4444] text-xs">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-[#0284C7] disabled:opacity-60 text-foreground text-sm font-semibold rounded-xl py-2.5 transition-colors mt-1 shadow-[0_0_20px_rgba(14,165,233,0.25)]"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-muted-foreground text-xs mt-5">
        Don't have an account?{" "}
        <Link to="/register" className="text-muted-foreground hover:text-foreground transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}
