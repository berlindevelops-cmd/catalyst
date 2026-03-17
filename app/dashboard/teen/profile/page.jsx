"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

const SKILLS = [
  "Babysitting", "Lawn Care", "Tutoring", "Pet Sitting",
  "Snow Removal", "House Cleaning", "Grocery Help",
  "Moving Help", "Car Washing", "Dog Walking"
];

const AVAILABILITY = [
  "Weekday mornings", "Weekday afternoons", "Weekday evenings",
  "Weekend mornings", "Weekend afternoons", "Weekend evenings"
];

export default function TeenProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // editable fields
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
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        setProfile(data);
        setFullName(data.full_name ?? "");
        setAge(data.age ?? "");
        setBio(data.bio ?? "");
        setSkills(data.skills ?? []);
        setAvailability(
          data.availability ? data.availability.split(", ") : []
        );
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0 max-w-xl">

      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">This is what employers see when you apply</p>
        </div>
        <div className="w-14 h-14 rounded-full bg-black text-[#C8FF00] flex items-center justify-center text-2xl font-bold">
          {fullName?.[0]?.toUpperCase() ?? "T"}
        </div>
      </div>

      {/* profile completeness */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Profile strength</p>
          <p className="text-sm font-bold text-gray-900">
            {[fullName, age, bio, skills.length > 0, availability.length > 0]
              .filter(Boolean).length * 20}%
          </p>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-[#C8FF00] rounded-full transition-all duration-500"
            style={{
              width: `${[fullName, age, bio, skills.length > 0, availability.length > 0]
                .filter(Boolean).length * 20}%`
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Name", done: !!fullName },
            { label: "Age", done: !!age },
            { label: "Bio", done: !!bio },
            { label: "Skills", done: skills.length > 0 },
            { label: "Availability", done: availability.length > 0 },
          ].map((item) => (
            <span
              key={item.label}
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                item.done
                  ? "bg-black text-[#C8FF00]"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {item.done ? "✓" : "+"} {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* basic info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
        <p className="text-sm font-semibold text-gray-700 uppercase tracking-widest">Basic info</p>

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
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Age</label>
          <input
            type="number"
            min="14"
            max="21"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">
            Bio <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            placeholder="Tell employers about yourself — your experience, reliability, personality..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">{bio.length}/300 characters</p>
        </div>
      </div>

      {/* skills */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
        <p className="text-sm font-semibold text-gray-700 uppercase tracking-widest">Skills</p>
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

      {/* availability */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
        <p className="text-sm font-semibold text-gray-700 uppercase tracking-widest">Availability</p>
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

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition ${
          saved
            ? "bg-[#C8FF00] text-black"
            : "bg-black text-[#C8FF00] hover:bg-gray-900"
        } disabled:opacity-50`}
      >
        {saving ? "Saving..." : saved ? "✓ Saved!" : "Save changes"}
      </button>
    </div>
  );
}