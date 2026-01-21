"use client";

function Fish({
  src,
  className,
  duration = 36,
  delay = 0,
  scale = 0.55,
  flip = false,
}: {
  src: string;
  className?: string;
  duration?: number;
  delay?: number;
  scale?: number;
  flip?: boolean;
}) {
  return (
    <div
      className={`absolute animate-betta-swim ${className || ""}`}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
      aria-hidden
    >
      <img
        src={src}
        alt=""
        className="select-none"
        style={{
          transform: `scale(${scale}) ${flip ? "scaleX(-1)" : ""}`,
          filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.25))",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default function BettaBackground() {
  return (
    // 🔴 จุดสำคัญ: fixed + z-10
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
      <Fish
        src="/betta/betta-fish.gif"
        className="top-[20%] -left-[40%]"
        duration={40}
        scale={0.6}
      />

      <Fish
        src="/betta/betta-fish.gif"
        className="top-[60%] -left-[55%]"
        duration={52}
        delay={10}
        scale={0.5}
        flip
      />
    </div>
  );
}
