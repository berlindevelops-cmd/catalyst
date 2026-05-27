"use client";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// ─── Icons ───────────────────────────────────────────────────────────────────
const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Retail", "Food & Beverage", "Landscaping", "Tutoring Center",
  "Office Help", "Event Staff", "Warehouse", "Childcare", "Other"
];

const JOB_TYPES = ["Part-time", "Seasonal", "Weekend-only", "After-school"];

export default function BusinessPostJob() {
  const router = useRouter();

  const [title, setTitle]             = useState("");
  const [department, setDepartment]   = useState("");
  const [category, setCategory]       = useState("");
  const [jobType, setJobType]         = useState("");
  const [description, setDescription] = useState("");
  const [pay, setPay]                 = useState("");
  const [payType, setPayType]         = useState("hourly");
  const [location, setLocation]       = useState("");
  const [schedule, setSchedule]       = useState("");
  const [openings, setOpenings]       = useState("1");
  const [startDate, setStartDate]     = useState("");
  const [dressCode, setDressCode]     = useState("");
  const [interviewRequired, setInterviewRequired] = useState(false);
  const [urgent, setUrgent]           = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  async function handleSubmit() {
    if (!title || !category || !description || !pay || !location) {
      setError("Please fill in all required fields.");
      return;
    }
    if (loading) return;
    setLoading(true);
    setError("");

    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) { setError("Not logged in."); setLoading(false); return; }

    const { data: profile } = await getSupabase()
      .from("profiles")
      .select("business_name, location")
      .eq("id", user.id)
      .single();

    const insertData = {
      employer_id: user.id,
      listing_type: "business",
      title,
      category,
      description,
      pay: parseFloat(pay),
      pay_type: payType,
      location: location || profile?.location || "",
      urgent,
      status: "active",
      business_name: profile?.business_name ?? "",
      interview_required: interviewRequired,
    };

    if (department) insertData.department = department;
    if (jobType)    insertData.job_type   = jobType;
    if (schedule)   insertData.schedule   = schedule;
    if (openings)   insertData.openings   = parseInt(openings, 10) || 1;
    if (startDate)  insertData.start_date = startDate;
    if (dressCode)  insertData.dress_code = dressCode;

    const { error: sbError } = await getSupabase().from("jobs").insert(insertData);
    setLoading(false);
    if (sbError) { setError(sbError.message); return; }
    router.push("/dashboard/business");
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition";
  const sectionClass = "bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4";
  const labelClass = "text-xs font-medium text-gray-700 mb-1.5 block";

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0 max-w-xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Post a job listing</h1>
        <p className="text-gray-500 text-sm mt-1">Create a formal listing to attract the best teen applicants</p>
      </div>

      {/* Role details */}
      <div className={sectionClass}>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Role details</p>

        <div>
          <label className={labelClass}>Job title <span className="text-red-400">*</span></label>
          <input type="text" placeholder="e.g. Sales Associate, Barista, Camp Counselor"
            value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Department <span className="text-gray-400">(optional)</span></label>
          <input type="text" placeholder="e.g. Front of House, Customer Service"
            value={department} onChange={(e) => setDepartment(e.target.value)} className={inputClass} />
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
              <button key={type} onClick={() => setJobType(type === jobType ? "" : type)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  jobType === type ? "bg-black text-[#C8FF00] border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}>
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Job description <span className="text-red-400">*</span></label>
          <textarea
            placeholder="Describe responsibilities, what you're looking for, any experience required..."
            value={description} onChange={(e) => setDescription(e.target.value)}
            rows={5} className={`${inputClass} resize-none`} />
        </div>
      </div>

      {/* Compensation */}
      <div className={sectionClass}>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Compensation</p>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelClass}>Pay rate <span className="text-red-400">*</span></label>
            <input type="number" placeholder="15"
              value={pay} onChange={(e) => setPay(e.target.value)} className={inputClass} />
          </div>
          <div className="flex-1">
            <label className={labelClass}>Pay type</label>
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
      <div className={sectionClass}>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Logistics</p>

        <div>
          <label className={labelClass}>Location <span className="text-red-400">*</span></label>
          <input type="text" placeholder="e.g. Plymouth, IN"
            value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Schedule <span className="text-gray-400">(optional)</span></label>
          <input type="text" placeholder="e.g. Weekends 10am–4pm, or 15–20 hrs/week"
            value={schedule} onChange={(e) => setSchedule(e.target.value)} className={inputClass} />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelClass}>Openings</label>
            <input type="number" min="1" placeholder="1"
              value={openings} onChange={(e) => setOpenings(e.target.value)} className={inputClass} />
          </div>
          <div className="flex-1">
            <label className={labelClass}>Start date <span className="text-gray-400">(optional)</span></label>
            <input type="date"
              value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Dress code / uniform <span className="text-gray-400">(optional)</span></label>
          <input type="text" placeholder="e.g. Black pants and white shirt provided"
            value={dressCode} onChange={(e) => setDressCode(e.target.value)} className={inputClass} />
        </div>
      </div>

      {/* Options */}
      <div className={sectionClass}>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Options</p>

        <div
          onClick={() => setInterviewRequired(!interviewRequired)}
          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
            interviewRequired ? "border-black bg-black" : "border-gray-200 hover:border-gray-400"
          }`}
        >
          <div className="flex items-center gap-3">
            <ClipboardIcon />
            <div>
              <p className={`text-sm font-semibold ${interviewRequired ? "text-[#C8FF00]" : "text-gray-900"}`}>
                Interview required
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Applicants will know an interview is part of the process
              </p>
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
            interviewRequired ? "border-[#C8FF00] bg-[#C8FF00]" : "border-gray-300"
          }`}>
            {interviewRequired && <span className="text-black text-xs font-bold">✓</span>}
          </div>
        </div>

        <div
          onClick={() => setUrgent(!urgent)}
          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
            urgent ? "border-black bg-black" : "border-gray-200 hover:border-gray-400"
          }`}
        >
          <div className="flex items-center gap-3">
            <ZapIcon />
            <div>
              <p className={`text-sm font-semibold ${urgent ? "text-[#C8FF00]" : "text-gray-900"}`}>
                Urgent Hire — $5
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Pin to top of teen feed for 48 hours
              </p>
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
            urgent ? "border-[#C8FF00] bg-[#C8FF00]" : "border-gray-300"
          }`}>
            {urgent && <span className="text-black text-xs font-bold">✓</span>}
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-[#C8FF00] py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post job listing"}
      </button>
    </div>
  );
}