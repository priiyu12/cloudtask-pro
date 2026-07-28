import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import {
  BarChart3, Users, Bell, Cloud, ChevronDown, ArrowRight, Play,
  Check, Layout, Shield, Settings, TrendingUp, Calendar,
  Star, GitBranch, ListTodo, CheckCircle,
} from "lucide-react";

function useTypewriter(phrases: string[]) {
  const s = useRef({ pi: 0, ci: 0, del: false });
  const [d, setD] = useState("");
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    function tick() {
      const { pi, ci, del } = s.current;
      const p = phrases[pi];
      if (!del) {
        if (ci < p.length) { s.current.ci++; setD(p.slice(0, s.current.ci)); t = setTimeout(tick, 68); }
        else { s.current.del = true; t = setTimeout(tick, 2100); }
      } else {
        if (ci > 0) { s.current.ci--; setD(p.slice(0, s.current.ci)); t = setTimeout(tick, 36); }
        else { s.current.del = false; s.current.pi = (pi + 1) % phrases.length; t = setTimeout(tick, 280); }
      }
    }
    t = setTimeout(tick, 900); return () => clearTimeout(t);
  }, []); // eslint-disable-line
  return d;
}

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FloatingCard({ children, delay = 0, floatOffset = 0, className = "" }: { children: React.ReactNode; delay?: number; floatOffset?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.94, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }} className={`absolute ${className}`}>
      <motion.div animate={{ y: [0, floatOffset, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: delay * 0.6 }} className="bg-[#141414]/90 backdrop-blur-sm border border-white/[0.08] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
        {children}
      </motion.div>
    </motion.div>
  );
}

