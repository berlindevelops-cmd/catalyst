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

const AUTH_PAGES = ["/auth/login", "/auth/signup"];
const ONBOARDING_PAGES = ["/auth/onboarding"];

export default function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function handleAuth() {
      const {
        data: { session },
      } = await getSupabase().auth.getSession();

      // --- Not logged in ---
      if (!session) {
        // Protect dashboard and onboarding pages
        if (
          pathname.startsWith("/dashboard") ||
          ONBOARDING_PAGES.some((p) => pathname.startsWith(p))
        ) {
          router.replace("/auth/login");
        }
        return;
      }

      // --- Logged in ---

      // Let the callback page do its own thing — don't interfere
      if (pathname.startsWith("/auth/callback")) return;

      const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

      // On login/signup pages while logged in → redirect to their dashboard
      if (isAuthPage) {
        const { data: profile } = await getSupabase()
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        const role = profile?.role ?? session.user.user_metadata?.role;
        const dashboard = getDashboard(role);

        if (dashboard) {
          router.replace(dashboard);
        } else {
          // Logged in but no role yet — send to onboarding
          router.replace("/auth/onboarding/employer");
        }
        return;
      }

      // On a dashboard page, verify they actually have a role
      // (catches edge cases where profile write failed)
      if (pathname.startsWith("/dashboard")) {
        const { data: profile } = await getSupabase()
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        const role = profile?.role ?? session.user.user_metadata?.role;

        if (!role) {
          router.replace("/auth/onboarding/employer");
          return;
        }

        // Make sure they're on the right dashboard for their role
        const dashboard = getDashboard(role);
        if (dashboard && !pathname.startsWith(dashboard)) {
          router.replace(dashboard);
        }
      }
    }

    handleAuth();
  }, [pathname]);

  useEffect(() => {
    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        router.replace("/");
        return;
      }

      if (event === "PASSWORD_RECOVERY") {
        router.replace("/auth/reset-password");
        return;
      }

      // After OAuth completes, Supabase fires SIGNED_IN.
      // /auth/callback handles the redirect — don't double-redirect here.
      if (event === "SIGNED_IN" && !window.location.pathname.startsWith("/auth/callback")) {
        const { data: profile } = await getSupabase()
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        const role = profile?.role ?? session.user.user_metadata?.role;
        const dashboard = getDashboard(role);

        if (dashboard) {
          router.replace(dashboard);
        } else {
          router.replace("/auth/onboarding/employer");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return children;
}