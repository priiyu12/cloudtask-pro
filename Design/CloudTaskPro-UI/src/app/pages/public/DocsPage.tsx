import { useState } from "react";
import { motion } from "motion/react";
import { Search, ChevronRight, BookOpen, Zap, Code2, Shield, ExternalLink } from "lucide-react";

type DocItem = {
  id: string;
  label: string;
};

type DocSection = {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  items: DocItem[];
};

const docSections: DocSection[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: BookOpen,
    color: "#0EA5E9",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "quick-start", label: "Quick Start Guide" },
      { id: "installation", label: "Installation" },
      { id: "first-project", label: "Your First Project" },
      { id: "inviting-team", label: "Inviting Your Team" },
    ],
  },
  {
    id: "guides",
    label: "Guides",
    icon: Zap,
    color: "#8B5CF6",
    items: [
      { id: "kanban", label: "Using Kanban Boards" },
      { id: "workflows", label: "Custom Workflows" },
      { id: "automations", label: "Setting Up Automations" },
      { id: "integrations-guide", label: "Connecting Integrations" },
      { id: "analytics", label: "Reading Analytics" },
    ],
  },
  {
    id: "api",
    label: "API Reference",
    icon: Code2,
    color: "#22C55E",
    items: [
      { id: "api-overview", label: "Overview" },
      { id: "authentication", label: "Authentication" },
      { id: "projects-api", label: "Projects" },
      { id: "tasks-api", label: "Tasks" },
      { id: "webhooks", label: "Webhooks" },
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    color: "#F59E0B",
    items: [
      { id: "sso", label: "SSO / SAML Setup" },
      { id: "2fa", label: "Two-Factor Auth" },
      { id: "audit-logs", label: "Audit Logs" },
      { id: "compliance", label: "Compliance & Certs" },
    ],
  },
];

