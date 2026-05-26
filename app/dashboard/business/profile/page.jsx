"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

// ─── Icons ────────────────────────────────────────────────────────────────────
const CheckIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const UserCircleIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LockClosedIcon = ({ size = 13 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
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
        .from("profiles").select("*").eq("id", user.id).single();

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

    // Update the layout cache so the navbar name refreshes instantly
    const cached = localStorage.getItem(`profile:${user.id}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      localStorage.setItem(`profile:${user.id}`, JSON.stringify({ ...parsed, full_name: fullName, location, bio }));
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-24 md:pb-0 max-w-xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">How applicants see you</p>
        </div>
        <div className="w-14 h-14 rounded-full bg-black text-[#C8FF00] flex items-center justify-center text-2xl font-bold shrink-0">
          {fullName?.[0]?.toUpperCase() ?? <UserCircleIcon size={26} />}
        </div>
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Account</p>
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              disabled
              className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400 cursor-not-allowed"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300">
              <LockClosedIcon />
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1.5">Email address cannot be changed here</p>
        </div>
      </div>

      {/* Profile info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Profile info</p>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Location</label>
          <input
            type="text"
            placeholder="e.g. Plymouth, IN"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-gray-700">About you</label>
            <span className="text-xs text-gray-400">optional</span>
          </div>
          <textarea
            placeholder="Tell applicants a bit about yourself or your household..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition resize-none"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${
          saved ? "bg-[#C8FF00] text-black" : "bg-black text-[#C8FF00] hover:bg-gray-900"
        }`}
      >
        {saving ? (
          <>
            <span className="w-4 h-4 border-2 border-[#C8FF00] border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : saved ? (
          <><CheckIcon size={14} /> Saved!</>
        ) : "Save changes"}
      </button>
    </div>
  );
}