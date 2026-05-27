"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────────────────────

const BUSINESS_TYPES = [
  "Retail", "Food & Beverage", "Landscaping", "Childcare",
  "Education", "Events", "Office", "Health & Wellness", "Other"
];

export default function BusinessProfile() {
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [error, setError]           = useState("");

  const [fullName, setFullName]         = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation]         = useState("");
  const [bio, setBio]                   = useState("");
  const [website, setWebsite]           = useState("");
  const [email, setEmail]               = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");

      // Read from cache for instant render
      const cached = localStorage.getItem(`profile:${user.id}`);
      if (cached) {
        const p = JSON.parse(cached);
        setFullName(p.full_name ?? "");
        setBusinessName(p.business_name ?? "");
        setLocation(p.location ?? "");
        setBio(p.bio ?? "");
        setWebsite(p.website ?? "");
        setBusinessType(p.business_type ?? "");
      }

      const { data } = await getSupabase()
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setFullName(data.full_name ?? "");
        setBusinessName(data.business_name ?? "");
        setLocation(data.location ?? "");
        setBio(data.bio ?? "");
        setWebsite(data.website ?? "");
        setBusinessType(data.business_type ?? "");
        localStorage.setItem(`profile:${user.id}`, JSON.stringify(data));
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    if (!fullName || !businessName) {
      setError("Name and business name are required.");
      return;
    }
    if (saving) return;
    setSaving(true);
    setError("");

    const { data: { user } } = await getSupabase().auth.getUser();
    const updates = {
      full_name: fullName,
      business_name: businessName,
      location,
      bio,
      website,
      business_type: businessType,
    };

    const { error: sbError } = await getSupabase()
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    setSaving(false);
    if (sbError) { setError(sbError.message); return; }

    // Keep cache in sync
    const cached = localStorage.getItem(`profile:${user.id}`);
    if (cached) {
      localStorage.setItem(`profile:${user.id}`, JSON.stringify({ ...JSON.parse(cached), ...updates }));
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const completedFields = [fullName, businessName, location, bio, website, businessType].filter(Boolean);
  const strengthPct = Math.min(completedFields.length * 17, 100);

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition";
  const labelClass = "text-xs font-medium text-gray-700 mb-1.5 block";

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0 max-w-xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
          <p className="text-gray-500 text-sm mt-1">How teens see your business on Catalyst</p>
        </div>
        <div className="w-14 h-14 rounded-full bg-black text-[#C8FF00] flex items-center justify-center text-2xl font-bold">
          {businessName?.[0]?.toUpperCase() ?? "B"}
        </div>
      </div>

      {/* Profile strength */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Profile strength</p>
          <p className="text-sm font-bold text-gray-900">{strengthPct}%</p>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-[#C8FF00] rounded-full transition-all duration-500"
            style={{ width: `${strengthPct}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Name",     done: !!fullName },
            { label: "Business", done: !!businessName },
            { label: "Location", done: !!location },
            { label: "About",    done: !!bio },
            { label: "Website",  done: !!website },
            { label: "Type",     done: !!businessType },
          ].map((item) => (
            <span key={item.label}
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                item.done ? "bg-black text-[#C8FF00]" : "bg-gray-100 text-gray-400"
              }`}>
              {item.done ? "✓" : "+"} {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Account</p>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed here</p>
        </div>
      </div>

      {/* Business info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Business info</p>

        <div>
          <label className={labelClass}>Your name</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Business name</label>
          <input type="text" placeholder="Your business name" value={businessName}
            onChange={(e) => setBusinessName(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-2 block">Business type</label>
          <div className="flex flex-wrap gap-2">
            {BUSINESS_TYPES.map((type) => (
              <button key={type} onClick={() => setBusinessType(type === businessType ? "" : type)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  businessType === type
                    ? "bg-black text-[#C8FF00] border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}>
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Location</label>
          <input type="text" placeholder="e.g. Plymouth, IN" value={location}
            onChange={(e) => setLocation(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>
            Website <span className="text-gray-400">(optional)</span>
          </label>
          <input type="url" placeholder="https://yourbusiness.com" value={website}
            onChange={(e) => setWebsite(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>
            About your business <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            placeholder="Tell teens about your business, culture, what it's like to work there..."
            value={bio} onChange={(e) => setBio(e.target.value)}
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${
          saved ? "bg-[#C8FF00] text-black" : "bg-black text-[#C8FF00] hover:bg-gray-900"
        }`}
      >
        {saving ? "Saving..." : saved ? "✓ Saved!" : "Save changes"}
      </button>
    </div>
  );
}