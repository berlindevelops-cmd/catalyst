"use client";
import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { KeyRound, ArrowRight, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  async function handleSubmit() {
    if (!email) { setError("Please enter your email."); return; }
    setLoading(true);
    setError("");
    const { error: sbError } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setLoading(false);
    if (sbError) { setError(sbError.message); return; }
    setSent(true);
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

  const ctaStyle = (disabled) => ({
    width: "100%", background: "#111", color: "#C8FF00",
    padding: "14px 24px", borderRadius: 14, fontWeight: 600,
    fontSize: 14, border: "none", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1, display: "flex", alignItems: "center",
    justifyContent: "center", gap: 8, letterSpacing: "0.01em",
    transition: "opacity 0.2s ease, transform 0.15s ease",
    boxSizing: "border-box",
  });

  return (
    <main style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <nav style={{ width: "100%", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", boxSizing: "border-box", ...fadeUp(0) }}>
        <a href="/" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px", color: "#111", textDecoration: "none" }}>
          catalyst<span style={{ color: "#C8FF00" }}>.</span>
        </a>
        <a href="/auth/login" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>
          Back to <span style={{ fontWeight: 600, color: "#111" }}>login</span>
        </a>
      </nav>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 20px" }}>
        <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 24 }}>
          {sent ? (
            <>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center", ...fadeUp(0.05) }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Mail size={28} color="#111" strokeWidth={1.75} />
                </div>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: 0, letterSpacing: "-0.4px" }}>Check your email</h1>
                  <p style={{ color: "#9ca3af", marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>
                    We sent a reset link to{" "}
                    <span style={{ fontWeight: 600, color: "#111" }}>{email}</span>.
                    Click the link to set a new password.
                  </p>
                </div>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>
                  Didn't get it? Check your spam or{" "}
                  <button
                    onClick={() => setSent(false)}
                    style={{ background: "none", border: "none", fontSize: 12, color: "#6b7280", cursor: "pointer", textDecoration: "underline", padding: 0 }}
                  >
                    try again
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign: "center", ...fadeUp(0.05) }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f3f4f6", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <KeyRound size={26} color="#111" strokeWidth={1.75} />
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: 0, letterSpacing: "-0.4px" }}>Forgot password?</h1>
                <p style={{ color: "#9ca3af", marginTop: 6, fontSize: 14 }}>Enter your email and we'll send a reset link</p>
              </div>

              <div style={fadeUp(0.1)}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#111"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>

              {error && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>}

              <div style={fadeUp(0.15)}>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={ctaStyle(loading)}
                  onMouseDown={e => !loading && (e.currentTarget.style.transform = "scale(0.98)")}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  {loading ? "Sending..." : "Send reset link"}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}