"use client";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

// pages that don't need any auth handling
const AUTH_PAGES = [
  "/auth/login",
  "/auth/signup",
  "/auth/signup/teen",
  "/auth/signup/employer",
  "/auth/callback",
  "/auth/onboarding/teen",
  "/auth/onboarding/employer",
];

function getDashboard(role) {
  if (role === "teen") return "/dashboard/teen";
  if (role === "business") return "/dashboard/business";
  if (role === "employer") return "/dashboard/employer";
  return null;
}

export default function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // reset redirect flag on path change
    hasRedirected.current = false;

    async function handleAuth() {
      const { data: { session } } = await getSupabase().auth.getSession();

      // not logged in
      if (!session) {
        if (pathname.startsWith("/dashboard")) {
          router.replace("/auth/login");
        }
        return;
      }

      // logged in — get role from profile
      const { data: profile } = await getSupabase()
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const role = profile?.role ?? session.user.user_metadata?.role;
      const dashboard = getDashboard(role);

      if (!dashboard) return;

      // if on landing page or auth pages, send to dashboard
      if (pathname === "/" || AUTH_PAGES.some((p) => pathname.startsWith(p))) {
        if (!hasRedirected.current) {
          hasRedirected.current = true;
          router.replace(dashboard);
        }
        return;
      }

      // if on wrong dashboard, redirect to correct one
      if (pathname.startsWith("/dashboard") && !pathname.startsWith(dashboard)) {
        if (!hasRedirected.current) {
          hasRedirected.current = true;
          router.replace(dashboard);
        }
      }
    }

    handleAuth();
  }, [pathname]);

  // listen for sign in / sign out events
  useEffect(() => {
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const { data: profile } = await getSupabase()
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          const role = profile?.role ?? session.user.user_metadata?.role;
          const dashboard = getDashboard(role);
          if (dashboard && !pathname.startsWith(dashboard)) {
            router.replace(dashboard);
          }
        }

        if (event === "SIGNED_OUT") {
          router.replace("/");
        }

        if (event === "PASSWORD_RECOVERY") {
          router.replace("/auth/reset-password");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return children;
}