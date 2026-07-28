import { useState, useRef } from "react";
import {
  UploadCloud, LayoutGrid, List, Folder, FileText, FileCode, Image,
  MoreHorizontal, Download, Trash2, Edit3,
} from "lucide-react";

type ViewMode = "grid" | "list";

interface FileItem {
  id: string;
  type: "folder" | "pdf" | "code" | "image" | "doc";
  name: string;
  size: string;
  modified: string;
  count?: number;
}

const FILES: FileItem[] = [
  { id: "f1", type: "folder", name: "Design Assets",      size: "—",       modified: "Dec 28, 2024", count: 24 },
  { id: "f2", type: "folder", name: "Sprint Documents",   size: "—",       modified: "Dec 27, 2024", count: 8  },
  { id: "f3", type: "pdf",    name: "Q4 Roadmap.pdf",     size: "2.3 MB",  modified: "Dec 26, 2024" },
  { id: "f4", type: "code",   name: "api-schema.ts",      size: "48 KB",   modified: "Dec 25, 2024" },
  { id: "f5", type: "image",  name: "onboarding-v3.png",  size: "1.8 MB",  modified: "Dec 23, 2024" },
  { id: "f6", type: "pdf",    name: "Design Brief.pdf",   size: "4.1 MB",  modified: "Dec 22, 2024" },
  { id: "f7", type: "code",   name: "components.jsx",     size: "92 KB",   modified: "Dec 21, 2024" },
  { id: "f8", type: "image",  name: "brand-cover.jpg",    size: "3.5 MB",  modified: "Dec 18, 2024" },
];

function FileIcon({ type, size = 20 }: { type: FileItem["type"]; size?: number }) {
  const cls = `w-${size === 20 ? 5 : 8} h-${size === 20 ? 5 : 8}`;
  if (type === "folder") return <Folder className={`${cls} text-[#F59E0B]`} />;
  if (type === "image")  return <Image  className={`${cls} text-[#8B5CF6]`} />;
  if (type === "code")   return <FileCode className={`${cls} text-[#0EA5E9]`} />;
  return <FileText className={`${cls} text-white/40`} />;
}

function FileIconBig({ type }: { type: FileItem["type"] }) {
  if (type === "folder") return (
    <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center">
      <Folder className="w-6 h-6 text-[#F59E0B]" />
    </div>
  );
  if (type === "image") return (
    <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center">
      <Image className="w-6 h-6 text-[#8B5CF6]" />
    </div>
  );
  if (type === "code") return (
    <div className="w-12 h-12 rounded-2xl bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 flex items-center justify-center">
      <FileCode className="w-6 h-6 text-[#0EA5E9]" />
    </div>
  );
  return (
    <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
      <FileText className="w-6 h-6 text-white/40" />
    </div>
  );
}

export default function FilesPage() {
  const [view, setView] = useState<ViewMode>("grid");
  const [dragging, setDragging] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-white text-2xl font-semibold tracking-tight">Files</h1>
          <p className="text-white/35 text-sm mt-0.5">{FILES.length} items · 12.8 MB used</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-white/[0.08] text-white" : "text-white/30 hover:text-white/60"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-white/[0.08] text-white" : "text-white/30 hover:text-white/60"}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-[0_0_16px_rgba(14,165,233,0.2)]"
          >
            <UploadCloud className="w-4 h-4" />
            Upload
          </button>
          <input ref={inputRef} type="file" multiple className="hidden" />
        </div>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center mb-6 cursor-pointer transition-all ${
          dragging
            ? "border-[#0EA5E9]/60 bg-[#0EA5E9]/[0.04]"
            : "border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]"
        }`}
      >
        <UploadCloud className={`w-8 h-8 mx-auto mb-3 ${dragging ? "text-[#0EA5E9]" : "text-white/20"}`} />
        <p className="text-white/40 text-sm">
          <span className="text-white/70 font-medium">Drop files here</span> or click to upload
        </p>
        <p className="text-white/20 text-xs mt-1">Supports any file type up to 50 MB</p>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {FILES.map((f) => (
            <div
              key={f.id}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.04] hover:border-white/[0.09] transition-all cursor-pointer group relative"
            >
              <button
                onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === f.id ? null : f.id); }}
                className="absolute top-3 right-3 p-1 rounded-lg text-white/0 group-hover:text-white/30 hover:!text-white/70 hover:bg-white/[0.06] transition-all"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
              {openMenu === f.id && (
                <div className="absolute top-9 right-3 bg-[#1a1a1a] border border-white/[0.1] rounded-xl py-1.5 z-10 w-36 shadow-xl">
                  <button className="flex items-center gap-2 w-full px-3 py-1.5 text-white/60 hover:text-white hover:bg-white/[0.06] text-xs transition-colors">
                    <Download className="w-3 h-3" /> Download
                  </button>
                  <button className="flex items-center gap-2 w-full px-3 py-1.5 text-white/60 hover:text-white hover:bg-white/[0.06] text-xs transition-colors">
                    <Edit3 className="w-3 h-3" /> Rename
                  </button>
                  <button className="flex items-center gap-2 w-full px-3 py-1.5 text-[#EF4444]/70 hover:text-[#EF4444] hover:bg-[#EF4444]/[0.06] text-xs transition-colors">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              )}
              <FileIconBig type={f.type} />
              <p className="text-white text-[13px] font-medium mt-3 truncate">{f.name}</p>
              <p className="text-white/30 text-[11px] mt-0.5">
                {f.type === "folder" ? `${f.count} items` : f.size}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-2.5 border-b border-white/[0.05]">
            <span className="w-5" />
            <span className="text-white/25 text-[11px] font-semibold uppercase tracking-wider">Name</span>
            <span className="text-white/25 text-[11px] font-semibold uppercase tracking-wider w-28">Modified</span>
            <span className="text-white/25 text-[11px] font-semibold uppercase tracking-wider w-16 text-right">Size</span>
            <span className="w-8" />
          </div>
          {FILES.map((f, i) => (
            <div
              key={f.id}
              className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-3 items-center hover:bg-white/[0.03] transition-colors cursor-pointer group ${
                i !== FILES.length - 1 ? "border-b border-white/[0.04]" : ""
              }`}
            >
              <FileIcon type={f.type} size={20} />
              <span className="text-white text-sm truncate">{f.name}</span>
              <span className="text-white/30 text-[12px] w-28">{f.modified}</span>
              <span className="text-white/30 text-[12px] w-16 text-right">
                {f.type === "folder" ? `${f.count} items` : f.size}
              </span>
              <div className="w-8 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
