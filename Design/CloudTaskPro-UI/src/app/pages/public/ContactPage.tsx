import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, MessageSquare, CheckCircle2, Send, Clock, Zap } from "lucide-react";

const subjects = [
  "General inquiry",
  "Sales & pricing",
  "Technical support",
  "Partnership",
  "Bug report",
  "Feature request",
  "Enterprise inquiry",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="pt-24 pb-12 px-6 text-center relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(14,165,233,0.10) 0%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/10 text-[#0EA5E9] text-xs font-semibold mb-5">
            <MessageSquare className="w-3 h-3" />
            Get in touch
          </div>
          <h1 className="text-5xl font-extrabold mb-4">Contact us</h1>
          <p className="text-white/50 text-lg max-w-md mx-auto">
            Have a question or need help? We'd love to hear from you. Our team typically responds within a few hours.
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-10">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            <div>
              <h2 className="text-2xl font-bold mb-6">Other ways to reach us</h2>

              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-white/10 bg-white/3">
                  <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/15 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#0EA5E9]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Email</p>
                    <p className="text-white/50 text-sm mb-1">For non-urgent questions</p>
                    <a
                      href="mailto:hello@cloudtaskpro.com"
                      className="text-[#0EA5E9] text-sm hover:underline"
                    >
                      hello@cloudtaskpro.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl border border-white/10 bg-white/3">
                  <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Live chat</p>
                    <p className="text-white/50 text-sm mb-1">Available Mon–Fri, 9am–6pm PT</p>
                    <button className="text-[#8B5CF6] text-sm hover:underline text-left">
                      Open live chat →
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl border border-white/10 bg-white/3">
                  <div className="w-10 h-10 rounded-xl bg-[#22C55E]/15 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Enterprise sales</p>
                    <p className="text-white/50 text-sm mb-1">Talk directly with our team</p>
                    <a
                      href="mailto:sales@cloudtaskpro.com"
                      className="text-[#22C55E] text-sm hover:underline"
                    >
                      sales@cloudtaskpro.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-white/40" />
                <p className="text-white/70 text-sm font-medium">Response times</p>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                {[
                  { plan: "Free", time: "Within 48 hours" },
                  { plan: "Pro", time: "Within 8 hours" },
                  { plan: "Enterprise", time: "Within 1 hour" },
                ].map(({ plan, time }) => (
                  <div key={plan} className="flex justify-between">
                    <span className="text-white/50 text-xs">{plan}</span>
                    <span className="text-white/70 text-xs font-medium">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-white/10 bg-white/3 p-8">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-12 text-center gap-5"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#22C55E]/15 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Message sent!</h3>
                      <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                        Thanks for reaching out, {form.name.split(" ")[0]}. We've received your message and
                        will get back to you at{" "}
                        <span className="text-white/80">{form.email}</span> as soon as possible.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: "", email: "", subject: "", message: "" });
                      }}
                      className="mt-2 text-[#0EA5E9] text-sm hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                  >
                    <h2 className="text-xl font-bold mb-1">Send us a message</h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/60 text-xs font-medium mb-1.5 block">
                          Full name <span className="text-red-400">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Jane Smith"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-white/60 text-xs font-medium mb-1.5 block">
                          Email address <span className="text-red-400">*</span>
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="jane@company.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-white/60 text-xs font-medium mb-1.5 block">
                        Subject <span className="text-red-400">*</span>
                      </label>
                      <select
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-[#1a1a1a]">
                          Select a subject...
                        </option>
                        {subjects.map((s) => (
                          <option key={s} value={s} className="bg-[#1a1a1a]">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-white/60 text-xs font-medium mb-1.5 block">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell us how we can help..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#0EA5E9]/50 transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send message
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
