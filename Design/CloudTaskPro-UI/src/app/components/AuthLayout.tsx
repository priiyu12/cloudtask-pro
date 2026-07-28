import { Outlet, Link } from "react-router";
import { Cloud } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-16" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full bg-[#0EA5E9]/[0.04] blur-[120px] pointer-events-none" />
      <div className="relative w-full max-w-[420px]">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-xl bg-[#0EA5E9] flex items-center justify-center shadow-[0_0_16px_rgba(14,165,233,0.4)]"><Cloud className="w-4 h-4 text-white" /></div>
          <span className="text-white font-semibold tracking-tight">CloudTask Pro</span>
        </Link>
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-8 backdrop-blur-sm shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
          <Outlet />
        </div>
        <div className="mt-6 flex justify-center gap-5">
          {(["Privacy", "Terms", "Support"] as const).map(s => (
            <Link key={s} to={s === "Support" ? "/contact" : `/${s.toLowerCase()}`} className="text-white/18 text-xs hover:text-white/45 transition-colors">{s}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
