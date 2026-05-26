"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Icons ────────────────────────────────────────────────────────────────────
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

const BriefcaseIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

const UsersIcon = ({ size = 12 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const TrashIcon = ({ size = 13 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const PlusIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, onClose, closed }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-gray-900 leading-tight">{job.title}</h3>
          {job.urgent && (
            <span className="inline-flex items-center gap-1 bg-[#C8FF00] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
              <BoltIcon size={10} />
              Urgent
            </span>
          )}
          {closed && (
            <span className="text-[10px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              Closed
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{job.description}</p>

        <div className="flex items-center gap-3 flex-wrap">
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
        </div>
      </div>

      {!closed && (
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/dashboard/employer/applicants?job=${job.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <UsersIcon size={13} />
            View applicants
          </Link>
          <button
            onClick={() => onClose(job.id)}
            className="inline-flex items-center gap-1.5 text-xs font-medium border border-red-200 text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition"
          >
            <TrashIcon />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployerDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) return;

      // Read from cache instantly
      const cached = localStorage.getItem(`profile:${user.id}`);
      if (cached) setProfile(JSON.parse(cached));

      const [{ data: profileData }, { data: jobsData }] = await Promise.all([
        getSupabase().from("profiles").select("*").eq("id", user.id).single(),
        getSupabase().from("jobs").select("*").eq("employer_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      setProfile(profileData);
      setJobs(jobsData ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleCloseJob(jobId) {
    if (!window.confirm("Delete this job? This can't be undone.")) return;
    await getSupabase().from("jobs").delete().eq("id", jobId);
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }

  const activeJobs = jobs.filter((j) => j.status === "active");
  const closedJobs = jobs.filter((j) => j.status !== "active");

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0">

      {/* Welcome banner */}
      <div className="w-full bg-black rounded-2xl px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[#C8FF00] text-xs font-semibold uppercase tracking-widest mb-1">Employer dashboard</p>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {profile?.full_name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {profile?.business_name ?? "Manage your job listings"}
          </p>
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
          <p className="text-gray-700 text-sm font-semibold">No jobs posted yet</p>
          <p className="text-gray-400 text-xs">Post your first listing and start receiving applicants</p>
          <Link
            href="/dashboard/employer/post"
            className="mt-2 bg-black text-[#C8FF00] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition"
          >
            Post a job
          </Link>
        </div>
      )}

      {/* Active jobs */}
      {activeJobs.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Active listings · {activeJobs.length}
            </p>
            <Link
              href="/dashboard/employer/post"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-black text-[#C8FF00] px-3 py-1.5 rounded-lg hover:bg-gray-900 transition"
            >
              <PlusIcon />
              Post new
            </Link>
          </div>
          {activeJobs.map((job) => (
            <JobCard key={job.id} job={job} onClose={handleCloseJob} />
          ))}
        </div>
      )}

      {/* Closed jobs */}
      {closedJobs.length > 0 && (
        <div className="flex flex-col gap-3 opacity-60">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Closed listings · {closedJobs.length}
          </p>
          {closedJobs.map((job) => (
            <JobCard key={job.id} job={job} onClose={handleCloseJob} closed />
          ))}
        </div>
      )}
    </div>
  );
}