const TAGLINES = ["Manage Projects.", "Track Tasks.", "Scale Teams."];
const FEATURES = [
  { icon: GitBranch, title: "Project Management", desc: "Organize work into projects with full visibility across every milestone." },
  { icon: ListTodo, title: "Task Tracking", desc: "Create, assign, and monitor tasks across your entire team in real-time." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Real-time insights into team velocity, burndown, and project health." },
  { icon: Users, title: "Team Collaboration", desc: "Built-in comments, @mentions, and presence so nothing gets missed." },
  { icon: Layout, title: "Kanban Board", desc: "Drag-and-drop workflows that map exactly how your team ships work." },
  { icon: Bell, title: "Smart Notifications", desc: "Context-aware alerts that surface what matters and filter out noise." },
  { icon: Cloud, title: "Cloud Deployment", desc: "Deploy and manage cloud resources directly from your workspace." },
  { icon: Shield, title: "Role Management", desc: "Granular permissions so every team member has the right access level." },
];
const STEPS = [
  { num: "01", title: "Create Project", desc: "Set up a project in seconds. Add description, set deadlines, invite your team." },
  { num: "02", title: "Assign Tasks", desc: "Break work into tasks, set priorities, and assign to the right people." },
  { num: "03", title: "Track Progress", desc: "Monitor progress live with Kanban boards and analytics dashboards." },
  { num: "04", title: "Complete Work", desc: "Ship with confidence. Archive completed projects and celebrate wins." },
];
const TESTIMONIALS = [
  { quote: "CloudTask Pro completely transformed how our engineering team ships. The Kanban board and analytics alone are worth every penny.", name: "Sarah Chen", role: "Engineering Lead @ Loom", color: "#0EA5E9", initial: "S" },
  { quote: "Finally a project tool that feels as fast as our team. We cut delivery time by 30% in the first month.", name: "Marcus Webb", role: "CTO @ Payload", color: "#8B5CF6", initial: "M" },
  { quote: "We replaced three tools with CloudTask Pro. The collaboration features are genuinely top-notch for distributed teams.", name: "Priya Sharma", role: "Head of Product @ Resend", color: "#22C55E", initial: "P" },
];
const PLANS = [
  { name: "Free", price: "$0", sub: "forever", desc: "For individuals and small projects.", features: ["Up to 3 projects", "5 team members", "Basic analytics", "Kanban board", "Community support"], cta: "Get Started", pro: false },
  { name: "Pro", price: "$18", sub: "per seat / month", desc: "For growing teams that need full power.", features: ["Unlimited projects", "Unlimited members", "Advanced analytics", "Priority support", "Custom workflows", "API access", "Integrations"], cta: "Start Free Trial", pro: true },
  { name: "Enterprise", price: "Custom", sub: "contact sales", desc: "For large orgs with enterprise requirements.", features: ["Everything in Pro", "SSO & SAML", "Audit logs", "SLA guarantee", "Dedicated support", "Custom contracts", "On-premise option"], cta: "Contact Sales", pro: false },
];
const FAQS = [
  { q: "How does the free plan work?", a: "The free plan gives you full access to core features with up to 3 projects and 5 team members — forever. No credit card required to start." },
  { q: "Can I upgrade or downgrade at any time?", a: "Yes. You can change your plan any time. Changes take effect immediately and billing is prorated to the day." },
  { q: "Is there a self-hosted option?", a: "Enterprise plans include an on-premise deployment option with full white-labeling. Contact our sales team for details." },
  { q: "What integrations are available?", a: "CloudTask Pro connects to GitHub, Slack, Vercel, Linear, Notion, Jira, and dozens more via webhooks and our REST API." },
  { q: "How is my data secured?", a: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are SOC 2 Type II certified and conduct regular penetration tests." },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <motion.nav initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.05]" : ""}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#0EA5E9] flex items-center justify-center shadow-[0_0_16px_rgba(14,165,233,0.4)]"><Cloud className="w-4 h-4 text-white" /></div>
          <span className="text-white font-semibold tracking-tight text-sm">CloudTask Pro</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-white/40 hover:text-white/80 transition-colors">Features</a>
          <Link to="/pricing" className="text-sm text-white/40 hover:text-white/80 transition-colors">Pricing</Link>
          <Link to="/about" className="text-sm text-white/40 hover:text-white/80 transition-colors">About</Link>
          <Link to="/docs" className="text-sm text-white/40 hover:text-white/80 transition-colors">Docs</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden md:block text-sm text-white/40 hover:text-white/80 transition-colors px-4 py-2">Sign In</Link>
          <Link to="/register" className="text-sm bg-white text-black font-semibold px-4 py-2 rounded-xl hover:bg-white/90 transition-all duration-200">Get Started</Link>
        </div>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  const tagline = useTypewriter(TAGLINES);
  return (
    <section className="relative min-h-screen bg-[#0a0a0a] overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute top-[40%] left-[30%] w-[900px] h-[700px] rounded-full bg-[#0EA5E9]/[0.035] blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/[0.025] blur-[120px] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 py-36 grid lg:grid-cols-2 gap-16 items-center w-full">
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" /><span className="text-xs text-white/50 font-medium tracking-widest uppercase">Now in Public Beta</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }} className="text-[clamp(52px,7vw,80px)] font-semibold text-white leading-[1.04] tracking-[-0.03em] mb-7">
            CloudTask<br /><span className="text-white/25">Pro</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.38 }} className="h-11 flex items-center mb-8">
            <span className="text-[clamp(20px,2.8vw,28px)] text-white/60 font-light tracking-tight">{tagline}<span className="inline-block w-[2px] h-[1em] align-middle bg-[#0EA5E9] ml-1 animate-pulse" /></span>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.48 }} className="text-white/35 text-[17px] leading-relaxed mb-10 max-w-[420px]">
            The project management platform built for modern engineering teams. Ship faster, collaborate better, stay in control.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.56 }} className="flex flex-wrap items-center gap-4 mb-10">
            <Link to="/register" className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-xl text-sm hover:bg-white/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_24px_rgba(255,255,255,0.12)]">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/app/dashboard" className="flex items-center gap-2 border border-white/[0.1] text-white/60 hover:text-white hover:border-white/25 font-medium px-6 py-3 rounded-xl text-sm transition-all duration-200">
              <Play className="w-4 h-4 fill-current" /> Live Demo
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.85 }} className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {["#0EA5E9","#8B5CF6","#22C55E","#F59E0B","#EF4444"].map((c,i) => <div key={i} className="w-8 h-8 rounded-full border-[1.5px] border-[#0a0a0a] flex-shrink-0" style={{background:c}} />)}
            </div>
            <p className="text-sm text-white/35"><span className="text-white/65 font-medium">2,400+</span> teams already onboard</p>
          </motion.div>
        </div>
        <div className="relative h-[520px] hidden lg:block">
          <FloatingCard delay={0.6} floatOffset={-11} className="top-6 right-0 w-[280px]">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4"><span className="text-white/40 text-[11px] font-semibold uppercase tracking-wider">Sprint Progress</span><span className="text-[11px] text-[#22C55E] font-semibold px-2 py-0.5 rounded-full bg-[#22C55E]/10">On Track</span></div>
              <div className="space-y-3">{[{name:"API Integration",pct:85,color:"#0EA5E9"},{name:"UI Components",pct:62,color:"#8B5CF6"},{name:"Database Schema",pct:94,color:"#22C55E"}].map(t=>(
                <div key={t.name}><div className="flex justify-between mb-1.5"><span className="text-white/60 text-xs">{t.name}</span><span className="text-white/30 text-xs">{t.pct}%</span></div>
                  <div className="h-[3px] bg-white/[0.05] rounded-full overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${t.pct}%`}} transition={{duration:1.2,delay:1.2,ease:[0.22,1,0.36,1]}} className="h-full rounded-full" style={{background:t.color}} /></div>
                </div>
              ))}</div>
            </div>
          </FloatingCard>
          <FloatingCard delay={0.8} floatOffset={-8} className="top-4 left-0 w-[230px]">
            <div className="p-4"><div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-xs text-white font-bold flex-shrink-0">A</div><div><p className="text-white/70 text-xs font-medium leading-snug">Alex assigned you a task</p><p className="text-white/35 text-xs mt-1">&ldquo;Review Q3 Analytics Report&rdquo;</p><p className="text-white/20 text-[10px] mt-2">2 min ago</p></div></div></div>
          </FloatingCard>
          <FloatingCard delay={1.0} floatOffset={-13} className="top-[220px] left-4 w-[240px]">
            <div className="p-4"><div className="flex items-center gap-2.5 mb-2.5"><CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0" /><span className="text-white/70 text-sm font-medium">Task Completed</span></div><p className="text-white/35 text-xs leading-relaxed mb-3">Deploy authentication service to production environment</p><div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-[#0EA5E9] flex items-center justify-center text-[10px] text-white font-bold">S</div><span className="text-white/25 text-[11px]">Sarah K. · just now</span></div></div>
          </FloatingCard>
          <FloatingCard delay={1.15} floatOffset={-9} className="bottom-20 right-8 w-[190px]">
            <div className="p-4"><div className="flex items-center gap-1.5 mb-1.5"><TrendingUp className="w-3.5 h-3.5 text-[#22C55E]" /><span className="text-[#22C55E] text-[11px] font-semibold">+24% this week</span></div><div className="text-[32px] font-bold text-white leading-none">142</div><div className="text-white/35 text-[11px] mt-1">Tasks completed</div><div className="mt-3 flex items-end gap-[3px] h-8">{[40,60,35,80,55,90,70].map((h,i)=><motion.div key={i} initial={{height:0}} animate={{height:`${h}%`}} transition={{duration:0.6,delay:1.4+i*0.07,ease:[0.22,1,0.36,1]}} className="flex-1 rounded-sm bg-[#0EA5E9]/50" />)}</div></div>
          </FloatingCard>
          <FloatingCard delay={1.3} floatOffset={-7} className="bottom-8 left-0 w-[200px]">
            <div className="p-4"><div className="flex items-center gap-2 mb-3"><Users className="w-3.5 h-3.5 text-white/40" /><span className="text-white/50 text-xs font-medium">Active Team</span></div><div className="flex -space-x-1.5 mb-2">{["#0EA5E9","#8B5CF6","#22C55E","#F59E0B"].map((c,i)=><div key={i} className="w-7 h-7 rounded-full border-2 border-[#141414] flex items-center justify-center text-[10px] text-white font-bold" style={{background:c}}>{["S","M","P","A"][i]}</div>)}</div><p className="text-white/30 text-[11px]">4 members online now</p></div>
          </FloatingCard>
        </div>
      </div>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2,duration:0.8}} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-white/15 text-[10px] tracking-[0.25em] uppercase">Scroll</span>
        <motion.div animate={{y:[0,5,0]}} transition={{duration:1.4,repeat:Infinity,ease:"easeInOut"}}><ChevronDown className="w-4 h-4 text-white/15" /></motion.div>
      </motion.div>
    </section>
  );
}

