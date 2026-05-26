"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import MessagingPopup from "@/components/MessagingPopup";

// ─── Icons ────────────────────────────────────────────────────────────────────
const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const InboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
  </svg>
);

const UserCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ArrowRightOnRectangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function EmployerDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      // Read from cache instantly — no flash
      const cached = localStorage.getItem(`profile:${user.id}`);
      if (cached) { setProfile(JSON.parse(cached)); setUser(user); }

      const { data: profile } = await getSupabase()
        .from("profiles").select("*").eq("id", user.id).single();

      if (!profile) { router.push("/auth/onboarding/employer"); return; }
      if (profile.role === "business") { router.push("/dashboard/business"); return; }

      localStorage.setItem(`profile:${user.id}`, JSON.stringify(profile));
      setProfile(profile);
      setUser(user);
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
    { label: "My Jobs",    href: "/dashboard/employer",            Icon: BriefcaseIcon },
    { label: "Post a Job", href: "/dashboard/employer/post",       Icon: PlusIcon },
    { label: "Applicants", href: "/dashboard/employer/applicants", Icon: InboxIcon },
    { label: "Profile",    href: "/dashboard/employer/profile",    Icon: UserCircleIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Top nav */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
          catalyst<span className="text-[#C8FF00]">.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ label, href, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                pathname === href
                  ? "bg-black text-[#C8FF00]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon />
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-black text-[#C8FF00] flex items-center justify-center text-xs font-bold">
              {profile?.full_name?.[0]?.toUpperCase() ?? "E"}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {profile?.business_name ?? profile?.full_name ?? "Employer"}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition border border-gray-200 px-3 py-1.5 rounded-lg"
          >
            <ArrowRightOnRectangleIcon />
            Sign out
          </button>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-5 py-8">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 flex items-center justify-around z-50">
        {navItems.map(({ label, href, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition ${
                active ? "text-black" : "text-gray-400"
              }`}
            >
              <Icon />
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
              {active && <span className="w-1 h-1 rounded-full bg-[#C8FF00] mt-0.5" />}
            </Link>
          );
        })}
      </nav>

      <MessagingPopup userId={user?.id} />
    </div>
  );
}