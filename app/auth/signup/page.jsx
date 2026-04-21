"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GraduationCap, Home, Check, ArrowRight } from "lucide-react";

export default function SignupPicker() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [pressing, setPressing] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cards = [
    {
      id: "teen",
      icon: GraduationCap,
      label: "I'm a teen",
      sub: "Ages 14–21 · Flexible local gigs",
      accent: "#C8FF00",
    },
    {
      id: "employer",
      icon: Home,
      label: "I'm a parent or employer",
      sub: "Hiring local teens for jobs or gigs",
      accent: "#C8FF00",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <nav
        style={{
          width: "100%",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f3f4f6",
          boxSizing: "border-box",
        }}
      >
        <a
          href="/"
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.5px",
            color: "#111",
            textDecoration: "none",
          }}
        >
          catalyst<span style={{ color: "#C8FF00" }}>.</span>
        </a>
        <a
          href="/auth/login"
          style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}
        >
          Already have an account?{" "}
          <span style={{ fontWeight: 600, color: "#111" }}>Log in</span>
        </a>
      </nav>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
          }}
        >
          <div
            style={{
              textAlign: "center",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            <h1
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: "#111",
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              Join Catalyst
            </h1>
            <p style={{ color: "#9ca3af", marginTop: 8, fontSize: 14 }}>
              First, tell us who you are
            </p>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {cards.map((card, i) => {
              const Icon = card.icon;
              const isSelected = selected === card.id;
              const isPressing = pressing === card.id;

              return (
                <button
                  key={card.id}
                  onClick={() => setSelected(card.id)}
                  onMouseDown={() => setPressing(card.id)}
                  onMouseUp={() => setPressing(null)}
                  onMouseLeave={() => setPressing(null)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "18px 20px",
                    borderRadius: 18,
                    border: isSelected ? "2px solid #111" : "2px solid #e5e7eb",
                    background: isSelected ? "#111" : "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    position: "relative",
                    overflow: "hidden",
                    opacity: mounted ? 1 : 0,
                    transform: mounted
                      ? isPressing
                        ? "scale(0.975)"
                        : isSelected
                        ? "scale(1.015)"
                        : "scale(1) translateY(0)"
                      : `translateY(${16 + i * 8}px)`,
                    transition: mounted
                      ? "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s ease, background 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease"
                      : `opacity 0.5s ease ${0.1 + i * 0.1}s, transform 0.5s ease ${0.1 + i * 0.1}s`,
                    boxSizing: "border-box",
                    boxShadow: isSelected
                      ? "0 8px 32px rgba(0,0,0,0.13)"
                      : "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  {isSelected && (
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(105deg, transparent 40%, rgba(200,255,0,0.07) 60%, transparent 80%)",
                        animation: "shimmer 1.8s ease infinite",
                        pointerEvents: "none",
                      }}
                    />
                  )}

                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: isSelected ? "rgba(200,255,0,0.15)" : "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background 0.2s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                      transform: isSelected ? "rotate(-6deg) scale(1.1)" : "rotate(0deg) scale(1)",
                    }}
                  >
                    <Icon
                      size={22}
                      color={isSelected ? "#C8FF00" : "#6b7280"}
                      strokeWidth={1.75}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 15,
                        margin: 0,
                        color: isSelected ? "#fff" : "#111",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {card.label}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        marginTop: 3,
                        margin: "3px 0 0",
                        color: isSelected ? "rgba(255,255,255,0.5)" : "#9ca3af",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {card.sub}
                    </p>
                  </div>

                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: isSelected ? "#C8FF00" : "transparent",
                      border: isSelected ? "none" : "2px solid #e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transform: isSelected ? "scale(1)" : "scale(0.85)",
                      transition:
                        "background 0.2s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border 0.2s ease",
                    }}
                  >
                    {isSelected && (
                      <Check size={14} color="#111" strokeWidth={3} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            disabled={!selected}
            onClick={() => router.push(`/auth/signup/${selected}`)}
            style={{
              width: "100%",
              background: selected ? "#111" : "#111",
              color: "#C8FF00",
              padding: "14px 24px",
              borderRadius: 14,
              fontWeight: 600,
              fontSize: 14,
              border: "none",
              cursor: selected ? "pointer" : "not-allowed",
              opacity: selected ? 1 : 0.3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              transition:
                "opacity 0.3s ease, transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
              letterSpacing: "0.01em",
            }}
          >
            Continue
            <ArrowRight
              size={16}
              style={{
                transform: selected ? "translateX(2px)" : "translateX(0)",
                transition: "transform 0.2s ease",
              }}
            />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </main>
  );
}