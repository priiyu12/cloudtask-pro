import { useState, useRef, useEffect } from "react";
import {
  UploadCloud, LayoutGrid, List, Folder, FileText, FileCode, Image,
  MoreHorizontal, Download, Trash2, Edit3,
} from "lucide-react";
import { api } from "../../../lib/api";

type ViewMode = "grid" | "list";

interface FileItem {
  id: string;
  type: "folder" | "pdf" | "code" | "image" | "doc";
  name: string;
  size: string;
  modified: string;
  count?: number;
  url?: string;
}

function getFileType(filename: string) {
  if (filename.endsWith(".pdf")) return "pdf";
  if (filename.match(/\.(png|jpe?g|gif|svg)$/)) return "image";
  if (filename.match(/\.(ts|js|tsx|jsx|json|html|css|py|go)$/)) return "code";
  return "doc";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function FileIcon({ type, size = 20 }: { type: FileItem["type"]; size?: number }) {
  const cls = `w-${size === 20 ? 5 : 8} h-${size === 20 ? 5 : 8}`;
  if (type === "folder") return <Folder className={`${cls} text-[#F59E0B]`} />;
  if (type === "image")  return <Image  className={`${cls} text-[#8B5CF6]`} />;
  if (type === "code")   return <FileCode className={`${cls} text-accent`} />;
  return <FileText className={`${cls} text-muted-foreground`} />;
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
    <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
      <FileCode className="w-6 h-6 text-accent" />
    </div>
  );
  return (
    <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center">
      <FileText className="w-6 h-6 text-muted-foreground" />
    </div>
  );
}

