"use client";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const SKILLS = ["Babysitting", "Lawn Care", "Tutoring", "Pet Sitting", "Snow Removal", "House Cleaning", "Grocery Help", "Moving Help", "Car Washing", "Dog Walking"];
const AVAILABILITY = ["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Weekend mornings", "Weekend afternoons", "Weekend evenings"];

export default function TeenOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) { setError("Not logged in."); setLoading(false); return; }
    const { error: sbError } = await getSupabase().from("profiles").upsert({
      id: user.id,
      role: "teen",
      full_name: fullName,
      age: parseInt(age),
      bio,
      skills,
      availability: availability.join(", "),
    });
    setLoading(false);
    if (sbError) { setError(sbError.message); return; }
    router.push("/dashboard/teen");
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <nav className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <a href="/" className="text-xl font-bold tracking-tight text-gray-900">
          catalyst<span className="text-[#C8FF00]">.</span>
        </a>
        <span className="text-xs text-gray-400 font-medium">Step {step} of 3</span>
      </nav>

      {/* progress bar */}
      <div className="w-full h-1 bg-gray-100">
        <div
          className="h-1 bg-[#C8FF00] transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-16">
        <div className="w-full max-w-md flex flex-col gap-6">

          {step === 1 && (
            <>
              <div className="text-center">
                <span className="text-4xl">👤</span>
                <h1 className="text-2xl font-bold text-gray-900 mt-3">About you</h1>
                <p className="text-gray-500 text-sm mt-1">Let employers know who you are</p>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1.5 block">Full name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1.5 block">Age</label>
                  <input
                    type="number"
                    placeholder="Your age"
                    min="14"
                    max="21"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1.5 block">Bio <span className="text-gray-400">(optional)</span></label>
                  <textarea
                    placeholder="Tell employers a bit about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition resize-none"
                  />
                </div>
              </div>
              <button
                onClick={() => { if (!fullName || !age) { setError("Name and age are required."); return; } setError(""); setStep(2); }}
                className="w-full bg-black text-[#C8FF00] py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition"
              >
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-center">
                <span className="text-4xl">🛠️</span>
                <h1 className="text-2xl font-bold text-gray-900 mt-3">Your skills</h1>
                <p className="text-gray-500 text-sm mt-1">Pick everything you can do</p>
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
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                  Back
                </button>
                <button
                  onClick={() => { if (skills.length === 0) { setError("Pick at least one skill."); return; } setError(""); setStep(3); }}
                  className="flex-1 bg-black text-[#C8FF00] py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-center">
                <span className="text-4xl">📅</span>
                <h1 className="text-2xl font-bold text-gray-900 mt-3">Your availability</h1>
                <p className="text-gray-500 text-sm mt-1">When are you free to work?</p>
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
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                  Back
                </button>
                <button
                  onClick={() => { if (availability.length === 0) { setError("Pick at least one time slot."); return; } setError(""); handleSubmit(); }}
                  disabled={loading}
                  className="flex-1 bg-black text-[#C8FF00] py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Finish"}
                </button>
              </div>
            </>
          )}

          {error && step === 1 && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </main>
  );
}