"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

function getDashboard(role) {
  if (role === "teen") return "/dashboard/teen";
  if (role === "business") return "/dashboard/business";
  if (role === "employer") return "/dashboard/employer";
  return null;
}

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Don't call getSession() immediately — with PKCE flow, Supabase hasn't
    // exchanged the ?code param yet. Wait for the SIGNED_IN event instead,
    // which fires only after the exchange completes successfully.
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(
      async (event, session) => {
        if (event !== "SIGNED_IN" || !session) return;

        // Unsubscribe immediately so we don't double-fire
        subscription.unsubscribe();

        const { data: profile } = await getSupabase()
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        const role = profile?.role ?? session.user.user_metadata?.role;
        const dashboard = getDashboard(role);

        if (dashboard) {
          router.replace(dashboard);
          return;
        }

        // New user — read the role they picked before OAuth and send to
        // the right onboarding. Falls back to employer if nothing was stored.
        const pendingRole = localStorage.getItem("pendingRole") ?? "employer";
        localStorage.removeItem("pendingRole");
        router.replace(`/auth/onboarding/${pendingRole}`);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif",
      background: "#fff" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%",
          border: "3px solid #f3f4f6", borderTopColor: "#111",
          animation: "spin 0.7s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#9ca3af", fontSize: 14 }}>Signing you in…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}