"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function EmployerDashboard() {
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
        .order("created_at", { ascending: false });
      setJobs(jobsData ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleCloseJob(jobId) {
    await getSupabase()
      .from("jobs")
      .update({ status: "closed" })
      .eq("id", jobId);
    setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, status: "closed" } : j));
  }

  const activeJobs = jobs.filter((j) => j.status === "active");
  const closedJobs = jobs.filter((j) => j.status !== "active");

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0">

      {/* welcome banner */}
      <div className="w-full bg-black rounded-2xl px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[#C8FF00] text-sm font-semibold mb-1">Employer dashboard</p>
          <h1 className="text-2xl font-bold text-white">
            Hey {profile?.full_name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {profile?.business_name ?? "Manage your job listings"}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
            <p className="text-white text-xl font-bold">{activeJobs.length}</p>
            <p className="text-gray-400 text-xs mt-0.5">Active jobs</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
            <p className="text-white text-xl font-bold">{jobs.length}</p>
            <p className="text-gray-400 text-xs mt-0.5">Total posted</p>
          </div>
        </div>
      </div>

      {/* post job CTA if no jobs */}
      {!loading && jobs.length === 0 && (
        <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-4xl">📋</span>
          <p className="text-gray-700 text-sm font-semibold">No jobs posted yet</p>
          <p className="text-gray-400 text-xs">Post your first job and start getting applicants</p>
          <button
            onClick={() => router.push("/dashboard/employer/post")}
            className="mt-2 bg-black text-[#C8FF00] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition"
          >
            Post a job
          </button>
        </div>
      )}

      {/* active jobs */}
      {activeJobs.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Active listings</p>
            <button
              onClick={() => router.push("/dashboard/employer/post")}
              className="text-xs font-semibold bg-black text-[#C8FF00] px-3 py-1.5 rounded-lg hover:bg-gray-900 transition"
            >
              + Post new
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {activeJobs.map((job) => (
              <JobCard key={job.id} job={job} onClose={handleCloseJob} />
            ))}
          </div>
        </div>
      )}

      {/* closed jobs */}
      {closedJobs.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Closed listings</p>
          <div className="flex flex-col gap-3 opacity-60">
            {closedJobs.map((job) => (
              <JobCard key={job.id} job={job} onClose={handleCloseJob} closed />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function JobCard({ job, onClose, closed }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{job.title}</h3>
          {job.urgent && (
            <span className="bg-[#C8FF00] text-black text-xs font-bold px-2 py-0.5 rounded-full">
              ⚡ Urgent
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{job.description}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-gray-400">📍 {job.location}</span>
          <span className="text-xs font-semibold text-gray-700">
            ${job.pay}/{job.pay_type === "hourly" ? "hr" : "job"}
          </span>
          <span className="text-xs text-gray-400">{job.category}</span>
        </div>
      </div>
      {!closed && (
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`/dashboard/employer/applicants?job=${job.id}`}
            className="text-xs font-medium border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            View applicants
          </a>
          <button
            onClick={() => onClose(job.id)}
            className="text-xs font-medium border border-red-200 text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition"
          >
            Close job
          </button>
        </div>
      )}
    </div>
  );
}