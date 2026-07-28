import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(14,165,233,0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative text-center"
      >
        {/* Giant muted 404 */}
        <div
          className="font-extrabold leading-none select-none mb-0 text-white/[0.04]"
          style={{ fontSize: "clamp(120px, 20vw, 220px)" }}
        >
          404
        </div>

        {/* Content overlapping */}
        <div className="-mt-10 md:-mt-16">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Page not found
          </h1>
          <p className="text-white/40 text-base mb-10 max-w-sm mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved to another URL. Check the address bar or head back home.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-[#0EA5E9]/20"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 border border-white/10 hover:border-white/25 text-white/60 hover:text-white font-medium px-6 py-3 rounded-xl text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
