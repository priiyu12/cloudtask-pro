import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  X,
  ChevronDown,
  Zap,
  ArrowRight,
  Shield,
  Users,
  BarChart3,
  GitBranch,
  Bell,
  FileText,
  Lock,
  Headphones,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    monthly: 0,
    desc: "For individuals and small teams just getting started with project management.",
    color: "#22C55E",
    to: "/register",
    cta: "Get started free",
    features: [
      "Up to 3 active projects",
      "10 team members",
      "Basic kanban board",
      "Task assignments & due dates",
      "5 GB file storage",
      "Community support",
      "Mobile app access",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    monthly: 12,
    desc: "For growing teams that need unlimited projects, advanced analytics, and integrations.",
    color: "#0EA5E9",
    to: "/register",
    cta: "Start 14-day free trial",
    badge: "Most Popular",
    features: [
      "Unlimited active projects",
      "Unlimited team members",
      "Advanced kanban & timeline",
      "Custom workflows & fields",
      "Advanced analytics & reports",
      "50 GB file storage",
      "Priority email support",
      "Git integrations (GitHub, GitLab)",
      "Slack & Figma integrations",
      "Automations (up to 1,000/mo)",
      "API access",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    monthly: null,
    desc: "For large organizations with advanced security, compliance, and dedicated support needs.",
    color: "#8B5CF6",
    to: "/contact",
    cta: "Contact sales",
    features: [
      "Everything in Pro",
      "SSO / SAML 2.0",
      "SCIM provisioning",
      "Advanced audit logs",
      "SOC 2 & HIPAA compliance",
      "Unlimited storage",
      "Dedicated success manager",
      "Custom integrations",
      "SLA guarantee (99.9%)",
      "On-premise deployment option",
      "Custom automations (unlimited)",
      "White-labeling available",
    ],
    highlight: false,
  },
];

const comparisonRows = [
  { feature: "Active projects", free: "3", pro: "Unlimited", enterprise: "Unlimited", icon: FileText },
  { feature: "Team members", free: "10", pro: "Unlimited", enterprise: "Unlimited", icon: Users },
  { feature: "File storage", free: "5 GB", pro: "50 GB", enterprise: "Unlimited", icon: FileText },
  { feature: "Analytics & reports", free: "Basic", pro: "Advanced", enterprise: "Custom", icon: BarChart3 },
  { feature: "Git integrations", free: false, pro: true, enterprise: true, icon: GitBranch },
  { feature: "Custom workflows", free: false, pro: true, enterprise: true, icon: Zap },
  { feature: "API access", free: false, pro: true, enterprise: true, icon: Lock },
  { feature: "SSO / SAML", free: false, pro: false, enterprise: true, icon: Shield },
  { feature: "Audit logs", free: false, pro: false, enterprise: true, icon: Shield },
  { feature: "Dedicated support", free: false, pro: false, enterprise: true, icon: Headphones },
  { feature: "Automations / month", free: "—", pro: "1,000", enterprise: "Unlimited", icon: Zap },
  { feature: "Notifications", free: "Basic", pro: "Advanced", enterprise: "Advanced", icon: Bell },
];

const faqs = [
  {
    q: "Can I switch plans later?",
    a: "Yes. You can upgrade or downgrade at any time. Upgrades are prorated immediately; downgrades take effect at your next billing cycle.",
  },
  {
    q: "What happens after the free trial?",
    a: "After your 14-day Pro trial, you'll be prompted to add a payment method or you'll automatically move to our Free plan. No charges without your consent.",
  },
  {
    q: "Do you offer annual billing discounts?",
    a: "Yes! Paying annually saves you 20% compared to monthly billing. Toggle to annual billing at checkout.",
  },
  {
    q: "Is there a per-seat minimum for Enterprise?",
    a: "Enterprise plans typically start at 25 seats. Contact our sales team for custom pricing based on your organization's size and needs.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and wire transfers for Enterprise invoices.",
  },
];

