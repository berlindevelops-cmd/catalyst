"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { PLANS, PLAN_FEATURES, BOOSTS } from "@/lib/stripe";
import { useRouter, useSearchParams } from "next/navigation";

export default function Billing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) return;

      const { data: profileData } = await getSupabase()
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      const { data: sub } = await getSupabase()
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setSubscription(sub ?? { plan: "free", status: "active" });
      setLoading(false);
    }
    load();

    if (searchParams.get("upgraded")) {
      setTimeout(() => load(), 2000);
    }
  }, []);

  async function handleCheckout(type, plan = null, boostType = null, jobId = null) {
    setCheckoutLoading(plan ?? boostType);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, plan, boostType, jobId }),
    });
    const data = await res.json();
    setCheckoutLoading(null);
    if (data.url) window.location.href = data.url;
  }

  const currentPlan = subscription?.plan ?? "free";
  const currentFeatures = PLAN_FEATURES[currentPlan];
  const dashboardPath = profile?.role === "business" ? "/dashboard/business" : "/dashboard/employer";

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your subscription and boosts</p>
      </div>

      {/* current plan */}
      <div className="bg-black rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[#C8FF00] text-xs font-bold uppercase tracking-widest mb-1">Current plan</p>
          <h2 className="text-2xl font-bold text-white capitalize">{currentPlan}</h2>
          {subscription?.current_period_end && (
            <p className="text-gray-400 text-xs mt-1">
              Renews {new Date(subscription.current_period_end).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric"
              })}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(currentFeatures).map(([key, val]) => (
            <span key={key} className={`text-xs px-3 py-1.5 rounded-full font-medium ${
              val === true || (typeof val === "number" && val > 1)
                ? "bg-[#C8FF00] text-black"
                : "bg-white/10 text-gray-400"
            }`}>
              {key === "maxListings" ? `${val === 999 ? "Unlimited" : val} listings` :
               key === "messaging" ? "Messaging" :
               key === "priorityPlacement" ? "Priority" :
               key === "analytics" ? "Analytics" : "Bulk hiring"}
            </span>
          ))}
        </div>
      </div>

      {/* upgrade plans */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Plans</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(PLANS).map(([key, plan]) => {
            const isCurrent = currentPlan === key;
            const isUpgrade = plan.price > (PLANS[currentPlan]?.price ?? 0);
            const features = PLAN_FEATURES[key];

            return (
              <div key={key} className={`flex flex-col rounded-2xl border p-5 gap-4 relative ${
                key === "pro" ? "border-2 border-black" : "border-gray-200"
              }`}>
                {key === "pro" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#C8FF00] text-black text-xs font-bold px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest capitalize">{key}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </p>
                  {plan.price > 0 && <p className="text-xs text-gray-400">per month</p>}
                </div>

                <ul className="flex flex-col gap-1.5 flex-1 text-xs text-gray-600">
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#C8FF00] font-bold">✓</span>
                    {features.maxListings === 999 ? "Unlimited" : features.maxListings} listing{features.maxListings !== 1 ? "s" : ""}
                  </li>
                  <li className={`flex items-center gap-1.5 ${!features.messaging ? "text-gray-300" : ""}`}>
                    <span className={features.messaging ? "text-[#C8FF00] font-bold" : "text-gray-300"}>
                      {features.messaging ? "✓" : "✕"}
                    </span>
                    Messaging
                  </li>
                  <li className={`flex items-center gap-1.5 ${!features.priorityPlacement ? "text-gray-300" : ""}`}>
                    <span className={features.priorityPlacement ? "text-[#C8FF00] font-bold" : "text-gray-300"}>
                      {features.priorityPlacement ? "✓" : "✕"}
                    </span>
                    Priority placement
                  </li>
                  <li className={`flex items-center gap-1.5 ${!features.analytics ? "text-gray-300" : ""}`}>
                    <span className={features.analytics ? "text-[#C8FF00] font-bold" : "text-gray-300"}>
                      {features.analytics ? "✓" : "✕"}
                    </span>
                    Analytics
                  </li>
                  <li className={`flex items-center gap-1.5 ${!features.bulkHiring ? "text-gray-300" : ""}`}>
                    <span className={features.bulkHiring ? "text-[#C8FF00] font-bold" : "text-gray-300"}>
                      {features.bulkHiring ? "✓" : "✕"}
                    </span>
                    Bulk hiring
                  </li>
                </ul>

                {isCurrent ? (
                  <div className="w-full text-center text-xs font-medium text-gray-400 py-2.5 rounded-xl bg-gray-100">
                    Current plan
                  </div>
                ) : plan.price === 0 ? null : (
                  <button
                    onClick={() => handleCheckout("subscription", key)}
                    disabled={checkoutLoading === key}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition ${
                      key === "pro"
                        ? "bg-black text-[#C8FF00] hover:bg-gray-900"
                        : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                    } disabled:opacity-50`}
                  >
                    {checkoutLoading === key ? "Loading..." : isUpgrade ? "Upgrade" : "Switch"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* one-time boosts */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">One-time boosts</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(BOOSTS).map(([key, boost]) => (
            <div key={key} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
              <div>
                <p className="text-2xl font-bold text-gray-900">${boost.price}</p>
                <p className="font-semibold text-gray-900 mt-1">{boost.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {key === "urgent_hire" && "Pin your listing to the top for 48 hours"}
                  {key === "featured_profile" && "Highlight your profile to employers for a week"}
                  {key === "background_check" && "Add a verified background check badge"}
                </p>
              </div>
              <button
                onClick={() => handleCheckout("boost", null, key)}
                disabled={checkoutLoading === key}
                className="w-full bg-black text-[#C8FF00] py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-900 transition disabled:opacity-50"
              >
                {checkoutLoading === key ? "Loading..." : `Buy for $${boost.price}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}