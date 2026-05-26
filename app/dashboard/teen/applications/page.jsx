"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

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

const DocumentTextIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
  </svg>
);

// ─── Application Card ─────────────────────────────────────────────────────────
function ApplicationCard({ app }) {
  const statusConfig = {
    pending: {
      styles: "bg-yellow-50 text-yellow-600 border-yellow-200",
      label: "Pending",
      dot: "bg-yellow-400",
    },
    accepted: {
      styles: "bg-green-50 text-green-600 border-green-200",
      label: "Accepted",
      dot: "bg-green-500",
    },
    rejected: {
      styles: "bg-red-50 text-red-400 border-red-200",
      label: "Rejected",
      dot: "bg-red-400",
    },
  };

  const config = statusConfig[app.status] ?? statusConfig.pending;

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 leading-tight">{app.jobs?.title}</h3>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <MapPinIcon />
              {app.jobs?.location}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-gray-700">
              <CurrencyDollarIcon />
              {app.jobs?.pay}/{app.jobs?.pay_type === "hourly" ? "hr" : "job"}
            </span>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {app.jobs?.category}
            </span>
          </div>
        </div>
        <span className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${config.styles}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>
      </div>

      {app.message && (
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Your message</p>
          <p className="text-sm text-gray-600">{app.message}</p>
        </div>
      )}

      <p className="text-xs text-gray-400">
        Applied {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TeenApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel;
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) return;

      const { data } = await getSupabase()
        .from("applications")
        .select(`*, jobs (title, pay, pay_type, location, category, urgent)`)
        .eq("teen_id", user.id)
        .order("created_at", { ascending: false });

      setApplications(data ?? []);
      setLoading(false);

      // Real-time updates when employer accepts/rejects
      channel = getSupabase()
        .channel("teen-applications")
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "applications", filter: `teen_id=eq.${user.id}` },
          (payload) => {
            setApplications((prev) =>
              prev.map((a) => a.id === payload.new.id ? { ...a, ...payload.new } : a)
            );
          }
        )
        .subscribe();

      return () => getSupabase().removeChannel(channel);
    }
    load();
    return () => { if (channel) getSupabase().removeChannel(channel); };
  }, []);

  const pending = applications.filter((a) => a.status === "pending");
  const accepted = applications.filter((a) => a.status === "accepted");
  const rejected = applications.filter((a) => a.status === "rejected");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0 max-w-xl mx-auto">

      {/* Header — matches dashboard welcome banner */}
      <div className="w-full bg-black rounded-2xl px-6 py-7 flex items-center justify-between gap-4">
        <div>
          <p className="text-[#C8FF00] text-xs font-semibold uppercase tracking-widest mb-1">Your applications</p>
          <h1 className="text-2xl font-bold text-white">Track your gigs</h1>
          <p className="text-gray-400 text-sm mt-1">Stay on top of every job you applied to</p>
        </div>
        <div className="bg-white/10 rounded-xl px-5 py-3 text-center shrink-0">
          <p className="text-white text-xl font-bold">{applications.length}</p>
          <p className="text-gray-400 text-xs mt-0.5">Total</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{pending.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Pending</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{accepted.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Accepted</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{rejected.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Rejected</p>
        </div>
      </div>

      {/* Empty state */}
      {applications.length === 0 && (
        <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <DocumentTextIcon size={20} />
          </div>
          <p className="text-gray-600 text-sm font-medium">No applications yet</p>
          <p className="text-gray-400 text-xs">Browse jobs and hit Apply to get started</p>
          <a
            href="/dashboard/teen"
            className="mt-2 bg-black text-[#C8FF00] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition"
          >
            Browse jobs
          </a>
        </div>
      )}

      {/* Accepted */}
      {accepted.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Accepted · {accepted.length}
          </p>
          {accepted.map((app) => <ApplicationCard key={app.id} app={app} />)}
        </div>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Pending · {pending.length}
          </p>
          {pending.map((app) => <ApplicationCard key={app.id} app={app} />)}
        </div>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <div className="flex flex-col gap-3 opacity-60">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Rejected · {rejected.length}
          </p>
          {rejected.map((app) => <ApplicationCard key={app.id} app={app} />)}
        </div>
      )}

    </div>
  );
}