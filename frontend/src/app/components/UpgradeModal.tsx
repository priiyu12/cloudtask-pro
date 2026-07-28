import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { X, ShieldAlert } from "lucide-react";

export function UpgradeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("show-upgrade-modal", handleOpen);
    return () => window.removeEventListener("show-upgrade-modal", handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Upgrade to Pro</h3>
        <p className="text-gray-600 mb-6">
          You've hit the limit for the Free plan. Upgrade to Pro to unlock unlimited projects, team members, and advanced features.
        </p>
        <div className="flex gap-3 w-full">
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              navigate("/app/settings/billing");
            }}
            className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            View Billing
          </button>
        </div>
      </div>
    </div>
  );
}
