"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export default function BusinessDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setUser(user);
      const { data: profile } = await getSupabase()
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (!profile) { router.push("/auth/onboarding/employer"); return; }
      if (profile.role === "employer") {
        router.push("/dashboard/employer");
        return;
      }
      setProfile(profile);
    }
    loadUser();
  }, []);

  async function handleSignOut() {
    await getSupabase().auth.signOut();
    router.push("/");
  }

  const navItems = [
    { label: "Dashboard", href: "/dashboard/business", emoji: "📊" },
    { label: "Post Job", href: "/dashboard/business/post", emoji: "➕" },
    { label: "Applicants", href: "/dashboard/business/applicants", emoji: "📬" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="sticky top-0 z-50 w-full bg-black border-b border-white/10 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-lg font-bold tracking-tight text-white">
            catalyst<span className="text-[#C8FF00]">.</span>
          </a>
          <span className="text-xs font-bold bg-[#C8FF00] text-black px-2 py-0.5 rounded-full">
            Business
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                pathname === item.href
                  ? "bg-[#C8FF00] text-black"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.emoji} {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C8FF00] text-black flex items-center justify-center text-xs font-bold">
              {profile?.business_name?.[0]?.toUpperCase() ?? "B"}
            </div>
            <span className="text-sm font-medium text-white">
              {profile?.business_name ?? profile?.full_name ?? "Business"}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs text-gray-400 hover:text-white transition border border-white/20 px-3 py-1.5 rounded-lg"
          >
            Sign out
          </button>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-5xl mx-auto px-5 py-8">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 px-2 py-2 flex items-center justify-around z-50">
        {navItems.map((item) => (
         <a
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition ${
              pathname === item.href ? "text-[#C8FF00]" : "text-gray-500"
            }`}
          >
            <span className="text-xl">{item.emoji}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}