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

export default function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function handleAuth() {
      const { data: { session } } = await getSupabase().auth.getSession();

      // not logged in + trying to access dashboard = send to login
      if (!session) {
        if (pathname.startsWith("/dashboard")) {
          router.replace("/auth/login");
        }
        return;
      }

      // logged in + trying to hit login or signup = send to their dashboard
      const isAuthPage =
        pathname.startsWith("/auth/login") ||
        pathname.startsWith("/auth/signup");

      if (!isAuthPage) return; // landing page, dashboard, anywhere else = do nothing

      const { data: profile } = await getSupabase()
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const role = profile?.role ?? session.user.user_metadata?.role;
      const dashboard = getDashboard(role);
      if (dashboard) router.replace(dashboard);
    }

    handleAuth();
  }, [pathname]);

  useEffect(() => {
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") router.replace("/");
        if (event === "PASSWORD_RECOVERY") router.replace("/auth/reset-password");
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  return children;
}