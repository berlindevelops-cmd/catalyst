"use client";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Babysitting", "Lawn Care", "Tutoring", "Pet Sitting",
  "Snow Removal", "House Cleaning", "Grocery Help",
  "Moving Help", "Car Washing", "Dog Walking", "Other"
];

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
      pay,
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
    <div className="flex flex-col gap-6 pb-24 md:pb-0 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Post a job</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details and start getting applicants</p>
      </div>

      <div className="flex flex-col gap-4 bg-white rounded-2xl border border-gray-200 p-6">

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Job title</label>
          <input
            type="text"
            placeholder="e.g. Weekend babysitter needed"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Category</label>
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

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Description</label>
          <textarea
            placeholder="Describe the job, what you need, any requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition resize-none"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Pay</label>
            <input
              type="number"
              placeholder="20"
              value={pay}
              onChange={(e) => setPay(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Pay type</label>
            <div className="flex rounded-xl overflow-hidden border border-gray-200 text-sm font-medium h-[46px]">
              <button
                onClick={() => setPayType("hourly")}
                className={`flex-1 transition ${
                  payType === "hourly"
                    ? "bg-black text-[#C8FF00]"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                /hr
              </button>
              <button
                onClick={() => setPayType("per job")}
                className={`flex-1 transition ${
                  payType === "per job"
                    ? "bg-black text-[#C8FF00]"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                /job
              </button>
            </div>
          </div>
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

        <div
          onClick={() => setUrgent(!urgent)}
          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
            urgent ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"
          }`}
        >
          <div>
            <p className={`text-sm font-semibold ${urgent ? "text-[#C8FF00]" : "text-gray-900"}`}>
              ⚡ Urgent Hire
            </p>
            <p className={`text-xs mt-0.5 ${urgent ? "text-gray-300" : "text-gray-400"}`}>
              Pin this listing to the top for 48 hours — $5
            </p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
            urgent ? "border-[#C8FF00] bg-[#C8FF00]" : "border-gray-300"
          }`}>
            {urgent && <span className="text-black text-xs font-bold">✓</span>}
          </div>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-[#C8FF00] py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post job"}
        </button>
      </div>
    </div>
  );
}