export default function FilesPage() {
  const [view, setView] = useState<ViewMode>("grid");
  const [dragging, setDragging] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [usage, setUsage] = useState({ total_bytes_used: 0, plan_limit_bytes: 5 * 1024 * 1024 * 1024, plan_name: "Free" });
  const [projects, setProjects] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.getAllFiles().then((res: any[]) => {
      setFiles(res.map(f => ({
        id: f.id.toString(),
        name: f.filename,
        type: getFileType(f.filename),
        size: formatSize(f.file_size),
        modified: "Just now", // mock for now
        url: f.file_url,
      })));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });

    api.getStorageUsage().then(setUsage).catch(console.error);
    api.getProjects().then(setProjects).catch(console.error);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setShowUploadModal(true);
    }
    e.target.value = "";
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">Files</h1>
          <p className="text-foreground/35 text-sm mt-0.5">{files.length} items · {formatSize(usage.total_bytes_used)} / {formatSize(usage.plan_limit_bytes)} used ({usage.plan_name})</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-white/[0.03] border border-border rounded-xl p-1">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-white/[0.08] text-foreground" : "text-muted-foreground hover:text-muted-foreground"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-white/[0.08] text-foreground" : "text-muted-foreground hover:text-muted-foreground"}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 bg-accent hover:bg-[#0284C7] text-foreground text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-[0_0_16px_rgba(14,165,233,0.2)]"
          >
            <UploadCloud className="w-4 h-4" />
            Upload
          </button>
          <input ref={inputRef} type="file" onChange={handleFileSelect} className="hidden" />
        </div>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { 
          e.preventDefault(); 
          setDragging(false); 
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
            setShowUploadModal(true);
          }
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center mb-6 cursor-pointer transition-all ${
          dragging
            ? "border-accent/60 bg-accent/[0.04]"
            : "border-border hover:border-white/[0.15] hover:bg-card"
        }`}
      >
        <UploadCloud className={`w-8 h-8 mx-auto mb-3 ${dragging ? "text-accent" : "text-foreground/20"}`} />
        <p className="text-muted-foreground text-sm">
          <span className="text-muted-foreground font-medium">Drop files here</span> or click to upload
        </p>
        <p className="text-foreground/20 text-xs mt-1">Supports any file type up to 50 MB</p>
      </div>

      {loading && (
        <div className="py-12 text-center text-muted-foreground">Loading files...</div>
      )}

      {!loading && files.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">No files uploaded yet.</div>
      )}

      {/* Grid view */}
      {!loading && view === "grid" && files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {files.map((f) => (
            <div
              key={f.id}
              className="bg-card border border-border rounded-2xl p-4 hover:bg-secondary hover:border-white/[0.09] transition-all cursor-pointer group relative"
            >
              <button
                onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === f.id ? null : f.id); }}
                className="absolute top-3 right-3 p-1 rounded-lg text-foreground/0 group-hover:text-muted-foreground hover:!text-muted-foreground hover:bg-white/[0.06] transition-all"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
              {openMenu === f.id && (
                <div className="absolute top-9 right-3 bg-[#1a1a1a] border border-white/[0.1] rounded-xl py-1.5 z-10 w-36 shadow-xl">
                  {f.url && (
                    <a href={f.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 w-full px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-white/[0.06] text-xs transition-colors">
                      <Download className="w-3 h-3" /> Download
                    </a>
                  )}
                  <button className="flex items-center gap-2 w-full px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-white/[0.06] text-xs transition-colors">
                    <Edit3 className="w-3 h-3" /> Rename
                  </button>
                  <button className="flex items-center gap-2 w-full px-3 py-1.5 text-[#EF4444]/70 hover:text-[#EF4444] hover:bg-[#EF4444]/[0.06] text-xs transition-colors">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              )}
              <FileIconBig type={f.type} />
              <p className="text-foreground text-[13px] font-medium mt-3 truncate">{f.name}</p>
              <p className="text-muted-foreground text-[11px] mt-0.5">
                {f.type === "folder" ? `${f.count} items` : f.size}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {!loading && view === "list" && files.length > 0 && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-2.5 border-b border-white/[0.05]">
            <span className="w-5" />
            <span className="text-foreground/25 text-[11px] font-semibold uppercase tracking-wider">Name</span>
            <span className="text-foreground/25 text-[11px] font-semibold uppercase tracking-wider w-28">Modified</span>
            <span className="text-foreground/25 text-[11px] font-semibold uppercase tracking-wider w-16 text-right">Size</span>
            <span className="w-8" />
          </div>
          {files.map((f, i) => (
            <div
              key={f.id}
              className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-3 items-center hover:bg-white/[0.03] transition-colors cursor-pointer group ${
                i !== files.length - 1 ? "border-b border-white/[0.04]" : ""
              }`}
            >
              <FileIcon type={f.type} size={20} />
              <span className="text-foreground text-sm truncate">{f.name}</span>
              <span className="text-muted-foreground text-[12px] w-28">{f.modified}</span>
              <span className="text-muted-foreground text-[12px] w-16 text-right">
                {f.type === "folder" ? `${f.count} items` : f.size}
              </span>
              <div className="w-8 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-all">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-white/[0.08] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-foreground">Upload File</h2>
              <p className="text-sm text-muted-foreground mt-1">Select a project to assign this file to.</p>
              
              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-foreground/70 mb-1.5 block">File</label>
                  <div className="text-sm text-foreground bg-white/[0.03] p-3 rounded-lg border border-white/[0.05]">{selectedFile?.name}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground/70 mb-1.5 block">Project (Optional)</label>
                  <select 
                    value={selectedProjectId} 
                    onChange={e => setSelectedProjectId(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent transition-colors appearance-none"
                  >
                    <option value="" className="bg-card text-foreground">No Project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id} className="bg-card text-foreground">{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-white/[0.05] bg-white/[0.01] flex justify-end gap-3">
              <button 
                onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-white/[0.05] rounded-xl transition-colors disabled:opacity-50"
                disabled={uploading}
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (!selectedFile) return;
                  setUploading(true);
                  try {
                    const newFile = await api.uploadFile(selectedFile, selectedProjectId ? parseInt(selectedProjectId) : undefined);
                    setFiles(prev => [...prev, {
                      id: newFile.id.toString(),
                      name: newFile.filename,
                      type: getFileType(newFile.filename),
                      size: formatSize(newFile.file_size),
                      modified: "Just now",
                      url: newFile.file_url,
                    }]);
                    const newUsage = await api.getStorageUsage();
                    setUsage(newUsage);
                    setShowUploadModal(false);
                    setSelectedFile(null);
                  } catch (err) {
                    console.error(err);
                    if (err instanceof Error && err.message.includes("402")) {
                        setShowUploadModal(false);
                    }
                  } finally {
                    setUploading(false);
                  }
                }}
                className="px-4 py-2 text-sm font-medium bg-accent hover:bg-[#0284C7] text-foreground rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shadow-[0_0_16px_rgba(14,165,233,0.2)]"
                disabled={uploading}
              >
                {uploading ? (
                  <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Uploading...</>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
