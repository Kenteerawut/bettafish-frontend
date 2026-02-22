"use client";

export default function ForestBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">

      {/* base forest */}
      <div className="absolute inset-0 bg-stone-950" />

      {/* mist glow */}
      <div className="
        absolute inset-0 blur-3xl opacity-40
        bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.25),transparent_40%)]
        animate-pulse
      " />

      <div className="
        absolute inset-0 blur-3xl opacity-30
        bg-[radial-gradient(circle_at_80%_70%,rgba(45,212,191,0.25),transparent_45%)]
        animate-pulse
      " />

    </div>
  );
}