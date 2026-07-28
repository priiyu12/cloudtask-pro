import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Download, CreditCard, ArrowRight, Check } from "lucide-react";
import { api } from "../../../lib/api";

const SETTINGS_TABS = [
  { label: "General", to: "/app/settings/general" },
  { label: "Appearance", to: "/app/settings/appearance" },
  { label: "Notifications", to: "/app/settings/notifications" },
  { label: "Billing", to: "/app/settings/billing" },
  { label: "Integrations", to: "/app/settings/integrations" },
  { label: "API Keys", to: "/app/settings/api-keys" },
];

const usageStats = [
  { label: "Projects", used: 3, total: 20 },
  { label: "Tasks", used: 4, total: 1000 },
  { label: "Storage", used: 3.2, total: 10, unit: "GB" },
];

// Invoices are now fetched dynamically

export default function BillingPage() {
  const location = useLocation();
  const [saved, setSaved] = useState(false);
  const [plan, setPlan] = useState("Loading...");
  const [invoices, setInvoices] = useState<{ id: string; date: string; amount: string; status: string }[]>([]);

  useEffect(() => {
    api.getSubscription()
      .then(res => setPlan(res.plan_name || "Free"))
      .catch(() => setPlan("Free"));
      
    api.getInvoices()
      .then(res => setInvoices(res))
      .catch(console.error);
  }, []);

  const handleUpgrade = async () => {
    try {
      const options = {
        key: "rzp_test_TFq85gicRlfWlR", // A widely used tutorial test key. Replace with your own!
        amount: 410000, // ₹4100.00
        currency: "INR",
        name: "CloudTask Pro",
        description: "Upgrade to Pro Workspace",
        handler: async function (response: any) {
          // Success callback: update backend
          try {
            const res = await api.upgradeSubscription("Pro");
            setPlan(res.subscription.plan_name);
            setSaved(true);
            setTimeout(() => setSaved(false), 1800);
            api.getInvoices().then(setInvoices).catch(console.error);
          } catch (err) {
            console.error(err);
            alert("Upgrade failed");
          }
        },
        prefill: {
          name: "Demo User",
          email: "demo@cloudtaskpro.com",
        },
        theme: {
          color: "#3395FF",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert("Payment failed: " + response.error.description + "\n\n(Note: This happens if the dummy Test Key is blocked. Please edit BillingPage.tsx and put your own Razorpay Test Key in the 'key' field to fully test the UI!)");
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Failed to initialize checkout.");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-background min-h-full">
      <div className="mb-7">
        <h1 className="text-foreground text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your workspace preferences and configuration.</p>
      </div>
      <div className="flex items-center gap-1 mb-8 border-b border-border pb-0">
        {SETTINGS_TABS.map((tab) => (
          <Link key={tab.to} to={tab.to} className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px ${location.pathname === tab.to ? "text-foreground border-white" : "text-muted-foreground border-transparent hover:text-muted-foreground"}`}>
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h2 className="text-foreground text-sm font-semibold">Current Plan</h2>
                <span className="text-[10px] font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-md uppercase tracking-wide">{plan}</span>
              </div>
              <p className="text-muted-foreground text-sm">Pro Workspace · 5 seats</p>
            </div>
            <div className="text-right">
              <p className="text-foreground text-2xl font-bold">$49</p>
              <p className="text-muted-foreground text-xs">/ month</p>
            </div>
          </div>
          <div className="space-y-4">
            {usageStats.map((stat) => {
              const pct = (stat.used / stat.total) * 100;
              return (
                <div key={stat.label}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span className="text-muted-foreground">{stat.used}{stat.unit ?? ""} / {stat.total}{stat.unit ?? ""}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          {!plan?.toLowerCase().includes('pro') && (
            <div className="mt-5 pt-5 border-t border-border">
              <button onClick={handleUpgrade} className="flex items-center justify-center w-full gap-2 bg-[#02042B] border border-[#3395FF]/30 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#02042B]/90 transition-colors shadow-[0_0_15px_rgba(51,149,255,0.15)]">
                <svg viewBox="0 0 464 464" className="w-4 h-4 fill-current">
                  <path d="M464 232C464 360.13 360.13 464 232 464C103.87 464 0 360.13 0 232C0 103.87 103.87 0 232 0C360.13 0 464 103.87 464 232Z" fill="#3395FF" />
                  <path d="M228.66 122.95L150.36 341.05H196.42L274.71 122.95H228.66Z" fill="#FFFFFF" />
                  <path d="M306.96 122.95H346.12L313.62 213.56L274.47 122.95H306.96Z" fill="#FFFFFF" />
                </svg>
                Upgrade to Pro with Razorpay
              </button>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-foreground text-sm font-semibold mb-5">Invoice History</h2>
          <div className="space-y-0">
            {invoices.map((inv, i) => (
              <div key={inv.id} className={`flex items-center justify-between py-3.5 ${i < invoices.length - 1 ? "border-b border-white/[0.04]" : ""}`}>
                <div>
                  <p className="text-foreground text-sm font-medium">{inv.id}</p>
                  <p className="text-muted-foreground text-xs">{inv.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground text-sm">{inv.amount}</span>
                  <span className="text-[10px] font-semibold bg-[#22C55E]/10 text-[#22C55E] px-2 py-0.5 rounded-md">{inv.status}</span>
                  <button className="text-muted-foreground hover:text-muted-foreground transition-colors"><Download size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {saved && <p className="text-[#22C55E] text-sm mt-4">Billing preferences saved.</p>}
      </div>
    </div>
  );
}
