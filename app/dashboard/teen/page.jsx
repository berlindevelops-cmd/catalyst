"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function TeenDashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) return;
      const { data } = await getSupabase()
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(data);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0">

      {/* welcome banner */}
      <div className="w-full bg-black rounded-2xl px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[#C8FF00] text-sm font-semibold mb-1">Welcome back</p>
          <h1 className="text-2xl font-bold text-white">
            Hey {profile?.full_name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Find your next gig in Plymouth
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
            <p className="text-white text-xl font-bold">0</p>
            <p className="text-gray-400 text-xs mt-0.5">Applications</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
            <p className="text-white text-xl font-bold">0</p>
            <p className="text-gray-400 text-xs mt-0.5">Jobs saved</p>
          </div>
        </div>
      </div>

      {/* skills chips */}
      {profile?.skills?.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Your skills</p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 bg-black text-[#C8FF00] text-xs font-semibold rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* jobs placeholder */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Jobs near you</p>
        <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-4xl">🔍</span>
          <p className="text-gray-500 text-sm font-medium">Jobs are loading soon</p>
          <p className="text-gray-400 text-xs">Check back once employers start posting</p>
        </div>
      </div>
    </div>
  );
}