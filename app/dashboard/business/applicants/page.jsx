"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

// ─── Icons ───────────────────────────────────────────────────────────────────
const InboxIcon = ({ size = 40 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ClockIcon = ({ size = 12 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

export default function BusinessApplicants() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    let channel;
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) return;

      const { data: jobsData } = await getSupabase()
        .from("jobs")
        .select("id, title")
        .eq("employer_id", user.id)
        .eq("listing_type", "business")
        .order("created_at", { ascending: false });
      setJobs(jobsData ?? []);

      const { data: appsData } = await getSupabase()
        .from("applications")
        .select(`
          *,
          jobs ( title, pay, pay_type, location, category, schedule, interview_required, job_type ),
          profiles!teen_id ( full_name, age, bio, skills, availability )
        `)
        .eq("employer_id", user.id)
        .order("created_at", { ascending: false });

      const businessJobIds = (jobsData ?? []).map((j) => j.id);
      const filtered = (appsData ?? []).filter((a) => businessJobIds.includes(a.job_id));
      setApplications(filtered);
      setLoading(false);

      channel = getSupabase()
        .channel("business-applicants")
        .on("postgres_changes",
          { event: "INSERT", schema: "public", table: "applications", filter: `employer_id=eq.${user.id}` },
          async (payload) => {
            if (!businessJobIds.includes(payload.new.job_id)) return;
            const { data } = await getSupabase()
              .from("applications")
              .select(`*, jobs ( title, pay, pay_type, location, category, schedule, interview_required, job_type ), profiles!teen_id ( full_name, age, bio, skills, availability )`)
              .eq("id", payload.new.id)
              .single();
            if (data) setApplications((prev) => [data, ...prev]);
          }
        )
        .subscribe();
    }
    load();
    return () => { if (channel) getSupabase().removeChannel(channel); };
  }, []);

  async function updateStatus(appId, status) {
    if (updating) return;
    setUpdating(appId);

    const { error } = await getSupabase()
      .from("applications").update({ status }).eq("id", appId);

    setUpdating(null);
    if (error) { console.error("Status update failed:", error); return; }

    setApplications((prev) =>
      prev.map((a) => a.id === appId ? { ...a, status } : a)
    );

    // Fire-and-forget email notification
    if (status === "accepted" || status === "rejected") {
      try {
        const app = applications.find((a) => a.id === appId);
        if (!app) return;

        const [{ data: teenAuth }, { data: employerProfile }] = await Promise.all([
          getSupabase().rpc("get_user_email", { user_id: app.teen_id }).single(),
          getSupabase().from("profiles").select("full_name, business_name")
            .eq("id", app.employer_id).single(),
        ]);

        if (teenAuth?.email) {
          await fetch("/api/notify/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              teenEmail: teenAuth.email,
              teenName: app.profiles?.full_name ?? "there",
              jobTitle: app.jobs?.title,
              status,
              employerName: employerProfile?.business_name ?? employerProfile?.full_name ?? "Your employer",
            }),
          });
        }
      } catch (err) {
        console.error("Notify failed:", err);
      }
    }
  }

  const filtered = selectedJob === "all"
    ? applications
    : applications.filter((a) => a.job_id === selectedJob);

  const pending  = filtered.filter((a) => a.status === "pending");
  const reviewed = filtered.filter((a) => a.status !== "pending");

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
        <p className="text-gray-500 text-sm mt-1">Review applications for your business listings</p>
      </div>

      {/* Stats */}
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

      {/* Job filter pills */}
      {jobs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setSelectedJob("all")}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition ${
              selectedJob === "all"
                ? "bg-black text-[#C8FF00] border-black"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}>
            All jobs
          </button>
          {jobs.map((job) => (
            <button key={job.id} onClick={() => setSelectedJob(job.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition ${
                selectedJob === job.id
                  ? "bg-black text-[#C8FF00] border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}>
              {job.title}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center py-16 gap-3 text-gray-300">
          <InboxIcon />
          <p className="text-gray-500 text-sm font-medium">No applicants yet</p>
          <p className="text-gray-400 text-xs">Applications will appear here in real time</p>
        </div>
      )}

      {pending.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            New — {pending.length} pending
          </p>
          {pending.map((app) => (
            <ApplicantCard key={app.id} app={app} onUpdate={updateStatus} updating={updating === app.id} />
          ))}
        </div>
      )}

      {reviewed.length > 0 && (
        <div className="flex flex-col gap-3 opacity-70">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Reviewed</p>
          {reviewed.map((app) => (
            <ApplicantCard key={app.id} app={app} onUpdate={updateStatus} updating={updating === app.id} />
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicantCard({ app, onUpdate, updating }) {
  const [expanded, setExpanded] = useState(false);
  const teen = app.profiles;

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div
        className="p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black text-[#C8FF00] flex items-center justify-center text-sm font-bold shrink-0">
            {teen?.full_name?.[0]?.toUpperCase() ?? "T"}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{teen?.full_name ?? "Applicant"}</p>
            <p className="text-xs text-gray-400">
              {app.jobs?.title} · {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {app.status === "pending" && (
            <span className="flex items-center gap-1 text-xs font-semibold bg-yellow-50 text-yellow-600 border border-yellow-200 px-2 py-1 rounded-full">
              <ClockIcon /> Pending
            </span>
          )}
          {app.status === "accepted" && (
            <span className="text-xs font-semibold bg-green-50 text-green-600 border border-green-200 px-2 py-1 rounded-full">
              Accepted
            </span>
          )}
          {app.status === "rejected" && (
            <span className="text-xs font-semibold bg-red-50 text-red-400 border border-red-200 px-2 py-1 rounded-full">
              Declined
            </span>
          )}
          <span className="text-gray-300">
            {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-5 flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            {teen?.age && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Age</p>
                <p className="text-sm font-medium">{teen.age}</p>
              </div>
            )}
            {teen?.availability && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Availability</p>
                <p className="text-sm font-medium">{teen.availability}</p>
              </div>
            )}
            {app.jobs?.schedule && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Required schedule</p>
                <p className="text-sm font-medium">{app.jobs.schedule}</p>
              </div>
            )}
            {app.jobs?.interview_required && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Interview</p>
                <p className="text-sm font-medium text-orange-600">Required</p>
              </div>
            )}
          </div>

          {teen?.bio && (
            <div>
              <p className="text-xs text-gray-400 mb-1">About</p>
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

          {app.status === "pending" && (
            <div className="flex gap-3">
              <button
                onClick={() => onUpdate(app.id, "rejected")}
                disabled={updating}
                className="flex-1 border border-red-200 text-red-500 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition disabled:opacity-50"
              >
                {updating ? "Saving..." : "Decline"}
              </button>
              <button
                onClick={() => onUpdate(app.id, "accepted")}
                disabled={updating}
                className="flex-1 bg-black text-[#C8FF00] py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updating ? "Saving..." : (<><CheckIcon /> Accept</>)}
              </button>
            </div>
          )}

          {app.status !== "pending" && (
            <button
              onClick={() => onUpdate(app.id, "pending")}
              disabled={updating}
              className="text-xs text-gray-400 hover:text-gray-600 transition underline text-left disabled:opacity-50"
            >
              Undo decision
            </button>
          )}
        </div>
      )}
    </div>
  );
}