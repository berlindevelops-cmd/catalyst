"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

function getDashboard(role) {
  if (role === "teen") return "/dashboard/teen";
  if (role === "business") return "/dashboard/business";
  if (role === "employer") return "/dashboard/employer";
  return null;
}

const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_PAGE_PREFIXES = ["/auth/login", "/auth/signup"];

export default function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // One-time check on mount only — NOT on every pathname change.
  // This prevents a Supabase round-trip on every client-side navigation.
  useEffect(() => {
    async function init() {
      const { data: { session } } = await getSupabase().auth.getSession();

      // Not logged in: boot them off protected pages
      if (!session) {
        if (PROTECTED_PREFIXES.some(p => pathname.startsWith(p))) {
          router.replace("/auth/login");
        }
        return;
      }

      // Logged in but on an auth page (login/signup): send to dashboard
      if (AUTH_PAGE_PREFIXES.some(p => pathname.startsWith(p))) {
        const { data: profile } = await getSupabase()
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        const role = profile?.role ?? session.user.user_metadata?.role;
        const dashboard = getDashboard(role);
        router.replace(dashboard ?? "/auth/onboarding/employer");
      }
    }

    init();
  }, []); // Empty deps — run once on mount only

  // Subscription handles runtime auth state changes (sign-out, etc.)
  useEffect(() => {
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          router.replace("/");
          return;
        }

        if (event === "PASSWORD_RECOVERY") {
          router.replace("/auth/reset-password");
          return;
        }

        // SIGNED_IN fires after OAuth. Let /auth/callback handle that redirect
        // entirely — don't compete with it here.
        if (event === "SIGNED_IN") {
          const isOnCallback = window.location.pathname.startsWith("/auth/callback");
          const isOnAuthPage = AUTH_PAGE_PREFIXES.some(p =>
            window.location.pathname.startsWith(p)
          );

          // Only redirect if we're somewhere unexpected (e.g. mid-session
          // token refresh on a dashboard page) — not during the OAuth flow
          if (!isOnCallback && !isOnAuthPage) return;

          if (isOnCallback) return; // Callback handles its own redirect

          // On a login/signup page after SIGNED_IN (e.g. email confirm link)
          const { data: profile } = await getSupabase()
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .maybeSingle();

          const role = profile?.role ?? session.user.user_metadata?.role;
          const dashboard = getDashboard(role);
          router.replace(dashboard ?? "/auth/onboarding/employer");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return children;
}