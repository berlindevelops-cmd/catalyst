"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "All", "Babysitting", "Lawn Care", "Tutoring", "Pet Sitting",
  "Snow Removal", "House Cleaning", "Grocery Help",
  "Moving Help", "Car Washing", "Dog Walking", "Other"
];

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
  const [applicationCounts, setApplicationCounts] = useState({});

  useEffect(() => {
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) return;

      // load profile
      const { data: profileData } = await getSupabase()
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      // load jobs
      const { data: jobsData } = await getSupabase()
        .from("jobs")
        .select("*")
        .eq("status", "active")
        .order("urgent", { ascending: false })
        .order("created_at", { ascending: false });
      setJobs(jobsData ?? []);
      setFilteredJobs(jobsData ?? []);
      setLoading(false);

      // load applications this teen has already submitted
      const { data: appsData } = await getSupabase()
        .from("applications")
        .select("job_id")
        .eq("teen_id", user.id);
      setAppliedJobs(appsData?.map((a) => a.job_id) ?? []);

      // real-time subscription for new jobs
      const channel = getSupabase()
        .channel("jobs-feed")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "jobs" },
          (payload) => {
            if (payload.new.status === "active") {
              setJobs((prev) => [payload.new, ...prev]);
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "jobs" },
          (payload) => {
            setJobs((prev) =>
              prev.map((j) => j.id === payload.new.id ? payload.new : j)
            );
          }
        )
        .subscribe();

      return () => getSupabase().removeChannel(channel);
    }
    load();
  }, []);

  // filter jobs whenever category, search, or jobs change
  useEffect(() => {
    let filtered = [...jobs].filter((j) => j.status === "active");
    if (category !== "All") {
      filtered = filtered.filter((j) => j.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (j) =>
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
    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) return;
    const { error } = await getSupabase().from("applications").insert({
      job_id: applyingTo.id,
      teen_id: user.id,
      employer_id: applyingTo.employer_id,
      message,
      status: "pending",
    });
    if (!error) {
      setAppliedJobs((prev) => [...prev, applyingTo.id]);
      setApplyingTo(null);
      setMessage("");
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0">

      {/* welcome banner */}
      <div className="w-full bg-black rounded-2xl px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[#C8FF00] text-sm font-semibold mb-1">Welcome back</p>
          <h1 className="text-2xl font-bold text-white">
            Hey {profile?.full_name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">Find your next gig in Plymouth</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
            <p className="text-white text-xl font-bold">{appliedJobs.length}</p>
            <p className="text-gray-400 text-xs mt-0.5">Applications</p>
          </div>
        </div>
      </div>

      {/* search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-black transition"
        />
      </div>

      {/* category filter */}
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

      {/* jobs list */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} near you
          </p>
          {profile?.skills?.length > 0 && (
            <div className="flex gap-1 flex-wrap justify-end">
              {profile.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="px-2 py-1 bg-black text-[#C8FF00] text-xs font-semibold rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && filteredJobs.length === 0 && (
          <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">🔍</span>
            <p className="text-gray-500 text-sm font-medium">No jobs found</p>
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

      {/* apply modal */}
      {applyingTo && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Apply for {applyingTo.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                ${applyingTo.pay}/{applyingTo.pay_type === "hourly" ? "hr" : "job"} · {applyingTo.location}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                Message to employer <span className="text-gray-400">(optional)</span>
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
                className="flex-1 bg-black text-[#C8FF00] py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition"
              >
                Submit application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function JobCard({ job, applied, onApply }) {
  return (
    <div className={`w-full bg-white rounded-2xl border p-5 flex flex-col gap-3 transition ${
      job.urgent ? "border-[#C8FF00] shadow-sm" : "border-gray-200"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{job.title}</h3>
            {job.urgent && (
              <span className="bg-[#C8FF00] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                ⚡ Urgent
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-gray-400">📍 {job.location}</span>
            <span className="text-xs font-semibold text-gray-700">
              ${job.pay}/{job.pay_type === "hourly" ? "hr" : "job"}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {job.category}
            </span>
          </div>
        </div>
        <button
          onClick={() => !applied && onApply(job)}
          disabled={applied}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            applied
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-black text-[#C8FF00] hover:bg-gray-900"
          }`}
        >
          {applied ? "Applied ✓" : "Apply"}
        </button>
      </div>
      <p className="text-sm text-gray-500 line-clamp-3">{job.description}</p>
    </div>
  );
}