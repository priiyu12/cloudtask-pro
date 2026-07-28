import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, Target, Heart, Zap, Globe } from "lucide-react";

const stats = [
  { label: "Teams using CloudTask Pro", value: "20,000+" },
  { label: "Tasks completed worldwide", value: "50M+" },
  { label: "Countries represented", value: "140+" },
  { label: "Team members supported", value: "500,000+" },
];

const values = [
  {
    num: "01",
    icon: Target,
    title: "Focus on outcomes",
    color: "#0EA5E9",
    desc: "We believe tools should empower people, not complicate their work. Every feature we ship is judged by whether it helps teams achieve real outcomes faster.",
  },
  {
    num: "02",
    icon: Heart,
    title: "Build with empathy",
    color: "#8B5CF6",
    desc: "Great software starts with deep understanding of the people who use it. We talk to our customers daily, observe how they work, and iterate relentlessly.",
  },
  {
    num: "03",
    icon: Zap,
    title: "Move with urgency",
    color: "#22C55E",
    desc: "We ship fast, learn faster, and are never satisfied with the status quo. Speed is a feature. Execution is a competitive advantage.",
  },
  {
    num: "04",
    icon: Globe,
    title: "Operate with transparency",
    color: "#F59E0B",
    desc: "We share our roadmap publicly, communicate honestly about incidents, and treat our customers as partners in building the best product management tool.",
  },
];

const team = [
  {
    name: "Mia Patel",
    role: "CEO & Co-founder",
    color: "#0EA5E9",
    bio: "Previously VP Engineering at Notion. Stanford CS grad. Obsessed with building tools that give people leverage.",
  },
  {
    name: "Jordan Lee",
    role: "CTO & Co-founder",
    color: "#8B5CF6",
    bio: "Ex-staff engineer at Stripe. Built payment infrastructure at scale. Believes elegant systems are the product.",
  },
  {
    name: "Aiko Tanaka",
    role: "Head of Design",
    color: "#22C55E",
    bio: "Former design lead at Figma. 10+ years crafting design systems for developer-focused products.",
  },
  {
    name: "Carlos Mendez",
    role: "Head of Product",
    color: "#F59E0B",
    bio: "Previously PM at Linear and Asana. Deep expertise in developer workflow tools and agile methodologies.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Mission Hero */}
      <section className="pt-24 pb-20 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-semibold mb-6">
              Our story
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              We're on a mission to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6]">
                make work feel less like work
              </span>
            </h1>
            <p className="text-white/60 text-xl leading-relaxed max-w-2xl mx-auto">
              CloudTask Pro was born out of frustration with bloated, slow project management tools that got in
              the way of actually getting things done. We set out to build something different — fast, beautiful,
              and built for the way modern teams actually work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/3 p-6 text-center"
            >
              <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] mb-2">
                {value}
              </p>
              <p className="text-white/50 text-sm leading-relaxed">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-[#0EA5E9] text-sm font-semibold uppercase tracking-widest mb-3">Our values</p>
            <h2 className="text-4xl font-extrabold mb-4">What we believe in</h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              These principles guide every decision we make — from product to hiring to how we treat our customers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map(({ num, icon: Icon, title, color, desc }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/3 p-7 flex gap-5"
              >
                <div className="flex-shrink-0">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-white/20 font-bold text-xs">{num}</span>
                    <h3 className="text-white font-semibold">{title}</h3>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-[#8B5CF6] text-sm font-semibold uppercase tracking-widest mb-3">The team</p>
            <h2 className="text-4xl font-extrabold mb-4">Meet the founders</h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              We're a small, focused team of builders who care deeply about craft and customer outcomes.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(({ name, role, color, bio }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/3 p-6 text-center"
              >
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: color }}
                >
                  {name[0]}
                </div>
                <p className="text-white font-semibold mb-1">{name}</p>
                <p className="text-xs font-medium mb-3" style={{ color }}>
                  {role}
                </p>
                <p className="text-white/40 text-xs leading-relaxed">{bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring CTA */}
      <section className="py-20 px-6 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="rounded-3xl border border-white/10 py-14 px-8 relative overflow-hidden"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,92,246,0.1) 0%, transparent 80%)",
              }}
            >
              <h2 className="text-4xl font-extrabold mb-4">Join our team</h2>
              <p className="text-white/50 text-lg mb-8 max-w-md mx-auto">
                We're always looking for exceptional people who care about craft, customers, and impact. Remote-first.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold px-6 py-3 rounded-xl transition-all"
              >
                View open roles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
