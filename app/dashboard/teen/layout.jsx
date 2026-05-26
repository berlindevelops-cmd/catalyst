"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import MessagingPopup from "@/components/MessagingPopup";

// Icons
const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

const DocumentTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
  </svg>
);

const UserCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ArrowRightOnRectangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

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

      // ✅ Load from cache instantly — no flash
      const cached = localStorage.getItem(`profile:${user.id}`);
      if (cached) setProfile(JSON.parse(cached));

      // Then fetch fresh from Supabase in the background
      const { data: profile, error } = await getSupabase()
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        router.push("/onboarding");
        return;
      }

      // ✅ Update cache and state with fresh data
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
    { label: "Browse Jobs", href: "/dashboard/teen", Icon: BriefcaseIcon },
    { label: "Applications", href: "/dashboard/teen/applications", Icon: DocumentTextIcon },
    { label: "Profile", href: "/dashboard/teen/profile", Icon: UserCircleIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Top nav */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <a href="/" className="text-lg font-bold tracking-tight text-gray-900">
          catalyst<span className="text-[#C8FF00]">.</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ label, href, Icon }) => (
            <a
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
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-black text-[#C8FF00] flex items-center justify-center text-xs font-bold">
              {profile?.full_name?.[0]?.toUpperCase() ?? "T"}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {profile?.full_name ?? "Teen"}
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
            <a
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-5 py-1.5 rounded-xl transition ${
                active ? "text-black" : "text-gray-400"
              }`}
            >
              <span className={`${active ? "text-black" : "text-gray-400"}`}>
                <Icon />
              </span>
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
              {active && (
                <span className="w-1 h-1 rounded-full bg-[#C8FF00] mt-0.5" />
              )}
            </a>
          );
        })}
      </nav>

      <MessagingPopup userId={user?.id} />
    </div>
  );
}