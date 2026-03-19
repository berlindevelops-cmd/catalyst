"use client";
import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase sets the session automatically when the user
    // lands here from the reset email link
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setReady(true);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  async function handleReset() {
    if (!password || !confirm) { setError("Please fill in both fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }

    setLoading(true);
    setError("");

    const { error: sbError } = await getSupabase().auth.updateUser({ password });

    setLoading(false);
    if (sbError) { setError(sbError.message); return; }

    // get role and redirect to correct dashboard
    const { data: { user } } = await getSupabase().auth.getUser();
    const { data: profile } = await getSupabase()
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;
    if (role === "teen") router.replace("/dashboard/teen");
    else if (role === "business") router.replace("/dashboard/business");
    else router.replace("/dashboard/employer");
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <nav className="w-full px-5 py-4 flex items-center border-b border-gray-100">
          <a href="/" className="text-xl font-bold tracking-tight text-gray-900">
            catalyst<span className="text-[#C8FF00]">.</span>
          </a>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-5">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Verifying your reset link...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <nav className="w-full px-5 py-4 flex items-center border-b border-gray-100">
        <a href="/" className="text-xl font-bold tracking-tight text-gray-900">
          catalyst<span className="text-[#C8FF00]">.</span>
        </a>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <div className="text-center">
            <span className="text-4xl">🔒</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-3">Set new password</h1>
            <p className="text-gray-500 text-sm mt-1">Choose a strong password for your account</p>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">New password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">Confirm password</label>
              <input
                type="password"
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReset()}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-black text-[#C8FF00] py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </div>
      </div>
    </main>
  );
}