function LogoSection() {
  const {ref,visible} = useReveal();
  return (
    <section ref={ref} className="bg-[#0a0a0a] border-y border-white/[0.04] py-14">
      <motion.div initial={{opacity:0,y:14}} animate={visible?{opacity:1,y:0}:{opacity:0,y:14}} transition={{duration:0.65}} className="max-w-7xl mx-auto px-6">
        <p className="text-center text-white/18 text-[11px] uppercase tracking-[0.22em] mb-10">Trusted by teams at</p>
        <div className="flex flex-wrap justify-center items-center gap-x-14 gap-y-5">
          {["GitHub","Vercel","Stripe","AWS","Docker","React"].map((co,i)=>(
            <motion.span key={co} initial={{opacity:0}} animate={visible?{opacity:1}:{opacity:0}} transition={{delay:0.06*i,duration:0.5}} className="text-white/18 hover:text-white/45 transition-colors text-[17px] font-semibold tracking-tight cursor-default select-none">{co}</motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  const {ref,visible} = useReveal();
  return (
    <section id="features" ref={ref} className="bg-[#0a0a0a] py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{opacity:0,y:24}} animate={visible?{opacity:1,y:0}:{opacity:0,y:24}} transition={{duration:0.7}} className="mb-16">
          <p className="text-[#0EA5E9] text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">Features</p>
          <h2 className="text-[clamp(32px,4.5vw,52px)] font-semibold text-white tracking-[-0.025em] max-w-lg leading-tight">Everything your team needs to ship</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f,i)=>{const Icon=f.icon;return(
            <motion.div key={f.title} initial={{opacity:0,y:24}} animate={visible?{opacity:1,y:0}:{opacity:0,y:24}} transition={{duration:0.6,delay:i*0.055}} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 cursor-default">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mb-5 group-hover:bg-[#0EA5E9]/10 transition-colors duration-300"><Icon className="w-5 h-5 text-white/30 group-hover:text-[#0EA5E9] transition-colors duration-300" /></div>
              <h3 className="text-white/85 font-medium text-sm mb-2">{f.title}</h3>
              <p className="text-white/35 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          );})}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const {ref,visible} = useReveal();
  return (
    <section ref={ref} className="bg-[#0a0a0a] py-32 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{opacity:0,y:24}} animate={visible?{opacity:1,y:0}:{opacity:0,y:24}} transition={{duration:0.7}} className="text-center mb-20">
          <p className="text-[#0EA5E9] text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">Process</p>
          <h2 className="text-[clamp(32px,4.5vw,52px)] font-semibold text-white tracking-[-0.025em]">How It Works</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-11 left-[14%] right-[14%] h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          {STEPS.map((step,i)=>(
            <motion.div key={step.num} initial={{opacity:0,y:28}} animate={visible?{opacity:1,y:0}:{opacity:0,y:28}} transition={{duration:0.65,delay:i*0.1}} className="flex flex-col items-center text-center">
              <div className="w-[88px] h-[88px] rounded-2xl bg-white/[0.02] border border-white/[0.07] flex items-center justify-center mb-8 relative z-10"><span className="text-[28px] font-bold text-white/10 font-mono">{step.num}</span></div>
              <h3 className="text-white/85 font-semibold text-sm mb-3">{step.title}</h3>
              <p className="text-white/35 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreviewSection() {
  const {ref,visible} = useReveal();
  return (
    <section ref={ref} className="bg-[#0a0a0a] py-32 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{opacity:0,y:24}} animate={visible?{opacity:1,y:0}:{opacity:0,y:24}} transition={{duration:0.7}} className="text-center mb-14">
          <p className="text-[#0EA5E9] text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">Product</p>
          <h2 className="text-[clamp(32px,4.5vw,52px)] font-semibold text-white tracking-[-0.025em] mb-4">Built for how teams actually work</h2>
          <p className="text-white/35 max-w-md mx-auto text-[15px]">A unified workspace that brings your projects, tasks, and team together.</p>
        </motion.div>
        <motion.div initial={{opacity:0,y:36,scale:0.97}} animate={visible?{opacity:1,y:0,scale:1}:{opacity:0,y:36,scale:0.97}} transition={{duration:0.9,delay:0.18,ease:[0.22,1,0.36,1]}} className="rounded-2xl overflow-hidden border border-white/[0.07] shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2 px-5 py-3 bg-[#111111] border-b border-white/[0.05]">
            <div className="flex gap-1.5">{[0,1,2].map(i=><div key={i} className="w-3 h-3 rounded-full bg-white/[0.1]" />)}</div>
            <div className="flex-1 max-w-xs mx-auto"><div className="bg-white/[0.04] rounded-md px-3 py-1 text-[11px] text-white/20 text-center">app.cloudtaskpro.com/dashboard</div></div>
          </div>
          <div className="flex h-[400px] bg-[#0d0d0d]">
            <div className="w-44 border-r border-white/[0.05] p-4 flex flex-col gap-0.5 flex-shrink-0">
              <div className="flex items-center gap-2 mb-5"><div className="w-6 h-6 rounded-md bg-[#0EA5E9] flex items-center justify-center"><Cloud className="w-3 h-3 text-white" /></div><span className="text-white text-xs font-semibold">CloudTask</span></div>
              {([{icon:Layout,label:"Dashboard",active:true},{icon:GitBranch,label:"Projects"},{icon:ListTodo,label:"Tasks"},{icon:BarChart3,label:"Analytics"},{icon:Users,label:"Team"},{icon:Calendar,label:"Calendar"},{icon:Settings,label:"Settings"}] as {icon:React.ElementType;label:string;active?:boolean}[]).map(({icon:Icon,label,active})=>(
                <div key={label} className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer ${active?"bg-white text-black font-semibold":"text-white/35 hover:text-white/65 hover:bg-white/[0.04]"}`}><Icon className="w-3.5 h-3.5 flex-shrink-0" /><span className="font-medium">{label}</span></div>
              ))}
            </div>
            <div className="flex-1 p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-5"><div><h3 className="text-white font-semibold text-sm">Good morning, Marcus 👋</h3><p className="text-white/25 text-[11px] mt-0.5">Here is what is happening today</p></div><div className="flex gap-2"><div className="w-7 h-7 rounded-full bg-[#0EA5E9]/15 flex items-center justify-center"><Bell className="w-3 h-3 text-[#0EA5E9]" /></div><div className="w-7 h-7 rounded-full bg-[#8B5CF6] flex items-center justify-center text-[10px] text-white font-bold">M</div></div></div>
              <div className="grid grid-cols-4 gap-2.5 mb-4">{[{label:"Projects",value:"12",accent:"#0EA5E9"},{label:"Open Tasks",value:"47",accent:"#F59E0B"},{label:"Completed",value:"134",accent:"#22C55E"},{label:"Overdue",value:"3",accent:"#EF4444"}].map(s=>(
                <div key={s.label} className="bg-white/[0.03] border border-white/[0.04] rounded-xl p-3"><div className="text-lg font-bold text-white">{s.value}</div><div className="text-white/25 text-[10px] mt-0.5">{s.label}</div><div className="mt-2 h-[2px] rounded-full" style={{background:s.accent,opacity:0.45}} /></div>
              ))}</div>
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4"><h4 className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-3">Recent Projects</h4>
                <div className="space-y-2.5">{[{name:"Frontend Redesign",status:"In Progress",pct:68,color:"#0EA5E9"},{name:"API v2 Migration",status:"Review",pct:85,color:"#8B5CF6"},{name:"Mobile App Launch",status:"Planning",pct:23,color:"#F59E0B"}].map(p=>(
                  <div key={p.name} className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:p.color}} /><span className="text-white/55 text-[11px] flex-1 truncate">{p.name}</span><span className="text-white/20 text-[10px] w-16 text-right shrink-0">{p.status}</span><div className="w-20 h-[3px] bg-white/[0.05] rounded-full overflow-hidden flex-shrink-0"><div className="h-full rounded-full" style={{width:`${p.pct}%`,background:p.color}} /></div><span className="text-white/25 text-[10px] w-8 text-right flex-shrink-0">{p.pct}%</span></div>
                ))}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const {ref,visible} = useReveal();
  return (
    <section ref={ref} className="bg-[#0a0a0a] py-32 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{opacity:0,y:24}} animate={visible?{opacity:1,y:0}:{opacity:0,y:24}} transition={{duration:0.7}} className="text-center mb-16">
          <p className="text-[#0EA5E9] text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">Testimonials</p>
          <h2 className="text-[clamp(32px,4.5vw,52px)] font-semibold text-white tracking-[-0.025em]">Loved by engineering teams</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t,i)=>(
            <motion.div key={t.name} initial={{opacity:0,y:24}} animate={visible?{opacity:1,y:0}:{opacity:0,y:24}} transition={{duration:0.65,delay:i*0.1}} className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors duration-300">
              <div className="flex gap-0.5 mb-5">{Array.from({length:5}).map((_,j)=><Star key={j} className="w-3.5 h-3.5 text-[#F59E0B]" style={{fill:"#F59E0B"}} />)}</div>
              <p className="text-white/50 text-sm leading-relaxed mb-7">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full flex items-center justify-center text-sm text-white font-bold flex-shrink-0" style={{background:t.color}}>{t.initial}</div><div><p className="text-white/80 font-medium text-sm">{t.name}</p><p className="text-white/25 text-xs">{t.role}</p></div></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const {ref,visible} = useReveal();
  return (
    <section id="pricing" ref={ref} className="bg-[#0a0a0a] py-32 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{opacity:0,y:24}} animate={visible?{opacity:1,y:0}:{opacity:0,y:24}} transition={{duration:0.7}} className="text-center mb-14">
          <p className="text-[#0EA5E9] text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">Pricing</p>
          <h2 className="text-[clamp(32px,4.5vw,52px)] font-semibold text-white tracking-[-0.025em] mb-3">Simple, transparent pricing</h2>
          <p className="text-white/30 text-[15px]">No hidden fees. No surprises. Cancel anytime.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan,i)=>(
            <motion.div key={plan.name} initial={{opacity:0,y:28}} animate={visible?{opacity:1,y:0}:{opacity:0,y:28}} transition={{duration:0.65,delay:i*0.1}} className={`relative rounded-2xl p-8 transition-all duration-300 ${plan.pro?"bg-white shadow-[0_0_60px_rgba(255,255,255,0.08)]":"bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12]"}`}>
              {plan.pro&&<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0EA5E9] text-white text-[11px] font-semibold px-4 py-1 rounded-full shadow-[0_0_16px_rgba(14,165,233,0.5)]">Most Popular</div>}
              <div className="mb-7"><h3 className={`font-semibold mb-1 text-sm ${plan.pro?"text-black":"text-white/80"}`}>{plan.name}</h3><div className={`text-[42px] font-bold leading-none mb-1 ${plan.pro?"text-black":"text-white"}`}>{plan.price}</div><p className={`text-[11px] ${plan.pro?"text-black/40":"text-white/25"}`}>{plan.sub}</p><p className={`text-sm mt-3.5 leading-relaxed ${plan.pro?"text-black/55":"text-white/35"}`}>{plan.desc}</p></div>
              <ul className="space-y-2.5 mb-8">{plan.features.map(f=><li key={f} className="flex items-center gap-2.5"><Check className={`w-4 h-4 flex-shrink-0 ${plan.pro?"text-black":"text-[#22C55E]"}`} /><span className={`text-sm ${plan.pro?"text-black/65":"text-white/45"}`}>{f}</span></li>)}</ul>
              <Link to={plan.pro?"/register":plan.name==="Enterprise"?"/contact":"/register"} className={`block w-full py-3 rounded-xl font-semibold text-sm text-center transition-all duration-200 hover:scale-[1.01] ${plan.pro?"bg-black text-white hover:bg-black/80":"bg-white/[0.05] text-white/80 hover:bg-white/[0.1] border border-white/[0.08]"}`}>{plan.cta}</Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open,setOpen] = useState<number|null>(null);
  const {ref,visible} = useReveal();
  return (
    <section ref={ref} className="bg-[#0a0a0a] py-32 border-t border-white/[0.04]">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div initial={{opacity:0,y:24}} animate={visible?{opacity:1,y:0}:{opacity:0,y:24}} transition={{duration:0.7}} className="text-center mb-14">
          <p className="text-[#0EA5E9] text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">FAQ</p>
          <h2 className="text-[clamp(32px,4.5vw,52px)] font-semibold text-white tracking-[-0.025em]">Common questions</h2>
        </motion.div>
        <div className="space-y-2.5">
          {FAQS.map((faq,i)=>(
            <motion.div key={i} initial={{opacity:0,y:14}} animate={visible?{opacity:1,y:0}:{opacity:0,y:14}} transition={{duration:0.5,delay:i*0.065}} className="border border-white/[0.06] rounded-xl overflow-hidden">
              <button onClick={()=>setOpen(open===i?null:i)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors duration-200">
                <span className="text-white/75 font-medium text-sm pr-4">{faq.q}</span>
                <motion.div animate={{rotate:open===i?180:0}} transition={{duration:0.26}} className="flex-shrink-0"><ChevronDown className="w-4 h-4 text-white/25" /></motion.div>
              </button>
              <motion.div initial={false} animate={{height:open===i?"auto":0,opacity:open===i?1:0}} transition={{duration:0.3,ease:[0.22,1,0.36,1]}} className="overflow-hidden"><div className="px-6 pb-5"><p className="text-white/35 text-sm leading-relaxed">{faq.a}</p></div></motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const {ref,visible} = useReveal();
  return (
    <section ref={ref} className="bg-[#0a0a0a] py-24 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{opacity:0,y:24}} animate={visible?{opacity:1,y:0}:{opacity:0,y:24}} transition={{duration:0.7}} className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.06] px-10 py-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.06)_0%,transparent_70%)]" />
          <div className="relative"><h2 className="text-[clamp(28px,4vw,48px)] font-semibold text-white tracking-[-0.025em] mb-4">Start building with CloudTask Pro</h2><p className="text-white/35 text-[15px] mb-8 max-w-md mx-auto">Join 2,400+ teams already shipping faster. Free forever, no credit card required.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/register" className="flex items-center gap-2 bg-white text-black font-semibold px-7 py-3.5 rounded-xl text-sm hover:bg-white/90 transition-all duration-200 hover:scale-[1.02]">Get Started Free <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/contact" className="flex items-center gap-2 border border-white/[0.1] text-white/60 hover:text-white hover:border-white/25 font-medium px-7 py-3.5 rounded-xl text-sm transition-all duration-200">Talk to Sales</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/[0.04] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-14">
          <div className="md:col-span-2"><div className="flex items-center gap-2.5 mb-4"><div className="w-7 h-7 rounded-lg bg-[#0EA5E9] flex items-center justify-center"><Cloud className="w-4 h-4 text-white" /></div><span className="text-white font-semibold tracking-tight text-sm">CloudTask Pro</span></div><p className="text-white/25 text-sm leading-relaxed max-w-xs">The project management platform for modern engineering teams.</p></div>
          {[{heading:"Product",links:[["Features","/#features"],["Pricing","/pricing"],["Changelog","/docs"],["Roadmap","/docs"]] as [string,string][]},{heading:"Company",links:[["About","/about"],["Blog","/docs"],["Careers","/about"],["Contact","/contact"]] as [string,string][]},{heading:"Legal",links:[["Privacy","/privacy"],["Terms","/terms"],["Security","/docs"],["Cookies","/privacy"]] as [string,string][]}].map(col=>(
            <div key={col.heading}><h4 className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-4">{col.heading}</h4><ul className="space-y-2.5">{col.links.map(([label,href])=><li key={label}><Link to={href} className="text-white/25 text-sm hover:text-white/55 transition-colors duration-200">{label}</Link></li>)}</ul></div>
          ))}
        </div>
        <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/15 text-xs">© 2025 CloudTask Pro, Inc. All rights reserved.</p>
          <div className="flex gap-6">{["Twitter","GitHub","LinkedIn"].map(s=><a key={s} href="#" className="text-white/15 text-xs hover:text-white/40 transition-colors duration-200">{s}</a>)}</div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{fontFamily:"'Inter', system-ui, sans-serif"}}>
      <Navbar /><HeroSection /><LogoSection /><FeaturesSection /><HowItWorksSection /><DashboardPreviewSection /><TestimonialsSection /><PricingSection /><FAQSection /><CTASection /><Footer />
    </div>
  );
}
