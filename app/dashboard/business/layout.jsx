"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

// ─── Icons ───────────────────────────────────────────────────────────────────
const LayoutDashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const InboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

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

      // Load from cache instantly to prevent flash
      const cached = localStorage.getItem(`profile:${user.id}`);
      if (cached) setProfile(JSON.parse(cached));

      const { data: profile, error } = await getSupabase()
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !profile) { router.push("/auth/onboarding/business"); return; }
      if (profile.role === "employer") { router.push("/dashboard/employer"); return; }

      localStorage.setItem(`profile:${user.id}`, JSON.stringify(profile));
      setProfile(profile);
    }
    loadUser();
  }, []);

  async function handleSignOut() {
    const { data: { user } } = await getSupabase().auth.getUser();
    if (user) localStorage.removeItem(`profile:${user.id}`);
    await getSupabase().auth.signOut();
    router.push("/");
  }

  const navItems = [
    { label: "Dashboard", href: "/dashboard/business", Icon: LayoutDashboardIcon },
    { label: "Post Job",   href: "/dashboard/business/post", Icon: PlusIcon },
    { label: "Applicants", href: "/dashboard/business/applicants", Icon: InboxIcon },
    { label: "Profile",    href: "/dashboard/business/profile", Icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 w-full bg-black border-b border-white/10 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-bold tracking-tight text-white">
            catalyst<span className="text-[#C8FF00]">.</span>
          </Link>
          <span className="text-xs font-bold bg-[#C8FF00] text-black px-2 py-0.5 rounded-full tracking-wide">
            Business
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ label, href, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                pathname === href
                  ? "bg-[#C8FF00] text-black"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon />
              {label}
            </Link>
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
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition border border-white/20 px-3 py-1.5 rounded-lg"
          >
            <LogOutIcon />
            Sign out
          </button>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-5xl mx-auto px-5 py-8">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 px-2 py-2 flex items-center justify-around z-50">
        {navItems.map(({ label, href, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition ${
                active ? "text-[#C8FF00]" : "text-gray-500"
              }`}
            >
              <Icon />
              <span className="text-xs font-medium">{label}</span>
              {active && <span className="w-1 h-1 rounded-full bg-[#C8FF00]" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}