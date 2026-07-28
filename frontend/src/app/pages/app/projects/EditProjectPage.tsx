import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { api } from "../../../lib/api";
import { Trash2 } from "lucide-react";

type Project = { id: number; name: string; description: string | null };

const COLOR_SWATCHES = ["var(--color-accent)", "#8B5CF6", "#22C55E", "#F59E0B", "#EF4444", "#EC4899"];

const fieldCls =
  "w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-accent/50 transition-colors";

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // API fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Visual-only fields
  const [status, setStatus] = useState("In Progress");
  const [priority, setPriority] = useState("Medium");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_SWATCHES[0]);

  useEffect(() => {
    if (!id) return;
    api
      .get<Project>(`/projects/${id}`)
      .then((project) => {
        setName(project.name);
        setDescription(project.description ?? "");
      })
      .catch(() => setError("Project not found."));
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!id) return;
    setLoading(true);
    setError("");

    try {
      await api.put(`/projects/${id}`, { name, description });
      navigate(`/app/projects/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update project.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    await api.del(`/projects/${id}`);
    navigate("/app/projects");
  };

  return (
    <div className="bg-background min-h-full text-foreground p-8">
      <Link
        to={`/app/projects/${id ?? ""}`}
        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
      >
        ← Back to Project
      </Link>

      <div className="max-w-2xl space-y-5">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 space-y-6">
          <div>
            <p className="text-accent text-xs font-semibold uppercase tracking-[0.22em]">Edit Project</p>
            <h1 className="text-foreground text-2xl font-semibold mt-2 tracking-[-0.03em]">Update project details</h1>
          </div>

          {/* Name */}
          <div>
            <label className="block text-muted-foreground text-sm font-medium mb-2">
              Project Name <span className="text-[#EF4444]">*</span>
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q2 Marketing Campaign"
              className={fieldCls}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-muted-foreground text-sm font-medium mb-2">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the outcome, scope, and team goals..."
              className={`${fieldCls} resize-none`}
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground text-sm font-medium mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`${fieldCls} appearance-none`}
              >
                {["In Progress", "Planning", "Review", "Done"].map((s) => (
                  <option key={s} value={s} className="bg-card">{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-muted-foreground text-sm font-medium mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`${fieldCls} appearance-none`}
              >
                {["Low", "Medium", "High", "Critical"].map((p) => (
                  <option key={p} value={p} className="bg-card">{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Start + End dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={fieldCls}
                style={{ colorScheme: "dark" }}
              />
            </div>
            <div>
              <label className="block text-muted-foreground text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={fieldCls}
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-muted-foreground text-sm font-medium mb-3">Project Color</label>
            <div className="flex items-center gap-2.5">
              {COLOR_SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{
                    backgroundColor: c,
                    outline: selectedColor === c ? `2px solid ${c}` : "2px solid transparent",
                    outlineOffset: "2px",
                  }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-[#EF4444] text-sm">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-accent hover:bg-[#0284C7] disabled:opacity-50 text-foreground text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              {loading ? "Saving…" : "Save Changes"}
            </button>
            <Link
              to={`/app/projects/${id ?? ""}`}
              className="text-muted-foreground hover:text-foreground text-sm px-4 py-3 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-[#EF4444]/25 bg-[#EF4444]/[0.04] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Trash2 size={16} className="text-[#EF4444]" />
            <h3 className="text-[#EF4444] font-semibold">Danger Zone</h3>
          </div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Delete this project</p>
              <p className="text-foreground/35 text-xs mt-0.5">
                {confirmDelete
                  ? "Click delete again to confirm. This cannot be undone."
                  : "This removes the project and all its data from the database."}
              </p>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              className={`flex items-center gap-2 border text-sm font-semibold rounded-xl px-4 py-2.5 transition-colors ${
                confirmDelete
                  ? "border-[#EF4444]/60 bg-[#EF4444]/20 text-[#EF4444] hover:bg-[#EF4444]/30"
                  : "border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/15"
              }`}
            >
              <Trash2 size={14} />
              {confirmDelete ? "Confirm Delete" : "Delete Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
