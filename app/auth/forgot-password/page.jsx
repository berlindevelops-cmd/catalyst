"use client";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!email) { setError("Please enter your email."); return; }
    setLoading(true);
    setError("");

    const { error: sbError } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setLoading(false);
    if (sbError) { setError(sbError.message); return; }
    setSent(true);
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <nav className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <a href="/" className="text-xl font-bold tracking-tight text-gray-900">
          catalyst<span className="text-[#C8FF00]">.</span>
        </a>
        <a href="/auth/login" className="text-sm text-gray-500 hover:text-gray-900 transition">
          Back to <span className="font-semibold text-black">login</span>
        </a>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm flex flex-col gap-6">
          {sent ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="text-5xl">📬</span>
              <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
              <p className="text-gray-500 text-sm">
                We sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>.
                Click the link in the email to reset your password.
              </p>
              <p className="text-xs text-gray-400">
                Didn't get it? Check your spam folder or{" "}
                <button onClick={() => setSent(false)} className="underline hover:text-gray-600">
                  try again
                </button>
              </p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <span className="text-4xl">🔑</span>
                <h1 className="text-2xl font-bold text-gray-900 mt-3">Forgot password?</h1>
                <p className="text-gray-500 text-sm mt-1">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-black text-[#C8FF00] py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}