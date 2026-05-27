"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Icons ───────────────────────────────────────────────────────────────────
const BriefcaseIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const InboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

export default function BusinessDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel;
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) return;

      // Cache for instant render
      const cached = localStorage.getItem(`profile:${user.id}`);
      if (cached) setProfile(JSON.parse(cached));

      const [{ data: profileData }, { data: jobsData }] = await Promise.all([
        getSupabase().from("profiles").select("*").eq("id", user.id).single(),
        getSupabase()
          .from("jobs")
          .select("*")
          .eq("employer_id", user.id)
          .eq("listing_type", "business")
          .order("created_at", { ascending: false }),
      ]);

      if (profileData) {
        localStorage.setItem(`profile:${user.id}`, JSON.stringify(profileData));
        setProfile(profileData);
      }
      setJobs(jobsData ?? []);
      setLoading(false);

      channel = getSupabase()
        .channel("business-jobs")
        .on("postgres_changes",
          { event: "*", schema: "public", table: "jobs", filter: `employer_id=eq.${user.id}` },
          (payload) => {
            if (payload.eventType === "INSERT") setJobs((prev) => [payload.new, ...prev]);
            if (payload.eventType === "DELETE") setJobs((prev) => prev.filter((j) => j.id !== payload.old.id));
            if (payload.eventType === "UPDATE") setJobs((prev) => prev.map((j) => j.id === payload.new.id ? payload.new : j));
          }
        )
        .subscribe();
    }
    load();
    return () => { if (channel) getSupabase().removeChannel(channel); };
  }, []);

  async function handleDelete(jobId) {
    if (!window.confirm("Delete this listing? This can't be undone.")) return;
    await getSupabase().from("jobs").delete().eq("id", jobId);
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }

  const activeJobs = jobs.filter((j) => j.status === "active");
  const closedJobs = jobs.filter((j) => j.status !== "active");

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0">

      {/* Banner */}
      <div className="w-full bg-black rounded-2xl px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[#C8FF00] text-xs font-semibold mb-1 uppercase tracking-widest">Business Dashboard</p>
          <h1 className="text-2xl font-bold text-white">
            {profile?.business_name ?? profile?.full_name ?? "Your Business"}
          </h1>
          {profile?.location && (
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
              <MapPinIcon /> {profile.location}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
            <p className="text-white text-xl font-bold">{activeJobs.length}</p>
            <p className="text-gray-400 text-xs mt-0.5">Active</p>
          </div>
          <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
            <p className="text-white text-xl font-bold">{jobs.length}</p>
            <p className="text-gray-400 text-xs mt-0.5">Total posted</p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {!loading && jobs.length === 0 && (
        <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <BriefcaseIcon size={22} />
          </div>
          <p className="text-gray-700 text-sm font-semibold">No job listings yet</p>
          <p className="text-gray-400 text-xs">Post your first formal job listing to find great teen talent</p>
          <button
            onClick={() => router.push("/dashboard/business/post")}
            className="mt-2 bg-black text-[#C8FF00] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition"
          >
            Post a job
          </button>
        </div>
      )}

      {/* Active listings */}
      {activeJobs.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Active listings</p>
            <button
              onClick={() => router.push("/dashboard/business/post")}
              className="flex items-center gap-1.5 text-xs font-semibold bg-black text-[#C8FF00] px-3 py-1.5 rounded-lg hover:bg-gray-900 transition"
            >
              <PlusIcon /> Post new
            </button>
          </div>
          {activeJobs.map((job) => (
            <BusinessJobCard key={job.id} job={job} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Closed listings */}
      {closedJobs.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Closed listings</p>
          <div className="opacity-60">
            {closedJobs.map((job) => (
              <BusinessJobCard key={job.id} job={job} onDelete={handleDelete} closed />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BusinessJobCard({ job, onDelete, closed }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold bg-black text-[#C8FF00] px-2 py-0.5 rounded-full flex items-center gap-1">
              <BriefcaseIcon size={10} /> Business
            </span>
            {job.job_type && (
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {job.job_type}
              </span>
            )}
            {job.urgent && (
              <span className="text-xs font-bold bg-[#C8FF00] text-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <ZapIcon /> Urgent
              </span>
            )}
          </div>
          <h3 className="font-bold text-gray-900 text-base">{job.title}</h3>
          {job.department && (
            <p className="text-xs text-gray-400 font-medium">{job.department}</p>
          )}
          <div className="flex items-center gap-3 flex-wrap mt-1">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <MapPinIcon /> {job.location}
            </span>
            <span className="text-xs font-semibold text-gray-700">
              ${job.pay}/{job.pay_type === "hourly" ? "hr" : "job"}
            </span>
            {job.openings > 1 && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <UsersIcon /> {job.openings} openings
              </span>
            )}
            {job.schedule && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <ClockIcon /> {job.schedule}
              </span>
            )}
            {job.interview_required && (
              <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                <ClipboardIcon /> Interview required
              </span>
            )}
          </div>
        </div>
        {!closed && (
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/dashboard/business/applicants?job=${job.id}`}
              className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <InboxIcon /> Applicants
            </Link>
            <button
              onClick={() => onDelete(job.id)}
              className="flex items-center gap-1.5 text-xs font-medium border border-red-200 text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition"
            >
              <TrashIcon /> Delete
            </button>
          </div>
        )}
      </div>
      {job.description && (
        <p className="text-sm text-gray-500 line-clamp-2">{job.description}</p>
      )}
    </div>
  );
}