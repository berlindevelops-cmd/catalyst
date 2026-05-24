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
    let resolved = false;

    async function redirect(session) {
      if (resolved) return;
      resolved = true;

      const { data: profile } = await getSupabase()
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      const role = profile?.role ?? session.user.user_metadata?.role;
      const dashboard = getDashboard(role);
      router.replace(dashboard ?? "/auth/onboarding");
    }

    // Case 1: user hit the back button after OAuth already completed.
    // getSession() returns immediately with the existing session.
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      if (session) redirect(session);
    });

    // Case 2: fresh OAuth — code is being exchanged right now.
    // Supabase fires SIGNED_IN once the exchange finishes.
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) redirect(session);
      }
    );

    // Fallback: if neither fires (bad state, expired code, etc.), don't spin forever
    const timeout = setTimeout(() => {
      if (!resolved) router.replace("/auth/login");
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#fff",
      fontFamily: "system-ui, -apple-system, sans-serif" }}>
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