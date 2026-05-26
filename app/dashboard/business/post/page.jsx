"use client";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// ─── Icons ────────────────────────────────────────────────────────────────────
const BoltIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Babysitting", "Lawn Care", "Tutoring", "Pet Sitting",
  "Snow Removal", "House Cleaning", "Grocery Help",
  "Moving Help", "Car Washing", "Dog Walking", "Other",
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PostJob() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [pay, setPay] = useState("");
  const [payType, setPayType] = useState("hourly");
  const [location, setLocation] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!title || !description || !category || !pay || !location) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) { setError("Not logged in."); setLoading(false); return; }

    const { error: sbError } = await getSupabase().from("jobs").insert({
      employer_id: user.id,
      title,
      description,
      category,
      pay: parseFloat(pay),
      pay_type: payType,
      location,
      urgent,
      status: "active",
    });

    setLoading(false);
    if (sbError) { setError(sbError.message); return; }
    router.push("/dashboard/employer");
  }

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0 max-w-xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Post a job</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details and start receiving applicants</p>
      </div>

      <div className="flex flex-col gap-5 bg-white rounded-2xl border border-gray-200 p-6">

        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">Job title</label>
          <input
            type="text"
            placeholder="e.g. Weekend babysitter needed"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  category === cat
                    ? "bg-black text-[#C8FF00] border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">Description</label>
          <textarea
            placeholder="Describe the job, requirements, what you're looking for..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition resize-none"
          />
        </div>

        {/* Pay */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">Pay ($)</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="20"
              value={pay}
              onChange={(e) => setPay(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">Pay type</label>
            <div className="flex rounded-xl overflow-hidden border border-gray-200 text-sm font-semibold h-[50px]">
              <button
                onClick={() => setPayType("hourly")}
                className={`flex-1 transition ${
                  payType === "hourly" ? "bg-black text-[#C8FF00]" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                /hr
              </button>
              <button
                onClick={() => setPayType("per job")}
                className={`flex-1 border-l border-gray-200 transition ${
                  payType === "per job" ? "bg-black text-[#C8FF00]" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                /job
              </button>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">Location</label>
          <input
            type="text"
            placeholder="e.g. Plymouth, IN"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
          />
        </div>

        {/* Urgent toggle */}
        <button
          onClick={() => setUrgent(!urgent)}
          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition text-left ${
            urgent ? "border-black bg-black" : "border-gray-200 hover:border-gray-400"
          }`}
        >
          <div>
            <p className={`text-sm font-semibold flex items-center gap-2 ${urgent ? "text-[#C8FF00]" : "text-gray-900"}`}>
              <BoltIcon size={13} />
              Urgent Hire
            </p>
            <p className={`text-xs mt-0.5 ${urgent ? "text-gray-400" : "text-gray-400"}`}>
              Pin this listing to the top for 48 hours — $5
            </p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition shrink-0 ${
            urgent ? "border-[#C8FF00] bg-[#C8FF00]" : "border-gray-300"
          }`}>
            {urgent && <CheckIcon size={11} />}
          </div>
        </button>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-[#C8FF00] py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post job"}
        </button>
      </div>
    </div>
  );
}