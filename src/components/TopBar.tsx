"use client";

import { useRouter, usePathname } from "next/navigation";

export default function TopBar() {
  const router = useRouter();
  const path = usePathname();

  const isActive = (p: string) =>
    path === p ? "text-indigo-700" : "text-gray-600";

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto h-14 px-4 flex items-center justify-between">
        <div
          className="font-semibold tracking-wide text-indigo-700 cursor-pointer"
          onClick={() => router.push("/")}
        >
          BettaFish
        </div>

        <nav className="flex gap-4 text-sm font-medium">
          <button
            onClick={() => router.push("/")}
            className={`hover:text-indigo-700 ${isActive("/")}`}
          >
            Analyze
          </button>
          <button
            onClick={() => router.push("/records")}
            className={`hover:text-indigo-700 ${isActive("/records")}`}
          >
            Records
          </button>
          <button
            onClick={logout}
            className="text-gray-600 hover:text-red-600"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
