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
    async function handleCallback() {
      // Supabase automatically exchanges the `code` param for a session
      // when detectSessionInUrl is true (the default). We just need to
      // wait briefly for it to complete, then read the session.
      const { data: { session }, error } = await getSupabase().auth.getSession();

      if (error || !session) {
        router.replace("/auth/login");
        return;
      }

      // Check if this user already has a profile with a role
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
        // New Google user — send to onboarding type selection.
        // The onboarding page will create the profile with the chosen role.
        router.replace("/auth/onboarding/employer"); // or a role-picker page
      }
    }

    handleCallback();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#fff",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "3px solid #f3f4f6",
            borderTopColor: "#111",
            animation: "spin 0.7s linear infinite",
            margin: "0 auto 16px",
          }}
        />
        <p style={{ color: "#9ca3af", fontSize: 14 }}>Signing you in…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}