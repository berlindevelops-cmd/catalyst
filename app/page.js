"use client";
import { useState, useEffect, useRef } from "react";
import { getSupabase } from "@/lib/supabase";

export default function Home() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [howItWorksTab, setHowItWorksTab] = useState("teen");

  // animated counters
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const statsRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCount(setCount1, 530, 1200);
          animateCount(setCount2, 350, 1200);
        }
      },
      { threshold: 0.5 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  function animateCount(setter, target, duration) {
    const steps = 40;
    const increment = target / steps;
    const interval = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setter(target);
        clearInterval(timer);
      } else {
        setter(Math.floor(current));
      }
    }, interval);
  }

  async function handleSubmit() {
    if (!email || !role) {
      setError("Pick a role and enter your email.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: sbError } = await getSupabase()
      .from("waitlist_emails")
      .insert({ email, role });
    setLoading(false);
    if (sbError) {
      setError(sbError.code === "23505" ? "You're already on the list!" : "Something went wrong.");
    } else {
      setSubmitted(true);
    }
  }

  const teenSteps = [
    { emoji: "👤", title: "Create your profile", desc: "Add your skills, availability, and a short bio. Takes less than 2 minutes." },
    { emoji: "🔍", title: "Browse local jobs", desc: "See gigs posted by families and businesses in your town. Filter by type, pay, and distance." },
    { emoji: "💸", title: "Get paid", desc: "Apply in one tap, show up, and earn. Build your reputation with reviews after every job." },
  ];

  const employerSteps = [
    { emoji: "📋", title: "Post a job", desc: "Describe what you need, set your pay, and go live in under 2 minutes. Free to start." },
    { emoji: "📬", title: "Receive applications", desc: "Browse profiles of vetted local teens with skills, reviews, and availability." },
    { emoji: "✅", title: "Hire with confidence", desc: "Message, hire, and pay securely through the platform. Leave a review when done." },
  ];

  const steps = howItWorksTab === "teen" ? teenSteps : employerSteps;

  const marqueeItems = [
    "Babysitting · $20/hr",
    "Lawn Care · $35/job",
    "Tutoring · $25/hr",
    "Pet Sitting · $18/hr",
    "Snow Removal · $40/job",
    "House Cleaning · $20/hr",
    "Grocery Help · $15/hr",
    "Moving Help · $18/hr",
    "Car Washing · $25/job",
    "Dog Walking · $15/hr",
  ];

  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* MARQUEE TICKER */}
      <div className="w-full bg-[#C8FF00] py-2 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-black text-xs font-semibold mx-6 shrink-0">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* NAV */}
      <nav className="sticky top-0 z-50 w-full px-5 py-4 flex items-center justify-between border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <span className="text-xl font-bold tracking-tight text-gray-900">
          catalyst<span className="text-[#C8FF00]">.</span>
        </span>
        <a
          href="/auth/signup"
          className="text-sm font-semibold bg-[#C8FF00] text-black px-4 py-2 rounded-full hover:bg-lime-300 transition"
        >
          Get early access
        </a>
      </nav>

      {/* HERO */}
      <section
        id="waitlist"
        className="flex-1 flex flex-col items-center justify-center text-center px-5 py-20 md:py-32"
      >
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-[#C8FF00] animate-pulse" />
          Launching in Plymouth, IN — March 2026
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight max-w-2xl">
          The local job board{" "}
          <span className="relative inline-block">
            <span className="relative z-10 bg-black text-[#C8FF00] px-2 rounded-lg">
              built for teens
            </span>
          </span>
        </h1>

        <p className="mt-5 text-base md:text-lg text-gray-500 max-w-md">
          Skip the fast food grind. Find babysitting, lawn care, tutoring gigs
          — on your schedule, in your town.
        </p>

        {submitted ? (
          <div className="mt-10 bg-black text-[#C8FF00] px-8 py-4 rounded-2xl text-base font-semibold">
            You are on the list — we will be in touch!
          </div>
        ) : (
          <div className="mt-10 w-full max-w-sm flex flex-col gap-3">
            <div className="flex rounded-xl overflow-hidden border border-gray-200 text-sm font-medium">
              <button
                onClick={() => setRole("teen")}
                className={`flex-1 py-2.5 transition ${
                  role === "teen"
                    ? "bg-black text-[#C8FF00]"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                I am a teen
              </button>
              <button
                onClick={() => setRole("employer")}
                className={`flex-1 py-2.5 transition ${
                  role === "employer"
                    ? "bg-black text-[#C8FF00]"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                I am hiring
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
              className="w-full bg-black text-[#C8FF00] py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50"
            >
              {loading ? "Joining..." : "Get early access"}
            </button>

            <p className="text-xs text-gray-400">Free to join. No spam. Ever.</p>
          </div>
        )}

        {/* animated counters */}
        <div ref={statsRef} className="mt-14 flex gap-8 text-center">
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold text-gray-900">{count1}+</span>
            <span className="text-xs text-gray-400">teens in Plymouth</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold text-gray-900">{count2}+</span>
            <span className="text-xs text-gray-400">local households</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold text-gray-900">$0</span>
            <span className="text-xs text-gray-400">to get started</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full px-5 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Up and running in minutes</h2>
          </div>

          <div className="flex justify-center mb-10">
            <div className="flex rounded-xl overflow-hidden border border-gray-200 text-sm font-medium">
              <button
                onClick={() => setHowItWorksTab("teen")}
                className={`px-6 py-2.5 transition ${
                  howItWorksTab === "teen"
                    ? "bg-black text-[#C8FF00]"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                For Teens
              </button>
              <button
                onClick={() => setHowItWorksTab("employer")}
                className={`px-6 py-2.5 transition ${
                  howItWorksTab === "employer"
                    ? "bg-black text-[#C8FF00]"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                For Employers
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps[0] && (
              <div className="flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="w-full h-40 bg-[#C8FF00]/20 flex items-center justify-center">
                  <span className="text-4xl">{steps[0].emoji}</span>
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-black text-[#C8FF00] text-xs flex items-center justify-center font-bold">1</span>
                    <h3 className="font-semibold text-gray-900">{steps[0].title}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{steps[0].desc}</p>
                </div>
              </div>
            )}
            {steps[1] && (
              <div className="flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="w-full h-40 bg-[#C8FF00]/20 flex items-center justify-center">
                  <span className="text-4xl">{steps[1].emoji}</span>
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-black text-[#C8FF00] text-xs flex items-center justify-center font-bold">2</span>
                    <h3 className="font-semibold text-gray-900">{steps[1].title}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{steps[1].desc}</p>
                </div>
              </div>
            )}
            {steps[2] && (
              <div className="flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="w-full h-40 bg-[#C8FF00]/20 flex items-center justify-center">
                  <span className="text-4xl">{steps[2].emoji}</span>
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-black text-[#C8FF00] text-xs flex items-center justify-center font-bold">3</span>
                    <h3 className="font-semibold text-gray-900">{steps[2].title}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{steps[2].desc}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WHAT YOU CAN FIND */}
      <section className="w-full px-5 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Gig types</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Work that fits your life</h2>
            <p className="mt-3 text-gray-500 text-base max-w-md mx-auto">
              Every gig is flexible, local, and pays way better than minimum wage.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-200 hover:border-black hover:bg-[#C8FF00]/10 transition">
              <span className="text-3xl">👶</span>
              <span className="font-semibold text-sm text-gray-900">Babysitting</span>
              <span className="text-xs text-gray-400">$15-25/hr</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-200 hover:border-black hover:bg-[#C8FF00]/10 transition">
              <span className="text-3xl">🌿</span>
              <span className="font-semibold text-sm text-gray-900">Lawn Care</span>
              <span className="text-xs text-gray-400">$20-40/job</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-200 hover:border-black hover:bg-[#C8FF00]/10 transition">
              <span className="text-3xl">📚</span>
              <span className="font-semibold text-sm text-gray-900">Tutoring</span>
              <span className="text-xs text-gray-400">$20-35/hr</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-200 hover:border-black hover:bg-[#C8FF00]/10 transition">
              <span className="text-3xl">🐶</span>
              <span className="font-semibold text-sm text-gray-900">Pet Sitting</span>
              <span className="text-xs text-gray-400">$15-25/hr</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-200 hover:border-black hover:bg-[#C8FF00]/10 transition">
              <span className="text-3xl">🛒</span>
              <span className="font-semibold text-sm text-gray-900">Grocery Help</span>
              <span className="text-xs text-gray-400">$12-18/hr</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-200 hover:border-black hover:bg-[#C8FF00]/10 transition">
              <span className="text-3xl">🧹</span>
              <span className="font-semibold text-sm text-gray-900">House Cleaning</span>
              <span className="text-xs text-gray-400">$15-25/hr</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-200 hover:border-black hover:bg-[#C8FF00]/10 transition">
              <span className="text-3xl">❄️</span>
              <span className="font-semibold text-sm text-gray-900">Snow Removal</span>
              <span className="text-xs text-gray-400">$25-50/job</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-200 hover:border-black hover:bg-[#C8FF00]/10 transition">
              <span className="text-3xl">📦</span>
              <span className="font-semibold text-sm text-gray-900">Moving Help</span>
              <span className="text-xs text-gray-400">$15-20/hr</span>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="w-full px-5 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Early feedback</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Your neighbors are already in</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6">
              <p className="text-sm text-gray-700 leading-relaxed">
                "I needed a reliable sitter for Friday nights. Found someone within a day — she has been with us every week since."
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-9 h-9 rounded-full bg-[#C8FF00] flex items-center justify-center text-lg">🏠</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Sarah M.</p>
                  <p className="text-xs text-gray-400">Parent in Plymouth</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6">
              <p className="text-sm text-gray-700 leading-relaxed">
                "Made $340 last month just doing lawn care on weekends. Way better than working a register."
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-9 h-9 rounded-full bg-[#C8FF00] flex items-center justify-center text-lg">🎓</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Jake R.</p>
                  <p className="text-xs text-gray-400">Junior, Plymouth High</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6">
              <p className="text-sm text-gray-700 leading-relaxed">
                "We needed weekend help at our shop. Posted a job and had 5 applicants by the next morning."
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-9 h-9 rounded-full bg-[#C8FF00] flex items-center justify-center text-lg">💼</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Tom B.</p>
                  <p className="text-xs text-gray-400">Local business owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="w-full px-5 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Free for teens. Always.</h2>
            <p className="mt-3 text-gray-500 text-base max-w-md mx-auto">
              Teens never pay a dime. Employers choose a plan that fits their hiring needs.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12 mt-8">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs text-gray-600 font-medium">
              <span>⚡</span> $5 Urgent Hire badge — top of results for 48hrs
            </div>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs text-gray-600 font-medium">
              <span>⭐</span> $10 Featured Teen Profile — boosted for a week
            </div>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs text-gray-600 font-medium">
              <span>✅</span> $15 Verified Background Check badge
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col rounded-2xl border border-gray-200 p-6 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Free</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">$0</p>
                <p className="text-xs text-gray-400 mt-0.5">forever</p>
              </div>
              <ul className="flex flex-col gap-2 text-sm text-gray-600 flex-1">
                <li className="flex items-start gap-2"><span className="text-[#C8FF00] mt-0.5 font-bold">✓</span>1 active listing</li>
                <li className="flex items-start gap-2"><span className="text-[#C8FF00] mt-0.5 font-bold">✓</span>No application cap</li>
                <li className="flex items-start gap-2"><span className="text-[#C8FF00] mt-0.5 font-bold">✓</span>Basic profile</li>
              </ul>
              <a href="#waitlist" className="text-center text-sm font-medium border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition">
                Get started
              </a>
            </div>

            <div className="flex flex-col rounded-2xl border border-gray-200 p-6 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Starter</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">$29</p>
                <p className="text-xs text-gray-400 mt-0.5">per month</p>
              </div>
              <ul className="flex flex-col gap-2 text-sm text-gray-600 flex-1">
                <li className="flex items-start gap-2"><span className="text-[#C8FF00] mt-0.5 font-bold">✓</span>3 active listings</li>
                <li className="flex items-start gap-2"><span className="text-[#C8FF00] mt-0.5 font-bold">✓</span>Applicant messaging</li>
                <li className="flex items-start gap-2"><span className="text-[#C8FF00] mt-0.5 font-bold">✓</span>Priority placement</li>
              </ul>
              <a href="#waitlist" className="text-center text-sm font-medium border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition">
                Get started
              </a>
            </div>

            <div className="flex flex-col rounded-2xl border-2 border-black p-6 gap-4 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#C8FF00] text-black text-xs font-bold px-3 py-1 rounded-full">Most popular</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Pro</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">$79</p>
                <p className="text-xs text-gray-400 mt-0.5">per month</p>
              </div>
              <ul className="flex flex-col gap-2 text-sm text-gray-600 flex-1">
                <li className="flex items-start gap-2"><span className="text-[#C8FF00] mt-0.5 font-bold">✓</span>Unlimited listings</li>
                <li className="flex items-start gap-2"><span className="text-[#C8FF00] mt-0.5 font-bold">✓</span>Featured placement</li>
                <li className="flex items-start gap-2"><span className="text-[#C8FF00] mt-0.5 font-bold">✓</span>Analytics dashboard</li>
              </ul>
              <a href="#waitlist" className="text-center text-sm font-semibold bg-black text-[#C8FF00] rounded-xl py-2.5 hover:bg-gray-900 transition">
                Get started
              </a>
            </div>

            <div className="flex flex-col rounded-2xl border border-gray-200 p-6 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Agency</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">$149</p>
                <p className="text-xs text-gray-400 mt-0.5">per month</p>
              </div>
              <ul className="flex flex-col gap-2 text-sm text-gray-600 flex-1">
                <li className="flex items-start gap-2"><span className="text-[#C8FF00] mt-0.5 font-bold">✓</span>Multiple locations</li>
                <li className="flex items-start gap-2"><span className="text-[#C8FF00] mt-0.5 font-bold">✓</span>Dedicated support</li>
                <li className="flex items-start gap-2"><span className="text-[#C8FF00] mt-0.5 font-bold">✓</span>Bulk hiring tools</li>
              </ul>
              <a href="#waitlist" className="text-center text-sm font-medium border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition">
                Get started
              </a>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            All paid jobs include SafePay — secure payments with a 5% processing fee. Teens always receive the full agreed amount.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full px-5 py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Common questions</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="font-semibold text-gray-900 mb-2">Is it really free for teens?</p>
              <p className="text-sm text-gray-500">Yes, 100%. Teens never pay anything to create a profile, browse jobs, or apply. Always.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="font-semibold text-gray-900 mb-2">How does SafePay work?</p>
              <p className="text-sm text-gray-500">SafePay lets employers pay securely through the platform. The teen receives the full agreed amount — the small processing fee is covered by the employer side. No surprises.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="font-semibold text-gray-900 mb-2">What age do you have to be?</p>
              <p className="text-sm text-gray-500">Catalyst is built for teens ages 14-21. We follow all applicable child labor laws and require age verification on signup.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="font-semibold text-gray-900 mb-2">Where is Catalyst available?</p>
              <p className="text-sm text-gray-500">We are launching in Plymouth, IN in March 2026 and expanding across Marshall County shortly after. More towns coming fast.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="font-semibold text-gray-900 mb-2">Can businesses post jobs too?</p>
              <p className="text-sm text-gray-500">Absolutely. Local businesses can post on the Free tier and upgrade anytime. Our Pro and Agency plans are built for businesses that hire regularly.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="font-semibold text-gray-900 mb-2">What is the Urgent Hire badge?</p>
              <p className="text-sm text-gray-500">For $5 you can pin your listing to the top of search results for 48 hours — great when you need someone fast.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="w-full px-5 py-24 bg-black">
        <div className="max-w-xl mx-auto flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Your town. Your schedule.<br />Your money.
          </h2>
          <p className="text-gray-400 text-base">
            Join the waitlist and be first to know when Catalyst launches in Plymouth.
          </p>
          <a
            href="#waitlist"
            className="bg-[#C8FF00] text-black font-semibold text-sm px-8 py-3 rounded-full hover:bg-lime-300 transition"
          >
            Get early access
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full px-5 py-10 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-white font-bold text-lg tracking-tight">
            catalyst<span className="text-[#C8FF00]">.</span>
          </span>

          <div className="flex items-center gap-3">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#C8FF00] hover:text-black transition flex items-center justify-center group">
              <svg width="16" height="16" viewBox="0 0 24 24" className="fill-white group-hover:fill-black transition">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#C8FF00] transition flex items-center justify-center group">
              <svg width="16" height="16" viewBox="0 0 24 24" className="fill-white group-hover:fill-black transition">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#C8FF00] transition flex items-center justify-center group">
              <svg width="16" height="16" viewBox="0 0 24 24" className="fill-white group-hover:fill-black transition">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
              </svg>
            </a>
          </div>

          <div className="flex items-center gap-5 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition">Terms</a>
            <span>© 2026 Catalyst</span>
          </div>
        </div>
      </footer>

      {/* MARQUEE ANIMATION */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>

    </main>
  );
}