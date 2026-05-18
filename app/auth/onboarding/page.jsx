"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserRound, Users, Briefcase, ArrowRight } from "lucide-react";

const ROLES = [
  { id: "teen",     Icon: UserRound, label: "I'm a teen",            sub: "Looking for local jobs and gigs" },
  { id: "employer", Icon: Users,     label: "I'm a parent / family", sub: "Looking to hire help around the house" },
  { id: "business", Icon: Briefcase, label: "I'm a business",        sub: "Hiring part-time or seasonal workers" },
];

export default function OnboardingPicker() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [pressing, setPressing] = useState(null);
  const [mounted, setMounted]   = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => setMounted(true), []);

  function handleContinue() {
    if (!selected) { setError("Pick one to continue."); return; }
    if (selected === "teen") router.push("/auth/onboarding/teen");
    else                     router.push("/auth/onboarding/employer");
  }

  const fadeUp = (delay = 0) => ({
    opacity:   mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.45s ease ${delay}s, transform 0.45s ease ${delay}s`,
  });

  return (
    <main style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <nav style={{ width: "100%", padding: "16px 20px", borderBottom: "1px solid #f3f4f6", boxSizing: "border-box" }}>
        <a href="/" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px", color: "#111", textDecoration: "none" }}>
          catalyst<span style={{ color: "#C8FF00" }}>.</span>
        </a>
      </nav>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 20px" }}>
        <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 24 }}>

          <div style={{ textAlign: "center", ...fadeUp(0.05) }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: 0, letterSpacing: "-0.4px" }}>Who are you?</h1>
            <p style={{ color: "#9ca3af", marginTop: 6, fontSize: 14 }}>This helps us set up the right experience for you.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, ...fadeUp(0.1) }}>
            {ROLES.map(({ id, Icon, label, sub }) => {
              const isSelected  = selected  === id;
              const isPressing  = pressing  === id;
              return (
                <button
                  key={id}
                  onClick={() => setSelected(id)}
                  onMouseDown={() => setPressing(id)}
                  onMouseUp={() => setPressing(null)}
                  onMouseLeave={() => setPressing(null)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 16,
                    padding: "18px 20px", borderRadius: 18, textAlign: "left",
                    border: isSelected ? "2px solid #111" : "2px solid #e5e7eb",
                    background: isSelected ? "#111" : "#fff",
                    cursor: "pointer", position: "relative", overflow: "hidden",
                    transform: isPressing ? "scale(0.975)" : isSelected ? "scale(1.015)" : "scale(1)",
                    transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s, background 0.2s, box-shadow 0.2s",
                    boxShadow: isSelected ? "0 8px 32px rgba(0,0,0,0.13)" : "0 1px 4px rgba(0,0,0,0.04)",
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: isSelected ? "rgba(200,255,0,0.15)" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)", transform: isSelected ? "rotate(-6deg) scale(1.1)" : "scale(1)" }}>
                    <Icon size={22} color={isSelected ? "#C8FF00" : "#6b7280"} strokeWidth={1.75} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 15, margin: 0, color: isSelected ? "#fff" : "#111", transition: "color 0.2s" }}>{label}</p>
                    <p style={{ fontSize: 13, margin: "3px 0 0", color: isSelected ? "rgba(255,255,255,0.5)" : "#9ca3af", transition: "color 0.2s" }}>{sub}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {error && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>}

          <div style={fadeUp(0.15)}>
            <button
              onClick={handleContinue}
              style={{ width: "100%", background: "#111", color: "#C8FF00", padding: "14px 24px", borderRadius: 14, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "transform 0.15s ease", boxSizing: "border-box" }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}