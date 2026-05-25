"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

// ─── Icons ────────────────────────────────────────────────────────────────────
const UserCircleIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

// ─── Constants ────────────────────────────────────────────────────────────────
const SKILLS = [
  "Babysitting", "Lawn Care", "Tutoring", "Pet Sitting",
  "Snow Removal", "House Cleaning", "Grocery Help",
  "Moving Help", "Car Washing", "Dog Walking",
];

const AVAILABILITY = [
  "Weekday mornings", "Weekday afternoons", "Weekday evenings",
  "Weekend mornings", "Weekend afternoons", "Weekend evenings",
];

// ─── Toggle Row (full-width, easy to tap) ─────────────────────────────────────
function ToggleRow({ label, active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-medium transition active:scale-[0.98] ${
        active
          ? "bg-black text-[#C8FF00] border-black"
          : "bg-white text-gray-700 border-gray-200"
      }`}
    >
      <span>{label}</span>
      {active && <CheckIcon size={14} />}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TeenProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) return;
      const { data } = await getSupabase()
        .from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setFullName(data.full_name ?? "");
        setAge(data.age ?? "");
        setBio(data.bio ?? "");
        setSkills(data.skills ?? []);
        setAvailability(data.availability ? data.availability.split(", ") : []);
      }
      setLoading(false);
    }
    load();
  }, []);

  function toggleSkill(skill) {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  function toggleAvailability(slot) {
    setAvailability((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  }

  async function handleSave() {
    if (!fullName || !age) { setError("Name and age are required."); return; }
    setSaving(true);
    setError("");
    const { data: { user } } = await getSupabase().auth.getUser();
    const { error: sbError } = await getSupabase()
      .from("profiles")
      .update({
        full_name: fullName,
        age: parseInt(age),
        bio,
        skills,
        availability: availability.join(", "),
      })
      .eq("id", user.id);
    setSaving(false);
    if (sbError) { setError(sbError.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const steps = [
    { label: "Name", done: !!fullName },
    { label: "Age", done: !!age },
    { label: "Bio", done: !!bio },
    { label: "Skills", done: skills.length > 0 },
    { label: "Availability", done: availability.length > 0 },
  ];
  const completedCount = steps.filter((s) => s.done).length;
  const completePct = completedCount * 20;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Scroll content — extra bottom padding so sticky bar doesn't cover last card */}
      <div className="flex flex-col gap-4 pb-32 md:pb-8 max-w-xl">

        {/* Header banner */}
        <div className="w-full bg-black rounded-2xl px-5 py-6 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[#C8FF00] text-[10px] font-semibold uppercase tracking-widest mb-1">Your profile</p>
            <h1 className="text-xl font-bold text-white truncate">
              {fullName || "Set up your profile"}
            </h1>
            <p className="text-gray-400 text-xs mt-1">What employers see when you apply</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/10 text-[#C8FF00] flex items-center justify-center text-xl font-bold shrink-0 select-none">
            {fullName?.[0]?.toUpperCase() ?? <UserCircleIcon size={24} />}
          </div>
        </div>

        {/* Profile strength */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Profile strength</p>
            <p className="text-sm font-bold text-gray-900">{completePct}%</p>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-2.5 bg-[#C8FF00] rounded-full transition-all duration-500"
              style={{ width: `${completePct}%` }}
            />
          </div>
          {/* Checklist — full row layout, easy to scan */}
          <div className="flex flex-col gap-1.5 mt-1">
            {steps.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  item.done ? "bg-black" : "bg-gray-100"
                }`}>
                  {item.done && <CheckIcon size={9} />}
                </div>
                <span className={`text-sm ${item.done ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Basic info</p>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              // text-base = 16px prevents iOS zoom on focus
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-base outline-none focus:border-black transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              inputMode="numeric"
              min="14"
              max="21"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your age"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-base outline-none focus:border-black transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <span className="text-xs text-gray-400">optional</span>
            </div>
            <textarea
              placeholder="Tell employers about yourself — your experience, reliability, personality..."
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 300))}
              rows={4}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-base outline-none focus:border-black transition resize-none"
            />
            <p className={`text-xs text-right ${bio.length >= 280 ? "text-amber-500" : "text-gray-400"}`}>
              {bio.length}/300
            </p>
          </div>
        </div>

        {/* Skills — full-width toggle rows for easy tapping */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Skills</p>
            {skills.length > 0 && (
              <span className="text-xs font-semibold text-gray-900">{skills.length} selected</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {SKILLS.map((skill) => (
              <ToggleRow
                key={skill}
                label={skill}
                active={skills.includes(skill)}
                onToggle={() => toggleSkill(skill)}
              />
            ))}
          </div>
        </div>

        {/* Availability — full-width toggle rows */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Availability</p>
            {availability.length > 0 && (
              <span className="text-xs font-semibold text-gray-900">{availability.length} selected</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {AVAILABILITY.map((slot) => (
              <ToggleRow
                key={slot}
                label={slot}
                active={availability.includes(slot)}
                onToggle={() => toggleAvailability(slot)}
              />
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {/* Desktop save button (hidden on mobile — sticky bar handles it) */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`hidden md:flex w-full items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${
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

      {/* Mobile sticky save bar — sits above bottom nav */}
      <div className="md:hidden fixed bottom-[65px] left-0 right-0 z-40 px-4 pb-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold shadow-lg transition active:scale-[0.98] disabled:opacity-50 ${
            saved ? "bg-[#C8FF00] text-black" : "bg-black text-[#C8FF00]"
          }`}
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-[#C8FF00] border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <><CheckIcon size={16} /> Saved!</>
          ) : "Save changes"}
        </button>
      </div>
    </>
  );
}