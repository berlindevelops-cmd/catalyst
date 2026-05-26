"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function BusinessDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) return;

      const { data: profileData } = await getSupabase()
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      const { data: jobsData } = await getSupabase()
        .from("jobs")
        .select("*")
        .eq("employer_id", user.id)
        .eq("listing_type", "business")
        .order("created_at", { ascending: false });
      setJobs(jobsData ?? []);
      setLoading(false);

      // real-time
      const channel = getSupabase()
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

      return () => getSupabase().removeChannel(channel);
    }
    load();
  }, []);

  async function handleDelete(jobId) {
    await getSupabase().from("jobs").delete().eq("id", jobId);
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }

  const activeJobs = jobs.filter((j) => j.status === "active");
  const closedJobs = jobs.filter((j) => j.status !== "active");

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0">

      {/* banner */}
      <div className="w-full bg-black rounded-2xl px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[#C8FF00] text-sm font-semibold mb-1">Business Dashboard</p>
          <h1 className="text-2xl font-bold text-white">
            {profile?.business_name ?? profile?.full_name ?? "Your Business"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">{profile?.location}</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
            <p className="text-white text-xl font-bold">{activeJobs.length}</p>
            <p className="text-gray-400 text-xs mt-0.5">Active listings</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
            <p className="text-white text-xl font-bold">{jobs.length}</p>
            <p className="text-gray-400 text-xs mt-0.5">Total posted</p>
          </div>
        </div>
      </div>

      {/* empty state */}
      {!loading && jobs.length === 0 && (
        <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-4xl">💼</span>
          <p className="text-gray-700 text-sm font-semibold">No job listings yet</p>
          <p className="text-gray-400 text-xs">Post your first formal job listing</p>
          <button
            onClick={() => router.push("/dashboard/business/post")}
            className="mt-2 bg-black text-[#C8FF00] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition"
          >
            Post a job
          </button>
        </div>
      )}

      {/* active listings */}
      {activeJobs.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Active listings</p>
            <button
              onClick={() => router.push("/dashboard/business/post")}
              className="text-xs font-semibold bg-black text-[#C8FF00] px-3 py-1.5 rounded-lg hover:bg-gray-900 transition"
            >
              + Post new
            </button>
          </div>
          {activeJobs.map((job) => (
            <BusinessJobCard key={job.id} job={job} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {closedJobs.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Closed listings</p>
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
            <span className="text-xs font-bold bg-black text-[#C8FF00] px-2 py-0.5 rounded-full">
              💼 Business
            </span>
            {job.job_type && (
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {job.job_type}
              </span>
            )}
            {job.urgent && (
              <span className="text-xs font-bold bg-[#C8FF00] text-black px-2 py-0.5 rounded-full">
                ⚡ Urgent
              </span>
            )}
          </div>
          <h3 className="font-bold text-gray-900 text-base">{job.title}</h3>
          {job.department && (
            <p className="text-xs text-gray-400 font-medium">{job.department}</p>
          )}
          <div className="flex items-center gap-3 flex-wrap mt-1">
            <span className="text-xs text-gray-400">📍 {job.location}</span>
            <span className="text-xs font-semibold text-gray-700">
              ${job.pay}/{job.pay_type === "hourly" ? "hr" : "job"}
            </span>
            {job.openings > 1 && (
              <span className="text-xs text-gray-400">{job.openings} openings</span>
            )}
            {job.schedule && (
              <span className="text-xs text-gray-400">🕐 {job.schedule}</span>
            )}
            {job.interview_required && (
              <span className="text-xs text-gray-500 font-medium">📋 Interview required</span>
            )}
          </div>
        </div>
        {!closed && (
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/dashboard/business/applicants?job=${job.id}`}
              className="text-xs font-medium border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Applicants
            </a>
            <button
              onClick={() => onDelete(job.id)}
              className="text-xs font-medium border border-red-200 text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition"
            >
              Delete
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