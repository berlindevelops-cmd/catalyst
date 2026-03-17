"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function TeenApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) return;

      const { data } = await getSupabase()
        .from("applications")
        .select(`
          *,
          jobs (
            title,
            pay,
            pay_type,
            location,
            category,
            urgent
          )
        `)
        .eq("teen_id", user.id)
        .order("created_at", { ascending: false });

      setApplications(data ?? []);
      setLoading(false);

      // real-time updates when employer accepts/rejects
      const channel = getSupabase()
        .channel("teen-applications")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "applications",
            filter: `teen_id=eq.${user.id}`,
          },
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
    <div className="flex flex-col gap-6 pb-24 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-500 text-sm mt-1">Track the status of every job you applied to</p>
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{pending.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Pending</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-[#22c55e]">{accepted.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Accepted</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{rejected.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Rejected</p>
        </div>
      </div>

      {applications.length === 0 && (
        <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-4xl">📬</span>
          <p className="text-gray-500 text-sm font-medium">No applications yet</p>
          <p className="text-gray-400 text-xs">Browse jobs and hit Apply to get started</p>
          <a
            href="/dashboard/teen"
            className="mt-2 bg-black text-[#C8FF00] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition"
          >
            Browse jobs
          </a>
        </div>
      )}

      {accepted.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Accepted</p>
          {accepted.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}

      {pending.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Pending</p>
          {pending.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}

      {rejected.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest opacity-60">Rejected</p>
          <div className="opacity-60">
            {rejected.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ApplicationCard({ app }) {
  const statusStyles = {
    pending: "bg-yellow-50 text-yellow-600 border-yellow-200",
    accepted: "bg-green-50 text-green-600 border-green-200",
    rejected: "bg-red-50 text-red-400 border-red-200",
  };

  const statusLabels = {
    pending: "⏳ Pending",
    accepted: "✅ Accepted",
    rejected: "❌ Rejected",
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-gray-900">{app.jobs?.title}</h3>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-gray-400">📍 {app.jobs?.location}</span>
            <span className="text-xs font-semibold text-gray-700">
              ${app.jobs?.pay}/{app.jobs?.pay_type === "hourly" ? "hr" : "job"}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {app.jobs?.category}
            </span>
          </div>
        </div>
        <span className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border ${statusStyles[app.status]}`}>
          {statusLabels[app.status]}
        </span>
      </div>
      {app.message && (
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-xs text-gray-400 mb-1 font-medium">Your message</p>
          <p className="text-sm text-gray-600">{app.message}</p>
        </div>
      )}
      <p className="text-xs text-gray-400">
        Applied {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
    </div>
  );
}