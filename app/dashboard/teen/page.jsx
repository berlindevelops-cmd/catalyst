"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// ─── Icons ───────────────────────────────────────────────────────────────────
const MagnifyingGlassIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
  </svg>
);

const MapPinIcon = ({ size = 12 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const CurrencyDollarIcon = ({ size = 12 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BoltIcon = ({ size = 11 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
  </svg>
);

const BuildingStorefrontIcon = ({ size = 11 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
  </svg>
);

const ClipboardDocumentIcon = ({ size = 12 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
  </svg>
);

const FlagIcon = ({ size = 12 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
  </svg>
);

const XMarkIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "All", "Babysitting", "Lawn Care", "Tutoring", "Pet Sitting",
  "Snow Removal", "House Cleaning", "Grocery Help",
  "Moving Help", "Car Washing", "Dog Walking", "Other"
];

// ─── Report Modal ─────────────────────────────────────────────────────────────
function ReportModal({ type, jobId, jobTitle, onClose }) {
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!reason.trim()) return;
    const { data: { user } } = await getSupabase().auth.getUser();
    await getSupabase().from("reports").insert({
      reporter_id: user?.id,
      type,
      target_id: jobId,
      reason,
    });
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 flex flex-col gap-4">
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-[#C8FF00]">
              <CheckIcon size={18} />
            </div>
            <p className="font-semibold text-gray-900">Report submitted</p>
            <p className="text-sm text-gray-500 text-center">Thanks for flagging this. We'll review it shortly.</p>
            <button onClick={onClose} className="mt-2 text-sm font-medium text-gray-600 hover:text-black transition">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Report this listing</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
                <XMarkIcon />
              </button>
            </div>
            <p className="text-sm text-gray-500">"{jobTitle}"</p>
            <textarea
              placeholder="What's wrong with this listing?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition resize-none"
            />
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!reason.trim()}
                className="flex-1 bg-black text-[#C8FF00] py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-40"
              >
                Submit report
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, applied, onApply }) {
  const [reporting, setReporting] = useState(false);
  const isBusiness = job.listing_type === "business";

  return (
    <>
      <div className={`w-full bg-white rounded-2xl border p-5 flex flex-col gap-3 transition ${
        job.urgent ? "border-[#C8FF00] shadow-[0_0_0_1px_#C8FF00]" : isBusiness ? "border-gray-900" : "border-gray-200"
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {isBusiness && (
                <span className="inline-flex items-center gap-1 bg-black text-[#C8FF00] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <BuildingStorefrontIcon />
                  Business
                </span>
              )}
              {job.job_type && (
                <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {job.job_type}
                </span>
              )}
              {job.urgent && (
                <span className="inline-flex items-center gap-1 bg-[#C8FF00] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <BoltIcon />
                  Urgent
                </span>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 leading-tight">{job.title}</h3>
              {isBusiness && job.business_name && (
                <p className="text-xs font-medium text-gray-500 mt-0.5">{job.business_name}</p>
              )}
              {isBusiness && job.department && (
                <p className="text-xs text-gray-400">{job.department}</p>
              )}
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                <MapPinIcon />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-gray-700">
                <CurrencyDollarIcon />
                {job.pay}/{job.pay_type === "hourly" ? "hr" : "job"}
              </span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {job.category}
              </span>
              {isBusiness && job.openings > 1 && (
                <span className="text-xs text-gray-400">{job.openings} openings</span>
              )}
            </div>

            {isBusiness && job.schedule && (
              <p className="text-xs text-gray-500">{job.schedule}</p>
            )}
            {isBusiness && job.interview_required && (
              <p className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                <ClipboardDocumentIcon />
                Interview required
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={() => !applied && onApply(job)}
              disabled={applied}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                applied
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-black text-[#C8FF00] hover:bg-gray-800"
              }`}
            >
              {applied ? (
                <span className="inline-flex items-center gap-1">
                  <CheckIcon size={11} /> Applied
                </span>
              ) : "Apply"}
            </button>
            <button
              onClick={() => setReporting(true)}
              className="inline-flex items-center gap-1 text-[10px] text-gray-300 hover:text-red-400 transition"
            >
              <FlagIcon />
              Report
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{job.description}</p>

        {isBusiness && job.dress_code && (
          <p className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            Dress code: {job.dress_code}
          </p>
        )}
      </div>

      {reporting && (
        <ReportModal
          type="job"
          jobId={job.id}
          jobTitle={job.title}
          onClose={() => setReporting(false)}
        />
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TeenDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState(null);
  const [message, setMessage] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    let channel;
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) return;

      const { data: profileData } = await getSupabase()
        .from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData);

      const { data: jobsData } = await getSupabase()
        .from("jobs").select("*").eq("status", "active")
        .order("urgent", { ascending: false })
        .order("created_at", { ascending: false });
      setJobs(jobsData ?? []);
      setFilteredJobs(jobsData ?? []);
      setLoading(false);

      const { data: appsData } = await getSupabase()
        .from("applications").select("job_id").eq("teen_id", user.id);
      setAppliedJobs(appsData?.map((a) => a.job_id) ?? []);

      channel = getSupabase().channel("jobs-feed")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "jobs" }, (payload) => {
          if (payload.new.status === "active") setJobs((prev) => [payload.new, ...prev]);
        })
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "jobs" }, (payload) => {
          setJobs((prev) => prev.map((j) => j.id === payload.new.id ? payload.new : j));
        })
        .on("postgres_changes", { event: "DELETE", schema: "public", table: "jobs" }, (payload) => {
          setJobs((prev) => prev.filter((j) => j.id !== payload.old.id));
        })
        .subscribe();

      return () => getSupabase().removeChannel(channel);
    }
    load();
    return () => { if (channel) getSupabase().removeChannel(channel); };
  }, []);

  useEffect(() => {
    let filtered = [...jobs].filter((j) => j.status === "active");
    if (category !== "All") filtered = filtered.filter((j) => j.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((j) =>
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q)
      );
    }
    setFilteredJobs(filtered);
  }, [category, search, jobs]);

  async function handleApply(job) {
    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) return;
    setApplyingTo(job);
    setMessage("");
  }

  async function submitApplication() {
    if (submitting) return;                          // ← guard
    setSubmitting(true);                             // ← lock

    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) { setSubmitting(false); return; }

    const { error } = await getSupabase().from("applications").insert({
      job_id: applyingTo.id,
      teen_id: user.id,
      employer_id: applyingTo.employer_id,
      message,
      status: "pending",
    });

    setSubmitting(false);                            // ← unlock regardless of outcome

    if (!error) {
      setAppliedJobs((prev) => [...prev, applyingTo.id]);
      setApplyingTo(null);
      setMessage("");

      const { data: employerData } = await getSupabase()
        .from("profiles").select("full_name, business_name")
        .eq("id", applyingTo.employer_id).single();

      const { data: employerAuth } = await getSupabase()
        .rpc("get_user_email", { user_id: applyingTo.employer_id }).single();

      if (employerAuth?.email) {
        await fetch("/api/notify/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employerEmail: employerAuth.email,
            employerName: employerData?.business_name ?? employerData?.full_name ?? "there",
            teenName: profile?.full_name ?? "A teen",
            jobTitle: applyingTo.title,
            message,
          }),
        });
      }
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0">

      {/* Welcome banner */}
      <div className="w-full bg-black rounded-2xl px-6 py-7 flex items-center justify-between gap-4">
        <div>
          <p className="text-[#C8FF00] text-xs font-semibold uppercase tracking-widest mb-1">Welcome back</p>
          <h1 className="text-2xl font-bold text-white">
            Hey {profile?.full_name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">Find your next gig in Plymouth</p>
        </div>
        <div className="bg-white/10 rounded-xl px-5 py-3 text-center shrink-0">
          <p className="text-white text-xl font-bold">{appliedJobs.length}</p>
          <p className="text-gray-400 text-xs mt-0.5">Applied</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          <MagnifyingGlassIcon />
        </span>
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-black transition"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition ${
              category === cat
                ? "bg-black text-[#C8FF00] border-black"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Jobs list */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} near you
          </p>
          {profile?.skills?.length > 0 && (
            <div className="flex gap-1 flex-wrap justify-end">
              {profile.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="px-2 py-0.5 bg-black text-[#C8FF00] text-[10px] font-semibold rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && filteredJobs.length === 0 && (
          <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <MagnifyingGlassIcon size={20} />
            </div>
            <p className="text-gray-600 text-sm font-medium">No jobs found</p>
            <p className="text-gray-400 text-xs">Try a different category or check back soon</p>
          </div>
        )}

        {!loading && filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            applied={appliedJobs.includes(job.id)}
            onApply={handleApply}
          />
        ))}
      </div>

      {/* Apply modal */}
      {applyingTo && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Apply for {applyingTo.title}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  ${applyingTo.pay}/{applyingTo.pay_type === "hourly" ? "hr" : "job"} · {applyingTo.location}
                </p>
              </div>
              <button onClick={() => setApplyingTo(null)} className="text-gray-400 hover:text-gray-700 transition mt-0.5">
                <XMarkIcon />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                Message to employer <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                placeholder="Introduce yourself, mention any relevant experience..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setApplyingTo(null)}
                className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitApplication}
                disabled={submitting}
                className="flex-1 bg-black text-[#C8FF00] py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}