function CellValue({ val }: { val: string | boolean }) {
  if (typeof val === "boolean") {
    return val ? (
      <Check className="w-4 h-4 text-[#22C55E] mx-auto" />
    ) : (
      <X className="w-4 h-4 text-white/20 mx-auto" />
    );
  }
  return <span className="text-white/70 text-sm">{val}</span>;
}

export default function PricingPage() {
  const [billingAnnual, setBillingAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="pt-24 pb-16 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/10 text-[#0EA5E9] text-xs font-semibold mb-6">
            <Zap className="w-3 h-3" />
            Simple, transparent pricing
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Pricing that scales with you
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
            Start free, upgrade when you're ready. No hidden fees, no lock-in.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setBillingAnnual(false)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                !billingAnnual ? "bg-white/10 text-white" : "text-white/40"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingAnnual(true)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                billingAnnual ? "bg-white/10 text-white" : "text-white/40"
              }`}
            >
              Annual
              <span className="ml-1.5 text-[#22C55E] text-xs">Save 20%</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Plan cards */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 items-start">
          {plans.map(({ name, price, monthly, desc, color, to, cta, badge, features, highlight }, idx) => {
            const displayPrice =
              monthly === null
                ? "Custom"
                : billingAnnual && monthly > 0
                ? `$${Math.round(monthly * 0.8)}`
                : price;

            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative rounded-2xl p-7 flex flex-col gap-5 ${
                  highlight
                    ? "bg-white text-[#0a0a0a] shadow-2xl shadow-[#0EA5E9]/20"
                    : "bg-white/3 border border-white/10"
                }`}
              >
                {badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#0EA5E9] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {badge}
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-sm font-bold mb-3" style={{ color }}>
                    {name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className={`text-4xl font-extrabold ${highlight ? "text-[#0a0a0a]" : "text-white"}`}>
                      {displayPrice}
                    </span>
                    {monthly !== null && monthly > 0 && (
                      <span className={`text-sm ${highlight ? "text-gray-500" : "text-white/40"}`}>/mo per seat</span>
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${highlight ? "text-gray-600" : "text-white/50"}`}>{desc}</p>
                </div>

                <ul className="flex flex-col gap-2.5 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${highlight ? "text-[#0EA5E9]" : "text-[#22C55E]"}`} />
                      <span className={highlight ? "text-gray-700" : "text-white/70"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={to}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                    highlight
                      ? "bg-[#0EA5E9] text-white hover:bg-[#0284C7]"
                      : "border border-white/20 hover:border-white/40 text-white"
                  }`}
                >
                  {cta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Comparison table */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12">Compare all features</h2>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-4 bg-white/5 border-b border-white/10">
              <div className="p-4 text-white/50 text-sm font-medium">Feature</div>
              {["Free", "Pro", "Enterprise"].map((p) => (
                <div key={p} className="p-4 text-center">
                  <span className="text-white font-semibold text-sm">{p}</span>
                </div>
              ))}
            </div>

            {comparisonRows.map(({ feature, free, pro, enterprise, icon: Icon }, i) => (
              <div
                key={feature}
                className={`grid grid-cols-4 border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/2"}`}
              >
                <div className="p-4 flex items-center gap-2 text-white/70 text-sm">
                  <Icon className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                  {feature}
                </div>
                {[free, pro, enterprise].map((val, j) => (
                  <div key={j} className="p-4 text-center flex items-center justify-center">
                    <CellValue val={val} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-24 px-6 bg-[#0d0d0d]">
        <div className="max-w-2xl mx-auto pt-20">
          <h2 className="text-3xl font-extrabold text-center mb-12">Frequently asked questions</h2>
          <div className="flex flex-col gap-3">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-white font-semibold text-sm"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {q}
                  <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-white/50 text-sm leading-relaxed">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="rounded-3xl border border-white/10 py-16 px-8 relative overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(14,165,233,0.1) 0%, transparent 80%)",
            }}
          >
            <h2 className="text-4xl font-extrabold mb-4">Still have questions?</h2>
            <p className="text-white/50 text-lg mb-8">
              Our team is happy to walk you through the right plan for your team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold px-6 py-3 rounded-xl transition-all"
              >
                Start for free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-6 py-3 rounded-xl transition-all"
              >
                Talk to sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
