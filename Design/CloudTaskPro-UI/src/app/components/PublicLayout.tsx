import { Outlet, Link } from "react-router";
import { Cloud } from "lucide-react";
import { useState, useEffect } from "react";

function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-white/[0.05]" : ""}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#0EA5E9] flex items-center justify-center"><Cloud className="w-4 h-4 text-white" /></div>
          <span className="text-white font-semibold tracking-tight text-sm">CloudTask Pro</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {([["Pricing", "/pricing"], ["About", "/about"], ["Docs", "/docs"], ["Contact", "/contact"]] as const).map(([label, href]) => (
            <Link key={label} to={href} className="text-sm text-white/40 hover:text-white/80 transition-colors">{label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden md:block text-sm text-white/40 hover:text-white/80 transition-colors px-4 py-2">Sign In</Link>
          <Link to="/register" className="text-sm bg-white text-black font-semibold px-4 py-2 rounded-xl hover:bg-white/90 transition-all">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}

function PublicFooter() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/[0.04] py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#0EA5E9] flex items-center justify-center"><Cloud className="w-3.5 h-3.5 text-white" /></div>
          <span className="text-white font-semibold text-sm">CloudTask Pro</span>
        </Link>
        <div className="flex flex-wrap gap-x-8 gap-y-2 justify-center">
          {([["Pricing", "/pricing"], ["About", "/about"], ["Contact", "/contact"], ["Docs", "/docs"], ["Privacy", "/privacy"], ["Terms", "/terms"]] as const).map(([label, href]) => (
            <Link key={label} to={href} className="text-white/25 text-sm hover:text-white/55 transition-colors">{label}</Link>
          ))}
        </div>
        <p className="text-white/18 text-xs">© 2025 CloudTask Pro</p>
      </div>
    </footer>
  );
}

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <PublicNavbar />
      <main className="pt-16"><Outlet /></main>
      <PublicFooter />
    </div>
  );
}
