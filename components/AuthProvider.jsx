"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/auth/signup/teen",
  "/auth/signup/employer",
  "/auth/callback",
];

export default function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await getSupabase().auth.getSession();

      if (!session) {
        // not logged in — if trying to access dashboard, redirect to login
        if (pathname.startsWith("/dashboard")) {
          router.push("/auth/login");
        }
        return;
      }

      // logged in — get their profile to know their role
      const { data: profile } = await getSupabase()
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const role = profile?.role ?? session.user.user_metadata?.role;

      // if they hit the landing page or any auth page while logged in
      // send them straight to their dashboard
      if (
        pathname === "/" ||
        pathname.startsWith("/auth/login") ||
        pathname.startsWith("/auth/signup")
      ) {
        // in checkSession and onAuthStateChange, replace the role redirect with:
        if (role === "teen") {
          router.push("/dashboard/teen");
        } else if (role === "business") {
          router.push("/dashboard/business");
        } else if (role === "employer") {
          router.push("/dashboard/employer");
        }
      }
    }
    checkSession();

    // listen for auth state changes (login/logout)
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const { data: profile } = await getSupabase()
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          const role = profile?.role ?? session.user.user_metadata?.role;

          if (role === "teen") {
            router.push("/dashboard/teen");
          } else if (role === "employer") {
            router.push("/dashboard/employer");
          }
        }

        if (event === "SIGNED_OUT") {
          router.push("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [pathname]);

  return children;
}