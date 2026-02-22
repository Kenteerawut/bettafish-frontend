"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE!;

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    try {
      const r = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const j = await r.json();

      if (!r.ok) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        return;
      }

      localStorage.setItem("token", j.token);
      router.push("/analyze");
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาด");
    }
  };

  return (
    <main
      className="
      relative min-h-screen
      flex flex-col items-center justify-center
      bg-gradient-to-br
      from-black via-emerald-950 to-black
      text-white overflow-hidden
      "
    >
      {/* 🌫️ FOREST DEPTH ULTRA BACKGROUND */}
      <div
        className="
        absolute inset-0 -z-10
        bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.25),transparent_40%)]
        bg-[radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.15),transparent_50%)]
        animate-[pulse_12s_ease-in-out_infinite]
      "
      />

      {/* 🌿 CINEMATIC HEADER */}
      <h1
        className="
        text-4xl md:text-5xl font-extrabold mb-10 tracking-wide
        bg-gradient-to-r from-emerald-200 via-teal-300 to-cyan-300
        bg-clip-text text-transparent
        drop-shadow-[0_0_25px_rgba(45,212,191,0.8)]
      "
      >
        วิเคราะห์ปลากัดด้วย AI
      </h1>

      {/* 🪵 FOREST CARD */}
      <div
        className="
        w-[360px] p-8
        rounded-[30px]
        bg-emerald-950/40
        backdrop-blur-2xl
        border border-emerald-400/20
        shadow-[0_0_80px_rgba(16,185,129,0.25)]
        text-center
        hover:shadow-[0_0_110px_rgba(16,185,129,0.35)]
        transition-all duration-500
      "
      >
        <p className="text-emerald-200/70 text-sm mb-6">
          ระบบวิเคราะห์สายพันธุ์ปลากัดอัจฉริยะ
        </p>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="
          w-full mb-3 px-4 py-2 rounded-xl
          bg-black/40
          border border-emerald-400/20
          text-white
          placeholder:text-white/40
          outline-none
          focus:border-emerald-300
          focus:shadow-[0_0_10px_rgba(16,185,129,0.5)]
        "
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="
          w-full mb-3 px-4 py-2 rounded-xl
          bg-black/40
          border border-emerald-400/20
          text-white
          placeholder:text-white/40
          outline-none
          focus:border-emerald-300
          focus:shadow-[0_0_10px_rgba(16,185,129,0.5)]
        "
        />

        {error && (
          <div className="text-red-400 text-sm mb-3">{error}</div>
        )}

        {/* 🔥 AI BUTTON ULTRA */}
        <button
          onClick={submit}
          className="
          w-full py-3 rounded-2xl
          bg-gradient-to-r from-emerald-400 to-teal-400
          text-black font-semibold
          hover:scale-[1.05]
          shadow-[0_0_20px_rgba(16,185,129,0.6)]
          transition-all duration-300
        "
        >
          เข้าสู่ระบบ
        </button>

        <div className="text-sm text-emerald-200/70 mt-4">
          ยังไม่มีบัญชี ?
          <a href="/register" className="text-emerald-300 ml-1 hover:underline">
            สมัครสมาชิก
          </a>
        </div>
      </div>
    </main>
  );
}