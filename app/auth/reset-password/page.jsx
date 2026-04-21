"use client";
import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LockKeyhole, ArrowRight } from "lucide-react";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        setMounted(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleReset() {
    if (!password || !confirm) { setError("Please fill in both fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    setError("");
    const { error: sbError } = await getSupabase().auth.updateUser({ password });
    setLoading(false);
    if (sbError) { setError(sbError.message); return; }
    const { data: { user } } = await getSupabase().auth.getUser();
    const { data: profile } = await getSupabase().from("profiles").select("role").eq("id", user.id).single();
    const role = profile?.role;
    if (role === "teen") router.replace("/dashboard/teen");
    else if (role === "business") router.replace("/dashboard/business");
    else router.replace("/dashboard/employer");
  }

  const fadeUp = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.45s ease ${delay}s, transform 0.45s ease ${delay}s`,
  });

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 12,
    border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none",
    transition: "border-color 0.2s ease", boxSizing: "border-box",
    background: "#fff", color: "#111",
  };

  const Nav = () => (
    <nav style={{ width: "100%", padding: "16px 20px", display: "flex", alignItems: "center", borderBottom: "1px solid #f3f4f6", boxSizing: "border-box" }}>
      <a href="/" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px", color: "#111", textDecoration: "none" }}>
        catalyst<span style={{ color: "#C8FF00" }}>.</span>
      </a>
    </nav>
  );

  if (!ready) {
    return (
      <main style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <Nav />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ width: 24, height: 24, border: "2.5px solid #111", borderTopColor: "#C8FF00", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          <p style={{ fontSize: 14, color: "#9ca3af" }}>Verifying your reset link...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Nav />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 20px" }}>
        <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 24 }}>

          <div style={{ textAlign: "center", ...fadeUp(0.05) }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f3f4f6", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <LockKeyhole size={26} color="#111" strokeWidth={1.75} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: 0, letterSpacing: "-0.4px" }}>Set new password</h1>
            <p style={{ color: "#9ca3af", marginTop: 6, fontSize: 14 }}>Choose a strong password for your account</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, ...fadeUp(0.1) }}>
            {[
              { label: "New password", placeholder: "Min. 6 characters", value: password, onChange: (e) => setPassword(e.target.value), onKeyDown: undefined },
              { label: "Confirm password", placeholder: "Repeat your password", value: confirm, onChange: (e) => setConfirm(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleReset() },
            ].map((field) => (
              <div key={field.label}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{field.label}</label>
                <input
                  type="password"
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={field.onChange}
                  onKeyDown={field.onKeyDown}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#111"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>
            ))}
          </div>

          {error && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>}

          <div style={fadeUp(0.15)}>
            <button
              onClick={handleReset}
              disabled={loading}
              style={{
                width: "100%", background: "#111", color: "#C8FF00",
                padding: "14px 24px", borderRadius: 14, fontWeight: 600,
                fontSize: 14, border: "none", cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8, letterSpacing: "0.01em",
                transition: "opacity 0.2s ease, transform 0.15s ease",
                boxSizing: "border-box",
              }}
              onMouseDown={e => !loading && (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              {loading ? "Updating..." : "Update password"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}