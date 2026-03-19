"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function EmployerProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");

      const { data } = await getSupabase()
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setFullName(data.full_name ?? "");
        setLocation(data.location ?? "");
        setBio(data.bio ?? "");
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    if (!fullName) { setError("Name is required."); return; }
    setSaving(true);
    setError("");

    const { data: { user } } = await getSupabase().auth.getUser();
    const { error: sbError } = await getSupabase()
      .from("profiles")
      .update({ full_name: fullName, location, bio })
      .eq("id", user.id);

    setSaving(false);
    if (sbError) { setError(sbError.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0 max-w-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">How teens and applicants see you</p>
        </div>
        <div className="w-14 h-14 rounded-full bg-black text-[#C8FF00] flex items-center justify-center text-2xl font-bold">
          {fullName?.[0]?.toUpperCase() ?? "E"}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Account</p>
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed here</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Profile info</p>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Location</label>
          <input
            type="text"
            placeholder="e.g. Plymouth, IN"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">
            About you <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            placeholder="Tell teens a bit about yourself or your household..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition resize-none"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition ${
          saved ? "bg-[#C8FF00] text-black" : "bg-black text-[#C8FF00] hover:bg-gray-900"
        } disabled:opacity-50`}
      >
        {saving ? "Saving..." : saved ? "✓ Saved!" : "Save changes"}
      </button>
    </div>
  );
}