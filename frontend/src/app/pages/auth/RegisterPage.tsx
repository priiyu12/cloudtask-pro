import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Github } from "lucide-react";
import { api, setToken } from "../../lib/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/register", {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
      });
      const login = await api.post<{ access_token: string }>("/auth/login", {
        email: form.email,
        password: form.password,
      });
      setToken(login.access_token);
      navigate("/app/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-7 text-center">
        <h1 className="text-foreground text-[22px] font-semibold tracking-tight mb-1.5">Create your account</h1>
        <p className="text-muted-foreground text-sm">Free forever. No credit card required.</p>
      </div>



      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-foreground/55 text-xs font-medium mb-1.5">First name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={set("firstName")}
              placeholder="Marcus"
              className="w-full bg-secondary border border-border rounded-xl px-3.5 py-2.5 text-foreground text-sm placeholder:text-foreground/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-colors"
            />
          </div>
          <div>
            <label className="block text-foreground/55 text-xs font-medium mb-1.5">Last name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={set("lastName")}
              placeholder="Webb"
              className="w-full bg-secondary border border-border rounded-xl px-3.5 py-2.5 text-foreground text-sm placeholder:text-foreground/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-foreground/55 text-xs font-medium mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="marcus@payload.co"
            className="w-full bg-secondary border border-border rounded-xl px-3.5 py-2.5 text-foreground text-sm placeholder:text-foreground/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-colors"
          />
        </div>

        <div>
          <label className="block text-foreground/55 text-xs font-medium mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={set("password")}
              placeholder="Min. 8 characters"
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
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-foreground/20 text-[11px] mt-4 leading-relaxed">
        By creating an account, you agree to our{" "}
        <Link to="/terms" className="text-muted-foreground hover:text-muted-foreground transition-colors underline underline-offset-2">Terms of Service</Link>
        {" "}and{" "}
        <Link to="/privacy" className="text-muted-foreground hover:text-muted-foreground transition-colors underline underline-offset-2">Privacy Policy</Link>.
      </p>

      <p className="text-center text-muted-foreground text-xs mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
