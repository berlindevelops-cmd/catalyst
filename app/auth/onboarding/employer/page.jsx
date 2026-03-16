"use client";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function EmployerOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [employerType, setEmployerType] = useState(null);
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) { setError("Not logged in."); setLoading(false); return; }

    const { error: sbError } = await getSupabase().from("profiles").upsert({
      id: user.id,
      role: "employer",
      full_name: fullName,
      employer_type: employerType,
      business_name: employerType === "business" ? businessName : null,
      location,
    });

    if (sbError) { setError(sbError.message); setLoading(false); return; }

    // wait until profile is confirmed written before redirecting
    let retries = 0;
    while (retries < 10) {
      const { data: check } = await getSupabase()
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();
      if (check?.id) {
        router.push("/dashboard/employer");
        return;
      }
      await new Promise((res) => setTimeout(res, 400));
      retries++;
    }
    // fallback if retries exhausted
    router.push("/dashboard/employer");
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <nav className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <a href="/" className="text-xl font-bold tracking-tight text-gray-900">
          catalyst<span className="text-[#C8FF00]">.</span>
        </a>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-medium">Step {step} of 2</span>
          <button
            onClick={() => router.push("/dashboard/employer")}
            className="text-xs text-gray-400 hover:text-gray-600 transition underline"
          >
            Skip for now
          </button>
        </div>
      </nav>

      <div className="w-full h-1 bg-gray-100">
        <div
          className="h-1 bg-[#C8FF00] transition-all duration-300"
          style={{ width: `${(step / 2) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-16">
        <div className="w-full max-w-md flex flex-col gap-6">

          {step === 1 && (
            <>
              <div className="text-center">
                <span className="text-4xl">🏠</span>
                <h1 className="text-2xl font-bold text-gray-900 mt-3">Who are you?</h1>
                <p className="text-gray-500 text-sm mt-1">This helps us tailor your experience</p>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setEmployerType("parent")}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition text-left ${
                    employerType === "parent"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <span className="text-3xl">👨‍👩‍👧</span>
                  <div>
                    <p className="font-semibold">Parent or household</p>
                    <p className={`text-sm mt-0.5 ${employerType === "parent" ? "text-gray-300" : "text-gray-400"}`}>
                      Need help around the house, childcare, or yard work
                    </p>
                  </div>
                  {employerType === "parent" && <span className="ml-auto text-[#C8FF00] text-xl">✓</span>}
                </button>
                <button
                  onClick={() => setEmployerType("business")}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition text-left ${
                    employerType === "business"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <span className="text-3xl">💼</span>
                  <div>
                    <p className="font-semibold">Local business</p>
                    <p className={`text-sm mt-0.5 ${employerType === "business" ? "text-gray-300" : "text-gray-400"}`}>
                      Hiring part-time or seasonal teen workers
                    </p>
                  </div>
                  {employerType === "business" && <span className="ml-auto text-[#C8FF00] text-xl">✓</span>}
                </button>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                onClick={() => { if (!employerType) { setError("Please select one."); return; } setError(""); setStep(2); }}
                className="w-full bg-black text-[#C8FF00] py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition"
              >
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-center">
                <span className="text-4xl">{employerType === "business" ? "💼" : "👋"}</span>
                <h1 className="text-2xl font-bold text-gray-900 mt-3">
                  {employerType === "business" ? "Your business" : "About you"}
                </h1>
                <p className="text-gray-500 text-sm mt-1">Almost done — just a few details</p>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1.5 block">Your name</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
                  />
                </div>
                {employerType === "business" && (
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1.5 block">Business name</label>
                    <input
                      type="text"
                      placeholder="Your business name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1.5 block">Town / City</label>
                  <input
                    type="text"
                    placeholder="e.g. Plymouth, IN"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
                  />
                </div>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                  Back
                </button>
                <button
                  onClick={() => { if (!fullName || !location) { setError("Please fill in all fields."); return; } setError(""); handleSubmit(); }}
                  disabled={loading}
                  className="flex-1 bg-black text-[#C8FF00] py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Finish"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}