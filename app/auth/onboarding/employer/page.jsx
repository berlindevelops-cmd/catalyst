"use client";
import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Users, Briefcase, Check, ArrowRight, ChevronLeft, HandHelping } from "lucide-react";

export default function EmployerOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [employerType, setEmployerType] = useState(null);
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [pressing, setPressing] = useState(null);

  useEffect(() => { setMounted(true); }, []);

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) { setError("Not logged in."); setLoading(false); return; }
    const { error: sbError } = await getSupabase().from("profiles").upsert({
      id: user.id,
      role: employerType === "business" ? "business" : "employer",
      full_name: fullName,
      employer_type: employerType,
      business_name: employerType === "business" ? businessName : null,
      location,
    });
    setLoading(false);
    if (sbError) { setError(sbError.message); return; }
    router.push(employerType === "business" ? "/dashboard/business" : "/dashboard/employer");
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

  const typeCards = [
    { id: "parent", Icon: Users, label: "Parent or household", sub: "Help around the house, childcare, or yard work" },
    { id: "business", Icon: Briefcase, label: "Local business", sub: "Hiring part-time or seasonal teen workers" },
  ];

  const stepIcon = step === 1
    ? <HandHelping size={26} color="#111" strokeWidth={1.75} />
    : employerType === "business"
      ? <Briefcase size={26} color="#111" strokeWidth={1.75} />
      : <Users size={26} color="#111" strokeWidth={1.75} />;

  return (
    <main style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <nav style={{ width: "100%", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", boxSizing: "border-box" }}>
        <a href="/" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px", color: "#111", textDecoration: "none" }}>
          catalyst<span style={{ color: "#C8FF00" }}>.</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>Step {step} of 2</span>
          <button
            onClick={() => router.push(employerType === "business" ? "/dashboard/business" : "/dashboard/employer")}
            style={{ background: "none", border: "none", fontSize: 12, color: "#9ca3af", cursor: "pointer", textDecoration: "underline" }}
          >
            Skip for now
          </button>
        </div>
      </nav>

      <div style={{ width: "100%", height: 3, background: "#f3f4f6" }}>
        <div style={{ height: 3, background: "#C8FF00", width: `${(step / 2) * 100}%`, transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 20px" }}>
        <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 24 }}>

          <div style={{ textAlign: "center", ...fadeUp(0.05) }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f3f4f6", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              {stepIcon}
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: 0, letterSpacing: "-0.4px" }}>
              {step === 1 ? "Who are you?" : employerType === "business" ? "Your business" : "About you"}
            </h1>
            <p style={{ color: "#9ca3af", marginTop: 6, fontSize: 14 }}>
              {step === 1 ? "This helps us tailor your experience" : "Almost done — just a few details"}
            </p>
          </div>

          {step === 1 && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, ...fadeUp(0.1) }}>
                {typeCards.map(({ id, Icon, label, sub }, i) => {
                  const isSelected = employerType === id;
                  const isPressing = pressing === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setEmployerType(id)}
                      onMouseDown={() => setPressing(id)}
                      onMouseUp={() => setPressing(null)}
                      onMouseLeave={() => setPressing(null)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 16,
                        padding: "18px 20px", borderRadius: 18,
                        border: isSelected ? "2px solid #111" : "2px solid #e5e7eb",
                        background: isSelected ? "#111" : "#fff",
                        cursor: "pointer", textAlign: "left", position: "relative", overflow: "hidden",
                        transform: isPressing ? "scale(0.975)" : isSelected ? "scale(1.015)" : "scale(1)",
                        transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: isSelected ? "0 8px 32px rgba(0,0,0,0.13)" : "0 1px 4px rgba(0,0,0,0.04)",
                        boxSizing: "border-box",
                      }}
                    >
                      {isSelected && (
                        <span style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 40%, rgba(200,255,0,0.07) 60%, transparent 80%)", animation: "shimmer 1.8s ease infinite", pointerEvents: "none" }} />
                      )}
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: isSelected ? "rgba(200,255,0,0.15)" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)", transform: isSelected ? "rotate(-6deg) scale(1.1)" : "rotate(0deg) scale(1)" }}>
                        <Icon size={22} color={isSelected ? "#C8FF00" : "#6b7280"} strokeWidth={1.75} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: 15, margin: 0, color: isSelected ? "#fff" : "#111", transition: "color 0.2s ease" }}>{label}</p>
                        <p style={{ fontSize: 13, margin: "3px 0 0", color: isSelected ? "rgba(255,255,255,0.5)" : "#9ca3af", transition: "color 0.2s ease" }}>{sub}</p>
                      </div>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: isSelected ? "#C8FF00" : "transparent", border: isSelected ? "none" : "2px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transform: isSelected ? "scale(1)" : "scale(0.85)", transition: "background 0.2s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border 0.2s ease" }}>
                        {isSelected && <Check size={14} color="#111" strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {error && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>}

              <div style={fadeUp(0.15)}>
                <button
                  onClick={() => { if (!employerType) { setError("Please select one."); return; } setError(""); setStep(2); }}
                  style={{ width: "100%", background: "#111", color: "#C8FF00", padding: "14px 24px", borderRadius: 14, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "transform 0.15s ease", boxSizing: "border-box" }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, ...fadeUp(0.1) }}>
                {[
                  { label: "Your name", placeholder: "Full name", value: fullName, onChange: (e) => setFullName(e.target.value) },
                  ...(employerType === "business" ? [{ label: "Business name", placeholder: "Your business name", value: businessName, onChange: (e) => setBusinessName(e.target.value) }] : []),
                  { label: "Town / City", placeholder: "e.g. Plymouth, IN", value: location, onChange: (e) => setLocation(e.target.value) },
                ].map((field) => (
                  <div key={field.label}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={field.onChange}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#111"}
                      onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                    />
                  </div>
                ))}
              </div>

              {error && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>}

              <div style={{ display: "flex", gap: 12, ...fadeUp(0.15) }}>
                <button
                  onClick={() => setStep(1)}
                  style={{ flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 14, padding: "14px 20px", fontSize: 14, fontWeight: 500, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "background 0.15s ease, transform 0.15s ease", boxSizing: "border-box" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "scale(1)"; }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  onClick={() => { if (!fullName || !location) { setError("Please fill in all fields."); return; } setError(""); handleSubmit(); }}
                  disabled={loading}
                  style={{ flex: 1, background: "#111", color: "#C8FF00", padding: "14px 20px", borderRadius: 14, fontWeight: 600, fontSize: 14, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "opacity 0.2s ease, transform 0.15s ease", boxSizing: "border-box" }}
                  onMouseDown={e => !loading && (e.currentTarget.style.transform = "scale(0.98)")}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  {loading ? "Saving..." : "Finish"} {!loading && <ArrowRight size={16} />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
    </main>
  );
}