"use client";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Retail", "Food & Beverage", "Landscaping", "Tutoring Center",
  "Office Help", "Event Staff", "Warehouse", "Childcare", "Other"
];

const JOB_TYPES = ["Part-time", "Seasonal", "Weekend-only", "After-school"];

export default function BusinessPostJob() {
  const router = useRouter();

  // basic
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  const [jobType, setJobType] = useState("");
  const [description, setDescription] = useState("");

  // pay
  const [pay, setPay] = useState("");
  const [payType, setPayType] = useState("hourly");

  // logistics
  const [location, setLocation] = useState("");
  const [schedule, setSchedule] = useState("");
  const [openings, setOpenings] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [dressCode, setDressCode] = useState("");

  // toggles
  const [interviewRequired, setInterviewRequired] = useState(false);
  const [urgent, setUrgent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!title || !category || !description || !pay || !location) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");

    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) { setError("Not logged in."); setLoading(false); return; }

    const { data: profile } = await getSupabase()
      .from("profiles")
      .select("business_name, location")
      .eq("id", user.id)
      .single();

    const { error: sbError } = await getSupabase().from("jobs").insert({
      employer_id: user.id,
      listing_type: "business",
      title,
      department,
      category,
      job_type: jobType,
      description,
      pay,
      pay_type: payType,
      location: location || profile?.location,
      schedule,
      openings: parseInt(openings) || 1,
      start_date: startDate,
      dress_code: dressCode,
      interview_required: interviewRequired,
      urgent,
      status: "active",
      business_name: profile?.business_name,
    });

    setLoading(false);
    if (sbError) { setError(sbError.message); return; }
    router.push("/dashboard/business");
  }

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Post a job listing</h1>
        <p className="text-gray-500 text-sm mt-1">Create a formal listing to attract the best teen applicants</p>
      </div>

      {/* Role & Category */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Role details</p>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Job title <span className="text-red-400">*</span></label>
          <input type="text" placeholder="e.g. Sales Associate, Barista, Camp Counselor"
            value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition" />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Department <span className="text-gray-400">(optional)</span></label>
          <input type="text" placeholder="e.g. Front of House, Customer Service"
            value={department} onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition" />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-2 block">Category <span className="text-red-400">*</span></label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  category === cat ? "bg-black text-[#C8FF00] border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-2 block">Job type</label>
          <div className="flex flex-wrap gap-2">
            {JOB_TYPES.map((type) => (
              <button key={type} onClick={() => setJobType(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  jobType === type ? "bg-black text-[#C8FF00] border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}>
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Job description <span className="text-red-400">*</span></label>
          <textarea placeholder="Describe responsibilities, what you're looking for, any experience required..."
            value={description} onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition resize-none" />
        </div>
      </div>

      {/* Pay */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Compensation</p>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Pay rate <span className="text-red-400">*</span></label>
            <input type="number" placeholder="15"
              value={pay} onChange={(e) => setPay(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition" />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Pay type</label>
            <div className="flex rounded-xl overflow-hidden border border-gray-200 text-sm font-medium h-[46px]">
              <button onClick={() => setPayType("hourly")}
                className={`flex-1 transition ${payType === "hourly" ? "bg-black text-[#C8FF00]" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
                /hr
              </button>
              <button onClick={() => setPayType("per job")}
                className={`flex-1 transition ${payType === "per job" ? "bg-black text-[#C8FF00]" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
                /job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logistics */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Logistics</p>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Location <span className="text-red-400">*</span></label>
          <input type="text" placeholder="e.g. Plymouth, IN"
            value={location} onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition" />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Schedule</label>
          <input type="text" placeholder="e.g. Weekends 10am–4pm, or 15–20 hrs/week"
            value={schedule} onChange={(e) => setSchedule(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition" />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Number of openings</label>
            <input type="number" min="1" placeholder="1"
              value={openings} onChange={(e) => setOpenings(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition" />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Start date</label>
            <input type="date"
              value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">Dress code / uniform <span className="text-gray-400">(optional)</span></label>
          <input type="text" placeholder="e.g. Black pants and white shirt provided"
            value={dressCode} onChange={(e) => setDressCode(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition" />
        </div>
      </div>

      {/* Toggles */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Options</p>

        <div onClick={() => setInterviewRequired(!interviewRequired)}
          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
            interviewRequired ? "border-black bg-black" : "border-gray-200 hover:border-gray-400"
          }`}>
          <div>
            <p className={`text-sm font-semibold ${interviewRequired ? "text-[#C8FF00]" : "text-gray-900"}`}>
              📋 Interview required
            </p>
            <p className={`text-xs mt-0.5 ${interviewRequired ? "text-gray-400" : "text-gray-400"}`}>
              Applicants will know an interview is part of the process
            </p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
            interviewRequired ? "border-[#C8FF00] bg-[#C8FF00]" : "border-gray-300"
          }`}>
            {interviewRequired && <span className="text-black text-xs font-bold">✓</span>}
          </div>
        </div>

        <div onClick={() => setUrgent(!urgent)}
          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
            urgent ? "border-black bg-black" : "border-gray-200 hover:border-gray-400"
          }`}>
          <div>
            <p className={`text-sm font-semibold ${urgent ? "text-[#C8FF00]" : "text-gray-900"}`}>
              ⚡ Urgent Hire — $5
            </p>
            <p className={`text-xs mt-0.5 ${urgent ? "text-gray-400" : "text-gray-400"}`}>
              Pin to top of teen feed for 48 hours
            </p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
            urgent ? "border-[#C8FF00] bg-[#C8FF00]" : "border-gray-300"
          }`}>
            {urgent && <span className="text-black text-xs font-bold">✓</span>}
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button onClick={handleSubmit} disabled={loading}
        className="w-full bg-black text-[#C8FF00] py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50">
        {loading ? "Posting..." : "Post job listing"}
      </button>
    </div>
  );
}