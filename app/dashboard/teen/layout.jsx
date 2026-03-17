"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export default function TeenDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

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
      setProfile(profile);
    }
    loadUser();
  }, []);

  async function handleSignOut() {
    await getSupabase().auth.signOut();
    router.push("/");
  }

  const navItems = [
    { label: "Browse Jobs", href: "/dashboard/teen", emoji: "🔍" },
    { label: "My Applications", href: "/dashboard/teen/applications", emoji: "📬" },
    { label: "My Profile", href: "/dashboard/teen/profile", emoji: "👤" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* top nav */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <a href="/" className="text-lg font-bold tracking-tight text-gray-900">
          catalyst<span className="text-[#C8FF00]">.</span>
        </a>

        {/* desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                pathname === item.href
                  ? "bg-black text-[#C8FF00]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.emoji} {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black text-[#C8FF00] flex items-center justify-center text-xs font-bold">
              {profile?.full_name?.[0]?.toUpperCase() ?? "T"}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {profile?.full_name ?? "Teen"}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs text-gray-400 hover:text-gray-600 transition border border-gray-200 px-3 py-1.5 rounded-lg"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* page content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-5 py-8">
        {children}
      </main>

      {/* mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 flex items-center justify-around z-50">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition ${
              pathname === item.href ? "text-black" : "text-gray-400"
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