const docContent: Record<string, { title: string; content: React.ReactNode }> = {
  introduction: {
    title: "Introduction to CloudTask Pro",
    content: (
      <div className="space-y-6">
        <p className="text-white/70 leading-relaxed">
          Welcome to CloudTask Pro — the modern project management platform for engineering teams that want to
          move fast without losing visibility. This documentation will help you get up and running quickly.
        </p>
        <div className="p-4 rounded-xl border border-[#0EA5E9]/30 bg-[#0EA5E9]/5">
          <p className="text-[#0EA5E9] text-sm font-semibold mb-1">Quick tip</p>
          <p className="text-white/60 text-sm">
            Start with the Quick Start Guide if you want to be up and running in under 5 minutes.
          </p>
        </div>
        <h3 className="text-white font-semibold text-lg">What is CloudTask Pro?</h3>
        <p className="text-white/70 leading-relaxed">
          CloudTask Pro is an all-in-one work management platform that combines task tracking, kanban boards,
          team collaboration, and real-time analytics. It integrates natively with your existing developer tools
          like GitHub, Slack, and Figma.
        </p>
        <h3 className="text-white font-semibold text-lg">Key concepts</h3>
        <ul className="space-y-2">
          {["Workspace — your organization's top-level container", "Projects — collections of related tasks and milestones", "Tasks — individual units of work with assignees and due dates", "Sprints — time-boxed iterations for Agile teams"].map((item) => (
            <li key={item} className="flex items-start gap-2 text-white/60 text-sm">
              <ChevronRight className="w-4 h-4 mt-0.5 text-[#0EA5E9] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  "quick-start": {
    title: "Quick Start Guide",
    content: (
      <div className="space-y-6">
        <p className="text-white/70 leading-relaxed">Get your workspace up and running in under 5 minutes.</p>
        {[
          { step: "1", title: "Create your account", desc: "Sign up at cloudtaskpro.com. No credit card required for the free plan." },
          { step: "2", title: "Create a project", desc: "Click 'New Project', give it a name, and choose a template (Scrum, Kanban, or Blank)." },
          { step: "3", title: "Invite your team", desc: "Go to Settings > Team and send invites via email. Members can join instantly." },
          { step: "4", title: "Add your first tasks", desc: "Use the + button to add tasks. Assign them, set due dates, and drag them to the right status." },
        ].map(({ step, title, desc }) => (
          <div key={step} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {step}
            </div>
            <div>
              <p className="text-white font-semibold mb-1">{title}</p>
              <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  "api-overview": {
    title: "API Overview",
    content: (
      <div className="space-y-6">
        <p className="text-white/70 leading-relaxed">
          The CloudTask Pro REST API allows you to programmatically access and manipulate all of your workspace data.
        </p>
        <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-white/3">
            <Code2 className="w-3.5 h-3.5 text-white/40" />
            <span className="text-white/40 text-xs">Base URL</span>
          </div>
          <pre className="p-4 text-[#22C55E] text-sm font-mono overflow-x-auto">
            {`https://api.cloudtaskpro.com/v1`}
          </pre>
        </div>
        <h3 className="text-white font-semibold text-lg">Rate limits</h3>
        <p className="text-white/70 text-sm leading-relaxed">
          Free: 100 requests/min · Pro: 1,000 requests/min · Enterprise: Custom
        </p>
        <h3 className="text-white font-semibold text-lg">Response format</h3>
        <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
          <pre className="p-4 text-sm font-mono text-white/70 overflow-x-auto">{`{
  "data": { ... },
  "meta": {
    "page": 1,
    "total": 42
  }
}`}</pre>
        </div>
      </div>
    ),
  },
  sso: {
    title: "SSO / SAML Setup",
    content: (
      <div className="space-y-6">
        <div className="p-4 rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/5">
          <p className="text-[#F59E0B] text-sm font-semibold mb-1">Enterprise only</p>
          <p className="text-white/60 text-sm">SSO and SAML 2.0 are available on the Enterprise plan.</p>
        </div>
        <p className="text-white/70 leading-relaxed">
          CloudTask Pro supports SAML 2.0 and OIDC for enterprise single sign-on. Connect with Okta, Azure AD,
          Google Workspace, and any other SAML-compatible identity provider.
        </p>
        <h3 className="text-white font-semibold text-lg">Setup steps</h3>
        {["Navigate to Settings > Security > SSO", "Choose your identity provider", "Copy the ACS URL and Entity ID", "Configure your IdP with these values", "Test the connection and enable SSO"].map((step, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <span className="text-white/30 font-mono">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-white/70">{step}</span>
          </div>
        ))}
      </div>
    ),
  },
};

// Default content for items not explicitly defined
function DefaultDocContent({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <p className="text-white/70 leading-relaxed">
        This section covers <strong className="text-white">{title}</strong> — comprehensive documentation
        coming soon. In the meantime, feel free to reach out to our support team.
      </p>
      <div className="p-4 rounded-xl border border-white/10 bg-white/3 flex items-center gap-3">
        <ExternalLink className="w-4 h-4 text-white/40" />
        <span className="text-white/60 text-sm">
          Need help? Chat with us or email{" "}
          <a href="mailto:support@cloudtaskpro.com" className="text-[#0EA5E9] hover:underline">
            support@cloudtaskpro.com
          </a>
        </span>
      </div>
    </div>
  );
}

export default function DocsPage() {
  const [activeItem, setActiveItem] = useState("introduction");
  const [expandedSections, setExpandedSections] = useState<string[]>(["getting-started"]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const currentSection = docSections.find((s) => s.items.some((item) => item.id === activeItem));
  const currentItem = docSections.flatMap((s) => s.items).find((item) => item.id === activeItem);
  const doc = docContent[activeItem];

  const filteredSections = docSections.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      searchQuery ? item.label.toLowerCase().includes(searchQuery.toLowerCase()) : true
    ),
  })).filter((section) => (searchQuery ? section.items.length > 0 : true));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-4">Documentation</h1>
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 border-r border-white/5 min-h-[calc(100vh-120px)] p-4 sticky top-0">
          <nav className="flex flex-col gap-1">
            {filteredSections.map(({ id, label, icon: Icon, color, items }) => (
              <div key={id}>
                <button
                  onClick={() => toggleSection(id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" style={{ color }} />
                    <span className="text-white/80 text-sm font-semibold">{label}</span>
                  </div>
                  <motion.span
                    animate={{ rotate: expandedSections.includes(id) ? 90 : 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                  </motion.span>
                </button>

                {expandedSections.includes(id) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-4 flex flex-col gap-0.5 mt-1 mb-1"
                  >
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveItem(item.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          activeItem === item.id
                            ? "bg-white/8 text-white font-medium"
                            : "text-white/40 hover:text-white/70 hover:bg-white/4"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 px-10 py-8 max-w-3xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-white/30 mb-6">
            <span>{currentSection?.label}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/60">{currentItem?.label}</span>
          </div>

          <motion.div
            key={activeItem}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-extrabold mb-8">
              {doc?.title || currentItem?.label || "Documentation"}
            </h1>

            {doc ? doc.content : <DefaultDocContent title={currentItem?.label || ""} />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
