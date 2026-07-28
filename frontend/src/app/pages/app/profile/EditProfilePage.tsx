import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Camera, Check, LoaderCircle } from "lucide-react";
import { api, type CurrentUser } from "../../../lib/api";

const timezones = [
  "UTC-8 (Pacific Time)",
  "UTC-7 (Mountain Time)",
  "UTC-6 (Central Time)",
  "UTC-5 (Eastern Time)",
  "UTC+0 (Greenwich Mean Time)",
  "UTC+1 (Central European Time)",
  "UTC+5:30 (India Standard Time)",
  "UTC+8 (China Standard Time)",
  "UTC+9 (Japan Standard Time)",
];

const languages = ["English", "Spanish", "French", "German", "Japanese", "Chinese", "Portuguese"];

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    job_title: "",
    bio: "",
    location: "",
    timezone: timezones[0],
    language: languages[0],
    avatar_color: "#8B5CF6",
  });

  useEffect(() => {
    let alive = true;
    api.me()
      .then((user: CurrentUser) => {
        if (!alive) return;
        setForm({
          name: user.name ?? "",
          email: user.email ?? "",
          job_title: user.job_title ?? "",
          bio: user.bio ?? "",
          location: user.location ?? "",
          timezone: user.timezone ?? timezones[0],
          language: user.language ?? languages[0],
          avatar_color: user.avatar_color ?? "#8B5CF6",
        });
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  function handleChange(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateMe(form);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        navigate("/app/profile");
      }, 700);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-foreground text-sm outline-none focus:border-white/[0.2] transition-all";

  if (loading) {
    return <div className="p-8 max-w-2xl mx-auto"><div className="h-80 rounded-3xl bg-white/[0.03] border border-border animate-pulse" /></div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        to="/app/profile"
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm hover:text-muted-foreground transition-colors mb-7"
      >
        <ArrowLeft size={14} />
        Back to profile
      </Link>

      <h1 className="text-foreground text-2xl font-semibold mb-7">Edit Profile</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-foreground text-sm font-semibold mb-5">Avatar</h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-foreground text-2xl font-bold"
                style={{ backgroundColor: form.avatar_color }}
              >
                {form.name?.trim()?.[0]?.toUpperCase() ?? "U"}
              </div>
              <button
                type="button"
                className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-primary rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
              >
                <Camera size={12} className="text-primary-foreground" />
              </button>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-1">Upload a new avatar</p>
              <p className="text-muted-foreground text-xs">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-foreground text-sm font-semibold mb-5">Personal Information</h2>
          <div className="mb-4">
            <label className="block text-muted-foreground text-xs mb-1.5">Full Name</label>
            <input className={inputClass} value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-muted-foreground text-xs mb-1.5">Email</label>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-muted-foreground text-xs mb-1.5">Job Title</label>
            <input className={inputClass} value={form.job_title} onChange={(e) => handleChange("job_title", e.target.value)} />
          </div>
          <div>
            <label className="block text-muted-foreground text-xs mb-1.5">Bio</label>
            <textarea
              rows={4}
              className={`${inputClass} resize-none`}
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-foreground text-sm font-semibold mb-5">Locale</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground text-xs mb-1.5">Location</label>
              <input className={inputClass} value={form.location} onChange={(e) => handleChange("location", e.target.value)} />
            </div>
            <div>
              <label className="block text-muted-foreground text-xs mb-1.5">Timezone</label>
              <select
                className={`${inputClass} appearance-none`}
                value={form.timezone}
                onChange={(e) => handleChange("timezone", e.target.value)}
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz} className="bg-[#111]">
                    {tz}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-muted-foreground text-xs mb-1.5">Language</label>
              <select
                className={`${inputClass} appearance-none`}
                value={form.language}
                onChange={(e) => handleChange("language", e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang} className="bg-[#111]">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-muted-foreground text-xs mb-1.5">Avatar Accent</label>
              <input
                className={inputClass}
                value={form.avatar_color}
                onChange={(e) => handleChange("avatar_color", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-60"
          >
            {saving ? (
              <>
                <LoaderCircle size={14} className="animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check size={14} />
                Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </button>
          <Link
            to="/app/profile"
            className="text-muted-foreground text-sm hover:text-muted-foreground transition-colors px-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
