"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div
      className="
      fixed top-0 left-0 right-0 z-50
      backdrop-blur-xl bg-white/70
      border-b border-gray-200
      shadow-sm
      "
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">

        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="font-bold text-indigo-600 text-lg cursor-pointer"
        >
          🐟 Betta AI
        </div>

        {/* Buttons */}
        <div className="flex gap-2">

          <button
            onClick={() => router.back()}
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
          >
            ← ย้อนกลับ
          </button>

          <button
            onClick={() => router.push("/")}
            className="px-3 py-1 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 text-sm"
          >
            หน้าแรก
          </button>

          {!token && (
            <button
              onClick={() => router.push("/login")}
              className="px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 text-sm"
            >
              Login
            </button>
          )}

          {token && (
            <button
              onClick={logout}
              className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
