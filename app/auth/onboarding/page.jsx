"use client";
import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  GraduationCap, Users, Briefcase, Check, ArrowRight,
  ChevronLeft, UserRound, Wrench, CalendarDays,
} from "lucide-react";

const SKILLS = ["Babysitting", "Lawn Care", "Tutoring", "Pet Sitting", "Snow Removal",
  "House Cleaning", "Grocery Help", "Moving Help", "Car Washing", "Dog Walking"];
const AVAILABILITY = ["Weekday mornings", "Weekday afternoons", "Weekday evenings",
  "Weekend mornings", "Weekend afternoons", "Weekend evenings"];

const ROLE_CARDS = [
  { id: "teen",     Icon: GraduationCap, label: "I'm a teen",           sub: "Ages 14–21 · Looking for local gigs" },
  { id: "parent",   Icon: Users,         label: "Parent or household",   sub: "Help around the house, childcare, yard work" },
  { id: "business", Icon: Briefcase,     label: "Local business",        sub: "Hiring part-time or seasonal teen workers" },
];

// How many steps each role has (including the role-picker as step 1)
const TOTAL_STEPS = { teen: 4, parent: 2, business: 2 };

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep]   = useState(1);
  const [role, setRole]   = useState(null);
  const [pressing, setPressing] = useState(null);
  const [mounted, setMounted]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // Teen fields
  const [fullName, setFullName] = useState("");
  const [age, setAge]           = useState("");
  const [bio, setBio]           = useState("");
  const [skills, setSkills]           = useState([]);
  const [availability, setAvailability] = useState([]);

  // Employer/business fields
  const [employerName, setEmployerName]     = useState("");
  const [businessName, setBusinessName]     = useState("");
  const [location, setLocation]             = useState("");

  useEffect(() => { setMounted(true); }, []);

  const total = role ? TOTAL_STEPS[role] : 4;

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

  const pillStyle = (active) => ({
    padding: "9px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500,
    border: active ? "1.5px solid #111" : "1.5px solid #e5e7eb",
    background: active ? "#111" : "#fff",
    color: active ? "#C8FF00" : "#6b7280",
    cursor: "pointer",
    transition: "background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.15s ease",
  });

  function toggleSkill(s) {
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }
  function toggleAvail(s) {
    setAvailability(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) { setError("Not logged in."); setLoading(false); return; }

    const base = role === "teen"
      ? { id: user.id, role: "teen", full_name: fullName,
          age: parseInt(age), bio, skills, availability: availability.join(", ") }
      : { id: user.id, role: role === "business" ? "business" : "employer",
          full_name: employerName, employer_type: role,
          business_name: role === "business" ? businessName : null, location };

    const { error: sbError } = await getSupabase().from("profiles").upsert(base);
    setLoading(false);
    if (sbError) { setError(sbError.message); return; }

    router.push(role === "teen" ? "/dashboard/teen"
      : role === "business" ? "/dashboard/business"
      : "/dashboard/employer");
  }

  // Step header meta
  const stepMeta = (() => {
    if (step === 1) return { Icon: GraduationCap, heading: "Who are you?", sub: "This helps us tailor your experience" };
    if (role === "teen") {
      if (step === 2) return { Icon: UserRound,    heading: "About you",       sub: "Let employers know who you are" };
      if (step === 3) return { Icon: Wrench,        heading: "Your skills",     sub: "Pick everything you can do" };
      if (step === 4) return { Icon: CalendarDays,  heading: "Your availability", sub: "When are you free to work?" };
    }
    return {
      Icon: role === "business" ? Briefcase : Users,
      heading: role === "business" ? "Your business" : "About you",
      sub: "Almost done — just a few details",
    };
  })();

  return (
    <main style={{ minHeight: "100vh", background: "#fff", display: "flex",
      flexDirection: "column", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      <nav style={{ width: "100%", padding: "16px 20px", display: "flex", alignItems: "center",
        justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", boxSizing: "border-box" }}>
        <a href="/" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px",
          color: "#111", textDecoration: "none" }}>
          catalyst<span style={{ color: "#C8FF00" }}>.</span>
        </a>
        <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>
          Step {step} of {total}
        </span>
      </nav>

      {/* Progress bar */}
      <div style={{ width: "100%", height: 3, background: "#f3f4f6" }}>
        <div style={{ height: 3, background: "#C8FF00", width: `${(step / total) * 100}%`,
          transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "64px 20px" }}>
        <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Step header */}
          <div style={{ textAlign: "center", ...fadeUp(0.05) }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f3f4f6",
              display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <stepMeta.Icon size={26} color="#111" strokeWidth={1.75} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: 0, letterSpacing: "-0.4px" }}>
              {stepMeta.heading}
            </h1>
            <p style={{ color: "#9ca3af", marginTop: 6, fontSize: 14 }}>{stepMeta.sub}</p>
          </div>

          {/* ── STEP 1: Role picker ── */}
          {step === 1 && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, ...fadeUp(0.1) }}>
                {ROLE_CARDS.map(({ id, Icon, label, sub }) => {
                  const isSelected = role === id;
                  const isPressing = pressing === id;
                  return (
                    <button key={id}
                      onClick={() => setRole(id)}
                      onMouseDown={() => setPressing(id)}
                      onMouseUp={() => setPressing(null)}
                      onMouseLeave={() => setPressing(null)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 16,
                        padding: "18px 20px", borderRadius: 18,
                        border: isSelected ? "2px solid #111" : "2px solid #e5e7eb",
                        background: isSelected ? "#111" : "#fff",
                        cursor: "pointer", textAlign: "left",
                        position: "relative", overflow: "hidden",
                        transform: isPressing ? "scale(0.975)" : isSelected ? "scale(1.015)" : "scale(1)",
                        transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: isSelected ? "0 8px 32px rgba(0,0,0,0.13)" : "0 1px 4px rgba(0,0,0,0.04)",
                        boxSizing: "border-box",
                      }}>
                      {isSelected && (
                        <span style={{ position: "absolute", inset: 0, pointerEvents: "none",
                          background: "linear-gradient(105deg, transparent 40%, rgba(200,255,0,0.07) 60%, transparent 80%)",
                          animation: "shimmer 1.8s ease infinite" }} />
                      )}
                      <div style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                        background: isSelected ? "rgba(200,255,0,0.15)" : "#f3f4f6",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.2s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                        transform: isSelected ? "rotate(-6deg) scale(1.1)" : "rotate(0deg) scale(1)" }}>
                        <Icon size={22} color={isSelected ? "#C8FF00" : "#6b7280"} strokeWidth={1.75} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: 15, margin: 0,
                          color: isSelected ? "#fff" : "#111", transition: "color 0.2s ease" }}>{label}</p>
                        <p style={{ fontSize: 13, margin: "3px 0 0",
                          color: isSelected ? "rgba(255,255,255,0.5)" : "#9ca3af",
                          transition: "color 0.2s ease" }}>{sub}</p>
                      </div>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                        background: isSelected ? "#C8FF00" : "transparent",
                        border: isSelected ? "none" : "2px solid #e5e7eb",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transform: isSelected ? "scale(1)" : "scale(0.85)",
                        transition: "background 0.2s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border 0.2s ease" }}>
                        {isSelected && <Check size={14} color="#111" strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {error && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>}

              <div style={fadeUp(0.15)}>
                <button
                  onClick={() => { if (!role) { setError("Please select one."); return; } setError(""); setStep(2); }}
                  style={{ width: "100%", background: "#111", color: "#C8FF00", padding: "14px 24px",
                    borderRadius: 14, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "transform 0.15s ease", boxSizing: "border-box" }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}

          {/* ── TEEN STEP 2: About you ── */}
          {step === 2 && role === "teen" && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, ...fadeUp(0.1) }}>
                {[
                  { label: "Full name", placeholder: "Your name", type: "text", value: fullName, onChange: e => setFullName(e.target.value) },
                  { label: "Age", placeholder: "Your age (14–21)", type: "number", value: age, onChange: e => setAge(e.target.value) },
                ].map(field => (
                  <div key={field.label}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder} value={field.value}
                      onChange={field.onChange} min={field.type === "number" ? 14 : undefined}
                      max={field.type === "number" ? 21 : undefined} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#111"}
                      onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    Bio <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea placeholder="Tell employers a bit about yourself..." value={bio}
                    onChange={e => setBio(e.target.value)} rows={3}
                    style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderColor = "#111"}
                    onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                </div>
              </div>
              {error && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>}
              <div style={{ display: "flex", gap: 12, ...fadeUp(0.15) }}>
                <BackButton onClick={() => setStep(1)} />
                <button
                  onClick={() => { if (!fullName || !age) { setError("Name and age are required."); return; } setError(""); setStep(3); }}
                  style={{ flex: 1, background: "#111", color: "#C8FF00", padding: "14px 20px",
                    borderRadius: 14, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "transform 0.15s ease", boxSizing: "border-box" }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}

          {/* ── TEEN STEP 3: Skills ── */}
          {step === 3 && role === "teen" && (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, ...fadeUp(0.1) }}>
                {SKILLS.map(skill => (
                  <button key={skill} onClick={() => toggleSkill(skill)}
                    style={pillStyle(skills.includes(skill))}
                    onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"}
                    onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >{skill}</button>
                ))}
              </div>
              {error && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>}
              <div style={{ display: "flex", gap: 12, ...fadeUp(0.15) }}>
                <BackButton onClick={() => setStep(2)} />
                <button
                  onClick={() => { if (!skills.length) { setError("Pick at least one skill."); return; } setError(""); setStep(4); }}
                  style={{ flex: 1, background: "#111", color: "#C8FF00", padding: "14px 20px",
                    borderRadius: 14, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "transform 0.15s ease", boxSizing: "border-box" }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}

          {/* ── TEEN STEP 4: Availability ── */}
          {step === 4 && role === "teen" && (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, ...fadeUp(0.1) }}>
                {AVAILABILITY.map(slot => (
                  <button key={slot} onClick={() => toggleAvail(slot)}
                    style={pillStyle(availability.includes(slot))}
                    onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"}
                    onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >{slot}</button>
                ))}
              </div>
              {error && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>}
              <div style={{ display: "flex", gap: 12, ...fadeUp(0.15) }}>
                <BackButton onClick={() => setStep(3)} />
                <FinishButton loading={loading} onClick={() => {
                  if (!availability.length) { setError("Pick at least one time slot."); return; }
                  setError(""); handleSubmit();
                }} />
              </div>
            </>
          )}

          {/* ── EMPLOYER/BUSINESS STEP 2: Details ── */}
          {step === 2 && (role === "parent" || role === "business") && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, ...fadeUp(0.1) }}>
                {[
                  { label: "Your name", placeholder: "Full name", value: employerName, onChange: e => setEmployerName(e.target.value) },
                  ...(role === "business" ? [{ label: "Business name", placeholder: "Your business name", value: businessName, onChange: e => setBusinessName(e.target.value) }] : []),
                  { label: "Town / City", placeholder: "e.g. Plymouth, IN", value: location, onChange: e => setLocation(e.target.value) },
                ].map(field => (
                  <div key={field.label}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{field.label}</label>
                    <input type="text" placeholder={field.placeholder} value={field.value}
                      onChange={field.onChange} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#111"}
                      onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                  </div>
                ))}
              </div>
              {error && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>}
              <div style={{ display: "flex", gap: 12, ...fadeUp(0.15) }}>
                <BackButton onClick={() => setStep(1)} />
                <FinishButton loading={loading} onClick={() => {
                  if (!employerName || !location) { setError("Please fill in all fields."); return; }
                  if (role === "business" && !businessName) { setError("Please fill in all fields."); return; }
                  setError(""); handleSubmit();
                }} />
              </div>
            </>
          )}

        </div>
      </div>

      <style>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
      `}</style>
    </main>
  );
}

function BackButton({ onClick }) {
  return (
    <button onClick={onClick}
      style={{ flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 14, padding: "14px 20px",
        fontSize: 14, fontWeight: 500, background: "#fff", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        transition: "background 0.15s ease, transform 0.15s ease", boxSizing: "border-box" }}
      onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "scale(1)"; }}
      onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
      onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
    >
      <ChevronLeft size={16} /> Back
    </button>
  );
}

function FinishButton({ loading, onClick }) {
  return (
    <button onClick={onClick} disabled={loading}
      style={{ flex: 1, background: "#111", color: "#C8FF00", padding: "14px 20px",
        borderRadius: 14, fontWeight: 600, fontSize: 14, border: "none",
        cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "opacity 0.2s ease, transform 0.15s ease", boxSizing: "border-box" }}
      onMouseDown={e => !loading && (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      {loading ? "Saving…" : "Finish"} {!loading && <ArrowRight size={16} />}
    </button>
  );
}