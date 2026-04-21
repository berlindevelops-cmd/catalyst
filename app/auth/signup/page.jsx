"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Home, Check } from "lucide-react";

export default function SignupPicker() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <nav className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <a href="/" className="text-xl font-bold tracking-tight text-gray-900">
          catalyst<span className="text-[#C8FF00]">.</span>
        </a>
        <a href="/auth/login" className="text-sm text-gray-500 hover:text-gray-900 transition">
          Already have an account? <span className="font-semibold text-black">Log in</span>
        </a>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-16">
        <div className="w-full max-w-md flex flex-col items-center gap-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Join Catalyst</h1>
            <p className="text-gray-500 mt-2 text-sm">First, tell us who you are</p>
          </div>

          <div className="w-full flex flex-col gap-4">
            <button
              onClick={() => setSelected("teen")}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition text-left ${
                selected === "teen"
                  ? "border-black bg-black text-white"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${
                selected === "teen" ? "bg-white/10" : "bg-gray-100"
              }`}>
                <GraduationCap
                  size={22}
                  className={selected === "teen" ? "text-white" : "text-gray-600"}
                  strokeWidth={1.75}
                />
              </div>
              <div>
                <p className="font-semibold text-base">I am a teen</p>
                <p className={`text-sm mt-0.5 ${selected === "teen" ? "text-gray-300" : "text-gray-400"}`}>
                  Ages 14–21 · Looking for flexible local gigs
                </p>
              </div>
              {selected === "teen" && (
                <span className="ml-auto">
                  <Check size={18} className="text-[#C8FF00]" strokeWidth={2.5} />
                </span>
              )}
            </button>

            <button
              onClick={() => setSelected("employer")}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition text-left ${
                selected === "employer"
                  ? "border-black bg-black text-white"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${
                selected === "employer" ? "bg-white/10" : "bg-gray-100"
              }`}>
                <Home
                  size={22}
                  className={selected === "employer" ? "text-white" : "text-gray-600"}
                  strokeWidth={1.75}
                />
              </div>
              <div>
                <p className="font-semibold text-base">I am a parent or employer</p>
                <p className={`text-sm mt-0.5 ${selected === "employer" ? "text-gray-300" : "text-gray-400"}`}>
                  Hiring local teens for jobs or gigs
                </p>
              </div>
              {selected === "employer" && (
                <span className="ml-auto">
                  <Check size={18} className="text-[#C8FF00]" strokeWidth={2.5} />
                </span>
              )}
            </button>
          </div>

          <button
            disabled={!selected}
            onClick={() => router.push(`/auth/signup/${selected}`)}
            className="w-full bg-black text-[#C8FF00] py-3 rounded-xl font-semibold text-sm hover:bg-gray-900 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}