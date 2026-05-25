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

  // Completeness
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
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0 max-w-xl">

      {/* Header — matches dashboard welcome banner style */}
      <div className="w-full bg-black rounded-2xl px-6 py-7 flex items-center justify-between gap-4">
        <div>
          <p className="text-[#C8FF00] text-xs font-semibold uppercase tracking-widest mb-1">Your profile</p>
          <h1 className="text-2xl font-bold text-white">
            {fullName || "Set up your profile"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">This is what employers see when you apply</p>
        </div>
        <div className="w-14 h-14 rounded-full bg-white/10 text-[#C8FF00] flex items-center justify-center text-2xl font-bold shrink-0">
          {fullName?.[0]?.toUpperCase() ?? <UserCircleIcon size={28} />}
        </div>
      </div>

      {/* Profile strength */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Profile strength</p>
          <p className="text-sm font-bold text-gray-900">{completePct}%</p>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-[#C8FF00] rounded-full transition-all duration-500"
            style={{ width: `${completePct}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {steps.map((item) => (
            <span
              key={item.label}
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition ${
                item.done
                  ? "bg-black text-[#C8FF00]"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {item.done ? <CheckIcon size={10} /> : <span className="text-[10px]">+</span>}
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Basic info</p>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Age</label>
          <input
            type="number"
            min="14"
            max="21"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Your age"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">
            Bio <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="Tell employers about yourself — your experience, reliability, personality..."
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 300))}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition resize-none"
          />
          <p className={`text-xs mt-1 ${bio.length >= 280 ? "text-amber-500" : "text-gray-400"}`}>
            {bio.length}/300 characters
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Skills</p>
          {skills.length > 0 && (
            <span className="text-xs text-gray-400">{skills.length} selected</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                skills.includes(skill)
                  ? "bg-black text-[#C8FF00] border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Availability</p>
          {availability.length > 0 && (
            <span className="text-xs text-gray-400">{availability.length} selected</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY.map((slot) => (
            <button
              key={slot}
              onClick={() => toggleAvailability(slot)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                availability.includes(slot)
                  ? "bg-black text-[#C8FF00] border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-3.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${
          saved
            ? "bg-[#C8FF00] text-black"
            : "bg-black text-[#C8FF00] hover:bg-gray-900"
        }`}
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-[#C8FF00] border-t-transparent rounded-full animate-spin" />
            Saving...
          </span>
        ) : saved ? (
          <span className="flex items-center justify-center gap-2">
            <CheckIcon size={14} /> Saved!
          </span>
        ) : "Save changes"}
      </button>

    </div>
  );
}