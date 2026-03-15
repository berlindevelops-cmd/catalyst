"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"teen" | "employer" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!email || !role) {
      setError("Pick a role and enter your email.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: sbError } = await supabase
      .from("waitlist_emails")
      .insert({ email, role });
    setLoading(false);
    if (sbError) {
      setError(sbError.code === "23505" ? "You're already on the list!" : "Something went wrong.");
    } else {
      setSubmitted(true);
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* NAV */}
      <nav className="sticky top-0 z-50 w-full px-5 py-4 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <span className="text-xl font-bold tracking-tight text-gray-900">
          catalyst
        </span>
        <a href="#waitlist" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition">
          Get early access
        </a>
      </nav>

      {/* HERO */}
      <section
        id="waitlist"
        className="flex-1 flex flex-col items-center justify-center text-center px-5 py-20 md:py-32"
      >
        {/* pill badge */}
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Launching in Plymouth, IN — March 2026
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight max-w-2xl">
          The local job board{" "}
          <span className="relative inline-block">
            <span className="relative z-10 bg-black text-white px-2 rounded-lg">
              built for teens
            </span>
          </span>
        </h1>

        <p className="mt-5 text-base md:text-lg text-gray-500 max-w-md">
          Skip the fast food grind. Find babysitting, lawn care, tutoring gigs
          — on your schedule, in your town.
        </p>

        {/* CTA */}
        {submitted ? (
          <div className="mt-10 bg-black text-white px-8 py-4 rounded-2xl text-base font-medium">
            🎉 You're on the list — we'll be in touch!
          </div>
        ) : (
          <div className="mt-10 w-full max-w-sm flex flex-col gap-3">
            {/* role toggle */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200 text-sm font-medium">
              <button
                onClick={() => setRole("teen")}
                className={`flex-1 py-2.5 transition ${
                  role === "teen"
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                I'm a teen 👋
              </button>
              <button
                onClick={() => setRole("employer")}
                className={`flex-1 py-2.5 transition ${
                  role === "employer"
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                I'm hiring 🏠
              </button>
            </div>

            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition"
            />

            {error && <p className="text-xs text-red-500 text-left">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Joining..." : "Get early access →"}
            </button>

            <p className="text-xs text-gray-400">
              Free to join. No spam. Ever.
            </p>
          </div>
        )}

        {/* social proof numbers */}
        <div className="mt-14 flex gap-8 text-center">
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold text-gray-900">530+</span>
            <span className="text-xs text-gray-400">teens in Plymouth</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold text-gray-900">350+</span>
            <span className="text-xs text-gray-400">local households</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold text-gray-900">$0</span>
            <span className="text-xs text-gray-400">to get started</span>
          </div>
        </div>
      </section>
    </main>
  );
}