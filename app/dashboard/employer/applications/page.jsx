"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function EmployerApplicants() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) return;

      // load employer's jobs
      const { data: jobsData } = await getSupabase()
        .from("jobs")
        .select("id, title")
        .eq("employer_id", user.id)
        .order("created_at", { ascending: false });
      setJobs(jobsData ?? []);

      // load all applications with teen profile + job info
      const { data: appsData } = await getSupabase()
        .from("applications")
        .select(`
          *,
          jobs ( title, pay, pay_type, location, category ),
          profiles!applications_teen_id_fkey (
            full_name,
            age,
            bio,
            skills,
            availability
          )
        `)
        .eq("employer_id", user.id)
        .order("created_at", { ascending: false });
      setApplications(appsData ?? []);
      setLoading(false);

      // real-time new applications
      const channel = getSupabase()
        .channel("employer-applicants")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "applications",
            filter: `employer_id=eq.${user.id}`,
          },
          async (payload) => {
            // fetch full application with joins
            const { data } = await getSupabase()
              .from("applications")
              .select(`
                *,
                jobs ( title, pay, pay_type, location, category ),
                profiles!applications_teen_id_fkey (
                  full_name,
                  age,
                  bio,
                  skills,
                  availability
                )
              `)
              .eq("id", payload.new.id)
              .single();
            if (data) setApplications((prev) => [data, ...prev]);
          }
        )
        .subscribe();

      return () => getSupabase().removeChannel(channel);
    }
    load();
  }, []);

  async function updateStatus(appId, status) {
    await getSupabase()
      .from("applications")
      .update({ status })
      .eq("id", appId);
    setApplications((prev) =>
      prev.map((a) => a.id === appId ? { ...a, status } : a)
    );
  }

  const filtered = selectedJob === "all"
    ? applications
    : applications.filter((a) => a.job_id === selectedJob);

  const pending = filtered.filter((a) => a.status === "pending");
  const reviewed = filtered.filter((a) => a.status !== "pending");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
        <p className="text-gray-500 text-sm mt-1">Review and respond to teen applications</p>
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Total</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">
            {applications.filter((a) => a.status === "pending").length}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Pending</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-500">
            {applications.filter((a) => a.status === "accepted").length}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Accepted</p>
        </div>
      </div>

      {/* job filter */}
      {jobs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedJob("all")}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition ${
              selectedJob === "all"
                ? "bg-black text-[#C8FF00] border-black"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            All jobs
          </button>
          {jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedJob(job.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition ${
                selectedJob === job.id
                  ? "bg-black text-[#C8FF00] border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {job.title}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-4xl">📬</span>
          <p className="text-gray-500 text-sm font-medium">No applicants yet</p>
          <p className="text-gray-400 text-xs">Applications will appear here in real time</p>
        </div>
      )}

      {pending.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
            New — {pending.length} pending
          </p>
          {pending.map((app) => (
            <ApplicantCard key={app.id} app={app} onUpdate={updateStatus} />
          ))}
        </div>
      )}

      {reviewed.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Reviewed</p>
          <div className="opacity-70">
            {reviewed.map((app) => (
              <ApplicantCard key={app.id} app={app} onUpdate={updateStatus} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ApplicantCard({ app, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const teen = app.profiles;

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* header */}
      <div
        className="p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black text-[#C8FF00] flex items-center justify-center text-sm font-bold shrink-0">
            {teen?.full_name?.[0]?.toUpperCase() ?? "T"}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{teen?.full_name ?? "Teen"}</p>
            <p className="text-xs text-gray-400">
              Applied for {app.jobs?.title} ·{" "}
              {new Date(app.created_at).toLocaleDateString("en-US", {
                month: "short", day: "numeric"
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {app.status === "pending" && (
            <span className="text-xs font-semibold bg-yellow-50 text-yellow-600 border border-yellow-200 px-2 py-1 rounded-full">
              ⏳ Pending
            </span>
          )}
          {app.status === "accepted" && (
            <span className="text-xs font-semibold bg-green-50 text-green-600 border border-green-200 px-2 py-1 rounded-full">
              ✅ Accepted
            </span>
          )}
          {app.status === "rejected" && (
            <span className="text-xs font-semibold bg-red-50 text-red-400 border border-red-200 px-2 py-1 rounded-full">
              ❌ Rejected
            </span>
          )}
          <span className="text-gray-400 text-xs">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 p-5 flex flex-col gap-4">

          {/* teen info */}
          <div className="flex flex-wrap gap-4">
            {teen?.age && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Age</p>
                <p className="text-sm font-medium text-gray-900">{teen.age}</p>
              </div>
            )}
            {teen?.availability && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Availability</p>
                <p className="text-sm font-medium text-gray-900">{teen.availability}</p>
              </div>
            )}
          </div>

          {teen?.bio && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Bio</p>
              <p className="text-sm text-gray-600">{teen.bio}</p>
            </div>
          )}

          {teen?.skills?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {teen.skills.map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-black text-[#C8FF00] text-xs font-semibold rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {app.message && (
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 mb-1 font-medium">Their message</p>
              <p className="text-sm text-gray-600">{app.message}</p>
            </div>
          )}

          {/* action buttons */}
          {app.status === "pending" && (
            <div className="flex gap-3">
              <button
                onClick={() => onUpdate(app.id, "rejected")}
                className="flex-1 border border-red-200 text-red-500 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition"
              >
                Decline
              </button>
              <button
                onClick={() => onUpdate(app.id, "accepted")}
                className="flex-1 bg-black text-[#C8FF00] py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition"
              >
                Accept
              </button>
            </div>
          )}

          {app.status !== "pending" && (
            <button
              onClick={() => onUpdate(app.id, "pending")}
              className="text-xs text-gray-400 hover:text-gray-600 transition underline text-left"
            >
              Undo decision
            </button>
          )}
        </div>
      )}
    </div>
  );
}