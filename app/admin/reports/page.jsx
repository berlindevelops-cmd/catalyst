"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// replace with your own user ID from Supabase
const ADMIN_IDS = ["your-user-id-here"];

export default function AdminReports() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user || !ADMIN_IDS.includes(user.id)) {
        router.replace("/");
        return;
      }

      const { data } = await getSupabase()
        .from("reports")
        .select(`
          *,
          reporter:profiles!reporter_id ( full_name ),
          reported_user:profiles!reported_user_id ( full_name ),
          job:jobs!reported_job_id ( title, location )
        `)
        .order("created_at", { ascending: false });

      setReports(data ?? []);
      setLoading(false);

      // real-time
      const channel = getSupabase()
        .channel("admin-reports")
        .on("postgres_changes",
          { event: "INSERT", schema: "public", table: "reports" },
          (payload) => setReports((prev) => [payload.new, ...prev])
        )
        .subscribe();

      return () => getSupabase().removeChannel(channel);
    }
    load();
  }, []);

  async function updateStatus(reportId, status) {
    await getSupabase().from("reports").update({ status }).eq("id", reportId);
    setReports((prev) => prev.map((r) => r.id === reportId ? { ...r, status } : r));
  }

  const filtered = reports.filter((r) => filter === "all" ? true : r.status === filter);

  const statusColors = {
    pending: "bg-yellow-50 text-yellow-600 border-yellow-200",
    reviewed: "bg-blue-50 text-blue-600 border-blue-200",
    resolved: "bg-green-50 text-green-600 border-green-200",
    dismissed: "bg-gray-100 text-gray-400 border-gray-200",
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-black px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-lg font-bold text-white">
            catalyst<span className="text-[#C8FF00]">.</span>
          </a>
          <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <p className="text-gray-400 text-sm">{reports.filter((r) => r.status === "pending").length} pending</p>
      </nav>

      <div className="max-w-4xl mx-auto px-5 py-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Review and action user reports</p>
        </div>

        {/* filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["pending", "reviewed", "resolved", "dismissed", "all"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition capitalize ${
                filter === s
                  ? "bg-black text-[#C8FF00] border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {s} {s !== "all" && `(${reports.filter((r) => r.status === s).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">✅</span>
            <p className="text-gray-500 text-sm font-medium">No {filter} reports</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {filtered.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                      report.type === "job" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-orange-50 text-orange-600 border-orange-200"
                    }`}>
                      {report.type === "job" ? "📋 Job" : "👤 User"}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColors[report.status]}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {report.type === "job"
                      ? report.job?.title ?? "Deleted job"
                      : report.reported_user?.full_name ?? "Deleted user"}
                  </p>
                  {report.type === "job" && report.job?.location && (
                    <p className="text-xs text-gray-400">📍 {report.job.location}</p>
                  )}
                </div>
                <p className="text-xs text-gray-400 shrink-0">
                  {new Date(report.created_at).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                  })}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400">Reported by</p>
                  <p className="text-xs font-medium text-gray-700">
                    {report.reporter?.full_name ?? "Unknown"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400">Reason</p>
                  <p className="text-xs font-semibold text-gray-900">{report.reason}</p>
                </div>
                {report.details && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Details</p>
                    <p className="text-xs text-gray-600">{report.details}</p>
                  </div>
                )}
              </div>

              {report.status === "pending" && (
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => updateStatus(report.id, "reviewed")}
                    className="text-xs font-medium border border-blue-200 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition">
                    Mark reviewed
                  </button>
                  <button onClick={() => updateStatus(report.id, "resolved")}
                    className="text-xs font-medium border border-green-200 text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition">
                    Resolve
                  </button>
                  <button onClick={() => updateStatus(report.id, "dismissed")}
                    className="text-xs font-medium border border-gray-200 text-gray-500 px-3 py-2 rounded-lg hover:bg-gray-50 transition">
                    Dismiss
                  </button>
                </div>
              )}

              {report.status !== "pending" && (
                <button onClick={() => updateStatus(report.id, "pending")}
                  className="text-xs text-gray-400 hover:text-gray-600 transition underline text-left">
                  Reopen
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}