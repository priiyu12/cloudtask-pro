import { Link, useLocation } from "react-router";
import { Download, CreditCard, ArrowRight } from "lucide-react";

const SETTINGS_TABS = [
  { label: "General", to: "/app/settings/general" },
  { label: "Appearance", to: "/app/settings/appearance" },
  { label: "Notifications", to: "/app/settings/notifications" },
  { label: "Billing", to: "/app/settings/billing" },
  { label: "Integrations", to: "/app/settings/integrations" },
  { label: "API Keys", to: "/app/settings/api-keys" },
];

const usageStats = [
  { label: "Projects", used: 8, total: 20 },
  { label: "Tasks", used: 247, total: 1000 },
  { label: "Storage", used: 3.2, total: 10, unit: "GB" },
];

const invoices = [
  { id: "INV-2024-006", date: "Jun 1, 2024", amount: "$49.00" },
  { id: "INV-2024-005", date: "May 1, 2024", amount: "$49.00" },
  { id: "INV-2024-004", date: "Apr 1, 2024", amount: "$49.00" },
  { id: "INV-2024-003", date: "Mar 1, 2024", amount: "$49.00" },
];

export default function BillingPage() {
  const location = useLocation();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-7">
        <h1 className="text-white text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-white/40 text-sm">Manage your workspace preferences and configuration.</p>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 mb-8 border-b border-white/[0.06] pb-0">
        {SETTINGS_TABS.map((tab) => {
          const active = location.pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px ${
                active
                  ? "text-white border-white"
                  : "text-white/40 border-transparent hover:text-white/70"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="space-y-6">
        {/* Current Plan */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h2 className="text-white text-sm font-semibold">Current Plan</h2>
                <span className="text-[10px] font-bold bg-[#0EA5E9]/15 text-[#0EA5E9] px-2 py-0.5 rounded-md uppercase tracking-wide">
                  Pro
                </span>
              </div>
              <p className="text-white/40 text-sm">Pro Workspace · 5 seats</p>
            </div>
            <div className="text-right">
              <p className="text-white text-2xl font-bold">$49</p>
              <p className="text-white/30 text-xs">/ month</p>
            </div>
          </div>

          <div className="space-y-4">
            {usageStats.map((stat) => {
              const pct = (stat.used / stat.total) * 100;
              const usedLabel = stat.unit ? `${stat.used} ${stat.unit}` : stat.used;
              const totalLabel = stat.unit ? `${stat.total} ${stat.unit}` : stat.total;
              return (
                <div key={stat.label}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-white/50">{stat.label}</span>
                    <span className="text-white/50">
                      {usedLabel} / {totalLabel}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0EA5E9] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-5 border-t border-white/[0.06]">
            <Link
              to="#"
              className="flex items-center gap-1.5 text-[#0EA5E9] text-sm font-medium hover:text-[#0EA5E9]/80 transition-colors"
            >
              Upgrade to Business <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-sm font-semibold">Payment Method</h2>
            <button className="text-[#0EA5E9] text-xs hover:text-[#0EA5E9]/80 transition-colors">
              Update
            </button>
          </div>
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="w-10 h-7 bg-white/10 rounded-md flex items-center justify-center">
              <CreditCard size={16} className="text-white/50" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Visa ending in 4242</p>
              <p className="text-white/30 text-xs">Expires 08/2026</p>
            </div>
          </div>
        </div>

        {/* Invoice History */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-5">Invoice History</h2>
          <div className="space-y-0">
            {invoices.map((inv, i) => (
              <div
                key={inv.id}
                className={`flex items-center justify-between py-3.5 ${
                  i < invoices.length - 1 ? "border-b border-white/[0.04]" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-white text-sm font-medium">{inv.id}</p>
                    <p className="text-white/30 text-xs">{inv.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white/70 text-sm">{inv.amount}</span>
                  <span className="text-[10px] font-semibold bg-[#22C55E]/10 text-[#22C55E] px-2 py-0.5 rounded-md">
                    Paid
                  </span>
                  <button className="text-white/30 hover:text-white/70 transition-colors">
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
