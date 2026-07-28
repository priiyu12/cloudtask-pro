import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Camera, Check } from "lucide-react";

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
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: "Marcus",
    lastName: "Webb",
    email: "marcus@payload.co",
    jobTitle: "CTO",
    bio: "Engineering leader with 10+ years building scalable products. Currently leading the technical strategy at Payload, focused on open-source CMS infrastructure.",
    timezone: "UTC-8 (Pacific Time)",
    language: "English",
  });

  function handleChange(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const inputClass =
    "w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/[0.2] transition-all";

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Back */}
      <Link
        to="/app/profile"
        className="inline-flex items-center gap-1.5 text-white/40 text-sm hover:text-white/70 transition-colors mb-7"
      >
        <ArrowLeft size={14} />
        Back to profile
      </Link>

      <h1 className="text-white text-2xl font-semibold mb-7">Edit Profile</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-5">Avatar</h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6] flex items-center justify-center text-white text-2xl font-bold">
                M
              </div>
              <button
                type="button"
                className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
              >
                <Camera size={12} className="text-black" />
              </button>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Upload a new avatar</p>
              <p className="text-white/30 text-xs">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-5">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-white/50 text-xs mb-1.5">First Name</label>
              <input
                className={inputClass}
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-white/50 text-xs mb-1.5">Last Name</label>
              <input
                className={inputClass}
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-white/50 text-xs mb-1.5">Email</label>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white/50 text-xs mb-1.5">Job Title</label>
            <input
              className={inputClass}
              value={form.jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-white/50 text-xs mb-1.5">Bio</label>
            <textarea
              rows={4}
              className={`${inputClass} resize-none`}
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
            />
          </div>
        </div>

        {/* Locale */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white text-sm font-semibold mb-5">Locale</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-xs mb-1.5">Timezone</label>
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
              <label className="block text-white/50 text-xs mb-1.5">Language</label>
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
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 bg-white text-black font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
          >
            {saved ? (
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
            className="text-white/40 text-sm hover:text-white/70 transition-colors px-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
