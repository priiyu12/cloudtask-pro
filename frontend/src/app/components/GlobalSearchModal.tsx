import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, X, FolderOpen, CheckSquare, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { api } from "../lib/api";

interface SearchResult {
  type: "project" | "task" | "user";
  id: string | number;
  title: string;
  subtitle?: string;
}

export function GlobalSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        // We'd ideally call a global search endpoint here, e.g. api.get(`/search?q=${query}`)
        // Since we don't have one explicitly mentioned, we'll try to fetch tasks and projects and filter locally
        // Or if there is a search endpoint, we can use it.
        // Assuming we have basic ones:
        const projects = await api.get<any[]>("/projects").catch(() => []);
        const tasks = await api.get<any[]>("/tasks").catch(() => []);
        
        const q = query.toLowerCase();
        const pResults: SearchResult[] = projects.filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
          .map(p => ({ type: "project", id: p.id, title: p.name, subtitle: p.description }));
        const tResults: SearchResult[] = tasks.filter(t => t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q))
          .map(t => ({ type: "task", id: t.id, title: t.title, subtitle: t.status }));
          
        setResults([...pResults, ...tResults]);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (item: SearchResult) => {
    onClose();
    if (item.type === "project") navigate(`/app/projects/${item.id}`);
    else if (item.type === "task") navigate(`/app/tasks/${item.id}`);
    else if (item.type === "user") navigate(`/app/team/${item.id}`);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-foreground px-3 text-lg placeholder:text-muted-foreground"
            placeholder="Search projects, tasks, or users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-foreground/[0.1] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading && (
            <div className="p-8 text-center text-muted-foreground">
              <div className="w-6 h-6 border-2 border-border border-t-foreground/60 rounded-full animate-spin mx-auto mb-3" />
              Searching...
            </div>
          )}
          {!isLoading && query && results.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          )}
          {!isLoading && results.length > 0 && (
            <div className="py-2">
              {results.map((item, idx) => (
                <button
                  key={`${item.type}-${item.id}-${idx}`}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-secondary transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-foreground/[0.03] flex items-center justify-center flex-shrink-0">
                    {item.type === "project" && <FolderOpen className="w-5 h-5 text-blue-400" />}
                    {item.type === "task" && <CheckSquare className="w-5 h-5 text-green-400" />}
                    {item.type === "user" && <Users className="w-5 h-5 text-purple-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-medium truncate">{item.title}</p>
                    {item.subtitle && <p className="text-muted-foreground text-xs truncate mt-0.5">{item.subtitle}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
          {!query && (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-foreground/[0.03] flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-foreground/20" />
              </div>
              <p className="text-muted-foreground text-sm">Type something to start searching...</p>
            </div>
          )}
        </div>
        <div className="px-4 py-2.5 border-t border-border bg-background flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-foreground/[0.1] bg-foreground/[0.03]">↑↓</kbd> to navigate</span>
          <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-foreground/[0.1] bg-foreground/[0.03]">↵</kbd> to select</span>
          <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-foreground/[0.1] bg-foreground/[0.03]">esc</kbd> to close</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
