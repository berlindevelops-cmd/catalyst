"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

// ─── Icons ────────────────────────────────────────────────────────────────────
const CheckCircleIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronDownIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const ChevronUpIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>
);

const InboxIcon = ({ size = 22 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
  </svg>
);

const ArrowUturnLeftIcon = ({ size = 12 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
  </svg>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const configs = {
    pending:  { styles: "bg-yellow-50 text-yellow-600 border-yellow-200", Icon: ClockIcon,       label: "Pending"  },
    accepted: { styles: "bg-green-50 text-green-600 border-green-200",    Icon: CheckCircleIcon, label: "Accepted" },
    rejected: { styles: "bg-red-50 text-red-400 border-red-200",          Icon: XCircleIcon,     label: "Declined" },
  };
  const { styles, Icon, label } = configs[status] ?? configs.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${styles}`}>
      <Icon size={12} />
      {label}
    </span>
  );
}

// ─── Applicant Card ───────────────────────────────────────────────────────────
function ApplicantCard({ app, onUpdate, updating }) {
  const [expanded, setExpanded] = useState(false);
  const teen = app.profiles;

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header row */}
      <div
        className="p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50 transition select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-black text-[#C8FF00] flex items-center justify-center text-sm font-bold shrink-0">
            {teen?.full_name?.[0]?.toUpperCase() ?? "T"}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{teen?.full_name ?? "Applicant"}</p>
            <p className="text-xs text-gray-400">
              {app.jobs?.title} &middot;{" "}
              {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={app.status} />
          <span className="text-gray-400">
            {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </span>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 p-5 flex flex-col gap-4">

          {/* Teen info grid */}
          {(teen?.age || teen?.availability) && (
            <div className="flex flex-wrap gap-6">
              {teen?.age && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5 uppercase tracking-widest">Age</p>
                  <p className="text-sm font-medium text-gray-900">{teen.age}</p>
                </div>
              )}
              {teen?.availability && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5 uppercase tracking-widest">Availability</p>
                  <p className="text-sm font-medium text-gray-900">{teen.availability}</p>
                </div>
              )}
            </div>
          )}

          {teen?.bio && (
            <div>
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-widest">About</p>
              <p className="text-sm text-gray-600 leading-relaxed">{teen.bio}</p>
            </div>
          )}

          {teen?.skills?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {teen.skills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 bg-black text-[#C8FF00] text-xs font-semibold rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {app.message && (
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-widest">Their message</p>
              <p className="text-sm text-gray-600 leading-relaxed">{app.message}</p>
            </div>
          )}

          {/* Actions */}
          {app.status === "pending" && (
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => onUpdate(app.id, "rejected")}
                disabled={updating}
                className="flex-1 inline-flex items-center justify-center gap-1.5 border border-red-200 text-red-500 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition disabled:opacity-50"
              >
                <XCircleIcon size={15} />
                {updating ? "Saving..." : "Decline"}
              </button>
              <button
                onClick={() => onUpdate(app.id, "accepted")}
                disabled={updating}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-black text-[#C8FF00] py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50"
              >
                <CheckCircleIcon size={15} />
                {updating ? "Saving..." : "Accept"}
              </button>
            </div>
          )}

          {app.status !== "pending" && (
            <button
              onClick={() => onUpdate(app.id, "pending")}
              disabled={updating}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition disabled:opacity-50 self-start"
            >
              <ArrowUturnLeftIcon />
              Undo decision
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployerApplicants() {
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

      const [{ data: jobsData }, { data: appsData }] = await Promise.all([
        getSupabase().from("jobs").select("id, title")
          .eq("employer_id", user.id).order("created_at", { ascending: false }),
        getSupabase().from("applications").select(`
          *,
          jobs ( title, pay, pay_type, location, category ),
          profiles!teen_id ( full_name, age, bio, skills, availability )
        `).eq("employer_id", user.id).order("created_at", { ascending: false }),
      ]);

      setJobs(jobsData ?? []);
      setApplications(appsData ?? []);
      setLoading(false);

      channel = getSupabase()
        .channel("employer-applicants")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "applications", filter: `employer_id=eq.${user.id}` },
          async (payload) => {
            const { data } = await getSupabase()
              .from("applications")
              .select(`*, jobs ( title, pay, pay_type, location, category ), profiles!teen_id ( full_name, age, bio, skills, availability )`)
              .eq("id", payload.new.id).single();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
        <p className="text-gray-500 text-sm mt-1">Review and respond to applications</p>
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

      {/* Job filter */}
      {jobs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
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

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <InboxIcon />
          </div>
          <p className="text-gray-600 text-sm font-medium">No applicants yet</p>
          <p className="text-gray-400 text-xs">Applications will appear here in real time</p>
        </div>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Needs review · {pending.length}
          </p>
          {pending.map((app) => (
            <ApplicantCard
              key={app.id}
              app={app}
              onUpdate={updateStatus}
              updating={updating === app.id}
            />
          ))}
        </div>
      )}

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div className="flex flex-col gap-3 opacity-70">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Reviewed · {reviewed.length}
          </p>
          {reviewed.map((app) => (
            <ApplicantCard
              key={app.id}
              app={app}
              onUpdate={updateStatus}
              updating={updating === app.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}