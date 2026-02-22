"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // 🌌 FOREST DEPTH ULTRA — detect scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const menu = [
    { name: "Analyze", href: "/analyze" },
    { name: "Records", href: "/records" },
  ];

  return (
    <nav
      className={`
      sticky top-0 z-50
      backdrop-blur-xl
      border-b border-emerald-400/20
      transition-all duration-500

      ${
        scrolled
          ? "bg-emerald-950/70 shadow-[0_0_35px_rgba(16,185,129,0.35)]"
          : "bg-emerald-950/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
      }
      `}
    >
      {/* 🌫️ forest glow layer */}
      <div
        className="
        absolute inset-0 -z-10 opacity-70
        bg-[radial-gradient(circle_at_10%_50%,rgba(16,185,129,0.25),transparent_40%)]
        animate-[pulse_12s_ease-in-out_infinite]
      "
      />

      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">

        {/* 🌿 LOGO — aura pulse */}
        <Link
          href="/"
          className="
          font-bold text-lg tracking-wide
          bg-gradient-to-r from-emerald-200 via-teal-300 to-cyan-300
          bg-clip-text text-transparent
          drop-shadow-[0_0_10px_rgba(45,212,191,0.7)]
          hover:scale-105
          transition-all
          animate-[pulse_6s_ease-in-out_infinite]
          "
        >
          BettaFish
        </Link>

        {/* 🌱 MENU */}
        <div className="flex items-center gap-6 text-sm font-medium">
          {menu.map((m) => {
            const active = pathname.startsWith(m.href);

            return (
              <Link
                key={m.href}
                href={m.href}
                className={`
                relative px-1 py-1
                transition-all duration-300

                ${
                  active
                    ? "text-emerald-200"
                    : "text-emerald-100/70 hover:text-emerald-200"
                }

                hover:drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]
                `}
              >
                {m.name}

                {/* 🌿 active energy line */}
                {active && (
                  <span
                    className="
                    absolute -bottom-1 left-0 w-full h-[2px]
                    bg-gradient-to-r from-emerald-300 to-teal-300
                    rounded-full
                    shadow-[0_0_12px_rgba(45,212,191,0.9)]
                    "
                  />
                )}

                {/* 🌌 depth glow on hover */}
                <span
                  className="
                  absolute inset-0 rounded-lg opacity-0
                  hover:opacity-100
                  bg-emerald-400/10 blur-md
                  transition-all duration-300 -z-10
                  "
                />
              </Link>
            );
          })}

          {/* 🔥 LOGOUT */}
          <Link
            href="/logout"
            className="
            px-3 py-1.5 rounded-lg
            bg-emerald-400/20
            text-emerald-100
            hover:bg-emerald-400/30
            hover:shadow-[0_0_14px_rgba(16,185,129,0.7)]
            transition-all duration-300
            "
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}