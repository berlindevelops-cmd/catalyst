"use client";
import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function TeenSignup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleUser, setGoogleUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) { setCheckingSession(false); setMounted(true); return; }

      const { data: profile } = await getSupabase()
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role) {
        router.push(`/dashboard/${profile.role}`);
      } else {
        setGoogleUser(user);
        setEmail(user.email);
        setCheckingSession(false);
        setMounted(true);
      }
    }
    checkSession();
  }, []);

  async function handleGoogleSignup() {
    await getSupabase().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/signup/teen` },
    });
  }

  async function handleEmailSignup() {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setError("");
    const { data, error: sbError } = await getSupabase().auth.signUp({
      email,
      password,
      options: { data: { role: "teen" } },
    });
    setLoading(false);
    if (sbError) { setError(sbError.message); return; }
    if (data.user) router.push("/auth/onboarding/teen");
  }

  async function handleGoogleContinue() {
    setLoading(true);
    await getSupabase().auth.updateUser({ data: { role: "teen" } });
    setLoading(false);
    router.push("/auth/onboarding/teen");
  }

  if (checkingSession) {
    return (
      <main style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 24, height: 24, border: "2.5px solid #111",
          borderTopColor: "#C8FF00", borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  const fadeUp = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.45s ease ${delay}s, transform 0.45s ease ${delay}s`,
  });

  return (
    <main style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <nav style={{ width: "100%", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", boxSizing: "border-box", ...fadeUp(0) }}>
        <a href="/" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px", color: "#111", textDecoration: "none" }}>
          catalyst<span style={{ color: "#C8FF00" }}>.</span>
        </a>
        <a href="/auth/login" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>
          Already have an account?{" "}
          <span style={{ fontWeight: 600, color: "#111" }}>Log in</span>
        </a>
      </nav>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 20px" }}>
        <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 24 }}>

          <div style={{ textAlign: "center", ...fadeUp(0.05) }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: "#f3f4f6",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              marginBottom: 14,
              transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
              <GraduationCap size={26} color="#111" strokeWidth={1.75} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: 0, letterSpacing: "-0.4px" }}>
              Create your account
            </h1>
            <p style={{ color: "#9ca3af", marginTop: 6, fontSize: 14 }}>
              Start finding gigs in your area
            </p>
          </div>

          {googleUser ? (
            <>
              <div style={{ ...fadeUp(0.1), display: "flex", alignItems: "center", gap: 12, border: "1.5px solid #e5e7eb", borderRadius: 14, padding: "14px 16px", background: "#fafafa" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#111", color: "#C8FF00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {googleUser.email?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111", margin: 0 }}>{googleUser.email}</p>
                  <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>Connected with Google</p>
                </div>
              </div>

              {error && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>}

              <div style={fadeUp(0.15)}>
                <button
                  onClick={handleGoogleContinue}
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
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  {loading ? "Continuing..." : "Continue"}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </div>

              <button
                onClick={async () => { await getSupabase().auth.signOut(); setGoogleUser(null); setEmail(""); }}
                style={{ background: "none", border: "none", fontSize: 12, color: "#9ca3af", cursor: "pointer", textAlign: "center", transition: "color 0.2s ease" }}
                onMouseEnter={e => e.currentTarget.style.color = "#6b7280"}
                onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
              >
                Use a different account
              </button>
            </>
          ) : (
            <>
              <div style={fadeUp(0.1)}>
                <button
                  onClick={handleGoogleSignup}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 10, border: "1.5px solid #e5e7eb", borderRadius: 14, padding: "13px 20px",
                    fontSize: 14, fontWeight: 500, background: "#fff", cursor: "pointer",
                    transition: "background 0.15s ease, border-color 0.15s ease, transform 0.15s ease",
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#d1d5db"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, ...fadeUp(0.15) }}>
                <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
                <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>OR</span>
                <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, ...fadeUp(0.2) }}>
                {[
                  { label: "Email", type: "email", placeholder: "you@example.com", value: email, onChange: (e) => setEmail(e.target.value), onKeyDown: undefined },
                  { label: "Password", type: "password", placeholder: "Min. 6 characters", value: password, onChange: (e) => setPassword(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleEmailSignup() },
                ].map((field) => (
                  <div key={field.label}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={field.onChange}
                      onKeyDown={field.onKeyDown}
                      style={{
                        width: "100%", padding: "12px 16px", borderRadius: 12,
                        border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none",
                        transition: "border-color 0.2s ease", boxSizing: "border-box",
                        background: "#fff", color: "#111",
                      }}
                      onFocus={e => e.target.style.borderColor = "#111"}
                      onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                    />
                  </div>
                ))}
              </div>

              {error && (
                <p style={{ fontSize: 12, color: "#ef4444", margin: 0, ...fadeUp(0) }}>
                  {error}
                </p>
              )}

              <div style={fadeUp(0.25)}>
                <button
                  onClick={handleEmailSignup}
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
                  {loading ? "Creating account..." : "Create account"}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </div>

              <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", margin: 0, ...fadeUp(0.3) }}>
                By signing up you agree to our{" "}
                <a href="#" style={{ color: "#6b7280", textDecoration: "underline" }}>Terms</a> and{" "}
                <a href="#" style={{ color: "#6b7280", textDecoration: "underline" }}>Privacy Policy</a>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}