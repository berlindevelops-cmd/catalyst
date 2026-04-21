"use client";
import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { UserRound, Wrench, CalendarDays, ArrowRight, ChevronLeft } from "lucide-react";

const SKILLS = ["Babysitting", "Lawn Care", "Tutoring", "Pet Sitting", "Snow Removal", "House Cleaning", "Grocery Help", "Moving Help", "Car Washing", "Dog Walking"];
const AVAILABILITY = ["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Weekend mornings", "Weekend afternoons", "Weekend evenings"];

const STEP_META = [
  { Icon: UserRound, heading: "About you", sub: "Let employers know who you are" },
  { Icon: Wrench, heading: "Your skills", sub: "Pick everything you can do" },
  { Icon: CalendarDays, heading: "Your availability", sub: "When are you free to work?" },
];

export default function TeenOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  function toggleSkill(skill) {
    setSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
  }

  function toggleAvailability(slot) {
    setAvailability((prev) => prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]);
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) { setError("Not logged in."); setLoading(false); return; }
    const { error: sbError } = await getSupabase().from("profiles").upsert({
      id: user.id, role: "teen", full_name: fullName,
      age: parseInt(age), bio, skills, availability: availability.join(", "),
    });
    if (sbError) { setError(sbError.message); setLoading(false); return; }
    let retries = 0;
    while (retries < 10) {
      const { data: check } = await getSupabase().from("profiles").select("id").eq("id", user.id).single();
      if (check?.id) { router.push("/dashboard/teen"); return; }
      await new Promise((res) => setTimeout(res, 400));
      retries++;
    }
    router.push("/dashboard/teen");
  }

  const fadeUp = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.45s ease ${delay}s, transform 0.45s ease ${delay}s`,
  });

  const { Icon, heading, sub } = STEP_META[step - 1];

  const pillBase = (active) => ({
    padding: "9px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500,
    border: active ? "1.5px solid #111" : "1.5px solid #e5e7eb",
    background: active ? "#111" : "#fff",
    color: active ? "#C8FF00" : "#6b7280",
    cursor: "pointer",
    transition: "background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.15s ease",
  });

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 12,
    border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none",
    transition: "border-color 0.2s ease", boxSizing: "border-box",
    background: "#fff", color: "#111",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <nav style={{ width: "100%", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", boxSizing: "border-box" }}>
        <a href="/" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px", color: "#111", textDecoration: "none" }}>
          catalyst<span style={{ color: "#C8FF00" }}>.</span>
        </a>
        <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>Step {step} of 3</span>
      </nav>

      <div style={{ width: "100%", height: 3, background: "#f3f4f6" }}>
        <div style={{ height: 3, background: "#C8FF00", width: `${(step / 3) * 100}%`, transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 20px" }}>
        <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 24 }}>

          <div style={{ textAlign: "center", ...fadeUp(0.05) }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f3f4f6", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Icon size={26} color="#111" strokeWidth={1.75} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: 0, letterSpacing: "-0.4px" }}>{heading}</h1>
            <p style={{ color: "#9ca3af", marginTop: 6, fontSize: 14 }}>{sub}</p>
          </div>

          {step === 1 && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, ...fadeUp(0.1) }}>
                {[
                  { label: "Full name", placeholder: "Your name", type: "text", value: fullName, onChange: (e) => setFullName(e.target.value) },
                  { label: "Age", placeholder: "Your age (14–21)", type: "number", value: age, onChange: (e) => setAge(e.target.value) },
                ].map((field) => (
                  <div key={field.label}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder} value={field.value} onChange={field.onChange} min={field.type === "number" ? 14 : undefined} max={field.type === "number" ? 21 : undefined}
                      style={inputStyle} onFocus={e => e.target.style.borderColor = "#111"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    Bio <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea
                    placeholder="Tell employers a bit about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderColor = "#111"}
                    onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>
              </div>
              {error && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>}
              <div style={fadeUp(0.15)}>
                <button
                  onClick={() => { if (!fullName || !age) { setError("Name and age are required."); return; } setError(""); setStep(2); }}
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
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, ...fadeUp(0.1) }}>
                {SKILLS.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    style={pillBase(skills.includes(skill))}
                    onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"}
                    onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {error && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>}
              <div style={{ display: "flex", gap: 12, ...fadeUp(0.15) }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 14, padding: "14px 20px", fontSize: 14, fontWeight: 500, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "background 0.15s ease, transform 0.15s ease", boxSizing: "border-box" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"} onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "scale(1)"; }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                ><ChevronLeft size={16} /> Back</button>
                <button onClick={() => { if (skills.length === 0) { setError("Pick at least one skill."); return; } setError(""); setStep(3); }}
                  style={{ flex: 1, background: "#111", color: "#C8FF00", padding: "14px 20px", borderRadius: 14, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "transform 0.15s ease", boxSizing: "border-box" }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >Continue <ArrowRight size={16} /></button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, ...fadeUp(0.1) }}>
                {AVAILABILITY.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => toggleAvailability(slot)}
                    style={pillBase(availability.includes(slot))}
                    onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"}
                    onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {error && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>}
              <div style={{ display: "flex", gap: 12, ...fadeUp(0.15) }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 14, padding: "14px 20px", fontSize: 14, fontWeight: 500, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "background 0.15s ease, transform 0.15s ease", boxSizing: "border-box" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"} onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "scale(1)"; }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                ><ChevronLeft size={16} /> Back</button>
                <button
                  onClick={() => { if (availability.length === 0) { setError("Pick at least one time slot."); return; } setError(""); handleSubmit(); }}
                  disabled={loading}
                  style={{ flex: 1, background: "#111", color: "#C8FF00", padding: "14px 20px", borderRadius: 14, fontWeight: 600, fontSize: 14, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "opacity 0.2s ease, transform 0.15s ease", boxSizing: "border-box" }}
                  onMouseDown={e => !loading && (e.currentTarget.style.transform = "scale(0.98)")} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >{loading ? "Saving..." : "Finish"} {!loading && <ArrowRight size={16} />}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}