"use client";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

const JOB_REASONS = [
  "Inappropriate content",
  "Scam or fraudulent listing",
  "Illegal job offer",
  "Misleading pay or description",
  "Spam",
  "Other",
];

const USER_REASONS = [
  "Inappropriate behavior",
  "Harassment",
  "Fake profile",
  "Scam attempt",
  "Unsafe or threatening",
  "Other",
];

export default function ReportModal({ type, jobId, userId, jobTitle, userName, onClose }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const reasons = type === "job" ? JOB_REASONS : USER_REASONS;

  async function handleSubmit() {
    if (!reason) { setError("Please select a reason."); return; }
    setLoading(true);
    setError("");

    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) { setError("Not logged in."); setLoading(false); return; }

    const { error: sbError } = await getSupabase().from("reports").insert({
      reporter_id: user.id,
      reported_user_id: userId ?? null,
      reported_job_id: jobId ?? null,
      type,
      reason,
      details: details.trim() || null,
      status: "pending",
    });

    setLoading(false);
    if (sbError) { setError(sbError.message); return; }
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden">

        {/* header */}
        <div className="bg-black px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[#C8FF00] text-xs font-bold uppercase tracking-widest">Report</p>
            <p className="text-white font-semibold text-sm mt-0.5">
              {type === "job" ? jobTitle : userName}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="text-4xl">✅</span>
              <p className="font-semibold text-gray-900">Report submitted</p>
              <p className="text-sm text-gray-500">
                Thanks for keeping Catalyst safe. We'll review this shortly.
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-black text-[#C8FF00] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Why are you reporting this {type}?
                </p>
                <div className="flex flex-col gap-2">
                  {reasons.map((r) => (
                    <button
                      key={r}
                      onClick={() => setReason(r)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition ${
                        reason === r
                          ? "border-black bg-black text-[#C8FF00] font-medium"
                          : "border-gray-200 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  Additional details <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  placeholder="Describe what happened..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition resize-none"
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit report"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}