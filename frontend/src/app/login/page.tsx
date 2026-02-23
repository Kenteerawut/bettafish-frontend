"use client";

import { useState } from "react";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);

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
      {/* 🌫️ FOREST DEPTH BACKGROUND */}
      <div
        className="
        absolute inset-0 -z-10
        bg-[radial-gradient(circle_at_25%_20%,rgba(16,185,129,0.35),transparent_45%),
             radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.25),transparent_55%)]
        animate-[pulse_12s_ease-in-out_infinite]
      "
      />

      {/* 🪵 ANALYZE CARD */}
      <div
        className="
        w-[520px] max-w-[90%] p-10
        rounded-[28px]
        bg-emerald-950/40
        backdrop-blur-2xl
        border border-emerald-400/20
        shadow-[0_0_90px_rgba(16,185,129,0.25)]
        text-center
        transition-all duration-500
      "
      >
        {/* 🌿 HEADER ULTRA */}
        <h1
          className="
          text-3xl md:text-4xl font-bold tracking-wide mb-3
          bg-gradient-to-r from-[#d7fff2] via-[#7cf7d4] to-[#a5f3fc]
          bg-clip-text text-transparent
          drop-shadow-[0_0_25px_rgba(0,255,170,0.55)]
        "
        >
          วิเคราะห์สายพันธุ์ปลากัดด้วย AI
        </h1>

        <p className="text-emerald-200/70 text-sm mb-6">
          ระบบวิเคราะห์ภาพปลากัดอัตโนมัติ
        </p>

        {/* 📂 FILE INPUT */}
        <input
          type="file"
          onChange={(e) =>
            setFile(e.target.files ? e.target.files[0] : null)
          }
          className="
          w-full mb-5 text-sm
          file:mr-4 file:py-2 file:px-4
          file:rounded-xl file:border-0
          file:bg-emerald-400 file:text-black
          hover:file:bg-emerald-300
          "
        />

        {/* 🔍 ANALYZE BUTTON */}
        <button
          className="
          w-full py-3 rounded-2xl
          bg-gradient-to-r from-emerald-400 to-teal-300
          text-black font-semibold
          shadow-[0_0_25px_rgba(0,255,170,0.55)]
          hover:scale-[1.04]
          transition-all duration-300
        "
        >
          🔎 เริ่มวิเคราะห์
        </button>
      </div>
    </main>
  );
}