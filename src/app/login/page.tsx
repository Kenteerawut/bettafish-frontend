"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API, hasApiBase } from "@/lib/apiConfig";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    if (!hasApiBase) {
      setError("ไม่พบ URL ของ API (NEXT_PUBLIC_API_BASE) กรุณาตั้งค่าใน .env.local");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const j = await r.json().catch(() => ({}));

      if (!r.ok) {
        setError(
          j?.message ||
            j?.error ||
            (r.status === 401 ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : "เข้าสู่ระบบไม่สำเร็จ")
        );
        return;
      }

      if (j?.token) {
        localStorage.setItem("token", j.token);
        router.replace("/analyze");
        return;
      }

      setError("เข้าสู่ระบบไม่สำเร็จ");
    } catch (e) {
      console.error("Login fetch error:", e);
      setError(
        "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ — ตรวจสอบว่า (1) Backend รันอยู่ (2) NEXT_PUBLIC_API_BASE ใน .env.local ถูกต้อง (เช่น http://localhost:3001)"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="
      relative min-h-screen
      flex items-center justify-center
      bg-gradient-to-br
      from-black via-emerald-950 to-black
      text-white overflow-hidden
      "
    >
      <div
        className="
        absolute inset-0 -z-10
        bg-[radial-gradient(circle_at_25%_20%,rgba(16,185,129,0.35),transparent_45%),
             radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.25),transparent_55%)]
        animate-[pulse_12s_ease-in-out_infinite]
      "
      />

      <div
        className="
        w-[420px] max-w-[90%] p-10
        rounded-[28px]
        bg-emerald-950/40
        backdrop-blur-2xl
        border border-emerald-400/20
        shadow-[0_0_90px_rgba(16,185,129,0.25)]
        transition-all duration-500
      "
      >
        <h1
          className="
          text-2xl md:text-3xl font-bold tracking-wide mb-2 text-center
          bg-gradient-to-r from-[#d7fff2] via-[#7cf7d4] to-[#a5f3fc]
          bg-clip-text text-transparent
          "
        >
          BettaFish
        </h1>
        <p className="text-emerald-200/70 text-sm mb-6 text-center">
          เข้าสู่ระบบเพื่อวิเคราะห์ปลากัด
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-1">
              อีเมล
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full rounded-xl border border-emerald-400/30
                px-4 py-3 bg-emerald-950/60 text-white
                placeholder-emerald-400/50
                focus:outline-none focus:ring-2 focus:ring-emerald-400
              "
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-1">
              รหัสผ่าน
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full rounded-xl border border-emerald-400/30
                px-4 py-3 bg-emerald-950/60 text-white
                placeholder-emerald-400/50
                focus:outline-none focus:ring-2 focus:ring-emerald-400
              "
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-red-300 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-2xl
              bg-gradient-to-r from-emerald-400 to-teal-300
              text-black font-semibold
              shadow-[0_0_25px_rgba(16,185,129,0.55)]
              hover:scale-[1.02] disabled:opacity-70 disabled:scale-100
              transition-all duration-300
            "
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-emerald-200/70">
          ยังไม่มีบัญชี?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-emerald-300 underline hover:text-emerald-200"
          >
            สมัครสมาชิก
          </button>
        </p>
      </div>
    </main>
  );
}
