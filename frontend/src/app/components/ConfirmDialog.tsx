import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  destructive?: boolean;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useConfirm must be used within a ConfirmDialogProvider");
  return context;
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    if (isLoading) return;
    setIsOpen(false);
    setTimeout(() => setOptions(null), 200); // animation buffer
  };

  const handleConfirm = async () => {
    if (!options) return;
    try {
      setIsLoading(true);
      await options.onConfirm();
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setTimeout(() => setOptions(null), 200);
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && options && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={handleClose} />
          <div className="relative z-10 w-full max-w-md bg-[#121212] border border-border shadow-2xl rounded-2xl p-6 animate-in zoom-in-95 duration-200">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex gap-4 mb-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${options.destructive ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="pt-1">
                <h2 className="text-lg font-semibold text-foreground mb-1 tracking-tight">{options.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{options.message}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-secondary hover:bg-white/[0.08] rounded-xl transition-colors disabled:opacity-50"
              >
                {options.cancelText || "Cancel"}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-foreground rounded-xl transition-colors disabled:opacity-50 min-w-[100px] ${
                  options.destructive 
                    ? "bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
                    : "bg-accent hover:bg-[#0284c7] shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  options.confirmText || "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </ConfirmContext.Provider>
  );
}
